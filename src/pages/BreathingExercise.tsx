import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-pause)
  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4
  };

  const phaseInstructions = {
    inhale: "Breathe in slowly through your nose",
    hold: "Hold your breath gently",
    exhale: "Exhale slowly through your mouth",
    pause: "Rest and prepare for the next cycle"
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
      const currentIndex = phases.indexOf(phase);
      const nextPhase = phases[(currentIndex + 1) % phases.length];
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
        if (cycleCount + 1 >= 10) {
          setIsActive(false);
          toast({
            title: "Session Complete!",
            description: "You've completed 10 breathing cycles. Well done!",
          });
          return;
        }
      }
      
      setPhase(nextPhase);
      setTimeLeft(breathingPattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, phase, cycleCount, toast]);

  const startPause = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycleCount(0);
    setTimeLeft(4);
  };

  const circleScale = phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <header className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Healing Breath
            </h1>
            <p className="text-lg text-muted-foreground">
              A gentle 4-4-4-4 breathing pattern to calm your nervous system and support recovery
            </p>
          </header>

          <Card className="mb-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">
                Cycle {cycleCount + 1} of 10
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Visual breathing guide */}
              <div className="relative flex items-center justify-center h-64">
                <div 
                  className={`w-32 h-32 rounded-full bg-primary/20 border-4 border-primary transition-all duration-1000 ease-in-out ${circleScale}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {timeLeft}
                    </div>
                    <div className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
                      {phase}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xl text-foreground">
                {phaseInstructions[phase]}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={startPause}
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
                      Start
                    </>
                  )}
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '400ms'}}>
            <p>
              This breathing exercise can help reduce anxiety, improve focus, and support your brain's natural healing process.
              Practice daily for best results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;