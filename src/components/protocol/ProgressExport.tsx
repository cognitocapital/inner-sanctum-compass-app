import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useToast } from "@/hooks/use-toast";

export const ProgressExport = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { progress } = useUserProgress();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const displayName = profile?.display_name || "Phoenix Survivor";
  const totalXp = progress?.total_xp || 0;
  const streak = progress?.current_streak || 0;
  const level = progress?.current_level || 1;
  const phaseName = ["The Ashes", "The Forge", "The Ascent", "The Soar"][
    (profile?.phoenix_phase || 1) - 1
  ];

  const shareText = `🔥 ${displayName}'s Recovery Card\n\n` +
    `Phase: ${phaseName}\n` +
    `Level: ${level} | XP: ${totalXp}\n` +
    `Streak: ${streak} days\n` +
    `Flame Strength: ${profile?.flame_strength || 0}%\n\n` +
    `Built with @WhatajourneyTBI — the recovery protocol that works.\n` +
    `whatajourney.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({ title: "Copied!", description: "Share with your carer or doctor." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Recovery Progress", text: shareText });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-orange-500/5 to-amber-500/5 p-5 space-y-4"
    >
      <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
        <FileDown className="w-4 h-4" /> Share Progress
      </h3>

      {/* Preview card */}
      <div className="rounded-xl bg-gray-900/80 border border-white/[0.08] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-serif text-white">{displayName}</span>
          <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">{phaseName}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-orange-400">{totalXp}</p>
            <p className="text-[10px] text-white/30">XP</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-400">{streak}</p>
            <p className="text-[10px] text-white/30">Streak</p>
          </div>
          <div>
            <p className="text-xl font-bold text-yellow-400">Lv.{level}</p>
            <p className="text-[10px] text-white/30">Level</p>
          </div>
        </div>
        <p className="text-[10px] text-white/20 text-center">whatajourney.app</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleShare} className="flex-1 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/20 gap-2 min-h-[48px]">
          <Share2 className="w-4 h-4" /> Share
        </Button>
        <Button onClick={handleCopy} variant="ghost" className="rounded-full text-white/40 hover:text-white/60 gap-2 min-h-[48px]">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </motion.div>
  );
};
