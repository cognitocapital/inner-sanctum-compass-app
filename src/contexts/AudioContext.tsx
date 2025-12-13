import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  color: string;
}

// Attribution: Sounds by TabletopAudio.com (royalty-free for personal use)
export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  breath: {
    id: "breath",
    name: "Phoenix Breath",
    description: "Ocean waves for breathing calm",
    audioUrl: "https://sounds.tabletopaudio.com/unknown_open_ocean.mp3",
    color: "from-orange-500 to-red-600"
  },
  ice: {
    id: "ice",
    name: "Ice Warrior",
    description: "Rain sounds for stress adaptation",
    audioUrl: "https://sounds.tabletopaudio.com/43785848_rainy_village.mp3",
    color: "from-cyan-400 to-blue-600"
  },
  tbi: {
    id: "tbi",
    name: "TBI Focus",
    description: "Forest ambience for cognitive focus",
    audioUrl: "https://sounds.tabletopaudio.com/24511510_forest_day.mp3",
    color: "from-emerald-500 to-green-600"
  },
  mind: {
    id: "mind",
    name: "Phoenix Mind",
    description: "Secret garden for meditation",
    audioUrl: "https://sounds.tabletopaudio.com/22266143_secret_garden.mp3",
    color: "from-purple-500 to-indigo-600"
  },
  heart: {
    id: "heart",
    name: "Phoenix Heart",
    description: "Lush nature for emotional healing",
    audioUrl: "https://sounds.tabletopaudio.com/43532608_lush_world.mp3",
    color: "from-pink-500 to-red-500"
  },
  incog: {
    id: "incog",
    name: "INCOG Rehab",
    description: "Night forest for rehab immersion",
    audioUrl: "https://sounds.tabletopaudio.com/unknown_forest_night.mp3",
    color: "from-indigo-600 to-purple-800"
  },
  circle: {
    id: "circle",
    name: "Phoenix Circle",
    description: "Surreal forest for community serenity",
    audioUrl: "https://sounds.tabletopaudio.com/41936625_mushroom_forest.mp3",
    color: "from-teal-500 to-emerald-600"
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
