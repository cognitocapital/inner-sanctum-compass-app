import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface ScanUpload {
  id: string;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  scan_kind: "image" | "dicom" | "nifti";
  label: string | null;
  opacity: number;
  signedUrl?: string;
}

export interface ScanMarker {
  id: string;
  upload_id: string | null;
  region_id: string | null;
  position_x: number;
  position_y: number;
  position_z: number;
  severity: "noted" | "mild" | "moderate" | "severe";
  note: string | null;
}

const BUCKET = "brain-scans";
const MAX_BYTES = 25 * 1024 * 1024;

/**
 * Owner-only persistence for personal brain-scan uploads + amber markers.
 * - Signed-in users: scans land in the private `brain-scans` bucket scoped
 *   to their user-id folder; metadata + markers persist in their own tables.
 * - Guest users: returns no-op handlers so the parent component can fall
 *   back to local-only behaviour.
 */
export function useBrainScanUploads() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<ScanUpload[]>([]);
  const [markers, setMarkers] = useState<ScanMarker[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setUploads([]);
      setMarkers([]);
      return;
    }
    setLoading(true);
    try {
      const [{ data: uploadRows, error: uErr }, { data: markerRows, error: mErr }] =
        await Promise.all([
          supabase
            .from("brain_scan_uploads")
            .select("id, storage_path, original_filename, mime_type, scan_kind, label, opacity")
            .order("created_at", { ascending: false }),
          supabase
            .from("brain_scan_markers")
            .select("id, upload_id, region_id, position_x, position_y, position_z, severity, note")
            .order("created_at", { ascending: false }),
        ]);
      if (uErr) throw uErr;
      if (mErr) throw mErr;

      // Sign URLs for all uploads (1h)
      const withUrls: ScanUpload[] = await Promise.all(
        (uploadRows ?? []).map(async (u) => {
          const { data: signed } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(u.storage_path, 60 * 60);
          return { ...u, signedUrl: signed?.signedUrl } as ScanUpload;
        })
      );
      setUploads(withUrls);
      setMarkers((markerRows ?? []) as ScanMarker[]);
    } catch (err) {
      console.error("[brain-scan] refresh failed", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadFile = useCallback(
    async (file: File, label?: string): Promise<ScanUpload | null> => {
      if (!user) {
        toast({
          title: "Sign in to save your scan",
          description: "We can keep using it just for this session — nothing leaves your device.",
        });
        return null;
      }
      if (file.size > MAX_BYTES) {
        toast({ title: "File too large", description: "Max 25 MB.", variant: "destructive" });
        return null;
      }
      const lower = file.name.toLowerCase();
      const isDicom = lower.endsWith(".dcm") || file.type === "application/dicom";
      const isNifti = lower.endsWith(".nii") || lower.endsWith(".nii.gz");
      const kind: ScanUpload["scan_kind"] = isDicom ? "dicom" : isNifti ? "nifti" : "image";
      const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type || undefined, upsert: false });
      if (upErr) {
        toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
        return null;
      }

      const { data: row, error: insErr } = await supabase
        .from("brain_scan_uploads")
        .insert({
          user_id: user.id,
          storage_path: path,
          original_filename: file.name,
          mime_type: file.type || null,
          scan_kind: kind,
          label: label ?? null,
          opacity: 0.7,
        })
        .select("id, storage_path, original_filename, mime_type, scan_kind, label, opacity")
        .single();
      if (insErr || !row) {
        toast({ title: "Couldn't save scan record", description: insErr?.message, variant: "destructive" });
        return null;
      }
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
      const finalRow: ScanUpload = { ...(row as ScanUpload), signedUrl: signed?.signedUrl };
      setUploads((prev) => [finalRow, ...prev]);
      toast({ title: "Scan saved privately", description: "Only you can see it." });
      return finalRow;
    },
    [user]
  );

  const deleteUpload = useCallback(
    async (uploadId: string) => {
      if (!user) return;
      const target = uploads.find((u) => u.id === uploadId);
      if (!target) return;
      await supabase.storage.from(BUCKET).remove([target.storage_path]);
      await supabase.from("brain_scan_uploads").delete().eq("id", uploadId);
      setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      setMarkers((prev) => prev.filter((m) => m.upload_id !== uploadId));
    },
    [user, uploads]
  );

  const updateOpacity = useCallback(
    async (uploadId: string, opacity: number) => {
      const clamped = Math.max(0, Math.min(1, opacity));
      setUploads((prev) => prev.map((u) => (u.id === uploadId ? { ...u, opacity: clamped } : u)));
      if (!user) return;
      await supabase.from("brain_scan_uploads").update({ opacity: clamped }).eq("id", uploadId);
    },
    [user]
  );

  const addMarker = useCallback(
    async (input: Omit<ScanMarker, "id">): Promise<ScanMarker | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("brain_scan_markers")
        .insert({ ...input, user_id: user.id })
        .select("id, upload_id, region_id, position_x, position_y, position_z, severity, note")
        .single();
      if (error || !data) {
        toast({ title: "Couldn't save marker", variant: "destructive" });
        return null;
      }
      const m = data as ScanMarker;
      setMarkers((prev) => [m, ...prev]);
      return m;
    },
    [user]
  );

  const deleteMarker = useCallback(
    async (markerId: string) => {
      setMarkers((prev) => prev.filter((m) => m.id !== markerId));
      if (!user) return;
      await supabase.from("brain_scan_markers").delete().eq("id", markerId);
    },
    [user]
  );

  return {
    user,
    loading,
    uploads,
    markers,
    uploadFile,
    deleteUpload,
    updateOpacity,
    addMarker,
    deleteMarker,
    refresh,
  };
}
