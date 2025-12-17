import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PhoenixBackground } from "@/components/ui/phoenix-background";
import { GlassCard } from "@/components/ui/glass-card";
import { ModuleHeader } from "@/components/ui/module-header";
import { QuantaPrompt, getRandomQuanta } from "@/components/ui/quanta-prompt";
import { SessionStats } from "@/components/ui/session-stats";
import { BreathingSphere3D } from "@/components/ui/breathing-sphere-3d";
import { cn } from "@/lib/utils";

// Breathing patterns
const patterns = [
  { name: "Calm", cycles: 5, pattern: { inhale: 4, hold: 4, exhale: 8, pause: 2 }, xp: 25, description: "2-3 min" },
  { name: "Balance", cycles: 10, pattern: { inhale: 4, hold: 4, exhale: 6, pause: 2 }, xp: 50, description: "5 min" },
  { name: "4-7-8", cycles: 8, pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 }, xp: 75, description: "Focus" },
  { name: "Wim Hof", cycles: 3, pattern: { inhale: 2, hold: 0, exhale: 2, pause: 0 }, xp: 60, description: "Power" },
];

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [selectedPattern, setSelectedPattern] = useState(patterns[1]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [quanta] = useState(() => getRandomQuanta('breath'));

  // Load saved data
  useEffect(() => {
    const savedSessions = localStorage.getItem('breathingSessions');
    const savedStreak = localStorage.getItem('breathingStreak');
    const savedXp = localStorage.getItem('breathingXp');
    
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXp) setXp(parseInt(savedXp));
  }, []);

  // Timer logic
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
        if (cycleCount + 1 >= selectedPattern.cycles) {
          completeSession();
          return;
        }
      }
      
      setPhase(nextPhase);
      setTimeLeft(selectedPattern.pattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, cycleCount, selectedPattern]);

  const completeSession = useCallback(() => {
    setIsActive(false);
    setShowCompletion(true);
    
    const newSessions = totalSessions + 1;
    const newStreak = streak + 1;
    const newXp = xp + selectedPattern.xp;
    
    setTotalSessions(newSessions);
    setStreak(newStreak);
    setXp(newXp);
    
    localStorage.setItem('breathingSessions', newSessions.toString());
    localStorage.setItem('breathingStreak', newStreak.toString());
    localStorage.setItem('breathingXp', newXp.toString());
    
    toast({ 
      title: "Session Complete! 🔥", 
      description: `+${selectedPattern.xp} XP earned. ${selectedPattern.cycles} cycles completed.`
    });
    
    setTimeout(() => setShowCompletion(false), 3000);
  }, [totalSessions, streak, xp, selectedPattern, toast]);

  const startSession = (pattern: typeof patterns[0]) => {
    setSelectedPattern(pattern);
    setPhase('inhale');
    setCycleCount(0);
    setTimeLeft(pattern.pattern.inhale);
    setIsActive(true);
  };

  const toggleSession = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    setTimeLeft(selectedPattern.pattern.inhale);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Rest';
    }
  };

  const progress = cycleCount / selectedPattern.cycles;

  return (
    <PhoenixBackground module="breath" showEmbers={!isActive} intensity={isActive ? "intense" : "normal"}>
      <div className="min-h-screen pb-8">
        <ModuleHeader 
          module="breath"
          subtitle="Neuroplastic breathwork for recovery"
          evidenceLevel="A"
          xp={xp}
          streak={streak}
        />

        <div className="px-4 max-w-lg mx-auto space-y-6">
          {/* Stats */}
          <SessionStats 
            module="breath"
            stats={[
              { label: "Sessions", value: totalSessions },
              { label: "Streak", value: streak },
              { label: "Total XP", value: xp },
            ]}
          />

          {/* Main Breathing Sphere */}
          <GlassCard module="breath" glow={isActive} className="p-6">
            <div className="flex flex-col items-center">
              {/* 3D Breathing Sphere */}
              <div className="relative mb-6">
                <BreathingSphere3D 
                  isActive={isActive}
                  phase={phase}
                  size="lg"
                />
                
                {/* Timer overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div 
                      className="text-5xl font-bold text-orange-100"
                      key={timeLeft}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {timeLeft}
                    </motion.div>
                    <div className="text-orange-300/80 text-sm font-medium uppercase tracking-wider mt-1">
                      {getPhaseInstruction()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="w-full mb-4">
                <div className="flex justify-between text-xs text-orange-300/60 mb-1">
                  <span>Cycle {cycleCount + 1} of {selectedPattern.cycles}</span>
                  <span>{selectedPattern.name}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button 
                  onClick={toggleSession}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8"
                >
                  {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  size="lg"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Pattern Selection */}
          {!isActive && cycleCount === 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-orange-200 flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Select Pattern
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {patterns.map((pattern) => (
                  <GlassCard
                    key={pattern.name}
                    module="breath"
                    hover
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      selectedPattern.name === pattern.name && "ring-2 ring-orange-500"
                    )}
                    onClick={() => startSession(pattern)}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-100">{pattern.name}</div>
                      <div className="text-xs text-orange-300/60">{pattern.description}</div>
                      <div className="text-xs text-orange-400 mt-1">+{pattern.xp} XP</div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Quanta Prompt */}
          <QuantaPrompt 
            quote={quanta.quote}
            chapter={quanta.chapter}
            reflection={quanta.reflection}
            module="breath"
          />

          {/* Completion Animation */}
          <AnimatePresence>
            {showCompletion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <GlassCard module="breath" glow className="p-8 text-center max-w-sm mx-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-4"
                  >
                    🔥
                  </motion.div>
                  <h2 className="text-2xl font-bold text-orange-100 mb-2">Session Complete!</h2>
                  <p className="text-orange-300/80">+{selectedPattern.xp} XP earned</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PhoenixBackground>
  );
};

export default BreathingExercise;
