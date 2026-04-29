import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wind, Brain, Heart, Music, Flame, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { ProtocolOnboarding } from "@/components/protocol/ProtocolOnboarding";
import { SoundscapeStep } from "@/components/protocol/SoundscapeStep";
import { PostSessionRating } from "@/components/protocol/PostSessionRating";
import { SuccessMetrics } from "@/components/protocol/SuccessMetrics";
import { supabase } from "@/integrations/supabase/client";
import { AskAgentButton } from "@/components/ui/ask-agent-button";
import dailyProtocolHero from "@/assets/daily-protocol-hero.jpg";
import groundingHero from "@/assets/grounding-hero.jpg";

type ProtocolStep = "breathe" | "cognitive" | "mindset" | "soundscape" | "rating" | "complete";

const STEPS: { key: ProtocolStep; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "breathe", label: "Breathe", icon: <Wind className="w-5 h-5" />, color: "text-cyan-400" },
  { key: "cognitive", label: "Train", icon: <Brain className="w-5 h-5" />, color: "text-purple-400" },
  { key: "mindset", label: "Ground", icon: <Heart className="w-5 h-5" />, color: "text-rose-400" },
  { key: "soundscape", label: "Sound", icon: <Music className="w-5 h-5" />, color: "text-indigo-400" },
];

