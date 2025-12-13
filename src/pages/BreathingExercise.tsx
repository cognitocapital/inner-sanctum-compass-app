import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Trophy, Timer, TrendingUp, Wind, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RetentionBreathing from "@/components/breathing/RetentionBreathing";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { MobileBottomNav, MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileFullScreenModal } from "@/components/ui/mobile-modal";
import { MobileStatsGrid } from "@/components/ui/mobile-stats-grid";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileActionCard } from "@/components/ui/mobile-action-card";
import { cn } from "@/lib/utils";

const breathingPatterns = [
  { name: "Quick Reset", cycles: 5, description: "2-3 minutes" },
  { name: "Standard", cycles: 10, description: "5 minutes" },
  { name: "Deep Practice", cycles: 15, description: "8 minutes" },
];

const BreathingExercise = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedSessions = localStorage.getItem('breathingSessions');
    const savedStreak = localStorage.getItem('breathingStreak');
    const savedBest = localStorage.getItem('breathingBest');
    
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
  }, []);

  const breathingPattern = { inhale: 4, hold: 4, exhale: 6, pause: 2 };

  const phaseInstructions = {
    inhale: "Breathe in slowly",
    hold: "Hold gently",
    exhale: "Exhale slowly",
    pause: "Rest..."
  };

  const phoenixMessages = {
    inhale: "Rising like a phoenix",
    hold: "Pausing with grace", 
    exhale: "Releasing with power",
    pause: "Preparing for rebirth"
  };

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
      const nextPhase = phases[(currentIndex + 1) % phases.length];
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
        if (cycleCount + 1 >= selectedDuration) {
          completeSession();
          return;
        }
      }
      
      speak(phaseInstructions[nextPhase]);
      setPhase(nextPhase);
      setTimeLeft(breathingPattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, cycleCount, selectedDuration]);

  const completeSession = () => {
    setIsActive(false);
    const newSessions = totalSessions + 1;
    const newStreak = streak + 1;
    
    setTotalSessions(newSessions);
    setStreak(newStreak);
    
    if (selectedDuration > personalBest) {
      setPersonalBest(selectedDuration);
      localStorage.setItem('breathingBest', selectedDuration.toString());
      toast({ title: "New Phoenix Record! 🔥", description: `${selectedDuration} cycles completed!` });
    } else {
      toast({ title: "Session Complete! 🔥", description: `${selectedDuration} breathing cycles done!` });
    }
    
    localStorage.setItem('breathingSessions', newSessions.toString());
    localStorage.setItem('breathingStreak', newStreak.toString());
  };

  const startPause = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    setTimeLeft(4);
  };

  const startSession = (cycles: number) => {
    setSelectedDuration(cycles);
    reset();
    speak("Beginning your phoenix breathing session.");
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return 'from-blue-400 to-cyan-500';
      case 'hold': return 'from-orange-400 to-red-500';
      case 'exhale': return 'from-green-400 to-teal-500';
      case 'pause': return 'from-purple-400 to-indigo-500';
      default: return 'from-orange-400 to-red-500';
    }
  };

  const circleScale = phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-90' : 'scale-100';

  const navItems = [
    { id: "basic", label: "Breathe", icon: <Wind className="h-5 w-5" /> },
    { id: "retention", label: "Retention", icon: <Flame className="h-5 w-5" /> },
  ];

  return (
    <MobilePageContainer className="bg-gradient-to-b from-slate-900 via-orange-900 to-red-900 text-white relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-500/60 rounded-full animate-[float_4s_ease-in-out_infinite]"
            style={{ left: `${15 + i * 20}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <MobileHeader
          title="Phoenix Breath"
          subtitle="Healing breaths for recovery"
          backHref="/dashboard"
          accentColor="orange"
          icon={
            <div className="w-full h-full rounded-full bg-gradient-to-b from-orange-400 to-red-600 flex items-center justify-center shadow-2xl animate-pulse">
              <Flame className="h-10 w-10 md:h-14 md:w-14 text-white" />
            </div>
          }
        >
          <div className="mt-4">
            <EvidenceBadge
              level="research"
              domain="Breathing & HRV"
              description="Research supports benefits for TBI anxiety and stress"
              pubmedId="37138494"
            />
          </div>
        </MobileHeader>

        {/* Stats */}
        <div className="px-4 mb-6">
          <MobileStatsGrid
            accentColor="orange"
            stats={[
              { icon: <Trophy className="h-6 w-6" />, value: streak, label: "Day Streak", iconColor: "text-yellow-400" },
              { icon: <Timer className="h-6 w-6" />, value: personalBest, label: "Best Cycles", iconColor: "text-orange-400" },
              { icon: <Flame className="h-6 w-6" />, value: totalSessions, label: "Sessions", iconColor: "text-red-400" },
              { icon: <TrendingUp className="h-6 w-6" />, value: `${Math.floor((totalSessions * 10) / 60)}m`, label: "Total", iconColor: "text-orange-300" },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="px-4 pb-6">
          {activeTab === "basic" && (
            <div className="space-y-4">
              {/* Pattern Selection */}
              {!isActive && cycleCount === 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {breathingPatterns.map((pattern) => (
                    <MobileActionCard
                      key={pattern.name}
                      title={`${pattern.cycles}`}
                      description={pattern.name}
                      accentColor="orange"
                      onClick={() => startSession(pattern.cycles)}
                      size="sm"
                    />
                  ))}
                </div>
              )}

              {/* Breathing Visualization */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-orange-900/80 border-orange-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg md:text-2xl font-serif text-orange-100">
                    Cycle {cycleCount + 1} / {selectedDuration}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-orange-300">
                    {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Visual Timer */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-40 h-40 md:w-56 md:h-56">
                      <div 
                        className={cn(
                          "w-full h-full rounded-full transition-all duration-1000 ease-in-out bg-gradient-to-br opacity-90",
                          getPhaseColor(),
                          circleScale
                        )}
                        style={{ boxShadow: isActive ? '0 0 60px rgba(251, 146, 60, 0.8)' : '0 0 30px rgba(251, 146, 60, 0.4)' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-black/40 rounded-lg p-4 backdrop-blur-sm">
                          <div className="text-4xl md:text-5xl font-bold text-white mb-1">{timeLeft}</div>
                          <div className="text-sm md:text-lg uppercase tracking-wide text-orange-200">{phase}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center space-y-2">
                    <p className="text-lg text-orange-100">{phaseInstructions[phase]}</p>
                    <p className="text-xs text-orange-300 italic">{phoenixMessages[phase]}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-3">
                    <Button onClick={startPause} size="lg" className="flex-1 max-w-[140px] bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500">
                      {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                      {isActive ? 'Pause' : cycleCount === 0 ? 'Begin' : 'Resume'}
                    </Button>
                    <Button onClick={reset} variant="outline" size="lg" className="border-orange-500/50">
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-orange-200 text-center px-2">
                4-4-6 pattern: calms nervous system, reduces anxiety, supports neuroplasticity
              </p>
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

      {/* Retention Modal (Mobile) */}
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
