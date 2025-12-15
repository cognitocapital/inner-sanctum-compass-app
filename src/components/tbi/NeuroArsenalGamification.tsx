import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, Star, Flame, Target, Brain, Zap, 
  Award, TrendingUp, Download, MessageCircle
} from "lucide-react";

interface GamificationStats {
  totalXp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  domainProgress: Record<string, number>;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  xpReward: number;
}

interface NeuroArsenalGamificationProps {
  stats: GamificationStats;
  onExportReport?: () => void;
  className?: string;
}

const allAchievements: Achievement[] = [
  { id: "first_exercise", name: "Neural Spark", description: "Complete your first exercise", icon: "⚡", xpReward: 25 },
  { id: "attention_master", name: "Focus Champion", description: "Complete 10 attention exercises", icon: "🎯", xpReward: 100 },
  { id: "memory_master", name: "Memory Keeper", description: "Complete 10 memory exercises", icon: "🧠", xpReward: 100 },
  { id: "exec_master", name: "Strategic Mind", description: "Complete 10 executive exercises", icon: "🎲", xpReward: 100 },
  { id: "comm_master", name: "Social Star", description: "Complete 10 communication exercises", icon: "💬", xpReward: 100 },
  { id: "streak_7", name: "Week Warrior", description: "7-day training streak", icon: "🔥", xpReward: 150 },
  { id: "streak_30", name: "Monthly Champion", description: "30-day training streak", icon: "🏆", xpReward: 500 },
  { id: "all_domains", name: "Complete Brain", description: "Train all 4 domains in one day", icon: "🌟", xpReward: 200 },
  { id: "nback_pro", name: "N-Back Pro", description: "Score 80+ on N-Back game", icon: "🎮", xpReward: 75 },
  { id: "incog_aligned", name: "Evidence Based", description: "Complete 5 Level A exercises", icon: "📊", xpReward: 150 }
];

const getLevelFromXp = (xp: number): { level: number; progress: number; nextLevelXp: number } => {
  const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 20000];
  let level = 1;
  for (let i = 1; i < levels.length; i++) {
    if (xp >= levels[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  const currentLevelXp = levels[level - 1] || 0;
  const nextLevelXp = levels[level] || levels[levels.length - 1] + 5000;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return { level, progress: Math.min(100, Math.max(0, progress)), nextLevelXp };
};

const getLevelTitle = (level: number): string => {
  const titles = [
    "Novice Explorer", "Neural Apprentice", "Cognitive Trainee",
    "Mind Warrior", "Brain Champion", "Neuro Master",
    "Cognitive Elite", "Neural Architect", "Mind Virtuoso", "Neuro Legend"
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
};

const domainIcons = {
  attention: Zap,
  memory: Brain,
  executive: Target,
  communication: MessageCircle
};

const domainColors = {
  attention: "bg-red-500",
  memory: "bg-green-500",
  executive: "bg-purple-500",
  communication: "bg-pink-500"
};

const NeuroArsenalGamification = ({ stats, onExportReport, className }: NeuroArsenalGamificationProps) => {
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null);
  const levelData = getLevelFromXp(stats.totalXp);

  return (
    <Card className={`bg-gradient-to-br from-amber-500/10 to-orange-500/10 
      border-amber-500/30 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Neuro Arsenal Progress
          </CardTitle>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Level {levelData.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{getLevelTitle(levelData.level)}</span>
            <span className="text-amber-400 font-medium">{stats.totalXp} XP</span>
          </div>
          <div className="relative">
            <Progress value={levelData.progress} className="h-3" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {Math.round(levelData.progress)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {levelData.nextLevelXp - stats.totalXp} XP to Level {levelData.level + 1}
          </p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-sm font-medium">{stats.streak} Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep training daily!</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < stats.streak % 7 ? 'bg-orange-400' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Domain Progress */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(stats.domainProgress).map(([domain, progress]) => {
            const Icon = domainIcons[domain as keyof typeof domainIcons];
            const color = domainColors[domain as keyof typeof domainColors];
            return (
              <div key={domain} className="p-2 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`p-1 rounded ${color}`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs capitalize">{domain}</span>
                </div>
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
              </div>
            );
          })}
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Award className="w-4 h-4 text-yellow-400" />
              Achievements
            </span>
            <span className="text-xs text-muted-foreground">
              {stats.achievements.length}/{allAchievements.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.achievements.slice(0, 6).map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded-full 
                  bg-yellow-500/20 border border-yellow-500/30 text-xs"
                title={achievement.description}
              >
                <span>{achievement.icon}</span>
                <span className="text-yellow-300">{achievement.name}</span>
              </motion.div>
            ))}
            {stats.achievements.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Complete exercises to unlock achievements!
              </p>
            )}
          </div>
        </div>

        {/* Export Report */}
        {onExportReport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportReport}
            className="w-full gap-2 text-xs"
          >
            <Download className="w-3 h-3" />
            Export Clinical Report
          </Button>
        )}

        {/* New Achievement Popup */}
        <AnimatePresence>
          {showNewAchievement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowNewAchievement(null)}
            >
              <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 
                border-yellow-500/50 p-6 text-center max-w-xs">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-3"
                >
                  {showNewAchievement.icon}
                </motion.div>
                <h3 className="font-bold text-lg text-yellow-300">
                  {showNewAchievement.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {showNewAchievement.description}
                </p>
                <Badge className="bg-yellow-500/20 text-yellow-300">
                  +{showNewAchievement.xpReward} XP
                </Badge>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default NeuroArsenalGamification;
export { allAchievements };
