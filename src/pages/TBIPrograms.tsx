import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Brain, Zap, Target, MessageCircle, 
  Sparkles, Trophy, Download, Settings
} from "lucide-react";
import { MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileHeader } from "@/components/ui/mobile-header";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import InteractiveBrainMap from "@/components/tbi/InteractiveBrainMap";
import NINDSQuiz, { DomainResults } from "@/components/tbi/NINDSQuiz";
import DomainExercises from "@/components/tbi/DomainExercises";
import ExternalProgramLinks from "@/components/tbi/ExternalProgramLinks";
import NeuroArsenalGamification, { allAchievements } from "@/components/tbi/NeuroArsenalGamification";
import { toast } from "@/hooks/use-toast";

interface UserProgress {
  totalXp: number;
  streak: number;
  achievements: typeof allAchievements;
  domainProgress: Record<string, number>;
  quizCompleted: boolean;
  quizResults?: DomainResults;
  lastTrainingDate?: string;
  exerciseHistory: { domain: string; date: string; score: number; xp: number }[];
}

const defaultProgress: UserProgress = {
  totalXp: 0,
  streak: 0,
  achievements: [],
  domainProgress: { attention: 0, memory: 0, executive: 0, communication: 0 },
  quizCompleted: false,
  exerciseHistory: []
};

