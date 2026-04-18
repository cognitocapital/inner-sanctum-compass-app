import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";
import { Button } from "@/components/ui/button";

interface FogDayFallbackProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Generate a 2D top-down layout from the 3D positions so any new regions
// added in brainRegions.ts auto-appear on the fog-day map.
function buildLayout() {
  const W = 400;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  // 3D X is lateral (right +), Z is anterior (front +). Map to 2D top-down.
  return brainRegions.map((r) => {
    const px = cx + r.position[0] * 90;
    // Anterior in 3D = +Z; on a top-down 2D map, anterior is up (smaller y).
    const py = cy - r.position[2] * 100 - r.position[1] * 20;
    return { region: r, cx: px, cy: py, radius: 18 + (r.size?.[0] ?? 0.15) * 30 };
  });
}

export const FogDayFallback = ({ selectedId, onSelect }: FogDayFallbackProps) => {
  const [speaking, setSpeaking] = useState(false);
  const layout = buildLayout();

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (region: BrainRegion) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      `${region.label}. ${region.function} ${region.tbiSequelae}`
    );
    utter.rate = 0.92;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const selected = brainRegions.find((r) => r.id === selectedId);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-auto">
      <p className="text-amber-300 text-base font-medium mb-3">
        Fog Day Mode — simplified 2D view
      </p>
      <svg
        viewBox="0 0 400 480"
        className="max-w-full max-h-[60vh] w-auto"
        role="img"
        aria-label="Simplified brain region map"
      >
        {/* Brain outline (top-down) */}
        <ellipse
          cx={200}
          cy={240}
          rx={170}
          ry={210}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.4}
        />
        {/* Longitudinal fissure */}
        <line x1={200} y1={40} x2={200} y2={440} stroke="hsl(var(--border))" strokeWidth={1} opacity={0.25} />

        {layout.map(({ region, cx, cy, radius }) => {
          const isSelected = selectedId === region.id;
          return (
            <g key={region.id} onClick={() => onSelect(region.id)} className="cursor-pointer">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={region.color}
                fillOpacity={isSelected ? 0.85 : 0.32}
                stroke={region.color}
                strokeWidth={isSelected ? 3 : 1.2}
              />
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize={10}
                fontWeight={600}
                style={{ pointerEvents: "none" }}
              >
                {region.shortLabel || region.label.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="mt-4 text-center max-w-md">
          <p className="text-blue-100 text-sm mb-3">{selected.label}</p>
          <Button
            onClick={() => (speaking ? stopSpeaking() : speak(selected))}
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
          >
            {speaking ? (
              <>
                <VolumeX className="h-4 w-4 mr-2" /> Stop
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" /> Read aloud
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
