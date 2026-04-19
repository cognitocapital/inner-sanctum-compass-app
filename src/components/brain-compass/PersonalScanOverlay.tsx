import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, MapPin, Trash2, Eye, EyeOff, ShieldCheck, AlertTriangle, Sparkles, Loader2, FileText, Check, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ScanItem {
  id: string;
  file: File;
  url: string;
  fileName: string;
  markers: Marker[];
}

interface ReportItem {
  id: string;
  label: string;
  text: string;
}

interface Marker {
  id: string;
  x: number;
  y: number;
  note: string;
  nearestRegionId: string | null;
}

interface AISuggestedRegion {
  regionId: string;
  severity: "mild" | "moderate" | "severe" | "unknown";
  confidence: "low" | "medium" | "high";
  rationale: string;
  selected: boolean;
}

interface AIResult {
  regions: AISuggestedRegion[];
  summary: string;
  clinicianQuestions: string[];
  disclaimer: string;
  inputCounts?: { images: number; reports: number };
}

interface PersonalScanOverlayProps {
  onRegionFocus?: (regionId: string) => void;
  disabled?: boolean;
}

const ACCEPTED = ".png,.jpg,.jpeg,.webp,.dcm,.nii,.nii.gz,application/dicom";
const MAX_BYTES = 25 * 1024 * 1024;
const MAX_SCANS = 6;
const MAX_REPORTS = 6;

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

function findNearestRegion(nx: number, ny: number): BrainRegion | null {
  const x = (nx - 0.5) * -3.1;
  const z = (0.5 - ny) * 2.0;
  let best: BrainRegion | null = null;
  let bestD = Infinity;
  for (const r of brainRegions) {
    const dx = r.position[0] - x;
    const dz = r.position[2] - z;
    const d = dx * dx + dz * dz;
    if (d < bestD) { bestD = d; best = r; }
  }
  return best;
}

