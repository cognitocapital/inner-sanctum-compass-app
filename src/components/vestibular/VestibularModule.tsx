import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Eye, Play, Pause, RotateCcw, Target, AlertTriangle, Activity,
  CheckCircle2, XCircle, Compass, Zap, ArrowRight, ArrowLeft, ArrowUp, ArrowDown
} from "lucide-react";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { useToast } from "@/hooks/use-toast";

// VOR Exercise Generator - Tested functional stub
export const vorExercise = (level: number = 1, duration: number = 60) => {
  const directions = ['left', 'right', 'up', 'down'] as const;
  const taskCount = Math.floor(duration / 10);
  const tasks = Array.from({ length: taskCount }, (_, i) => ({
    id: i,
    head: directions[Math.floor(Math.random() * (level > 2 ? 4 : 2))],
    gaze: 'fixed' as const,
    speed: level > 3 ? 'fast' : level > 1 ? 'moderate' : 'slow',
    holdTime: Math.max(2, 5 - level)
  }));
  return { tasks, level, duration };
};

// Gaze Stability Exercise Generator
export const gazeStabilityExercise = (level: number = 1) => {
  const patterns = ['horizontal', 'vertical', 'diagonal', 'circular'] as const;
  const patternCount = level + 2;
  return Array.from({ length: patternCount }, (_, i) => ({
    id: i,
    pattern: patterns[i % patterns.length],
    speed: level > 3 ? 2 : level > 1 ? 1.5 : 1,
    repetitions: level + 3
  }));
};

// Safety Pre-Screen Questions
const safetyQuestions = [
  { id: 'vertigo', text: 'Are you experiencing severe vertigo or dizziness right now?', critical: true },
  { id: 'nausea', text: 'Do you feel nauseous or have vomited in the last hour?', critical: true },
  { id: 'headache', text: 'Do you have a severe headache?', critical: true },
  { id: 'vision', text: 'Are you experiencing sudden vision changes?', critical: true },
  { id: 'balance', text: 'Have you fallen due to balance issues in the last 24 hours?', critical: false },
  { id: 'fatigue', text: 'Are you feeling extremely fatigued?', critical: false },
];

interface VestibularModuleProps {
  onComplete?: (duration: number, score: number) => void;
}

