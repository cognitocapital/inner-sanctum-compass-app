import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  color: string;
}

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
