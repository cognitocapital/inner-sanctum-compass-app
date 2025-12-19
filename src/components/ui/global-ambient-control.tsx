import { useState } from "react";
import { Volume2, VolumeX, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAudio, AMBIENT_SOUNDS } from "@/contexts/AudioContext";

export const GlobalAmbientControl = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeSound, volume, isPlaying, toggleSound, setVolume, isAudiobookPlaying } = useAudio();

  const activeConfig = AMBIENT_SOUNDS.find(s => s.id === activeSound);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-3 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-orange-500/30 shadow-2xl animate-fade-in w-72">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">Soundscapes</h3>
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

          {/* Sound Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {AMBIENT_SOUNDS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                disabled={isAudiobookPlaying}
                className={cn(
                  "flex flex-col items-center p-2 rounded-xl transition-all",
                  activeSound === sound.id && isPlaying
                    ? "bg-orange-500/30 border border-orange-500/50 scale-105"
                    : "bg-white/5 hover:bg-white/10 border border-transparent",
                  isAudiobookPlaying && "opacity-50 cursor-not-allowed"
                )}
                title={sound.name}
              >
                <span className="text-xl mb-1">{sound.icon}</span>
                <span className="text-[10px] text-white/70 truncate w-full text-center">
                  {sound.name}
                </span>
              </button>
            ))}
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-white/60 shrink-0" />
            <Slider
              value={[volume]}
              onValueChange={(v) => setVolume(v[0])}
              max={1}
              step={0.05}
              className="flex-1"
            />
            <span className="text-xs text-white/60 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
          
          {/* Now Playing */}
          {activeConfig && isPlaying && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-orange-300 flex items-center gap-2">
                <span className="animate-pulse">♪</span>
                Now playing: {activeConfig.name}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Floating Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "rounded-full w-12 h-12 shadow-2xl transition-all hover:scale-110",
          activeSound && isPlaying
            ? "bg-gradient-to-br from-orange-500 to-orange-600 ring-2 ring-orange-400/50"
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
