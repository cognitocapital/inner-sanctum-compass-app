import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, MapPin, Trash2, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";
import { toast } from "@/hooks/use-toast";

interface Marker {
  id: string;
  /** Normalised 0–1 coords on the displayed image. */
  x: number;
  y: number;
  note: string;
  nearestRegionId: string | null;
}

interface PersonalScanOverlayProps {
  onRegionFocus?: (regionId: string) => void;
  /** Disable in Fog Day mode for cognitive safety. */
  disabled?: boolean;
}

const ACCEPTED = ".png,.jpg,.jpeg,.webp,.dcm,.nii,.nii.gz,application/dicom";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Map a 2D normalised marker (top-down view assumed) to the nearest brain
 * region by projecting region positions onto the X/Z plane.
 * Region.position is [x (lateral), y (vertical), z (anterior)] in atlas units.
 */
function findNearestRegion(nx: number, ny: number): BrainRegion | null {
  // Convert image coords (0–1, top-left origin) to atlas X/Z (-1.55..1.55, -1..1)
  // ny = 0 is image top → anterior (z = +1). ny = 1 → posterior (z = -1).
  // nx = 0 → anatomical right side of image = patient's left (x negative).
  const x = (nx - 0.5) * -3.1; // flip for radiological convention
  const z = (0.5 - ny) * 2.0;
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
  return best;
}

