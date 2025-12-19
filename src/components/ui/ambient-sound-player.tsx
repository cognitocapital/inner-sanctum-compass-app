import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAudio, AMBIENT_SOUNDS } from "@/contexts/AudioContext";

interface AmbientSoundPlayerProps {
  soundId: string;
  className?: string;
  compact?: boolean;
}

export const AmbientSoundPlayer = ({
  soundId,
  className,
  compact = false
}: AmbientSoundPlayerProps) => {
  const { activeSound, isPlaying, toggleSound, volume, setVolume } = useAudio();
  const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
  
  if (!sound) return null;
  
  const isSoundPlaying = activeSound === soundId && isPlaying;

  if (compact) {
    return (
      <Button
        onClick={() => toggleSound(soundId)}
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity",
          isSoundPlaying && "text-primary animate-pulse",
          className
        )}
        title={`${sound.name}: ${sound.description}`}
      >
        {isSoundPlaying ? (
          <Volume2 className="h-3 w-3" />
        ) : (
          <VolumeX className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">{isSoundPlaying ? "Playing" : "Ambient"}</span>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10",
        className
      )}
    >
      <Button
        onClick={() => toggleSound(soundId)}
        size="sm"
        className={cn(
          "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all",
          isSoundPlaying && "animate-pulse"
        )}
      >
        {isSoundPlaying ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <Music className="h-4 w-4" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{sound.name}</p>
        <p className="text-xs text-white/60 truncate">{sound.description}</p>
      </div>
      
      <div className="w-20 hidden sm:block">
        <Slider
          value={[volume]}
          onValueChange={(v) => setVolume(v[0])}
          max={1}
          step={0.1}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AmbientSoundPlayer;
