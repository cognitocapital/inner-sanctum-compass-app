import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Snowflake, Sparkles, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import IceCavernBackground from "@/components/ice/IceCavernBackground";
import { cn } from "@/lib/utils";

// Focused manuscript quanta per phase
const phaseQuanta = {
  prepare: "The cold shock mirrors the accident's edge—face it, don't flee.",
  enter: "Finding stillness in the storm of sensation.",
  endure: "The vertigo slowly subsides... learning to trust the process.",
  exit: "You emerged stronger. Like the phoenix, you transform through challenge.",
};

// Simple duration options
const durations = [30, 60, 90, 120];

const ColdExposure = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [phase, setPhase] = useState<'prepare' | 'enter' | 'endure' | 'exit'>('prepare');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [showMoodReport, setShowMoodReport] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const savedStreak = localStorage.getItem('frostForgeStreak');
    const savedBest = localStorage.getItem('frostForgeBest');
    const savedSessions = localStorage.getItem('frostForgeSessions');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
    if (savedSessions) setCompletedSessions(parseInt(savedSessions));
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Phase transitions
        const progress = 1 - (timeLeft / selectedDuration);
        if (progress > 0.1 && phase === 'prepare') setPhase('enter');
        if (progress > 0.2 && phase === 'enter') setPhase('endure');
        if (timeLeft <= 5 && phase === 'endure') setPhase('exit');
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, selectedDuration]);

  const completeSession = () => {
    setIsActive(false);
    setPhase('exit');
    setShowMoodReport(true);
    
    const newSessions = completedSessions + 1;
    const newStreak = streak + 1;
    
    setCompletedSessions(newSessions);
    setStreak(newStreak);
    
    if (selectedDuration > personalBest) {
      setPersonalBest(selectedDuration);
      localStorage.setItem('frostForgeBest', selectedDuration.toString());
    }
    
    localStorage.setItem('frostForgeStreak', newStreak.toString());
    localStorage.setItem('frostForgeSessions', newSessions.toString());
  };

  const handleMoodReport = (mood: number) => {
    setShowMoodReport(false);
    toast({ title: "Session Complete! ❄️", description: `Mood: ${mood}/5 - Well done!` });
  };

  const startSession = () => {
    setTimeLeft(selectedDuration);
    setPhase('prepare');
    setIsActive(true);
  };

  const toggleSession = () => {
    if (!isActive && timeLeft === 0) {
      startSession();
    } else {
      setIsActive(!isActive);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setPhase('prepare');
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
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <IceCavernBackground 
        intensity={isActive ? 100 - (timeLeft / selectedDuration * 100) : 20} 
        isActive={isActive} 
        phase={phase} 
      />

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Snowflake className="h-6 w-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">Frost Forge</h1>
            </div>
            <EvidenceBadge level="C" domain="Resilience" pubmedId="36594858" />
          </div>
          <div className="w-10" />
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-8 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{streak}</div>
            <div className="text-cyan-300/60">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{completedSessions}</div>
            <div className="text-blue-300/60">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">{formatTime(personalBest)}</div>
            <div className="text-teal-300/60">Best</div>
          </div>
        </div>

        {/* Main timer */}
        <div className="flex flex-col items-center mb-6">
          <motion.div 
            className="relative w-56 h-56 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(from 0deg, 
                rgba(6, 182, 212, 0.8) ${(1 - timeLeft / selectedDuration) * 100}%, 
                rgba(30, 41, 59, 0.3) ${(1 - timeLeft / selectedDuration) * 100}%)`,
              boxShadow: isActive ? '0 0 60px rgba(6, 182, 212, 0.5)' : '0 0 20px rgba(6, 182, 212, 0.2)'
            }}
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <div className="bg-slate-900/90 rounded-full w-44 h-44 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-cyan-100">
                {formatTime(timeLeft || selectedDuration)}
              </div>
              <div className={cn("text-sm uppercase tracking-wide", getPhaseColor())}>
                {phase}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quanta prompt */}
        <AnimatePresence mode="wait">
          {(phase === 'endure' || phase === 'exit') && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-6 px-4"
            >
              <p className="text-cyan-200/80 italic text-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {phaseQuanta[phase]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={toggleSession}
            size="lg"
            className="w-32 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button
            onClick={resetSession}
            size="lg"
            variant="outline"
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Duration selection */}
        {!isActive && timeLeft === selectedDuration && (
          <div className="grid grid-cols-4 gap-2">
            {durations.map((d) => (
              <Button
                key={d}
                variant={selectedDuration === d ? "default" : "outline"}
                className={cn(
                  "text-sm",
                  selectedDuration === d 
                    ? "bg-cyan-500 hover:bg-cyan-400" 
                    : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                )}
                onClick={() => {
                  setSelectedDuration(d);
                  setTimeLeft(d);
                }}
              >
                {formatTime(d)}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Mood report modal */}
      <AnimatePresence>
        {showMoodReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <Card className="bg-slate-900 border-cyan-500/30 max-w-sm w-full">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Session Complete!</h3>
                <p className="text-cyan-200/80 mb-6">How do you feel?</p>
                <div className="flex justify-center gap-3">
                  {["😔", "😐", "🙂", "😊", "🔥"].map((emoji, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="lg"
                      className="text-2xl border-cyan-500/30 hover:bg-cyan-500/20"
                      onClick={() => handleMoodReport(i + 1)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColdExposure;
