/**
 * Healing Sound Engine - Procedurally generated ambient soundscapes
 * Uses Tone.js for rich, synthesized audio that works offline with zero CDN dependencies
 */
import * as Tone from "tone";

export type SoundType = 
  | "tibetanBowl" 
  | "crystalBowl" 
  | "templeGong" 
  | "tingshas"
  | "oceanWaves" 
  | "rainForest" 
  | "birdsong"
  | "windChimes"
  | "thetaBinaural"
  | "alphaBinaural"
  | "betaBinaural"
  | "deltaBinaural";

interface ActiveSound {
  type: SoundType;
  nodes: Tone.ToneAudioNode[];
  cleanup: () => void;
}

class HealingSoundEngine {
  private activeSounds: Map<SoundType, ActiveSound> = new Map();
  private masterVolume: Tone.Volume;
  private isInitialized = false;
  private reverb: Tone.Reverb;

  constructor() {
    this.masterVolume = new Tone.Volume(-6).toDestination();
    this.reverb = new Tone.Reverb({ decay: 4, wet: 0.3 }).connect(this.masterVolume);
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;
    await Tone.start();
    await this.reverb.generate();
    this.isInitialized = true;
  }

  setVolume(volume: number): void {
    // Convert 0-1 to dB scale (-60 to 0)
    const db = volume === 0 ? -Infinity : Tone.gainToDb(volume);
    this.masterVolume.volume.rampTo(db, 0.1);
  }

  isPlaying(type: SoundType): boolean {
    return this.activeSounds.has(type);
  }

  async toggle(type: SoundType): Promise<boolean> {
    await this.init();

    if (this.activeSounds.has(type)) {
      this.stop(type);
      return false;
    } else {
      await this.start(type);
      return true;
    }
  }

  private async start(type: SoundType): Promise<void> {
    let sound: ActiveSound;

    switch (type) {
      case "tibetanBowl":
        sound = this.createTibetanBowl();
        break;
      case "crystalBowl":
        sound = this.createCrystalBowl();
        break;
      case "templeGong":
        sound = this.createTempleGong();
        break;
      case "tingshas":
        sound = this.createTingshas();
        break;
      case "oceanWaves":
        sound = this.createOceanWaves();
        break;
      case "rainForest":
        sound = this.createRainForest();
        break;
      case "birdsong":
        sound = this.createBirdsong();
        break;
      case "windChimes":
        sound = this.createWindChimes();
        break;
      case "thetaBinaural":
        sound = this.createBinauralBeat(200, 7); // Theta 7Hz
        break;
      case "alphaBinaural":
        sound = this.createBinauralBeat(220, 10); // Alpha 10Hz
        break;
      case "betaBinaural":
        sound = this.createBinauralBeat(250, 18); // Beta 18Hz
        break;
      case "deltaBinaural":
        sound = this.createBinauralBeat(150, 3); // Delta 3Hz
        break;
      default:
        return;
    }

    this.activeSounds.set(type, sound);
  }

  stop(type: SoundType): void {
    const sound = this.activeSounds.get(type);
    if (sound) {
      sound.cleanup();
      this.activeSounds.delete(type);
    }
  }

  stopAll(): void {
    this.activeSounds.forEach((sound) => sound.cleanup());
    this.activeSounds.clear();
  }

  pauseAll(): void {
    Tone.getTransport().pause();
  }

  resumeAll(): void {
    Tone.getTransport().start();
  }

  // === SACRED INSTRUMENTS ===

