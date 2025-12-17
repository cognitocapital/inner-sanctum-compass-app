import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Timer,
  Sparkles,
  Heart,
  Moon,
  Sun,
  Wind,
  Waves,
  Music2,
  Disc3,
  RotateCcw,
  ChevronRight,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Premium curated sounds - handpan, Tibetan instruments, sacred healing
interface MeditationSound {
  id: string;
  name: string;
  artist?: string;
  category: "handpan" | "tibetan" | "sacred" | "nature" | "ambient";
  audioUrl: string;
  description: string;
  duration?: string;
  gradient: string;
  icon: React.ElementType;
}

// High-quality free meditation audio from reliable CDNs
const MEDITATION_SOUNDS: MeditationSound[] = [
  // HANDPAN - Porangui / Steel Tongue style
  {
    id: "handpan-meditation",
    name: "Handpan Journey",
    artist: "Meditation Music",
    category: "handpan",
    audioUrl: "https://cdn.pixabay.com/audio/2024/04/18/audio_e2bf4f1b2f.mp3",
    description: "Ethereal steel harmonics for deep meditation",
    gradient: "from-slate-600 via-blue-600 to-indigo-700",
    icon: Disc3
  },
  {
    id: "hang-drum-healing",
    name: "Healing Resonance",
    category: "handpan",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/03/audio_bd59f5079d.mp3",
    description: "Warm overtones for heart opening",
    gradient: "from-amber-600 via-orange-500 to-rose-600",
    icon: Disc3
  },
  // TIBETAN - Flute, Bowls, Bells
  {
    id: "tibetan-bowls",
    name: "Tibetan Singing Bowls",
    category: "tibetan",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
    description: "Ancient resonance for chakra alignment",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    icon: Sparkles
  },
  {
    id: "tibetan-flute",
    name: "Mountain Flute",
    category: "tibetan",
    audioUrl: "https://cdn.pixabay.com/audio/2023/09/04/audio_5eb4c8ee4b.mp3",
    description: "Zen bamboo melodies from the highlands",
    gradient: "from-emerald-600 via-teal-500 to-cyan-600",
    icon: Wind
  },
  {
    id: "crystal-bowls",
    name: "Crystal Bowl Symphony",
    category: "tibetan",
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/14/audio_8df026ba35.mp3",
    description: "Pure crystalline frequencies for clarity",
    gradient: "from-white via-blue-200 to-purple-300",
    icon: Sparkles
  },
  // SACRED - Chants, Mantras, Spiritual
  {
    id: "sacred-chant",
    name: "Sacred Chant",
    artist: "Ancient Tradition",
    category: "sacred",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/18/audio_b4b6f96bdb.mp3",
    description: "Devotional sounds for spiritual connection",
    gradient: "from-purple-600 via-violet-500 to-fuchsia-600",
    icon: Heart
  },
  {
    id: "om-meditation",
    name: "Om Vibration",
    category: "sacred",
    audioUrl: "https://cdn.pixabay.com/audio/2021/08/09/audio_a0b9c56e9c.mp3",
    description: "Universal sound of creation",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    icon: Sun
  },
  // NATURE - Pure nature sounds
  {
    id: "ocean-waves",
    name: "Ocean Serenity",
    category: "nature",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/07/audio_82b7eb96a1.mp3",
    description: "Rhythmic waves for deep relaxation",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    icon: Waves
  },
  {
    id: "forest-stream",
    name: "Forest Sanctuary",
    category: "nature",
    audioUrl: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3",
    description: "Gentle stream through ancient forest",
    gradient: "from-green-600 via-emerald-500 to-teal-600",
    icon: Wind
  },
  {
    id: "rain-meditation",
    name: "Gentle Rain",
    category: "nature",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/16/audio_166dd9fc96.mp3",
    description: "Soft rain for peaceful sleep",
    gradient: "from-slate-500 via-gray-500 to-zinc-600",
    icon: Moon
  },
  // AMBIENT - Atmospheric, Dreamy
  {
    id: "ambient-space",
    name: "Cosmic Drift",
    category: "ambient",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
    description: "Floating through infinite space",
    gradient: "from-indigo-600 via-purple-600 to-violet-700",
    icon: Moon
  },
  {
    id: "kalimba-dreams",
    name: "Kalimba Dreams",
    category: "ambient",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_f8a6048598.mp3",
    description: "Gentle thumb piano lullaby",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    icon: Music2
  }
];

