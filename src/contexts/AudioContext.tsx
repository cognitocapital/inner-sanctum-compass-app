import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export type SoundCategory = "soundscapes" | "binaural" | "music";

export interface AmbientSoundConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  category: SoundCategory;
  // For binaural beats
  frequency?: number;
  beatFrequency?: number;
  // Sound type for advanced synthesis
  soundType?: "ocean" | "rain" | "forest" | "wind" | "bells" | "piano" | "phoenix" | "coherence";
  therapeuticUse?: string[];
  incogLevel?: "A" | "B" | "C";
  manuscriptQuanta?: string;
}

export const AMBIENT_SOUNDS: Record<string, AmbientSoundConfig> = {
  // === NATURE SOUNDSCAPES (Advanced Synthesis) ===
  ocean: {
    id: "ocean",
    name: "Ocean Waves",
    description: "Dynamic waves with rise and fall rhythm",
    color: "from-blue-400 to-cyan-600",
    category: "soundscapes",
    soundType: "ocean",
    therapeuticUse: ["relaxation", "sleep", "breathing"],
    incogLevel: "A",
    manuscriptQuanta: "Ch3: The overwhelming chaos gives way to peace"
  },
  rain: {
    id: "rain",
    name: "Gentle Rainfall",
    description: "Soft rain with distant thunder",
    color: "from-slate-500 to-blue-600",
    category: "soundscapes",
    soundType: "rain",
    therapeuticUse: ["sleep", "focus", "calm"],
    incogLevel: "A",
    manuscriptQuanta: "Finding peace in the storm"
  },
  forest: {
    id: "forest",
    name: "Forest Stream",
    description: "Babbling brook with birds singing",
    color: "from-green-500 to-emerald-700",
    category: "soundscapes",
    soundType: "forest",
    therapeuticUse: ["grounding", "meditation", "stress-relief"],
    incogLevel: "A",
    manuscriptQuanta: "Intro: Gratitude for the journey"
  },
  wind: {
    id: "wind",
    name: "Night Wind",
    description: "Breath-like wind with gentle howls",
    color: "from-indigo-400 to-slate-600",
    category: "soundscapes",
    soundType: "wind",
    therapeuticUse: ["alertness", "grounding", "meditation"],
    incogLevel: "B",
    manuscriptQuanta: "Ch4: Slow comeback, learning resilience"
  },

  // === BINAURAL BEATS (With Warm Pad) ===
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

  // === HEALING MUSIC (Melodic Synthesis) ===
  meditationBells: {
    id: "meditationBells",
    name: "Meditation Bells",
    description: "Tibetan singing bowls at 432Hz & 528Hz",
    color: "from-amber-300 to-yellow-500",
    category: "music",
    soundType: "bells",
    therapeuticUse: ["meditation", "clarity", "focus"],
    incogLevel: "B",
    manuscriptQuanta: "Moments of stillness and clarity"
  },
  ambientPiano: {
    id: "ambientPiano",
    name: "Ambient Piano",
    description: "Gentle chord progression for emotional healing",
    color: "from-purple-400 to-pink-500",
    category: "music",
    soundType: "piano",
    therapeuticUse: ["emotional-healing", "relaxation", "reflection"],
    incogLevel: "B",
    manuscriptQuanta: "Ch3: Tears of gratitude"
  },
  phoenixRising: {
    id: "phoenixRising",
    name: "Phoenix Rising",
    description: "Ascending melody of hope and renewal",
    color: "from-orange-400 to-red-500",
    category: "music",
    soundType: "phoenix",
    therapeuticUse: ["motivation", "hope", "transformation"],
    incogLevel: "C",
    manuscriptQuanta: "Prologue: The human spirit rises"
  },
  heartCoherence: {
    id: "heartCoherence",
    name: "Heart Coherence",
    description: "5Hz pulse with harmonic overtones",
    color: "from-pink-500 to-red-500",
    category: "music",
    soundType: "coherence",
    therapeuticUse: ["emotional-healing", "heart-coherence", "gratitude"],
    incogLevel: "B",
    manuscriptQuanta: "Heart-centered gratitude"
  },
};

