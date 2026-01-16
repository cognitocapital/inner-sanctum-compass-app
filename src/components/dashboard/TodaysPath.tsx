import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles, Wind, Brain, Heart, Snowflake, Zap, RefreshCw, Lightbulb, TrendingUp, Clock, Trophy } from "lucide-react";
import { usePhoenixGuide } from "@/hooks/use-phoenix-guide";
import { useProfile } from "@/hooks/use-profile";
import { useOverallProgress } from "@/hooks/use-module-progress";

const MODULE_ICONS: Record<string, React.ReactNode> = {
  breathing: <Wind className="w-5 h-5" />,
  mind: <Brain className="w-5 h-5" />,
  gratitude: <Heart className="w-5 h-5" />,
  "cold-exposure": <Snowflake className="w-5 h-5" />,
  incog: <Zap className="w-5 h-5" />,
};

const MODULE_LINKS: Record<string, string> = {
  breathing: "/breathing",
  mind: "/mind",
  gratitude: "/gratitude",
  "cold-exposure": "/cold-exposure",
  incog: "/incog",
};

const MODULE_GRADIENTS: Record<string, string> = {
  breathing: "from-cyan-500/20 to-blue-500/20",
  mind: "from-purple-500/20 to-pink-500/20",
  gratitude: "from-rose-500/20 to-orange-500/20",
  "cold-exposure": "from-blue-500/20 to-cyan-500/20",
  incog: "from-green-500/20 to-emerald-500/20",
};

export const TodaysPath = () => {
  const { profile } = useProfile();
  const { recommendation, isLoading, refresh } = usePhoenixGuide();
  const { stats, isLoading: statsLoading } = useOverallProgress();

  if (isLoading) {
    return (
      <div className="mb-10">
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="text-orange-400 font-medium text-sm uppercase tracking-wider">
                Phoenix is thinking...
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-10 w-32 bg-white/10" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recommendation) return null;

  const moduleIcon = MODULE_ICONS[recommendation.module] || <Zap className="w-5 h-5" />;
  const moduleLink = MODULE_LINKS[recommendation.module] || "/breathing";
  const moduleGradient = MODULE_GRADIENTS[recommendation.module] || "from-orange-500/20 to-red-500/20";

  return (
    <div className="mb-10 space-y-4">
      {/* Weekly Stats Bar */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white">{stats.thisWeekSessions}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white">{stats.thisWeekMinutes}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white">{stats.totalXp}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white">{stats.modulesUsed}</div>
            <div className="text-xs text-muted-foreground">Modules</div>
          </div>
        </div>
      )}

      {/* AI Message Card */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-medium text-sm uppercase tracking-wider">Phoenix Guide</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Personalized message */}
          <p className="text-white/90 text-lg leading-relaxed mb-4 italic">
            "{recommendation.message}"
          </p>

          {/* Insight */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-white/70 text-sm">{recommendation.insight}</p>
          </div>

          {/* Recommendation Card */}
          <div className={`p-4 rounded-xl bg-gradient-to-br ${moduleGradient} border border-white/10`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white/10">
                {moduleIcon}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{recommendation.exercise}</h3>
                <p className="text-white/60 text-sm">{recommendation.reason}</p>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white/70">
                {recommendation.duration} min
              </Badge>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              <Link to={moduleLink}>
                Start Today's Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick alternative actions */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(MODULE_ICONS)
          .filter(([key]) => key !== recommendation.module)
          .slice(0, 3)
          .map(([key, icon]) => (
            <Link
              key={key}
              to={MODULE_LINKS[key]}
              className={`p-3 rounded-lg bg-gradient-to-br ${MODULE_GRADIENTS[key]} border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group`}
            >
              <div className="p-1.5 rounded bg-white/10 group-hover:bg-white/20 transition-colors">
                {icon}
              </div>
              <span className="text-white/70 text-sm capitalize hidden sm:inline">
                {key.replace("-", " ")}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};
