import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Cloud, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import { brainRegions } from "@/data/brainRegions";
import { BrainCompass3D } from "@/components/brain-compass/BrainCompass3D";
import { RegionInfoCard } from "@/components/brain-compass/RegionInfoCard";
import { FogDayFallback } from "@/components/brain-compass/FogDayFallback";

const FOG_DAY_KEY = "fog-day-mode";

const BrainCompass = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fogDay, setFogDay] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);

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

  const useFallback = forceFallback;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-blue-50 relative overflow-hidden">
      <SEOHead
        title="Phoenix Brain Compass — Clinical 3D TBI Atlas"
        description="Interactive 3D neuroanatomical atlas mapping how TBI affects key brain regions, linked to manuscript chapters and recovery protocols."
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
        <div className="flex items-center justify-between gap-4 mb-6">
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
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-300 bg-amber-500/5"
            >
              Beta — Not medical advice
            </Badge>
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
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Phoenix Brain Compass
            <span className="text-blue-400"> — Clinical Edition</span>
          </h1>
          <p className="text-base md:text-lg text-blue-200/80 mt-2 max-w-3xl">
            A precise, evidence-informed atlas of the brain regions most affected
            by TBI — and how those changes show up in daily life.
            {fogDay && (
              <span className="block mt-1 text-amber-300 text-sm">
                Fog Day mode detected — using the simplified 2D view.
              </span>
            )}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* 3D / 2D viewer */}
          <div className="rounded-2xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-sm overflow-hidden h-[60vh] min-h-[420px] lg:h-[70vh]">
            {useFallback ? (
              <FogDayFallback selectedId={selectedId} onSelect={setSelectedId} />
            ) : (
              <BrainCompass3D
                selectedId={selectedId}
                onSelect={setSelectedId}
                fogDay={fogDay}
              />
            )}
          </div>

          {/* Info card */}
          <div className="space-y-4">
            <RegionInfoCard region={selectedRegion} />
          </div>
        </div>

        {/* Region selector chips */}
        <div className="mt-6">
          <h2 className="text-sm uppercase tracking-wider text-blue-300/70 font-semibold mb-3">
            Explore regions
          </h2>
          <div className="flex flex-wrap gap-2">
            {brainRegions.map((region) => {
              const isActive = selectedId === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedId(region.id)}
                  className={`px-3 py-2 rounded-full border text-sm transition-all ${
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
                  {region.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainCompass;
