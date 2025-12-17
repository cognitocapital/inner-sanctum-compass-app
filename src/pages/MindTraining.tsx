import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Brain, Trophy, Zap, RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { cn } from "@/lib/utils";

// Simple N-Back game - the ONE thing this module does
const MindTraining = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showingPosition, setShowingPosition] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const savedGames = localStorage.getItem('mindGames');
    const savedBest = localStorage.getItem('mindBestScore');
    if (savedGames) setTotalGames(parseInt(savedGames));
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  // Generate sequence
  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9));
  };

  // Start game
  const startGame = () => {
    const newSequence = generateSequence(10 + level * 5);
    setSequence(newSequence);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    showNextPosition(newSequence, 0);
  };

  // Show next position
  const showNextPosition = (seq: number[], idx: number) => {
    if (idx >= seq.length) {
      endGame();
      return;
    }
    
    setShowingPosition(seq[idx]);
    setTimeout(() => {
      setShowingPosition(null);
      setCurrentIndex(idx + 1);
      
      // Auto-advance if no input needed (first N positions)
      if (idx < level) {
        setTimeout(() => showNextPosition(seq, idx + 1), 500);
      }
    }, 1500);
  };

  // Handle user response
  const handleResponse = (isMatch: boolean) => {
    if (gameState !== 'playing' || currentIndex <= level) return;
    
    const actualMatch = sequence[currentIndex - 1] === sequence[currentIndex - 1 - level];
    const correct = isMatch === actualMatch;
    
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) setScore(prev => prev + 10);
    
    setTimeout(() => {
      setFeedback(null);
      showNextPosition(sequence, currentIndex);
    }, 500);
  };

  // End game
  const endGame = () => {
    setGameState('result');
    const newTotal = totalGames + 1;
    setTotalGames(newTotal);
    localStorage.setItem('mindGames', newTotal.toString());
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('mindBestScore', score.toString());
      toast({ title: "New Best Score! 🎉", description: `${score} points` });
    }
  };

  // Grid positions (3x3)
  const gridPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/50 to-slate-900 text-white relative overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Brain className="h-6 w-6 text-purple-400" />
              <h1 className="text-xl font-bold text-purple-100">Phoenix Mind</h1>
            </div>
            <EvidenceBadge level="A" domain="N-Back" pubmedId="37673101" />
          </div>
          <div className="w-10" />
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{totalGames}</div>
            <div className="text-purple-300/60">Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{bestScore}</div>
            <div className="text-amber-300/60">Best</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{level}</div>
            <div className="text-cyan-300/60">N-Level</div>
          </div>
        </div>

        {/* Game area */}
        <Card className="bg-slate-900/80 border-purple-500/30 mb-6">
          <CardContent className="p-6">
            {gameState === 'idle' && (
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
                <h2 className="text-xl font-semibold text-purple-100">Dual N-Back Training</h2>
                <p className="text-purple-300/70 text-sm">
                  Remember positions {level} steps back. Press "Match" when you see a repeat.
                </p>
                
                {/* Level selection */}
                <div className="flex justify-center gap-2 my-4">
                  {[1, 2, 3].map((l) => (
                    <Button
                      key={l}
                      variant={level === l ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        level === l 
                          ? "bg-purple-500 hover:bg-purple-400" 
                          : "border-purple-500/30 text-purple-300"
                      )}
                      onClick={() => setLevel(l)}
                    >
                      {l}-Back
                    </Button>
                  ))}
                </div>
                
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Training
                </Button>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="space-y-6">
                {/* Score display */}
                <div className="text-center">
                  <span className="text-purple-300/60">Score: </span>
                  <span className="text-xl font-bold text-purple-100">{score}</span>
                </div>

                {/* 3x3 Grid */}
                <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                  {gridPositions.map((pos) => (
                    <motion.div
                      key={pos}
                      className={cn(
                        "w-16 h-16 rounded-lg border-2 transition-all",
                        showingPosition === pos 
                          ? "bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/50" 
                          : "bg-slate-800/50 border-purple-500/20"
                      )}
                      animate={showingPosition === pos ? { scale: [1, 1.1, 1] } : {}}
                    />
                  ))}
                </div>

                {/* Feedback */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "text-center text-lg font-bold",
                      feedback === 'correct' ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {feedback === 'correct' ? "✓ Correct!" : "✗ Incorrect"}
                  </motion.div>
                )}

                {/* Response buttons */}
                {currentIndex > level && !showingPosition && (
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => handleResponse(true)}
                      size="lg"
                      className="bg-green-600 hover:bg-green-500 w-28"
                    >
                      Match
                    </Button>
                    <Button
                      onClick={() => handleResponse(false)}
                      size="lg"
                      variant="outline"
                      className="border-purple-500/50 text-purple-300 w-28"
                    >
                      No Match
                    </Button>
                  </div>
                )}
              </div>
            )}

            {gameState === 'result' && (
              <div className="text-center space-y-4">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
                <h2 className="text-2xl font-bold text-purple-100">Session Complete!</h2>
                <div className="text-4xl font-bold text-purple-400">{score} pts</div>
                <p className="text-purple-300/70">
                  {score >= bestScore ? "New personal best! 🎉" : `Best: ${bestScore} pts`}
                </p>
                <Button
                  onClick={() => setGameState('idle')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quanta */}
        <div className="text-center">
          <p className="text-purple-200/60 italic text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            "The goldfish brain—each game builds new pathways."
          </p>
        </div>
      </div>
    </div>
  );
};

export default MindTraining;
