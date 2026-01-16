import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Activity, TrendingUp, FileText, Download, ExternalLink, MapPin, Stethoscope, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
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

        // Fetch game scores from session logs
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
        // Store in clinical_assessments table
        const { error } = await supabase.from("clinical_assessments").insert({
          user_id: user.id,
          assessment_type: "combined_battery",
          score: results.moca,
          subscores: { phq9: results.phq9, gad7: results.gad7, abs: results.abs },
          notes: `PHQ-9: ${results.phq9}, GAD-7: ${results.gad7}, MoCA: ${results.moca}, ABS: ${results.abs}`,
        });

        if (error) throw error;

        // Log session
        await logSession({
          moduleType: "clinical",
          exerciseId: "assessment_battery",
          durationSeconds: Math.floor((Date.now() - startTime) / 1000) + 600, // Approximate 10 min
          xpEarned: 50,
          metrics: results,
        });

        // Update local state
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
        durationSeconds: 300, // ~5 min game
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
        totalXP: moduleProgress.totalXP,
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

  // Generate trend data from results
  const cognitiveData = assessmentResults.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.round((30 - r.moca) / 3),
  })).reverse();

  const moodData = assessmentResults.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: r.phq9,
  })).reverse().slice(-10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-950/20 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-500/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" className="text-orange-300 hover:text-orange-100">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="flex gap-2">
            <EvidenceBadge level="A" domain="INCOG 2.0" pubmedId="37673101" />
            <Badge className="bg-cyan-600/80 text-cyan-100">2025 NINDS</Badge>
          </div>
        </div>

        {/* Auth Warning for Guests */}
        {isGuest && (
          <Card className="mb-4 bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <p className="text-sm text-amber-200">
                You're in guest mode. <Link to="/auth" className="underline font-medium">Sign in</Link> to save your progress permanently.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <header className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <AnimatedNeuralBrain 
              activeRegions={activeRegions} 
              size="md" 
              showLabels 
            />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-orange-100 mb-2">
            Phoenix Mind Academy
          </h1>
          <p className="text-orange-200/80 max-w-2xl mx-auto">
            Clinical self-tracking with 2025 NINDS classification, Canadian mental health protocols, and UAMS agitation guidelines.
          </p>
        </header>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-orange-900/30 border border-orange-600/50 mb-6">
            <TabsTrigger value="overview" className="text-orange-200 data-[state=active]:bg-orange-600">Overview</TabsTrigger>
            <TabsTrigger value="assess" className="text-orange-200 data-[state=active]:bg-orange-600">Assess</TabsTrigger>
            <TabsTrigger value="clinical" className="text-orange-200 data-[state=active]:bg-orange-600">GOSE</TabsTrigger>
            <TabsTrigger value="train" className="text-orange-200 data-[state=active]:bg-orange-600">Train</TabsTrigger>
            <TabsTrigger value="trends" className="text-orange-200 data-[state=active]:bg-orange-600">Trends</TabsTrigger>
            <TabsTrigger value="resources" className="text-orange-200 data-[state=active]:bg-orange-600">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <MindGamification
                streak={streak}
                totalXP={totalXP}
                level={level}
                achievements={defaultAchievements}
                weeklyGoal={{ current: Math.min(moduleProgress.totalSessions || 0, 5), target: 5 }}
              />
              
              <Card className="bg-black/40 border-orange-600/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-100">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setActiveTab("assess")} className="w-full bg-orange-600 hover:bg-orange-500">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Clinical Assessment
                  </Button>
                  <Button onClick={() => setActiveTab("clinical")} variant="outline" className="w-full border-cyan-600 text-cyan-200 hover:bg-cyan-600/20">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    GOSE Outcome Tracking
                  </Button>
                  <Button onClick={() => setActiveTab("train")} variant="outline" className="w-full border-orange-600 text-orange-200">
                    <Activity className="h-4 w-4 mr-2" />
                    Cognitive Training Game
                  </Button>
                  <Button onClick={exportReport} variant="outline" className="w-full border-orange-600 text-orange-200">
                    <Download className="h-4 w-4 mr-2" />
                    Export Telehealth Report
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-black/40 border-orange-600/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-100">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{moduleProgress.totalSessions}</div>
                      <div className="text-xs text-orange-200/70">Total Sessions</div>
                    </div>
                    <div className="p-3 bg-cyan-500/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">{moduleProgress.totalMinutes}</div>
                      <div className="text-xs text-cyan-200/70">Minutes Trained</div>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">{assessmentResults.length}</div>
                      <div className="text-xs text-purple-200/70">Assessments</div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{gameScores.length}</div>
                      <div className="text-xs text-green-200/70">Games Played</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quanta Card */}
              <Card className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-orange-600/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <BookOpen className="h-8 w-8 text-orange-400 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-orange-100 mb-2">Ch7: "Goldfish Capacity"</h3>
                      <p className="text-orange-200/80 italic">
                        "The goldfish brain—that's what I called it. Seconds of memory, thoughts slipping away like water through fingers. But each assessment, each game, each tracked moment builds new pathways. The capacity grows."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <div className="grid md:grid-cols-2 gap-6">
              <NBackGame onComplete={handleGameComplete} difficulty={1} />
              <NBackGame onComplete={handleGameComplete} difficulty={2} />
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
            <Card className="bg-black/40 border-orange-600/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-100">
                  <Stethoscope className="h-5 w-5 text-orange-400" />
                  Professional Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "MoCA Test", url: "https://www.mocatest.org/", desc: "Official cognitive screening" },
                  { name: "PHQ-9 Screeners", url: "https://www.phqscreeners.com/", desc: "Depression assessment" },
                  { name: "Brain Injury Australia", url: "https://www.braininjuryaustralia.org.au/", desc: "Local support services" },
                  { name: "NINDS TBI Guidelines", url: "https://www.ninds.nih.gov/", desc: "2025 classification" }
                ].map((resource) => (
                  <Button key={resource.name} asChild variant="outline" className="justify-start border-orange-600/50 text-orange-200 hover:bg-orange-600/20">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div>{resource.name}</div>
                        <div className="text-xs text-orange-300/70">{resource.desc}</div>
                      </div>
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MindTraining;
