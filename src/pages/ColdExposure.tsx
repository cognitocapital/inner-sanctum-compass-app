import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Play, Pause, RotateCcw, Thermometer, Snowflake, Timer, 
  Trophy, TrendingUp, Flame, BookOpen, Zap, ShieldCheck, AlertTriangle, 
  FileDown, Award, Target, Volume2, VolumeX, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import ClinicalDisclaimer from "@/components/clinical/ClinicalDisclaimer";
import { usePhoenixGamification, StreakDisplay, FeatherCount, PhoenixLevelBadge } from "@/components/ui/phoenix-gamification";
import IceCavernBackground from "@/components/ice/IceCavernBackground";
import BodyHeatMap from "@/components/ice/BodyHeatMap";
import DopamineGraph from "@/components/ice/DopamineGraph";
import FrostSafetyQuiz from "@/components/ice/FrostSafetyQuiz";
import { cn } from "@/lib/utils";

// Warrior tiers for gamification
const WARRIOR_TIERS = [
  { name: "Initiate", minSessions: 0, badge: "🌱", color: "text-gray-400" },
  { name: "Bronze Frost", minSessions: 7, badge: "🥉", color: "text-amber-600" },
  { name: "Silver Chill", minSessions: 21, badge: "🥈", color: "text-gray-300" },
  { name: "Gold Warrior", minSessions: 50, badge: "🥇", color: "text-yellow-400" },
  { name: "Platinum Phoenix", minSessions: 100, badge: "💎", color: "text-cyan-300" },
];

// Progressive 12-week ladder
const ADAPTATION_LADDER = [
  { week: 1, duration: 30, description: "Gentle introduction" },
  { week: 2, duration: 30, description: "Building consistency" },
  { week: 3, duration: 45, description: "Extending tolerance" },
  { week: 4, duration: 45, description: "Solidifying gains" },
  { week: 5, duration: 60, description: "Warrior threshold" },
  { week: 6, duration: 60, description: "Hormetic sweet spot" },
  { week: 7, duration: 75, description: "Advanced adaptation" },
  { week: 8, duration: 75, description: "Peak resilience" },
  { week: 9, duration: 90, description: "Elite level" },
  { week: 10, duration: 90, description: "Mastery phase" },
  { week: 11, duration: 105, description: "Expert threshold" },
  { week: 12, duration: 120, description: "Full adaptation" },
];

// Quanta reflections tied to phases
const quantaReflections = {
  prepare: [
    "Ch3: \"The overwhelming chaos that eventually gives way to peace...\"",
    "Intro: \"Rebuilding from the ashes, one brave step at a time.\"",
  ],
  enter: [
    "Ch4: \"The cold shock mirrors the accident's edge—face it, don't flee.\"",
    "Ch6: \"Finding stillness in the storm of sensation.\"",
  ],
  endure: [
    "Ch4: \"The vertigo slowly subsides... learning to trust the process.\"",
    "Ch3: \"What thawed within you today?\"",
  ],
  exit: [
    "You emerged stronger. Like the phoenix, you transform through challenge.",
    "Ch3: \"From freeze to thaw—dopamine flows where fear once held.\"",
  ],
};

const moodOptions = [
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😐", label: "Neutral", value: 2 },
  { emoji: "🙂", label: "Good", value: 3 },
  { emoji: "😊", label: "Great", value: 4 },
  { emoji: "🔥", label: "Euphoric", value: 5 },
];

