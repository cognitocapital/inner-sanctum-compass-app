import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowRight, Flame, Sparkles, Heart, Target, Clock } from "lucide-react";
import { EmberParticles } from "@/components/ui/ember-particles";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const REASONS = [
  { id: "recovery", label: "I'm recovering from an injury", icon: Heart },
  { id: "growth", label: "I want to grow and transform", icon: Target },
  { id: "shared", label: "Someone shared this with me", icon: Sparkles }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [reason, setReason] = useState<string>("");
  const [dailyCommitment, setDailyCommitment] = useState(10);
  const [displayName, setDisplayName] = useState("");

  const totalSteps = 5;

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || null,
          daily_goal_minutes: dailyCommitment,
          primary_goals: reason ? [reason] : [],
          onboarding_completed: true,
          protocol_started_at: new Date().toISOString(),
          current_week: 1
        })
        .eq("id", user.id);

      if (error) throw error;
      
      // Brief delay for the final animation
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  // Commitment level feedback
  const getCommitmentFeedback = () => {
    if (dailyCommitment <= 5) return "5 minutes — a gentle start";
    if (dailyCommitment <= 10) return "10 minutes — enough to change everything";
    if (dailyCommitment <= 20) return "20 minutes — serious transformation";
    if (dailyCommitment <= 30) return "30 minutes — full commitment";
    return `${dailyCommitment} minutes — phoenix mode`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 overflow-hidden">
      {/* Ember particles */}
      <EmberParticles count={20} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-orange-500/20 to-transparent rounded-full blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* Step 0: The Spark */}
          {currentStep === 0 && (
            <motion.div
              key="spark"
              className="text-center max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
            >
              {/* Growing ember */}
              <motion.div
                className="mx-auto mb-12"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="relative w-32 h-32 mx-auto"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(249, 115, 22, 0.3)',
                      '0 0 60px rgba(249, 115, 22, 0.6)',
                      '0 0 20px rgba(249, 115, 22, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-2xl" />
                  <div
                    className="relative w-full h-full rounded-full border-2 border-orange-500/50"
                    style={{
                      backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.p
                className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Every transformation begins with{' '}
                <span className="text-orange-400 font-medium">a spark</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="mt-12"
              >
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 1: Your Why */}
          {currentStep === 1 && (
            <motion.div
              key="why"
              className="w-full max-w-lg px-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-serif text-white text-center mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                What brings you here?
              </motion.h2>
              <motion.p
                className="text-white/50 text-center mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Your journey is uniquely yours
              </motion.p>

              <div className="space-y-4">
                {REASONS.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <motion.button
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                        reason === r.id
                          ? 'bg-orange-500/20 border-orange-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-3 rounded-xl ${reason === r.id ? 'bg-orange-500/30' : 'bg-white/10'}`}>
                        <Icon className={`w-6 h-6 ${reason === r.id ? 'text-orange-400' : 'text-white/50'}`} />
                      </div>
                      <span className="text-lg">{r.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                className="mt-10 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={nextStep}
                  disabled={!reason}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Your Commitment */}
          {currentStep === 2 && (
            <motion.div
              key="commitment"
              className="w-full max-w-lg px-4 text-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Clock className="w-12 h-12 text-orange-400 mx-auto mb-6" />
              
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
                Your Daily Commitment
              </h2>
              <p className="text-white/50 mb-12">
                How many minutes can you commit each day?
              </p>

              {/* Large commitment display */}
              <motion.div
                className="mb-10"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-7xl font-bold text-orange-400 mb-2">
                  {dailyCommitment}
                </div>
                <div className="text-white/60">minutes per day</div>
              </motion.div>

              {/* Slider */}
              <div className="mb-8 px-4">
                <Slider
                  value={[dailyCommitment]}
                  onValueChange={([v]) => setDailyCommitment(v)}
                  min={5}
                  max={60}
                  step={5}
                  className="[&>span:first-child]:bg-white/20 [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-orange-500 [&>span:first-child>span]:to-red-500"
                />
                <div className="flex justify-between text-sm text-white/40 mt-4">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Dynamic feedback */}
              <motion.p
                key={dailyCommitment}
                className="text-lg text-orange-300/80 italic mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getCommitmentFeedback()}
              </motion.p>

              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Your Name */}
          {currentStep === 3 && (
            <motion.div
              key="name"
              className="w-full max-w-md px-4 text-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
                What should we call you?
              </h2>
              <p className="text-white/50 mb-10">
                This is how we'll greet you on your journey
              </p>

              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name..."
                className="bg-white/10 border-white/20 text-white text-center text-xl py-6 rounded-xl placeholder:text-white/30"
                autoFocus
              />

              <motion.div className="mt-10">
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: The Flame Ignites */}
          {currentStep === 4 && (
            <motion.div
              key="ignite"
              className="text-center max-w-md px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Phoenix animation */}
              <motion.div
                className="mx-auto mb-10"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="relative w-40 h-40 mx-auto"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(249, 115, 22, 0.4)',
                      '0 0 80px rgba(249, 115, 22, 0.7)',
                      '0 0 30px rgba(249, 115, 22, 0.4)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/40 to-red-500/40 blur-3xl scale-150" />
                  <div
                    className="relative w-full h-full rounded-full border-2 border-orange-500/50"
                    style={{
                      backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl font-serif text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Welcome, <span className="text-flame-gradient">{displayName || 'Traveler'}</span>
              </motion.h2>

              <motion.p
                className="text-xl text-white/60 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Your 20-week transformation begins now
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                <Button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-12 py-6 rounded-full shadow-2xl shadow-orange-500/30"
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2"
                      >
                        <Flame className="w-5 h-5" />
                      </motion.span>
                      Igniting...
                    </>
                  ) : (
                    <>
                      <Flame className="mr-2 h-5 w-5" />
                      Begin My Journey
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicators */}
        {currentStep > 0 && currentStep < 4 && (
          <motion.div
            className="absolute bottom-8 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep >= step ? 'bg-orange-500 w-4' : 'bg-white/20'
                }`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
