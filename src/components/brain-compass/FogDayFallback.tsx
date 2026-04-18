import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";
import { Button } from "@/components/ui/button";

interface FogDayFallbackProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const FogDayFallback = ({ selectedId, onSelect }: FogDayFallbackProps) => {
  const [speaking, setSpeaking] = useState(false);

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

  // Simple 2D ellipse layout — top-down view of the brain
  const layout: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
    dlpfc: { cx: 200, cy: 70, rx: 110, ry: 45 },
    ofc: { cx: 200, cy: 130, rx: 90, ry: 30 },
    amygdala_hippocampus: { cx: 200, cy: 200, rx: 70, ry: 35 },
    dmn: { cx: 200, cy: 250, rx: 80, ry: 30 },
    temporal: { cx: 80, cy: 200, rx: 50, ry: 70 },
    occipital: { cx: 200, cy: 320, rx: 110, ry: 45 },
    vestibular_cerebellum: { cx: 200, cy: 380, rx: 100, ry: 35 },
  };

  const selected = brainRegions.find((r) => r.id === selectedId);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <p className="text-amber-300 text-base font-medium mb-3">
        Fog Day Mode — simplified 2D view
      </p>
      <svg
        viewBox="0 0 400 440"
        className="max-w-full max-h-[60vh] w-auto"
        role="img"
        aria-label="Simplified brain region map"
      >
        {/* Skull outline */}
        <ellipse
          cx="200"
          cy="220"
          rx="180"
          ry="200"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.4"
        />
        {brainRegions.map((region) => {
          const l = layout[region.id];
          if (!l) return null;
          const isSelected = selectedId === region.id;
          return (
            <g
              key={region.id}
              onClick={() => onSelect(region.id)}
              className="cursor-pointer"
            >
              <ellipse
                cx={l.cx}
                cy={l.cy}
                rx={l.rx}
                ry={l.ry}
                fill={region.color}
                fillOpacity={isSelected ? 0.85 : 0.35}
                stroke={region.color}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x={l.cx}
                y={l.cy + 4}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="13"
                fontWeight="600"
                style={{ pointerEvents: "none" }}
              >
                {region.label.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="mt-4">
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
