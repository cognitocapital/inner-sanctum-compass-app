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
  // Nature sounds
  breath: {
    id: "breath",
    name: "Ocean Waves",
    description: "Gentle ocean waves for breathing exercises",
    audioUrl: "https://archive.org/download/naturesounds-soundtheraphy/Birds%20With%20Ocean%20Waves%20on%20the%20Beach.mp3",
    color: "from-orange-500 to-red-500",
    category: "nature",
    therapeuticUse: ["relaxation", "breathing"],
    manuscriptQuanta: "Ch3: The overwhelming chaos that eventually gives way to peace"
  },
  ice: {
    id: "ice",
    name: "Arctic Wind",
    description: "Crisp wind sounds for cold exposure focus",
    audioUrl: "https://archive.org/download/78_wind-around-house-or-barn_gbia0409024a/WIND%20%28Around%20House%20or%20Barn%29.mp3",
    color: "from-cyan-500 to-blue-600",
    category: "nature",
    therapeuticUse: ["alertness", "grounding"],
    manuscriptQuanta: "Ch4: Slow comeback, learning resilience"
  },
  circle: {
    id: "circle",
    name: "Forest Sanctuary",
    description: "Ambient nature sounds for connection",
    audioUrl: "https://archive.org/download/RestorativeSleepMusicBinauralBeatsSleepInTheClouds432Hz/Musique%20Paisible%20Nature%20%20Sons%20de%20la%20Nature%20%28Anti%20Stress%29%20-%20432%20Hz.mp3",
    color: "from-teal-500 to-blue-600",
    category: "nature",
    therapeuticUse: ["stress-reduction", "grounding"],
    manuscriptQuanta: "Intro: Gratitude for the journey"
  },
  
  // Binaural beats - INCOG Level A evidence
  thetaVertigo: {
    id: "thetaVertigo",
    name: "Theta Balance",
    description: "Theta waves (4-7Hz) for vertigo & vestibular calm",
    audioUrl: "https://archive.org/download/1hr-30-min-theta-binaural-beat-7-hz-pure-tone/1hr%2030%20min%20Theta%20Binaural%20Beat%20%287Hz%29%20-%20Pure%20Tone.mp3",
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
    audioUrl: "https://archive.org/download/BinauralBeatsDeltaWaves/Binaural%20Beats%20Alpha%20Waves.mp3",
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
    audioUrl: "https://archive.org/download/beta-wave-subliminal-with-relaxing-music/Beta%20Wave%20Subliminal%20%28With%20Relaxing%20Music%29.mp3",
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
    audioUrl: "https://archive.org/download/RestorativeSleepMusicBinauralBeatsSleepInTheClouds432Hz/Powerful%20Om%20Chanting%20432%20Hz%20-%20Tibetan%20Om%20Meditation.mp3",
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
    audioUrl: "https://archive.org/download/CelticChristmasAWindhamHillCollection2001/02%20Lisa%20Lynne_%20Circle%20Of%20Joy.mp3",
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
    audioUrl: "https://archive.org/download/freefloatingmusic-aic2011/11%20-%20Benjamin%20Dauer%20Alluvial.mp3",
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
