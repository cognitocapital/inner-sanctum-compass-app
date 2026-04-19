import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Plus, Trash2, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brainRegions, REGION_CATEGORIES } from "@/data/brainRegions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AffectedRegion {
  id: string;
  region_id: string;
  severity: string | null;
  note: string | null;
  source: string | null;
}

interface AffectedRegionsSelectorProps {
  onRegionFocus?: (regionId: string) => void;
}

const SEVERITIES = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "unknown", label: "Not sure" },
];

const SEVERITY_STYLES: Record<string, string> = {
  mild: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  moderate: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  severe: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  unknown: "bg-slate-500/15 text-slate-200 border-slate-500/30",
};

export const AffectedRegionsSelector = ({ onRegionFocus }: AffectedRegionsSelectorProps) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<AffectedRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [picking, setPicking] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("moderate");

  // Load existing self-reported regions
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_affected_regions")
        .select("id, region_id, severity, note, source")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("Failed to load affected regions", error);
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const usedIds = useMemo(() => new Set(rows.map((r) => r.region_id)), [rows]);
  const available = useMemo(
    () => brainRegions.filter((r) => !usedIds.has(r.id)),
    [usedIds]
  );

  const groupedAvailable = useMemo(() => {
    const map = new Map<string, typeof brainRegions>();
    for (const r of available) {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    }
    return map;
  }, [available]);

  const addRegion = async () => {
    if (!user) {
      toast({
        title: "Sign in to save",
        description: "Affected regions are private and tied to your account.",
      });
      return;
    }
    if (!selectedRegionId) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("user_affected_regions")
      .insert({
        user_id: user.id,
        region_id: selectedRegionId,
        severity: selectedSeverity,
        source: "self-reported",
      })
      .select("id, region_id, severity, note, source")
      .single();
    setAdding(false);
    if (error || !data) {
      console.error("Insert failed", error);
      toast({ title: "Couldn't save region", variant: "destructive" });
      return;
    }
    setRows((prev) => [...prev, data]);
    setSelectedRegionId("");
    setSelectedSeverity("moderate");
    setPicking(false);
    const region = brainRegions.find((r) => r.id === data.region_id);
    toast({
      title: `${region?.shortLabel || region?.label || "Region"} added`,
      description: "Phoenix will use this to personalise insights.",
    });
    if (navigator.vibrate) navigator.vibrate(8);
  };

  const removeRow = async (id: string) => {
    if (!user) return;
    const prev = rows;
    setRows((rs) => rs.filter((r) => r.id !== id));
    const { error } = await supabase
      .from("user_affected_regions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      console.error("Delete failed", error);
      setRows(prev);
      toast({ title: "Couldn't remove region", variant: "destructive" });
    }
  };

  const updateSeverity = async (id: string, severity: string) => {
    if (!user) return;
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, severity } : r)));
    const { error } = await supabase
      .from("user_affected_regions")
      .update({ severity })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      console.error("Update failed", error);
      setRows(prev);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm p-4">
        <div className="flex items-start gap-2">
          <Brain className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Mark regions affected by your TBI
            </h3>
            <p className="text-xs text-blue-200/80 mt-1">
              Sign in to log regions you know are affected — Phoenix uses them to personalise quests,
              soundscapes, and check-in insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-blue-300" />
            Regions affected by your TBI
          </h3>
          <p className="text-[11px] text-blue-300/80 mt-0.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Phoenix uses this to tailor quests &amp; soundscapes — no scan required.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-blue-200/70 py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading your regions…
        </div>
      ) : (
        <>
          {rows.length === 0 && !picking && (
            <p className="text-xs text-blue-200/70 italic">
              Nothing logged yet. Add any regions a clinician has flagged, or that match your symptoms.
            </p>
          )}

          {rows.length > 0 && (
            <div className="space-y-1.5">
              {rows.map((row) => {
                const region = brainRegions.find((r) => r.id === row.region_id);
                if (!region) return null;
                const sev = row.severity ?? "unknown";
                return (
                  <div
                    key={row.id}
                    className="flex items-center gap-2 px-2 py-2 rounded bg-slate-900/60 border border-blue-500/20"
                  >
                    <button
                      onClick={() => onRegionFocus?.(region.id)}
                      className="flex items-center gap-2 flex-1 min-w-0 text-left hover:text-white"
                      aria-label={`Focus ${region.label}`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: region.color, boxShadow: `0 0 8px ${region.color}` }}
                      />
                      <span className="text-sm text-blue-50 truncate">
                        {region.shortLabel || region.label}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] py-0 px-1.5 border-blue-500/30 text-blue-300/80 hidden sm:inline-flex"
                      >
                        {region.category}
                      </Badge>
                    </button>
                    <Select value={sev} onValueChange={(v) => updateSeverity(row.id, v)}>
                      <SelectTrigger
                        className={`h-7 text-[11px] w-[110px] border ${SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.unknown}`}
                        aria-label="Severity"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITIES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-blue-400/60 hover:text-rose-300 p-1"
                      aria-label={`Remove ${region.label}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {picking ? (
            <div className="rounded-lg border border-blue-500/30 bg-slate-900/60 p-3 space-y-2.5">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold">
                  Brain region
                </label>
                <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Choose a region…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 z-[60]">
                    {REGION_CATEGORIES.map((cat) => {
                      const list = groupedAvailable.get(cat.id);
                      if (!list || list.length === 0) return null;
                      return (
                        <SelectGroup key={cat.id}>
                          <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {cat.label}
                          </SelectLabel>
                          {list.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              <span className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: r.color }}
                                />
                                {r.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold">
                  Severity (your sense or clinician's)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SEVERITIES.map((s) => {
                    const active = selectedSeverity === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => setSelectedSeverity(s.value)}
                        className={`px-3 py-2 min-h-[40px] rounded-full border text-xs font-semibold transition-all ${
                          active
                            ? SEVERITY_STYLES[s.value]
                            : "border-blue-500/20 text-blue-200/70 hover:bg-blue-500/10"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={addRegion}
                  disabled={!selectedRegionId || adding}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {adding ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Add region
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPicking(false);
                    setSelectedRegionId("");
                  }}
                  className="text-blue-200 hover:bg-blue-500/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            available.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPicking(true)}
                className="w-full border-blue-500/40 text-blue-100 hover:bg-blue-500/10 min-h-[44px]"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add affected region
              </Button>
            )
          )}

          {available.length === 0 && rows.length > 0 && (
            <p className="text-[11px] text-blue-300/60 italic text-center pt-1">
              All available regions logged.
            </p>
          )}
        </>
      )}

      <div className="text-[10px] text-amber-300/80 leading-relaxed border-t border-blue-500/10 pt-2">
        <strong className="text-amber-200">Self-reported.</strong> Educational only — not a clinical diagnosis.
        Always defer to your neurologist for confirmed anatomical findings.
      </div>
    </div>
  );
};
