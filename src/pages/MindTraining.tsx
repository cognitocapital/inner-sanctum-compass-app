import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Activity, TrendingUp, Download, ExternalLink, Stethoscope, Sparkles, BookOpen, AlertCircle, Flame, MessageCircle, CloudFog, Music, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { AnimatedNeuralBrain } from "@/components/mind/AnimatedNeuralBrain";
import { ClinicalAssessments } from "@/components/mind/ClinicalAssessments";
import { NBackGame } from "@/components/mind/NBackGame";
import { NormativeTrendGraph, NORMATIVE_BENCHMARKS } from "@/components/mind/NormativeTrendGraph";
import { MindGamification, defaultAchievements } from "@/components/mind/MindGamification";
import { GOSEAssessment } from "@/components/clinical/GOSEAssessment";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionLogger, calculateXP } from "@/hooks/use-session-logger";
import { useModuleProgress } from "@/hooks/use-module-progress";
import { useUserProgress } from "@/hooks/use-user-progress";
import { supabase } from "@/integrations/supabase/client";

interface AssessmentResult {
  phq9: number;
  gad7: number;
  moca: number;
  abs: number;
  timestamp: string;
}

const MindTraining = () => {
  const { toast } = useToast();
  const { user, isGuest } = useAuth();
  const { logSession } = useSessionLogger();
  const { progress: moduleProgress, isLoading: moduleLoading, refetch: refetchModule } = useModuleProgress("mind");
  const { progress: userProgress, addXp, incrementStreak } = useUserProgress();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [gameScores, setGameScores] = useState<{ score: number; accuracy: number; date: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fogDay, setFogDay] = useState(false);

  // Fetch assessment history from database
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user || isGuest) {
        setIsLoadingData(false);
        return;
      }
      
      try {
        const { data: assessments, error } = await supabase
          .from("clinical_assessments")
          .select("*")
          .eq("user_id", user.id)
          .eq("assessment_type", "combined_battery")
          .order("completed_at", { ascending: false })
          .limit(20);

        if (error) throw error;

        if (assessments) {
          const results = assessments.map(a => ({
            phq9: (a.subscores as Record<string, number>)?.phq9 || 0,
            gad7: (a.subscores as Record<string, number>)?.gad7 || 0,
            moca: a.score || 0,
            abs: (a.subscores as Record<string, number>)?.abs || 0,
            timestamp: a.created_at || new Date().toISOString(),
          }));
          setAssessmentResults(results);
        }

        const { data: sessions, error: sessionsError } = await supabase
          .from("session_logs")
          .select("*")
          .eq("user_id", user.id)
          .eq("module_type", "mind")
          .eq("exercise_id", "nback")
          .order("created_at", { ascending: false })
          .limit(20);

        if (sessionsError) throw sessionsError;

        if (sessions) {
          const scores = sessions.map(s => ({
            score: (s.metrics as Record<string, number>)?.score || 0,
            accuracy: (s.metrics as Record<string, number>)?.accuracy || 0,
            date: new Date(s.created_at).toISOString().split('T')[0],
          }));
          setGameScores(scores);
        }
      } catch (err) {
        console.error("Error fetching mind data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAssessments();
  }, [user, isGuest]);

  const activeRegions = assessmentResults.length > 0 
    ? ['attention', 'memory', 'executive', 'emotional'] 
    : ['attention'];

  const handleAssessmentComplete = async (results: AssessmentResult) => {
    const startTime = Date.now();
    
    if (user && !isGuest) {
      try {
        const { error } = await supabase.from("clinical_assessments").insert({
          user_id: user.id,
          assessment_type: "combined_battery",
          score: results.moca,
          subscores: { phq9: results.phq9, gad7: results.gad7, abs: results.abs },
          notes: `PHQ-9: ${results.phq9}, GAD-7: ${results.gad7}, MoCA: ${results.moca}, ABS: ${results.abs}`,
        });

        if (error) throw error;

        await logSession({
          moduleType: "clinical",
          exerciseId: "assessment_battery",
          durationSeconds: Math.floor((Date.now() - startTime) / 1000) + 600,
          xpEarned: 50,
          metrics: results,
        });

        setAssessmentResults(prev => [results, ...prev]);
        
        toast({
          title: "Assessment Saved! 🧠",
          description: `PHQ-9: ${results.phq9} | GAD-7: ${results.gad7} | MoCA: ${results.moca} | ABS: ${results.abs}`,
        });
      } catch (err) {
        console.error("Error saving assessment:", err);
        toast({
          title: "Error Saving",
          description: "Assessment recorded locally. Sign in to sync.",
          variant: "destructive",
        });
      }
    } else {
      setAssessmentResults(prev => [results, ...prev]);
      toast({
        title: "Assessment Complete",
        description: "Sign in to save your progress permanently.",
      });
    }
  };

  const handleGameComplete = async (score: number, accuracy: number) => {
    const xpEarned = calculateXP("mind", 300, { score, accuracy });
    
    if (user && !isGuest) {
      await logSession({
        moduleType: "mind",
        exerciseId: "nback",
        durationSeconds: 300,
        xpEarned,
        metrics: { score, accuracy },
      });
    }

    const newScore = { score, accuracy, date: new Date().toISOString().split('T')[0] };
    setGameScores(prev => [newScore, ...prev]);
    
    toast({
      title: "Game Complete! 🎯",
      description: `Score: ${score} | Accuracy: ${accuracy.toFixed(0)}% | +${xpEarned} XP`,
    });
  };

  const exportReport = async () => {
    const report = {
      generatedAt: new Date().toISOString(),
      patient: user?.email || "Guest",
      assessments: assessmentResults.slice(0, 10),
      gameScores: gameScores.slice(0, 10),
      progress: {
        totalSessions: moduleProgress.totalSessions,
        totalMinutes: moduleProgress.totalMinutes,
        totalXp: moduleProgress.totalXp,
      },
      userProgress: userProgress ? {
        level: userProgress.current_level,
        streak: userProgress.current_streak,
        totalXP: userProgress.total_xp,
      } : null,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Phoenix_Mind_Clinical_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({ title: "Report Exported", description: "Clinical data exported for telehealth review" });
  };

  const level = userProgress?.current_level || Math.floor((moduleProgress.totalXp || 0) / 200) + 1;
  const streak = userProgress?.current_streak || 0;
  const totalXP = userProgress?.total_xp || moduleProgress.totalXp || 0;

  const cognitiveData = assessmentResults.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.round((30 - r.moca) / 3),
  })).reverse();

  const moodData = assessmentResults.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: r.phq9,
  })).reverse().slice(-10);

  // Fog Day simplified view
  if (fogDay) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        {/* Fog Day: Simplified to breathing + soundscape only */}
        <header className="p-6 flex items-center justify-between">
          <Button asChild variant="ghost" size="lg" className="text-amber-400/80 hover:text-amber-300 min-h-[56px]">
            <Link to="/dashboard"><ArrowLeft className="mr-2 h-5 w-5" />Back</Link>
          </Button>
          <Button
            onClick={() => setFogDay(false)}
            variant="ghost"
            size="lg"
            className="text-amber-400/60 hover:text-amber-300 min-h-[56px]"
          >
            <CloudFog className="mr-2 h-5 w-5" /> Exit Fog Mode
          </Button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-3"
          >
            <CloudFog className="h-16 w-16 text-amber-400/60 mx-auto" />
            <h1 className="text-2xl font-serif text-amber-200/90">It's a fog day</h1>
            <p className="text-amber-200/50 text-lg">That's okay. Just breathe.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full space-y-4"
          >
            <Button
              asChild
              size="lg"
              className="w-full min-h-[72px] text-lg rounded-2xl bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-500/20"
            >
              <Link to="/breathing">
                <Activity className="mr-3 h-6 w-6" />
                Breathing Exercise
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full min-h-[72px] text-lg rounded-2xl academy-glass border-amber-500/20 text-amber-200 hover:bg-white/10"
            >
              <Link to="/soundscapes">
                <Music className="mr-3 h-6 w-6" />
                Soundscape Sanctuary
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full min-h-[72px] text-lg rounded-2xl academy-glass border-amber-500/20 text-amber-200 hover:bg-white/10"
            >
              <Link to="/ai-companion">
                <MessageCircle className="mr-3 h-6 w-6" />
                Talk to Phoenix
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Cosmic background with subtle amber glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-500/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-orange-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        
        {/* Ember particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`ember-${i}`}
            className="absolute w-1 h-1 rounded-full bg-amber-400"
            style={{
              left: `${15 + i * 10}%`,
              bottom: `${10 + (i % 3) * 15}%`,
            }}
            animate={{
              y: [0, -80, -120],
              opacity: [0, 0.8, 0],
              scale: [1, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10 max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" className="text-amber-300/70 hover:text-amber-200 min-h-[48px]">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <EvidenceBadge level="A" domain="INCOG 2.0" pubmedId="37673101" />
            <Badge className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs">2025 NINDS</Badge>
          </div>
        </header>

        {/* Guest Warning */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl academy-glass border-amber-500/30 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-200/80">
              You're in guest mode. <Link to="/auth" className="underline text-amber-300 font-medium">Sign in</Link> to save your progress permanently.
            </p>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-soft-pulse-glow rounded-full" />
              <AnimatedNeuralBrain 
                activeRegions={activeRegions} 
                size="md" 
                showLabels 
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Phoenix Mind Academy
            </span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Clinical self-tracking with 2025 NINDS classification & INCOG 2.0 protocols
          </p>

          {/* Streak + AI Companion quick bar */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full academy-glass">
              <Flame className="h-4 w-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">{streak} day streak</span>
            </div>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-300 hover:from-amber-500/30 hover:to-amber-600/30 min-h-[40px]"
            >
              <Link to="/ai-companion">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Phoenix
              </Link>
            </Button>
            <Button
              onClick={() => setFogDay(true)}
              size="sm"
              variant="ghost"
              className="rounded-full text-white/40 hover:text-amber-300 hover:bg-white/5 min-h-[40px]"
            >
              <CloudFog className="h-4 w-4 mr-2" />
              Fog Day
            </Button>
          </div>
        </motion.header>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex overflow-x-auto gap-1 bg-transparent border-b border-white/10 rounded-none pb-0 mb-8">
            {[
              { value: "overview", label: "Dashboard", icon: Sparkles },
              { value: "assess", label: "Assess", icon: Stethoscope },
              { value: "clinical", label: "GOSE", icon: Activity },
              { value: "train", label: "Arena", icon: Brain },
              { value: "trends", label: "Trends", icon: TrendingUp },
              { value: "resources", label: "Resources", icon: ExternalLink },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-3 text-sm text-white/40 border-b-2 border-transparent rounded-none data-[state=active]:text-amber-300 data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all min-h-[48px]"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gamification card */}
              <MindGamification
                streak={streak}
                totalXP={totalXP}
                level={level}
                achievements={defaultAchievements}
                weeklyGoal={{ current: Math.min(moduleProgress.totalSessions || 0, 5), target: 5 }}
              />
              
              {/* Quick Actions */}
              <div className="rounded-2xl academy-glass-strong p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-200">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  Today's Curriculum
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Clinical Assessment", icon: Brain, action: () => setActiveTab("assess"), variant: "primary" as const },
                    { label: "GOSE Outcome Tracking", icon: Stethoscope, action: () => setActiveTab("clinical"), variant: "secondary" as const },
                    { label: "Cognitive Arena", icon: Target, action: () => setActiveTab("train"), variant: "secondary" as const },
                    { label: "Export Telehealth Report", icon: Download, action: exportReport, variant: "secondary" as const },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all min-h-[56px] text-left ${
                        item.variant === "primary"
                          ? "bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-200 hover:from-amber-500/30 hover:to-amber-600/25 hover:border-amber-400/50"
                          : "academy-neomorphic text-white/70 hover:text-amber-200 hover:border-amber-500/20"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${item.variant === "primary" ? "bg-amber-500/20" : "bg-white/5"}`}>
                        <item.icon className={`h-5 w-5 ${item.variant === "primary" ? "text-amber-400" : "text-white/50"}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-2xl academy-glass p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-200 mb-4">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Your Progress
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: moduleProgress.totalSessions, label: "Sessions", color: "amber" },
                    { value: moduleProgress.totalMinutes, label: "Minutes", color: "cyan" },
                    { value: assessmentResults.length, label: "Assessments", color: "purple" },
                    { value: gameScores.length, label: "Games", color: "emerald" },
                  ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-xl academy-neomorphic text-center">
                      <div className={`text-2xl font-bold ${
                        stat.color === "amber" ? "text-amber-400" :
                        stat.color === "cyan" ? "text-cyan-400" :
                        stat.color === "purple" ? "text-purple-400" :
                        "text-emerald-400"
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manuscript Quanta */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/8 via-[#1a1a1a] to-[#0A0A0A] border border-amber-500/15 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 shrink-0">
                    <BookOpen className="h-7 w-7 text-amber-400/80" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-amber-200 mb-2">Ch7: "Goldfish Capacity"</h3>
                    <p className="text-white/45 italic leading-relaxed">
                      "The goldfish brain—that's what I called it. Seconds of memory, thoughts slipping away like water through fingers. But each assessment, each game, each tracked moment builds new pathways. The capacity grows."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Assess Tab */}
          <TabsContent value="assess">
            <ClinicalAssessments onComplete={handleAssessmentComplete} />
          </TabsContent>

          {/* Clinical/GOSE Tab */}
          <TabsContent value="clinical">
            <GOSEAssessment onComplete={() => {}} onCancel={() => setActiveTab("overview")} />
          </TabsContent>

          {/* Train Tab */}
          <TabsContent value="train">
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-serif text-amber-200 mb-1">Cognitive Arena</h2>
                <p className="text-white/40">Train your neural pathways — each rep expands capacity</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <NBackGame onComplete={handleGameComplete} difficulty={1} />
                <NBackGame onComplete={handleGameComplete} difficulty={2} />
              </div>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <div className="grid md:grid-cols-2 gap-6">
              <NormativeTrendGraph
                data={cognitiveData.length > 0 ? cognitiveData : [{ date: 'Today', value: 5 }]}
                title="Cognitive Index"
                metric="Composite Score"
                normativeValue={NORMATIVE_BENCHMARKS.cognitiveIndex.value}
                normativeLabel="TBI 6-Month Avg"
                domain={[0, 10]}
                higherIsBetter={true}
                nindsCategory="Attention"
              />
              <NormativeTrendGraph
                data={moodData.length > 0 ? moodData : [{ date: 'Today', value: 5 }]}
                title="Mood (PHQ-9)"
                metric="Depression Score"
                normativeValue={NORMATIVE_BENCHMARKS.phq9.value}
                normativeLabel="TBI Depression Avg"
                domain={[0, 27]}
                higherIsBetter={false}
              />
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="rounded-2xl academy-glass-strong p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-200 mb-6">
                <Stethoscope className="h-5 w-5 text-amber-400" />
                Professional Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "MoCA Test", url: "https://www.mocatest.org/", desc: "Official cognitive screening" },
                  { name: "PHQ-9 Screeners", url: "https://www.phqscreeners.com/", desc: "Depression assessment" },
                  { name: "Brain Injury Australia", url: "https://www.braininjuryaustralia.org.au/", desc: "Local support services" },
                  { name: "NINDS TBI Guidelines", url: "https://www.ninds.nih.gov/", desc: "2025 classification" }
                ].map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl academy-neomorphic text-white/70 hover:text-amber-200 hover:border-amber-500/20 transition-all min-h-[56px]"
                  >
                    <ExternalLink className="h-4 w-4 text-amber-400/60 shrink-0" />
                    <div>
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-xs text-white/35">{resource.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MindTraining;
