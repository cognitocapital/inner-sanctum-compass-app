import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Star, Zap, Brain, Target, Calendar, 
  Flame, Medal, Award, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MindGamificationProps {
  streak: number;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  weeklyGoal: { current: number; target: number };
  className?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'cognitive' | 'consistency' | 'milestone' | 'ninds';
}

const achievementIcons: Record<string, React.ElementType> = {
  brain: Brain,
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  flame: Flame,
  medal: Medal,
  award: Award,
  crown: Crown,
  calendar: Calendar
};

const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

export const defaultAchievements: Achievement[] = [
  { id: 'first_assessment', name: 'First Steps', description: 'Complete your first assessment', icon: 'star', earned: false, category: 'milestone' },
  { id: 'week_streak', name: 'Consistent Mind', description: '7-day assessment streak', icon: 'flame', earned: false, category: 'consistency' },
  { id: 'phq9_improve', name: 'Mood Rising', description: 'PHQ-9 score improved by 3+ points', icon: 'trophy', earned: false, category: 'cognitive' },
  { id: 'moca_normal', name: 'Cognitive Champion', description: 'Achieve normal MoCA score (26+)', icon: 'brain', earned: false, category: 'ninds' },
  { id: 'game_master', name: 'N-Back Master', description: 'Score 90%+ on 3-Back game', icon: 'zap', earned: false, category: 'cognitive' },
  { id: 'monthly_streak', name: 'Phoenix Rising', description: '30-day tracking streak', icon: 'crown', earned: false, category: 'consistency' },
  { id: 'all_assessments', name: 'Full Battery', description: 'Complete all 4 clinical assessments', icon: 'medal', earned: false, category: 'milestone' },
  { id: 'ninds_target', name: 'NINDS Aligned', description: 'Meet all 2025 NINDS normative targets', icon: 'target', earned: false, category: 'ninds' }
];

export const MindGamification = ({
  streak,
  totalXP,
  level,
  achievements,
  weeklyGoal,
  className
}: MindGamificationProps) => {
  const currentLevelXP = levelThresholds[level - 1] || 0;
  const nextLevelXP = levelThresholds[level] || levelThresholds[levelThresholds.length - 1];
  const xpProgress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className={cn("rounded-2xl academy-glass-strong p-6 space-y-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-yellow-500/15">
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          <h3 className="font-semibold text-amber-200">Mind Progress</h3>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border border-amber-500/30">
          Level {level}
        </Badge>
      </div>

      {/* XP Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Experience</span>
          <span className="text-white/30">{totalXP} / {nextLevelXP} XP</span>
        </div>
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(xpProgress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, value: streak, label: "Day Streak", color: "text-amber-400" },
          { icon: Target, value: `${weeklyGoal.current}/${weeklyGoal.target}`, label: "Weekly Goal", color: "text-cyan-400" },
          { icon: Award, value: `${earnedAchievements.length}/${achievements.length}`, label: "Badges", color: "text-purple-400" },
        ].map(stat => (
          <motion.div
            key={stat.label}
            className="academy-neomorphic rounded-xl p-3 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <stat.icon className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
            <div className="text-lg font-bold text-white/90">{stat.value}</div>
            <div className="text-[10px] text-white/35">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-white/50">Achievements</div>
        <div className="grid grid-cols-4 gap-2">
          {achievements.slice(0, 8).map((achievement) => {
            const IconComponent = achievementIcons[achievement.icon] || Star;
            
            return (
              <motion.div
                key={achievement.id}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all",
                  achievement.earned 
                    ? "bg-gradient-to-br from-yellow-500/20 to-amber-600/15 border border-yellow-500/30" 
                    : "academy-neomorphic opacity-40"
                )}
                whileHover={{ scale: achievement.earned ? 1.1 : 1 }}
                title={`${achievement.name}: ${achievement.description}`}
              >
                <IconComponent 
                  className={cn(
                    "h-5 w-5",
                    achievement.earned ? "text-yellow-400" : "text-white/30"
                  )} 
                />
                <span className="text-[8px] text-center mt-1 text-white/40 line-clamp-1">
                  {achievement.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Motivational quanta */}
      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <p className="text-white/30 text-xs italic text-center">
          "Ch7: Like building new neural pathways, each rep expands capacity beyond the goldfish brain"
        </p>
      </div>
    </div>
  );
};

export default MindGamification;
