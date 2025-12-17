import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PhoenixBackground } from "@/components/ui/phoenix-background";
import { GlassCard } from "@/components/ui/glass-card";
import { ModuleHeader } from "@/components/ui/module-header";
import { QuantaPrompt, getRandomQuanta } from "@/components/ui/quanta-prompt";
import { SessionStats } from "@/components/ui/session-stats";
import { NBackGame } from "@/components/mind/NBackGame";
import { cn } from "@/lib/utils";

const MindTraining = () => {
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [totalGames, setTotalGames] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { toast } = useToast();
  const [quanta] = useState(() => getRandomQuanta('mind'));

  // Load saved data
  useEffect(() => {
    const savedGames = localStorage.getItem('mindGames');
    const savedBest = localStorage.getItem('mindBest');
    const savedStreak = localStorage.getItem('mindStreak');
    const savedXp = localStorage.getItem('mindXp');
    
    if (savedGames) setTotalGames(parseInt(savedGames));
    if (savedBest) setBestScore(parseInt(savedBest));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXp) setXp(parseInt(savedXp));
  }, []);

  const handleGameComplete = (score: number, accuracy: number) => {
    setIsPlaying(false);
    
    const earnedXp = score + Math.floor(accuracy / 10);
    const newGames = totalGames + 1;
    const newStreak = streak + 1;
    const newXp = xp + earnedXp;
    
    setTotalGames(newGames);
    setStreak(newStreak);
    setXp(newXp);
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('mindBest', score.toString());
    }
    
    localStorage.setItem('mindGames', newGames.toString());
    localStorage.setItem('mindStreak', newStreak.toString());
    localStorage.setItem('mindXp', newXp.toString());
    
    toast({ 
      title: "Game Complete! 🧠", 
      description: `Score: ${score} | Accuracy: ${accuracy.toFixed(0)}% | +${earnedXp} XP`
    });
  };

  const startGame = () => {
    setIsPlaying(true);
  };

  return (
    <PhoenixBackground module="mind" showEmbers intensity="normal">
      <div className="min-h-screen pb-8">
        <ModuleHeader 
          module="mind"
          title="Phoenix Mind"
          subtitle="Dual N-Back cognitive training"
          evidenceLevel="A"
          xp={xp}
          streak={streak}
        />

        <div className="px-4 max-w-lg mx-auto space-y-6">
          {/* Stats */}
          <SessionStats 
            module="mind"
            stats={[
              { label: "Games", value: totalGames },
              { label: "Best Score", value: bestScore },
              { label: "Streak", value: streak },
            ]}
          />

          {/* Main Game Area */}
          {isPlaying ? (
            <GlassCard module="mind" glow className="p-4">
              <NBackGame 
                onComplete={handleGameComplete} 
                difficulty={difficulty}
              />
            </GlassCard>
          ) : (
            <>
              {/* Game Info Card */}
              <GlassCard module="mind" className="p-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-xl font-bold text-purple-100 mb-2">Dual N-Back Training</h2>
                  <p className="text-purple-300/70 text-sm mb-6">
                    Match positions and sounds to improve working memory and fluid intelligence.
                  </p>
                  
                  <Button 
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-8"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Training
                  </Button>
                </div>
              </GlassCard>

              {/* Difficulty Selection */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-purple-200 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Difficulty Level
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((level) => (
                    <GlassCard
                      key={level}
                      module="mind"
                      hover
                      className={cn(
                        "p-4 cursor-pointer transition-all text-center",
                        difficulty === level && "ring-2 ring-purple-500"
                      )}
                      onClick={() => setDifficulty(level as 1 | 2 | 3)}
                    >
                      <div className="text-2xl font-bold text-purple-100">{level}</div>
                      <div className="text-xs text-purple-300/60">
                        {level === 1 ? "Easy" : level === 2 ? "Medium" : "Hard"}
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        {level}-Back
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* How to Play */}
              <GlassCard module="mind" variant="subtle" className="p-4">
                <h3 className="text-sm font-semibold text-purple-200 mb-2">How to Play</h3>
                <ul className="text-xs text-purple-300/70 space-y-1">
                  <li>• Watch the grid for highlighted positions</li>
                  <li>• Listen for letter sounds</li>
                  <li>• Press "Position" if the square matches {difficulty} steps back</li>
                  <li>• Press "Sound" if the letter matches {difficulty} steps back</li>
                </ul>
              </GlassCard>
            </>
          )}

          {/* Quanta Prompt */}
          <QuantaPrompt 
            quote={quanta.quote}
            chapter={quanta.chapter}
            reflection={quanta.reflection}
            module="mind"
          />
        </div>
      </div>
    </PhoenixBackground>
  );
};

export default MindTraining;
