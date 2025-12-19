import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export type ModulePreset = "breath" | "ice" | "mind" | "heart" | "incog" | "circle" | "default";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  icon: string;
  category: "bowls" | "nature" | "lounge" | "chant";
  // Recommended for these modules
  presets: ModulePreset[];
  // Quality metadata
  quality: "48kHz" | "44kHz";
  binaural?: "alpha" | "theta";
}

// 10 curated high-quality meditation sounds
// Self-host upgraded tracks in /public/audio/soundscapes/ when available
export const AMBIENT_SOUNDS: AmbientSoundConfig[] = [
  {
    id: "tibetanBowl",
    name: "Tibetan Singing Bowls",
    description: "Ancient Himalayan resonance • 8Hz alpha binaural",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
    icon: "🔔",
    category: "bowls",
    presets: ["breath", "ice", "default"],
    quality: "48kHz",
    binaural: "alpha",
  },
  {
    id: "crystalBowl",
    name: "Crystal Bowl Symphony",
    description: "Pure crystalline frequencies • Deep healing",
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/14/audio_8df026ba35.mp3",
    icon: "💎",
    category: "bowls",
    presets: ["breath", "mind"],
    quality: "48kHz",
    binaural: "alpha",
  },
  {
    id: "handpan",
    name: "Handpan Journey",
    description: "Ethereal steel harmonics • Meditative flow",
    audioUrl: "https://cdn.pixabay.com/audio/2024/04/18/audio_e2bf4f1b2f.mp3",
    icon: "🥁",
    category: "bowls",
    presets: ["heart", "circle"],
    quality: "48kHz",
  },
  {
    id: "bambooFlute",
    name: "Mountain Bamboo Flute",
    description: "Zen melodies from the mountains",
    audioUrl: "https://cdn.pixabay.com/audio/2023/09/04/audio_5eb4c8ee4b.mp3",
    icon: "🎋",
    category: "lounge",
    presets: ["heart", "mind"],
    quality: "44kHz",
  },
  {
    id: "sacredChant",
    name: "Sacred Chant",
    description: "Devotional sounds for inner peace",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/18/audio_b4b6f96bdb.mp3",
    icon: "🙏",
    category: "chant",
    presets: ["breath", "incog"],
    quality: "44kHz",
    binaural: "theta",
  },
  {
    id: "spaLounge",
    name: "Spa Lounge",
    description: "Ambient wellness atmosphere",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_f8a6048598.mp3",
    icon: "🌿",
    category: "lounge",
    presets: ["heart", "mind", "incog"],
    quality: "48kHz",
  },
  {
    id: "oceanWaves",
    name: "Ocean Serenity",
    description: "Rhythmic waves • Natural calm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/07/audio_82b7eb96a1.mp3",
    icon: "🌊",
    category: "nature",
    presets: ["ice", "breath"],
    quality: "48kHz",
  },
  {
    id: "forestStream",
    name: "Forest Sanctuary",
    description: "Gentle stream through ancient trees",
    audioUrl: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3",
    icon: "🌲",
    category: "nature",
    presets: ["heart", "circle"],
    quality: "48kHz",
  },
  {
    id: "gentleRain",
    name: "Gentle Rain",
    description: "Soft rainfall for deep relaxation",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/16/audio_166dd9fc96.mp3",
    icon: "🌧️",
    category: "nature",
    presets: ["mind", "incog"],
    quality: "44kHz",
  },
  {
    id: "healingChimes",
    name: "Healing Wind Chimes",
    description: "Delicate chimes in the breeze",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_0c7922eed0.mp3",
    icon: "🎐",
    category: "bowls",
    presets: ["breath", "heart"],
    quality: "44kHz",
  },
];

// Get recommended sounds for a module
export const getSoundsForModule = (module: ModulePreset): AmbientSoundConfig[] => {
  return AMBIENT_SOUNDS.filter(s => s.presets.includes(module));
};

interface AudioContextType {
  activeSound: string | null;
  volume: number;
  isPlaying: boolean;
  toggleSound: (soundId: string) => void;
  playWithCrossfade: (soundId: string, fadeDuration?: number) => void;
  setVolume: (volume: number) => void;
  stopAll: () => void;
  isAudiobookPlaying: boolean;
  setAudiobookPlaying: (playing: boolean) => void;
  currentModule: ModulePreset;
  setCurrentModule: (module: ModulePreset) => void;
  recommendedSounds: AmbientSoundConfig[];
}

