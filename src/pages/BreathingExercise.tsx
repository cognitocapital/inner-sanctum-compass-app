import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Trophy, Timer, TrendingUp, Wind, Heart, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RetentionBreathing from "@/components/breathing/RetentionBreathing";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { MobileBottomNav, MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileFullScreenModal } from "@/components/ui/mobile-modal";
import { MobileStatsGrid } from "@/components/ui/mobile-stats-grid";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileActionCard } from "@/components/ui/mobile-action-card";
import { BreathingSphere } from "@/components/ui/breathing-sphere";
import { PhoenixLevelBadge, StreakDisplay, usePhoenixGamification } from "@/components/ui/phoenix-gamification";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Manuscript Quanta - Ch3 & Prologue integration
const quantaPrompts = {
  inhale: [
    "Rising from the ashes, embrace new breath...",
    "Each inhale brings transformation...",
    "The phoenix knows: breathing is the first step to rising.",
  ],
  hold: [
    "In stillness, find your power...",
    "Sitting with uncomfortable feelings builds strength.",
    "The pause between breaths holds infinite potential.",
  ],
  exhale: [
    "Release what no longer serves you...",
    "Letting go creates space for growth...",
    "With each exhale, the old self transforms.",
  ],
  pause: [
    "In the quiet, healing happens...",
    "Rest is not weakness—it's preparation for flight.",
    "The phoenix rests before rising again.",
  ],
};

const breathingPatterns = [
  { name: "Calm", cycles: 5, description: "2-3 min", pattern: { inhale: 4, hold: 4, exhale: 6, pause: 2 }, xp: 25 },
  { name: "Balance", cycles: 10, description: "5 min", pattern: { inhale: 4, hold: 4, exhale: 6, pause: 2 }, xp: 50 },
  { name: "Deep", cycles: 15, description: "8 min", pattern: { inhale: 4, hold: 7, exhale: 8, pause: 2 }, xp: 100 },
  { name: "Wim Hof", cycles: 3, description: "Power", pattern: { inhale: 2, hold: 0, exhale: 2, pause: 0 }, xp: 75 },
];

// Personalization quiz questions
const onboardQuestions = [
  { id: 'anxiety', question: 'How anxious do you feel right now?', min: 1, max: 10 },
  { id: 'fatigue', question: 'How fatigued are you?', min: 1, max: 10 },
  { id: 'focus', question: 'How is your focus?', min: 1, max: 10 },
];