export const PersonalScanOverlay = ({ onRegionFocus, disabled }: PersonalScanOverlayProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(70);
  const [visible, setVisible] = useState(true);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [placing, setPlacing] = useState(false);
  const [unsupportedFormat, setUnsupportedFormat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  // Revoke object URL on unmount / replacement to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleFile = useCallback((file: File) => {
    if (file.size > MAX_BYTES) {
      toast({
        title: "File too large",
        description: "Please use a scan slice under 25 MB.",
        variant: "destructive",
      });
      return;
    }
    const isImage = file.type.startsWith("image/");
    const lower = file.name.toLowerCase();
    const isDicom = lower.endsWith(".dcm") || file.type === "application/dicom";
    const isNifti = lower.endsWith(".nii") || lower.endsWith(".nii.gz");

    if (isImage) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFileName(file.name);
      setMarkers([]);
      setUnsupportedFormat(false);
      setVisible(true);
      toast({
        title: "Scan loaded",
        description: "Stays on your device only — never uploaded.",
      });
    } else if (isDicom || isNifti) {
      setUnsupportedFormat(true);
      setFileName(file.name);
      toast({
        title: `${isDicom ? "DICOM" : "NIfTI"} detected`,
        description:
          "Native viewing isn't enabled in this beta. Export a single slice as PNG/JPG from your DICOM viewer and re-upload.",
      });
    } else {
      toast({
        title: "Unsupported format",
        description: "Use PNG, JPG, or WebP of a single scan slice.",
        variant: "destructive",
      });
    }
  }, [imageUrl]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placing || !imageWrapRef.current) return;
    const rect = imageWrapRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const nearest = findNearestRegion(nx, ny);
    const m: Marker = {
      id: crypto.randomUUID(),
      x: nx,
      y: ny,
      note: nearest?.shortLabel || nearest?.label || "Marker",
      nearestRegionId: nearest?.id ?? null,
    };
    setMarkers((prev) => [...prev, m]);
    setPlacing(false);
    if (nearest) {
      toast({
        title: `Marker placed near ${nearest.shortLabel || nearest.label}`,
        description: "Tap the marker to open the clinical card.",
      });
    }
    if (navigator.vibrate) navigator.vibrate(8);
  };

  const removeMarker = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAll = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setFileName(null);
    setMarkers([]);
    setUnsupportedFormat(false);
  };

  if (disabled) {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 p-4 text-sm text-blue-200/70">
        Personal scan upload is disabled in Fog Day mode for cognitive safety.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Your scan (private)
          </h3>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">
            Stays on this device. Never uploaded. Cleared when you close the page.
          </p>
        </div>
        {imageUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearAll}
            className="text-blue-200 hover:text-white hover:bg-rose-500/10"
            aria-label="Remove scan"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!imageUrl && !unsupportedFormat && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-400/60 hover:bg-blue-500/5 transition-colors cursor-pointer"
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
            <p className="font-semibold mb-1">{fileName} — needs conversion</p>
            <p className="text-amber-200/80">
              Open the file in your hospital's DICOM viewer (or free tools like Horos / 3D Slicer),
              export the slice that shows the area of interest as PNG or JPG, then upload here.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setUnsupportedFormat(false);
                setFileName(null);
              }}
              className="mt-2 h-7 text-xs border-amber-500/40 text-amber-100 hover:bg-amber-500/10"
            >
              Try another file
            </Button>
          </div>
        </div>
      )}

      {imageUrl && (
        <>
          <div
            ref={imageWrapRef}
            onClick={onImageClick}
            className={`relative rounded-lg overflow-hidden border border-blue-500/30 bg-black ${
              placing ? "cursor-crosshair ring-2 ring-amber-400" : "cursor-default"
            }`}
            style={{ aspectRatio: "1 / 1" }}
          >
            {visible && (
              <img
                src={imageUrl}
                alt="Personal scan slice"
                className="absolute inset-0 w-full h-full object-contain select-none"
                style={{ opacity: opacity / 100 }}
                draggable={false}
              />
            )}
            {!visible && (
              <div className="absolute inset-0 flex items-center justify-center text-blue-300/60 text-xs">
                Scan hidden
              </div>
            )}
            {/* Markers */}
            {markers.map((m) => (
              <button
                key={m.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (m.nearestRegionId) onRegionFocus?.(m.nearestRegionId);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
                aria-label={`Marker: ${m.note}`}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" style={{ width: 18, height: 18, left: -9, top: -9 }} />
                  <MapPin className="h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] relative" />
                </div>
                <span className="absolute left-5 top-0 px-1.5 py-0.5 rounded bg-slate-950/90 border border-amber-400/40 text-amber-100 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.note}
                </span>
              </button>
            ))}
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
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 flex-1"
                    : "border-amber-500/40 text-amber-200 hover:bg-amber-500/10 flex-1"
                }
              >
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {placing ? "Tap the scan…" : "Place marker"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setVisible((v) => !v)}
                className="text-blue-200 hover:bg-blue-500/10"
                aria-label={visible ? "Hide scan" : "Show scan"}
              >
                {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-3 text-xs text-blue-200">
              <span className="w-12 flex-shrink-0">Opacity</span>
              <Slider
                value={[opacity]}
                onValueChange={([v]) => setOpacity(v)}
                min={10}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="w-10 text-right font-mono text-blue-300">{opacity}%</span>
            </div>

            {markers.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold">
                    Markers ({markers.length})
                  </span>
                  <button
                    onClick={() => setMarkers([])}
                    className="text-[11px] text-rose-300 hover:text-rose-200 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Clear all
                  </button>
                </div>
                {markers.map((m) => {
                  const region = m.nearestRegionId
                    ? brainRegions.find((r) => r.id === m.nearestRegionId)
                    : null;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-900/60 border border-blue-500/20 text-xs"
                    >
                      <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                      {region ? (
                        <button
                          onClick={() => onRegionFocus?.(region.id)}
                          className="text-blue-100 hover:text-white text-left flex-1 truncate"
                        >
                          Near <span className="font-semibold">{region.shortLabel || region.label}</span>
                        </button>
                      ) : (
                        <span className="text-blue-200 flex-1">{m.note}</span>
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
                        onClick={() => removeMarker(m.id)}
                        className="text-blue-400/60 hover:text-rose-300"
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
        <strong className="text-amber-200">Not diagnostic.</strong> This is a visualisation aid only.
        Markers and any anatomical suggestions are educational — always consult your neurologist for
        clinical interpretation of your imaging.
      </div>
    </div>
  );
};
