import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RetentionBreathing from "@/components/breathing/RetentionBreathing";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [selectedDuration, setSelectedDuration] = useState(10); // Total cycles
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load session count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('breathingSessions');
    if (saved) setTotalSessions(parseInt(saved));
  }, []);

  // Breathing pattern: 4-4-6 (inhale-hold-exhale) for brain injury recovery
  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    pause: 2
  };

  const phaseInstructions = {
    inhale: "Breathe in slowly through your nose",
    hold: "Hold your breath gently",
    exhale: "Exhale slowly through your mouth",
    pause: "Rest and prepare for the next cycle"
  };

  const phoenixMessages = {
    inhale: "Rising like a phoenix, drawing in strength",
    hold: "Pausing with grace, building resilience", 
    exhale: "Releasing with power, letting go of what no longer serves",
    pause: "Resting in the ashes, preparing for rebirth"
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
    }
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
        if (cycleCount + 1 >= selectedDuration) {
          setIsActive(false);
          const newTotal = totalSessions + 1;
          setTotalSessions(newTotal);
          localStorage.setItem('breathingSessions', newTotal.toString());
          
          toast({
            title: "Phoenix Session Complete! 🔥",
            description: `You've completed ${selectedDuration} breathing cycles. Your inner phoenix grows stronger!`,
          });
          return;
        }
      }
      
      // Speak instruction for new phase
      speak(phaseInstructions[nextPhase]);
      
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

  const startSession = (duration: number) => {
    setSelectedDuration(duration);
    reset();
    speak("Beginning your phoenix breathing session. Follow the visual guide.");
  };

  const circleScale = phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Yellow Brick Road
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <header className="mb-12 animate-fade-in text-center">
            <div className="relative mb-6 mx-auto w-24 h-24">
              <div 
                className="w-full h-full rounded-full border-2 border-primary/40 shadow-xl animate-glow-pulse phoenix-image"
                style={{
                  backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Phoenix Breath Healing
            </h1>
            <p className="text-lg text-muted-foreground">
              Transform your breathing practice with healing techniques designed for recovery and growth
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              Sessions completed: {totalSessions} 🔥
            </div>
          </header>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Basic Phoenix Breathing
              </TabsTrigger>
              <TabsTrigger value="retention" className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Retention Mastery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-8">
              {!isActive && cycleCount === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Button onClick={() => startSession(5)} variant="outline" className="h-20 flex-col gap-2">
                    <div className="text-lg font-bold">5 Cycles</div>
                    <div className="text-sm text-muted-foreground">Quick Reset</div>
                  </Button>
                  <Button onClick={() => startSession(10)} variant="outline" className="h-20 flex-col gap-2">
                    <div className="text-lg font-bold">10 Cycles</div>
                    <div className="text-sm text-muted-foreground">Standard</div>
                  </Button>
                  <Button onClick={() => startSession(15)} variant="outline" className="h-20 flex-col gap-2">
                    <div className="text-lg font-bold">15 Cycles</div>
                    <div className="text-sm text-muted-foreground">Deep Practice</div>
                  </Button>
                </div>
              )}

              <Card className="mb-8 animate-fade-in" style={{animationDelay: '200ms'}}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-serif">
                    Cycle {cycleCount + 1} of {selectedDuration}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Phoenix breathing guide */}
                  <div className="relative flex items-center justify-center h-64">
                    {/* Phoenix background with breathing animation */}
                    <div 
                      className={`w-40 h-40 rounded-full transition-all duration-1000 ease-in-out ${circleScale} opacity-90`}
                      style={{
                        backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: phase === 'inhale' ? '0 0 30px rgba(255, 165, 0, 0.8)' : 
                                  phase === 'exhale' ? '0 0 20px rgba(255, 69, 0, 0.6)' : 
                                  '0 0 15px rgba(255, 140, 0, 0.4)'
                      }}
                    />
                    
                    {/* Floating flame particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className={`absolute top-8 left-8 w-2 h-2 bg-orange-400 rounded-full transition-all duration-1000 ${phase === 'inhale' ? 'animate-bounce opacity-80' : 'opacity-30'}`}></div>
                      <div className={`absolute top-12 right-10 w-1.5 h-1.5 bg-red-400 rounded-full transition-all duration-1000 ${phase === 'exhale' ? 'animate-pulse opacity-70' : 'opacity-20'}`}></div>
                      <div className={`absolute bottom-10 left-12 w-2.5 h-2.5 bg-yellow-400 rounded-full transition-all duration-1000 ${phase === 'hold' ? 'animate-ping opacity-60' : 'opacity-25'}`}></div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-black/30 rounded-lg p-4 backdrop-blur-sm">
                        <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                          {timeLeft}
                        </div>
                        <div className="text-sm uppercase tracking-wide text-orange-200 font-medium">
                          {phase}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center space-y-2">
                    <div className="text-xl text-foreground">
                      {phaseInstructions[phase]}
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      {phoenixMessages[phase]}
                    </div>
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

              <div className="text-center space-y-4 animate-fade-in" style={{animationDelay: '400ms'}}>
                <p className="text-sm text-muted-foreground">
                  This phoenix breathing exercise uses a 4-4-6 pattern to calm your nervous system, reduce anxiety, 
                  and support neuroplasticity for brain injury recovery. Like a phoenix rising from ashes, 
                  each breath builds your inner strength.
                </p>
                <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
                  <span>🔥 Builds resilience</span>
                  <span>🧠 Supports brain healing</span>
                  <span>💆‍♀️ Reduces anxiety</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="retention" className="space-y-8">
              <RetentionBreathing />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
