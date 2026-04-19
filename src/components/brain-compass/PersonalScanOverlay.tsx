import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  X,
  MapPin,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";
import { extendedAtlasRegions } from "@/data/extendedAtlas";
import { toast } from "@/hooks/use-toast";
import { useBrainScanUploads, type ScanUpload } from "@/hooks/use-brain-scan-uploads";

interface PersonalScanOverlayProps {
  onRegionFocus?: (regionId: string) => void;
  /** Disable in Fog Day mode for cognitive safety. */
  disabled?: boolean;
}

const ACCEPTED = ".png,.jpg,.jpeg,.webp,.dcm,.nii,.nii.gz,application/dicom";
const MAX_BYTES = 25 * 1024 * 1024;

/** Map a normalised marker on the displayed slice to the closest atlas region. */
function findNearestRegion(nx: number, ny: number): BrainRegion | null {
  const x = (nx - 0.5) * -3.1;
  const z = (0.5 - ny) * 2.0;
  // Combine curated + extended for nearest-region search; resolve to curated parent.
  let best: BrainRegion | null = null;
  let bestD = Infinity;
  for (const r of brainRegions) {
    const dx = r.position[0] - x;
    const dz = r.position[2] - z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = r;
    }
  }
  for (const r of extendedAtlasRegions) {
    const dx = r.position[0] - x;
    const dz = r.position[2] - z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = brainRegions.find((c) => c.id === r.parentId) ?? best;
    }
  }
  return best;
}

interface SessionImage {
  id: string;
  url: string;
  fileName: string;
  opacity: number;
  visible: boolean;
}

