import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Wind, Brain, Heart, Music, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { ProtocolOnboarding } from "@/components/protocol/ProtocolOnboarding";
import { SoundscapeStep } from "@/components/protocol/SoundscapeStep";
import { PostSessionRating } from "@/components/protocol/PostSessionRating";
import { SuccessMetrics } from "@/components/protocol/SuccessMetrics";
import { supabase } from "@/integrations/supabase/client";
import { AskAgentButton } from "@/components/ui/ask-agent-button";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-white/[0.04]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="text-white/50 hover:text-white">
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <span className="text-sm font-serif text-white/60">Daily Phoenix Protocol</span>
          <Button asChild variant="ghost" size="sm" className="text-white/50 hover:text-white">
            <Link to="/"><Home className="w-4 h-4" /></Link>
          </Button>
        </div>
      </header>

      {/* Step progress bar */}
      <div className="container mx-auto px-4 pt-4 max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (i <= stepIndex || (s.key === "soundscape")) goToStep(s.key);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  s.key === currentStep
                    ? `border-orange-500/40 bg-orange-500/20 ${s.color}`
                    : i < stepIndex
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : "border-white/10 bg-white/[0.02] text-white/20"
                }`}
              >
                {s.icon}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 ${i < stepIndex ? "bg-green-500/30" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-32 max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: Breathe */}
          {currentStep === "breathe" && (
            <motion.div key="breathe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
              <h2 className="text-2xl font-serif text-white">Breathe</h2>
              <p className="text-sm text-white/40">
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
              <h2 className="text-2xl font-serif text-white">Train</h2>
              <p className="text-sm text-white/40">
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
              <h2 className="text-2xl font-serif text-white">Ground</h2>
              <p className="text-sm text-white/40">30 seconds of stillness — become the observer</p>

              {!mindsetActive && mindsetTimer === 30 ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 text-rose-400" />
                  </div>
                  <p className="text-xs text-white/30 italic max-w-xs mx-auto">
                    "Close your eyes. Feel the chair beneath you. You are not your thoughts. You are the one watching them."
                  </p>
                  <Button onClick={() => setMindsetActive(true)} className="rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/20 min-h-[56px] px-8">
                    Begin Stillness
                  </Button>
                </>
              ) : mindsetTimer > 0 ? (
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                  <div className="w-32 h-32 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-rose-300">{mindsetTimer}</span>
                  </div>
                  <p className="text-xs text-white/30 mt-4">Just breathe. Just be.</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-lg font-serif text-white">One thing you're grateful for:</p>
                  <textarea
                    value={gratitudeText}
                    onChange={(e) => setGratitudeText(e.target.value)}
                    placeholder="Today I'm grateful for..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white placeholder:text-white/20 text-sm resize-none h-24 focus:outline-none focus:border-orange-500/30"
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
              <h2 className="text-2xl font-serif text-white">Protocol Complete</h2>
              <p className="text-sm text-white/40">+25 XP — Your phoenix grows stronger every day</p>
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