const TBIPrograms = () => {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);
  const [activeTab, setActiveTab] = useState("exercises");

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("neuroArsenalProgress");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserProgress(parsed);
      if (parsed.quizResults?.priorityDomains?.[0]) {
        setActiveDomain(parsed.quizResults.priorityDomains[0]);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (progress: UserProgress) => {
    localStorage.setItem("neuroArsenalProgress", JSON.stringify(progress));
    setUserProgress(progress);
  };

  // Check and update streak
  useEffect(() => {
    const today = new Date().toDateString();
    if (userProgress.lastTrainingDate) {
      const lastDate = new Date(userProgress.lastTrainingDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Continue streak
      } else if (lastDate.toDateString() !== today) {
        // Reset streak
        if (userProgress.streak > 0) {
          saveProgress({ ...userProgress, streak: 0 });
        }
      }
    }
  }, []);

  const handleQuizComplete = (results: DomainResults) => {
    setShowQuiz(false);
    const newProgress = {
      ...userProgress,
      quizCompleted: true,
      quizResults: results,
      totalXp: userProgress.totalXp + 50
    };
    saveProgress(newProgress);
    
    if (results.priorityDomains[0]) {
      setActiveDomain(results.priorityDomains[0]);
    }
    
    toast({
      title: "Assessment Complete!",
      description: `Recommended focus: ${results.priorityDomains.join(", ") || "General training"}. +50 XP`,
    });
  };

  const handleExerciseComplete = (domain: string, score: number, xp: number) => {
    const today = new Date().toDateString();
    const isNewDay = userProgress.lastTrainingDate !== today;
    
    const newProgress: UserProgress = {
      ...userProgress,
      totalXp: userProgress.totalXp + xp,
      streak: isNewDay ? userProgress.streak + 1 : userProgress.streak,
      lastTrainingDate: today,
      domainProgress: {
        ...userProgress.domainProgress,
        [domain]: Math.min(100, (userProgress.domainProgress[domain] || 0) + 10)
      },
      exerciseHistory: [
        ...userProgress.exerciseHistory,
        { domain, date: today, score, xp }
      ]
    };

    // Check for achievements
    const unlockedAchievements = [...userProgress.achievements];
    
    if (newProgress.exerciseHistory.length === 1) {
      const firstExercise = allAchievements.find(a => a.id === "first_exercise");
      if (firstExercise && !unlockedAchievements.find(a => a.id === "first_exercise")) {
        unlockedAchievements.push({ ...firstExercise, unlockedAt: new Date() });
        newProgress.totalXp += firstExercise.xpReward;
        toast({
          title: "Achievement Unlocked! ⚡",
          description: `${firstExercise.name}: ${firstExercise.description}`,
        });
      }
    }

    if (newProgress.streak >= 7 && !unlockedAchievements.find(a => a.id === "streak_7")) {
      const streakAchieve = allAchievements.find(a => a.id === "streak_7");
      if (streakAchieve) {
        unlockedAchievements.push({ ...streakAchieve, unlockedAt: new Date() });
        newProgress.totalXp += streakAchieve.xpReward;
        toast({
          title: "Achievement Unlocked! 🔥",
          description: `${streakAchieve.name}: ${streakAchieve.description}`,
        });
      }
    }

    newProgress.achievements = unlockedAchievements;
    saveProgress(newProgress);

    toast({
      title: "Exercise Complete!",
      description: `+${xp} XP earned. Keep training!`,
    });
  };

  const handleExportReport = () => {
    const report = {
      date: new Date().toISOString(),
      user: "Anonymous Patient",
      assessment: userProgress.quizResults,
      progress: {
        totalXp: userProgress.totalXp,
        streak: userProgress.streak,
        domainProgress: userProgress.domainProgress,
        exerciseHistory: userProgress.exerciseHistory
      },
      achievements: userProgress.achievements.map(a => a.name),
      clinicalNotes: "INCOG 2.0 aligned training program. NINDS biomarker classification integrated."
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neuro-arsenal-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Clinical report saved for your healthcare provider.",
    });
  };

  return (
    <MobilePageContainer hasBottomNav={false} className="bg-gradient-to-b from-slate-900 via-blue-950 to-purple-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
        
        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[...Array(10)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#neuralGrad)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
          <defs>
            <linearGradient id="neuralGrad">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <MobileHeader
          title="Neurotech Arsenal"
          subtitle="INCOG 2.0 Aligned Cognitive Training Suite"
          backHref="/dashboard"
          backLabel="Dashboard"
          accentColor="blue"
          icon={
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-pulse">
              <Brain className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
          }
        />

        {/* Evidence Badges */}
        <div className="px-4 mb-4 flex flex-wrap gap-2 justify-center">
          <EvidenceBadge level="A" domain="INCOG 2.0" pubmedId="36594858" />
          <Badge className="bg-cyan-600/80 text-cyan-100">2025 NINDS</Badge>
          <Badge className="bg-green-600/80 text-green-100">Canadian Guidelines</Badge>
        </div>

        {/* Quiz Prompt or Brain Map */}
        <div className="px-4 mb-6">
          <AnimatePresence mode="wait">
            {showQuiz ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <NINDSQuiz 
                  onComplete={handleQuizComplete}
                  onSkip={() => setShowQuiz(false)}
                />
              </motion.div>
            ) : !userProgress.quizCompleted ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <h3 className="font-medium mb-2">Personalize Your Training</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Take a quick NINDS-aligned assessment to get personalized exercise recommendations
                    </p>
                    <Button onClick={() => setShowQuiz(true)} className="gap-2">
                      <Target className="w-4 h-4" />
                      Start Assessment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="brain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <InteractiveBrainMap
                  activeDomain={activeDomain}
                  onDomainSelect={setActiveDomain}
                  deficitScores={userProgress.quizResults?.priorityDomains.reduce(
                    (acc, domain) => ({ ...acc, [domain]: 0.7 }), {}
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recommendations */}
        {userProgress.quizResults?.recommendations && (
          <div className="px-4 mb-4">
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Your Personalized Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {userProgress.quizResults.recommendations.slice(0, 3).map((rec, i) => (
                  <p key={i} className="text-xs text-blue-200">• {rec}</p>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <div className="px-4 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full bg-background/20">
              <TabsTrigger value="exercises" className="text-xs">Exercises</TabsTrigger>
              <TabsTrigger value="programs" className="text-xs">Programs</TabsTrigger>
              <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="exercises" className="space-y-4">
              {activeDomain ? (
                <DomainExercises
                  domain={activeDomain as any}
                  onComplete={(score, xp) => handleExerciseComplete(activeDomain, score, xp)}
                />
              ) : (
                <div className="grid gap-4">
                  {(["attention", "memory", "executive", "communication"] as const).map(domain => (
                    <DomainExercises
                      key={domain}
                      domain={domain}
                      onComplete={(score, xp) => handleExerciseComplete(domain, score, xp)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="programs">
              <ExternalProgramLinks activeDomain={activeDomain} />
            </TabsContent>

            <TabsContent value="progress">
              <NeuroArsenalGamification
                stats={{
                  totalXp: userProgress.totalXp,
                  level: Math.floor(userProgress.totalXp / 200) + 1,
                  streak: userProgress.streak,
                  achievements: userProgress.achievements,
                  domainProgress: userProgress.domainProgress
                }}
                onExportReport={handleExportReport}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Manuscript Quanta Footer */}
        <div className="px-4 pb-8">
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-3">
              <p className="text-xs text-amber-200 italic text-center">
                "The brain's capacity to rewire itself is the greatest gift of recovery" 
                <span className="block mt-1 text-amber-400">— What a Journey, Ch7</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobilePageContainer>
  );
};

export default TBIPrograms;
