import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Trophy, RotateCcw, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface NBackGameProps {
  onComplete: (score: number, accuracy: number) => void;
  difficulty?: 1 | 2 | 3;
  className?: string;
}

const STIMULI = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const GRID_POSITIONS = Array.from({ length: 9 }, (_, i) => i);

export const NBackGame = ({ onComplete, difficulty = 1, className }: NBackGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStimulus, setCurrentStimulus] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [stimulusHistory, setStimulusHistory] = useState<string[]>([]);
  const [positionHistory, setPositionHistory] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [totalTrials, setTotalTrials] = useState(0);
  const [correctResponses, setCorrectResponses] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showStimulus, setShowStimulus] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const nBack = difficulty;
  const totalRounds = 20 + (difficulty * 5);
  const stimulusDuration = 2000 - (difficulty * 200);
  const interStimulusInterval = 1000;

  const getRandomStimulus = () => STIMULI[Math.floor(Math.random() * STIMULI.length)];
  const getRandomPosition = () => GRID_POSITIONS[Math.floor(Math.random() * 9)];

  const checkMatch = useCallback((isAudioMatch: boolean, isPositionMatch: boolean) => {
    if (round < nBack) return;
    
    const actualAudioMatch = stimulusHistory[round - nBack] === currentStimulus;
    const actualPositionMatch = positionHistory[round - nBack] === currentPosition;
    
    let correct = false;
    if (isAudioMatch && actualAudioMatch) correct = true;
    if (isPositionMatch && actualPositionMatch) correct = true;
    if (!isAudioMatch && !isPositionMatch && !actualAudioMatch && !actualPositionMatch) correct = true;
    
    setTotalTrials(prev => prev + 1);
    if (correct) {
      setCorrectResponses(prev => prev + 1);
      setScore(prev => prev + 10 * difficulty);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    
    setTimeout(() => setFeedback(null), 500);
  }, [round, nBack, stimulusHistory, positionHistory, currentStimulus, currentPosition, difficulty]);

  const nextTrial = useCallback(() => {
    if (round >= totalRounds) {
      setIsPlaying(false);
      setGameComplete(true);
      const accuracy = totalTrials > 0 ? (correctResponses / totalTrials) * 100 : 0;
      onComplete(score, accuracy);
      return;
    }

    const newStimulus = getRandomStimulus();
    const newPosition = getRandomPosition();
    
    const shouldMatchAudio = Math.random() < 0.3 && round >= nBack;
    const shouldMatchPosition = Math.random() < 0.3 && round >= nBack;
    
    const finalStimulus = shouldMatchAudio && stimulusHistory[round - nBack] 
      ? stimulusHistory[round - nBack] 
      : newStimulus;
    const finalPosition = shouldMatchPosition && positionHistory[round - nBack] !== undefined
      ? positionHistory[round - nBack]
      : newPosition;

    setCurrentStimulus(finalStimulus);
    setCurrentPosition(finalPosition);
    setStimulusHistory(prev => [...prev, finalStimulus]);
    setPositionHistory(prev => [...prev, finalPosition]);
    setShowStimulus(true);

    setTimeout(() => {
      setShowStimulus(false);
    }, stimulusDuration);

    setRound(prev => prev + 1);
  }, [round, totalRounds, nBack, stimulusHistory, positionHistory, score, correctResponses, totalTrials, onComplete, stimulusDuration]);

  useEffect(() => {
    if (!isPlaying || gameComplete) return;

    const timer = setTimeout(() => {
      nextTrial();
    }, stimulusDuration + interStimulusInterval);

    return () => clearTimeout(timer);
  }, [isPlaying, gameComplete, round, nextTrial, stimulusDuration]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTotalTrials(0);
    setCorrectResponses(0);
    setRound(0);
    setStimulusHistory([]);
    setPositionHistory([]);
    setGameComplete(false);
    nextTrial();
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setTotalTrials(0);
    setCorrectResponses(0);
    setRound(0);
    setStimulusHistory([]);
    setPositionHistory([]);
    setGameComplete(false);
    setCurrentStimulus(null);
    setCurrentPosition(null);
  };

  return (
    <div className={cn("rounded-2xl academy-glass-strong p-6 space-y-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15">
            <Brain className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-200">{nBack}-Back Challenge</h3>
            <p className="text-xs text-white/35">Ch7 "goldfish capacity" training</p>
          </div>
        </div>
        <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {difficulty === 1 ? "Level 1" : difficulty === 2 ? "Level 2" : "Level 3"}
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="text-white/60">Score: {score}</span>
        </div>
        <span className="text-white/35">Round {round}/{totalRounds}</span>
      </div>
      
      <Progress 
        value={(round / totalRounds) * 100} 
        className="h-1.5 bg-white/5"
      />

      {/* Game Grid */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-2 aspect-square max-w-[240px] mx-auto">
          {GRID_POSITIONS.map((pos) => (
            <motion.div
              key={pos}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all",
                showStimulus && currentPosition === pos
                  ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                  : "academy-neomorphic text-transparent"
              )}
              animate={showStimulus && currentPosition === pos ? {
                scale: [1, 1.08, 1],
              } : {}}
              transition={{ duration: 0.2 }}
            >
              {showStimulus && currentPosition === pos && currentStimulus}
            </motion.div>
          ))}
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "absolute inset-0 flex items-center justify-center rounded-2xl",
                feedback === 'correct' ? "bg-emerald-500/20" : "bg-red-500/20"
              )}
            >
              <span className={cn(
                "text-5xl font-bold",
                feedback === 'correct' ? "text-emerald-400" : "text-red-400"
              )}>
                {feedback === 'correct' ? '✓' : '✗'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Response Buttons */}
      {isPlaying && round >= nBack && (
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => checkMatch(true, false)}
            className="rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 min-h-[48px]"
            disabled={!showStimulus}
          >
            <Zap className="h-4 w-4 mr-2" />
            Letter Match
          </Button>
          <Button
            onClick={() => checkMatch(false, true)}
            className="rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 min-h-[48px]"
            disabled={!showStimulus}
          >
            <Brain className="h-4 w-4 mr-2" />
            Position Match
          </Button>
        </div>
      )}

      {/* Game Complete */}
      {gameComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 py-4"
        >
          {/* Ember rise particles on completion */}
          <div className="relative inline-block">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
                style={{ left: `${20 + i * 15}%`, bottom: 0 }}
                animate={{ y: [-10, -60], opacity: [1, 0], scale: [1, 0.3] }}
                transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
              />
            ))}
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto" />
          </div>
          <div className="text-xl font-bold text-amber-200">Session Complete!</div>
          <div className="text-white/60">
            Accuracy: {totalTrials > 0 ? ((correctResponses / totalTrials) * 100).toFixed(0) : 0}%
          </div>
          <p className="text-white/30 text-sm italic">
            "Like my Ch7 goldfish brain, each rep builds capacity"
          </p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isPlaying ? (
          <Button
            onClick={startGame}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/20 min-h-[48px] px-6"
          >
            <Play className="h-4 w-4 mr-2" />
            {gameComplete ? "Play Again" : "Start"}
          </Button>
        ) : (
          <Button
            onClick={() => setIsPlaying(false)}
            className="rounded-xl academy-glass border-amber-500/30 text-amber-300 hover:bg-white/10 min-h-[48px]"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        <Button
          onClick={resetGame}
          variant="ghost"
          className="text-white/30 hover:text-amber-300 min-h-[48px]"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default NBackGame;
