import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

// Sound categories for organization
export type SoundCategory = "binaural";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  category: SoundCategory;
  frequency?: number; // Base frequency for binaural beats
  beatFrequency?: number; // Difference frequency for the beat
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
}

// Binaural beats using Web Audio API - no external URLs needed
export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  thetaVertigo: {
    id: "thetaVertigo",
    name: "Theta Balance",
    description: "Theta waves (7Hz) for vestibular calm",
    color: "from-violet-500 to-purple-700",
    category: "binaural",
    frequency: 200,
    beatFrequency: 7,
    therapeuticUse: ["vertigo", "balance", "vestibular"],
    incogLevel: "A",
  },
  alphaCalm: {
    id: "alphaCalm",
    name: "Alpha Serenity",
    description: "Alpha waves (10Hz) for anxiety relief & calm",
    color: "from-blue-400 to-indigo-600",
    category: "binaural",
    frequency: 220,
    beatFrequency: 10,
    therapeuticUse: ["anxiety", "calm", "emotional-regulation"],
    incogLevel: "A",
  },
  betaFocus: {
    id: "betaFocus",
    name: "Beta Focus",
    description: "Beta waves (18Hz) for attention & focus",
    color: "from-amber-400 to-orange-600",
    category: "binaural",
    frequency: 250,
    beatFrequency: 18,
    therapeuticUse: ["attention", "focus", "executive-function"],
    incogLevel: "A",
  },
  mind: {
    id: "mind",
    name: "Deep Focus",
    description: "Low alpha (8Hz) for mental clarity",
    color: "from-purple-500 to-red-600",
    category: "binaural",
    frequency: 180,
    beatFrequency: 8,
    therapeuticUse: ["meditation", "clarity", "mindfulness"],
    incogLevel: "B",
  },
  heart: {
    id: "heart",
    name: "Heart Coherence",
    description: "Delta-theta (5Hz) for emotional healing",
    color: "from-pink-500 to-red-500",
    category: "binaural",
    frequency: 160,
    beatFrequency: 5,
    therapeuticUse: ["emotional-healing", "heart-coherence", "gratitude"],
    incogLevel: "B",
  },
  computer: {
    id: "computer",
    name: "Neural Flow",
    description: "High alpha (12Hz) for cognitive training",
    color: "from-indigo-500 to-blue-600",
    category: "binaural",
    frequency: 240,
    beatFrequency: 12,
    therapeuticUse: ["cognitive-training", "neuroplasticity"],
    incogLevel: "B",
  },
  breath: {
    id: "breath",
    name: "Breathing Calm",
    description: "Low theta (6Hz) for breathing exercises",
    color: "from-orange-500 to-red-500",
    category: "binaural",
    frequency: 170,
    beatFrequency: 6,
    therapeuticUse: ["relaxation", "breathing"],
  },
  ice: {
    id: "ice",
    name: "Alertness Boost",
    description: "Beta (15Hz) for cold exposure alertness",
    color: "from-cyan-500 to-blue-600",
    category: "binaural",
    frequency: 260,
    beatFrequency: 15,
    therapeuticUse: ["alertness", "grounding"],
  },
  circle: {
    id: "circle",
    name: "Connection",
    description: "Alpha (9Hz) for social connection",
    color: "from-teal-500 to-blue-600",
    category: "binaural",
    frequency: 190,
    beatFrequency: 9,
    therapeuticUse: ["stress-reduction", "grounding"],
  },
  rain: {
    id: "rain",
    name: "Gentle Rest",
    description: "Delta (4Hz) for deep relaxation",
    color: "from-slate-500 to-blue-600",
    category: "binaural",
    frequency: 150,
    beatFrequency: 4,
    therapeuticUse: ["sleep", "calm"],
  },
};

