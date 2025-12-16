import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export type SoundCategory = "nature" | "binaural" | "therapeutic";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  category: SoundCategory;
  // For binaural beats
  frequency?: number;
  beatFrequency?: number;
  // For noise-based sounds
  noiseType?: "white" | "pink" | "brown";
  // For tone-based sounds
  toneFrequency?: number;
  toneType?: OscillatorType;
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
  manuscriptQuanta?: string;
}

export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  // === NATURE SOUNDS (Generated via noise) ===
  ocean: {
    id: "ocean",
    name: "Ocean Waves",
    description: "Gentle ocean waves for deep relaxation",
    color: "from-blue-400 to-cyan-600",
    category: "nature",
    noiseType: "pink",
    therapeuticUse: ["relaxation", "sleep", "breathing"],
    manuscriptQuanta: "Ch3: The overwhelming chaos gives way to peace"
  },
  rain: {
    id: "rain",
    name: "Gentle Rain",
    description: "Soft rainfall for calm and focus",
    color: "from-slate-500 to-blue-600",
    category: "nature",
    noiseType: "white",
    therapeuticUse: ["sleep", "focus", "calm"],
    manuscriptQuanta: "Finding peace in the storm"
  },
  forest: {
    id: "forest",
    name: "Forest Ambience",
    description: "Deep forest sounds for grounding",
    color: "from-green-500 to-emerald-700",
    category: "nature",
    noiseType: "brown",
    therapeuticUse: ["grounding", "meditation", "stress-relief"],
    manuscriptQuanta: "Intro: Gratitude for the journey"
  },
  wind: {
    id: "wind",
    name: "Mountain Wind",
    description: "Crisp wind for alertness",
    color: "from-gray-400 to-slate-600",
    category: "nature",
    noiseType: "pink",
    therapeuticUse: ["alertness", "grounding"],
    manuscriptQuanta: "Ch4: Slow comeback, learning resilience"
  },

  // === BINAURAL BEATS ===
  thetaVertigo: {
    id: "thetaVertigo",
    name: "Theta Balance",
    description: "7Hz theta for vestibular calm & balance",
    color: "from-violet-500 to-purple-700",
    category: "binaural",
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
    frequency: 150,
    beatFrequency: 3,
    therapeuticUse: ["sleep", "healing", "restoration"],
    incogLevel: "B",
    manuscriptQuanta: "Deep healing during rest"
  },

  // === THERAPEUTIC TONES ===
  solfeggio528: {
    id: "solfeggio528",
    name: "528Hz Healing",
    description: "Solfeggio frequency for transformation",
    color: "from-green-400 to-teal-600",
    category: "therapeutic",
    toneFrequency: 528,
    toneType: "sine",
    therapeuticUse: ["healing", "transformation", "DNA repair"],
    incogLevel: "C",
    manuscriptQuanta: "Cellular healing and renewal"
  },
  solfeggio432: {
    id: "solfeggio432",
    name: "432Hz Harmony",
    description: "Natural tuning for mental clarity",
    color: "from-purple-400 to-pink-600",
    category: "therapeutic",
    toneFrequency: 432,
    toneType: "sine",
    therapeuticUse: ["meditation", "clarity", "harmony"],
    incogLevel: "C",
    manuscriptQuanta: "Finding inner harmony"
  },
  solfeggio396: {
    id: "solfeggio396",
    name: "396Hz Liberation",
    description: "Release guilt and fear",
    color: "from-red-400 to-orange-600",
    category: "therapeutic",
    toneFrequency: 396,
    toneType: "sine",
    therapeuticUse: ["emotional-release", "liberation", "grounding"],
    incogLevel: "C",
    manuscriptQuanta: "Releasing the weight of trauma"
  },
  heartCoherence: {
    id: "heartCoherence",
    name: "Heart Coherence",
    description: "5Hz delta-theta for emotional healing",
    color: "from-pink-500 to-red-500",
    category: "therapeutic",
    frequency: 160,
    beatFrequency: 5,
    therapeuticUse: ["emotional-healing", "heart-coherence", "gratitude"],
    incogLevel: "B",
    manuscriptQuanta: "Heart-centered gratitude"
  },
};

interface AudioNodes {
  type: "binaural" | "noise" | "tone";
  nodes: AudioNode[];
  gainNode: GainNode;
}

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