async function fileToBase64(file: File): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, base64] = result.split(",");
      resolve({ base64, mime: file.type || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const PersonalScanOverlay = ({ onRegionFocus, disabled }: PersonalScanOverlayProps) => {
  const { user } = useAuth();
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [opacity, setOpacity] = useState(70);
  const [visible, setVisible] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [unsupportedFormat, setUnsupportedFormat] = useState<string | null>(null);
  const [draftReport, setDraftReport] = useState("");
  const [draftReportLabel, setDraftReportLabel] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [savingRegions, setSavingRegions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const activeScan = scans.find((s) => s.id === activeScanId) || null;

  // Cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      scans.forEach((s) => URL.revokeObjectURL(s.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addScanFile = useCallback((file: File) => {
    if (scans.length >= MAX_SCANS) {
      toast({ title: "Limit reached", description: `Up to ${MAX_SCANS} scans at once.`, variant: "destructive" });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File too large", description: "Each scan must be under 25 MB.", variant: "destructive" });
      return;
    }
    const lower = file.name.toLowerCase();
    const isImage = file.type.startsWith("image/");
    const isDicom = lower.endsWith(".dcm") || file.type === "application/dicom";
    const isNifti = lower.endsWith(".nii") || lower.endsWith(".nii.gz");

    if (isImage) {
      const url = URL.createObjectURL(file);
      const newScan: ScanItem = {
        id: crypto.randomUUID(), file, url, fileName: file.name, markers: [],
      };
      setScans((prev) => [...prev, newScan]);
      setActiveScanId(newScan.id);
      setUnsupportedFormat(null);
      toast({ title: "Scan added", description: `${scans.length + 1} of ${MAX_SCANS}` });
    } else if (isDicom || isNifti) {
      setUnsupportedFormat(file.name);
      toast({
        title: `${isDicom ? "DICOM" : "NIfTI"} detected`,
        description: "Export a slice as PNG/JPG, or paste your report text instead.",
      });
    } else {
      toast({ title: "Unsupported format", description: "Use PNG, JPG, or WebP.", variant: "destructive" });
    }
  }, [scans]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    Array.from(e.dataTransfer.files || []).slice(0, MAX_SCANS - scans.length).forEach(addScanFile);
  };

  const onImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placing || !imageWrapRef.current || !activeScan) return;
    const rect = imageWrapRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const nearest = findNearestRegion(nx, ny);
    const m: Marker = {
      id: crypto.randomUUID(), x: nx, y: ny,
      note: nearest?.shortLabel || nearest?.label || "Marker",
      nearestRegionId: nearest?.id ?? null,
    };
    setScans((prev) => prev.map((s) => s.id === activeScan.id ? { ...s, markers: [...s.markers, m] } : s));
    setPlacing(false);
    if (nearest) toast({ title: `Marker near ${nearest.shortLabel || nearest.label}` });
    if (navigator.vibrate) navigator.vibrate(8);
  };

  const removeMarker = (markerId: string) => {
    if (!activeScan) return;
    setScans((prev) => prev.map((s) => s.id === activeScan.id ? { ...s, markers: s.markers.filter((m) => m.id !== markerId) } : s));
  };

  const removeScan = (scanId: string) => {
    setScans((prev) => {
      const target = prev.find((s) => s.id === scanId);
      if (target) URL.revokeObjectURL(target.url);
      const next = prev.filter((s) => s.id !== scanId);
      if (activeScanId === scanId) setActiveScanId(next[0]?.id ?? null);
      return next;
    });
  };

  const addReport = () => {
    if (reports.length >= MAX_REPORTS) {
      toast({ title: "Limit reached", description: `Up to ${MAX_REPORTS} reports at once.`, variant: "destructive" });
      return;
    }
    if (draftReport.trim().length < 10) {
      toast({ title: "Too short", description: "Report needs at least 10 characters.", variant: "destructive" });
      return;
    }
    setReports((prev) => [...prev, {
      id: crypto.randomUUID(),
      label: draftReportLabel.trim() || `Report ${prev.length + 1}`,
      text: draftReport.trim(),
    }]);
    setDraftReport("");
    setDraftReportLabel("");
    setShowReportForm(false);
    toast({ title: "Report added" });
  };

  const removeReport = (id: string) => setReports((prev) => prev.filter((r) => r.id !== id));

  const clearAll = () => {
    scans.forEach((s) => URL.revokeObjectURL(s.url));
    setScans([]);
    setActiveScanId(null);
    setReports([]);
    setUnsupportedFormat(null);
    setDraftReport("");
    setDraftReportLabel("");
    setShowReportForm(false);
    setAiResult(null);
  };

  const runAIAnalysis = async () => {
    if (scans.length === 0 && reports.length === 0) {
      toast({ title: "Nothing to analyse", description: "Add at least one scan or report.", variant: "destructive" });
      return;
    }
    setAnalyzing(true);
    try {
      const imagePayloads = await Promise.all(scans.map(async (s) => {
        const { base64, mime } = await fileToBase64(s.file);
        return { base64, mimeType: mime, fileName: s.fileName };
      }));

      const { data, error } = await supabase.functions.invoke("analyze-scan", {
        body: {
          images: imagePayloads,
          reports: reports.map((r) => ({ text: r.text, label: r.label })),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const enriched: AIResult = {
        regions: (data.regions || []).map((r: any) => ({ ...r, selected: true })),
        summary: data.summary || "",
        clinicianQuestions: data.clinicianQuestions || [],
        disclaimer: data.disclaimer || "Educational only — not diagnostic.",
        inputCounts: data.inputCounts,
      };
      setAiResult(enriched);
      if (enriched.regions.length === 0) {
        toast({ title: "No clear regions identified", description: "Try clearer images or paste impressions text." });
      }
    } catch (err: any) {
      console.error("AI analysis failed:", err);
      toast({ title: "AI analysis failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSuggestion = (regionId: string) => {
    setAiResult((prev) => prev ? { ...prev, regions: prev.regions.map((r) => r.regionId === regionId ? { ...r, selected: !r.selected } : r) } : prev);
  };

  const saveSelectedToProfile = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to save AI-suggested regions.", variant: "destructive" });
      return;
    }
    if (!aiResult) return;
    const toSave = aiResult.regions.filter((r) => r.selected);
    if (toSave.length === 0) {
      toast({ title: "Nothing selected" });
      return;
    }
    setSavingRegions(true);
    try {
      const source = scans.length > 0 && reports.length > 0 ? "ai_multi" : scans.length > 0 ? "ai_scan" : "ai_report";
      const rows = toSave.map((r) => ({
        user_id: user.id,
        region_id: r.regionId,
        severity: r.severity,
        source,
        note: `AI-suggested (${r.confidence} confidence): ${r.rationale}`,
      }));
      const { data: existing } = await supabase
        .from("user_affected_regions").select("region_id").eq("user_id", user.id);
      const existingIds = new Set((existing || []).map((e) => e.region_id));
      const fresh = rows.filter((r) => !existingIds.has(r.region_id));

      if (fresh.length === 0) {
        toast({ title: "Already saved", description: "These regions are already in your profile." });
      } else {
        const { error } = await supabase.from("user_affected_regions").insert(fresh);
        if (error) throw error;
        toast({
          title: `Added ${fresh.length} region${fresh.length === 1 ? "" : "s"}`,
          description: "Phoenix will personalise around these.",
        });
      }
      setAiResult(null);
    } catch (err: any) {
      toast({ title: "Save failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSavingRegions(false);
    }
  };

  if (disabled) {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 p-4 text-sm text-blue-200/70">
        Personal scan upload is disabled in Fog Day mode for cognitive safety.
      </div>
    );
  }

  const totalInputs = scans.length + reports.length;
  const canAnalyse = totalInputs > 0;

  return (
    <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Your scans &amp; reports (private)
          </h3>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">
            Add multiple inputs for a holistic AI synthesis. Images stay on this device.
          </p>
        </div>
        {totalInputs > 0 && (
          <Button size="sm" variant="ghost" onClick={clearAll} className="text-blue-200 hover:text-white hover:bg-rose-500/10" aria-label="Clear all">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Scan thumbnails strip */}
      {scans.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {scans.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScanId(s.id)}
              className={`relative flex-shrink-0 h-16 w-16 rounded-lg border-2 overflow-hidden transition-all ${
                activeScanId === s.id ? "border-amber-400 ring-2 ring-amber-400/40" : "border-blue-500/30 hover:border-blue-400/60"
              }`}
              aria-label={`Select scan ${s.fileName}`}
            >
              <img src={s.url} alt={s.fileName} className="h-full w-full object-cover" />
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); removeScan(s.id); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); removeScan(s.id); } }}
                className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-slate-950/80 hover:bg-rose-500/80 text-white flex items-center justify-center cursor-pointer"
                aria-label="Remove scan"
              >
                <X className="h-3 w-3" />
              </span>
              {s.markers.length > 0 && (
                <span className="absolute bottom-0.5 left-0.5 px-1 rounded bg-amber-500/90 text-slate-950 text-[9px] font-bold">
                  {s.markers.length}
                </span>
              )}
            </button>
          ))}
          {scans.length < MAX_SCANS && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 h-16 w-16 rounded-lg border-2 border-dashed border-blue-500/40 hover:border-blue-400 text-blue-300 flex items-center justify-center"
              aria-label="Add another scan"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* First-upload dropzone */}
      {scans.length === 0 && !unsupportedFormat && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-blue-500/30 rounded-lg p-5 text-center hover:border-blue-400/60 hover:bg-blue-500/5 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
        >
          <Upload className="h-7 w-7 text-blue-300 mx-auto mb-2" />
          <p className="text-sm text-blue-100 font-medium">Drop scan slices or tap to browse</p>
          <p className="text-xs text-blue-300/70 mt-1">PNG, JPG, WebP · up to {MAX_SCANS} files · 25 MB each</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => {
          Array.from(e.target.files || []).slice(0, MAX_SCANS - scans.length).forEach(addScanFile);
          e.target.value = "";
        }}
      />

      {unsupportedFormat && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200 flex gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">{unsupportedFormat} — needs conversion</p>
            <p className="text-amber-200/80">Export a slice as PNG/JPG, or paste your report text below.</p>
            <Button size="sm" variant="outline" onClick={() => setUnsupportedFormat(null)} className="mt-2 h-7 text-xs border-amber-500/40 text-amber-100 hover:bg-amber-500/10">
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Active scan viewer */}
      {activeScan && (
        <>
          <div className="text-[11px] text-blue-300/70 truncate">
            <ImageIcon className="h-3 w-3 inline mr-1" /> {activeScan.fileName}
          </div>
          <div
            ref={imageWrapRef}
            onClick={onImageClick}
            className={`relative rounded-lg overflow-hidden border border-blue-500/30 bg-black ${placing ? "cursor-crosshair ring-2 ring-amber-400" : "cursor-default"}`}
            style={{ aspectRatio: "1 / 1" }}
          >
            {visible && (
              <img src={activeScan.url} alt={activeScan.fileName} className="absolute inset-0 w-full h-full object-contain select-none" style={{ opacity: opacity / 100 }} draggable={false} />
            )}
            {!visible && (
              <div className="absolute inset-0 flex items-center justify-center text-blue-300/60 text-xs">Scan hidden</div>
            )}
            {activeScan.markers.map((m) => (
              <button key={m.id} onClick={(e) => { e.stopPropagation(); if (m.nearestRegionId) onRegionFocus?.(m.nearestRegionId); }} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }} aria-label={`Marker: ${m.note}`}>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" style={{ width: 18, height: 18, left: -9, top: -9 }} />
                  <MapPin className="h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] relative" />
                </div>
              </button>
            ))}
            {placing && (
              <div className="absolute top-2 left-2 right-2 px-2 py-1 rounded bg-amber-500/90 text-slate-950 text-xs font-semibold text-center">
                Tap the lesion / fracture site
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Button size="sm" variant={placing ? "default" : "outline"} onClick={() => setPlacing((v) => !v)} className={placing ? "bg-amber-500 hover:bg-amber-600 text-slate-950 flex-1" : "border-amber-500/40 text-amber-200 hover:bg-amber-500/10 flex-1"}>
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {placing ? "Tap the scan…" : "Place marker"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setVisible((v) => !v)} className="text-blue-200 hover:bg-blue-500/10" aria-label={visible ? "Hide" : "Show"}>
                {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-200">
              <span className="w-12 flex-shrink-0">Opacity</span>
              <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={10} max={100} step={5} className="flex-1" />
              <span className="w-10 text-right font-mono text-blue-300">{opacity}%</span>
            </div>
            {activeScan.markers.length > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-blue-300/70">{activeScan.markers.length} marker(s) on this scan</span>
                <button onClick={() => activeScan.markers.forEach((m) => removeMarker(m.id))} className="text-[11px] text-rose-300 hover:text-rose-200 flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reports section */}
      <div className="border-t border-blue-500/15 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-200 font-medium flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Radiology reports {reports.length > 0 && <span className="text-blue-400/70">({reports.length}/{MAX_REPORTS})</span>}
          </span>
          {!showReportForm && reports.length < MAX_REPORTS && (
            <Button size="sm" variant="ghost" onClick={() => setShowReportForm(true)} className="h-7 text-xs text-blue-200 hover:bg-blue-500/10">
              <Plus className="h-3 w-3 mr-1" /> Add report
            </Button>
          )}
        </div>

        {reports.map((r) => (
          <div key={r.id} className="rounded-lg bg-slate-900/60 border border-blue-500/20 p-2 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-blue-100 truncate">{r.label}</span>
              <button onClick={() => removeReport(r.id)} className="text-blue-400/60 hover:text-rose-300" aria-label="Remove report">
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-blue-200/80 line-clamp-2">{r.text}</p>
          </div>
        ))}

        {showReportForm && (
          <div className="space-y-2 rounded-lg border border-blue-500/20 bg-slate-900/40 p-2">
            <Input
              value={draftReportLabel}
              onChange={(e) => setDraftReportLabel(e.target.value)}
              placeholder="Label (e.g. MRI 2024-03)"
              className="h-8 text-xs bg-slate-950/60 border-blue-500/20 text-blue-50 placeholder:text-blue-400/40"
              maxLength={60}
            />
            <Textarea
              value={draftReport}
              onChange={(e) => setDraftReport(e.target.value)}
              placeholder="Paste the impressions / findings section. Remove personal identifiers first."
              className="min-h-[90px] text-xs bg-slate-950/60 border-blue-500/20 text-blue-50 placeholder:text-blue-400/40"
              maxLength={8000}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setShowReportForm(false); setDraftReport(""); setDraftReportLabel(""); }} className="flex-1 h-8 text-xs text-blue-200 hover:bg-blue-500/10">
                Cancel
              </Button>
              <Button size="sm" onClick={addReport} className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                <Check className="h-3 w-3 mr-1" /> Save report
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* AI-assist */}
      <Button
        onClick={runAIAnalysis}
        disabled={!canAnalyse || analyzing}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold disabled:opacity-50"
      >
        {analyzing ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Synthesising {totalInputs} input{totalInputs === 1 ? "" : "s"}…</>
        ) : (
          <><Sparkles className="h-4 w-4 mr-2" /> AI-assist: synthesise {totalInputs > 0 ? `${totalInputs} input${totalInputs === 1 ? "" : "s"}` : "inputs"}</>
        )}
      </Button>

      <div className="text-[10px] text-amber-300/80 leading-relaxed border-t border-blue-500/10 pt-2">
        <strong className="text-amber-200">Not diagnostic.</strong> Visualisation and AI suggestions are educational. Always consult your neurologist.
      </div>

      {/* AI Suggestions Modal */}
      <Dialog open={!!aiResult} onOpenChange={(open) => !open && setAiResult(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-slate-950 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Holistic AI synthesis
            </DialogTitle>
            <DialogDescription className="text-blue-200/80">
              {aiResult?.inputCounts && (
                <span className="block mb-1 text-[11px]">
                  Synthesised from {aiResult.inputCounts.images} scan{aiResult.inputCounts.images === 1 ? "" : "s"} + {aiResult.inputCounts.reports} report{aiResult.inputCounts.reports === 1 ? "" : "s"}
                </span>
              )}
              Educational only — not a diagnosis. Review with your neurologist.
            </DialogDescription>
          </DialogHeader>

          {aiResult && (
            <div className="space-y-3">
              {aiResult.summary && (
                <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-blue-100 leading-relaxed">
                  {aiResult.summary}
                </div>
              )}

              {aiResult.regions.length === 0 ? (
                <div className="text-sm text-blue-200/70 text-center py-4">
                  No specific regions could be identified across these inputs. Try clearer images or paste impressions text.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold">Tap to include / exclude</p>
                  {aiResult.regions.map((r) => {
                    const region = brainRegions.find((b) => b.id === r.regionId);
                    if (!region) return null;
                    return (
                      <button
                        key={r.regionId}
                        onClick={() => toggleSuggestion(r.regionId)}
                        className={`w-full text-left rounded-lg border p-3 transition-all ${
                          r.selected ? "border-amber-400/60 bg-amber-500/5" : "border-blue-500/20 bg-slate-900/40 opacity-50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${r.selected ? "bg-amber-400 border-amber-400" : "border-blue-500/40"}`}>
                            {r.selected && <Check className="h-3 w-3 text-slate-950" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-semibold text-white">{region.shortLabel || region.label}</span>
                              <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${CONFIDENCE_STYLES[r.confidence]}`}>
                                {r.confidence} confidence
                              </Badge>
                              <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-blue-500/30 text-blue-200">
                                {r.severity}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-blue-200/80 mt-1 leading-relaxed">{r.rationale}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {aiResult.clinicianQuestions.length > 0 && (
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold mb-1.5">Ask your neurologist</p>
                  <ul className="space-y-1 text-xs text-emerald-100/90">
                    {aiResult.clinicianQuestions.map((q, i) => (
                      <li key={i} className="flex gap-1.5"><span className="text-emerald-400">•</span><span>{q}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2 sticky bottom-0 bg-slate-950 pb-1">
                <Button variant="outline" onClick={() => setAiResult(null)} className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-500/10">
                  Cancel
                </Button>
                <Button
                  onClick={saveSelectedToProfile}
                  disabled={savingRegions || aiResult.regions.filter((r) => r.selected).length === 0}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
                >
                  {savingRegions ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Check className="h-4 w-4 mr-1.5" />}
                  Add to my regions
                </Button>
              </div>

              <p className="text-[10px] text-amber-300/70 text-center pt-1">{aiResult.disclaimer}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
