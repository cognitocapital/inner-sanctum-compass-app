import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Zap, Target, MessageCircle, Play, Pause, 
  RotateCcw, CheckCircle, Clock, Sparkles, Volume2
} from "lucide-react";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";

interface DomainExercisesProps {
  domain: "attention" | "memory" | "executive" | "communication";
  onComplete: (score: number, xp: number) => void;
  className?: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  incogLevel: "A" | "B" | "C";
  duration: number;
  manuscriptRef?: string;
}

const domainExercises: Record<string, Exercise[]> = {
  attention: [
    {
      id: "nback",
      name: "Dual N-Back",
      description: "Adaptive working memory and attention training",
      incogLevel: "A",
      duration: 180,
      manuscriptRef: "Ch7 \"misfiring\" - training those neurons to fire correctly"
    },
    {
      id: "rhythm",
      name: "Rhythm Matching",
      description: "Music-synced processing speed exercise",
      incogLevel: "A",
      duration: 120
    },
    {
      id: "pacing",
      name: "Metacognitive Pacing",
      description: "Chunk tasks with 5-minute focused intervals",
      incogLevel: "B",
      duration: 300
    }
  ],
  memory: [
    {
      id: "errorless",
      name: "Errorless Learning",
      description: "Step-by-step ADL recall without guessing",
      incogLevel: "A",
      duration: 180,
      manuscriptRef: "Ch2 \"PTA gaps\" - building bridges over the fog"
    },
    {
      id: "spaced",
      name: "Spaced Repetition",
      description: "Custom flashcard decks with optimal intervals",
      incogLevel: "A",
      duration: 240
    },
    {
      id: "visualization",
      name: "PQRST Method",
      description: "Preview, Question, Read, Self-recite, Test",
      incogLevel: "B",
      duration: 300
    }
  ],
  executive: [
    {
      id: "gmt",
      name: "Goal Management",
      description: "Plan-Do-Check-Review cycle for daily tasks",
      incogLevel: "A",
      duration: 300,
      manuscriptRef: "Ch3 \"rollercoaster\" - finding calm in the planning storm"
    },
    {
      id: "switching",
      name: "Task Switching",
      description: "Cognitive flexibility training games",
      incogLevel: "B",
      duration: 180
    },
    {
      id: "selfmon",
      name: "Self-Monitoring",
      description: "Daily logs with metacognitive checklists",
      incogLevel: "A",
      duration: 120
    }
  ],
  communication: [
    {
      id: "pragmatics",
      name: "Pragmatics Simulation",
      description: "Scripted conversation practice scenarios",
      incogLevel: "B",
      duration: 240,
      manuscriptRef: "Intro \"community\" - reconnecting through words"
    },
    {
      id: "tom",
      name: "Theory of Mind",
      description: "Emotion reading and social inference exercises",
      incogLevel: "B",
      duration: 180
    },
    {
      id: "telerehab",
      name: "Group Telerehab",
      description: "Video-based social cognition practice",
      incogLevel: "A",
      duration: 600
    }
  ]
};