export const PersonalScanOverlay = ({ onRegionFocus, disabled }: PersonalScanOverlayProps) => {
  const {
    user,
    uploads,
    markers,
    uploadFile,
    deleteUpload,
    updateOpacity,
    addMarker,
    deleteMarker,
  } = useBrainScanUploads();

  // Local-only state for guests (memory-only, cleared on close)
  const [sessionImage, setSessionImage] = useState<SessionImage | null>(null);
  const [sessionMarkers, setSessionMarkers] = useState<
    { id: string; x: number; y: number; nearestRegionId: string | null }[]
  >([]);

  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [unsupportedFormat, setUnsupportedFormat] = useState(false);
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  // Pick the most recent upload by default for signed-in users
  useEffect(() => {
    if (user && uploads.length && !activeUploadId) setActiveUploadId(uploads[0].id);
  }, [user, uploads, activeUploadId]);

  const activeUpload: ScanUpload | null = useMemo(
    () => uploads.find((u) => u.id === activeUploadId) ?? null,
    [uploads, activeUploadId]
  );

  const activeMarkers = useMemo(
    () => (activeUploadId ? markers.filter((m) => m.upload_id === activeUploadId) : []),
    [markers, activeUploadId]
  );

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (sessionImage) URL.revokeObjectURL(sessionImage.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast({ title: "File too large", description: "Max 25 MB.", variant: "destructive" });
        return;
      }
      const lower = file.name.toLowerCase();
      const isImage = file.type.startsWith("image/");
      const isDicom = lower.endsWith(".dcm") || file.type === "application/dicom";
      const isNifti = lower.endsWith(".nii") || lower.endsWith(".nii.gz");

      if (!isImage && (isDicom || isNifti)) {
        setUnsupportedFormat(true);
        setPendingFileName(file.name);
        toast({
          title: `${isDicom ? "DICOM" : "NIfTI"} detected`,
          description: "Native viewing isn't enabled in this beta. Export one slice as PNG/JPG and re-upload.",
        });
        return;
      }
      if (!isImage) {
        toast({
          title: "Unsupported format",
          description: "Use PNG, JPG, or WebP of a single scan slice.",
          variant: "destructive",
        });
        return;
      }

      if (user) {
        const row = await uploadFile(file);
        if (row) setActiveUploadId(row.id);
      } else {
        // Guest: memory-only
        if (sessionImage) URL.revokeObjectURL(sessionImage.url);
        const url = URL.createObjectURL(file);
        setSessionImage({
          id: crypto.randomUUID(),
          url,
          fileName: file.name,
          opacity: 0.7,
          visible: true,
        });
        setSessionMarkers([]);
        toast({
          title: "Loaded for this session only",
          description: "Sign in to save scans privately to your account.",
        });
      }
    },
    [user, sessionImage, uploadFile]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onImageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placing || !imageWrapRef.current) return;
    const rect = imageWrapRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const nearest = findNearestRegion(nx, ny);

    if (user && activeUpload) {
      await addMarker({
        upload_id: activeUpload.id,
        region_id: nearest?.id ?? null,
        position_x: nx,
        position_y: ny,
        position_z: 0,
        severity: "noted",
        note: nearest?.shortLabel ?? nearest?.label ?? null,
      });
    } else {
      setSessionMarkers((prev) => [
        ...prev,
        { id: crypto.randomUUID(), x: nx, y: ny, nearestRegionId: nearest?.id ?? null },
      ]);
    }
    setPlacing(false);
    if (nearest) {
      toast({
        title: `Marker near ${nearest.shortLabel || nearest.label}`,
        description: "Tap the pin to open the clinical card.",
      });
    }
    if (navigator.vibrate) navigator.vibrate(8);
  };

  const clearSession = () => {
    if (sessionImage) URL.revokeObjectURL(sessionImage.url);
    setSessionImage(null);
    setSessionMarkers([]);
  };

  if (disabled) {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 p-4 text-sm text-blue-200/70">
        Personal scan upload is disabled in Fog Day mode for cognitive safety.
      </div>
    );
  }

  // Resolve display state (signed-in vs guest)
  const displayUrl = user ? activeUpload?.signedUrl : sessionImage?.url;
  const displayOpacity = user ? Math.round((activeUpload?.opacity ?? 0.7) * 100) : Math.round((sessionImage?.opacity ?? 0.7) * 100);
  const displayVisible = user ? !!activeUpload : !!sessionImage?.visible;
  const displayName = user ? activeUpload?.original_filename : sessionImage?.fileName;

  const renderMarkers = () => {
    if (user) {
      return activeMarkers.map((m) => (
        <button
          key={m.id}
          onClick={(e) => {
            e.stopPropagation();
            if (m.region_id) onRegionFocus?.(m.region_id);
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group min-w-[56px] min-h-[56px] flex items-center justify-center"
          style={{ left: `${m.position_x * 100}%`, top: `${m.position_y * 100}%` }}
          aria-label={`Marker: ${m.note ?? "noted"}`}
        >
          <div className="relative">
            <div
              className="absolute rounded-full bg-amber-400/40 animate-ping"
              style={{ width: 18, height: 18, left: -9, top: -9 }}
            />
            <MapPin className="h-7 w-7 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] relative" />
          </div>
        </button>
      ));
    }
    return sessionMarkers.map((m) => (
      <button
        key={m.id}
        onClick={(e) => {
          e.stopPropagation();
          if (m.nearestRegionId) onRegionFocus?.(m.nearestRegionId);
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 group min-w-[56px] min-h-[56px] flex items-center justify-center"
        style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
        aria-label="Marker"
      >
        <div className="relative">
          <div
            className="absolute rounded-full bg-amber-400/40 animate-ping"
            style={{ width: 18, height: 18, left: -9, top: -9 }}
          />
          <MapPin className="h-7 w-7 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] relative" />
        </div>
      </button>
    ));
  };

  return (
    <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            {user ? (
              <Lock className="h-4 w-4 text-emerald-400" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            )}
            Your scan ({user ? "private vault" : "session-only"})
          </h3>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">
            {user
              ? "Stored encrypted in your private folder. Only you can ever see it."
              : "Stays in this browser only. Sign in to save it privately."}
          </p>
        </div>
        {(displayUrl || sessionImage) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (user && activeUpload) deleteUpload(activeUpload.id);
              else clearSession();
            }}
            className="text-blue-200 hover:text-white hover:bg-rose-500/10 min-h-[44px] min-w-[44px]"
            aria-label="Remove scan"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Upload list switcher (signed-in, multiple scans) */}
      {user && uploads.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {uploads.map((u) => (
            <button
              key={u.id}
              onClick={() => setActiveUploadId(u.id)}
              className={`px-2.5 py-1 rounded-md text-xs border transition ${
                u.id === activeUploadId
                  ? "bg-blue-500/30 border-blue-400 text-white"
                  : "bg-slate-900/60 border-blue-500/20 text-blue-200 hover:bg-blue-500/10"
              }`}
            >
              <ImagePlus className="h-3 w-3 inline mr-1" />
              {u.original_filename?.slice(0, 18) ?? "Scan"}
            </button>
          ))}
        </div>
      )}

      {!displayUrl && !unsupportedFormat && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-400/60 hover:bg-blue-500/5 transition-colors cursor-pointer min-h-[140px] flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <Upload className="h-8 w-8 text-blue-300 mx-auto mb-2" />
          <p className="text-sm text-blue-100 font-medium">Drop a scan slice or tap to browse</p>
          <p className="text-xs text-blue-300/70 mt-1">PNG, JPG, WebP · up to 25 MB</p>
          <p className="text-[10px] text-blue-400/60 mt-2">
            Have DICOM/NIfTI? Export one slice as PNG from your viewer.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {unsupportedFormat && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200 flex gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">{pendingFileName} — needs conversion</p>
            <p className="text-amber-200/80">
              Open the file in your hospital's DICOM viewer (or free tools like Horos / 3D Slicer),
              export the slice that shows the area of interest as PNG or JPG, then upload here.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setUnsupportedFormat(false);
                setPendingFileName(null);
              }}
              className="mt-2 h-9 text-xs border-amber-500/40 text-amber-100 hover:bg-amber-500/10"
            >
              Try another file
            </Button>
          </div>
        </div>
      )}

      {displayUrl && (
        <>
          <div
            ref={imageWrapRef}
            onClick={onImageClick}
            className={`relative rounded-lg overflow-hidden border border-blue-500/30 bg-black ${
              placing ? "cursor-crosshair ring-2 ring-amber-400" : "cursor-default"
            }`}
            style={{ aspectRatio: "1 / 1" }}
          >
            {displayVisible && (
              <img
                src={displayUrl}
                alt={displayName ?? "Personal scan slice"}
                className="absolute inset-0 w-full h-full object-contain select-none"
                style={{ opacity: displayOpacity / 100 }}
                draggable={false}
              />
            )}
            {!displayVisible && (
              <div className="absolute inset-0 flex items-center justify-center text-blue-300/60 text-xs">
                Scan hidden
              </div>
            )}
            {renderMarkers()}
            {placing && (
              <div className="absolute top-2 left-2 right-2 px-2 py-1 rounded bg-amber-500/90 text-slate-950 text-xs font-semibold text-center">
                Tap the lesion / fracture site on your scan
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={placing ? "default" : "outline"}
                onClick={() => setPlacing((v) => !v)}
                className={
                  placing
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 flex-1 min-h-[44px]"
                    : "border-amber-500/40 text-amber-200 hover:bg-amber-500/10 flex-1 min-h-[44px]"
                }
              >
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {placing ? "Tap the scan…" : "Place amber pin"}
              </Button>
              {!user && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (sessionImage) {
                      setSessionImage((s) => (s ? { ...s, visible: !s.visible } : s));
                    }
                  }}
                  className="text-blue-200 hover:bg-blue-500/10 min-h-[44px] min-w-[44px]"
                  aria-label={sessionImage?.visible ? "Hide scan" : "Show scan"}
                >
                  {sessionImage?.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-blue-200">
              <span className="w-12 flex-shrink-0">Opacity</span>
              <Slider
                value={[displayOpacity]}
                onValueChange={([v]) => {
                  if (user && activeUpload) updateOpacity(activeUpload.id, v / 100);
                  else if (sessionImage) setSessionImage({ ...sessionImage, opacity: v / 100 });
                }}
                min={10}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="w-10 text-right font-mono text-blue-300">{displayOpacity}%</span>
            </div>

            {(user ? activeMarkers.length : sessionMarkers.length) > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold">
                    Markers ({user ? activeMarkers.length : sessionMarkers.length})
                  </span>
                </div>
                {(user
                  ? activeMarkers.map((m) => ({
                      id: m.id,
                      regionId: m.region_id,
                      remove: () => deleteMarker(m.id),
                    }))
                  : sessionMarkers.map((m) => ({
                      id: m.id,
                      regionId: m.nearestRegionId,
                      remove: () => setSessionMarkers((prev) => prev.filter((x) => x.id !== m.id)),
                    }))
                ).map((m) => {
                  const region = m.regionId
                    ? brainRegions.find((r) => r.id === m.regionId)
                    : null;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 px-2 py-2 rounded bg-slate-900/60 border border-blue-500/20 text-xs"
                    >
                      <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                      {region ? (
                        <button
                          onClick={() => onRegionFocus?.(region.id)}
                          className="text-blue-100 hover:text-white text-left flex-1 truncate min-h-[24px]"
                        >
                          Near <span className="font-semibold">{region.shortLabel || region.label}</span>
                        </button>
                      ) : (
                        <span className="text-blue-200 flex-1">Marker</span>
                      )}
                      {region && (
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1.5 border-blue-500/30 text-blue-300"
                        >
                          {region.category}
                        </Badge>
                      )}
                      <button
                        onClick={m.remove}
                        className="text-blue-400/60 hover:text-rose-300 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="Remove marker"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <div className="text-[10px] text-amber-300/80 leading-relaxed border-t border-blue-500/10 pt-2">
        <strong className="text-amber-200">Not diagnostic.</strong> Visualisation only — your
        radiologist's interpretation always wins. Markers are educational suggestions. We never
        share your scans with anyone.
      </div>
    </div>
  );
};
