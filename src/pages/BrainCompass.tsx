import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Cloud, Box, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import { brainRegions, REGION_CATEGORIES, type RegionCategory } from "@/data/brainRegions";
import { BrainCompass3D, type AffectedHighlight, type AffectedSeverity } from "@/components/brain-compass/BrainCompass3D";
import { RegionInfoCard } from "@/components/brain-compass/RegionInfoCard";
import { FogDayFallback } from "@/components/brain-compass/FogDayFallback";
import { PersonalScanOverlay } from "@/components/brain-compass/PersonalScanOverlay";
import { AffectedRegionsSelector } from "@/components/brain-compass/AffectedRegionsSelector";
import { useAffectedRegions } from "@/hooks/use-affected-regions";

const FOG_DAY_KEY = "fog-day-mode";

const BrainCompass = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fogDay, setFogDay] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const [deepView, setDeepView] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<RegionCategory | "all">("all");
  const infoCardRef = useRef<HTMLDivElement | null>(null);
  const { regions: affectedRows } = useAffectedRegions();

  const affectedMap = useMemo(() => {
    const map: Record<string, AffectedHighlight> = {};
    const rank: Record<string, number> = { mild: 1, unknown: 1, moderate: 2, severe: 3 };
    for (const r of affectedRows) {
      const sev = (r.severity ?? "unknown") as AffectedSeverity;
      const normalized: AffectedSeverity =
        sev === "mild" || sev === "moderate" || sev === "severe" ? sev : "unknown";
      const existing = map[r.region_id];
      if (!existing || (rank[normalized] ?? 0) > (rank[existing.severity] ?? 0)) {
        map[r.region_id] = { severity: normalized, source: r.source };
      }
    }
    return map;
  }, [affectedRows]);

  const handleSelectRegion = (id: string) => {
    setSelectedId(id);
    // Smoothly bring the info card into view so users see the description after tapping a chip/region.
    requestAnimationFrame(() => {
      infoCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const flag = localStorage.getItem(FOG_DAY_KEY);
      if (flag === "true") {
        setFogDay(true);
        setForceFallback(true);
      }
    } catch {
      /* no-op */
    }
  }, []);

  const selectedRegion = useMemo(
    () => brainRegions.find((r) => r.id === selectedId) ?? null,
    [selectedId]
  );

  // If the selected region is deep, automatically enable deep view
  useEffect(() => {
    if (selectedRegion?.deep && !deepView) setDeepView(true);
  }, [selectedRegion, deepView]);

  const useFallback = forceFallback;

  const visibleRegions = useMemo(
    () =>
      categoryFilter === "all"
        ? brainRegions
        : brainRegions.filter((r) => r.category === categoryFilter),
    [categoryFilter]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0a14] via-[#15101f] to-[#1a1208] text-amber-50 relative overflow-hidden">
      <SEOHead
        title="Phoenix Brain Compass — Clinical 3D TBI Atlas"
        description="Interactive 3D neuroanatomical atlas mapping how TBI affects 22 brain regions, linked to manuscript chapters, recovery protocols, and personalised AI insights."
        path="/brain-compass"
      />

      {/* Ambient phoenix ember glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-600/8 blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-rose-700/5 blur-3xl" />
      </div>

      {/* Disclaimer banner */}
      <div className="relative z-20 border-b border-amber-500/20 bg-amber-500/[0.04] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            Educational visualisation only — not medical advice. Consult your
            neurologist for any clinical decisions.
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <Button
            asChild
            variant="ghost"
            className="pl-0 text-amber-200/80 hover:text-amber-100 hover:bg-amber-500/10"
          >
            <Link to="/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="border-amber-400/40 text-amber-200 bg-amber-500/10 backdrop-blur-sm"
            >
              Beta — Not medical advice
            </Badge>
            <Button
              size="sm"
              variant="default"
              onClick={() => setDeepView((v) => !v)}
              className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-400 hover:to-orange-400 text-[#1a1208] font-semibold border border-amber-300/30 shadow-[0_0_20px_-6px_rgba(251,191,36,0.5)]"
              aria-pressed={deepView}
            >
              <Layers className="h-4 w-4 mr-1.5" />
              Deep View
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => setForceFallback((v) => !v)}
              className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-400 hover:to-orange-400 text-[#1a1208] font-semibold border border-amber-300/30 shadow-[0_0_20px_-6px_rgba(251,191,36,0.5)]"
              aria-label={forceFallback ? "Switch to 3D view" : "Switch to Fog Day 2D view"}
            >
              {forceFallback ? (
                <>
                  <Box className="h-4 w-4 mr-1.5" /> 3D
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 mr-1.5" /> Fog Day
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-amber-50">
            Phoenix Brain Compass
            <span className="text-amber-300/90"> — Clinical Edition</span>
          </h1>
          <p className="text-base md:text-lg text-amber-100/70 mt-2 max-w-3xl">
            A precise, evidence-informed atlas of the brain regions most affected
            by TBI — and how those changes show up in your daily life. Tap any
            region to see the science, the manuscript chapter, and the protocol
            that targets it.
            {fogDay && (
              <span className="block mt-1 text-amber-300 text-sm">
                Fog Day mode detected — using the simplified 2D view.
              </span>
            )}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === "all"
                ? "bg-amber-500 text-[#1a1208] border-amber-400 shadow-[0_0_16px_-4px_rgba(251,191,36,0.6)]"
                : "border-amber-500/20 text-amber-200/80 bg-[#0b0a14]/60 backdrop-blur-sm hover:bg-amber-500/10"
            }`}
          >
            All ({brainRegions.length})
          </button>
          {REGION_CATEGORIES.map((cat) => {
            const count = brainRegions.filter((r) => r.category === cat.id).length;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive ? "text-[#1a1208]" : "text-amber-100/80 bg-[#0b0a14]/60 backdrop-blur-sm hover:bg-amber-500/10"
                }`}
                style={
                  isActive
                    ? { backgroundColor: cat.color, borderColor: cat.color }
                    : { borderColor: `${cat.color}55` }
                }
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* 3D / 2D viewer */}
          <div className="rounded-2xl border border-amber-500/20 bg-[#0b0a14]/70 backdrop-blur-md overflow-hidden h-[60vh] min-h-[420px] lg:h-[70vh] relative shadow-[0_0_40px_-12px_rgba(251,191,36,0.25)]">
            {useFallback ? (
              <FogDayFallback selectedId={selectedId} onSelect={handleSelectRegion} />
            ) : (
              <BrainCompass3D
                selectedId={selectedId}
                onSelect={handleSelectRegion}
                fogDay={fogDay}
                deepView={deepView}
                categoryFilter={categoryFilter}
                affectedMap={affectedMap}
              />
            )}
            {!useFallback && deepView && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-100 text-xs font-semibold backdrop-blur-sm">
                Deep View — cortex transparent
              </div>
            )}
            {!useFallback && Object.keys(affectedMap).length > 0 && (
              <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg bg-[#0b0a14]/85 border border-amber-500/25 text-amber-50 text-[11px] backdrop-blur-md space-y-1">
                <div className="font-semibold text-amber-200/90 uppercase tracking-wider text-[10px]">
                  Your affected regions
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#34d399", boxShadow: "0 0 8px #34d399" }} />
                    Mild
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }} />
                    Moderate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f43f5e", boxShadow: "0 0 8px #f43f5e" }} />
                    Severe
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info card + Self-reported affected regions + Personal scan */}
          <div className="space-y-4" ref={infoCardRef}>
            <RegionInfoCard region={selectedRegion} />
            <AffectedRegionsSelector onRegionFocus={handleSelectRegion} />
            <PersonalScanOverlay
              onRegionFocus={handleSelectRegion}
              disabled={fogDay}
            />
          </div>
        </div>

        {/* Region selector chips */}
        <div className="mt-6">
          <h2 className="text-sm uppercase tracking-wider text-amber-300/70 font-semibold mb-3">
            Explore regions{" "}
            {categoryFilter !== "all" && (
              <span className="text-amber-400/60 normal-case">
                — filtered to {REGION_CATEGORIES.find((c) => c.id === categoryFilter)?.label}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap gap-2">
            {visibleRegions.map((region) => {
              const isActive = selectedId === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelectRegion(region.id)}
                  className={`px-3 py-2 rounded-full border text-sm transition-all ${
                    isActive
                      ? "text-[#1a1208] font-semibold"
                      : "text-amber-100/85 hover:bg-amber-500/10 border-amber-500/20 bg-[#0b0a14]/60 backdrop-blur-sm"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: region.color,
                          borderColor: region.color,
                          boxShadow: `0 0 20px -4px ${region.color}`,
                        }
                      : undefined
                  }
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full mr-2 align-middle"
                    style={{ backgroundColor: region.color }}
                  />
                  {region.shortLabel || region.label}
                  {region.deep && (
                    <span className="ml-1.5 text-[10px] opacity-60 align-middle">deep</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Persistent footer safety banner */}
      <div className="relative z-20 border-t border-amber-500/20 bg-amber-500/[0.04] backdrop-blur-md mt-6">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-amber-200/90">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Educational visualisation only — not diagnostic. Consult your neurologist for any clinical decision.
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrainCompass;
