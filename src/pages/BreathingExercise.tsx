import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Trophy, Timer, TrendingUp, Wind, Heart, Sparkles, Zap, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RetentionBreathing from "@/components/breathing/RetentionBreathing";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { MobileBottomNav, MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileFullScreenModal } from "@/components/ui/mobile-modal";
import { MobileStatsGrid } from "@/components/ui/mobile-stats-grid";
import { BreathingSphere3D } from "@/components/ui/breathing-sphere-3d";
import { HRVVisualizer } from "@/components/ui/hrv-visualizer";
import { FatigueQuiz, QuizResults } from "@/components/breathing/FatigueQuiz";
import { PhoenixLevelBadge, usePhoenixGamification } from "@/components/ui/phoenix-gamification";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// 120 Manuscript Quanta - Extended Ch3 & Prologue integration
const quantaPrompts = {
  inhale: [
    "Rising from the ashes, embrace new breath...",
    "Each inhale brings transformation...",
    "The phoenix knows: breathing is the first step to rising.",
    "Ch3: 'Sitting with uncomfortable feelings...' — breathe through it.",
    "Prologue: 'The roadmap to recovery begins here.'",
    "Draw in the power of renewal...",
  ],
  hold: [
    "In stillness, find your power...",
    "Sitting with uncomfortable feelings builds strength.",
    "The pause between breaths holds infinite potential.",
    "Ch3: 'The emotional rollercoaster was relentless...' — hold steady.",
    "In the pause, healing happens.",
    "This moment of stillness rewires your brain.",
  ],
  exhale: [
    "Release what no longer serves you...",
    "Letting go creates space for growth...",
    "With each exhale, the old self transforms.",
    "Ch3: 'Tears of gratitude...' — release with grace.",
    "Exhale the weight of yesterday.",
    "The phoenix releases ash to rise again.",
  ],
  pause: [
    "In the quiet, healing happens...",
    "Rest is not weakness—it's preparation for flight.",
    "The phoenix rests before rising again.",
    "Prologue: 'Tools for the journey...' — you're building them now.",
    "This pause is neuroplasticity in action.",
    "Quiet moments rebuild neural pathways.",
  ],
};

const defaultPatterns = [
  { name: "Calm", cycles: 5, description: "2-3 min", pattern: { inhale: 4, hold: 4, exhale: 8, pause: 2 }, xp: 25, color: "cyan" },
  { name: "Balance", cycles: 10, description: "5 min", pattern: { inhale: 4, hold: 4, exhale: 6, pause: 2 }, xp: 50, color: "orange" },
  { name: "4-7-8", cycles: 8, description: "Focus", pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 }, xp: 75, color: "purple" },
  { name: "Wim Hof", cycles: 3, description: "Power", pattern: { inhale: 2, hold: 0, exhale: 2, pause: 0 }, xp: 60, color: "red" },
];

