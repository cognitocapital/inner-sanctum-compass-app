import { useState } from "react";
import { Volume2, Music, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAudio, AMBIENT_SOUNDS, type ModulePreset } from "@/contexts/AudioContext";

const MODULE_LABELS: Record<ModulePreset, string> = {
  breath: "Phoenix Breath",
  ice: "Ice Warrior",
  mind: "Phoenix Mind",
  heart: "Phoenix Heart",
  incog: "INCOG Arsenal",
  circle: "Phoenix Circle",
  default: "All Sounds",
};

export const GlobalAmbientControl = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    activeSound, 
    volume, 
    isPlaying, 
    playWithCrossfade, 
    setVolume, 
    isAudiobookPlaying,
    currentModule,
    recommendedSounds,
  } = useAudio();

  const activeConfig = AMBIENT_SOUNDS.find(s => s.id === activeSound);
  
  // Show recommended sounds first, then others
  const displaySounds = currentModule !== "default" 
    ? [...recommendedSounds, ...AMBIENT_SOUNDS.filter(s => !recommendedSounds.includes(s))]
    : AMBIENT_SOUNDS;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-3 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-orange-500/30 shadow-2xl animate-fade-in w-80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-medium text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400" />
                Soundscapes
              </h3>
              <p className="text-[10px] text-white/50">
                {currentModule !== "default" 
                  ? `Curated for ${MODULE_LABELS[currentModule]}`
                  : "48kHz • Binaural • Seamless loops"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isAudiobookPlaying && (
            <div className="mb-3 p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <p className="text-xs text-orange-200">Paused while audiobook plays</p>
            </div>
          )}

          {/* Recommended badge */}
          {currentModule !== "default" && recommendedSounds.length > 0 && (
            <div className="mb-2 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
              <p className="text-[10px] text-orange-300">✨ Recommended for this module</p>
            </div>
          )}

          {/* Sound Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
            {displaySounds.map((sound, index) => {
              const isActive = activeSound === sound.id && isPlaying;
              const isRecommended = recommendedSounds.includes(sound);
              const showDivider = currentModule !== "default" && 
                index === recommendedSounds.length && 
                recommendedSounds.length > 0;
              
              return (
                <div key={sound.id}>
                  {showDivider && (
                    <div className="col-span-2 py-1">
                      <div className="border-t border-white/10" />
                      <p className="text-[9px] text-white/30 mt-1">Other sounds</p>
                    </div>
                  )}
                  <button
                    onClick={() => playWithCrossfade(sound.id)}
                    disabled={isAudiobookPlaying}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-xl transition-all text-left",
                      isActive
                        ? "bg-orange-500/30 border border-orange-500/50"
                        : isRecommended && currentModule !== "default"
                        ? "bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20"
                        : "bg-white/5 hover:bg-white/10 border border-transparent",
                      isAudiobookPlaying && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="text-lg">{sound.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{sound.name}</p>
                      <p className="text-[9px] text-white/50 truncate">{sound.description}</p>
                    </div>
                    {isActive && (
                      <div className="flex gap-0.5 shrink-0">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-0.5 bg-orange-400 rounded-full animate-pulse"
                            style={{ 
                              height: `${8 + Math.sin(Date.now() / 200 + i) * 4}px`,
                              animationDelay: `${i * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="h-4 w-4 text-white/60 shrink-0" />
            <Slider
              value={[volume]}
              onValueChange={(v) => setVolume(v[0])}
              max={1}
              step={0.02}
              className="flex-1"
            />
            <span className="text-xs text-white/60 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
          
          {/* Now Playing */}
          {activeConfig && isPlaying && (
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeConfig.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-orange-300 truncate">{activeConfig.name}</p>
                  <div className="flex gap-2 text-[9px] text-white/40">
                    <span>{activeConfig.quality}</span>
                    {activeConfig.binaural && <span>• {activeConfig.binaural} waves</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Link to full page */}
          <Link 
            to="/meditation" 
            className="block mt-3 text-center text-xs text-orange-400/80 hover:text-orange-400 transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Open full Soundscapes →
          </Link>
        </div>
      )}
      
      {/* Floating Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "rounded-full w-12 h-12 shadow-2xl transition-all hover:scale-110",
          activeSound && isPlaying
            ? "bg-gradient-to-br from-orange-500 to-orange-600 ring-2 ring-orange-400/50 ring-offset-2 ring-offset-transparent"
            : "bg-gradient-to-br from-gray-700 to-gray-900 hover:from-orange-500 hover:to-orange-600",
          isAudiobookPlaying && !isPlaying && "opacity-60"
        )}
      >
        {isExpanded ? (
          <X className="h-5 w-5" />
        ) : activeSound && isPlaying ? (
          <Volume2 className="h-5 w-5 animate-pulse" />
        ) : (
          <Music className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};
