
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Flame, Wind, Heart, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RetentionPattern {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
  cycles: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  phoenixMessage: string;
  icon: React.ReactNode;
}

const RetentionBreathing = () => {
  const [selectedPattern, setSelectedPattern] = useState<RetentionPattern | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [completedPatterns, setCompletedPatterns] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const retentionPatterns: RetentionPattern[] = [
    {
      id: 'box-breathing',
      name: 'Phoenix Box Breathing',
      description: 'Four equal counts - building perfect balance like the phoenix\'s four wings',
      pattern: {
        inhale: 4,
        hold1: 4,
        exhale: 4,
        hold2: 4
      },
      cycles: 8,
      difficulty: 'beginner',
      benefits: ['Reduces anxiety', 'Improves focus', 'Balances nervous system'],
      phoenixMessage: 'Like the phoenix building its nest with four perfect corners, each breath creates balance',
      icon: <Wind className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'power-retention',
      name: 'Phoenix Power Hold',
      description: 'Extended retention for building lung capacity and inner fire',
      pattern: {
        inhale: 6,
        hold1: 12,
        exhale: 8,
        hold2: 4
      },
      cycles: 6,
      difficulty: 'intermediate',
      benefits: ['Increases lung capacity', 'Builds mental resilience', 'Enhances oxygen efficiency'],
      phoenixMessage: 'In the held breath, the phoenix gathers its power before the magnificent rise',
      icon: <Flame className="h-5 w-5 text-orange-500" />
    },
    {
      id: 'calming-retention',
      name: 'Phoenix Serenity Hold',
      description: 'Longer exhale retention for deep relaxation and nervous system reset',
      pattern: {
        inhale: 5,
        hold1: 5,
        exhale: 7,
        hold2: 8
      },
      cycles: 7,
      difficulty: 'intermediate',
      benefits: ['Deep relaxation', 'Activates parasympathetic system', 'Reduces stress hormones'],
      phoenixMessage: 'In the quiet after the exhale, the phoenix finds its deepest peace',
      icon: <Heart className="h-5 w-5 text-pink-500" />
    },
    {
      id: 'advanced-ratio',
      name: 'Phoenix Master\'s Breath',
      description: 'Advanced 1:4:2:1 ratio for experienced practitioners',
      pattern: {
        inhale: 6,
        hold1: 24,
        exhale: 12,
        hold2: 6
      },
      cycles: 5,
      difficulty: 'advanced',
      benefits: ['Maximum lung expansion', 'Heightened awareness', 'Spiritual connection'],
      phoenixMessage: 'The master phoenix holds the breath of eternity, transforming with each sacred pause',
      icon: <Brain className="h-5 w-5 text-purple-500" />
    }
  ];

  // Load completed patterns
  useEffect(() => {
    const completed = localStorage.getItem('completedRetentionPatterns');
    if (completed) {
      setCompletedPatterns(JSON.parse(completed));
    }
  }, []);

  const phaseInstructions = {
    inhale: "Breathe in slowly and deeply",
    hold1: "Hold your breath gently",
    exhale: "Exhale slowly and completely",
    hold2: "Rest in the emptiness"
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-500';
      case 'hold1': return 'from-orange-400 to-red-500';
      case 'exhale': return 'from-green-400 to-teal-500';
      case 'hold2': return 'from-purple-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  useEffect(() => {
    if (isActive && selectedPattern && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && selectedPattern && timeLeft === 0) {
      // Move to next phase
      const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2'];
      const currentIndex = phases.indexOf(currentPhase);
      const nextPhase = phases[(currentIndex + 1) % phases.length];
      
      if (nextPhase === 'inhale') {
        setCurrentCycle(prev => prev + 1);
        if (currentCycle + 1 >= selectedPattern.cycles) {
          completeSession();
          return;
        }
      }
      
      setCurrentPhase(nextPhase);
      setTimeLeft(selectedPattern.pattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, currentCycle, selectedPattern]);

  const startSession = (pattern: RetentionPattern) => {
    setSelectedPattern(pattern);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.pattern.inhale);
    setCurrentCycle(0);
    setIsActive(false);
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    if (selectedPattern) {
      setIsActive(false);
      setCurrentPhase('inhale');
      setTimeLeft(selectedPattern.pattern.inhale);
      setCurrentCycle(0);
    }
  };

  const completeSession = () => {
    if (selectedPattern) {
      setIsActive(false);
      
      if (!completedPatterns.includes(selectedPattern.id)) {
        const newCompleted = [...completedPatterns, selectedPattern.id];
        setCompletedPatterns(newCompleted);
        localStorage.setItem('completedRetentionPatterns', JSON.stringify(newCompleted));
      }
      
      toast({
        title: "Phoenix Retention Complete! 🔥",
        description: `You've mastered ${selectedPattern.name}. Your breath capacity grows stronger!`,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (!selectedPattern) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="relative mb-4 mx-auto w-16 h-16">
            <div 
              className="w-full h-full rounded-full border-2 border-orange-500/40 shadow-xl animate-pulse"
              style={{
                backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">
            Phoenix Retention Breathing
          </h2>
          <p className="text-muted-foreground">
            Master the art of breath retention to build lung capacity and deepen your practice
          </p>
        </div>

        <div className="grid gap-4">
          {retentionPatterns.map((pattern) => (
            <Card 
              key={pattern.id}
              className="hover:bg-muted/30 transition-all cursor-pointer border-l-4 border-l-primary/40 hover:border-l-primary hover:shadow-lg"
              onClick={() => startSession(pattern)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {pattern.icon}
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(pattern.difficulty)}>
                      {pattern.difficulty}
                    </Badge>
                    {completedPatterns.includes(pattern.id) && (
                      <Badge className="bg-green-500/20 text-green-400">
                        ✓ Mastered
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Pattern visualization */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{pattern.pattern.inhale}</div>
                      <div className="text-xs text-muted-foreground">Inhale</div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">{pattern.pattern.hold1}</div>
                      <div className="text-xs text-muted-foreground">Hold</div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{pattern.pattern.exhale}</div>
                      <div className="text-xs text-muted-foreground">Exhale</div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">{pattern.pattern.hold2}</div>
                      <div className="text-xs text-muted-foreground">Hold</div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1">
                    {pattern.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>

                  {/* Phoenix message */}
                  <div className="text-sm text-primary/80 italic">
                    "{pattern.phoenixMessage}"
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedPattern(null)}
          className="mb-4"
        >
          ← Back to Patterns
        </Button>
        <Badge className={getDifficultyColor(selectedPattern.difficulty)}>
          {selectedPattern.difficulty}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedPattern.icon}
            {selectedPattern.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Cycle {currentCycle + 1} of {selectedPattern.cycles}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <Progress 
            value={(currentCycle / selectedPattern.cycles) * 100} 
            className="w-full h-2"
          />

          {/* Visual breathing guide */}
          <div className="relative flex items-center justify-center h-64">
            <div 
              className={`w-48 h-48 rounded-full transition-all duration-1000 ease-in-out bg-gradient-to-br ${getPhaseColor(currentPhase)} opacity-80`}
              style={{
                transform: currentPhase === 'inhale' ? 'scale(1.2)' : 
                         currentPhase === 'exhale' ? 'scale(0.8)' : 
                         'scale(1)',
                boxShadow: currentPhase === 'hold1' || currentPhase === 'hold2' ? 
                          '0 0 40px rgba(255, 165, 0, 0.8)' : 
                          '0 0 20px rgba(255, 165, 0, 0.4)'
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-black/40 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {timeLeft}
                </div>
                <div className="text-lg uppercase tracking-wide text-white/90 font-medium mb-1">
                  {currentPhase === 'hold1' ? 'Hold (Full)' : 
                   currentPhase === 'hold2' ? 'Hold (Empty)' : 
                   currentPhase}
                </div>
                <div className="text-sm text-white/70">
                  {phaseInstructions[currentPhase]}
                </div>
              </div>
            </div>
          </div>

          {/* Phoenix message */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
            <p className="text-sm text-primary/80 italic">
              "{selectedPattern.phoenixMessage}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={toggleSession}
              size="lg"
              className="min-w-32"
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  {currentCycle === 0 && currentPhase === 'inhale' && timeLeft === selectedPattern.pattern.inhale ? 'Begin' : 'Resume'}
                </>
              )}
            </Button>
            <Button 
              onClick={resetSession}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetentionBreathing;
