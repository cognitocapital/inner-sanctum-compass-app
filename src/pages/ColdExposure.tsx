
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, RotateCcw, Thermometer, Snowflake, Timer, Trophy, TrendingUp, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColdExposure = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(60); // seconds
  const [phase, setPhase] = useState<'prepare' | 'enter' | 'endure' | 'exit'>('prepare');
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [temperature, setTemperature] = useState(50); // Fahrenheit
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('coldExposureStreak');
    const savedBest = localStorage.getItem('coldExposureBest');
    const savedSessions = localStorage.getItem('coldExposureSessions');
    const savedTotal = localStorage.getItem('coldExposureTotal');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
    if (savedSessions) setCompletedSessions(parseInt(savedSessions));
    if (savedTotal) setTotalTime(parseInt(savedTotal));
  }, []);

  const phaseInstructions = {
    prepare: "Take deep breaths and prepare mentally. You've got this! 🧊",
    enter: "Slowly enter the cold water. Control your breathing. Stay calm. ❄️",
    endure: "You're doing amazing! Focus on your breath. Mind over matter! 💪",
    exit: "Well done, ice warrior! You've conquered the cold! 🏆"
  };

  const motivationalMessages = [
    "Every second in the cold builds your resilience! 🔥",
    "You're rewiring your nervous system right now! 🧠",
    "The cold is your teacher, embrace the lesson! 📚",
    "Your future self is thanking you for this! ⭐",
    "Discomfort today, strength tomorrow! 💎"
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Phase transitions
        if (selectedDuration > 60) {
          if (timeLeft === selectedDuration - 10 && phase === 'prepare') setPhase('enter');
          if (timeLeft === selectedDuration - 20 && phase === 'enter') setPhase('endure');
          if (timeLeft === 10 && phase === 'endure') setPhase('exit');
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, phase, selectedDuration]);

  const completeSession = () => {
    setIsActive(false);
    const newSessions = completedSessions + 1;
    const newTotal = totalTime + selectedDuration;
    const newStreak = streak + 1;
    
    setCompletedSessions(newSessions);
    setTotalTime(newTotal);
    setStreak(newStreak);
    
    // Check for personal best
    if (selectedDuration > personalBest) {
      setPersonalBest(selectedDuration);
      localStorage.setItem('coldExposureBest', selectedDuration.toString());
      toast({
        title: "New Personal Best! 🏆",
        description: `${selectedDuration} seconds of pure ice warrior spirit!`,
      });
    } else {
      toast({
        title: "Session Complete! ❄️",
        description: `${selectedDuration} seconds of cold mastery. Your resilience grows!`,
      });
    }
    
    // Save to localStorage
    localStorage.setItem('coldExposureStreak', newStreak.toString());
    localStorage.setItem('coldExposureSessions', newSessions.toString());
    localStorage.setItem('coldExposureTotal', newTotal.toString());
  };

  const startSession = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
    setPhase('prepare');
    setIsActive(true);
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setPhase('prepare');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'prepare': return 'text-blue-400';
      case 'enter': return 'text-cyan-400';
      case 'endure': return 'text-teal-300';
      case 'exit': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const coldProtocols = [
    { name: "Beginner Freeze", duration: 30, tempF: "50-60°F", tempC: "10-15°C", description: "Perfect for ice bath newcomers" },
    { name: "Warrior's Trial", duration: 60, tempF: "45-55°F", tempC: "7-13°C", description: "Building mental toughness" },
    { name: "Arctic Challenge", duration: 120, tempF: "40-50°F", tempC: "4-10°C", description: "For experienced cold warriors" },
    { name: "Polar Mastery", duration: 180, tempF: "35-45°F", tempC: "2-7°C", description: "Elite cold exposure protocol" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
      {/* Animated ice crystals background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-cyan-400 rounded-full animate-[float_4s_ease-in-out_infinite] opacity-70"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-300 rounded-full animate-[float_4s_ease-in-out_infinite_1s] opacity-60"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-teal-400 rounded-full animate-[float_4s_ease-in-out_infinite_2s] opacity-80"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-[float_4s_ease-in-out_infinite_1.5s] opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-[float_4s_ease-in-out_infinite_0.5s] opacity-65"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-cyan-300 hover:text-white">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Yellow Brick Road
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center animate-fade-in">
            <div className="relative mb-8 mx-auto w-32 h-32">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl animate-pulse">
                <Snowflake className="h-16 w-16 text-white animate-spin" style={{animationDuration: '8s'}} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-300 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full animate-bounce opacity-70" style={{animationDelay: '0.5s'}}></div>
            </div>
            <h1 className="text-5xl font-serif font-bold text-cyan-100 mb-4 drop-shadow-lg">
              Ice Warrior Academy
            </h1>
            <p className="text-xl text-cyan-200 max-w-3xl mx-auto leading-relaxed">
              Transform your resilience through deliberate cold exposure. Build mental strength, boost immunity, and unlock your inner ice warrior.
            </p>
          </header>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-cyan-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-100">{streak}</div>
                <div className="text-xs text-cyan-300">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-900/50 to-teal-900/50 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Timer className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-100">{personalBest}s</div>
                <div className="text-xs text-cyan-300">Personal Best</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-teal-900/50 to-cyan-900/50 border-teal-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Snowflake className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-100">{completedSessions}</div>
                <div className="text-xs text-cyan-300">Sessions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/50 border-slate-500/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-100">{Math.floor(totalTime / 60)}m</div>
                <div className="text-xs text-cyan-300">Total Time</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="session" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50 border-cyan-500/30">
              <TabsTrigger value="session" className="flex items-center gap-2">
                <Snowflake className="h-4 w-4" />
                Active Session
              </TabsTrigger>
              <TabsTrigger value="protocols" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Protocols
              </TabsTrigger>
              <TabsTrigger value="science" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                The Science
              </TabsTrigger>
            </TabsList>

            <TabsContent value="session" className="space-y-8">
              {!isActive && timeLeft === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {coldProtocols.map((protocol) => (
                    <Button
                      key={protocol.name}
                      onClick={() => startSession(protocol.duration)}
                      variant="outline"
                      className="h-28 flex-col gap-1 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-sm font-bold text-cyan-100">{protocol.name}</div>
                      <div className="text-xs text-cyan-300">{protocol.duration}s</div>
                      <div className="text-xs text-cyan-300">{protocol.tempF}</div>
                      <div className="text-xs text-cyan-400">({protocol.tempC})</div>
                      <div className="text-xs text-cyan-400">{protocol.description}</div>
                    </Button>
                  ))}
                </div>
              )}

              <Card className="bg-gradient-to-br from-slate-900/80 to-cyan-900/80 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl font-serif text-center text-cyan-100">
                    {selectedDuration > 0 ? `${selectedDuration}s Challenge` : 'Select Your Challenge'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {selectedDuration > 0 && (
                    <>
                      {/* Visual Timer */}
                      <div className="relative flex items-center justify-center h-80">
                        <div className="relative w-64 h-64">
                          {/* Ice crystal background */}
                          <div 
                            className="w-full h-full rounded-full border-4 border-cyan-400/50 flex items-center justify-center transition-all duration-1000"
                            style={{
                              background: `conic-gradient(from 0deg, rgba(6, 182, 212, 0.8) ${(1 - timeLeft / selectedDuration) * 100}%, rgba(30, 41, 59, 0.3) ${(1 - timeLeft / selectedDuration) * 100}%)`,
                              boxShadow: isActive ? '0 0 40px rgba(6, 182, 212, 0.6)' : '0 0 20px rgba(6, 182, 212, 0.3)'
                            }}
                          >
                            <div className="bg-slate-900/80 rounded-full p-8 backdrop-blur-sm">
                              <div className="text-center">
                                <div className="text-5xl font-bold text-cyan-100 mb-2">
                                  {formatTime(timeLeft)}
                                </div>
                                <div className={`text-lg uppercase tracking-wide font-medium ${getPhaseColor()}`}>
                                  {phase}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Floating ice particles */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className={`absolute top-4 left-8 w-2 h-2 bg-cyan-300 rounded-full transition-all duration-1000 ${isActive ? 'animate-bounce opacity-80' : 'opacity-30'}`}></div>
                            <div className={`absolute top-12 right-6 w-1.5 h-1.5 bg-blue-300 rounded-full transition-all duration-1000 ${isActive ? 'animate-pulse opacity-70' : 'opacity-20'}`}></div>
                            <div className={`absolute bottom-8 left-12 w-2.5 h-2.5 bg-teal-300 rounded-full transition-all duration-1000 ${isActive ? 'animate-ping opacity-60' : 'opacity-25'}`}></div>
                          </div>
                        </div>
                      </div>

                      {/* Instructions and Motivation */}
                      <div className="text-center space-y-4">
                        <div className="text-xl text-cyan-100">
                          {phaseInstructions[phase]}
                        </div>
                        {isActive && (
                          <div className="text-sm text-cyan-300 italic animate-pulse">
                            {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <Button 
                          onClick={toggleSession}
                          size="lg"
                          className="min-w-32 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                        >
                          {isActive ? (
                            <>
                              <Pause className="mr-2 h-5 w-5" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-5 w-5" />
                              {timeLeft === selectedDuration ? 'Start' : 'Resume'}
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={resetSession}
                          variant="outline"
                          size="lg"
                          className="border-cyan-500/50 hover:border-cyan-400"
                        >
                          <RotateCcw className="mr-2 h-5 w-5" />
                          Reset
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="protocols" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {coldProtocols.map((protocol, index) => (
                  <Card key={protocol.name} className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-cyan-100">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-yellow-500' : 
                          index === 2 ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {index + 1}
                        </div>
                        {protocol.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-cyan-200">{protocol.description}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-300">Duration: {protocol.duration}s</span>
                        <div className="text-cyan-300">
                          <div>Temp: {protocol.tempF}</div>
                          <div className="text-xs text-cyan-400">({protocol.tempC})</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startSession(protocol.duration)}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                      >
                        Start {protocol.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="science" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-100">The Science of Cold Exposure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-cyan-200">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-100 mb-2">🧠 Neurological Benefits</h3>
                    <p>Cold exposure activates the sympathetic nervous system, increasing norepinephrine levels by up to 530%. This enhances focus, alertness, and mood while building stress resilience.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-100 mb-2">🔥 Metabolic Enhancement</h3>
                    <p>Regular cold exposure activates brown adipose tissue, increasing metabolic rate and improving insulin sensitivity. Studies show up to 15% increase in metabolic rate.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-100 mb-2">🛡️ Immune System Boost</h3>
                    <p>Cold therapy increases white blood cell count and activates the immune system. Regular practitioners show 29% fewer sick days.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-100 mb-2">💪 Recovery & Inflammation</h3>
                    <p>Cold exposure reduces inflammation markers and accelerates recovery. Professional athletes use cold therapy to reduce muscle soreness by up to 20%.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ColdExposure;
