/**
 * Audio Context - Rock-solid ambient sound management using Tone.js
 * All sounds are procedurally synthesized - no CDN dependencies, works offline
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { healingSoundEngine, SoundType } from "@/lib/audio-engine";

export type SoundCategory = "sacred" | "nature" | "binaural";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  category: SoundCategory;
  soundType: SoundType;
  frequency?: number;
  beatFrequency?: number;
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
  manuscriptQuanta?: string;
  instrument?: string;
}

// All sounds now use synthesized Tone.js engine
export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  // === SACRED INSTRUMENTS ===
  tibetanBowl: {
    id: "tibetanBowl",
    name: "Tibetan Singing Bowl",
    description: "Deep bronze resonance with rich harmonics",
    color: "from-amber-400 to-orange-600",
    category: "sacred",
    soundType: "tibetanBowl",
    instrument: "Tibetan Bronze Bowl",
    therapeuticUse: ["meditation", "grounding", "focus"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: The overwhelming chaos gives way to peace"
  },
  crystalBowl: {
    id: "crystalBowl",
    name: "Crystal Singing Bowl",
    description: "Pure 528Hz healing frequency with shimmer",
    color: "from-violet-400 to-purple-600",
    category: "sacred",
    soundType: "crystalBowl",
    instrument: "Quartz Crystal Bowl",
    therapeuticUse: ["healing", "clarity", "energy"],
    incogLevel: "A",
    manuscriptQuanta: "Finding peace in the storm"
  },
  templeGong: {
    id: "templeGong",
    name: "Temple Gong",
    description: "Deep ceremonial gong with long sustain",
    color: "from-yellow-400 to-amber-600",
    category: "sacred",
    soundType: "templeGong",
    instrument: "Bronze Temple Gong",
    therapeuticUse: ["awakening", "clearing", "transition"],
    incogLevel: "B",
    manuscriptQuanta: "Moments of stillness and clarity"
  },
  tingshas: {
    id: "tingshas",
    name: "Tingsha Bells",
    description: "High-pitched cymbals for mental clarity",
    color: "from-cyan-400 to-teal-600",
    category: "sacred",
    soundType: "tingshas",
    instrument: "Tibetan Tingshas",
    therapeuticUse: ["clearing", "alertness", "meditation-start"],
    incogLevel: "B",
    manuscriptQuanta: "Ch4: Slow comeback, learning resilience"
  },

  // === NATURE SOUNDSCAPES ===
  oceanWaves: {
    id: "oceanWaves",
    name: "Ocean Waves",
    description: "Rhythmic waves with natural ebb and flow",
    color: "from-blue-400 to-cyan-600",
    category: "nature",
    soundType: "oceanWaves",
    therapeuticUse: ["relaxation", "sleep", "breathing"],
    incogLevel: "A",
    manuscriptQuanta: "The rhythm of life ebbs and flows"
  },
  rainForest: {
    id: "rainForest",
    name: "Rainforest",
    description: "Gentle rain with droplets and distant thunder",
    color: "from-green-500 to-emerald-700",
    category: "nature",
    soundType: "rainForest",
    therapeuticUse: ["sleep", "focus", "calm"],
    incogLevel: "A",
    manuscriptQuanta: "Intro: Gratitude for the journey"
  },
  birdsong: {
    id: "birdsong",
    name: "Morning Birdsong",
    description: "Dawn chorus with varied bird calls",
    color: "from-lime-400 to-green-600",
    category: "nature",
    soundType: "birdsong",
    therapeuticUse: ["awakening", "hope", "new-beginnings"],
    incogLevel: "B",
    manuscriptQuanta: "Prologue: The human spirit rises"
  },
  windChimes: {
    id: "windChimes",
    name: "Wind Chimes",
    description: "Gentle pentatonic chimes with breeze",
    color: "from-sky-400 to-blue-600",
    category: "nature",
    soundType: "windChimes",
    therapeuticUse: ["peace", "contemplation", "presence"],
    incogLevel: "B",
    manuscriptQuanta: "Ch5: Finding stillness in motion"
  },

  // === BINAURAL BEATS ===
  thetaVertigo: {
    id: "thetaVertigo",
    name: "Theta Balance",
    description: "7Hz theta for vestibular calm & balance",
    color: "from-violet-500 to-purple-700",
    category: "binaural",
    soundType: "thetaBinaural",
    frequency: 200,
    beatFrequency: 7,
    therapeuticUse: ["vertigo", "balance", "vestibular"],
    incogLevel: "A",
    manuscriptQuanta: "Ch4: Vertigo slowly subsides"
  },
  alphaCalm: {
    id: "alphaCalm",
    name: "Alpha Serenity",
    description: "10Hz alpha for anxiety relief & calm",
    color: "from-blue-400 to-indigo-600",
    category: "binaural",
    soundType: "alphaBinaural",
    frequency: 220,
    beatFrequency: 10,
    therapeuticUse: ["anxiety", "calm", "emotional-regulation"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: The roller coaster finds stillness"
  },
  betaFocus: {
    id: "betaFocus",
    name: "Beta Focus",
    description: "18Hz beta for attention & executive function",
    color: "from-amber-400 to-orange-600",
    category: "binaural",
    soundType: "betaBinaural",
    frequency: 250,
    beatFrequency: 18,
    therapeuticUse: ["attention", "focus", "executive-function"],
    incogLevel: "A",
    manuscriptQuanta: "Mind training through dedicated practice"
  },
  deltaDeep: {
    id: "deltaDeep",
    name: "Delta Rest",
    description: "3Hz delta for deep restoration & healing",
    color: "from-indigo-600 to-purple-900",
    category: "binaural",
    soundType: "deltaBinaural",
    frequency: 150,
    beatFrequency: 3,
    therapeuticUse: ["sleep", "healing", "restoration"],
    incogLevel: "B",
    manuscriptQuanta: "Deep healing during rest"
  },
};

interface AudioContextType {
  activeSounds: Set<string>;
  globalVolume: number;
  toggleSound: (soundId: string) => Promise<void>;
  setGlobalVolume: (volume: number) => void;
  pauseAllAmbient: () => void;
  resumeAllAmbient: () => void;
  isAudiobookPlaying: boolean;
  setAudiobookPlaying: (playing: boolean) => void;
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
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [globalVolume, setGlobalVolumeState] = useState(0.5);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [pausedSounds, setPausedSounds] = useState<Set<string>>(new Set());

  // Sync volume with engine
  useEffect(() => {
    healingSoundEngine.setVolume(globalVolume);
  }, [globalVolume]);

  // Handle audiobook playing - pause/resume ambient sounds
  useEffect(() => {
    if (isAudiobookPlaying && activeSounds.size > 0) {
      setPausedSounds(new Set(activeSounds));
      healingSoundEngine.stopAll();
      setActiveSounds(new Set());
    } else if (!isAudiobookPlaying && pausedSounds.size > 0) {
      // Resume paused sounds
      pausedSounds.forEach(async (soundId) => {
        const config = AMBIENT_SOUNDS[soundId];
        if (config) {
          await healingSoundEngine.toggle(config.soundType);
          setActiveSounds(prev => new Set([...prev, soundId]));
        }
      });
      setPausedSounds(new Set());
    }
  }, [isAudiobookPlaying]);

  const toggleSound = useCallback(async (soundId: string) => {
    if (isAudiobookPlaying) return;
    
    const config = AMBIENT_SOUNDS[soundId];
    if (!config) return;

    const isNowPlaying = await healingSoundEngine.toggle(config.soundType);
    
    setActiveSounds(prev => {
      const next = new Set(prev);
      if (isNowPlaying) {
        next.add(soundId);
      } else {
        next.delete(soundId);
      }
      return next;
    });
  }, [isAudiobookPlaying]);

  const setGlobalVolume = useCallback((volume: number) => {
    setGlobalVolumeState(volume);
    healingSoundEngine.setVolume(volume);
  }, []);

  const pauseAllAmbient = useCallback(() => {
    setPausedSounds(new Set(activeSounds));
    healingSoundEngine.stopAll();
    setActiveSounds(new Set());
  }, [activeSounds]);

  const resumeAllAmbient = useCallback(async () => {
    if (isAudiobookPlaying) return;
    
    for (const soundId of pausedSounds) {
      const config = AMBIENT_SOUNDS[soundId];
      if (config) {
        await healingSoundEngine.toggle(config.soundType);
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
    setPausedSounds(new Set());
  }, [pausedSounds, isAudiobookPlaying]);

  const setAudiobookPlayingState = useCallback((playing: boolean) => {
    setIsAudiobookPlaying(playing);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      healingSoundEngine.stopAll();
    };
  }, []);

  return (
    <AudioContextState.Provider
      value={{
        activeSounds,
        globalVolume,
        toggleSound,
        setGlobalVolume,
        pauseAllAmbient,
        resumeAllAmbient,
        isAudiobookPlaying,
        setAudiobookPlaying: setAudiobookPlayingState,
      }}
    >
      {children}
    </AudioContextState.Provider>
  );
};
