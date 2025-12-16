import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

// Sound categories for organization
export type SoundCategory = "nature" | "binaural" | "therapeutic";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  color: string;
  category: SoundCategory;
  frequency?: string;
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
  manuscriptQuanta?: string;
}

export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  // Nature sounds - using reliable CDN sources
  breath: {
    id: "breath",
    name: "Ocean Waves",
    description: "Gentle ocean waves for breathing exercises",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce99.mp3",
    color: "from-orange-500 to-red-500",
    category: "nature",
    therapeuticUse: ["relaxation", "breathing"],
    manuscriptQuanta: "Ch3: The overwhelming chaos that eventually gives way to peace"
  },
  ice: {
    id: "ice",
    name: "Arctic Wind",
    description: "Crisp wind sounds for cold exposure focus",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
    color: "from-cyan-500 to-blue-600",
    category: "nature",
    therapeuticUse: ["alertness", "grounding"],
    manuscriptQuanta: "Ch4: Slow comeback, learning resilience"
  },
  circle: {
    id: "circle",
    name: "Forest Sanctuary",
    description: "Ambient nature sounds for connection",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    color: "from-teal-500 to-blue-600",
    category: "nature",
    therapeuticUse: ["stress-reduction", "grounding"],
    manuscriptQuanta: "Intro: Gratitude for the journey"
  },
  rain: {
    id: "rain",
    name: "Gentle Rain",
    description: "Calming rain sounds for relaxation",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/16/audio_1333c3bad0.mp3",
    color: "from-slate-500 to-blue-600",
    category: "nature",
    therapeuticUse: ["sleep", "calm"],
    manuscriptQuanta: "Finding peace in the storm"
  },
  
  // Binaural beats - INCOG Level A evidence
  thetaVertigo: {
    id: "thetaVertigo",
    name: "Theta Balance",
    description: "Theta waves (4-7Hz) for vestibular calm",
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/22/audio_d7ed0b9025.mp3",
    color: "from-violet-500 to-purple-700",
    category: "binaural",
    frequency: "7Hz Theta",
    therapeuticUse: ["vertigo", "balance", "vestibular"],
    incogLevel: "A",
    manuscriptQuanta: "Ch4: Vertigo slowly subsides"
  },
  alphaCalm: {
    id: "alphaCalm",
    name: "Alpha Serenity",
    description: "Alpha waves (8-12Hz) for anxiety relief & calm",
    audioUrl: "https://cdn.pixabay.com/audio/2023/10/14/audio_e5f03d41be.mp3",
    color: "from-blue-400 to-indigo-600",
    category: "binaural",
    frequency: "10Hz Alpha",
    therapeuticUse: ["anxiety", "calm", "emotional-regulation"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: The roller coaster of anxiety that finds stillness"
  },
  betaFocus: {
    id: "betaFocus",
    name: "Beta Focus",
    description: "Beta waves (15-20Hz) for attention & executive function",
    audioUrl: "https://cdn.pixabay.com/audio/2024/04/24/audio_6c4f20c1ed.mp3",
    color: "from-amber-400 to-orange-600",
    category: "binaural",
    frequency: "18Hz Beta",
    therapeuticUse: ["attention", "focus", "executive-function"],
    incogLevel: "A",
    manuscriptQuanta: "Mind training through dedicated practice"
  },
  
  // Therapeutic sounds
  mind: {
    id: "mind",
    name: "Tibetan Resonance",
    description: "432Hz Tibetan bowls for mental clarity",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/07/audio_b9bd4170e4.mp3",
    color: "from-purple-500 to-red-600",
    category: "therapeutic",
    frequency: "432Hz",
    therapeuticUse: ["meditation", "clarity", "mindfulness"],
    incogLevel: "B",
    manuscriptQuanta: "Deep meditation and inner peace"
  },
  heart: {
    id: "heart",
    name: "Heart Coherence",
    description: "Soft melodies for emotional healing & HRV",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/25/audio_4f3b0a816e.mp3",
    color: "from-pink-500 to-red-500",
    category: "therapeutic",
    therapeuticUse: ["emotional-healing", "heart-coherence", "gratitude"],
    incogLevel: "B",
    manuscriptQuanta: "Heart-centered gratitude and emotional recovery"
  },
  computer: {
    id: "computer",
    name: "Neural Flow",
    description: "Ambient electronic tones for cognitive training",
    audioUrl: "https://cdn.pixabay.com/audio/2023/07/21/audio_ee2de6d99c.mp3",
    color: "from-indigo-500 to-blue-600",
    category: "therapeutic",
    therapeuticUse: ["cognitive-training", "neuroplasticity"],
    incogLevel: "B",
    manuscriptQuanta: "Rebuilding neural pathways"
  }
};