const domainColors = {
  attention: { bg: "from-red-500/20 to-orange-500/20", border: "border-red-500/30", text: "text-red-400" },
  memory: { bg: "from-green-500/20 to-emerald-500/20", border: "border-green-500/30", text: "text-green-400" },
  executive: { bg: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  communication: { bg: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30", text: "text-pink-400" }
};

const domainIcons = {
  attention: Zap,
  memory: Brain,
  executive: Target,
  communication: MessageCircle
};

// Simple N-Back Game Component
const NBackGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const nBack = 2;
  const totalRounds = 10;

  const startGame = useCallback(() => {
    const newSequence = Array.from({ length: totalRounds + nBack }, () => 
      letters[Math.floor(Math.random() * letters.length)]
    );
    // Ensure some matches
    for (let i = nBack; i < newSequence.length; i++) {
      if (Math.random() > 0.6) {
        newSequence[i] = newSequence[i - nBack];
      }
    }
    setSequence(newSequence);
    setCurrentIndex(-1);
    setScore(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying || currentIndex >= totalRounds + nBack - 1) return;
    
    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(null);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex]);

  const checkMatch = (userSaysMatch: boolean) => {
    if (currentIndex < nBack) return;
    
    const isActualMatch = sequence[currentIndex] === sequence[currentIndex - nBack];
    const isCorrect = userSaysMatch === isActualMatch;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setShowFeedback('correct');
    } else {
      setShowFeedback('wrong');
    }
    
    if (currentIndex >= totalRounds + nBack - 1) {
      setIsPlaying(false);
      onComplete(score + (isCorrect ? 10 : 0));
    }
  };

  if (!isPlaying && currentIndex === -1) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground mb-4">
          Watch for letters. Press "Match" when the current letter matches 
          the one from {nBack} steps ago.
        </p>
        <Button onClick={startGame} className="gap-2">
          <Play className="w-4 h-4" /> Start N-Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>Round: {Math.max(0, currentIndex - nBack + 1)}/{totalRounds}</span>
        <span className="text-primary">Score: {score}</span>
      </div>
      
      <div className="flex justify-center">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold
            ${showFeedback === 'correct' ? 'bg-green-500/30 border-green-500' : 
              showFeedback === 'wrong' ? 'bg-red-500/30 border-red-500' : 
              'bg-primary/20 border-primary/50'}
            border-2
          `}
        >
          {currentIndex >= 0 ? sequence[currentIndex] : '?'}
        </motion.div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => checkMatch(false)}
          disabled={currentIndex < nBack || !isPlaying}
          className="gap-2"
        >
          No Match
        </Button>
        <Button
          onClick={() => checkMatch(true)}
          disabled={currentIndex < nBack || !isPlaying}
          className="gap-2"
        >
          Match!
        </Button>
      </div>
      
      {!isPlaying && currentIndex > 0 && (
        <div className="text-center">
          <p className="text-lg font-bold text-primary mb-2">Final Score: {score}</p>
          <Button variant="outline" onClick={startGame} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

// Main Domain Exercises Component
const DomainExercises = ({ domain, onComplete, className }: DomainExercisesProps) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const exercises = domainExercises[domain];
  const colors = domainColors[domain];
  const Icon = domainIcons[domain];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExerciseComplete = (score: number) => {
    const baseXp = 50;
    const timeBonus = Math.min(sessionTime * 0.5, 50);
    const performanceBonus = score;
    const totalXp = Math.round(baseXp + timeBonus + performanceBonus);
    
    onComplete(score, totalXp);
    setIsActive(false);
    setSelectedExercise(null);
  };

  return (
    <Card className={`bg-gradient-to-br ${colors.bg} ${colors.border} ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 capitalize">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${
              domain === 'attention' ? 'from-red-500 to-orange-500' :
              domain === 'memory' ? 'from-green-500 to-emerald-500' :
              domain === 'executive' ? 'from-purple-500 to-violet-500' :
              'from-pink-500 to-rose-500'
            }`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            {domain} Exercises
          </CardTitle>
          {isActive && (
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(sessionTime)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <AnimatePresence mode="wait">
          {!selectedExercise ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {exercises.map((exercise, idx) => (
                <motion.button
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedExercise(exercise.id);
                    setSessionTime(0);
                    setIsActive(true);
                  }}
                  className="w-full text-left p-3 rounded-lg border border-border/50 
                    hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{exercise.name}</span>
                        <EvidenceBadge level={exercise.incogLevel} domain="INCOG 2.0" />
                      </div>
                      <p className="text-xs text-muted-foreground">{exercise.description}</p>
                      {exercise.manuscriptRef && (
                        <p className="text-xs text-amber-400/80 mt-1 italic">
                          📖 {exercise.manuscriptRef}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(exercise.duration / 60)}min
                    </Badge>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {selectedExercise === 'nback' && (
                <NBackGame onComplete={handleExerciseComplete} />
              )}
              
              {selectedExercise !== 'nback' && (
                <div className="text-center p-6 space-y-4">
                  <Sparkles className="w-12 h-12 mx-auto text-primary animate-pulse" />
                  <p className="text-muted-foreground">
                    {exercises.find(e => e.id === selectedExercise)?.description}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsActive(false);
                        setSelectedExercise(null);
                      }}
                      className="gap-2"
                    >
                      <Pause className="w-4 h-4" /> Exit
                    </Button>
                    <Button
                      onClick={() => handleExerciseComplete(75)}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Complete
                    </Button>
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsActive(false);
                  setSelectedExercise(null);
                }}
                className="w-full text-muted-foreground"
              >
                ← Back to exercises
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default DomainExercises;