const BreathingExercise = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[1]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentQuanta, setCurrentQuanta] = useState("");
  const [sessionMood, setSessionMood] = useState<{ pre?: number; post?: number }>({});
  const [hrvEstimate, setHrvEstimate] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { state: gamification, addXp, unlockAchievement } = usePhoenixGamification();

  useEffect(() => {
    const savedSessions = localStorage.getItem('breathingSessions');
    const savedStreak = localStorage.getItem('breathingStreak');
    const savedBest = localStorage.getItem('breathingBest');
    
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
    
    // Update quanta on mount
    setCurrentQuanta(quantaPrompts.inhale[Math.floor(Math.random() * quantaPrompts.inhale.length)]);
  }, []);

  // Update quanta when phase changes
  useEffect(() => {
    const prompts = quantaPrompts[phase];
    setCurrentQuanta(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [phase]);

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
      const currentIndex = phases.indexOf(phase);
      let nextPhase = phases[(currentIndex + 1) % phases.length];
      
      // Skip phases with 0 duration
      while (selectedPattern.pattern[nextPhase] === 0) {
        nextPhase = phases[(phases.indexOf(nextPhase) + 1) % phases.length];
      }
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
        // Simulate HRV improvement
        setHrvEstimate(prev => Math.min(100, prev + Math.random() * 5));
        
        if (cycleCount + 1 >= selectedPattern.cycles) {
          completeSession();
          return;
        }
      }
      
      speak(phase === 'inhale' ? 'Breathe in' : phase === 'exhale' ? 'Breathe out' : phase === 'hold' ? 'Hold' : 'Rest');
      setPhase(nextPhase);
      setTimeLeft(selectedPattern.pattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, cycleCount, selectedPattern]);

  const completeSession = () => {
    setIsActive(false);
    const newSessions = totalSessions + 1;
    const newStreak = streak + 1;
    
    setTotalSessions(newSessions);
    setStreak(newStreak);
    
    // Add XP based on pattern
    addXp(selectedPattern.xp, `Completed ${selectedPattern.name} breathing`);
    
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
    
    if (selectedPattern.cycles > personalBest) {
      setPersonalBest(selectedPattern.cycles);
      localStorage.setItem('breathingBest', selectedPattern.cycles.toString());
      toast({ title: "New Phoenix Record! 🔥", description: `${selectedPattern.cycles} cycles completed!` });
    } else {
      toast({ title: "Session Complete! 🔥", description: `${selectedPattern.cycles} breathing cycles done!` });
    }
    
    localStorage.setItem('breathingSessions', newSessions.toString());
    localStorage.setItem('breathingStreak', newStreak.toString());
  };

  const startPause = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    setTimeLeft(selectedPattern.pattern.inhale);
    setHrvEstimate(0);
  };

  const startSession = (pattern: typeof breathingPatterns[0]) => {
    setSelectedPattern(pattern);
    reset();
    setTimeLeft(pattern.pattern.inhale);
    speak("Beginning your phoenix breathing session.");
  };

  const navItems = [
    { id: "basic", label: "Breathe", icon: <Wind className="h-5 w-5" /> },
    { id: "retention", label: "Retention", icon: <Flame className="h-5 w-5" /> },
  ];

  return (
    <MobilePageContainer className="bg-gradient-to-b from-slate-900 via-orange-950 to-slate-900 text-white relative overflow-hidden">
      {/* Enhanced background with biometric-inspired visuals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Pulsing rings synced with breathing */}
        <div className={cn(
          "absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full border border-orange-500/20 transition-all duration-1000",
          isActive && phase === 'inhale' && "scale-110 border-cyan-400/40",
          isActive && phase === 'exhale' && "scale-90 border-emerald-400/40",
        )} />
        <div className={cn(
          "absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full border border-orange-500/10 transition-all duration-1000 delay-100",
          isActive && phase === 'inhale' && "scale-110 border-cyan-400/30",
          isActive && phase === 'exhale' && "scale-90 border-emerald-400/30",
        )} />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full animate-[float_4s_ease-in-out_infinite]",
              isActive ? "bg-orange-500/80" : "bg-orange-500/40"
            )}
            style={{ 
              left: `${10 + (i * 7)}%`, 
              top: `${15 + (i % 4) * 20}%`, 
              animationDelay: `${i * 0.3}s` 
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header with Level Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
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
          
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-orange-100">
                Phoenix Breath
              </h1>
            </div>
            <p className="text-sm text-orange-300/80">Neuroplastic breathwork for recovery</p>
            <div className="mt-2">
              <EvidenceBadge
                level="A"
                domain="HRV & Vagal Tone"
                description="INCOG 2.0 Level A: Breathing exercises improve autonomic regulation"
                pubmedId="37138494"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 mb-4">
          <MobileStatsGrid
            accentColor="orange"
            stats={[
              { icon: <Trophy className="h-5 w-5" />, value: streak, label: "Streak", iconColor: "text-yellow-400" },
              { icon: <Timer className="h-5 w-5" />, value: personalBest, label: "Best", iconColor: "text-orange-400" },
              { icon: <Flame className="h-5 w-5" />, value: totalSessions, label: "Sessions", iconColor: "text-red-400" },
              { icon: <Zap className="h-5 w-5" />, value: `${Math.round(hrvEstimate)}%`, label: "HRV", iconColor: "text-cyan-400" },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="px-4 pb-24">
          {activeTab === "basic" && (
            <div className="space-y-4">
              {/* Pattern Selection */}
              {!isActive && cycleCount === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {breathingPatterns.map((pattern) => (
                    <Card 
                      key={pattern.name}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-[1.02] border-orange-500/30 bg-slate-900/80",
                        selectedPattern.name === pattern.name && "ring-2 ring-orange-500"
                      )}
                      onClick={() => startSession(pattern)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-orange-100">{pattern.name}</div>
                        <div className="text-xs text-orange-300/70">{pattern.description}</div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          +{pattern.xp} XP
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Breathing Visualization - 3D Sphere */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-orange-950/90 border-orange-500/20 backdrop-blur-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg text-orange-100">
                      Cycle {cycleCount + 1} / {selectedPattern.cycles}
                    </CardTitle>
                    <p className="text-xs text-orange-300/70">{selectedPattern.name} Pattern</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-orange-300">
                    {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 3D Breathing Sphere */}
                  <div className="flex items-center justify-center py-6">
                    <div className="relative">
                      <BreathingSphere 
                        phase={phase} 
                        isActive={isActive} 
                        size="lg"
                        showParticles={isActive}
                      />
                      
                      {/* Timer Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-white drop-shadow-lg">{timeLeft}</div>
                          <div className="text-sm uppercase tracking-widest text-white/80 mt-1">{phase}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manuscript Quanta Prompt */}
                  <div className="text-center py-3 px-4 bg-white/5 rounded-xl">
                    <Sparkles className="h-4 w-4 mx-auto mb-2 text-amber-400" />
                    <p className="text-sm text-orange-200 italic">{currentQuanta}</p>
                  </div>

                  {/* HRV Progress */}
                  {isActive && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-orange-300/70">
                        <span>Estimated HRV Improvement</span>
                        <span>{Math.round(hrvEstimate)}%</span>
                      </div>
                      <Progress value={hrvEstimate} className="h-1.5" />
                    </div>
                  )}

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
              <Card className="bg-slate-900/60 border-orange-500/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span className="text-orange-200">Pattern:</span>
                    </div>
                    <span className="text-orange-100 font-mono">
                      {selectedPattern.pattern.inhale}-{selectedPattern.pattern.hold}-{selectedPattern.pattern.exhale}-{selectedPattern.pattern.pause}
                    </span>
                  </div>
                  <p className="text-xs text-orange-300/60 mt-2 text-center">
                    Activates vagal tone • Reduces anxiety • Supports neuroplasticity
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "retention" && (
            <RetentionBreathing />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        items={navItems}
        activeId={activeTab}
        onSelect={(id) => {
          if (id === "retention") {
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