interface AudioNodes {
  type: "binaural" | "soundscape" | "music";
  nodes: AudioNode[];
  gainNode: GainNode;
  intervalIds?: number[];
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

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Create noise buffer
  const createNoiseBuffer = useCallback((ctx: globalThis.AudioContext, type: "white" | "pink" | "brown", duration = 4): AudioBuffer => {
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
  }, []);

  // === OCEAN WAVES: Pink noise with LFO amplitude modulation ===
  const createOceanWaves = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const noiseBuffer = createNoiseBuffer(ctx, "pink", 8);
    
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    
    // Lowpass filter for ocean depth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 1;
    
    // LFO for wave rhythm (0.08Hz = ~12 second wave cycle)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.4;
    
    const ampMod = ctx.createGain();
    ampMod.gain.value = 0.6;
    
    lfo.connect(lfoGain);
    lfoGain.connect(ampMod.gain);
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.5;
    
    source.connect(filter);
    filter.connect(ampMod);
    ampMod.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    source.start();
    lfo.start();
    
    return { type: "soundscape", nodes: [source, lfo, filter, ampMod], gainNode: masterGain };
  }, [getAudioContext, createNoiseBuffer, globalVolume]);

  // === RAINFALL: White noise with occasional low rumble ===
  const createRainfall = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const rainBuffer = createNoiseBuffer(ctx, "white", 4);
    
    const rainSource = ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;
    
    // Highpass to make it "rainy"
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 800;
    
    // Lowpass to soften
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 6000;
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.35;
    
    rainSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    rainSource.start();
    
    // Thunder rumble layer (occasional low frequency)
    const thunderBuffer = createNoiseBuffer(ctx, "brown", 2);
    const intervals: number[] = [];
    
    const playThunder = () => {
      const thunder = ctx.createBufferSource();
      thunder.buffer = thunderBuffer;
      const thunderGain = ctx.createGain();
      thunderGain.gain.setValueAtTime(0, ctx.currentTime);
      thunderGain.gain.linearRampToValueAtTime(globalVolume * 0.15, ctx.currentTime + 0.5);
      thunderGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
      
      const thunderFilter = ctx.createBiquadFilter();
      thunderFilter.type = "lowpass";
      thunderFilter.frequency.value = 200;
      
      thunder.connect(thunderFilter);
      thunderFilter.connect(thunderGain);
      thunderGain.connect(ctx.destination);
      thunder.start();
    };
    
    // Random thunder every 15-30 seconds
    const thunderInterval = window.setInterval(() => {
      if (Math.random() > 0.5) playThunder();
    }, 20000);
    intervals.push(thunderInterval);
    
    return { type: "soundscape", nodes: [rainSource, highpass, lowpass], gainNode: masterGain, intervalIds: intervals };
  }, [getAudioContext, createNoiseBuffer, globalVolume]);

  // === FOREST STREAM: Brown noise + FM synthesis birds ===
  const createForestStream = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const streamBuffer = createNoiseBuffer(ctx, "brown", 4);
    
    const streamSource = ctx.createBufferSource();
    streamSource.buffer = streamBuffer;
    streamSource.loop = true;
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 400;
    bandpass.Q.value = 0.5;
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.4;
    
    streamSource.connect(bandpass);
    bandpass.connect(masterGain);
    masterGain.connect(ctx.destination);
    streamSource.start();
    
    const intervals: number[] = [];
    
    // Bird chirps using FM synthesis
    const playBird = () => {
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const birdGain = ctx.createGain();
      
      const baseFreq = 1800 + Math.random() * 800;
      carrier.frequency.value = baseFreq;
      modulator.frequency.value = baseFreq * 2;
      modGain.gain.value = 200;
      
      birdGain.gain.setValueAtTime(0, ctx.currentTime);
      birdGain.gain.linearRampToValueAtTime(globalVolume * 0.08, ctx.currentTime + 0.05);
      birdGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      
      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(birdGain);
      birdGain.connect(ctx.destination);
      
      carrier.start();
      modulator.start();
      carrier.stop(ctx.currentTime + 0.4);
      modulator.stop(ctx.currentTime + 0.4);
    };
    
    // Random birds every 3-8 seconds
    const birdInterval = window.setInterval(() => {
      if (Math.random() > 0.3) playBird();
    }, 5000);
    intervals.push(birdInterval);
    
    return { type: "soundscape", nodes: [streamSource, bandpass], gainNode: masterGain, intervalIds: intervals };
  }, [getAudioContext, createNoiseBuffer, globalVolume]);

  // === NIGHT WIND: Pink noise with breath-like envelope ===
  const createNightWind = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const windBuffer = createNoiseBuffer(ctx, "pink", 6);
    
    const windSource = ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;
    
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1200;
    
    // Breath-like LFO (4 second cycle)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.5;
    
    const ampMod = ctx.createGain();
    ampMod.gain.value = 0.5;
    
    lfo.connect(lfoGain);
    lfoGain.connect(ampMod.gain);
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.4;
    
    windSource.connect(lowpass);
    lowpass.connect(ampMod);
    ampMod.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    windSource.start();
    lfo.start();
    
    return { type: "soundscape", nodes: [windSource, lfo, lowpass, ampMod], gainNode: masterGain };
  }, [getAudioContext, createNoiseBuffer, globalVolume]);

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
    padOsc1.frequency.value = config.frequency / 2; // Octave below
    padOsc2.frequency.value = config.frequency * 0.75; // Fifth below
    
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

  // === MEDITATION BELLS: Tuned oscillators with exponential decay ===
  const createMeditationBells = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.3;
    masterGain.connect(ctx.destination);
    
    const frequencies = [432, 528, 639, 741]; // Solfeggio frequencies
    const intervals: number[] = [];
    
    const playBell = (freq: number) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const bellGain = ctx.createGain();
      
      osc.type = "sine";
      osc2.type = "sine";
      osc.frequency.value = freq;
      osc2.frequency.value = freq * 2.02; // Slight detuning for shimmer
      
      bellGain.gain.setValueAtTime(globalVolume * 0.2, ctx.currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8);
      
      osc.connect(bellGain);
      osc2.connect(bellGain);
      bellGain.connect(masterGain);
      
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 8);
      osc2.stop(ctx.currentTime + 8);
    };
    
    // Play bell every 6-10 seconds
    let bellIndex = 0;
    const bellInterval = window.setInterval(() => {
      playBell(frequencies[bellIndex % frequencies.length]);
      bellIndex++;
    }, 7000);
    intervals.push(bellInterval);
    
    // Initial bell
    playBell(frequencies[0]);
    
    return { type: "music", nodes: [], gainNode: masterGain, intervalIds: intervals };
  }, [getAudioContext, globalVolume]);

  // === AMBIENT PIANO: Chord progression using additive synthesis ===
  const createAmbientPiano = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.25;
    masterGain.connect(ctx.destination);
    
    // Am - F - C - G progression (simplified frequencies)
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [261.63, 329.63, 392], // C
      [196, 246.94, 293.66], // G
    ];
    
    const intervals: number[] = [];
    let chordIndex = 0;
    
    const playChord = (freqs: number[]) => {
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.value = freq;
        
        // Gentle attack and decay
        chordGain.gain.setValueAtTime(0, ctx.currentTime);
        chordGain.gain.linearRampToValueAtTime(globalVolume * 0.12, ctx.currentTime + 0.8);
        chordGain.gain.linearRampToValueAtTime(globalVolume * 0.08, ctx.currentTime + 4);
        chordGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 8);
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1000;
        
        osc.connect(filter);
        filter.connect(chordGain);
        chordGain.connect(masterGain);
        
        osc.start(ctx.currentTime + i * 0.1); // Slight arpeggiation
        osc.stop(ctx.currentTime + 8);
      });
    };
    
    // Play chord every 8 seconds
    const chordInterval = window.setInterval(() => {
      playChord(chords[chordIndex % chords.length]);
      chordIndex++;
    }, 8000);
    intervals.push(chordInterval);
    
    // Initial chord
    playChord(chords[0]);
    
    return { type: "music", nodes: [], gainNode: masterGain, intervalIds: intervals };
  }, [getAudioContext, globalVolume]);

  // === PHOENIX RISING: Ascending pentatonic melody with warm pad ===
  const createPhoenixRising = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.3;
    masterGain.connect(ctx.destination);
    
    // Pentatonic scale notes (A minor pentatonic)
    const notes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
    const intervals: number[] = [];
    let noteIndex = 0;
    
    // Background pad
    const padOsc = ctx.createOscillator();
    padOsc.type = "sine";
    padOsc.frequency.value = 110; // A2
    
    const padGain = ctx.createGain();
    padGain.gain.value = globalVolume * 0.1;
    
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 400;
    
    padOsc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(masterGain);
    padOsc.start();
    
    const playNote = (freq: number) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.value = freq;
      
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(globalVolume * 0.15, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
      
      osc.connect(noteGain);
      noteGain.connect(masterGain);
      
      osc.start();
      osc.stop(ctx.currentTime + 3);
    };
    
    // Play ascending notes
    const noteInterval = window.setInterval(() => {
      playNote(notes[noteIndex % notes.length]);
      noteIndex++;
      if (noteIndex >= notes.length) noteIndex = 0; // Loop back
    }, 3000);
    intervals.push(noteInterval);
    
    return { type: "music", nodes: [padOsc, padFilter], gainNode: masterGain, intervalIds: intervals };
  }, [getAudioContext, globalVolume]);

  // === HEART COHERENCE: 5Hz pulse with harmonic series ===
  const createHeartCoherence = useCallback((): AudioNodes => {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = globalVolume * 0.25;
    masterGain.connect(ctx.destination);
    
    // Base frequency (136.1 Hz - OM frequency)
    const baseFreq = 136.1;
    const harmonics = [1, 2, 3, 4, 5];
    const oscs: OscillatorNode[] = [];
    
    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const harmGain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = baseFreq * h;
      harmGain.gain.value = 0.2 / (i + 1); // Decreasing amplitude for higher harmonics
      
      osc.connect(harmGain);
      harmGain.connect(masterGain);
      osc.start();
      oscs.push(osc);
    });
    
    // 5Hz amplitude modulation for heart coherence
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 5;
    lfoGain.gain.value = 0.3;
    
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();
    
    return { type: "music", nodes: [...oscs, lfo], gainNode: masterGain };
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
        const volumeMultiplier = nodes.type === "music" ? 0.25 : nodes.type === "binaural" ? 0.25 : 0.4;
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
        // Clear intervals
        nodes.intervalIds?.forEach(id => window.clearInterval(id));
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
      } else if (config.soundType) {
        switch (config.soundType) {
          case "ocean": audioNodes = createOceanWaves(); break;
          case "rain": audioNodes = createRainfall(); break;
          case "forest": audioNodes = createForestStream(); break;
          case "wind": audioNodes = createNightWind(); break;
          case "bells": audioNodes = createMeditationBells(); break;
          case "piano": audioNodes = createAmbientPiano(); break;
          case "phoenix": audioNodes = createPhoenixRising(); break;
          case "coherence": audioNodes = createHeartCoherence(); break;
        }
      }
      
      if (audioNodes) {
        audioNodesRef.current.set(soundId, audioNodes);
        setActiveSounds(prev => new Set([...prev, soundId]));
      }
    }
  }, [activeSounds, isAudiobookPlaying, createBinauralBeat, createOceanWaves, createRainfall, createForestStream, createNightWind, createMeditationBells, createAmbientPiano, createPhoenixRising, createHeartCoherence]);

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
        const volumeMultiplier = nodes.type === "music" ? 0.25 : nodes.type === "binaural" ? 0.25 : 0.4;
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
        nodes.intervalIds?.forEach(id => window.clearInterval(id));
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