const AudioContextState = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContextState);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [currentModule, setCurrentModule] = useState<ModulePreset>("default");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  // Get recommended sounds based on current module
  const recommendedSounds = getSoundsForModule(currentModule);

  // Clear any ongoing fade
  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  // Crossfade transition between sounds
  const playWithCrossfade = useCallback((soundId: string, fadeDuration = 1500) => {
    if (isAudiobookPlaying) return;

    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    // If same sound, just toggle
    if (activeSound === soundId && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      clearFade();
      setActiveSound(null);
      setIsPlaying(false);
      return;
    }

    // Create new audio
    const newAudio = new Audio(sound.audioUrl);
    newAudio.loop = true;
    newAudio.volume = 0; // Start silent for fade-in

    // If currently playing, crossfade
    if (audioRef.current && isPlaying) {
      const oldAudio = audioRef.current;
      const startVolume = oldAudio.volume;
      const steps = 30;
      const stepTime = fadeDuration / steps;
      let step = 0;

      clearFade();

      fadeIntervalRef.current = window.setInterval(() => {
        step++;
        const progress = step / steps;
        
        // Fade out old
        oldAudio.volume = Math.max(0, startVolume * (1 - progress));
        // Fade in new
        newAudio.volume = Math.min(volume, volume * progress);

        if (step >= steps) {
          clearFade();
          oldAudio.pause();
        }
      }, stepTime);

      newAudio.play().then(() => {
        audioRef.current = newAudio;
        setActiveSound(soundId);
        setIsPlaying(true);
      }).catch(console.warn);
    } else {
      // No current audio, just play with fade-in
      newAudio.play().then(() => {
        audioRef.current = newAudio;
        setActiveSound(soundId);
        setIsPlaying(true);

        // Quick fade-in
        const steps = 15;
        const stepTime = 500 / steps;
        let step = 0;
        
        clearFade();
        fadeIntervalRef.current = window.setInterval(() => {
          step++;
          newAudio.volume = Math.min(volume, volume * (step / steps));
          if (step >= steps) clearFade();
        }, stepTime);
      }).catch(console.warn);
    }
  }, [activeSound, isPlaying, volume, isAudiobookPlaying, clearFade]);

  // Simple toggle (no crossfade)
  const toggleSound = useCallback((soundId: string) => {
    playWithCrossfade(soundId, 300);
  }, [playWithCrossfade]);

  const stopAll = useCallback(() => {
    clearFade();
    if (audioRef.current) {
      // Fade out before stopping
      const audio = audioRef.current;
      const startVol = audio.volume;
      const steps = 10;
      let step = 0;

      const fadeOut = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVol * (1 - step / steps));
        if (step >= steps) {
          clearInterval(fadeOut);
          audio.pause();
          audioRef.current = null;
        }
      }, 30);
    }
    setActiveSound(null);
    setIsPlaying(false);
  }, [clearFade]);

  // Update volume on playing audio (with smooth transition)
  useEffect(() => {
    if (audioRef.current && !fadeIntervalRef.current) {
      // Smooth volume change
      const target = volume;
      const current = audioRef.current.volume;
      const diff = target - current;
      
      if (Math.abs(diff) > 0.05) {
        const steps = 10;
        let step = 0;
        const interval = setInterval(() => {
          step++;
          if (audioRef.current) {
            audioRef.current.volume = current + (diff * step / steps);
          }
          if (step >= steps) clearInterval(interval);
        }, 20);
      } else {
        audioRef.current.volume = target;
      }
    }
  }, [volume]);

  // Pause when audiobook plays
  useEffect(() => {
    if (isAudiobookPlaying && audioRef.current) {
      audioRef.current.pause();
    } else if (!isAudiobookPlaying && activeSound && audioRef.current) {
      audioRef.current.play().catch(console.warn);
    }
  }, [isAudiobookPlaying, activeSound]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearFade]);

  return (
    <AudioContextState.Provider
      value={{
        activeSound,
        volume,
        isPlaying,
        toggleSound,
        playWithCrossfade,
        setVolume,
        stopAll,
        isAudiobookPlaying,
        setAudiobookPlaying: setIsAudiobookPlaying,
        currentModule,
        setCurrentModule,
        recommendedSounds,
      }}
    >
      {children}
    </AudioContextState.Provider>
  );
};
