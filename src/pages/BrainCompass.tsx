import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Cloud, Box, Layers, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/seo/SEOHead";
import { brainRegions, REGION_CATEGORIES, type RegionCategory } from "@/data/brainRegions";
import { extendedAtlasRegions, EXTENDED_ATLAS_VERSION } from "@/data/extendedAtlas";
import { BrainCompass3D } from "@/components/brain-compass/BrainCompass3D";
import { RegionInfoCard } from "@/components/brain-compass/RegionInfoCard";
import { FogDayFallback } from "@/components/brain-compass/FogDayFallback";
import { PersonalScanOverlay } from "@/components/brain-compass/PersonalScanOverlay";

const FOG_DAY_KEY = "fog-day-mode";
const ATLAS_CACHE_KEY = `phoenix-atlas-cache-${EXTENDED_ATLAS_VERSION}`;
const TOTAL_REGIONS = brainRegions.length + extendedAtlasRegions.length;

const BrainCompass = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fogDay, setFogDay] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const [deepView, setDeepView] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<RegionCategory | "all">("all");
  const [showFullAtlas, setShowFullAtlas] = useState(false);
  const [search, setSearch] = useState("");

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

  // Offline atlas cache — primes localStorage with the atlas version so the
  // app can fall back to the last-good dataset if a future deploy fails.
  useEffect(() => {
    try {
      const cached = localStorage.getItem(ATLAS_CACHE_KEY);
      if (!cached) {
        localStorage.setItem(
          ATLAS_CACHE_KEY,
          JSON.stringify({
            version: EXTENDED_ATLAS_VERSION,
            curatedCount: brainRegions.length,
            extendedCount: extendedAtlasRegions.length,
            cachedAt: Date.now(),
          })
        );
      }
    } catch {
      /* localStorage may be unavailable */
    }
  }, []);

  // Resolve selection from EITHER curated regions OR extended atlas (which routes back to its parent).
  const selectedRegion = useMemo(() => {
    const curated = brainRegions.find((r) => r.id === selectedId);
    if (curated) return curated;
    const ext = extendedAtlasRegions.find((r) => r.id === selectedId);
    if (ext) return brainRegions.find((c) => c.id === ext.parentId) ?? null;
    return null;
  }, [selectedId]);

  // If the selected region is deep, automatically enable deep view
  useEffect(() => {
    if (selectedRegion?.deep && !deepView) setDeepView(true);
  }, [selectedRegion, deepView]);

  const useFallback = forceFallback;

  const curatedVisible = useMemo(
    () =>
      categoryFilter === "all"
        ? brainRegions
        : brainRegions.filter((r) => r.category === categoryFilter),
    [categoryFilter]
  );

  // Extended atlas chips, optionally filtered by category + search query
  const extendedVisible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return extendedAtlasRegions.filter((r) => {
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        r.label.toLowerCase().includes(q) ||
        (r.shortLabel?.toLowerCase().includes(q) ?? false) ||
        (r.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false)
      );
    });
  }, [categoryFilter, search]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-blue-50 relative overflow-hidden">
      <SEOHead
        title="Phoenix Brain Compass — Clinical 3D TBI Atlas"
        description={`Interactive 3D neuroanatomical atlas mapping how TBI affects ${TOTAL_REGIONS}+ brain regions across MNI-152 / Harvard-Oxford / Julich-Brain atlases, with personal scan overlay and AI insights.`}
        path="/brain-compass"
      />

      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      {/* Disclaimer banner */}
      <div className="relative z-20 border-b border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
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
            className="pl-0 text-blue-200 hover:text-white hover:bg-blue-500/10"
          >
            <Link to="/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-300 bg-amber-500/5"
            >
              Beta — Not medical advice
            </Badge>
            <Button
              size="sm"
              variant={deepView ? "default" : "outline"}
              onClick={() => setDeepView((v) => !v)}
              className={
                deepView
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "border-pink-500/30 text-pink-200 hover:bg-pink-500/10 hover:text-white"
              }
              aria-pressed={deepView}
            >
              <Layers className="h-4 w-4 mr-1.5" />
              Deep View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setForceFallback((v) => !v)}
              className="border-blue-500/30 text-blue-200 hover:bg-blue-500/10 hover:text-white"
              aria-label={useFallback ? "Switch to 3D view" : "Switch to Fog Day 2D view"}
            >
              {useFallback ? (
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
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Phoenix Brain Compass
              <span className="text-blue-400"> — Clinical Edition</span>
            </h1>
            <Badge variant="outline" className="border-blue-500/40 text-blue-200 bg-blue-500/5">
              {TOTAL_REGIONS}+ regions · MNI-152
            </Badge>
          </div>
          <p className="text-base md:text-lg text-blue-200/80 mt-2 max-w-3xl">
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
                ? "bg-blue-500 text-white border-blue-500"
                : "border-blue-500/30 text-blue-200 bg-slate-950/40 hover:bg-blue-500/10"
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
                  isActive ? "text-slate-950" : "text-blue-200 bg-slate-950/40 hover:bg-blue-500/10"
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
          <div className="rounded-2xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm overflow-hidden h-[60vh] min-h-[420px] lg:h-[70vh] relative">
            {useFallback ? (
              <FogDayFallback selectedId={selectedId} onSelect={setSelectedId} />
            ) : (
              <BrainCompass3D
                selectedId={selectedId}
                onSelect={setSelectedId}
                fogDay={fogDay}
                deepView={deepView}
                categoryFilter={categoryFilter}
              />
            )}
            {!useFallback && deepView && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-pink-500/20 border border-pink-400/40 text-pink-100 text-xs font-semibold backdrop-blur-sm">
                Deep View — cortex transparent
              </div>
            )}
          </div>

          {/* Info card + Personal scan */}
          <div className="space-y-4">
            <RegionInfoCard region={selectedRegion} />
            <PersonalScanOverlay
              onRegionFocus={setSelectedId}
              disabled={fogDay}
            />
          </div>
        </div>

        {/* Region selector chips */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <h2 className="text-sm uppercase tracking-wider text-blue-300/70 font-semibold">
              Explore regions{" "}
              <span className="text-blue-400/60 normal-case">
                — {curatedVisible.length} curated · {extendedVisible.length} of {extendedAtlasRegions.length} extended
                {categoryFilter !== "all" && (
                  <> · filtered to {REGION_CATEGORIES.find((c) => c.id === categoryFilter)?.label}</>
                )}
              </span>
            </h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFullAtlas((v) => !v)}
              className="text-blue-200 hover:bg-blue-500/10 min-h-[44px]"
            >
              {showFullAtlas ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              {showFullAtlas ? "Hide" : "Show"} full atlas ({TOTAL_REGIONS}+)
            </Button>
          </div>

          {/* Curated chips — always visible */}
          <div className="flex flex-wrap gap-2">
            {curatedVisible.map((region) => {
              const isActive = selectedId === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedId(region.id)}
                  className={`px-3.5 py-2.5 rounded-full border text-sm transition-all min-h-[44px] ${
                    isActive
                      ? "text-slate-950 font-semibold"
                      : "text-blue-100 hover:bg-blue-500/10 border-blue-500/30 bg-slate-950/40"
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

          {/* Extended atlas — collapsible to manage cognitive load */}
          {showFullAtlas && (
            <div className="mt-4 rounded-xl border border-blue-500/20 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-300/60" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Harvard-Oxford / Julich-Brain / AAL3 labels…"
                  className="bg-slate-900/60 border-blue-500/20 text-blue-50 placeholder:text-blue-300/40 h-11"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[280px] overflow-y-auto pr-1">
                {extendedVisible.length === 0 && (
                  <p className="text-xs text-blue-300/60 italic px-2 py-3">No matches.</p>
                )}
                {extendedVisible.slice(0, 200).map((r) => {
                  const parent = brainRegions.find((c) => c.id === r.parentId);
                  const isActive = selectedId === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`px-2.5 py-1.5 rounded-md border text-[12px] transition min-h-[36px] ${
                        isActive
                          ? "bg-blue-500/30 border-blue-400 text-white"
                          : "bg-slate-900/60 border-blue-500/15 text-blue-100/90 hover:bg-blue-500/10"
                      }`}
                      title={`${r.label} · ${r.source} → ${parent?.shortLabel || parent?.label || ""}`}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle"
                        style={{ backgroundColor: parent?.color ?? "#60a5fa" }}
                      />
                      {r.shortLabel || r.label}
                    </button>
                  );
                })}
                {extendedVisible.length > 200 && (
                  <span className="text-[11px] text-blue-300/60 self-center pl-2">
                    +{extendedVisible.length - 200} more — refine search
                  </span>
                )}
              </div>
              <p className="text-[10px] text-blue-300/50 italic">
                Sources: Harvard-Oxford · Julich-Brain · AAL3 · Yeo-7 · JHU-DTI. Each label routes to the closest curated region for manuscript & protocol guidance. Educational visualisation only.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrainCompass;
