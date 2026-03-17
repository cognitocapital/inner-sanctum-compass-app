import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Snowflake, Share2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EliteColdBadgeProps {
  unlocked: boolean;
  onShare?: () => void;
}

export const EliteColdBadge = ({ unlocked, onShare }: EliteColdBadgeProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const text = "❄️🔥 Just unlocked Phoenix Cold Resilience — for cleared growth mode only. Built different. @WhatajourneyTBI #TBIrecovery #WimHof";
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!", description: "Share on your socials." });
    }
    onShare?.();
  };

  if (!unlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-5 text-center space-y-4"
    >
      <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto">
        <Snowflake className="w-8 h-8 text-cyan-300" style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.4))' }} />
      </div>

      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-medium">Elite Unlock</span>
        </div>
        <h3 className="text-lg font-serif text-white">Phoenix Cold Resilience</h3>
        <p className="text-sm text-white/40 mt-1">For cleared growth mode only — you've earned this.</p>
      </div>

      <Button
        onClick={handleShare}
        className="rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/20 gap-2 min-h-[48px]"
      >
        <Share2 className="w-4 h-4" /> Share Badge
      </Button>
    </motion.div>
  );
};
