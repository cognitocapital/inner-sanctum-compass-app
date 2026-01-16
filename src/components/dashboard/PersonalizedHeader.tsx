import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Flame, Zap, Trophy } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useAuth } from "@/contexts/AuthContext";

const LEVEL_NAMES: Record<number, string> = {
  1: "Phoenix Egg",
  5: "Hatchling",
  10: "Fledgling",
  20: "Rising Phoenix",
  35: "Blazing Phoenix",
  50: "Eternal Phoenix",
};

const getLevelName = (level: number): string => {
  const thresholds = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) return LEVEL_NAMES[threshold];
  }
  return "Phoenix Egg";
};

interface PersonalizedHeaderProps {
  userName?: string | null;
}

export const PersonalizedHeader = ({ userName }: PersonalizedHeaderProps) => {
  const { user, isGuest } = useAuth();
  const { profile } = useProfile();
  const { progress } = useUserProgress();

  const displayName = userName || profile?.display_name || user?.email?.split("@")[0] || "Traveler";
  const level = progress?.current_level || 1;
  const totalXp = progress?.total_xp || 0;
  const xpForNextLevel = level * 100;
  const currentLevelXp = totalXp % xpForNextLevel;
  const xpProgress = (currentLevelXp / xpForNextLevel) * 100;
  const streak = progress?.current_streak || 0;
  const levelName = getLevelName(level);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getDayOnJourney = () => {
    if (!profile?.created_at) return 1;
    const startDate = new Date(profile.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <header className="mb-12 animate-phoenix-rise">
      {/* Back navigation */}
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 pt-4">
        {/* Phoenix Avatar & Level */}
        <div className="relative flex-shrink-0">
          <div className="relative w-28 h-28 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-2xl animate-pulse" />
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 blur-3xl animate-glow-pulse" />
            <div 
              className="relative w-full h-full rounded-full border-2 border-orange-500/50 shadow-2xl"
              style={{
                backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Level badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg">
              Lvl {level}
            </div>
          </div>
        </div>

        {/* Greeting & Stats */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">
            {getGreeting()}, <span className="text-flame-gradient">{displayName}</span>!
          </h1>
          <p className="text-white/60 mb-4">
            Day {getDayOnJourney()} on your Yellow Brick Road
          </p>

          {/* XP Progress Bar */}
          {!isGuest && (
            <div className="max-w-md mx-auto lg:mx-0 mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-orange-400 font-medium">{levelName}</span>
                <span className="text-white/50">{currentLevelXp} / {xpForNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-white/10" />
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{streak}</div>
                <div className="text-xs text-white/50">Day Streak</div>
              </div>
            </div>
            
            <div className="w-px h-10 bg-white/20" />
            
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{totalXp}</div>
                <div className="text-xs text-white/50">Total XP</div>
              </div>
            </div>
            
            <div className="w-px h-10 bg-white/20" />
            
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{(progress?.achievements as string[])?.length || 0}</div>
                <div className="text-xs text-white/50">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
