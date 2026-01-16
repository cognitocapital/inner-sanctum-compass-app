import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useUserProgress } from "@/hooks/use-user-progress";
import { StreakFlame, StreakBadge } from "@/components/ui/streak-flame";
import { Sparkles, TrendingUp } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "The quiet hours await";
};

const getMotivationalMessage = (streak: number, week: number) => {
  if (streak === 0) return "Begin your transformation today";
  if (streak === 1) return "A spark ignites. Keep going.";
  if (streak < 7) return "Your flame is growing stronger";
  if (streak < 14) return "One week of dedication. Remarkable.";
  if (streak < 30) return "Your transformation is taking hold";
  return "You are becoming the phoenix";
};

interface PersonalizedHeroProps {
  currentWeek: number;
  totalWeeks: number;
}

export const PersonalizedHero = ({ currentWeek, totalWeeks }: PersonalizedHeroProps) => {
  const { user, isGuest } = useAuth();
  const { profile } = useProfile();
  const { progress } = useUserProgress();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Traveler";
  const streak = progress?.current_streak || 0;
  const totalXp = progress?.total_xp || 0;
  const daysSinceStart = profile?.protocol_started_at
    ? Math.floor((Date.now() - new Date(profile.protocol_started_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Greeting section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-sm mb-1"
          >
            {getGreeting()}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-white"
          >
            {isGuest ? "Welcome, Traveler" : displayName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 mt-1"
          >
            {getMotivationalMessage(streak, currentWeek)}
          </motion.p>
        </div>

        {/* Streak display */}
        {!isGuest && streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <StreakFlame streak={streak} size="lg" />
          </motion.div>
        )}
      </div>

      {/* Quick stats bar */}
      {!isGuest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center gap-4"
        >
          {/* Day counter */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/80">
              Day <span className="font-semibold text-white">{daysSinceStart + 1}</span>
            </span>
          </div>

          {/* XP display */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/80">
              <span className="font-semibold text-white">{totalXp.toLocaleString()}</span> XP
            </span>
          </div>

          {/* Journey progress */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-sm text-orange-300">
              Week <span className="font-semibold">{currentWeek}</span>
              <span className="text-orange-400/60"> / {totalWeeks}</span>
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
