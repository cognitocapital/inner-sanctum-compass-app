import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, Plus, Trash2, Brain, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
  const [search, setSearch] = useState("");

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
  const available = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brainRegions.filter(
      (r) =>
        !usedIds.has(r.id) &&
        (q === "" ||
          r.label.toLowerCase().includes(q) ||
          (r.shortLabel ?? "").toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q))
    );
  }, [usedIds, search]);

  const groupedAvailable = useMemo(() => {
    const map = new Map<string, typeof brainRegions>();
    for (const r of available) {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    }
    return map;
  }, [available]);

  const openPicker = () => {
    setSelectedRegionId("");
    setSelectedSeverity("moderate");
    setSearch("");
    setPicking(true);
  };

  const addRegion = async () => {
    if (!user) {
      toast({
        title: "Sign in to save",
        description: "Affected regions are private and tied to your account.",
      });
      return;
    }
    if (!selectedRegionId) {
      toast({ title: "Pick a region first", variant: "destructive" });
      return;
    }
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
      toast({ title: "Couldn't save region", description: error?.message, variant: "destructive" });
      return;
    }
    setRows((prev) => [...prev, data]);
    setSelectedRegionId("");
    setSelectedSeverity("moderate");
    setSearch("");
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

  // Build a deep-link to AI Companion with a prefilled prompt about affected regions.
  const phoenixPromptHref = useMemo(() => {
    if (rows.length === 0) return "/ai-companion";
    const summary = rows
      .map((r) => {
        const reg = brainRegions.find((br) => br.id === r.region_id);
        return reg ? `${reg.shortLabel || reg.label} (${r.severity || "unknown"})` : null;
      })
      .filter(Boolean)
      .join(", ");
    const q = `Based on my self-reported affected brain regions — ${summary} — what daily practices, soundscapes, and quests should I prioritise this week? Tie it to my recent check-ins.`;
    return `/ai-companion?context=${encodeURIComponent(q)}`;
  }, [rows]);

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
            <Button asChild size="sm" className="mt-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-blue-300" />
            Regions affected by your TBI
          </h3>
          <p className="text-[11px] text-blue-300/80 mt-0.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Phoenix uses this to tailor quests &amp; soundscapes — no scan required.
          </p>
        </div>
        {/* Always-visible Add button so it never gets lost on mobile */}
        <Button
          size="sm"
          onClick={openPicker}
          className="bg-blue-600 hover:bg-blue-500 text-white shrink-0 min-h-[40px]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-blue-200/70 py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading your regions…
        </div>
      ) : (
        <>
          {rows.length === 0 ? (
            <p className="text-xs text-blue-200/70 italic">
              Nothing logged yet. Tap <strong className="text-blue-100">Add</strong> to log any regions a
              clinician has flagged, or that match your symptoms.
            </p>
          ) : (
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
                    </button>
                    {/* Native select — bulletproof on mobile */}
                    <select
                      value={sev}
                      onChange={(e) => updateSeverity(row.id, e.target.value)}
                      aria-label="Severity"
                      className={`h-8 text-[11px] rounded-md border px-2 font-semibold appearance-none ${SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.unknown}`}
                    >
                      {SEVERITIES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-slate-900 text-white">
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-blue-400/60 hover:text-rose-300 p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label={`Remove ${region.label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ask Phoenix CTA — appears once at least one region is logged */}
          {rows.length > 0 && (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold min-h-[48px] mt-1"
            >
              <Link to={phoenixPromptHref}>
                <Sparkles className="h-4 w-4 mr-2" />
                Ask Phoenix to personalise around these
              </Link>
            </Button>
          )}
        </>
      )}

      <div className="text-[10px] text-amber-300/80 leading-relaxed border-t border-blue-500/10 pt-2">
        <strong className="text-amber-200">Self-reported.</strong> Educational only — not a clinical diagnosis.
        Always defer to your neurologist for confirmed anatomical findings.
      </div>

      {/* MOBILE-FRIENDLY PICKER — full-screen Sheet, can never be missed */}
      <Sheet open={picking} onOpenChange={setPicking}>
        <SheetContent
          side="bottom"
          className="h-[92vh] sm:h-[80vh] bg-slate-950 border-t border-blue-500/30 text-blue-50 p-0 flex flex-col"
        >
          <SheetHeader className="px-4 pt-5 pb-3 border-b border-blue-500/20 text-left">
            <SheetTitle className="text-white flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-blue-300" />
              Add an affected region
            </SheetTitle>
            <SheetDescription className="text-blue-200/70 text-xs">
              Pick a region and rate how strongly it's been affected. Phoenix will use it to personalise.
            </SheetDescription>
          </SheetHeader>

          {/* Search */}
          <div className="px-4 pt-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300/60" />
              <input
                type="text"
                inputMode="search"
                autoFocus={false}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search regions…"
                className="w-full h-11 pl-9 pr-3 rounded-md bg-slate-900 border border-blue-500/30 text-sm text-blue-50 placeholder:text-blue-300/40 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Region list — scrollable area */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {available.length === 0 ? (
              <p className="text-sm text-blue-300/60 italic p-6 text-center">
                {usedIds.size === brainRegions.length
                  ? "You've logged every available region."
                  : "No matches for that search."}
              </p>
            ) : (
              <div className="space-y-3">
                {REGION_CATEGORIES.map((cat) => {
                  const list = groupedAvailable.get(cat.id);
                  if (!list || list.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <div
                        className="text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </div>
                      <div className="rounded-md border border-blue-500/15 overflow-hidden divide-y divide-blue-500/10">
                        {list.map((r) => {
                          const active = selectedRegionId === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setSelectedRegionId(r.id)}
                              className={`w-full flex items-center gap-2 px-3 py-3 text-left text-sm min-h-[48px] transition-colors ${
                                active
                                  ? "bg-blue-500/25 text-white"
                                  : "text-blue-100 active:bg-blue-500/15"
                              }`}
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: r.color }}
                              />
                              <span className="flex-1 truncate">{r.label}</span>
                              {active && <Check className="h-4 w-4 text-blue-300 flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky footer: severity + add */}
          <div className="border-t border-blue-500/20 bg-slate-950 px-4 py-3 space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-blue-300/70 font-semibold">
                Severity
              </label>
              <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                {SEVERITIES.map((s) => {
                  const active = selectedSeverity === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSelectedSeverity(s.value)}
                      className={`px-2 py-2 min-h-[44px] rounded-md border text-[11px] font-semibold transition-all ${
                        active
                          ? SEVERITY_STYLES[s.value]
                          : "border-blue-500/20 text-blue-200/70"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              size="lg"
              onClick={addRegion}
              disabled={!selectedRegionId || adding}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white min-h-[52px] text-base font-semibold disabled:opacity-50"
            >
              {adding ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Check className="h-5 w-5 mr-2" />
              )}
              {selectedRegionId
                ? `Add ${brainRegions.find((r) => r.id === selectedRegionId)?.shortLabel || brainRegions.find((r) => r.id === selectedRegionId)?.label || "region"}`
                : "Pick a region above"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
