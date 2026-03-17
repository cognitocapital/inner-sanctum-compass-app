import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, Wind, Brain, Heart } from "lucide-react";

const TOUR_STEPS = [
  {
    icon: <Flame className="w-10 h-10 text-orange-400" />,
    title: "Your Daily Phoenix Protocol",
    description: "3 steps. 5 minutes. Built from Michael's exact recovery routine after his crash.",
  },
  {
    icon: <Wind className="w-10 h-10 text-cyan-400" />,
    title: "Step 1: Breathe",
    description: "Tap, follow the circle, let your nervous system recalibrate — like I did with Wendy.",
  },
  {
    icon: <Brain className="w-10 h-10 text-purple-400" />,
    title: "Step 2: Train",
    description: "A 5-minute brain exercise that adapts to your energy. Low day? Easier game. Clear day? Level up.",
  },
  {
    icon: <Heart className="w-10 h-10 text-rose-400" />,
    title: "Step 3: Ground",
    description: "30 seconds of stillness. Become the observer. One thing you're grateful for. That's it.",
  },
];

interface ProtocolOnboardingProps {
  onComplete: () => void;
}

export const ProtocolOnboarding = ({ onComplete }: ProtocolOnboardingProps) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      sessionStorage.setItem("phoenix_protocol_toured", "true");
      onComplete();
    }
  };

  const current = TOUR_STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="max-w-sm w-full text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                {current.icon}
              </div>
            </motion.div>

            <h2 className="text-2xl font-serif text-white">{current.title}</h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8 mb-6">
          {TOUR_STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-orange-400 w-6' : 'bg-white/20'}`} />
          ))}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleNext}
            className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white min-h-[56px] text-base font-medium"
          >
            {step === TOUR_STEPS.length - 1 ? "Begin Protocol 🔥" : "Next"}
          </Button>
          {step === 0 && (
            <Button
              onClick={() => {
                sessionStorage.setItem("phoenix_protocol_toured", "true");
                onComplete();
              }}
              variant="ghost"
              className="text-white/30 hover:text-white/50 text-xs"
            >
              Skip intro
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
