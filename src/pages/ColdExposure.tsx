import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Snowflake, Droplets, Bath, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PhoenixBackground } from "@/components/ui/phoenix-background";
import { GlassCard } from "@/components/ui/glass-card";
import { ModuleHeader } from "@/components/ui/module-header";
import { QuantaPrompt, getRandomQuanta } from "@/components/ui/quanta-prompt";
import { SessionStats } from "@/components/ui/session-stats";
import { cn } from "@/lib/utils";

// Cold exposure methods
const methods = [
  { id: "shower", name: "Cold Shower", icon: Droplets, durations: [30, 60, 90] },
  { id: "bath", name: "Ice Bath", icon: Bath, durations: [60, 120, 180] },
  { id: "face", name: "Face Immersion", icon: Waves, durations: [15, 30, 45] },
];

// Phase prompts
const phasePrompts = {
  prepare: "Prepare your mind. The cold awaits.",
  enter: "Enter the cold. Embrace the challenge.",
  endure: "You're doing it. Stay present.",
  exit: "You emerged stronger. Like the phoenix."
};

const ColdExposure = () => {
  const [selectedMethod, setSelectedMethod] = useState(methods[0]);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<'prepare' | 'enter' | 'endure' | 'exit'>('prepare');
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [quanta] = useState(() => getRandomQuanta('ice'));

  // Load saved data
  useEffect(() => {
    const savedSessions = localStorage.getItem('frostForgeSessions');
    const savedTotal = localStorage.getItem('frostForgeTotal');
    const savedStreak = localStorage.getItem('frostForgeStreak');
    const savedXp = localStorage.getItem('frostForgeXp');
    
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
    if (savedTotal) setTotalTime(parseInt(savedTotal));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXp) setXp(parseInt(savedXp));
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Phase transitions
        const progress = 1 - (timeLeft / selectedDuration);
        if (progress < 0.1) setPhase('prepare');
        else if (progress < 0.3) setPhase('enter');
        else if (progress < 0.9) setPhase('endure');
        else setPhase('exit');
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, selectedDuration]);

  const completeSession = () => {
    setIsActive(false);
    setShowMoodPicker(true);
  };

  const handleMoodSelect = (mood: number) => {
    setShowMoodPicker(false);
    
    const earnedXp = 25 + Math.floor(selectedDuration / 10);
    const newSessions = totalSessions + 1;
    const newTotal = totalTime + selectedDuration;
    const newStreak = streak + 1;
    const newXp = xp + earnedXp;
    
    setTotalSessions(newSessions);
    setTotalTime(newTotal);
    setStreak(newStreak);
    setXp(newXp);
    
    localStorage.setItem('frostForgeSessions', newSessions.toString());
    localStorage.setItem('frostForgeTotal', newTotal.toString());
    localStorage.setItem('frostForgeStreak', newStreak.toString());
    localStorage.setItem('frostForgeXp', newXp.toString());
    
    toast({ 
      title: "Frost Forge Complete! ❄️", 
      description: `+${earnedXp} XP earned. You're building resilience.`
    });
    
    reset();
  };

  const startSession = () => {
    setTimeLeft(selectedDuration);
    setPhase('prepare');
    setIsActive(true);
  };

  const toggleSession = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setPhase('prepare');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / selectedDuration);

  return (
    <PhoenixBackground module="ice" showEmbers={!isActive} intensity={isActive ? "intense" : "normal"}>
      <div className="min-h-screen pb-8">
        <ModuleHeader 
          module="ice"
          title="Frost Forge"
          subtitle="Cold exposure for resilience"
          evidenceLevel="Research"
          xp={xp}
          streak={streak}
        />

        <div className="px-4 max-w-lg mx-auto space-y-6">
          {/* Stats */}
          <SessionStats 
            module="ice"
            stats={[
              { label: "Sessions", value: totalSessions },
              { label: "Total Minutes", value: Math.floor(totalTime / 60) },
              { label: "Streak", value: streak },
            ]}
          />

          {/* Main Timer */}
          <GlassCard module="ice" glow={isActive} className="p-6">
            <div className="flex flex-col items-center">
              {/* Timer Circle */}
              <div className="relative w-56 h-56 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke="url(#iceGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={628}
                    initial={{ strokeDashoffset: 628 }}
                    animate={{ strokeDashoffset: 628 * (1 - progress) }}
                    transition={{ duration: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="iceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Timer text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div 
                    className="text-5xl font-bold text-cyan-100"
                    key={timeLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  <div className="text-cyan-300/80 text-sm font-medium uppercase tracking-wider mt-1">
                    {phasePrompts[phase]}
                  </div>
                </div>
                
                {/* Pulsing ring when active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-3 mb-4">
                <Button 
                  onClick={isActive ? toggleSession : startSession}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8"
                >
                  {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  size="lg"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Method & Duration Selection */}
          {!isActive && (
            <div className="space-y-4">
              {/* Method */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-cyan-200 flex items-center gap-2">
                  <Snowflake className="w-4 h-4" />
                  Method
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {methods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <GlassCard
                        key={method.id}
                        module="ice"
                        hover
                        className={cn(
                          "p-3 cursor-pointer transition-all text-center",
                          selectedMethod.id === method.id && "ring-2 ring-cyan-500"
                        )}
                        onClick={() => {
                          setSelectedMethod(method);
                          setSelectedDuration(method.durations[1]);
                          setTimeLeft(method.durations[1]);
                        }}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                        <div className="text-xs text-cyan-100">{method.name}</div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-cyan-200">Duration</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedMethod.durations.map((duration) => (
                    <GlassCard
                      key={duration}
                      module="ice"
                      hover
                      className={cn(
                        "p-3 cursor-pointer transition-all text-center",
                        selectedDuration === duration && "ring-2 ring-cyan-500"
                      )}
                      onClick={() => {
                        setSelectedDuration(duration);
                        setTimeLeft(duration);
                      }}
                    >
                      <div className="text-lg font-semibold text-cyan-100">{formatTime(duration)}</div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quanta Prompt */}
          <QuantaPrompt 
            quote={quanta.quote}
            chapter={quanta.chapter}
            reflection={quanta.reflection}
            module="ice"
          />

          {/* Mood Picker Modal */}
          <AnimatePresence>
            {showMoodPicker && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <GlassCard module="ice" glow className="p-6 max-w-sm mx-4 text-center">
                  <h2 className="text-xl font-bold text-cyan-100 mb-2">How do you feel?</h2>
                  <p className="text-cyan-300/70 text-sm mb-4">Rate your post-session mood</p>
                  <div className="flex justify-center gap-3">
                    {["😔", "😐", "🙂", "😊", "🔥"].map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => handleMoodSelect(i + 1)}
                        className="text-3xl hover:scale-125 transition-transform p-2"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PhoenixBackground>
  );
};

export default ColdExposure;