interface BinauralOscillator {
  leftOsc: OscillatorNode;
  rightOsc: OscillatorNode;
  leftGain: GainNode;
  rightGain: GainNode;
  merger: ChannelMergerNode;
}

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
  
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, BinauralOscillator>>(new Map());

  // Initialize Web Audio Context on first interaction
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  // Create binaural beat oscillators
  const createBinauralBeat = useCallback((soundId: string): BinauralOscillator | null => {
    const config = AMBIENT_SOUNDS[soundId];
    if (!config || !config.frequency || !config.beatFrequency) return null;

    const ctx = getAudioContext();
    
    // Left ear oscillator
    const leftOsc = ctx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.value = config.frequency;
    
    // Right ear oscillator (slightly different frequency for binaural beat)
    const rightOsc = ctx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.value = config.frequency + config.beatFrequency;
    
    // Gain nodes for volume control
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    leftGain.gain.value = globalVolume * 0.3;
    rightGain.gain.value = globalVolume * 0.3;
    
    // Channel merger for stereo separation
    const merger = ctx.createChannelMerger(2);
    
    // Connect left to left channel, right to right channel
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(ctx.destination);
    
    leftOsc.start();
    rightOsc.start();
    
    return { leftOsc, rightOsc, leftGain, rightGain, merger };
  }, [getAudioContext, globalVolume]);

  // Pause all ambient sounds when audiobook starts
  useEffect(() => {
    if (isAudiobookPlaying) {
      const currentlyPlaying = new Set(activeSounds);
      setPausedSounds(currentlyPlaying);
      
      // Stop all oscillators
      oscillatorsRef.current.forEach((osc, soundId) => {
        if (activeSounds.has(soundId)) {
          osc.leftGain.gain.value = 0;
          osc.rightGain.gain.value = 0;
        }
      });
      setActiveSounds(new Set());
    } else if (pausedSounds.size > 0) {
      // Resume previously playing sounds
      pausedSounds.forEach((soundId) => {
        const osc = oscillatorsRef.current.get(soundId);
        if (osc) {
          osc.leftGain.gain.value = globalVolume * 0.3;
          osc.rightGain.gain.value = globalVolume * 0.3;
          setActiveSounds(prev => new Set([...prev, soundId]));
        }
      });
      setPausedSounds(new Set());
    }
  }, [isAudiobookPlaying, globalVolume]);

  // Update volume on all active sounds
  useEffect(() => {
    oscillatorsRef.current.forEach((osc, soundId) => {
      if (activeSounds.has(soundId)) {
        osc.leftGain.gain.value = globalVolume * 0.3;
        osc.rightGain.gain.value = globalVolume * 0.3;
      }
    });
  }, [globalVolume, activeSounds]);

  const toggleSound = useCallback(async (soundId: string) => {
    if (isAudiobookPlaying) return;
    
    let osc = oscillatorsRef.current.get(soundId);
    
    if (activeSounds.has(soundId)) {
      // Stop the sound
      if (osc) {
        osc.leftGain.gain.value = 0;
        osc.rightGain.gain.value = 0;
      }
      setActiveSounds(prev => {
        const next = new Set(prev);
        next.delete(soundId);
        return next;
      });
    } else {
      // Start the sound
      if (!osc) {
        osc = createBinauralBeat(soundId);
        if (osc) {
          oscillatorsRef.current.set(soundId, osc);
        }
      } else {
        osc.leftGain.gain.value = globalVolume * 0.3;
        osc.rightGain.gain.value = globalVolume * 0.3;
      }
      
      if (osc) {
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
  }, [activeSounds, globalVolume, isAudiobookPlaying, createBinauralBeat]);

  const pauseAllAmbient = useCallback(() => {
    oscillatorsRef.current.forEach((osc, soundId) => {
      if (activeSounds.has(soundId)) {
        osc.leftGain.gain.value = 0;
        osc.rightGain.gain.value = 0;
      }
    });
    setPausedSounds(new Set(activeSounds));
    setActiveSounds(new Set());
  }, [activeSounds]);

  const resumeAllAmbient = useCallback(async () => {
    if (isAudiobookPlaying) return;
    
    for (const soundId of pausedSounds) {
      const osc = oscillatorsRef.current.get(soundId);
      if (osc) {
        osc.leftGain.gain.value = globalVolume * 0.3;
        osc.rightGain.gain.value = globalVolume * 0.3;
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
    setPausedSounds(new Set());
  }, [pausedSounds, isAudiobookPlaying, globalVolume]);

  const setAudiobookPlayingState = useCallback((playing: boolean) => {
    setIsAudiobookPlaying(playing);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.leftOsc.stop();
          osc.rightOsc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
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
        setAudiobookPlaying: setAudiobookPlayingState,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
