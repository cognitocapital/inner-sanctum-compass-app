import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export type SoundCategory = "sacred" | "nature" | "binaural";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  category: SoundCategory;
  // For binaural beats (still synthesized for mathematical precision)
  frequency?: number;
  beatFrequency?: number;
  // Audio file path for real sounds
  audioUrl?: string;
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
  manuscriptQuanta?: string;
  instrument?: string;
}

// Public domain audio URLs from Archive.org and Freesound CDN
// All sounds are CC0 or public domain licensed
export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  // === SACRED INSTRUMENTS (Real Audio Files) ===
  tibetanBowl: {
    id: "tibetanBowl",
    name: "Tibetan Singing Bowl",
    description: "Traditional bronze bowl with deep resonance",
    color: "from-amber-400 to-orange-600",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/268/268756_3917858-lq.mp3",
    instrument: "Tibetan Bronze Bowl",
    therapeuticUse: ["meditation", "grounding", "focus"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: The overwhelming chaos gives way to peace"
  },
  crystalBowl: {
    id: "crystalBowl",
    name: "Crystal Singing Bowl",
    description: "Pure quartz crystal harmonics at 528Hz",
    color: "from-violet-400 to-purple-600",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/517/517847_9497060-lq.mp3",
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
    audioUrl: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
    instrument: "Bronze Temple Gong",
    therapeuticUse: ["awakening", "clearing", "transition"],
    incogLevel: "B",
    manuscriptQuanta: "Moments of stillness and clarity"
  },
  tingshas: {
    id: "tingshas",
    name: "Tingsha Bells",
    description: "High-pitched Tibetan cymbals for clarity",
    color: "from-cyan-400 to-teal-600",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/202/202092_1676145-lq.mp3",
    instrument: "Tibetan Tingshas",
    therapeuticUse: ["clearing", "alertness", "meditation-start"],
    incogLevel: "B",
    manuscriptQuanta: "Ch4: Slow comeback, learning resilience"
  },

  // === NATURE SOUNDSCAPES (Real Audio Files) ===
  oceanWaves: {
    id: "oceanWaves",
    name: "Ocean Waves",
    description: "Gentle waves on a peaceful shore",
    color: "from-blue-400 to-cyan-600",
    category: "nature",
    audioUrl: "https://cdn.freesound.org/previews/531/531015_5674468-lq.mp3",
    therapeuticUse: ["relaxation", "sleep", "breathing"],
    incogLevel: "A",
    manuscriptQuanta: "The rhythm of life ebbs and flows"
  },
  rainForest: {
    id: "rainForest",
    name: "Rain in Forest",
    description: "Gentle rain with distant birds",
    color: "from-green-500 to-emerald-700",
    category: "nature",
    audioUrl: "https://cdn.freesound.org/previews/531/531947_5674468-lq.mp3",
    therapeuticUse: ["sleep", "focus", "calm"],
    incogLevel: "A",
    manuscriptQuanta: "Intro: Gratitude for the journey"
  },
  nativeFlute: {
    id: "nativeFlute",
    name: "Native American Flute",
    description: "Haunting melody from the high plains",
    color: "from-orange-500 to-red-600",
    category: "nature",
    audioUrl: "https://cdn.freesound.org/previews/415/415362_6439205-lq.mp3",
    instrument: "Cedar Flute",
    therapeuticUse: ["emotional-healing", "reflection", "grief"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: Tears of gratitude"
  },
  birdsong: {
    id: "birdsong",
    name: "Morning Birdsong",
    description: "Dawn chorus in a tranquil garden",
    color: "from-lime-400 to-green-600",
    category: "nature",
    audioUrl: "https://cdn.freesound.org/previews/531/531951_5674468-lq.mp3",
    therapeuticUse: ["awakening", "hope", "new-beginnings"],
    incogLevel: "B",
    manuscriptQuanta: "Prologue: The human spirit rises"
  },

  // === BINAURAL BEATS (Still Synthesized for Mathematical Precision) ===
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
};

interface AudioNodes {
  type: "binaural" | "audio";
  nodes: AudioNode[];
  gainNode?: GainNode;
  audioElement?: HTMLAudioElement;
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

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [globalVolume, setGlobalVolume] = useState(0.5);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [pausedSounds, setPausedSounds] = useState<Set<string>>(new Set());
  
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null);
  const audioNodesRef = useRef<Map<string, AudioNodes>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // === BINAURAL BEATS (Synthesized for mathematical precision) ===
  const createBinauralBeat = useCallback((config: AmbientSoundConfig): AudioNodes | null => {
    if (!config.frequency || !config.beatFrequency) return null;
    const ctx = getAudioContext();
    
    // Main binaural oscillators
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    leftOsc.type = "sine";
    rightOsc.type = "sine";
    leftOsc.frequency.value = config.frequency;
    rightOsc.frequency.value = config.frequency + config.beatFrequency;
    
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.4;
    
    const merger = ctx.createChannelMerger(2);
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGain);
    
    // Warm pad undertone for richness
    const padOsc1 = ctx.createOscillator();
    const padOsc2 = ctx.createOscillator();
    padOsc1.type = "sine";
    padOsc2.type = "sine";
    padOsc1.frequency.value = config.frequency / 2;
    padOsc2.frequency.value = config.frequency * 0.75;
    
    const padGain = ctx.createGain();
    padGain.gain.value = globalVolume * 0.1;
    
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 300;
    
    padOsc1.connect(padFilter);
    padOsc2.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(ctx.destination);
    
    masterGain.connect(ctx.destination);
    
    leftOsc.start();
    rightOsc.start();
    padOsc1.start();
    padOsc2.start();
    
    return { type: "binaural", nodes: [leftOsc, rightOsc, padOsc1, padOsc2, merger, padFilter], gainNode: masterGain };
  }, [getAudioContext, globalVolume]);

  // === REAL AUDIO PLAYBACK (Using native HTML5 Audio - no Web Audio API routing issues) ===
  const createAudioPlayer = useCallback((config: AmbientSoundConfig): AudioNodes | null => {
    if (!config.audioUrl) return null;
    
    // Create fresh audio element each time to avoid MediaElementSource issues
    const audioElement = new Audio();
    audioElement.crossOrigin = "anonymous";
    audioElement.loop = true;
    audioElement.preload = "auto";
    audioElement.volume = globalVolume * 0.7;
    audioElement.src = config.audioUrl;
    
    // Start playback
    audioElement.play().catch(e => {
      console.log("Audio playback requires user interaction:", e);
    });
    
    return { 
      type: "audio", 
      nodes: [],
      audioElement 
    };
  }, [globalVolume]);

  // Pause/resume for audiobook
  useEffect(() => {
    if (isAudiobookPlaying) {
      const currentlyPlaying = new Set(activeSounds);
      setPausedSounds(currentlyPlaying);
      
      audioNodesRef.current.forEach((nodes, soundId) => {
        if (activeSounds.has(soundId)) {
          if (nodes.gainNode) {
            nodes.gainNode.gain.value = 0;
          }
          if (nodes.audioElement) {
            nodes.audioElement.pause();
          }
        }
      });
      setActiveSounds(new Set());
    } else if (pausedSounds.size > 0) {
      pausedSounds.forEach((soundId) => {
        const nodes = audioNodesRef.current.get(soundId);
        if (nodes) {
          if (nodes.gainNode) {
            nodes.gainNode.gain.value = globalVolume * 0.5;
          }
          if (nodes.audioElement) {
            nodes.audioElement.volume = globalVolume * 0.7;
            nodes.audioElement.play().catch(() => {});
          }
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
        if (nodes.type === "binaural" && nodes.gainNode) {
          nodes.gainNode.gain.value = globalVolume * 0.4;
        } else if (nodes.audioElement) {
          nodes.audioElement.volume = globalVolume * 0.7;
        }
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
        if (nodes.gainNode) {
          nodes.gainNode.gain.value = 0;
        }
        
        if (nodes.audioElement) {
          nodes.audioElement.pause();
          nodes.audioElement.currentTime = 0;
          nodes.audioElement.src = ""; // Clean up
        }
        
        nodes.nodes.forEach(node => {
          try {
            if (node instanceof OscillatorNode) {
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
        // Binaural beats are synthesized
        audioNodes = createBinauralBeat(config);
      } else if (config.audioUrl) {
        // Real audio files
        audioNodes = createAudioPlayer(config);
      }
      
      if (audioNodes) {
        audioNodesRef.current.set(soundId, audioNodes);
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
  }, [activeSounds, isAudiobookPlaying, createBinauralBeat, createAudioPlayer]);

  const pauseAllAmbient = useCallback(() => {
    audioNodesRef.current.forEach((nodes, soundId) => {
      if (activeSounds.has(soundId)) {
        nodes.gainNode.gain.value = 0;
        if (nodes.audioElement) {
          nodes.audioElement.pause();
        }
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
        const volumeMultiplier = nodes.type === "binaural" ? 0.4 : 0.7;
        nodes.gainNode.gain.value = globalVolume * volumeMultiplier;
        if (nodes.audioElement) {
          await nodes.audioElement.play().catch(() => {});
        }
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
        if (nodes.audioElement) {
          nodes.audioElement.pause();
          nodes.audioElement.src = "";
        }
        nodes.nodes.forEach(node => {
          try {
            if (node instanceof OscillatorNode) {
              node.stop();
            }
          } catch (e) { /* Already stopped */ }
        });
      });
      // Audio elements are now cleaned up in audioNodesRef
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
