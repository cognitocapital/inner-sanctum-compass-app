import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Cloud } from "lucide-react";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";
import { Button } from "@/components/ui/button";

interface FogDayFallbackProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Curated 12 highest-impact regions for Fog Day — keeps cognitive load low.
const FOG_DAY_REGION_IDS = [
  "dlpfc",
  "ofc",
  "acc",
  "insula",
  "amygdala",
  "hippocampus",
  "thalamus",
  "dmn",
  "vestibular",
  "cerebellum",
  "brainstem",
  "occipital",
];

interface View {
  id: "sagittal" | "coronal";
  label: string;
}

const VIEWS: View[] = [
  { id: "sagittal", label: "Side view" },
  { id: "coronal", label: "Front view" },
];

// Map a 3D region position into 2D coords for each view.
// Sagittal = side view (Z anterior+ → x_screen, Y up → y_screen)
// Coronal  = front view (X lateral → x_screen, Y up → y_screen)
function project(region: BrainRegion, view: View["id"]) {
  const W = 480;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2;
  if (view === "sagittal") {
    return {
      x: cx + region.position[2] * 130,
      y: cy - region.position[1] * 130,
    };
  }
  return {
    x: cx + region.position[0] * 130,
    y: cy - region.position[1] * 130,
  };
}

export const FogDayFallback = ({ selectedId, onSelect }: FogDayFallbackProps) => {
  const [speaking, setSpeaking] = useState(false);
  const [view, setView] = useState<View["id"]>("sagittal");

  const regions = useMemo(
    () =>
      FOG_DAY_REGION_IDS.map((id) => brainRegions.find((r) => r.id === id)).filter(
        (r): r is BrainRegion => Boolean(r)
      ),
    []
  );

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    []
  );

  const speak = (region: BrainRegion) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      `${region.label}. ${region.function} ${region.tbiSequelae}`
    );
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const selected = brainRegions.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 sm:p-6 overflow-auto">
      <div className="flex items-center gap-2 mb-3 text-amber-300">
        <Cloud className="h-4 w-4" />
        <p className="text-base font-medium">Fog Day Mode — calm 2D atlas</p>
      </div>

      {/* View toggle — 56px tap targets */}
      <div className="flex gap-2 mb-4">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`min-h-[44px] px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
              view === v.id
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "border-amber-500/30 text-amber-200 bg-slate-950/40 hover:bg-amber-500/10"
            }`}
            aria-pressed={view === v.id}
          >
            {v.label}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 480 360"
        className="w-full max-w-2xl h-auto"
        role="img"
        aria-label={`Simplified ${view} brain map with 12 key regions`}
      >
        {/* Brain outline */}
        {view === "sagittal" ? (
          <path
            d="M 90 200 Q 90 90 230 70 Q 380 70 400 160 Q 410 230 360 270 Q 300 300 230 295 Q 140 290 110 250 Q 90 230 90 200 Z"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.45}
          />
        ) : (
          <ellipse
            cx={240}
            cy={180}
            rx={170}
            ry={140}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.45}
          />
        )}
        {view === "coronal" && (
          <line
            x1={240}
            y1={50}
            x2={240}
            y2={310}
            stroke="hsl(var(--border))"
            strokeWidth={1}
            opacity={0.25}
          />
        )}

        {regions.map((region) => {
          const { x, y } = project(region, view);
          const isSelected = selectedId === region.id;
          return (
            <g
              key={region.id}
              onClick={() => onSelect(region.id)}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={region.label}
            >
              {/* 56px effective tap target via invisible hitbox */}
              <circle cx={x} cy={y} r={28} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 18 : 14}
                fill={region.color}
                fillOpacity={isSelected ? 0.85 : 0.4}
                stroke={region.color}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize={11}
                fontWeight={700}
                style={{ pointerEvents: "none" }}
              >
                {region.shortLabel || region.label.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="mt-4 w-full max-w-2xl rounded-xl border border-amber-500/30 bg-slate-950/60 p-4">
          <p className="text-amber-100 text-base font-semibold">{selected.label}</p>
          <p className="text-blue-100/90 text-sm mt-1">{selected.function}</p>
          <p className="text-blue-200/80 text-sm mt-2 leading-relaxed">{selected.tbiSequelae}</p>
          <Button
            onClick={() => (speaking ? stopSpeaking() : speak(selected))}
            variant="outline"
            className="mt-3 min-h-[56px] w-full sm:w-auto border-amber-500/40 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20 text-base"
          >
            {speaking ? (
              <>
                <VolumeX className="h-5 w-5 mr-2" /> Stop reading
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" /> Listen to this region
              </>
            )}
          </Button>
        </div>
      )}

      <p className="text-[11px] text-amber-300/70 italic mt-4 text-center max-w-md">
        Educational visualisation only — not diagnostic. Consult your neurologist.
      </p>
    </div>
  );
};
