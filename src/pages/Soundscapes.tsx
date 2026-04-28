import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Timer,
  AlertTriangle,
  Music,
  Quote,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SEOHead from "@/components/seo/SEOHead";
import {
  SOUNDSCAPE_TRACKS,
  CATEGORIES,
  TIMER_OPTIONS,
} from "@/data/soundscapesData";
import { useSoundscape } from "@/contexts/SoundscapeContext";
import soundscapesIllustration from "@/assets/soundscapes-illustration.jpg";

const Soundscapes = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showManuscript, setShowManuscript] = useState(false);

  const {
    selectedTrack,
    isPlaying,
    volume,
    isMuted,
    isLooping,
    timerMinutes,
    timeRemaining,
    selectTrack,
    togglePlay,
    setVolume,
    setIsMuted,
    setIsLooping,
    startTimer,
  } = useSoundscape();

  const filteredTracks =
    activeCategory === "all"
      ? SOUNDSCAPE_TRACKS
      : SOUNDSCAPE_TRACKS.filter((t) => t.category === activeCategory);

  const handleSelectTrack = (track: typeof SOUNDSCAPE_TRACKS[number]) => {
    selectTrack(track);
    setShowManuscript(true);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white dark relative overflow-hidden">
      <SEOHead
        title="Healing Soundscapes | What a Journey"
        description="Human-recorded 432 Hz, 528 Hz, Solfeggio, and Tibetan singing bowl tracks for TBI recovery and deep healing."
        path="/soundscapes"
      />

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
        <img
          src={soundscapesIllustration}
          alt="A meditating figure surrounded by glowing Tibetan singing bowls and concentric golden sound waves — visual metaphor for the Healing Soundscapes module of What a Journey, frequencies for nervous system reset and deep TBI recovery."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[35%] right-[20%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[55%] left-[25%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[45%] right-[30%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-[float_7s_ease-in-out_infinite_3s]" />
          <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute top-[75%] left-[40%] w-1 h-1 bg-amber-300 rounded-full opacity-55 shadow-[0_0_8px_3px_rgba(252,211,77,0.4)] animate-[float_6s_ease-in-out_infinite_2.5s]" />
        </div>

        {/* Back arrow — top left */}
        <Link to="/resources" className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110" title="Back to Resources">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Editorial title block */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
              A Healing Module · What a Journey
            </p>
            <h1 className="font-serif font-bold text-white text-5xl md:text-7xl leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              Healing Soundscapes
            </h1>
            <p className="mt-6 text-white/75 text-base md:text-lg max-w-xl font-light italic leading-relaxed mx-auto md:mx-0">
              Human-recorded 432 Hz, 528 Hz, Solfeggio scales and Tibetan singing bowls — frequencies to quiet the storm and reset the nervous system.
            </p>

            <p className="mt-8 flex items-start gap-2 text-xs text-white/60 max-w-md mx-auto md:mx-0">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-300/70 flex-shrink-0 mt-0.5" />
              <span>
                Not medical advice — start at low volume.{" "}
                <Link to="/disclaimer" className="underline text-orange-300/80 hover:text-orange-200 transition-colors">
                  Full disclaimer
                </Link>.
              </span>
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        {/* Section heading above tracks */}
        <div className="flex items-center gap-2 mb-6 text-orange-300/90">
          <Music className="h-5 w-5" />
          <h2 className="text-sm tracking-[0.3em] uppercase font-light">Choose Your Frequency</h2>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredTracks.map((track) => {
            const isActive = selectedTrack?.id === track.id;
            const isAvailable = !!track.audioUrl;

            return (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => handleSelectTrack(track)}
                  className={cn(
                    "cursor-pointer transition-all border-2 hover:shadow-lg",
                    isActive
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/30",
                    !isAvailable && "opacity-70"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          isActive && isPlaying
                            ? "bg-primary/20 animate-pulse"
                            : "bg-secondary"
                        )}
                      >
                        {track.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {track.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {track.description}
                        </p>
                        {track.frequency && (
                          <span className="inline-block mt-1.5 text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {track.frequency}
                          </span>
                        )}
                        {!isAvailable && (
                          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Coming soon
                          </span>
                        )}
                      </div>
                      {isActive && isPlaying && (
                        <div className="flex gap-0.5 items-end h-6 shrink-0">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-primary rounded-full"
                              animate={{ height: [4, 16, 8, 20, 4] }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Manuscript Tie-In */}
        <AnimatePresence>
          {showManuscript && selectedTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground italic leading-relaxed">
                        "{selectedTrack.manuscriptTieIn}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        — From <em>What a Journey</em> by Michael Heron
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Controls */}
        {selectedTrack && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-4 z-40"
          >
            <Card className="border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Track info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-xl w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {selectedTrack.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {selectedTrack.title}
                      </p>
                      {timeRemaining !== null && (
                        <p className="text-xs text-primary font-mono">
                          ⏱ {formatTimer(timeRemaining)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {/* Timer */}
                    <div className="hidden sm:flex items-center gap-1">
                      {TIMER_OPTIONS.map((opt) => (
                        <button
                          key={opt.minutes}
                          onClick={() => startTimer(opt.minutes)}
                          className={cn(
                            "text-xs px-2 py-1 rounded-md transition-colors",
                            timerMinutes === opt.minutes
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Loop */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsLooping(!isLooping)}
                      className={cn(
                        "h-9 w-9",
                        isLooping ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>

                    {/* Play/Pause */}
                    <Button
                      size="icon"
                      onClick={togglePlay}
                      disabled={!selectedTrack.audioUrl}
                      className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>

                    {/* Volume */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        max={100}
                        step={1}
                        onValueChange={(v) => setVolume(v[0] / 100)}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile timer row */}
                <div className="sm:hidden flex items-center gap-1 mt-3 justify-center">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  {TIMER_OPTIONS.map((opt) => (
                    <button
                      key={opt.minutes}
                      onClick={() => startTimer(opt.minutes)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-md transition-colors",
                        timerMinutes === opt.minutes
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-8 pb-20">
          <Card className="border-border">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold text-foreground mb-3">About Healing Frequencies</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">528 Hz</strong> — Known as the "Miracle Tone" or "Love Frequency." Research suggests potential benefits for stress reduction and cellular repair.
                </p>
                <p>
                  <strong className="text-foreground">432 Hz</strong> — Often called "Nature's Frequency." Many listeners report deeper relaxation compared to standard 440 Hz tuning.
                </p>
                <p>
                  <strong className="text-foreground">Solfeggio Frequencies</strong> — An ancient scale (396, 417, 528, 639, 741, 852 Hz) used in sacred music and modern sound therapy.
                </p>
                <p>
                  <strong className="text-foreground">Singing Bowls</strong> — Tibetan and crystal bowls produce rich harmonics that can promote meditative states and nervous system regulation.
                </p>
                <p className="text-xs border-t border-border pt-3 mt-3">
                  All tracks are human-recorded — no AI-generated audio. Sources include royalty-free libraries with real instruments: Tibetan bowls, crystal bowls, gongs, and soft synth layers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Soundscapes;
