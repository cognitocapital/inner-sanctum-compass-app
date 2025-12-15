import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, Zap, Target, MessageCircle, Play, Pause, 
  RotateCcw, CheckCircle, Clock, Sparkles, Volume2,
  ArrowRight, Star, ListChecks, MessageSquare, Users
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
      description: "Adaptive working memory and attention training with visual-audio matching",
      incogLevel: "A",
      duration: 180,
      manuscriptRef: "Ch7 \"misfiring\" - training those neurons to fire correctly"
    },
    {
      id: "rhythm",
      name: "Rhythm Matching",
      description: "Music-synced processing speed with binaural entrainment",
      incogLevel: "A",
      duration: 120
    },
    {
      id: "pacing",
      name: "Metacognitive Pacing",
      description: "Chunk tasks with 5-minute focused intervals, errorless cues",
      incogLevel: "B",
      duration: 300
    }
  ],
  memory: [
    {
      id: "errorless",
      name: "Errorless Learning",
      description: "Step-by-step ADL recall without guessing - proven approach",
      incogLevel: "A",
      duration: 180,
      manuscriptRef: "Ch2 \"PTA gaps\" - building bridges over the fog"
    },
    {
      id: "spaced",
      name: "Spaced Repetition",
      description: "SM-2 algorithm flashcards with optimal review intervals",
      incogLevel: "A",
      duration: 240
    },
    {
      id: "visualization",
      name: "PQRST Method",
      description: "Preview, Question, Read, Self-recite, Test - complete reading strategy",
      incogLevel: "B",
      duration: 300
    }
  ],
  executive: [
    {
      id: "gmt",
      name: "Goal Management Training",
      description: "Plan-Do-Check-Review cycle with structured prompts",
      incogLevel: "A",
      duration: 300,
      manuscriptRef: "Ch3 \"rollercoaster\" - finding calm in the planning storm"
    },
    {
      id: "switching",
      name: "Task Switching",
      description: "Cognitive flexibility training with inhibition challenges",
      incogLevel: "B",
      duration: 180
    },
    {
      id: "selfmon",
      name: "Self-Monitoring",
      description: "Metacognitive checklists and daily reflection logs",
      incogLevel: "A",
      duration: 120
    }
  ],
  communication: [
    {
      id: "pragmatics",
      name: "Pragmatics Simulation",
      description: "Role-play conversation scenarios with social scripts",
      incogLevel: "B",
      duration: 240,
      manuscriptRef: "Intro \"community\" - reconnecting through words"
    },
    {
      id: "tom",
      name: "Theory of Mind",
      description: "Emotion reading from faces and social inference training",
      incogLevel: "B",
      duration: 180
    },
    {
      id: "telerehab",
      name: "Group Telerehab Links",
      description: "Connect to video-based social cognition group practice",
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

// ============ FULLY FUNCTIONAL N-BACK GAME ============
const generateNBackSequence = (level: number, length: number): { 
  sequence: string[]; 
  targets: boolean[] 
} => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const sequence: string[] = [];
  const targets: boolean[] = [];
  
  for (let i = 0; i < length; i++) {
    // 30% chance of match after n-back point
    const shouldMatch = i >= level && Math.random() < 0.3;
    
    if (shouldMatch) {
      sequence.push(sequence[i - level]);
    } else {
      let newLetter;
      do {
        newLetter = letters[Math.floor(Math.random() * letters.length)];
      } while (i >= level && newLetter === sequence[i - level]);
      sequence.push(newLetter);
    }
    
    targets.push(i >= level && sequence[i] === sequence[i - level]);
  }
  
  return { sequence, targets };
};

const NBackGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [gameData, setGameData] = useState<ReturnType<typeof generateNBackSequence> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [responded, setResponded] = useState(false);
  const nBack = 2;
  const totalRounds = 12;

  const startGame = useCallback(() => {
    const data = generateNBackSequence(nBack, totalRounds);
    setGameData(data);
    setCurrentIndex(-1);
    setScore({ correct: 0, total: 0 });
    setIsPlaying(true);
    setResponded(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || !gameData || currentIndex >= totalRounds - 1) {
      if (isPlaying && gameData && currentIndex >= totalRounds - 1) {
        setIsPlaying(false);
        const finalScore = Math.round((score.correct / Math.max(1, score.total)) * 100);
        onComplete(finalScore);
      }
      return;
    }

    const timer = setTimeout(() => {
      // Auto-mark missed matches as wrong
      if (!responded && currentIndex >= nBack && gameData.targets[currentIndex]) {
        setScore(prev => ({ ...prev, total: prev.total + 1 }));
      }
      setCurrentIndex(prev => prev + 1);
      setFeedback(null);
      setResponded(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, gameData, score, onComplete, responded]);

  const checkMatch = (userSaysMatch: boolean) => {
    if (!gameData || currentIndex < nBack || responded) return;
    
    const isActualMatch = gameData.targets[currentIndex];
    const isCorrect = userSaysMatch === isActualMatch;
    
    setResponded(true);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setFeedback(isCorrect ? 'correct' : 'wrong');
  };

  if (!isPlaying && currentIndex === -1) {
    return (
      <div className="text-center p-6 space-y-4">
        <div className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl">
          <Brain className="w-12 h-12 mx-auto text-primary mb-2" />
          <h3 className="font-bold text-lg">Dual {nBack}-Back Training</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Press "Match" when the letter matches {nBack} steps ago. Tests working memory & attention.
        </p>
        <Button onClick={startGame} className="gap-2">
          <Play className="w-4 h-4" /> Start N-Back
        </Button>
      </div>
    );
  }

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          {Math.max(0, currentIndex - nBack + 1)}/{totalRounds - nBack}
        </Badge>
        <Badge className={feedback === 'correct' ? 'bg-green-500' : feedback === 'wrong' ? 'bg-red-500' : ''}>
          {accuracy}% Accuracy
        </Badge>
      </div>

      <div className="flex justify-center">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold border-2 transition-colors
            ${feedback === 'correct' ? 'bg-green-500/30 border-green-500' : 
              feedback === 'wrong' ? 'bg-red-500/30 border-red-500' : 
              'bg-primary/20 border-primary/50'}
          `}
        >
          {gameData && currentIndex >= 0 ? gameData.sequence[currentIndex] : '?'}
        </motion.div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => checkMatch(false)}
          disabled={currentIndex < nBack || !isPlaying || responded}
        >
          No Match
        </Button>
        <Button
          onClick={() => checkMatch(true)}
          disabled={currentIndex < nBack || !isPlaying || responded}
        >
          Match!
        </Button>
      </div>

      {!isPlaying && currentIndex > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/10 rounded-xl border border-primary/30"
        >
          <Star className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="font-bold text-lg">Final Score: {accuracy}%</p>
          <Button onClick={startGame} className="mt-3 gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// ============ GMT DASHBOARD ============
const GMTDashboard = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState({ goal: '', plan: '', doing: '', check: '', review: '' });

  const steps = [
    { key: 'goal', label: 'STOP & GOAL', prompt: "What's your main goal?", icon: Target },
    { key: 'plan', label: 'PLAN', prompt: 'Break it into steps:', icon: ListChecks },
    { key: 'doing', label: 'DO', prompt: 'Execute (describe progress):', icon: Zap },
    { key: 'check', label: 'CHECK', prompt: 'Am I on track?', icon: CheckCircle },
    { key: 'review', label: 'REVIEW', prompt: 'What did I learn?', icon: Star }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const filled = Object.values(entries).filter(v => v.length > 5).length;
      onComplete(Math.round((filled / 5) * 100));
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-1">
        {steps.map((s, idx) => (
          <div
            key={s.key}
            className={`flex-1 h-2 rounded-full ${idx <= step ? 'bg-purple-500' : 'bg-muted'}`}
          />
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30"
      >
        <div className="flex items-center gap-2 mb-3">
          <CurrentIcon className="w-5 h-5 text-purple-400" />
          <span className="font-bold">{steps[step].label}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{steps[step].prompt}</p>
        <Textarea
          value={entries[steps[step].key as keyof typeof entries]}
          onChange={(e) => setEntries(prev => ({ ...prev, [steps[step].key]: e.target.value }))}
          placeholder="Type here..."
          rows={3}
        />
      </motion.div>

      <Button onClick={handleNext} className="w-full gap-2">
        {step === steps.length - 1 ? 'Complete' : 'Next'} <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

// ============ ERRORLESS LEARNING ============
const ErrorlessLearning = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([]);

  const adlSteps = [
    { step: 'Gather materials', detail: 'Collect all items needed before starting' },
    { step: 'Set up workspace', detail: 'Organize your area for the task' },
    { step: 'Begin first action', detail: 'Start with the first simple step' },
    { step: 'Check progress', detail: 'Verify you completed it correctly' },
    { step: 'Continue sequence', detail: 'Move to the next logical step' },
    { step: 'Final check', detail: 'Review the completed task' }
  ];

  const markComplete = () => {
    setCompleted(prev => [...prev, true]);
    if (step < adlSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(100); // Errorless = always success
    }
  };

  return (
    <div className="space-y-4">
      <Progress value={(completed.length / adlSteps.length) * 100} className="h-2" />
      
      <div className="space-y-2">
        {adlSteps.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-3 rounded-lg border ${
              idx < step ? 'bg-green-500/10 border-green-500/30' :
              idx === step ? 'bg-primary/10 border-primary' :
              'bg-muted/20 border-border/30 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                idx < step ? 'bg-green-500' : idx === step ? 'bg-primary' : 'bg-muted'
              }`}>
                {idx < step ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-xs text-white">{idx + 1}</span>}
              </div>
              <div>
                <p className="font-medium text-sm">{s.step}</p>
                {idx === step && <p className="text-xs text-muted-foreground">{s.detail}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {step < adlSteps.length && (
        <Button onClick={markComplete} className="w-full gap-2">
          <CheckCircle className="w-4 h-4" /> Mark Step Complete
        </Button>
      )}

      {completed.length === adlSteps.length && (
        <div className="text-center p-4 bg-green-500/10 rounded-lg">
          <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
          <p className="font-bold">Errorless Learning Complete!</p>
          <p className="text-xs text-muted-foreground">100% accuracy through guided steps</p>
        </div>
      )}
    </div>
  );
};

// ============ PRAGMATICS SIMULATION ============
const PragmaticsSim = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [scenario, setScenario] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);

  const scenarios = [
    {
      situation: "A friend seems upset but says 'I'm fine.'",
      options: [
        { text: "Accept their answer and change topic", score: 30 },
        { text: "Gently ask if they want to talk about it", score: 100 },
        { text: "Immediately share your own problems", score: 10 },
        { text: "Tell them they don't look fine", score: 40 }
      ]
    },
    {
      situation: "During a conversation, you realize you've been talking for 5 minutes straight.",
      options: [
        { text: "Continue - you have more to say", score: 10 },
        { text: "Pause and ask what they think", score: 100 },
        { text: "Apologize excessively", score: 40 },
        { text: "Abruptly stop mid-sentence", score: 20 }
      ]
    },
    {
      situation: "Someone gives you feedback you disagree with.",
      options: [
        { text: "Immediately defend yourself", score: 20 },
        { text: "Thank them and consider their perspective", score: 100 },
        { text: "Walk away silently", score: 10 },
        { text: "Argue your point aggressively", score: 5 }
      ]
    }
  ];

  const handleResponse = (score: number) => {
    setResponses(prev => [...prev, score]);
    if (scenario < scenarios.length - 1) {
      setScenario(scenario + 1);
    } else {
      const avgScore = Math.round([...responses, score].reduce((a, b) => a + b, 0) / scenarios.length);
      onComplete(avgScore);
    }
  };

  const current = scenarios[scenario];

  return (
    <div className="space-y-4">
      <Progress value={(scenario / scenarios.length) * 100} className="h-2" />
      
      <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-pink-400" />
          <span className="font-bold">Scenario {scenario + 1}</span>
        </div>
        <p className="text-sm mb-4">{current.situation}</p>
        
        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="w-full text-left justify-start h-auto py-3"
              onClick={() => handleResponse(opt.score)}
            >
              {opt.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ EMOTION READING ============
const EmotionReading = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const emotions = [
    { emoji: '😊', correct: 'happy', options: ['happy', 'sad', 'angry', 'surprised'] },
    { emoji: '😢', correct: 'sad', options: ['happy', 'sad', 'angry', 'fearful'] },
    { emoji: '😠', correct: 'angry', options: ['happy', 'sad', 'angry', 'confused'] },
    { emoji: '😨', correct: 'fearful', options: ['excited', 'sad', 'angry', 'fearful'] },
    { emoji: '😮', correct: 'surprised', options: ['happy', 'disgusted', 'angry', 'surprised'] }
  ];

  const handleGuess = (guess: string) => {
    const isCorrect = guess === emotions[round].correct;
    if (isCorrect) setScore(s => s + 1);
    
    if (round < emotions.length - 1) {
      setRound(round + 1);
    } else {
      onComplete(Math.round(((score + (isCorrect ? 1 : 0)) / emotions.length) * 100));
    }
  };

  const current = emotions[round];

  return (
    <div className="space-y-4 text-center">
      <Progress value={(round / emotions.length) * 100} className="h-2" />
      
      <motion.div
        key={round}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-8xl py-4"
      >
        {current.emoji}
      </motion.div>
      
      <p className="text-sm text-muted-foreground">What emotion is this?</p>
      
      <div className="grid grid-cols-2 gap-2">
        {current.options.map(opt => (
          <Button
            key={opt}
            variant="outline"
            onClick={() => handleGuess(opt)}
            className="capitalize"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
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
