import { useMemo, useState } from "react";
import { Plus, X, Brain, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { brainRegions } from "@/data/brainRegions";
import { useAffectedRegions, type AffectedSeverity } from "@/hooks/use-affected-regions";

interface Props {
  onFocusRegion?: (regionId: string) => void;
  highlightedRegionId?: string | null;
}

const SEVERITY_OPTIONS: { value: Exclude<AffectedSeverity, null>; label: string; color: string }[] = [
  { value: "mild", label: "Mild", color: "bg-yellow-500/20 text-yellow-200 border-yellow-500/40" },
  { value: "moderate", label: "Moderate", color: "bg-orange-500/20 text-orange-200 border-orange-500/40" },
  { value: "severe", label: "Severe", color: "bg-red-500/20 text-red-200 border-red-500/40" },
];

export function AffectedRegionsManager({ onFocusRegion, highlightedRegionId }: Props) {
  const { items, add, remove, has } = useAffectedRegions();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingSeverity, setPendingSeverity] = useState<Exclude<AffectedSeverity, null>>("moderate");
  const [pendingNote, setPendingNote] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brainRegions
      .filter((r) => !has(r.id))
      .filter(
        (r) =>
          !q ||
          r.label.toLowerCase().includes(q) ||
          r.shortLabel?.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [search, has]);

  const handleAdd = async () => {
    if (!pendingId) return;
    await add(pendingId, pendingSeverity, pendingNote);
    setPendingId(null);
    setPendingNote("");
    setPendingSeverity("moderate");
    setSearch("");
    setOpen(false);
  };

  const enriched = items
    .map((it) => ({ ...it, region: brainRegions.find((r) => r.id === it.region_id) }))
    .filter((it) => it.region);

  return (
    <div className="rounded-2xl border border-pink-500/20 bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-pink-100 flex items-center gap-1.5">
            <Brain className="h-4 w-4" /> My affected regions
          </h3>
          <p className="text-xs text-blue-200/70 mt-0.5">
            Mark areas you know are affected — even without a scan. Phoenix will use this to personalise.
          </p>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              className="bg-pink-500 hover:bg-pink-600 text-white min-h-[44px]"
              onClick={() => setPendingId(null)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 bg-slate-950 border-pink-500/30" align="end">
            {!pendingId ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search regions (e.g. hippocampus, frontal)…"
                  maxLength={80}
                  className="w-full px-3 py-2 rounded-md bg-slate-900 border border-blue-500/20 text-blue-50 text-sm placeholder:text-blue-300/40 focus:outline-none focus:border-pink-500/60"
                />
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                  {filtered.length === 0 && (
                    <p className="text-xs text-blue-300/60 py-2 text-center">No matching regions.</p>
                  )}
                  {filtered.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setPendingId(r.id)}
                      className="w-full text-left px-2.5 py-2 rounded-md hover:bg-pink-500/10 text-sm text-blue-100 flex items-center gap-2"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="truncate">{r.label}</span>
                      <span className="ml-auto text-[10px] uppercase opacity-50">{r.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-pink-200/70 mb-1">Region</p>
                  <p className="text-sm font-semibold text-blue-50">
                    {brainRegions.find((r) => r.id === pendingId)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-pink-200/70 mb-1">Severity</p>
                  <Select value={pendingSeverity} onValueChange={(v) => setPendingSeverity(v as Exclude<AffectedSeverity, null>)}>
                    <SelectTrigger className="bg-slate-900 border-blue-500/20 text-blue-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-pink-200/70 mb-1">Note (optional)</p>
                  <Textarea
                    value={pendingNote}
                    onChange={(e) => setPendingNote(e.target.value.slice(0, 500))}
                    placeholder="e.g. mentioned in radiology report 2024"
                    maxLength={500}
                    className="bg-slate-900 border-blue-500/20 text-blue-50 text-sm min-h-[60px]"
                  />
                  <p className="text-[10px] text-blue-300/40 mt-1 text-right">{pendingNote.length}/500</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-blue-200"
                    onClick={() => setPendingId(null)}
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={handleAdd}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {enriched.length === 0 ? (
        <p className="text-xs text-blue-300/50 italic py-3 text-center border border-dashed border-blue-500/15 rounded-lg">
          No regions marked yet. Tap <span className="text-pink-300">Add</span> to start.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {enriched.map((it) => {
            const sev = SEVERITY_OPTIONS.find((s) => s.value === it.severity);
            const isFocused = highlightedRegionId === it.region_id;
            return (
              <li
                key={it.id}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors ${
                  isFocused
                    ? "border-pink-400/60 bg-pink-500/10"
                    : "border-blue-500/15 bg-slate-900/60"
                }`}
              >
                <button
                  onClick={() => onFocusRegion?.(it.region_id)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left min-h-[40px]"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: it.region!.color }}
                  />
                  <span className="text-sm text-blue-50 truncate">{it.region!.label}</span>
                </button>
                {sev && (
                  <Badge variant="outline" className={`text-[10px] uppercase ${sev.color}`}>
                    {sev.label}
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-300/60 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => remove(it.region_id)}
                  aria-label={`Remove ${it.region!.label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex items-start gap-1.5 text-[10px] text-amber-200/70">
        <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
        <span>Self-reported only. Not a diagnosis. Always confirm with your neurologist.</span>
      </div>
    </div>
  );
}
