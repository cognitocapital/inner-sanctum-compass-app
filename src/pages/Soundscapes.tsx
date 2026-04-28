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
        <div className="text-center mb-10 animate-[fade-in_1s_ease-out]">
          <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 flex items-center justify-center gap-2">
            <Music className="h-3.5 w-3.5" />
            Choose Your Frequency
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">The Library</h2>
          <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all backdrop-blur-sm border",
                activeCategory === cat.key
                  ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filteredTracks.map((track) => {
            const isActive = selectedTrack?.id === track.id;
            const isAvailable = !!track.audioUrl;

            return (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  onClick={() => handleSelectTrack(track)}
                  className={cn(
                    "relative cursor-pointer transition-all duration-500 rounded-2xl border backdrop-blur-xl overflow-hidden group h-full",
                    isActive
                      ? "border-orange-400/60 bg-gradient-to-br from-orange-500/15 via-amber-500/5 to-transparent shadow-2xl shadow-orange-500/20"
                      : "border-white/10 bg-white/[0.03] hover:border-orange-400/40 hover:bg-white/[0.06]",
                    !isAvailable && "opacity-60"
                  )}
                >
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-orange-400/0 via-amber-300/0 to-orange-500/0 group-hover:from-orange-400/20 group-hover:via-amber-300/10 group-hover:to-orange-500/20 transition-all duration-500 pointer-events-none" />
                  <div className="relative p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "text-3xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                          isActive && isPlaying
                            ? "bg-orange-500/20 border-orange-400/50 shadow-[0_0_20px_rgba(251,146,60,0.4)] animate-pulse"
                            : "bg-white/5 border-white/10 group-hover:border-orange-400/30"
                        )}
                      >
                        {track.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif font-semibold text-white text-base leading-tight">
                          {track.title}
                        </h3>
                        <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed">
                          {track.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          {track.frequency && (
                            <span className="inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-400/30">
                              {track.frequency}
                            </span>
                          )}
                          {!isAvailable && (
                            <span className="inline-block text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                              Coming soon
                            </span>
                          )}
                        </div>
                      </div>
                      {isActive && isPlaying && (
                        <div className="flex gap-0.5 items-end h-6 shrink-0">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-gradient-to-t from-orange-500 to-amber-300 rounded-full"
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
                  </div>
                </div>
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
              className="mb-10"
            >
              <figure className="relative max-w-3xl mx-auto rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-8 md:p-10">
                <Quote className="absolute -top-4 left-8 h-8 w-8 text-orange-400/80 bg-gray-900 rounded-full p-1.5 border border-orange-400/30" />
                <blockquote className="font-serif text-lg md:text-xl text-white/90 italic leading-relaxed text-center">
                  "{selectedTrack.manuscriptTieIn}"
                </blockquote>
                <figcaption className="mt-5 text-xs tracking-[0.3em] uppercase text-orange-300/70 text-center">
                  From <em className="not-italic font-medium text-orange-200">What a Journey</em> · Michael Heron
                </figcaption>
              </figure>
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
            <div className="relative rounded-2xl border border-orange-400/30 bg-gray-900/85 backdrop-blur-2xl shadow-2xl shadow-orange-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 pointer-events-none" />
              <div className="relative p-4">
                <div className="flex items-center gap-4">
                  {/* Track info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-xl w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-400/30 flex items-center justify-center shrink-0">
                      {selectedTrack.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-serif font-semibold text-white truncate">
                        {selectedTrack.title}
                      </p>
                      {timeRemaining !== null && (
                        <p className="text-xs text-orange-300 font-mono">
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
                            "text-xs px-2 py-1 rounded-md transition-colors font-mono",
                            timerMinutes === opt.minutes
                              ? "bg-orange-500 text-white"
                              : "text-white/50 hover:bg-white/10 hover:text-white"
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
                        "h-9 w-9 hover:bg-white/10",
                        isLooping ? "text-orange-300" : "text-white/50 hover:text-white"
                      )}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>

                    {/* Play/Pause */}
                    <Button
                      size="icon"
                      onClick={togglePlay}
                      disabled={!selectedTrack.audioUrl}
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg shadow-orange-500/40 disabled:opacity-30 transition-all hover:scale-105"
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
                        className="h-9 w-9 text-white/50 hover:text-white hover:bg-white/10"
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
                  <Timer className="h-3 w-3 text-white/40" />
                  {TIMER_OPTIONS.map((opt) => (
                    <button
                      key={opt.minutes}
                      onClick={() => startTimer(opt.minutes)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-md transition-colors font-mono",
                        timerMinutes === opt.minutes
                          ? "bg-orange-500 text-white"
                          : "text-white/50 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-16 pb-20">
          <div className="text-center mb-8">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3">The Science</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">About Healing Frequencies</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { hz: "528 Hz", label: "The Miracle Tone", body: 'Known as the "Love Frequency." Research suggests potential benefits for stress reduction and cellular repair.' },
              { hz: "432 Hz", label: "Nature's Frequency", body: "Many listeners report deeper relaxation compared to standard 440 Hz tuning." },
              { hz: "Solfeggio", label: "Ancient Scale", body: "396, 417, 528, 639, 741, 852 Hz — used in sacred music and modern sound therapy." },
              { hz: "Singing Bowls", label: "Harmonic Resonance", body: "Tibetan and crystal bowls produce rich harmonics that promote meditative states and nervous system regulation." },
            ].map((item) => (
              <div
                key={item.hz}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-orange-400/30 hover:bg-white/[0.06] transition-all duration-500"
              >
                <p className="font-mono text-orange-300 text-sm tracking-wider">{item.hz}</p>
                <h3 className="font-serif text-xl text-white font-semibold mt-1">{item.label}</h3>
                <p className="text-sm text-white/65 mt-3 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/45 text-center mt-8 max-w-2xl mx-auto leading-relaxed italic">
            All tracks are human-recorded — no AI-generated audio. Sources include royalty-free libraries with real instruments: Tibetan bowls, crystal bowls, gongs, and soft synth layers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Soundscapes;
