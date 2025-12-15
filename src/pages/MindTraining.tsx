import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Activity, TrendingUp, FileText, Download, ExternalLink, MapPin, Stethoscope, Sparkles, BookOpen } from "lucide-react";
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

interface AssessmentResult {
  phq9: number;
  gad7: number;
  moca: number;
  abs: number;
  timestamp: string;
}

const MindTraining = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem('mindAssessmentResults');
    return saved ? JSON.parse(saved) : [];
  });
  const [gameScores, setGameScores] = useState<{ score: number; accuracy: number; date: string }[]>(() => {
    const saved = localStorage.getItem('mindGameScores');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('mindStreak');
    return saved ? parseInt(saved) : 0;
  });
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('mindXP');
    return saved ? parseInt(saved) : 0;
  });
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('mindAchievements');
    return saved ? JSON.parse(saved) : defaultAchievements;
  });

  const activeRegions = assessmentResults.length > 0 
    ? ['attention', 'memory', 'executive', 'emotional'] 
    : ['attention'];

  useEffect(() => {
    localStorage.setItem('mindAssessmentResults', JSON.stringify(assessmentResults));
    localStorage.setItem('mindGameScores', JSON.stringify(gameScores));
    localStorage.setItem('mindStreak', streak.toString());
    localStorage.setItem('mindXP', totalXP.toString());
    localStorage.setItem('mindAchievements', JSON.stringify(achievements));
  }, [assessmentResults, gameScores, streak, totalXP, achievements]);

  const handleAssessmentComplete = (results: AssessmentResult) => {
    setAssessmentResults(prev => [...prev, results]);
    setTotalXP(prev => prev + 50);
    setStreak(prev => prev + 1);
    
    // Check achievements
    const newAchievements = [...achievements];
    const firstAssessment = newAchievements.find(a => a.id === 'first_assessment');
    if (firstAssessment && !firstAssessment.earned) {
      firstAssessment.earned = true;
      firstAssessment.earnedDate = new Date().toISOString();
    }
    const allAssessments = newAchievements.find(a => a.id === 'all_assessments');
    if (allAssessments && !allAssessments.earned) {
      allAssessments.earned = true;
      allAssessments.earnedDate = new Date().toISOString();
    }
    setAchievements(newAchievements);

    toast({
      title: "Assessment Complete",
      description: `PHQ-9: ${results.phq9} | GAD-7: ${results.gad7} | MoCA: ${results.moca} | ABS: ${results.abs}`,
    });
  };

  const handleGameComplete = (score: number, accuracy: number) => {
    const newScore = { score, accuracy, date: new Date().toISOString().split('T')[0] };
    setGameScores(prev => [...prev, newScore]);
    setTotalXP(prev => prev + score);
    
    toast({
      title: "Game Complete!",
      description: `Score: ${score} | Accuracy: ${accuracy.toFixed(0)}%`,
    });
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      assessments: assessmentResults,
      gameScores,
      streak,
      totalXP,
      achievements: achievements.filter((a: any) => a.earned)
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Phoenix_Mind_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({ title: "Report Exported", description: "Clinical data exported for telehealth review" });
  };

  const level = Math.floor(totalXP / 200) + 1;

  // Generate trend data from results
  const cognitiveData = assessmentResults.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.round((30 - r.moca) / 3), // Simplified cognitive index
  }));

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
            <EvidenceBadge level="A" source="INCOG 2.0" pmid="37673101" />
            <Badge className="bg-cyan-600/80 text-cyan-100">2025 NINDS</Badge>
          </div>
        </div>

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
          <TabsList className="grid w-full grid-cols-5 bg-orange-900/30 border border-orange-600/50 mb-6">
            <TabsTrigger value="overview" className="text-orange-200 data-[state=active]:bg-orange-600">Overview</TabsTrigger>
            <TabsTrigger value="assess" className="text-orange-200 data-[state=active]:bg-orange-600">Assess</TabsTrigger>
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
                achievements={achievements}
                weeklyGoal={{ current: Math.min(assessmentResults.length, 5), target: 5 }}
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

              {/* Quanta Card */}
              <Card className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-orange-600/50 md:col-span-2">
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
                data={assessmentResults.map(r => ({
                  date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  value: r.phq9
                })).slice(-10)}
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