const ColdExposure = () => {
  const [showSafetyQuiz, setShowSafetyQuiz] = useState(true);
  const [safetyPassed, setSafetyPassed] = useState(false);
  const [safetyRecommendations, setSafetyRecommendations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("forge");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [phase, setPhase] = useState<'prepare' | 'enter' | 'endure' | 'exit'>('prepare');
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentReflection, setCurrentReflection] = useState("");
  const [moodHistory, setMoodHistory] = useState<number[]>([]);
  const [sessionDurations, setSessionDurations] = useState<number[]>([]);
  const [showMoodReport, setShowMoodReport] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [bodyTemp, setBodyTemp] = useState(0); // 0-100 for heat map
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { state: gamification, addXp, unlockAchievement, incrementStreak } = usePhoenixGamification();

  // Get current warrior tier
  const currentTier = WARRIOR_TIERS.reduce((tier, t) => 
    completedSessions >= t.minSessions ? t : tier, WARRIOR_TIERS[0]
  );

  // Get recommended week from ladder
  const currentWeek = Math.min(12, Math.floor(completedSessions / 7) + 1);
  const recommendedDuration = ADAPTATION_LADDER.find(l => l.week === currentWeek)?.duration || 30;

  // Load data from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('frostForgeStreak');
    const savedBest = localStorage.getItem('frostForgeBest');
    const savedSessions = localStorage.getItem('frostForgeSessions');
    const savedTotal = localStorage.getItem('frostForgeTotal');
    const savedMoodHistory = localStorage.getItem('frostForgeMoodHistory');
    const savedDurations = localStorage.getItem('frostForgeDurations');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
    if (savedSessions) setCompletedSessions(parseInt(savedSessions));
    if (savedTotal) setTotalTime(parseInt(savedTotal));
    if (savedMoodHistory) setMoodHistory(JSON.parse(savedMoodHistory));
    if (savedDurations) setSessionDurations(JSON.parse(savedDurations));
  }, []);

  // Update reflection when phase changes
  useEffect(() => {
    const reflections = quantaReflections[phase];
    if (reflections) {
      const randomIndex = Math.floor(Math.random() * reflections.length);
      setCurrentReflection(reflections[randomIndex]);
    }
  }, [phase]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Update body temperature (increases as you adapt)
        const progress = 1 - (timeLeft / selectedDuration);
        setBodyTemp(Math.min(100, progress * 120)); // Goes from 0 to ~100

        // Phase transitions
        const prepareEnd = selectedDuration - Math.floor(selectedDuration * 0.1);
        const enterEnd = selectedDuration - Math.floor(selectedDuration * 0.2);
        const endureEnd = 5;

        if (timeLeft <= prepareEnd && phase === 'prepare') setPhase('enter');
        if (timeLeft <= enterEnd && phase === 'enter') setPhase('endure');
        if (timeLeft <= endureEnd && phase === 'endure') setPhase('exit');
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, selectedDuration]);

  const handleSafetyComplete = (passed: boolean, recommendations: string[]) => {
    setSafetyPassed(passed);
    setSafetyRecommendations(recommendations);
    setShowSafetyQuiz(false);

    if (!passed) {
      toast({
        title: "Session Not Recommended",
        description: "Based on your responses, please skip this session for safety.",
        variant: "destructive"
      });
    } else if (recommendations.length > 0) {
      toast({
        title: "Proceed with Caution",
        description: recommendations[0]
      });
    }
  };

  const completeSession = () => {
    setIsActive(false);
    setPhase('exit');
    setShowMoodReport(true);
    
    const newSessions = completedSessions + 1;
    const newTotal = totalTime + selectedDuration;
    const newStreak = streak + 1;
    const newDurations = [...sessionDurations, selectedDuration];
    
    setCompletedSessions(newSessions);
    setTotalTime(newTotal);
    setStreak(newStreak);
    setSessionDurations(newDurations);
    
    // Award XP
    addXp(25 + Math.floor(selectedDuration / 10), "Frost Forge session");
    incrementStreak();

    // Check for tier unlock
    const newTier = WARRIOR_TIERS.find(t => t.minSessions === newSessions);
    if (newTier) {
      unlockAchievement({
        id: `frost-tier-${newTier.name}`,
        name: newTier.name,
        description: `Reached ${newTier.name} tier in Frost Forge`,
        icon: 'shield',
        xpReward: 100,
        category: 'ice'
      });
    }
    
    if (selectedDuration > personalBest) {
      setPersonalBest(selectedDuration);
      localStorage.setItem('frostForgeBest', selectedDuration.toString());
    }
    
    localStorage.setItem('frostForgeStreak', newStreak.toString());
    localStorage.setItem('frostForgeSessions', newSessions.toString());
    localStorage.setItem('frostForgeTotal', newTotal.toString());
    localStorage.setItem('frostForgeDurations', JSON.stringify(newDurations));
  };

  const handleMoodReport = (mood: number) => {
    const newHistory = [...moodHistory, mood];
    setMoodHistory(newHistory);
    localStorage.setItem('frostForgeMoodHistory', JSON.stringify(newHistory));
    setShowMoodReport(false);
    setBodyTemp(0);

    toast({ 
      title: "Session Complete! ❄️", 
      description: `+${25 + Math.floor(selectedDuration / 10)} XP earned!`
    });
  };

  const startSession = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
    setPhase('prepare');
    setIsActive(true);
    setBodyTemp(0);
  };

  const toggleSession = () => setIsActive(!isActive);
  
  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setPhase('prepare');
    setBodyTemp(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'prepare': return 'text-cyan-400';
      case 'enter': return 'text-blue-400';
      case 'endure': return 'text-teal-300';
      case 'exit': return 'text-orange-400';
      default: return 'text-cyan-400';
    }
  };

  // Safety quiz screen
  if (showSafetyQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-cyan-950 relative overflow-hidden">
        <IceCavernBackground intensity={20} isActive={false} phase="prepare" />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="text-cyan-300 hover:text-white mb-6">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Snowflake className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Resilient Frost Forge</h1>
            <p className="text-cyan-300">Transform fear into dopamine resilience</p>
            
            <div className="flex justify-center gap-2 mt-4">
              <EvidenceBadge 
                level="C" 
                domain="Hormetic Stress"
                description="Research-backed dopamine protocols. Not core INCOG but aligned with stress adaptation science."
                pubmedId="37138494"
              />
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300">
                <AlertTriangle className="w-3 h-3 mr-1" />
                TBI Caution Required
              </Badge>
            </div>
          </div>

          <FrostSafetyQuiz
            onComplete={handleSafetyComplete}
            onCancel={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Ice Cavern Background */}
      <IceCavernBackground 
        intensity={isActive ? 100 - (timeLeft / selectedDuration * 100) : 20} 
        isActive={isActive} 
        phase={phase} 
      />

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" className="text-cyan-300 hover:text-white">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <StreakDisplay days={gamification.streakDays} accentColor="cyan" />
            <FeatherCount count={gamification.feathers} />
          </div>
        </div>

        {/* Title & Tier */}
        <header className="text-center mb-8">
          <motion.div 
            className="w-24 h-24 mx-auto mb-4 relative"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 20, repeat: isActive ? Infinity : 0, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40">
              <Snowflake className="w-12 h-12 text-white" />
            </div>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Resilient Frost Forge
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge className={cn("text-sm", currentTier.color, "bg-slate-800/50 border-0")}>
              {currentTier.badge} {currentTier.name}
            </Badge>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
              Week {currentWeek} / 12
            </Badge>
          </div>

          <div className="flex justify-center gap-2">
            <EvidenceBadge 
              level="C" 
              domain="Stress Adaptation"
              description="Huberman dopamine protocols with 2025 TBI safety caps"
              pubmedId="36594858"
            />
          </div>
        </header>

        {/* Safety Recommendations */}
        {safetyRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-200 font-medium">Today's Recommendation</p>
                <p className="text-sm text-amber-300">{safetyRecommendations[0]}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="forge" className="text-cyan-300 data-[state=active]:bg-cyan-500/20">
              <Snowflake className="w-4 h-4 mr-2" />
              Forge
            </TabsTrigger>
            <TabsTrigger value="ladder" className="text-cyan-300 data-[state=active]:bg-cyan-500/20">
              <Target className="w-4 h-4 mr-2" />
              Ladder
            </TabsTrigger>
            <TabsTrigger value="dopamine" className="text-cyan-300 data-[state=active]:bg-cyan-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="science" className="text-cyan-300 data-[state=active]:bg-cyan-500/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Science
            </TabsTrigger>
          </TabsList>

          {/* Forge Tab - Main Session */}
          <TabsContent value="forge" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Timer & Controls */}
              <Card className="bg-slate-900/80 border-cyan-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Timer Display */}
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <motion.div 
                        className="w-full h-full rounded-full border-4 border-cyan-400/50 flex items-center justify-center"
                        style={{
                          background: `conic-gradient(from 0deg, 
                            rgba(6, 182, 212, 0.8) ${(1 - timeLeft / selectedDuration) * 100}%, 
                            rgba(30, 41, 59, 0.3) ${(1 - timeLeft / selectedDuration) * 100}%)`,
                          boxShadow: isActive ? '0 0 60px rgba(6, 182, 212, 0.5)' : '0 0 20px rgba(6, 182, 212, 0.2)'
                        }}
                        animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      >
                        <div className="bg-slate-900/90 rounded-full p-8 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-cyan-100">
                              {formatTime(timeLeft || selectedDuration)}
                            </div>
                            <div className={cn("text-sm uppercase tracking-wide font-medium", getPhaseColor())}>
                              {phase}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Quanta Reflection */}
                  {currentReflection && (phase === 'endure' || phase === 'exit') && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6"
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-200 italic">{currentReflection}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Controls */}
                  <div className="flex justify-center gap-3 mb-4">
                    <Button 
                      onClick={toggleSession}
                      size="lg"
                      disabled={!safetyPassed}
                      className="flex-1 max-w-[160px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    >
                      {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                      {isActive ? 'Pause' : timeLeft === 0 ? 'Start' : 'Resume'}
                    </Button>
                    <Button 
                      onClick={resetSession}
                      variant="outline"
                      size="lg"
                      className="border-cyan-500/50 hover:border-cyan-400"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className="border-cyan-500/50 hover:border-cyan-400"
                    >
                      {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </Button>
                  </div>

                  {/* Quick duration select */}
                  {!isActive && timeLeft === 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {[30, 45, 60, 90].map((d) => (
                        <Button
                          key={d}
                          variant="outline"
                          size="sm"
                          onClick={() => startSession(d)}
                          className={cn(
                            "border-cyan-500/30",
                            d === recommendedDuration && "border-green-500/50 bg-green-500/10"
                          )}
                        >
                          {d}s
                          {d === recommendedDuration && (
                            <Sparkles className="w-3 h-3 ml-1 text-green-400" />
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Body Heat Map & Stats */}
              <div className="space-y-4">
                <Card className="bg-slate-900/80 border-cyan-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-cyan-100 flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-cyan-400" />
                      Adaptation Monitor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-12">
                    <BodyHeatMap 
                      temperature={bodyTemp} 
                      isActive={isActive}
                      size="md"
                    />
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-slate-900/60 border-cyan-500/20">
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                      <div className="text-2xl font-bold text-white">{streak}</div>
                      <p className="text-xs text-cyan-300">Day Streak</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-900/60 border-cyan-500/20">
                    <CardContent className="p-4 text-center">
                      <Timer className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                      <div className="text-2xl font-bold text-white">{personalBest}s</div>
                      <p className="text-xs text-cyan-300">Personal Best</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Ladder Tab */}
          <TabsContent value="ladder" className="space-y-4">
            <Card className="bg-slate-900/80 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-100">12-Week Adaptation Ladder</CardTitle>
                <p className="text-sm text-cyan-300">Progressive hormetic training protocol</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ADAPTATION_LADDER.map((level) => (
                    <button
                      key={level.week}
                      onClick={() => startSession(level.duration)}
                      disabled={!safetyPassed}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all",
                        currentWeek === level.week 
                          ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20"
                          : currentWeek > level.week
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-slate-800/50 border-slate-700/50 opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-cyan-400">Week {level.week}</span>
                        {currentWeek > level.week && (
                          <ShieldCheck className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="text-xl font-bold text-white">{level.duration}s</div>
                      <p className="text-xs text-cyan-300 mt-1">{level.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tier Progress */}
            <Card className="bg-slate-900/80 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-100">Warrior Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {WARRIOR_TIERS.map((tier, i) => (
                    <div key={tier.name} className="text-center flex-1">
                      <div className={cn(
                        "text-2xl mb-1",
                        completedSessions >= tier.minSessions ? "" : "grayscale opacity-50"
                      )}>
                        {tier.badge}
                      </div>
                      <p className={cn("text-xs", tier.color)}>
                        {tier.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tier.minSessions}+
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, completedSessions)}%` }}
                  />
                </div>
                <p className="text-xs text-cyan-300 text-center mt-2">
                  {completedSessions} sessions completed
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dopamine Trends Tab */}
          <TabsContent value="dopamine">
            <Card className="bg-slate-900/80 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-100">Dopamine Response Tracking</CardTitle>
                <p className="text-sm text-cyan-300">
                  Monitor your hormetic adaptation over time
                </p>
              </CardHeader>
              <CardContent>
                <DopamineGraph 
                  moodHistory={moodHistory}
                  sessionDurations={sessionDurations}
                />

                <div className="mt-6 pt-4 border-t border-cyan-500/20">
                  <Button variant="outline" className="w-full border-cyan-500/30">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export PDF for Clinician
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Science Tab */}
          <TabsContent value="science" className="space-y-4">
            <Card className="bg-slate-900/80 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-100">The Science of Hormetic Stress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-cyan-200 text-sm">
                <div>
                  <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Dopamine Surge
                  </h3>
                  <p>Cold exposure increases norepinephrine by up to 530% and dopamine by 250%, creating lasting mood elevation.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Brown Fat Activation
                  </h3>
                  <p>Regular practice activates brown adipose tissue, improving metabolic rate and thermoregulation.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    2025 TBI Safety Protocol
                  </h3>
                  <p>Sessions capped at safe durations. Always start gentle (30s) and progress only after 2+ weeks without symptom flares.</p>
                </div>
              </CardContent>
            </Card>

            <ClinicalDisclaimer type="warning" title="Important Notice">
              Cold exposure has <strong>emerging evidence</strong> but limited TBI-specific research. 
              Always consult your healthcare provider before starting.
            </ClinicalDisclaimer>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post-Session Mood Report Modal */}
      <AnimatePresence>
        {showMoodReport && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="bg-slate-900/95 border-cyan-500/30 shadow-2xl">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Snowflake className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Session Complete!</h3>
                    <p className="text-cyan-300">+{25 + Math.floor(selectedDuration / 10)} XP earned</p>
                  </div>

                  {/* Quanta Reflection */}
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-amber-400 font-medium mb-1">Reflection: What thawed?</p>
                        <p className="text-sm text-amber-200 italic">{currentReflection}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-3">
                    <p className="text-center text-cyan-200 text-sm">How do you feel right now?</p>
                    <div className="flex justify-center gap-2">
                      {moodOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleMoodReport(option.value)}
                          className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                        >
                          <span className="text-2xl mb-1">{option.emoji}</span>
                          <span className="text-xs text-cyan-300">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColdExposure;
