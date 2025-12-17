import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Curated meditation sounds
const SOUNDS = [
  {
    id: "handpan",
    name: "Handpan Journey",
    description: "Ethereal steel harmonics",
    audioUrl: "https://cdn.pixabay.com/audio/2024/04/18/audio_e2bf4f1b2f.mp3",
  },
  {
    id: "tibetan-bowls",
    name: "Tibetan Singing Bowls",
    description: "Ancient resonance for stillness",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
  },
  {
    id: "crystal-bowls",
    name: "Crystal Bowl Symphony",
    description: "Pure crystalline frequencies",
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/14/audio_8df026ba35.mp3",
  },
  {
    id: "tibetan-flute",
    name: "Mountain Flute",
    description: "Zen bamboo melodies",
    audioUrl: "https://cdn.pixabay.com/audio/2023/09/04/audio_5eb4c8ee4b.mp3",
  },
  {
    id: "sacred-chant",
    name: "Sacred Chant",
    description: "Devotional sounds for peace",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/18/audio_b4b6f96bdb.mp3",
  },
  {
    id: "ocean-waves",
    name: "Ocean Serenity",
    description: "Rhythmic waves for calm",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/07/audio_82b7eb96a1.mp3",
  },
  {
    id: "forest-stream",
    name: "Forest Sanctuary",
    description: "Gentle stream sounds",
    audioUrl: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3",
  },
  {
    id: "rain",
    name: "Gentle Rain",
    description: "Soft rain for sleep",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/16/audio_166dd9fc96.mp3",
  },
];

export default function MeditationSanctuary() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play/pause toggle
  const toggleSound = (id: string) => {
    const sound = SOUNDS.find((s) => s.id === id);
    if (!sound) return;

    if (activeId === id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Create and play new audio
      const audio = new Audio(sound.audioUrl);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
      
      audio.play()
        .then(() => {
          setActiveId(id);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
    }
  };

  // Stop all
  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setActiveId(null);
  };

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const activeSound = SOUNDS.find((s) => s.id === activeId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Phoenix particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-float opacity-80" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-float opacity-70" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-[16%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-float opacity-45" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-2/3 right-[20%] w-2 h-2 bg-orange-500 rounded-full animate-float opacity-55" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-serif font-bold">Soundscapes</h1>
          <p className="text-xs text-white/60">Meditative audio for healing</p>
        </div>
      </header>

      {/* Sound List */}
      <main className="relative z-10 px-4 pb-40">
        <div className="max-w-xl mx-auto space-y-3">
          {SOUNDS.map((sound) => {
            const isActive = activeId === sound.id && isPlaying;
            
            return (
              <motion.button
                key={sound.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSound(sound.id)}
                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                  isActive
                    ? "bg-orange-500/20 border-orange-500/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isActive ? "bg-orange-500" : "bg-white/10"
                }`}>
                  {isActive ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{sound.name}</h3>
                  <p className="text-sm text-white/60">{sound.description}</p>
                </div>
                {isActive && (
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-orange-500 rounded-full"
                        animate={{ height: [6, 18, 6] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Now Playing Bar */}
      <AnimatePresence>
        {activeId && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-orange-500/20 p-4 pb-8 sm:pb-4"
          >
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-orange-400" />
                  ) : (
                    <Play className="h-4 w-4 text-orange-400 ml-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activeSound?.name}</p>
                  <p className="text-xs text-white/50">{activeSound?.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopAll}
                  className="text-white/60 hover:text-white text-xs"
                >
                  Stop
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-white/40" />
                <Slider
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                  max={1}
                  step={0.01}
                  className="flex-1"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
