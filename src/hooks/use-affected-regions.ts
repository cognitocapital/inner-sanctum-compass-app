import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export type AffectedSeverity = "mild" | "moderate" | "severe" | null;

export interface AffectedRegion {
  id: string;
  region_id: string;
  severity: AffectedSeverity;
  source: string | null;
  note: string | null;
  created_at: string;
}

const STORAGE_KEY = "phoenix-affected-regions-guest";

function readGuest(): AffectedRegion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AffectedRegion[]) : [];
  } catch {
    return [];
  }
}
function writeGuest(items: AffectedRegion[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* no-op */
  }
}

export function useAffectedRegions() {
  const { user } = useAuth();
  const [items, setItems] = useState<AffectedRegion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    if (!user) {
      setItems(readGuest());
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("user_affected_regions")
      .select("id, region_id, severity, source, note, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load your affected regions", description: error.message, variant: "destructive" });
    } else {
      setItems((data ?? []) as AffectedRegion[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const add = useCallback(
    async (regionId: string, severity: AffectedSeverity, note?: string) => {
      const cleanNote = (note ?? "").trim().slice(0, 500) || null;
      if (!user) {
        const next: AffectedRegion = {
          id: crypto.randomUUID(),
          region_id: regionId,
          severity,
          source: "self-reported",
          note: cleanNote,
          created_at: new Date().toISOString(),
        };
        const merged = [next, ...readGuest().filter((r) => r.region_id !== regionId)];
        writeGuest(merged);
        setItems(merged);
        toast({ title: "Region marked", description: "Saved on this device. Sign in to sync." });
        return;
      }
      const { error } = await supabase
        .from("user_affected_regions")
        .upsert(
          { user_id: user.id, region_id: regionId, severity, note: cleanNote, source: "self-reported" },
          { onConflict: "user_id,region_id" }
        );
      if (error) {
        toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Region marked as affected" });
      await load();
    },
    [user, load]
  );

  const remove = useCallback(
    async (regionId: string) => {
      if (!user) {
        const merged = readGuest().filter((r) => r.region_id !== regionId);
        writeGuest(merged);
        setItems(merged);
        return;
      }
      const { error } = await supabase
        .from("user_affected_regions")
        .delete()
        .eq("user_id", user.id)
        .eq("region_id", regionId);
      if (error) {
        toast({ title: "Couldn't remove", description: error.message, variant: "destructive" });
        return;
      }
      await load();
    },
    [user, load]
  );

  const has = useCallback((regionId: string) => items.some((r) => r.region_id === regionId), [items]);

  return { items, loading, add, remove, has, reload: load };
}