// Create colored noise using Web Audio API
const createNoiseBuffer = (ctx: globalThis.AudioContext, type: "white" | "pink" | "brown", duration = 4): AudioBuffer => {
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * duration;
  const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    
    if (type === "white") {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === "brown") {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
  }
  return buffer;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [globalVolume, setGlobalVolume] = useState(0.3);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [pausedSounds, setPausedSounds] = useState<Set<string>>(new Set());
  
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null);
  const audioNodesRef = useRef<Map<string, AudioNodes>>(new Map());
  const noiseBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Create binaural beat
  const createBinauralBeat = useCallback((config: AmbientSoundConfig): AudioNodes | null => {
    if (!config.frequency || !config.beatFrequency) return null;
    const ctx = getAudioContext();
    
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    leftOsc.type = "sine";
    rightOsc.type = "sine";
    leftOsc.frequency.value = config.frequency;
    rightOsc.frequency.value = config.frequency + config.beatFrequency;
    
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.25;
    
    const merger = ctx.createChannelMerger(2);
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    leftOsc.start();
    rightOsc.start();
    
    return { type: "binaural", nodes: [leftOsc, rightOsc, merger], gainNode: masterGain };
  }, [getAudioContext, globalVolume]);

  // Create noise-based sound
  const createNoiseSound = useCallback((config: AmbientSoundConfig): AudioNodes | null => {
    if (!config.noiseType) return null;
    const ctx = getAudioContext();
    
    // Get or create noise buffer
    let buffer = noiseBuffersRef.current.get(config.noiseType);
    if (!buffer) {
      buffer = createNoiseBuffer(ctx, config.noiseType);
      noiseBuffersRef.current.set(config.noiseType, buffer);
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Add filter to shape the sound
    const filter = ctx.createBiquadFilter();
    if (config.noiseType === "pink" || config.id === "ocean") {
      filter.type = "lowpass";
      filter.frequency.value = 800;
    } else if (config.noiseType === "brown" || config.id === "forest") {
      filter.type = "lowpass";
      filter.frequency.value = 400;
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 2000;
    }
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = globalVolume * 0.4;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
    
    return { type: "noise", nodes: [source, filter], gainNode };
  }, [getAudioContext, globalVolume]);

  // Create therapeutic tone
  const createTone = useCallback((config: AmbientSoundConfig): AudioNodes | null => {
    if (!config.toneFrequency) return null;
    const ctx = getAudioContext();
    
    const osc = ctx.createOscillator();
    osc.type = config.toneType || "sine";
    osc.frequency.value = config.toneFrequency;
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = globalVolume * 0.15; // Tones are quieter
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    
    return { type: "tone", nodes: [osc], gainNode };
  }, [getAudioContext, globalVolume]);

  // Pause/resume for audiobook
  useEffect(() => {
    if (isAudiobookPlaying) {
      const currentlyPlaying = new Set(activeSounds);
      setPausedSounds(currentlyPlaying);
      
      audioNodesRef.current.forEach((nodes, soundId) => {
        if (activeSounds.has(soundId)) {
          nodes.gainNode.gain.value = 0;
        }
      });
      setActiveSounds(new Set());
    } else if (pausedSounds.size > 0) {
      pausedSounds.forEach((soundId) => {
        const nodes = audioNodesRef.current.get(soundId);
        if (nodes) {
          nodes.gainNode.gain.value = globalVolume * 0.3;
          setActiveSounds(prev => new Set([...prev, soundId]));
        }
      });
      setPausedSounds(new Set());
    }
  }, [isAudiobookPlaying, globalVolume]);

  // Update volume
  useEffect(() => {
    audioNodesRef.current.forEach((nodes, soundId) => {
      if (activeSounds.has(soundId)) {
        const volumeMultiplier = nodes.type === "tone" ? 0.15 : nodes.type === "binaural" ? 0.25 : 0.4;
        nodes.gainNode.gain.value = globalVolume * volumeMultiplier;
      }
    });
  }, [globalVolume, activeSounds]);

  const toggleSound = useCallback(async (soundId: string) => {
    if (isAudiobookPlaying) return;
    
    const config = AMBIENT_SOUNDS[soundId];
    if (!config) return;

    if (activeSounds.has(soundId)) {
      // Stop sound
      const nodes = audioNodesRef.current.get(soundId);
      if (nodes) {
        nodes.gainNode.gain.value = 0;
        nodes.nodes.forEach(node => {
          try {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
              node.stop();
            }
          } catch (e) { /* Already stopped */ }
        });
        audioNodesRef.current.delete(soundId);
      }
      setActiveSounds(prev => {
        const next = new Set(prev);
        next.delete(soundId);
        return next;
      });
    } else {
      // Start sound
      let audioNodes: AudioNodes | null = null;
      
      if (config.beatFrequency) {
        audioNodes = createBinauralBeat(config);
      } else if (config.noiseType) {
        audioNodes = createNoiseSound(config);
      } else if (config.toneFrequency) {
        audioNodes = createTone(config);
      }
      
      if (audioNodes) {
        audioNodesRef.current.set(soundId, audioNodes);
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
  }, [activeSounds, isAudiobookPlaying, createBinauralBeat, createNoiseSound, createTone]);

  const pauseAllAmbient = useCallback(() => {
    audioNodesRef.current.forEach((nodes, soundId) => {
      if (activeSounds.has(soundId)) {
        nodes.gainNode.gain.value = 0;
      }
    });
    setPausedSounds(new Set(activeSounds));
    setActiveSounds(new Set());
  }, [activeSounds]);

  const resumeAllAmbient = useCallback(async () => {
    if (isAudiobookPlaying) return;
    
    for (const soundId of pausedSounds) {
      const nodes = audioNodesRef.current.get(soundId);
      if (nodes) {
        const volumeMultiplier = nodes.type === "tone" ? 0.15 : nodes.type === "binaural" ? 0.25 : 0.4;
        nodes.gainNode.gain.value = globalVolume * volumeMultiplier;
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
    setPausedSounds(new Set());
  }, [pausedSounds, isAudiobookPlaying, globalVolume]);

  const setAudiobookPlayingState = useCallback((playing: boolean) => {
    setIsAudiobookPlaying(playing);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      audioNodesRef.current.forEach((nodes) => {
        nodes.nodes.forEach(node => {
          try {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
              node.stop();
            }
          } catch (e) { /* Already stopped */ }
        });
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
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