// Meditation journey presets
const JOURNEYS = [
  { 
    id: "morning", 
    name: "Morning Awakening", 
    duration: 10, 
    sounds: ["tibetan-flute", "crystal-bowls"],
    icon: Sun,
    gradient: "from-amber-400 to-orange-500"
  },
  { 
    id: "deep", 
    name: "Deep Meditation", 
    duration: 20, 
    sounds: ["handpan-meditation", "tibetan-bowls"],
    icon: Sparkles,
    gradient: "from-purple-500 to-violet-600"
  },
  { 
    id: "sleep", 
    name: "Sleep Journey", 
    duration: 30, 
    sounds: ["ocean-waves", "ambient-space"],
    icon: Moon,
    gradient: "from-indigo-500 to-blue-600"
  },
  { 
    id: "heart", 
    name: "Heart Opening", 
    duration: 15, 
    sounds: ["hang-drum-healing", "sacred-chant"],
    icon: Heart,
    gradient: "from-rose-500 to-pink-600"
  }
];

const CATEGORIES = [
  { id: "all", name: "All", icon: Sparkles },
  { id: "handpan", name: "Handpan", icon: Disc3 },
  { id: "tibetan", name: "Tibetan", icon: Sparkles },
  { id: "sacred", name: "Sacred", icon: Heart },
  { id: "nature", name: "Nature", icon: Wind },
  { id: "ambient", name: "Ambient", icon: Moon }
];

