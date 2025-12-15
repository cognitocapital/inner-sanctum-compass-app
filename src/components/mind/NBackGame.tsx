import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    
    // 30% chance of match for audio, 30% for position
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
    <Card className={cn("bg-black/40 border-orange-600/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-100">
            <Brain className="h-5 w-5 text-orange-400" />
            {nBack}-Back Challenge
          </CardTitle>
          <Badge className="bg-orange-600/80 text-orange-100">
            {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
          </Badge>
        </div>
        <p className="text-orange-200/70 text-sm">
          Remember stimuli from {nBack} step{nBack > 1 ? 's' : ''} ago. Ch7 "goldfish capacity" training.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-orange-200">Score: {score}</span>
          </div>
          <div className="text-orange-300/70">
            Round {round}/{totalRounds}
          </div>
        </div>
        
        <Progress 
          value={(round / totalRounds) * 100} 
          className="h-2 bg-orange-900/50"
        />

        {/* Game Grid */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 aspect-square max-w-[240px] mx-auto">
            {GRID_POSITIONS.map((pos) => (
              <motion.div
                key={pos}
                className={cn(
                  "aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all",
                  showStimulus && currentPosition === pos
                    ? "bg-orange-500 border-orange-400 text-white"
                    : "bg-orange-900/30 border-orange-700/50 text-transparent"
                )}
                animate={showStimulus && currentPosition === pos ? {
                  scale: [1, 1.1, 1],
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
                  "absolute inset-0 flex items-center justify-center rounded-lg",
                  feedback === 'correct' ? "bg-green-500/30" : "bg-red-500/30"
                )}
              >
                <span className={cn(
                  "text-4xl font-bold",
                  feedback === 'correct' ? "text-green-400" : "text-red-400"
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
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
              disabled={!showStimulus}
            >
              <Zap className="h-4 w-4 mr-2" />
              Letter Match
            </Button>
            <Button
              onClick={() => checkMatch(false, true)}
              variant="outline"
              className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20"
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
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto" />
            <div className="text-xl font-bold text-orange-100">Session Complete!</div>
            <div className="text-orange-200">
              Accuracy: {totalTrials > 0 ? ((correctResponses / totalTrials) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-orange-300/70 text-sm italic">
              "Like my Ch7 goldfish brain, each rep builds capacity"
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isPlaying ? (
            <Button
              onClick={startGame}
              className="bg-orange-600 hover:bg-orange-500 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              {gameComplete ? "Play Again" : "Start"}
            </Button>
          ) : (
            <Button
              onClick={() => setIsPlaying(false)}
              variant="outline"
              className="border-orange-600 text-orange-200"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            onClick={resetGame}
            variant="ghost"
            className="text-orange-300 hover:text-orange-100"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NBackGame;
