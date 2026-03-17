import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EMOJI_OPTIONS = [
  { emoji: "😔", label: "Rough", value: 1 },
  { emoji: "😐", label: "Okay", value: 2 },
  { emoji: "😊", label: "Better", value: 3 },
  { emoji: "😄", label: "Good", value: 4 },
  { emoji: "🔥", label: "Great", value: 5 },
];

interface PostSessionRatingProps {
  onComplete: (rating: number, clarity: number) => void;
  moduleName?: string;
}

export const PostSessionRating = ({ onComplete, moduleName = "protocol" }: PostSessionRatingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [clarity, setClarity] = useState<number | null>(null);
  const [step, setStep] = useState<"emoji" | "clarity" | "done">("emoji");

  const handleEmojiSelect = (value: number) => {
    setSelectedEmoji(value);
    setStep("clarity");
  };

  const handleClaritySelect = async (value: number) => {
    setClarity(value);
    setStep("done");

    // Log to session_logs
    if (user) {
      try {
        const today = new Date().toISOString().split("T")[0];
        await supabase.from("daily_checkins").update({
          post_session_rating: value,
        }).eq("user_id", user.id).eq("check_date", today);
      } catch (err) {
        console.error("Failed to save rating:", err);
      }
    }

    toast({ title: "Session complete! 🔥", description: "Your feedback helps personalize tomorrow's protocol." });
    setTimeout(() => onComplete(selectedEmoji!, value), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <AnimatePresence mode="wait">
        {step === "emoji" && (
          <motion.div key="emoji" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="text-lg font-serif text-white mb-2">How do you feel?</p>
            <p className="text-sm text-white/40 mb-6">One tap — no overthinking</p>
            <div className="flex justify-center gap-3">
              {EMOJI_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleEmojiSelect(opt.value)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95"
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-[10px] text-white/30">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "clarity" && (
          <motion.div key="clarity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="text-lg font-serif text-white mb-2">How clear is your mind?</p>
            <p className="text-sm text-white/40 mb-6">This helps calibrate tomorrow's session</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => handleClaritySelect(v)}
                  className={`w-12 h-12 rounded-full border transition-all duration-200 flex items-center justify-center text-sm font-medium active:scale-95 ${
                    v <= 2 ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    : v === 3 ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                    : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/20 mt-2">1 = total fog · 5 = crystal clear</p>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="text-5xl block mb-3">🔥</span>
            <p className="text-lg font-serif text-white">Protocol complete</p>
            <p className="text-sm text-white/40">Your phoenix grows stronger</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