interface AudioContextType {
  // Ambient sounds
  activeSounds: Set<string>;
  globalVolume: number;
  toggleSound: (soundId: string) => Promise<void>;
  setGlobalVolume: (volume: number) => void;
  pauseAllAmbient: () => void;
  resumeAllAmbient: () => void;
  
  // Audiobook state
  isAudiobookPlaying: boolean;
  setAudiobookPlaying: (playing: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [globalVolume, setGlobalVolume] = useState(0.3);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [pausedSounds, setPausedSounds] = useState<Set<string>>(new Set());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Pause all ambient sounds when audiobook starts
  useEffect(() => {
    if (isAudiobookPlaying) {
      // Store currently playing sounds and pause them
      const currentlyPlaying = new Set(activeSounds);
      setPausedSounds(currentlyPlaying);
      
      audioRefs.current.forEach((audio, soundId) => {
        if (activeSounds.has(soundId)) {
          audio.pause();
        }
      });
      setActiveSounds(new Set());
    } else if (pausedSounds.size > 0) {
      // Resume previously playing sounds
      pausedSounds.forEach(async (soundId) => {
        const audio = audioRefs.current.get(soundId);
        if (audio) {
          try {
            await audio.play();
            setActiveSounds(prev => new Set([...prev, soundId]));
          } catch (error) {
            console.log("Failed to resume audio:", error);
          }
        }
      });
      setPausedSounds(new Set());
    }
  }, [isAudiobookPlaying]);

  // Update volume on all active sounds
  useEffect(() => {
    audioRefs.current.forEach(audio => {
      audio.volume = globalVolume;
    });
  }, [globalVolume]);

  const toggleSound = useCallback(async (soundId: string) => {
    if (isAudiobookPlaying) return; // Don't allow ambient sounds while audiobook plays
    
    let audio = audioRefs.current.get(soundId);
    
    if (!audio) {
      audio = new Audio(AMBIENT_SOUNDS[soundId].audioUrl);
      audio.loop = true;
      audio.volume = globalVolume;
      audioRefs.current.set(soundId, audio);
    }
    
    if (activeSounds.has(soundId)) {
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
  }, [activeSounds, globalVolume, isAudiobookPlaying]);

  const pauseAllAmbient = useCallback(() => {
    audioRefs.current.forEach((audio, soundId) => {
      if (activeSounds.has(soundId)) {
        audio.pause();
      }
    });
    setPausedSounds(new Set(activeSounds));
    setActiveSounds(new Set());
  }, [activeSounds]);

  const resumeAllAmbient = useCallback(async () => {
    if (isAudiobookPlaying) return;
    
    for (const soundId of pausedSounds) {
      const audio = audioRefs.current.get(soundId);
      if (audio) {
        try {
          await audio.play();
          setActiveSounds(prev => new Set([...prev, soundId]));
        } catch (error) {
          console.log("Failed to resume audio:", error);
        }
      }
    }
    setPausedSounds(new Set());
  }, [pausedSounds, isAudiobookPlaying]);

  const setAudiobookPlaying = useCallback((playing: boolean) => {
    setIsAudiobookPlaying(playing);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        activeSounds,
        globalVolume,
        toggleSound,
        setGlobalVolume,
        pauseAllAmbient,
        resumeAllAmbient,
        isAudiobookPlaying,
        setAudiobookPlaying,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
