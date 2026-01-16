import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Wind, Brain, Heart, Snowflake, Zap } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";

interface Recommendation {
  module: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    module: "breathing",
    title: "Phoenix Breath",
    description: "Start your day with calming 4-7-8 breathing to center yourself.",
    duration: 10,
    icon: <Wind className="w-5 h-5" />,
    href: "/breathing",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    module: "mind",
    title: "Phoenix Mind",
    description: "A quick cognitive exercise to sharpen your focus.",
    duration: 5,
    icon: <Brain className="w-5 h-5" />,
    href: "/mind",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    module: "gratitude",
    title: "Gratitude Journey",
    description: "Take a moment to reflect on what you're grateful for.",
    duration: 3,
    icon: <Heart className="w-5 h-5" />,
    href: "/gratitude",
    gradient: "from-rose-500/20 to-orange-500/20",
  },
];

const getRecommendationForGoal = (goal: string): Recommendation | null => {
  const goalMap: Record<string, Recommendation> = {
    memory: {
      module: "mind",
      title: "Memory Training",
      description: "N-Back exercises to strengthen your working memory.",
      duration: 10,
      icon: <Brain className="w-5 h-5" />,
      href: "/mind",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    focus: {
      module: "mind",
      title: "Focus Training",
      description: "Attention exercises designed for cognitive rehabilitation.",
      duration: 8,
      icon: <Zap className="w-5 h-5" />,
      href: "/mind",
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    mood: {
      module: "gratitude",
      title: "Mood Boost",
      description: "Gratitude journaling to lift your spirits.",
      duration: 5,
      icon: <Heart className="w-5 h-5" />,
      href: "/gratitude",
      gradient: "from-rose-500/20 to-pink-500/20",
    },
    anxiety: {
      module: "breathing",
      title: "Calm Anxiety",
      description: "4-7-8 breathing to activate your parasympathetic nervous system.",
      duration: 10,
      icon: <Wind className="w-5 h-5" />,
      href: "/breathing",
      gradient: "from-cyan-500/20 to-teal-500/20",
    },
    energy: {
      module: "cold-exposure",
      title: "Energy Boost",
      description: "Cold exposure to increase dopamine and alertness.",
      duration: 5,
      icon: <Snowflake className="w-5 h-5" />,
      href: "/cold-exposure",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    sleep: {
      module: "breathing",
      title: "Better Sleep",
      description: "Relaxation breathing to prepare for restful sleep.",
      duration: 8,
      icon: <Wind className="w-5 h-5" />,
      href: "/breathing",
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
    physical: {
      module: "incog",
      title: "Physical Rehab",
      description: "ADL training exercises for daily activities.",
      duration: 15,
      icon: <Zap className="w-5 h-5" />,
      href: "/incog",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  };
  return goalMap[goal] || null;
};

export const TodaysPath = () => {
  const { profile } = useProfile();
  
  // Get personalized recommendation based on goals
  const primaryGoal = profile?.primary_goals?.[0];
  const personalizedRec = primaryGoal ? getRecommendationForGoal(primaryGoal) : null;
  const recommendation = personalizedRec || DEFAULT_RECOMMENDATIONS[0];

  const quickWins = DEFAULT_RECOMMENDATIONS.filter(r => r.module !== recommendation.module).slice(0, 2);

  return (
    <div className="mb-10">
      {/* Today's Path - Primary Recommendation */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-medium text-sm uppercase tracking-wider">Today's Path</span>
          </div>
          <CardTitle className="text-white text-xl flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${recommendation.gradient}`}>
              {recommendation.icon}
            </div>
            {recommendation.title}
            <Badge variant="secondary" className="bg-white/10 text-white/70 ml-auto">
              {recommendation.duration} min
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 mb-4">{recommendation.description}</p>
          {primaryGoal && (
            <p className="text-sm text-orange-300/80 mb-4">
              Recommended based on your <span className="font-medium">{primaryGoal}</span> goal
            </p>
          )}
          <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            <Link to={recommendation.href}>
              Start Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickWins.map((rec) => (
          <Card 
            key={rec.module}
            className={`bg-gradient-to-br ${rec.gradient} border-white/10 backdrop-blur-sm hover:border-white/20 transition-all group cursor-pointer`}
          >
            <Link to={rec.href} className="block p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{rec.title}</h4>
                  <p className="text-white/60 text-sm">{rec.duration} min quick session</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
