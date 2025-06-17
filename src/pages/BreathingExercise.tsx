
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Trophy, Timer, TrendingUp } from "lucide-react";
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
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load session data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('breathingSessions');
    const savedStreak = localStorage.getItem('breathingStreak');
    const savedBest = localStorage.getItem('breathingBest');
    
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
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
          completeSession();
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
  }, [isActive, timeLeft, phase, cycleCount, selectedDuration]);

  const completeSession = () => {
    setIsActive(false);
    const newSessions = totalSessions + 1;
    const newStreak = streak + 1;
    
    setTotalSessions(newSessions);
    setStreak(newStreak);
    
    // Check for personal best
    if (selectedDuration > personalBest) {
      setPersonalBest(selectedDuration);
      localStorage.setItem('breathingBest', selectedDuration.toString());
      toast({
        title: "New Phoenix Record! 🔥",
        description: `${selectedDuration} cycles - your inner phoenix soars higher!`,
      });
    } else {
      toast({
        title: "Phoenix Session Complete! 🔥",
        description: `You've completed ${selectedDuration} breathing cycles. Your inner phoenix grows stronger!`,
      });
    }
    
    // Save to localStorage
    localStorage.setItem('breathingSessions', newSessions.toString());
    localStorage.setItem('breathingStreak', newStreak.toString());
  };

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

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return 'from-blue-400 to-cyan-500';
      case 'hold': return 'from-orange-400 to-red-500';
      case 'exhale': return 'from-green-400 to-teal-500';
      case 'pause': return 'from-purple-400 to-indigo-500';
      default: return 'from-orange-400 to-red-500';
    }
  };

  const circleScale = phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900 to-red-900 text-white relative overflow-hidden">
      {/* Animated phoenix flame particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite] opacity-80"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_1s] opacity-60"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_2s] opacity-70"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full animate-[float_4s_ease-in-out_infinite_1.5s] opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_0.5s] opacity-65"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-orange-300 hover:text-white">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Yellow Brick Road
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center animate-fade-in">
            <div className="relative mb-8 mx-auto w-32 h-32">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-orange-400 to-red-600 flex items-center justify-center shadow-2xl animate-pulse">
                <Flame className="h-16 w-16 text-white animate-[float_3s_ease-in-out_infinite]" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-300 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-400 rounded-full animate-bounce opacity-70" style={{animationDelay: '0.5s'}}></div>
            </div>
            <h1 className="text-5xl font-serif font-bold text-orange-100 mb-4 drop-shadow-lg">
              Phoenix Breath Academy
            </h1>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto leading-relaxed">
              Transform your breathing practice with healing techniques designed for recovery and growth. Rise from the ashes with each sacred breath.
            </p>
          </header>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-100">{streak}</div>
                <div className="text-xs text-orange-300">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-900/50 to-orange-900/50 border-red-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Timer className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-100">{personalBest}</div>
                <div className="text-xs text-orange-300">Best Cycles</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Flame className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-100">{totalSessions}</div>
                <div className="text-xs text-orange-300">Sessions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/50 border-slate-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-100">{Math.floor((totalSessions * 10) / 60)}m</div>
                <div className="text-xs text-orange-300">Total Time</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50 border-orange-500/30">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
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
                  <Button 
                    onClick={() => startSession(5)} 
                    variant="outline" 
                    className="h-20 flex-col gap-2 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/40 hover:border-orange-400 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-lg font-bold text-orange-100">5 Cycles</div>
                    <div className="text-sm text-orange-300">Quick Reset</div>
                  </Button>
                  <Button 
                    onClick={() => startSession(10)} 
                    variant="outline" 
                    className="h-20 flex-col gap-2 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/40 hover:border-orange-400 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-lg font-bold text-orange-100">10 Cycles</div>
                    <div className="text-sm text-orange-300">Standard</div>
                  </Button>
                  <Button 
                    onClick={() => startSession(15)) 
                    variant="outline" 
                    className="h-20 flex-col gap-2 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/40 hover:border-orange-400 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-lg font-bold text-orange-100">15 Cycles</div>
                    <div className="text-sm text-orange-300">Deep Practice</div>
                  </Button>
                </div>
              )}

              <Card className="bg-gradient-to-br from-slate-900/80 to-orange-900/80 border-orange-500/30 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-3xl font-serif text-orange-100">
                    Cycle {cycleCount + 1} of {selectedDuration}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="text-orange-300 hover:text-white"
                  >
                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Visual Timer */}
                  <div className="relative flex items-center justify-center h-80">
                    <div className="relative w-64 h-64">
                      {/* Phoenix breathing visualization */}
                      <div 
                        className={`w-full h-full rounded-full transition-all duration-1000 ease-in-out bg-gradient-to-br ${getPhaseColor()} opacity-90`}
                        style={{
                          transform: circleScale,
                          boxShadow: isActive ? '0 0 60px rgba(251, 146, 60, 0.8)' : '0 0 30px rgba(251, 146, 60, 0.4)'
                        }}
                      />
                      
                      {/* Floating flame particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute top-8 left-8 w-2 h-2 bg-orange-400 rounded-full transition-all duration-1000 ${phase === 'inhale' ? 'animate-bounce opacity-80' : 'opacity-30'}`}></div>
                        <div className={`absolute top-12 right-10 w-1.5 h-1.5 bg-red-400 rounded-full transition-all duration-1000 ${phase === 'exhale' ? 'animate-pulse opacity-70' : 'opacity-20'}`}></div>
                        <div className={`absolute bottom-10 left-12 w-2.5 h-2.5 bg-yellow-400 rounded-full transition-all duration-1000 ${phase === 'hold' ? 'animate-ping opacity-60' : 'opacity-25'}`}></div>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-black/40 rounded-lg p-6 backdrop-blur-sm">
                          <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                            {timeLeft}
                          </div>
                          <div className="text-lg uppercase tracking-wide text-orange-200 font-medium">
                            {phase}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions and Motivation */}
                  <div className="text-center space-y-4">
                    <div className="text-xl text-orange-100">
                      {phaseInstructions[phase]}
                    </div>
                    <div className="text-sm text-orange-300 italic">
                      {phoenixMessages[phase]}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={startPause}
                      size="lg"
                      className="min-w-32 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    >
                      {isActive ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          {cycleCount === 0 && phase === 'inhale' && timeLeft === 4 ? 'Begin' : 'Resume'}
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={reset}
                      variant="outline"
                      size="lg"
                      className="border-orange-500/50 hover:border-orange-400"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center space-y-4 animate-fade-in" style={{animationDelay: '400ms'}}>
                <p className="text-sm text-orange-200">
                  This phoenix breathing exercise uses a 4-4-6 pattern to calm your nervous system, reduce anxiety, 
                  and support neuroplasticity for brain injury recovery. Like a phoenix rising from ashes, 
                  each breath builds your inner strength.
                </p>
                <div className="flex justify-center items-center gap-4 text-xs text-orange-300">
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