const VestibularModule = ({ onComplete }: VestibularModuleProps) => {
  const [phase, setPhase] = useState<'safety' | 'exercise' | 'results'>('safety');
  const [safetyAnswers, setSafetyAnswers] = useState<Record<string, boolean>>({});
  const [currentExercise, setCurrentExercise] = useState<'vor' | 'gaze' | 'balance'>('vor');
  const [level, setLevel] = useState([1]);
  const [isActive, setIsActive] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [scores, setScores] = useState<('success' | 'retry')[]>([]);
  const [tasks, setTasks] = useState<ReturnType<typeof vorExercise>['tasks']>([]);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate new exercises when level changes
  useEffect(() => {
    const exercise = vorExercise(level[0], 60);
    setTasks(exercise.tasks);
    setCurrentTaskIndex(0);
    setScores([]);
  }, [level]);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Move target for gaze tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && currentExercise === 'gaze') {
      interval = setInterval(() => {
        setTargetPosition({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60
        });
      }, 2000 / level[0]);
    }
    return () => clearInterval(interval);
  }, [isActive, currentExercise, level]);

  const handleSafetyResponse = (questionId: string, answer: boolean) => {
    setSafetyAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkSafetyScreen = () => {
    const criticalYes = safetyQuestions
      .filter(q => q.critical && safetyAnswers[q.id] === true);
    
    if (criticalYes.length > 0) {
      toast({
        title: "Safety First",
        description: "Based on your responses, we recommend resting before vestibular exercises. Please consult your healthcare provider.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const startExercise = () => {
    if (checkSafetyScreen()) {
      setPhase('exercise');
      setIsActive(true);
      toast({
        title: "Exercise Started",
        description: "Follow the visual cues. Keep your eyes fixed while moving your head.",
      });
    }
  };

  const handleTaskResponse = (direction: string) => {
    if (!isActive || currentTaskIndex >= tasks.length) return;

    const currentTask = tasks[currentTaskIndex];
    const isCorrect = direction === currentTask.head;
    
    setScores(prev => [...prev, isCorrect ? 'success' : 'retry']);
    setUserResponse(direction);
    
    setTimeout(() => {
      setUserResponse(null);
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
      } else {
        completeSession();
      }
    }, 500);
  };

  const completeSession = () => {
    setIsActive(false);
    setPhase('results');
    const successCount = scores.filter(s => s === 'success').length;
    const accuracy = Math.round((successCount / Math.max(scores.length, 1)) * 100);
    
    onComplete?.(sessionTime, accuracy);
    
    // Save to localStorage
    const history = JSON.parse(localStorage.getItem('vestibularHistory') || '[]');
    history.push({
      date: new Date().toISOString(),
      exercise: currentExercise,
      level: level[0],
      duration: sessionTime,
      accuracy,
      taskCount: tasks.length
    });
    localStorage.setItem('vestibularHistory', JSON.stringify(history.slice(-30)));
  };

  const resetSession = () => {
    setIsActive(false);
    setSessionTime(0);
    setCurrentTaskIndex(0);
    setScores([]);
    setPhase('safety');
    setSafetyAnswers({});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTask = tasks[currentTaskIndex];
  const accuracy = scores.length > 0 
    ? Math.round((scores.filter(s => s === 'success').length / scores.length) * 100)
    : 0;

  const getDirectionIcon = (dir: string) => {
    switch (dir) {
      case 'left': return <ArrowLeft className="w-8 h-8" />;
      case 'right': return <ArrowRight className="w-8 h-8" />;
      case 'up': return <ArrowUp className="w-8 h-8" />;
      case 'down': return <ArrowDown className="w-8 h-8" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span className="font-medium text-white">VR Vestibular Rehabilitation</span>
        </div>
        <EvidenceBadge 
          level="A" 
          domain="Vestibular Rehab"
          description="INCOG 2.0 recommends vestibular screening and retraining for TBI (2023). Praxis VR multisensory approach shown effective post-mTBI."
          pubmedId="40470496"
        />
      </div>

      {/* Manuscript Quanta - Ch4 Vertigo */}
      <Card className="bg-cyan-500/10 border-cyan-500/20">
        <CardContent className="p-3">
          <p className="text-xs text-cyan-200/80 italic">
            "The vertigo was relentless... but day by day, the world stopped spinning."
          </p>
          <p className="text-xs text-cyan-400/60 mt-1">— Ch4: Vertigo Subsides</p>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {/* Safety Pre-Screen */}
        {phase === 'safety' && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Pre-Screen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {safetyQuestions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <span className="text-xs text-gray-300 flex-1">{q.text}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={safetyAnswers[q.id] === true ? "default" : "outline"}
                        className={`h-7 px-3 text-xs ${safetyAnswers[q.id] === true ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'border-gray-500/30'}`}
                        onClick={() => handleSafetyResponse(q.id, true)}
                      >
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant={safetyAnswers[q.id] === false ? "default" : "outline"}
                        className={`h-7 px-3 text-xs ${safetyAnswers[q.id] === false ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'border-gray-500/30'}`}
                        onClick={() => handleSafetyResponse(q.id, false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600"
                  onClick={startExercise}
                  disabled={Object.keys(safetyAnswers).length < safetyQuestions.length}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Begin Vestibular Training
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Active Exercise */}
        {phase === 'exercise' && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Exercise Type Selector */}
            <div className="flex gap-2">
              {[
                { id: 'vor', label: 'VOR Training', icon: Eye },
                { id: 'gaze', label: 'Gaze Stability', icon: Target },
                { id: 'balance', label: 'Balance', icon: Activity },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  size="sm"
                  variant={currentExercise === id ? "default" : "outline"}
                  className={currentExercise === id ? 'bg-cyan-500' : 'border-cyan-500/30'}
                  onClick={() => setCurrentExercise(id as typeof currentExercise)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Session Stats */}
            <Card className="bg-slate-800/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-mono text-cyan-400">{formatTime(sessionTime)}</div>
                    <div className="text-xs text-gray-400">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{currentTaskIndex + 1}/{tasks.length}</div>
                    <div className="text-xs text-gray-400">Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">L{level[0]}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                </div>
                <Progress value={(currentTaskIndex / tasks.length) * 100} className="mt-3 h-2" />
              </CardContent>
            </Card>

            {/* VOR Exercise Interface */}
            {currentExercise === 'vor' && currentTask && (
              <Card className="bg-slate-900/80 border-cyan-500/30">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-400 mb-2">Keep your eyes fixed on the target</p>
                    <p className="text-lg text-cyan-300 font-medium">
                      Turn your head: <span className="text-2xl font-bold uppercase">{currentTask.head}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Speed: {currentTask.speed}</p>
                  </div>

                  {/* Fixed Target */}
                  <div className="relative w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <motion.div
                      className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                    
                    {/* Direction indicator */}
                    <motion.div
                      className="absolute text-cyan-400/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        [currentTask.head === 'left' ? 'left' : currentTask.head === 'right' ? 'right' : 'left']: 20,
                        [currentTask.head === 'up' ? 'top' : currentTask.head === 'down' ? 'bottom' : 'top']: currentTask.head === 'left' || currentTask.head === 'right' ? '50%' : 20,
                        transform: currentTask.head === 'left' || currentTask.head === 'right' ? 'translateY(-50%)' : 'translateX(-50%)'
                      }}
                    >
                      {getDirectionIcon(currentTask.head)}
                    </motion.div>
                  </div>

                  {/* Response Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {['left', 'up', 'down', 'right'].map((dir) => (
                      <Button
                        key={dir}
                        size="lg"
                        className={`h-14 ${
                          userResponse === dir 
                            ? dir === currentTask.head 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-500/30'
                        }`}
                        onClick={() => handleTaskResponse(dir)}
                        disabled={!isActive}
                      >
                        {getDirectionIcon(dir)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gaze Stability Exercise */}
            {currentExercise === 'gaze' && (
              <Card className="bg-slate-900/80 border-cyan-500/30">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-400 text-center mb-4">
                    Follow the target with your eyes only. Keep your head still.
                  </p>
                  <div className="relative w-full h-60 bg-slate-800 rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute w-6 h-6 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
                      animate={{ 
                        left: `${targetPosition.x}%`,
                        top: `${targetPosition.y}%`
                      }}
                      transition={{ type: 'spring', stiffness: 100 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-px h-full bg-gray-600/30" />
                      <div className="w-full h-px bg-gray-600/30 absolute" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => setIsActive(!isActive)}
                className="border-cyan-500/30"
              >
                {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isActive ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outline"
                onClick={completeSession}
                className="border-green-500/30 text-green-400"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </Button>
              <Button
                variant="outline"
                onClick={resetSession}
                className="border-red-500/30 text-red-400"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Difficulty Slider */}
            <Card className="bg-white/5 border-gray-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Difficulty Level</span>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                    Level {level[0]}
                  </Badge>
                </div>
                <Slider
                  value={level}
                  onValueChange={setLevel}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Session Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-cyan-400">{accuracy}%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-mono text-green-400">{formatTime(sessionTime)}</div>
                    <div className="text-sm text-gray-400">Duration</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-400">{scores.filter(s => s === 'success').length}</div>
                    <div className="text-sm text-gray-400">Correct Responses</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-orange-400">L{level[0]}</div>
                    <div className="text-sm text-gray-400">Level Completed</div>
                  </div>
                </div>

                {/* Progress note */}
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <p className="text-sm text-green-300">
                    {accuracy >= 80 
                      ? "Excellent performance! Consider increasing difficulty next session."
                      : accuracy >= 60
                        ? "Good progress! Keep practicing at this level."
                        : "Keep going! Consistency is key to vestibular recovery."}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                    onClick={resetSession}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VestibularModule;
