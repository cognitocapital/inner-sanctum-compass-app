import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  audioUrl: string;
  icon: string;
}

// 8 curated therapeutic sounds - simple and focused
export const AMBIENT_SOUNDS: AmbientSoundConfig[] = [
  {
    id: "tibetanBowl",
    name: "Tibetan Bowl",
    description: "Deep resonant tones",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
    icon: "🔔"
  },
  {
    id: "crystalBowl",
    name: "Crystal Bowl",
    description: "Pure crystalline resonance",
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/14/audio_8df026ba35.mp3",
    icon: "💎"
  },
  {
    id: "hangDrum",
    name: "Handpan",
    description: "Ethereal steel harmonics",
    audioUrl: "https://cdn.pixabay.com/audio/2024/04/18/audio_e2bf4f1b2f.mp3",
    icon: "🥁"
  },
  {
    id: "bambooFlute",
    name: "Bamboo Flute",
    description: "Soothing melodies",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_0c7922eed0.mp3",
    icon: "🎋"
  },
  {
    id: "forestStream",
    name: "Forest Stream",
    description: "Gentle water sounds",
    audioUrl: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3",
    icon: "🌲"
  },
  {
    id: "oceanWaves",
    name: "Ocean Waves",
    description: "Rhythmic ocean calm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/07/audio_82b7eb96a1.mp3",
    icon: "🌊"
  },
  {
    id: "kalimba",
    name: "Kalimba",
    description: "Gentle thumb piano",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_f8a6048598.mp3",
    icon: "🎵"
  },
  {
    id: "chimes",
    name: "Wind Chimes",
    description: "Peaceful chimes",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/18/audio_b4b6f96bdb.mp3",
    icon: "🎐"
  }
];

interface AudioContextType {
  activeSound: string | null;
  volume: number;
  isPlaying: boolean;
  toggleSound: (soundId: string) => void;
  setVolume: (volume: number) => void;
  stopAll: () => void;
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
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = useCallback((soundId: string) => {
    if (isAudiobookPlaying) return;

    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    // If same sound is playing, stop it
    if (activeSound === soundId && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveSound(null);
      setIsPlaying(false);
      return;
    }

    // Stop current audio if playing different sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create and play new audio
    const audio = new Audio(sound.audioUrl);
    audio.loop = true;
    audio.volume = volume;
    
    audio.play().then(() => {
      audioRef.current = audio;
      setActiveSound(soundId);
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Audio playback failed:", err);
    });
  }, [activeSound, isPlaying, volume, isAudiobookPlaying]);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setActiveSound(null);
    setIsPlaying(false);
  }, []);

  // Update volume on playing audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <AudioContextState.Provider
      value={{
        activeSound,
        volume,
        isPlaying,
        toggleSound,
        setVolume,
        stopAll,
        isAudiobookPlaying,
        setAudiobookPlaying: setIsAudiobookPlaying,
      }}
    >
      {children}
    </AudioContextState.Provider>
  );
};
