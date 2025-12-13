import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  color: string;
}

export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  phoenix: {
    id: "phoenix",
    name: "Phoenix Flames",
    description: "Warm crackling fire for transformation & renewal",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/30/audio_946d5e7455.mp3",
    color: "from-orange-500 to-red-600"
  },
  ocean: {
    id: "ocean",
    name: "Ocean Waves",
    description: "Gentle waves for breathing & relaxation",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3",
    color: "from-blue-400 to-cyan-500"
  },
  rain: {
    id: "rain",
    name: "Gentle Rain",
    description: "Soft rainfall for focus & calm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/13/audio_257112355f.mp3",
    color: "from-slate-400 to-blue-500"
  },
  forest: {
    id: "forest",
    name: "Forest Sanctuary",
    description: "Birds & nature for grounding",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dae668d83.mp3",
    color: "from-emerald-500 to-green-600"
  },
  wind: {
    id: "wind",
    name: "Arctic Wind",
    description: "Crisp wind for cold exposure focus",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_6be98be124.mp3",
    color: "from-cyan-400 to-blue-600"
  },
  bowls: {
    id: "bowls",
    name: "Tibetan Bowls",
    description: "Singing bowls for deep meditation",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/23/audio_ea70ad08e3.mp3",
    color: "from-purple-500 to-indigo-600"
  },
  night: {
    id: "night",
    name: "Night Ambience",
    description: "Crickets & night sounds for rest",
    audioUrl: "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630c2a50.mp3",
    color: "from-indigo-600 to-purple-800"
  },
  space: {
    id: "space",
    name: "Cosmic Drift",
    description: "Ethereal tones for cognitive training",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    color: "from-violet-500 to-fuchsia-600"
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
