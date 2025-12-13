import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  icon?: React.ReactNode;
  color: string;
}

// Curated free ambient sounds (royalty-free URLs from freesound.org alternatives or embedded)
export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  breath: {
    id: "breath",
    name: "Ocean Waves",
    description: "Gentle ocean waves for breathing exercises",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3",
    color: "from-orange-500 to-red-500"
  },
  ice: {
    id: "ice",
    name: "Arctic Wind",
    description: "Crisp wind sounds for cold exposure focus",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_6be98be124.mp3",
    color: "from-cyan-500 to-blue-600"
  },
  computer: {
    id: "computer",
    name: "Neural Focus",
    description: "Ambient electronic tones for cognitive training",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    color: "from-indigo-500 to-blue-600"
  },
  mind: {
    id: "mind",
    name: "Deep Meditation",
    description: "Tibetan bowls for mental clarity",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/23/audio_ea70ad08e3.mp3",
    color: "from-purple-500 to-red-600"
  },
  heart: {
    id: "heart",
    name: "Gentle Chimes",
    description: "Soft wind chimes for emotional healing",
    audioUrl: "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630c2a50.mp3",
    color: "from-pink-500 to-red-500"
  },
  incog: {
    id: "incog",
    name: "Focus Frequencies",
    description: "Binaural beats for cognitive rehabilitation",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/30/audio_f9d5ccb507.mp3",
    color: "from-emerald-500 to-teal-600"
  },
  circle: {
    id: "circle",
    name: "Community Warmth",
    description: "Ambient nature sounds for connection",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dae668d83.mp3",
    color: "from-teal-500 to-blue-600"
  }
};

interface AmbientSoundPlayerProps {
  soundId: keyof typeof AMBIENT_SOUNDS;
  className?: string;
  compact?: boolean;
  autoPlay?: boolean;
}

export const AmbientSoundPlayer = ({
  soundId,
  className,
  compact = false,
  autoPlay = false
}: AmbientSoundPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sound = AMBIENT_SOUNDS[soundId];

  useEffect(() => {
    const audio = new Audio(sound.audioUrl);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = "metadata";
    
    audio.addEventListener("canplaythrough", () => setIsLoaded(true));
    audio.addEventListener("error", () => setIsLoaded(false));
    
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [sound.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (autoPlay && isLoaded && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay was blocked
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [autoPlay, isLoaded]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  if (compact) {
    return (
      <Button
        onClick={togglePlay}
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity",
          isPlaying && "text-primary animate-pulse",
          className
        )}
        title={`${sound.name}: ${sound.description}`}
      >
        {isPlaying ? (
          <Volume2 className="h-3 w-3" />
        ) : (
          <VolumeX className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">{isPlaying ? "Playing" : "Ambient"}</span>
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
        onClick={togglePlay}
        size="sm"
        className={cn(
          "bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
          sound.color,
          isPlaying && "animate-pulse"
        )}
      >
        {isPlaying ? (
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
          onValueChange={handleVolumeChange}
          max={1}
          step={0.1}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

// Global ambient control for dashboard
interface DashboardAmbientControlProps {
  className?: string;
}

export const DashboardAmbientControl = ({ className }: DashboardAmbientControlProps) => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [globalVolume, setGlobalVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const toggleSound = async (soundId: string) => {
    const audio = audioRefs.current.get(soundId);
    
    if (!audio) {
      const newAudio = new Audio(AMBIENT_SOUNDS[soundId].audioUrl);
      newAudio.loop = true;
      newAudio.volume = globalVolume;
      audioRefs.current.set(soundId, newAudio);
      
      try {
        await newAudio.play();
        setActiveSounds(prev => new Set([...prev, soundId]));
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    } else if (activeSounds.has(soundId)) {
      audio.pause();
      setActiveSounds(prev => {
        const next = new Set(prev);
        next.delete(soundId);
        return next;
      });
    } else {
      try {
        await audio.play();
        setActiveSounds(prev => new Set([...prev, soundId]));
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    }
  };

  useEffect(() => {
    audioRefs.current.forEach(audio => {
      audio.volume = globalVolume;
    });
  }, [globalVolume]);

  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {isExpanded && (
        <div className="mb-3 p-4 bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl animate-fade-in max-w-xs">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Music className="h-4 w-4 text-primary" />
            Ambient Soundscapes
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(AMBIENT_SOUNDS).map(([id, sound]) => (
              <button
                key={id}
                onClick={() => toggleSound(id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left",
                  activeSounds.has(id)
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br",
                    sound.color,
                    activeSounds.has(id) && "animate-pulse"
                  )}
                >
                  {activeSounds.has(id) ? (
                    <Volume2 className="h-4 w-4 text-white" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-white/70" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{sound.name}</p>
                  <p className="text-xs text-white/50 truncate">{sound.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-white/60" />
              <Slider
                value={[globalVolume]}
                onValueChange={(v) => setGlobalVolume(v[0])}
                max={1}
                step={0.1}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 transition-all hover:scale-110",
          activeSounds.size > 0 && "ring-2 ring-primary ring-offset-2 ring-offset-black animate-pulse"
        )}
      >
        {activeSounds.size > 0 ? (
          <Volume2 className="h-6 w-6" />
        ) : (
          <Music className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};
