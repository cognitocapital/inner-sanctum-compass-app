import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Flame, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { BreathingSphere3D } from "@/components/ui/breathing-sphere-3d";
import { cn } from "@/lib/utils";

// Focused manuscript quanta - one per phase
const phaseQuanta = {
  inhale: "Rising from the ashes, embrace new breath...",
  hold: "In stillness, find your power...",
  exhale: "Release what no longer serves you...",
  pause: "In the quiet, healing happens...",
};

// Four core breathing patterns - that's all you need
const patterns = [
  { name: "Calm", inhale: 4, hold: 4, exhale: 8, pause: 2, cycles: 5, color: "cyan" },
  { name: "Balance", inhale: 4, hold: 4, exhale: 6, pause: 2, cycles: 8, color: "orange" },
  { name: "4-7-8", inhale: 4, hold: 7, exhale: 8, pause: 0, cycles: 6, color: "purple" },
  { name: "Power", inhale: 2, hold: 0, exhale: 2, pause: 0, cycles: 30, color: "red" },
];

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [selectedPattern, setSelectedPattern] = useState(patterns[1]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [hrvLevel, setHrvLevel] = useState(40);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('breathingSessions');
    if (saved) setTotalSessions(parseInt(saved));
  }, []);

  // Main breathing timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
      const currentIndex = phases.indexOf(phase);
      let nextPhase = phases[(currentIndex + 1) % phases.length];
      
      // Skip phases with 0 duration
      while (selectedPattern[nextPhase] === 0) {
        nextPhase = phases[(phases.indexOf(nextPhase) + 1) % phases.length];
      }
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
        setHrvLevel(prev => Math.min(95, prev + 3));
        
        if (cycleCount + 1 >= selectedPattern.cycles) {
          completeSession();
          return;
        }
      }
      
      setPhase(nextPhase);
      setTimeLeft(selectedPattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, cycleCount, selectedPattern]);

  const completeSession = () => {
    setIsActive(false);
    const newSessions = totalSessions + 1;
    setTotalSessions(newSessions);
    localStorage.setItem('breathingSessions', newSessions.toString());
    toast({ title: "Session Complete! 🔥", description: `HRV: ${Math.round(hrvLevel)}%` });
  };

  const startPause = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    setTimeLeft(selectedPattern.inhale);
    setHrvLevel(40);
  };

  const selectPattern = (pattern: typeof patterns[0]) => {
    setSelectedPattern(pattern);
    reset();
    setTimeLeft(pattern.inhale);
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return 'text-cyan-400';
      case 'hold': return 'text-amber-400';
      case 'exhale': return 'text-orange-400';
      case 'pause': return 'text-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-orange-950 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(249,115,22,${isActive ? 0.3 : 0.1}) 0%, transparent 70%)`,
          }}
          animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
          transition={{ duration: selectedPattern.inhale + selectedPattern.exhale, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h1 className="text-xl font-bold text-orange-100">Phoenix Breath</h1>
            </div>
            <EvidenceBadge level="A" domain="HRV" pubmedId="37138494" />
          </div>
          <div className="w-10" />
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{totalSessions}</div>
            <div className="text-orange-300/60">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{Math.round(hrvLevel)}%</div>
            <div className="text-pink-300/60">HRV</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{cycleCount}/{selectedPattern.cycles}</div>
            <div className="text-cyan-300/60">Cycles</div>
          </div>
        </div>

        {/* Main breathing sphere */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <BreathingSphere3D phase={phase} isActive={isActive} size="lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-white">{timeLeft}</div>
              <div className={cn("text-lg uppercase tracking-widest", getPhaseColor())}>
                {phase}
              </div>
            </div>
          </div>
        </div>

        {/* Quanta prompt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-6"
          >
            <p className="text-orange-200/80 italic text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {phaseQuanta[phase]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={startPause}
            size="lg"
            className="w-32 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400"
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button
            onClick={reset}
            size="lg"
            variant="outline"
            className="border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Pattern selection */}
        {!isActive && cycleCount === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {patterns.map((pattern) => (
              <Card
                key={pattern.name}
                className={cn(
                  "cursor-pointer transition-all border-orange-500/20 bg-slate-900/80 hover:bg-slate-800/80",
                  selectedPattern.name === pattern.name && "ring-2 ring-orange-500"
                )}
                onClick={() => selectPattern(pattern)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-orange-100">{pattern.name}</div>
                  <div className="text-xs text-orange-300/60">
                    {pattern.inhale}-{pattern.hold}-{pattern.exhale}-{pattern.pause}
                  </div>
                  <div className="text-xs text-orange-400/80 mt-1">{pattern.cycles} cycles</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
