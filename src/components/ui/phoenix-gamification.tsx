import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Flame, Star, Zap, Target, Heart, Brain, Shield, Award, Feather } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof achievementIcons;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  category: 'breath' | 'ice' | 'mind' | 'heart' | 'incog' | 'circle' | 'general';
}

const achievementIcons = {
  trophy: Trophy,
  flame: Flame,
  star: Star,
  zap: Zap,
  target: Target,
  heart: Heart,
  brain: Brain,
  shield: Shield,
  award: Award,
  feather: Feather,
};

const categoryColors = {
  breath: 'from-orange-500 to-red-600',
  ice: 'from-cyan-400 to-blue-600',
  mind: 'from-purple-500 to-indigo-600',
  heart: 'from-pink-500 to-rose-600',
  incog: 'from-amber-500 to-orange-600',
  circle: 'from-emerald-500 to-teal-600',
  general: 'from-gray-500 to-gray-700',
};

interface PhoenixGamificationState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  feathers: number;
  streakDays: number;
  achievements: Achievement[];
}

const DEFAULT_STATE: PhoenixGamificationState = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  totalXp: 0,
  feathers: 0,
  streakDays: 0,
  achievements: [],
};

export const usePhoenixGamification = () => {
  const [state, setState] = useState<PhoenixGamificationState>(() => {
    const saved = localStorage.getItem('phoenixGamification');
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('phoenixGamification', JSON.stringify(state));
  }, [state]);

  const addXp = (amount: number, source: string) => {
    setState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let feathersEarned = 0;

      // Level up check
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel++;
        newXpToNext = Math.floor(newXpToNext * 1.5);
        feathersEarned += newLevel; // Earn feathers on level up
      }

      if (newLevel > prev.level) {
        toast({
          title: `🔥 Level ${newLevel} Achieved!`,
          description: `You earned ${feathersEarned} Phoenix Feathers!`,
        });
      } else {
        toast({
          title: `+${amount} XP`,
          description: source,
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        totalXp: prev.totalXp + amount,
        feathers: prev.feathers + feathersEarned,
      };
    });
  };

  const unlockAchievement = (achievement: Omit<Achievement, 'unlocked' | 'unlockedAt'>) => {
    setState(prev => {
      const exists = prev.achievements.find(a => a.id === achievement.id);
      if (exists?.unlocked) return prev;

      toast({
        title: `🏆 Achievement Unlocked!`,
        description: achievement.name,
      });

      const newAchievement: Achievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        achievements: [...prev.achievements.filter(a => a.id !== achievement.id), newAchievement],
        feathers: prev.feathers + Math.floor(achievement.xpReward / 10),
      };
    });

    addXp(achievement.xpReward, achievement.name);
  };

  const incrementStreak = () => {
    setState(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1,
    }));
  };

  return { state, addXp, unlockAchievement, incrementStreak };
};

interface PhoenixLevelBadgeProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export const PhoenixLevelBadge = ({ level, xp, xpToNextLevel, size = 'md', showProgress = true }: PhoenixLevelBadgeProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  };

  const progress = (xp / xpToNextLevel) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "relative rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center font-bold text-white shadow-lg",
        sizeClasses[size]
      )}>
        <Flame className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
        {level}
      </div>
      {showProgress && (
        <div className="flex-1 min-w-[100px]">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level {level}</span>
            <span>{xp}/{xpToNextLevel} XP</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  compact?: boolean;
}

export const AchievementCard = ({ achievement, compact = false }: AchievementCardProps) => {
  const Icon = achievementIcons[achievement.icon];
  const gradient = categoryColors[achievement.category];

  if (compact) {
    return (
      <Badge
        variant={achievement.unlocked ? "default" : "outline"}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1",
          achievement.unlocked 
            ? `bg-gradient-to-r ${gradient} text-white border-0` 
            : "opacity-50 grayscale"
        )}
      >
        <Icon className="w-3 h-3" />
        {achievement.name}
      </Badge>
    );
  }

  return (
    <div className={cn(
      "relative p-4 rounded-xl border transition-all duration-300",
      achievement.unlocked 
        ? `bg-gradient-to-br ${gradient} text-white shadow-lg` 
        : "bg-muted/50 opacity-60 grayscale"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          achievement.unlocked ? "bg-white/20" : "bg-muted"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{achievement.name}</h4>
          <p className="text-sm opacity-80">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              +{achievement.xpReward} XP
            </Badge>
            {achievement.unlocked && achievement.unlockedAt && (
              <span className="text-xs opacity-70">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
          <Shield className="w-8 h-8 text-white/60" />
        </div>
      )}
    </div>
  );
};

interface StreakDisplayProps {
  days: number;
  accentColor?: string;
}

export const StreakDisplay = ({ days, accentColor = "orange" }: StreakDisplayProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full",
        `bg-${accentColor}-500/20`
      )}>
        <Flame className={`w-5 h-5 text-${accentColor}-500 animate-pulse`} />
      </div>
      <div>
        <div className="text-2xl font-bold">{days}</div>
        <div className="text-xs text-muted-foreground">Day Streak</div>
      </div>
    </div>
  );
};

interface FeatherCountProps {
  count: number;
}

export const FeatherCount = ({ count }: FeatherCountProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
      <Feather className="w-4 h-4 text-amber-500" />
      <span className="font-semibold text-amber-600">{count}</span>
    </div>
  );
};

export default usePhoenixGamification;
