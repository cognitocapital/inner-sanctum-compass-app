import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className={cn("bg-black/40 border-orange-600/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-orange-100">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Mind Progress
          </div>
          <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-orange-200">Experience</span>
            <span className="text-orange-300/70">{totalXP} / {nextLevelXP} XP</span>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-3 bg-orange-900/50" />
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
              style={{ width: `${xpProgress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            className="bg-orange-900/30 rounded-lg p-3 text-center border border-orange-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <Flame className="h-5 w-5 text-orange-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-orange-100">{streak}</div>
            <div className="text-xs text-orange-300/70">Day Streak</div>
          </motion.div>

          <motion.div
            className="bg-orange-900/30 rounded-lg p-3 text-center border border-orange-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <Target className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-orange-100">
              {weeklyGoal.current}/{weeklyGoal.target}
            </div>
            <div className="text-xs text-orange-300/70">Weekly Goal</div>
          </motion.div>

          <motion.div
            className="bg-orange-900/30 rounded-lg p-3 text-center border border-orange-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <Award className="h-5 w-5 text-purple-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-orange-100">
              {earnedAchievements.length}/{achievements.length}
            </div>
            <div className="text-xs text-orange-300/70">Badges</div>
          </motion.div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-orange-200">Achievements</div>
          <div className="grid grid-cols-4 gap-2">
            {achievements.slice(0, 8).map((achievement) => {
              const IconComponent = achievementIcons[achievement.icon] || Star;
              
              return (
                <motion.div
                  key={achievement.id}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all",
                    achievement.earned 
                      ? "bg-gradient-to-br from-yellow-600/40 to-amber-700/40 border border-yellow-500/50" 
                      : "bg-gray-800/50 border border-gray-700/50 opacity-50"
                  )}
                  whileHover={{ scale: achievement.earned ? 1.1 : 1 }}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  <IconComponent 
                    className={cn(
                      "h-5 w-5",
                      achievement.earned ? "text-yellow-400" : "text-gray-500"
                    )} 
                  />
                  <span className="text-[8px] text-center mt-1 text-orange-200/70 line-clamp-1">
                    {achievement.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Motivational quanta */}
        <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-700/30">
          <p className="text-orange-200/80 text-xs italic text-center">
            "Ch7: Like building new neural pathways, each rep expands capacity beyond the goldfish brain"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MindGamification;