  private createTibetanBowl(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Rich bell harmonics with slow attack and long decay
    const fundamentalFreq = 220; // A3
    const harmonics = [1, 2.71, 4.16, 5.43, 6.58, 7.64];
    const gains = [1, 0.6, 0.4, 0.25, 0.15, 0.1];
    
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.8,
      decay: 3,
      sustain: 0.4,
      release: 4,
    }).connect(this.reverb);
    nodes.push(envelope);

    harmonics.forEach((harmonic, i) => {
      const osc = new Tone.Oscillator({
        frequency: fundamentalFreq * harmonic,
        type: "sine",
        volume: Tone.gainToDb(gains[i] * 0.3),
      }).connect(envelope);
      osc.start();
      nodes.push(osc);
    });

    // Subtle LFO for organic wobble
    const lfo = new Tone.LFO({
      frequency: 0.1,
      min: 0.95,
      max: 1.05,
    }).start();
    nodes.push(lfo);

    envelope.triggerAttack();

    // Re-trigger periodically for continuous sound
    const interval = setInterval(() => {
      envelope.triggerAttack();
    }, 8000);

    return {
      type: "tibetanBowl",
      nodes,
      cleanup: () => {
        clearInterval(interval);
        envelope.triggerRelease();
        setTimeout(() => {
          nodes.forEach(n => n.dispose());
        }, 4000);
      }
    };
  }

  private createCrystalBowl(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Pure 528Hz "Love frequency" with crystal clarity
    const freq = 528;
    
    const filter = new Tone.Filter({
      frequency: 2000,
      type: "lowpass",
      rolloff: -12,
    }).connect(this.reverb);
    nodes.push(filter);

    const mainOsc = new Tone.Oscillator({
      frequency: freq,
      type: "sine",
      volume: -12,
    }).connect(filter);
    mainOsc.start();
    nodes.push(mainOsc);

    // Subtle shimmer with detuned partials
    const shimmer1 = new Tone.Oscillator({
      frequency: freq * 2,
      type: "sine",
      volume: -20,
    }).connect(filter);
    shimmer1.start();
    nodes.push(shimmer1);

    const shimmer2 = new Tone.Oscillator({
      frequency: freq * 3,
      type: "sine",
      volume: -24,
    }).connect(filter);
    shimmer2.start();
    nodes.push(shimmer2);

    // Gentle amplitude modulation for breathing effect
    const tremolo = new Tone.Tremolo({
      frequency: 0.08,
      depth: 0.2,
    }).connect(filter).start();
    mainOsc.disconnect();
    mainOsc.connect(tremolo);
    nodes.push(tremolo);

    return {
      type: "crystalBowl",
      nodes,
      cleanup: () => {
        nodes.forEach(n => n.dispose());
      }
    };
  }

  private createTempleGong(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Deep gong with complex harmonics
    const membrane = new Tone.MembraneSynth({
      pitchDecay: 0.5,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 4,
        sustain: 0.01,
        release: 4,
      },
      volume: -10,
    }).connect(this.reverb);
    nodes.push(membrane);

    // Add metallic shimmer with noise-based approach
    const metalNoise = new Tone.Noise("white").start();
    const metalFilter = new Tone.Filter({
      frequency: 3000,
      type: "bandpass",
      Q: 8,
    }).connect(this.reverb);
    const metalEnv = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 2,
      sustain: 0,
      release: 2,
    }).connect(metalFilter);
    metalNoise.connect(metalEnv);
    nodes.push(metalNoise, metalFilter, metalEnv);

    // Initial strike
    membrane.triggerAttackRelease("C1", 4);
    metalEnv.triggerAttack();
    setTimeout(() => metalEnv.triggerRelease(), 100);

    // Periodic re-strikes
    const interval = setInterval(() => {
      membrane.triggerAttackRelease("C1", 4);
      metalEnv.triggerAttack();
      setTimeout(() => metalEnv.triggerRelease(), 100);
    }, 12000);

    return {
      type: "templeGong",
      nodes,
      cleanup: () => {
        clearInterval(interval);
        metalNoise.stop();
        nodes.forEach(n => n.dispose());
      }
    };
  }

  private createTingshas(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // High-pitched Tibetan cymbals using FM synthesis
    const synth = new Tone.FMSynth({
      harmonicity: 12,
      modulationIndex: 20,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.001,
        decay: 1.5,
        sustain: 0,
        release: 2,
      },
      modulation: { type: "square" },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.5,
      },
      volume: -15,
    }).connect(this.reverb);
    nodes.push(synth);

    // Initial chime
    synth.triggerAttackRelease("C6", 1.5);

    // Periodic chimes with slight randomness
    const interval = setInterval(() => {
      synth.triggerAttackRelease("C6", 1.5);
    }, 6000 + Math.random() * 2000);

    return {
      type: "tingshas",
      nodes,
      cleanup: () => {
        clearInterval(interval);
        nodes.forEach(n => n.dispose());
      }
    };
  }

  // === NATURE SOUNDSCAPES ===

  private createOceanWaves(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Pink noise for ocean base
    const noise = new Tone.Noise("pink").start();
    nodes.push(noise);

    // Bandpass filter for wave character
    const filter = new Tone.Filter({
      frequency: 600,
      type: "bandpass",
      Q: 0.8,
    }).connect(this.masterVolume);
    nodes.push(filter);

    // AutoFilter for wave rhythm
    const autoFilter = new Tone.AutoFilter({
      frequency: 0.05, // Very slow waves
      baseFrequency: 200,
      octaves: 4,
      depth: 0.8,
    }).connect(filter).start();
    noise.connect(autoFilter);
    nodes.push(autoFilter);

    // Volume automation for wave swells
    const gainLFO = new Tone.LFO({
      frequency: 0.08,
      min: -24,
      max: -12,
    }).start();
    nodes.push(gainLFO);

    const gain = new Tone.Gain().connect(filter);
    gainLFO.connect(gain.gain);
    autoFilter.connect(gain);
    nodes.push(gain);

    return {
      type: "oceanWaves",
      nodes,
      cleanup: () => {
        noise.stop();
        nodes.forEach(n => n.dispose());
      }
    };
  }

  private createRainForest(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Rain base - filtered noise
    const rain = new Tone.Noise("white").start();
    nodes.push(rain);

    const rainFilter = new Tone.Filter({
      frequency: 4000,
      type: "highpass",
      rolloff: -24,
    }).connect(this.masterVolume);
    nodes.push(rainFilter);

    const rainGain = new Tone.Gain(-18).connect(rainFilter);
    rain.connect(rainGain);
    nodes.push(rainGain);

    // Random droplet sounds using filtered clicks
    const dropletSynth = new Tone.PluckSynth({
      attackNoise: 4,
      dampening: 8000,
      resonance: 0.98,
      volume: -20,
    }).connect(this.reverb);
    nodes.push(dropletSynth);

    // Random droplets
    const dropletInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const note = Tone.Frequency(800 + Math.random() * 1200).toNote();
        dropletSynth.triggerAttack(note);
      }
    }, 200);

    // Distant thunder rumble occasionally
    const thunder = new Tone.Noise("brown");
    const thunderFilter = new Tone.Filter({
      frequency: 100,
      type: "lowpass",
    }).connect(this.masterVolume);
    const thunderGain = new Tone.Gain(-30).connect(thunderFilter);
    thunder.connect(thunderGain);
    nodes.push(thunder, thunderFilter, thunderGain);

    const thunderInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        thunder.start();
        thunderGain.gain.rampTo(-15, 0.5);
        setTimeout(() => {
          thunderGain.gain.rampTo(-30, 2);
          setTimeout(() => thunder.stop(), 2000);
        }, 500);
      }
    }, 15000);

    return {
      type: "rainForest",
      nodes,
      cleanup: () => {
        clearInterval(dropletInterval);
        clearInterval(thunderInterval);
        rain.stop();
        thunder.stop();
        nodes.forEach(n => n.dispose());
      }
    };
  }

  private createBirdsong(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Bird chirp synthesizer
    const birdSynth = new Tone.MonoSynth({
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.1,
        baseFrequency: 2000,
        octaves: 2,
      },
      volume: -15,
    }).connect(this.reverb);
    nodes.push(birdSynth);

    // Multiple bird patterns
    const birdPatterns = [
      ["E6", "G6", "E6"],
      ["C6", "D6", "E6", "D6"],
      ["A5", "C6"],
      ["F6", "E6", "D6"],
    ];

    const chirpInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const pattern = birdPatterns[Math.floor(Math.random() * birdPatterns.length)];
        pattern.forEach((note, i) => {
          setTimeout(() => {
            birdSynth.triggerAttackRelease(note, "32n");
          }, i * 80);
        });
      }
    }, 1500 + Math.random() * 2000);

    // Ambient background hum
    const ambience = new Tone.Noise("pink").start();
    const ambienceFilter = new Tone.Filter({
      frequency: 2000,
      type: "lowpass",
    }).connect(this.masterVolume);
    const ambienceGain = new Tone.Gain(-28).connect(ambienceFilter);
    ambience.connect(ambienceGain);
    nodes.push(ambience, ambienceFilter, ambienceGain);

    return {
      type: "birdsong",
      nodes,
      cleanup: () => {
        clearInterval(chirpInterval);
        ambience.stop();
        nodes.forEach(n => n.dispose());
      }
    };
  }

  private createWindChimes(): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Pentatonic wind chime tones
    const chimeNotes = ["C5", "D5", "E5", "G5", "A5", "C6", "D6"];
    
    const chimeSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 2,
        sustain: 0,
        release: 2,
      },
      volume: -12,
    }).connect(this.reverb);
    nodes.push(chimeSynth);

    // Random chimes triggered by "wind"
    const chimeInterval = setInterval(() => {
      const numChimes = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numChimes; i++) {
        setTimeout(() => {
          const note = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
          chimeSynth.triggerAttackRelease(note, "2n");
        }, i * (100 + Math.random() * 200));
      }
    }, 2000 + Math.random() * 3000);

    // Subtle wind noise
    const wind = new Tone.Noise("pink").start();
    const windFilter = new Tone.AutoFilter({
      frequency: 0.1,
      baseFrequency: 500,
      octaves: 3,
    }).connect(this.masterVolume).start();
    const windGain = new Tone.Gain(-26).connect(windFilter);
    wind.connect(windGain);
    nodes.push(wind, windFilter, windGain);

    return {
      type: "windChimes",
      nodes,
      cleanup: () => {
        clearInterval(chimeInterval);
        wind.stop();
        nodes.forEach(n => n.dispose());
      }
    };
  }

  // === BINAURAL BEATS ===

  private createBinauralBeat(baseFreq: number, beatFreq: number): ActiveSound {
    const nodes: Tone.ToneAudioNode[] = [];
    
    // Left ear oscillator
    const leftOsc = new Tone.Oscillator({
      frequency: baseFreq,
      type: "sine",
      volume: -12,
    });
    
    // Right ear oscillator (slightly higher for beat)
    const rightOsc = new Tone.Oscillator({
      frequency: baseFreq + beatFreq,
      type: "sine",
      volume: -12,
    });

    // Stereo panner for each ear
    const leftPanner = new Tone.Panner(-1).connect(this.masterVolume);
    const rightPanner = new Tone.Panner(1).connect(this.masterVolume);

    leftOsc.connect(leftPanner);
    rightOsc.connect(rightPanner);

    leftOsc.start();
    rightOsc.start();

    nodes.push(leftOsc, rightOsc, leftPanner, rightPanner);

    // Add warm pad undertone for richness
    const padOsc = new Tone.Oscillator({
      frequency: baseFreq / 2,
      type: "sine",
      volume: -20,
    }).connect(this.masterVolume);
    padOsc.start();
    nodes.push(padOsc);

    // Determine type based on beat frequency
    let type: SoundType = "thetaBinaural";
    if (beatFreq >= 8 && beatFreq <= 12) type = "alphaBinaural";
    else if (beatFreq >= 13) type = "betaBinaural";
    else if (beatFreq <= 4) type = "deltaBinaural";

    return {
      type,
      nodes,
      cleanup: () => {
        leftOsc.stop();
        rightOsc.stop();
        padOsc.stop();
        nodes.forEach(n => n.dispose());
      }
    };
  }
}

// Singleton instance
export const healingSoundEngine = new HealingSoundEngine();
