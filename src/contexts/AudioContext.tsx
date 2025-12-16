import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export type SoundCategory = "sacred" | "wind" | "rhythm" | "binaural";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  category: SoundCategory;
  // For audio file playback
  audioUrl?: string;
  // For binaural beats
  frequency?: number;
  beatFrequency?: number;
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
  manuscriptQuanta?: string;
  origin?: string;
}

export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  // === SACRED INSTRUMENTS (Bowls, Bells, Gongs) ===
  tibetanBowl: {
    id: "tibetanBowl",
    name: "Tibetan Singing Bowl",
    description: "Ancient bronze bowl tuned to 432Hz for deep meditation",
    color: "from-amber-500 to-yellow-600",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/746/746189_1648170-lq.mp3",
    therapeuticUse: ["meditation", "chakra-balancing", "stress-relief"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: Moments of stillness and clarity",
    origin: "Tibet"
  },
  crystalBowl: {
    id: "crystalBowl",
    name: "Crystal Singing Bowl",
    description: "Pure quartz crystal resonance at 528Hz healing frequency",
    color: "from-white to-blue-200",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/371/371578_6222092-lq.mp3",
    therapeuticUse: ["clarity", "healing", "emotional-release"],
    incogLevel: "A",
    manuscriptQuanta: "Finding crystalline clarity",
    origin: "Modern therapeutic"
  },
  tingshaChimes: {
    id: "tingshaChimes",
    name: "Tingsha Chimes",
    description: "Himalayan cymbals for mindfulness and awareness",
    color: "from-slate-400 to-zinc-500",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/512/512502_3162562-lq.mp3",
    therapeuticUse: ["mindfulness", "awareness", "meditation-start"],
    incogLevel: "B",
    manuscriptQuanta: "Awakening to the present moment",
    origin: "Nepal/Tibet"
  },
  templeGong: {
    id: "templeGong",
    name: "Temple Gong",
    description: "Deep resonant gong for profound relaxation",
    color: "from-orange-600 to-red-700",
    category: "sacred",
    audioUrl: "https://cdn.freesound.org/previews/434/434472_9129866-lq.mp3",
    therapeuticUse: ["deep-relaxation", "sound-bath", "transformation"],
    incogLevel: "B",
    manuscriptQuanta: "Prologue: The human spirit rises",
    origin: "East Asia"
  },

  // === WIND INSTRUMENTS (Flutes, Wind) ===
  nativeFlute: {
    id: "nativeFlute",
    name: "Native American Flute",
    description: "Sacred cedar flute for emotional healing and grounding",
    color: "from-amber-700 to-orange-800",
    category: "wind",
    audioUrl: "https://cdn.freesound.org/previews/456/456053_9052681-lq.mp3",
    therapeuticUse: ["emotional-healing", "grounding", "heart-opening"],
    incogLevel: "B",
    manuscriptQuanta: "Ch3: Tears of gratitude",
    origin: "North America"
  },
  shakuhachi: {
    id: "shakuhachi",
    name: "Shakuhachi",
    description: "Japanese bamboo flute for Zen meditation and breath awareness",
    color: "from-green-700 to-emerald-800",
    category: "wind",
    audioUrl: "https://cdn.freesound.org/previews/566/566252_7584575-lq.mp3",
    therapeuticUse: ["zen-meditation", "breath-awareness", "inner-peace"],
    incogLevel: "A",
    manuscriptQuanta: "Finding breath, finding peace",
    origin: "Japan"
  },
  panFlute: {
    id: "panFlute",
    name: "Pan Flute",
    description: "Andean pan pipes for joy and spiritual connection",
    color: "from-teal-500 to-cyan-600",
    category: "wind",
    audioUrl: "https://cdn.freesound.org/previews/415/415168_7936045-lq.mp3",
    therapeuticUse: ["joy", "spiritual-connection", "upliftment"],
    incogLevel: "B",
    manuscriptQuanta: "Soaring above the mountains",
    origin: "Andes"
  },
  didgeridoo: {
    id: "didgeridoo",
    name: "Didgeridoo",
    description: "Ancient Australian drone for deep trance and grounding",
    color: "from-red-800 to-orange-900",
    category: "wind",
    audioUrl: "https://cdn.freesound.org/previews/463/463448_9052681-lq.mp3",
    therapeuticUse: ["grounding", "trance", "sleep"],
    incogLevel: "B",
    manuscriptQuanta: "Connecting to earth wisdom",
    origin: "Australia"
  },

  // === RHYTHM INSTRUMENTS (Drums, Percussion) ===
  shamanicDrum: {
    id: "shamanicDrum",
    name: "Shamanic Drum",
    description: "Theta-inducing frame drum for journeying and meditation",
    color: "from-red-700 to-amber-800",
    category: "rhythm",
    audioUrl: "https://cdn.freesound.org/previews/366/366916_5480813-lq.mp3",
    therapeuticUse: ["journeying", "theta-induction", "deep-meditation"],
    incogLevel: "A",
    manuscriptQuanta: "Ch4: The slow comeback begins",
    origin: "Various indigenous"
  },
  hangDrum: {
    id: "hangDrum",
    name: "Hang Drum",
    description: "Swiss steel handpan with ethereal harmonics",
    color: "from-slate-600 to-blue-700",
    category: "rhythm",
    audioUrl: "https://cdn.freesound.org/previews/360/360876_1676145-lq.mp3",
    therapeuticUse: ["meditation", "emotional-release", "creativity"],
    incogLevel: "A",
    manuscriptQuanta: "Ethereal moments of wonder",
    origin: "Switzerland"
  },
  kalimba: {
    id: "kalimba",
    name: "Kalimba",
    description: "African thumb piano for gentle, soothing melodies",
    color: "from-yellow-600 to-amber-700",
    category: "rhythm",
    audioUrl: "https://cdn.freesound.org/previews/514/514579_10703154-lq.mp3",
    therapeuticUse: ["soothing", "sleep", "gentle-focus"],
    incogLevel: "B",
    manuscriptQuanta: "Simple melodies, profound peace",
    origin: "Africa"
  },
  rainstick: {
    id: "rainstick",
    name: "Rain Stick",
    description: "Cactus rain stick for calming and grounding",
    color: "from-green-600 to-teal-700",
    category: "rhythm",
    audioUrl: "https://cdn.freesound.org/previews/400/400436_3741396-lq.mp3",
    therapeuticUse: ["calming", "grounding", "anxiety-relief"],
    incogLevel: "B",
    manuscriptQuanta: "Finding peace in the storm",
    origin: "South America"
  },

  // === BINAURAL BEATS (Synthesis - requires precision) ===
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
  type: "binaural" | "instrument";
  nodes: AudioNode[];
  gainNode: GainNode;
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
  const [globalVolume, setGlobalVolume] = useState(0.3);
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [pausedSounds, setPausedSounds] = useState<Set<string>>(new Set());
  
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null);
  const audioNodesRef = useRef<Map<string, AudioNodes>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // === INSTRUMENT AUDIO FILE PLAYBACK ===
  const createInstrumentPlayback = useCallback((config: AmbientSoundConfig): AudioNodes | null => {
    if (!config.audioUrl) return null;
    
    const ctx = getAudioContext();
    const audio = new Audio(config.audioUrl);
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    audio.volume = globalVolume;
    
    // Create gain node for Web Audio API integration
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume;
    masterGain.connect(ctx.destination);
    
    // Try to connect audio element to Web Audio for better control
    try {
      const source = ctx.createMediaElementSource(audio);
      source.connect(masterGain);
    } catch (e) {
      // If already connected or not supported, use native volume
      audio.volume = globalVolume;
    }
    
    audio.play().catch(console.error);
    audioElementsRef.current.set(config.id, audio);
    
    return { type: "instrument", nodes: [], gainNode: masterGain, audioElement: audio };
  }, [getAudioContext, globalVolume]);

  // === BINAURAL BEATS with warm pad undertone ===
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
    masterGain.gain.value = globalVolume * 0.25;
    
    const merger = ctx.createChannelMerger(2);
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGain);
    
    // Warm pad undertone (fifth and octave below)
    const padOsc1 = ctx.createOscillator();
    const padOsc2 = ctx.createOscillator();
    padOsc1.type = "sine";
    padOsc2.type = "sine";
    padOsc1.frequency.value = config.frequency / 2;
    padOsc2.frequency.value = config.frequency * 0.75;
    
    const padGain = ctx.createGain();
    padGain.gain.value = globalVolume * 0.08;
    
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

  // Pause/resume for audiobook
  useEffect(() => {
    if (isAudiobookPlaying) {
      const currentlyPlaying = new Set(activeSounds);
      setPausedSounds(currentlyPlaying);
      
      // Pause audio elements and mute nodes
      audioNodesRef.current.forEach((nodes, soundId) => {
        if (activeSounds.has(soundId)) {
          nodes.gainNode.gain.value = 0;
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
          nodes.gainNode.gain.value = globalVolume * 0.3;
          if (nodes.audioElement) {
            nodes.audioElement.play().catch(console.error);
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
        const volumeMultiplier = nodes.type === "binaural" ? 0.25 : 0.5;
        nodes.gainNode.gain.value = globalVolume * volumeMultiplier;
        if (nodes.audioElement) {
          nodes.audioElement.volume = globalVolume;
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
        nodes.gainNode.gain.value = 0;
        
        // Stop audio element
        if (nodes.audioElement) {
          nodes.audioElement.pause();
          nodes.audioElement.currentTime = 0;
          audioElementsRef.current.delete(soundId);
        }
        
        // Stop oscillators
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
        // Binaural beats use synthesis
        audioNodes = createBinauralBeat(config);
      } else if (config.audioUrl) {
        // Instruments use audio files
        audioNodes = createInstrumentPlayback(config);
      }
      
      if (audioNodes) {
        audioNodesRef.current.set(soundId, audioNodes);
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
  }, [activeSounds, isAudiobookPlaying, createBinauralBeat, createInstrumentPlayback]);

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
        const volumeMultiplier = nodes.type === "binaural" ? 0.25 : 0.5;
        nodes.gainNode.gain.value = globalVolume * volumeMultiplier;
        if (nodes.audioElement) {
          await nodes.audioElement.play().catch(console.error);
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
      // Stop all audio elements
      audioElementsRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioElementsRef.current.clear();
      
      // Stop all audio nodes
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