export default function MeditationSanctuary() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [category, setCategory] = useState("all");
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [view, setView] = useState<"sounds" | "journeys">("sounds");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter sounds by category
  const filteredSounds = category === "all" 
    ? MEDITATION_SOUNDS 
    : MEDITATION_SOUNDS.filter(s => s.category === category);

  // Play/pause sound
  const togglePlay = useCallback((soundId: string) => {
    const sound = MEDITATION_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    if (activeSound === soundId && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(sound.audioUrl);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
      audio.play().catch(console.error);
      setActiveSound(soundId);
      setIsPlaying(true);
    }
  }, [activeSound, isPlaying, volume]);

  // Stop all
  const stopAll = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setActiveSound(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeRemaining(0);
  }, []);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Timer
  useEffect(() => {
    if (timeRemaining > 0 && isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopAll();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining, isPlaying, stopAll]);

  // Start journey
  const startJourney = (journeyId: string) => {
    const journey = JOURNEYS.find(j => j.id === journeyId);
    if (!journey) return;
    
    setTimerMinutes(journey.duration);
    setTimeRemaining(journey.duration * 60);
    
    // Play first sound
    if (journey.sounds[0]) {
      togglePlay(journey.sounds[0]);
    }
  };

  // Start timer
  const startTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimeRemaining(minutes * 60);
    setShowTimer(false);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentSound = MEDITATION_SOUNDS.find(s => s.id === activeSound);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Now playing background glow */}
      {currentSound && isPlaying && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "fixed inset-0 pointer-events-none bg-gradient-to-br opacity-20",
            currentSound.gradient
          )}
        />
      )}

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-light tracking-wider">Sanctuary</h1>
          <p className="text-xs text-white/50 tracking-widest uppercase">Sacred Sound Temple</p>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowTimer(true)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Timer className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 pb-32">
        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => setView("sounds")}
            className={cn(
              "rounded-full px-6 transition-all",
              view === "sounds" 
                ? "bg-white/10 text-white" 
                : "text-white/50 hover:text-white"
            )}
          >
            <Music2 className="h-4 w-4 mr-2" />
            Sounds
          </Button>
          <Button
            variant="ghost"
            onClick={() => setView("journeys")}
            className={cn(
              "rounded-full px-6 transition-all",
              view === "journeys" 
                ? "bg-white/10 text-white" 
                : "text-white/50 hover:text-white"
            )}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Journeys
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {view === "journeys" ? (
            <motion.div
              key="journeys"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 max-w-xl mx-auto"
            >
              <p className="text-center text-white/50 text-sm mb-6">
                Curated meditation experiences
              </p>
              {JOURNEYS.map((journey) => {
                const Icon = journey.icon;
                return (
                  <motion.button
                    key={journey.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startJourney(journey.id)}
                    className={cn(
                      "w-full p-5 rounded-2xl bg-gradient-to-r text-left transition-all",
                      "border border-white/10 hover:border-white/20",
                      journey.gradient
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{journey.name}</h3>
                          <p className="text-white/70 text-sm">{journey.duration} minutes</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/50" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="sounds"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Headphones notice */}
              <div className="flex items-center justify-center gap-2 text-white/40 text-xs mb-4">
                <Headphones className="h-3 w-3" />
                <span>Best experienced with headphones</span>
              </div>

              {/* Category filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "rounded-full whitespace-nowrap shrink-0 transition-all",
                        category === cat.id 
                          ? "bg-white/10 text-white" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-1.5" />
                      {cat.name}
                    </Button>
                  );
                })}
              </div>

              {/* Sound grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {filteredSounds.map((sound) => {
                  const Icon = sound.icon;
                  const isActive = activeSound === sound.id;
                  
                  return (
                    <motion.button
                      key={sound.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => togglePlay(sound.id)}
                      className={cn(
                        "relative aspect-square rounded-2xl overflow-hidden transition-all",
                        "border border-white/10",
                        isActive && isPlaying && "ring-2 ring-white/30"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br transition-opacity",
                        sound.gradient,
                        isActive && isPlaying ? "opacity-100" : "opacity-60"
                      )} />
                      
                      {/* Playing indicator */}
                      {isActive && isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                className="w-1 bg-white rounded-full"
                                animate={{ height: [8, 24, 8] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.8,
                                  delay: i * 0.2,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 text-center">
                        <div className={cn(
                          "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 transition-all",
                          isActive && isPlaying ? "scale-110" : ""
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-sm font-medium line-clamp-2">{sound.name}</h3>
                        {sound.artist && (
                          <p className="text-xs text-white/60 mt-0.5">{sound.artist}</p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Now Playing Bar */}
      <AnimatePresence>
        {activeSound && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 pb-8 sm:pb-4">
              {/* Timer display */}
              {timeRemaining > 0 && (
                <div className="text-center mb-3">
                  <span className="text-2xl font-light tracking-widest text-white/80">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                {/* Sound info */}
                <div className={cn(
                  "w-14 h-14 rounded-xl shrink-0 bg-gradient-to-br flex items-center justify-center",
                  currentSound?.gradient
                )}>
                  {currentSound && <currentSound.icon className="h-6 w-6 text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{currentSound?.name}</h4>
                  <p className="text-sm text-white/50 truncate">{currentSound?.description}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => activeSound && togglePlay(activeSound)}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopAll}
                    className="text-white/50 hover:text-white"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Volume slider */}
              <div className="flex items-center gap-3 mt-4">
                <VolumeX className="h-4 w-4 text-white/50" />
                <Slider
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                  max={1}
                  step={0.01}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4 text-white/50" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Modal */}
      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTimer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-medium text-center mb-6">Set Timer</h3>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15, 20, 30, 45].map((mins) => (
                  <Button
                    key={mins}
                    variant="outline"
                    onClick={() => startTimer(mins)}
                    className="py-6 text-lg border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-white/50"
                onClick={() => setShowTimer(false)}
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}