const BreathingExercise = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [selectedPattern, setSelectedPattern] = useState(defaultPatterns[1]);
  const [customPattern, setCustomPattern] = useState<typeof defaultPatterns[0] | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [safeForRetention, setSafeForRetention] = useState(true);
  const [currentQuanta, setCurrentQuanta] = useState("");
  const [hrvLevel, setHrvLevel] = useState(40);
  const [coherenceScore, setCoherenceScore] = useState(30);
  const [breathsPerMinute, setBreathsPerMinute] = useState(6);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { state: gamification, addXp, unlockAchievement } = usePhoenixGamification();

  // Load saved data
  useEffect(() => {
    const savedSessions = localStorage.getItem('breathingSessions');
    const savedStreak = localStorage.getItem('breathingStreak');
    const savedBest = localStorage.getItem('breathingBest');
    
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
    
    setCurrentQuanta(quantaPrompts.inhale[Math.floor(Math.random() * quantaPrompts.inhale.length)]);
  }, []);

  // Update quanta when phase changes
  useEffect(() => {
    const prompts = quantaPrompts[phase];
    setCurrentQuanta(prompts[Math.floor(Math.random() * prompts.length)]);
    
    // Trigger haptic feedback on phase change
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(phase === 'inhale' || phase === 'exhale' ? 50 : 25);
    }
  }, [phase, hapticEnabled]);

  const speak = useCallback((text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
    }
  }, [voiceEnabled]);

  // Main breathing timer
  useEffect(() => {
    const currentPattern = customPattern || selectedPattern;
    
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
      const currentIndex = phases.indexOf(phase);
      let nextPhase = phases[(currentIndex + 1) % phases.length];
      
      // Skip phases with 0 duration
      while (currentPattern.pattern[nextPhase] === 0) {
        nextPhase = phases[(phases.indexOf(nextPhase) + 1) % phases.length];
      }
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
        
        // Improve HRV and coherence with each cycle
        setHrvLevel(prev => Math.min(95, prev + 2 + Math.random() * 3));
        setCoherenceScore(prev => Math.min(90, prev + 3 + Math.random() * 2));
        
        if (cycleCount + 1 >= currentPattern.cycles) {
          completeSession();
          return;
        }
      }
      
      speak(phase === 'inhale' ? 'Breathe in' : phase === 'exhale' ? 'Breathe out' : phase === 'hold' ? 'Hold' : 'Rest');
      setPhase(nextPhase);
      setTimeLeft(currentPattern.pattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, cycleCount, selectedPattern, customPattern, speak]);

  // Calculate breaths per minute
  useEffect(() => {
    const currentPattern = customPattern || selectedPattern;
    const totalSeconds = 
      currentPattern.pattern.inhale + 
      currentPattern.pattern.hold + 
      currentPattern.pattern.exhale + 
      currentPattern.pattern.pause;
    setBreathsPerMinute(Math.round(60 / totalSeconds));
  }, [selectedPattern, customPattern]);

  const completeSession = () => {
    setIsActive(false);
    const currentPattern = customPattern || selectedPattern;
    const newSessions = totalSessions + 1;
    const newStreak = streak + 1;
    
    setTotalSessions(newSessions);
    setStreak(newStreak);
    
    // Add XP based on pattern
    addXp(currentPattern.xp, `Completed ${currentPattern.name} breathing`);
    
    // Check achievements
    if (newSessions === 1) {
      unlockAchievement({
        id: 'first_breath',
        name: 'First Breath',
        description: 'Complete your first breathing session',
        icon: 'flame',
        xpReward: 50,
        category: 'breath',
      });
    }
    
    if (newStreak >= 7) {
      unlockAchievement({
        id: 'breath_streak_7',
        name: 'Vagal Master',
        description: 'Maintain a 7-day breathing streak',
        icon: 'trophy',
        xpReward: 200,
        category: 'breath',
      });
    }

    if (hrvLevel >= 80) {
      unlockAchievement({
        id: 'hrv_master',
        name: 'Heart Coherence',
        description: 'Achieve 80%+ HRV during a session',
        icon: 'heart',
        xpReward: 150,
        category: 'breath',
      });
    }
    
    if (currentPattern.cycles > personalBest) {
      setPersonalBest(currentPattern.cycles);
      localStorage.setItem('breathingBest', currentPattern.cycles.toString());
      toast({ title: "New Phoenix Record! 🔥", description: `${currentPattern.cycles} cycles completed!` });
    } else {
      toast({ title: "Session Complete! 🔥", description: `HRV improved to ${Math.round(hrvLevel)}%` });
    }
    
    localStorage.setItem('breathingSessions', newSessions.toString());
    localStorage.setItem('breathingStreak', newStreak.toString());
  };

  const startPause = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    const currentPattern = customPattern || selectedPattern;
    setTimeLeft(currentPattern.pattern.inhale);
    setHrvLevel(40);
    setCoherenceScore(30);
  };

  const startSession = (pattern: typeof defaultPatterns[0]) => {
    setSelectedPattern(pattern);
    setCustomPattern(null);
    reset();
    setTimeLeft(pattern.pattern.inhale);
    speak("Beginning your phoenix breathing session.");
  };

  const handleQuizComplete = (results: QuizResults) => {
    setShowQuiz(false);
    setSafeForRetention(results.safeForRetention);
    
    const adaptivePattern = {
      name: results.recommendedPattern.name,
      cycles: 10,
      description: 'Personalized',
      pattern: {
        inhale: results.recommendedPattern.inhale,
        hold: results.recommendedPattern.hold,
        exhale: results.recommendedPattern.exhale,
        pause: results.recommendedPattern.pause,
      },
      xp: 100, // Bonus XP for personalized
      color: 'amber',
    };
    
    setCustomPattern(adaptivePattern);
    setTimeLeft(adaptivePattern.pattern.inhale);
    
    const safetyNote = !results.safeForRetention 
      ? ' (Retention breathing not recommended based on your current state)'
      : '';
    
    toast({
      title: `${results.recommendedPattern.name} Ready`,
      description: results.quantaMessage + safetyNote,
    });
  };


  const navItems = [
    { id: "basic", label: "Breathe", icon: <Wind className="h-5 w-5" /> },
    { id: "retention", label: "Retention", icon: <Flame className="h-5 w-5" />, disabled: !safeForRetention },
  ];

  const currentPattern = customPattern || selectedPattern;

  return (
    <MobilePageContainer className="bg-gradient-to-b from-slate-900 via-slate-900 to-orange-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: isActive ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: currentPattern.pattern.inhale + currentPattern.pattern.exhale,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <PhoenixLevelBadge 
              level={gamification.level} 
              xp={gamification.xp} 
              xpToNextLevel={gamification.xpToNextLevel}
              size="sm"
            />
          </div>
          
          <motion.div 
            className="text-center mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="h-7 w-7 text-orange-500" />
              <h1 className="text-2xl font-serif font-bold text-orange-100">Phoenix Breath</h1>
            </div>
            <p className="text-xs text-orange-300/70">Neuroplastic breathwork with HRV biofeedback</p>
            <div className="mt-2">
              <EvidenceBadge
                level="A"
                domain="INCOG 2.0 HRV"
                description="Level A evidence for vagal tone and autonomic regulation"
                pubmedId="37138494"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="px-4 mb-3">
          <MobileStatsGrid
            accentColor="orange"
            stats={[
              { icon: <Trophy className="h-5 w-5" />, value: streak, label: "Streak", iconColor: "text-yellow-400" },
              { icon: <Timer className="h-5 w-5" />, value: personalBest, label: "Best", iconColor: "text-orange-400" },
              { icon: <Flame className="h-5 w-5" />, value: totalSessions, label: "Sessions", iconColor: "text-red-400" },
              { icon: <Heart className="h-5 w-5" />, value: `${Math.round(hrvLevel)}%`, label: "HRV", iconColor: "text-pink-400" },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="px-4 pb-24">
          <AnimatePresence mode="wait">
            {showQuiz ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <FatigueQuiz onComplete={handleQuizComplete} />
                <Button
                  variant="ghost"
                  className="w-full mt-3 text-orange-300"
                  onClick={() => setShowQuiz(false)}
                >
                  Skip personalization
                </Button>
              </motion.div>
            ) : activeTab === "basic" ? (
              <motion.div
                key="breathing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Pattern Selection */}
                {!isActive && cycleCount === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-200">Select Pattern</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500/30 text-orange-300 text-xs"
                        onClick={() => setShowQuiz(true)}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Personalize
                      </Button>
                    </div>
                    
                    {/* Retention Safety Warning */}
                    {!safeForRetention && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10"
                      >
                        <div className="flex items-center gap-2 text-yellow-300 text-sm">
                          <Zap className="w-4 h-4" />
                          <span>Retention breathing limited based on your current state</span>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {defaultPatterns.map((pattern) => (
                        <motion.div
                          key={pattern.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className={cn(
                              "cursor-pointer border-orange-500/20 bg-slate-900/80 transition-all",
                              selectedPattern.name === pattern.name && !customPattern && "ring-2 ring-orange-500"
                            )}
                            onClick={() => startSession(pattern)}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="text-base font-semibold text-orange-100">{pattern.name}</div>
                              <div className="text-xs text-orange-300/60">{pattern.description}</div>
                              <Badge variant="secondary" className="mt-1.5 text-xs">
                                +{pattern.xp} XP
                              </Badge>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    
                    {customPattern && (
                      <Card className="border-amber-500/40 bg-amber-900/20">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-amber-200">Personalized: {customPattern.name}</span>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-300">+100 XP</Badge>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* 3D Breathing Sphere */}
                <Card className="bg-slate-900/60 border-orange-500/20 overflow-hidden">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base text-orange-100">
                        Cycle {cycleCount + 1} / {currentPattern.cycles}
                      </CardTitle>
                      <p className="text-xs text-orange-300/60">{currentPattern.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setVoiceEnabled(!voiceEnabled)} 
                        className={cn("text-orange-300", voiceEnabled && "bg-orange-500/20")}
                      >
                        {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* 3D Sphere */}
                    <div className="flex items-center justify-center py-4">
                      <div className="relative">
                        <BreathingSphere3D 
                          phase={phase} 
                          isActive={isActive}
                          hrvLevel={hrvLevel}
                          showHrvRings
                        />
                        
                        {/* Timer Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="text-center"
                            animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <div className="text-5xl font-bold text-white drop-shadow-lg">{timeLeft}</div>
                            <div className="text-sm uppercase tracking-widest text-white/80">{phase}</div>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Manuscript Quanta */}
                    <motion.div 
                      key={currentQuanta}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-2 px-4 bg-white/5 rounded-xl"
                    >
                      <Sparkles className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                      <p className="text-sm text-orange-200/90 italic">{currentQuanta}</p>
                    </motion.div>

                    {/* HRV Visualizer */}
                    <HRVVisualizer
                      hrvValue={hrvLevel}
                      isActive={isActive}
                      breathsPerMinute={breathsPerMinute}
                      coherenceScore={coherenceScore}
                      size="sm"
                    />

                    {/* Controls */}
                    <div className="flex justify-center gap-3">
                      <Button 
                        onClick={startPause} 
                        size="lg" 
                        className="flex-1 max-w-[160px] bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/25"
                      >
                        {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                        {isActive ? 'Pause' : cycleCount === 0 ? 'Begin' : 'Resume'}
                      </Button>
                      <Button onClick={reset} variant="outline" size="lg" className="border-orange-500/50 text-orange-300">
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Pattern Info */}
                <div className="text-center text-xs text-orange-300/50 space-y-1">
                  <p>Pattern: {currentPattern.pattern.inhale}-{currentPattern.pattern.hold}-{currentPattern.pattern.exhale}-{currentPattern.pattern.pause}</p>
                  <p>~{breathsPerMinute} breaths/min • Activates vagal tone • Supports neuroplasticity</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="retention"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <RetentionBreathing />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileBottomNav
        items={navItems}
        activeId={activeTab}
        onSelect={(id) => {
          if (id === "retention") {
            if (!safeForRetention) {
              toast({
                title: "Retention Not Recommended",
                description: "Based on your current ABS level, we recommend basic breathing patterns. Re-check with the Personalize quiz when you feel calmer.",
                variant: "destructive",
              });
              return;
            }
            setShowRetentionModal(true);
          } else {
            setActiveTab(id);
          }
        }}
        accentColor="orange"
      />

      {/* Retention Modal */}
      <MobileFullScreenModal
        isOpen={showRetentionModal}
        onClose={() => setShowRetentionModal(false)}
        title="Retention Mastery"
        accentColor="orange"
      >
        <div className="p-4">
          <RetentionBreathing />
        </div>
      </MobileFullScreenModal>
    </MobilePageContainer>
  );
};

export default BreathingExercise;
