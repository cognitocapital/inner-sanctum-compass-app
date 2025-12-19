import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudio, AMBIENT_SOUNDS } from "@/contexts/AudioContext";

const CATEGORY_LABELS = {
  bowls: { name: "Singing Bowls", icon: "🔔" },
  nature: { name: "Nature", icon: "🌿" },
  lounge: { name: "Spa & Lounge", icon: "✨" },
  chant: { name: "Sacred", icon: "🙏" },
};

export default function MeditationSanctuary() {
  const { 
    activeSound, 
    isPlaying, 
    volume, 
    playWithCrossfade, 
    setVolume, 
    stopAll 
  } = useAudio();

  const activeConfig = AMBIENT_SOUNDS.find(s => s.id === activeSound);

  // Group sounds by category
  const groupedSounds = AMBIENT_SOUNDS.reduce((acc, sound) => {
    if (!acc[sound.category]) acc[sound.category] = [];
    acc[sound.category].push(sound);
    return acc;
  }, {} as Record<string, typeof AMBIENT_SOUNDS>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Phoenix particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + (i % 3) * 35}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-serif font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-400" />
            Soundscapes
          </h1>
          <p className="text-xs text-white/60">High-fidelity meditation audio • 48kHz binaural</p>
        </div>
      </header>

      {/* Sound Categories */}
      <main className="relative z-10 px-4 pb-40">
        <div className="max-w-xl mx-auto space-y-6">
          {Object.entries(groupedSounds).map(([category, sounds]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]?.icon}</span>
                <h2 className="text-sm font-medium text-white/80">
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]?.name}
                </h2>
              </div>
              
              <div className="space-y-2">
                {sounds.map((sound) => {
                  const isActive = activeSound === sound.id && isPlaying;

                  return (
                    <motion.button
                      key={sound.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => playWithCrossfade(sound.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                        isActive
                          ? "bg-orange-500/20 border-orange-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive ? "bg-orange-500" : "bg-white/10"
                        }`}
                      >
                        {isActive ? (
                          <Pause className="h-5 w-5 text-white" />
                        ) : (
                          <Play className="h-5 w-5 text-white ml-0.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{sound.icon}</span>
                          <h3 className="font-medium">{sound.name}</h3>
                        </div>
                        <p className="text-sm text-white/60">{sound.description}</p>
                        <div className="flex gap-2 mt-1 text-[10px] text-white/40">
                          <span className="px-1.5 py-0.5 rounded bg-white/5">{sound.quality}</span>
                          {sound.binaural && (
                            <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300">
                              {sound.binaural} binaural
                            </span>
                          )}
                        </div>
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
            </div>
          ))}
        </div>
      </main>

      {/* Now Playing Bar */}
      <AnimatePresence>
        {activeSound && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-orange-500/20 p-4 pb-8 sm:pb-4"
          >
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <span className="text-lg">{activeConfig?.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activeConfig?.name}</p>
                  <div className="flex gap-2 text-[10px] text-white/40">
                    <span>{activeConfig?.quality}</span>
                    {activeConfig?.binaural && <span>• {activeConfig.binaural} waves</span>}
                    <span>• Seamless loop</span>
                  </div>
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
                <span className="text-xs text-white/50 w-8">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