const DailyProtocol = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { todaysCheckin } = useDailyCheckin();
  const [currentStep, setCurrentStep] = useState<ProtocolStep>("breathe");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingCycles, setBreathingCycles] = useState(0);
  const [mindsetTimer, setMindsetTimer] = useState(30);
  const [mindsetActive, setMindsetActive] = useState(false);
  const [gratitudeText, setGratitudeText] = useState("");

  // Check energy for adaptive difficulty
  const energyLevel = todaysCheckin?.energy_level || 3;
  const isLowEnergy = energyLevel <= 2;

  useEffect(() => {
    if (!sessionStorage.getItem("phoenix_protocol_toured")) {
      setShowOnboarding(true);
    }
  }, []);

  // Breathing timer logic
  useEffect(() => {
    if (!breathingActive) return;
    const phaseDurations = { inhale: 4, hold: isLowEnergy ? 4 : 7, exhale: isLowEnergy ? 6 : 8 };
    const duration = phaseDurations[breathingPhase];

    const interval = setInterval(() => {
      setBreathingTimer(prev => {
        if (prev >= duration) {
          const next = breathingPhase === "inhale" ? "hold" : breathingPhase === "hold" ? "exhale" : "inhale";
          if (breathingPhase === "exhale") {
            setBreathingCycles(c => {
              if (c + 1 >= (isLowEnergy ? 3 : 5)) {
                setBreathingActive(false);
                return c + 1;
              }
              return c + 1;
            });
          }
          setBreathingPhase(next);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase, isLowEnergy]);

  // Mindset timer
  useEffect(() => {
    if (!mindsetActive || mindsetTimer <= 0) return;
    const interval = setInterval(() => {
      setMindsetTimer(prev => {
        if (prev <= 1) { setMindsetActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mindsetActive, mindsetTimer]);

  const goToStep = (step: ProtocolStep) => setCurrentStep(step);

  const logSession = async () => {
    if (!user) return;
    try {
      await supabase.from("session_logs").insert({
        user_id: user.id,
        module_type: "daily_protocol",
        duration_seconds: 300,
        xp_earned: 25,
      });
    } catch (err) {
      console.error("Failed to log session:", err);
    }
  };

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  const breathingCompleted = breathingCycles >= (isLowEnergy ? 3 : 5);
  const maxCycles = isLowEnergy ? 3 : 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[70svh] w-full overflow-hidden flex flex-col">
        <img
          src={dailyProtocolHero}
          alt="A glowing phoenix feather drifts through cosmic embers — the Daily Phoenix Protocol, four chapters of recovery in one quiet ritual."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-950/80 to-gray-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[35%] right-[20%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[55%] left-[25%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[45%] right-[30%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-[float_7s_ease-in-out_infinite_3s]" />
          <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
        </div>

        {/* Back to Phoenix Journey */}
        <Link
          to="/dashboard"
          replace
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          title="Back to Phoenix Journey"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Editorial title block */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-12 md:pb-16 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30 backdrop-blur-sm mb-6">
              <Flame className="w-3.5 h-3.5 text-orange-300" />
              <span className="text-xs text-orange-200 tracking-[0.3em] uppercase font-light">Daily Ritual</span>
            </div>
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
              Four chapters · One quiet ascent
            </p>
            <h1 className="font-serif font-bold text-white text-4xl md:text-6xl leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              The Daily Phoenix Protocol
            </h1>
            <p className="mt-6 text-white/75 text-base md:text-lg max-w-xl font-light italic leading-relaxed mx-auto">
              Breathe. Train. Ground. Resonate. A guided sequence shaped to your energy today.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      {/* Step progress bar */}
      <div className="container mx-auto px-4 pt-12 max-w-lg relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                onClick={() => goToStep(s.key)}
                title={`Go to ${s.label}`}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:border-orange-400/50 ${
                  s.key === currentStep
                    ? `border-orange-400/60 bg-orange-500/20 ${s.color} shadow-[0_0_20px_-2px_rgba(251,146,60,0.5)]`
                    : i < stepIndex
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : "border-white/10 bg-white/[0.03] text-white/30"
                }`}
              >
                {s.icon}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px ${i < stepIndex ? "bg-green-500/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] tracking-[0.4em] uppercase text-white/40 -mt-4 mb-2">
          Chapter {stepIndex + 1} of {STEPS.length}
        </p>
      </div>

      <div className="container mx-auto px-4 pb-32 max-w-lg relative z-10">
        {/* Glassmorphic stage for the active chapter */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(249,115,22,0.35)] p-6 sm:p-10 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: Breathe */}
          {currentStep === "breathe" && (
            <motion.div key="breathe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-cyan-300/70">Chapter One</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Breathe</h2>
              <p className="text-sm text-white/50 italic max-w-sm mx-auto leading-relaxed">
                {isLowEnergy ? "Gentle pattern — 4-4-6 for low-energy days" : "Box breathing — 4-7-8 pattern"}
              </p>

              {/* Breathing circle */}
              <div className="relative w-48 h-48 mx-auto">
                <motion.div
                  animate={{
                    scale: breathingPhase === "inhale" ? 1.4 : breathingPhase === "hold" ? 1.4 : 1,
                  }}
                  transition={{ duration: breathingPhase === "inhale" ? 4 : breathingPhase === "hold" ? (isLowEnergy ? 4 : 7) : (isLowEnergy ? 6 : 8), ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-xl font-medium text-cyan-300 capitalize">{breathingPhase}</p>
                    <p className="text-3xl font-bold text-white">{breathingTimer}</p>
                  </div>
                </motion.div>
              </div>

              <p className="text-xs text-white/30">{breathingCycles}/{maxCycles} cycles</p>

              {!breathingActive && !breathingCompleted && (
                <Button onClick={() => setBreathingActive(true)} className="rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/20 min-h-[56px] px-8">
                  Start Breathing
                </Button>
              )}

              {breathingCompleted && (
                <Button onClick={() => goToStep("cognitive")} className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white min-h-[56px] px-8">
                  Next: Train Your Brain →
                </Button>
              )}
            </motion.div>
          )}

          {/* STEP 2: Cognitive */}
          {currentStep === "cognitive" && (
            <motion.div key="cognitive" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-purple-300/70">Chapter Two</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Train</h2>
              <p className="text-sm text-white/50 italic max-w-sm mx-auto leading-relaxed">
                {isLowEnergy ? "Light mode — simple pattern matching" : "5-minute adaptive N-Back challenge"}
              </p>

              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 text-purple-400" />
              </div>

              <p className="text-xs text-white/30 max-w-xs mx-auto">
                {isLowEnergy
                  ? "Low energy detected — keeping it gentle today. That's smart recovery."
                  : "Your brain is ready — let's push the edges a bit."}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    navigate("/mind");
                  }}
                  className="rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/20 min-h-[56px] px-8"
                >
                  Start Brain Training
                </Button>
                <Button onClick={() => goToStep("mindset")} variant="ghost" className="text-white/30 hover:text-white/50 text-sm block mx-auto">
                  Skip to grounding →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Mindset / Grounding */}
          {currentStep === "mindset" && (
            <motion.div key="mindset" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-rose-300/70">Chapter Three</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Ground</h2>
              <p className="text-sm text-white/50 italic max-w-sm mx-auto leading-relaxed">30 seconds of stillness — become the observer</p>

              {!mindsetActive && mindsetTimer === 30 ? (
                <>
                  {/* Cinematic lotus medallion */}
                  <div className="relative w-56 h-56 mx-auto">
                    <div className="absolute inset-0 rounded-full overflow-hidden border border-rose-400/30 shadow-[0_0_60px_-10px_rgba(244,114,182,0.4)]">
                      <img
                        src={groundingHero}
                        alt="Glowing rose-gold lotus on still water under a starlit sky"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/40" />
                    </div>
                    {/* Soft pulse halo */}
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -inset-2 rounded-full border border-rose-300/30 pointer-events-none"
                    />
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </div>

                  <p className="text-base font-serif italic text-white/70 max-w-sm mx-auto leading-relaxed">
                    "Close your eyes. Feel the chair beneath you. You are not your thoughts. You are the one watching them."
                  </p>
                  <Button
                    onClick={() => setMindsetActive(true)}
                    className="rounded-full bg-gradient-to-r from-rose-500/30 to-rose-400/30 hover:from-rose-500/40 hover:to-rose-400/40 text-rose-100 border border-rose-300/40 backdrop-blur-sm min-h-[56px] px-10 shadow-[0_8px_24px_-8px_rgba(244,114,182,0.5)]"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Begin Stillness
                  </Button>
                </>
              ) : mindsetTimer > 0 ? (
                <div className="space-y-6">
                  <div className="relative w-56 h-56 mx-auto">
                    {/* Cinematic backdrop */}
                    <div className="absolute inset-0 rounded-full overflow-hidden border border-rose-400/30 shadow-[0_0_80px_-10px_rgba(244,114,182,0.5)]">
                      <img
                        src={groundingHero}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gray-950/55 backdrop-blur-[2px]" />
                    </div>
                    {/* Breathing rings */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -inset-3 rounded-full border border-rose-300/40 pointer-events-none"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.05, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="absolute -inset-6 rounded-full border border-rose-200/20 pointer-events-none"
                    />
                    {/* Countdown */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-serif font-light text-rose-100 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">{mindsetTimer}</span>
                      <span className="text-[10px] tracking-[0.4em] uppercase text-rose-200/60 mt-2">seconds</span>
                    </div>
                  </div>
                  <p className="text-sm font-serif italic text-white/60">Just breathe. Just be.</p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] tracking-[0.4em] uppercase text-rose-300/70">A small offering</p>
                  <p className="text-xl md:text-2xl font-serif text-white">One thing you're grateful for</p>
                  <textarea
                    value={gratitudeText}
                    onChange={(e) => setGratitudeText(e.target.value)}
                    placeholder="Today I'm grateful for..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/25 text-base font-serif italic resize-none h-28 focus:outline-none focus:border-rose-400/40 focus:bg-white/[0.06] transition-all"
                  />
                  <Button onClick={() => goToStep("soundscape")} className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white min-h-[56px] px-8">
                    Next: Healing Sound →
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 4: Soundscape (optional) */}
          {currentStep === "soundscape" && (
            <SoundscapeStep onComplete={() => {
              logSession();
              goToStep("rating");
            }} />
          )}

          {/* Post-Session Rating */}
          {currentStep === "rating" && (
            <PostSessionRating
              onComplete={(rating, clarity) => {
                goToStep("complete");
              }}
            />
          )}

          {/* Complete */}
          {currentStep === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-12">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flame className="w-16 h-16 text-orange-400 mx-auto" style={{ filter: 'drop-shadow(0 0 20px hsl(25, 90%, 55%))' }} />
              </motion.div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-orange-300/80">Epilogue</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Protocol Complete</h2>
              <p className="text-sm text-white/60 italic max-w-sm mx-auto">+25 XP — your phoenix grows stronger every day</p>
              <Button asChild className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white min-h-[56px] px-8">
                <Link to="/dashboard">Return to Path</Link>
              </Button>
              <AskAgentButton
                context="I just finished my daily protocol. How did I do?"
                label="Talk to Phoenix"
                className="mt-2"
              />
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && <ProtocolOnboarding onComplete={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      {/* Dev metrics (triple-tap bottom-right to toggle) */}
      <SuccessMetrics />
    </div>
  );
};

export default DailyProtocol;
