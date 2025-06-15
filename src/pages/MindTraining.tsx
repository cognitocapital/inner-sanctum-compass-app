import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, Brain, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MindTraining = () => {
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes
  const [timeLeft, setTimeLeft] = useState(300);
  const [focusScore, setFocusScore] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const { toast } = useToast();

  const cognitiveExercises = [
    {
      title: "Memory Sequence",
      instruction: "Remember this sequence and repeat it back",
      sequence: [1, 4, 7, 2, 9],
      type: "memory"
    },
    {
      title: "Word Association", 
      instruction: "Think of 5 words related to: RECOVERY",
      words: ["healing", "progress", "strength", "hope", "growth"],
      type: "association"
    },
    {
      title: "Pattern Recognition",
      instruction: "What comes next in this pattern?",
      pattern: "A, C, E, G, ?",
      answer: "I",
      type: "pattern"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && meditationActive) {
      setMeditationActive(false);
      toast({
        title: "Meditation Complete!",
        description: "Well done! You've completed your mindfulness session.",
      });
    }
    return () => clearInterval(interval);
  }, [meditationActive, timeLeft, toast]);

  const startMeditation = (duration: number) => {
    setMeditationTime(duration);
    setTimeLeft(duration);
    setMeditationActive(true);
  };

  const toggleMeditation = () => {
    setMeditationActive(!meditationActive);
  };

  const resetMeditation = () => {
    setMeditationActive(false);
    setTimeLeft(meditationTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % cognitiveExercises.length);
    setFocusScore(prev => prev + 10);
  };

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

        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Mind Training
            </h1>
            <p className="text-lg text-muted-foreground">
              Cognitive exercises and meditation to support brain recovery and mental clarity
            </p>
          </header>

          <Tabs defaultValue="meditation" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meditation">Mindfulness</TabsTrigger>
              <TabsTrigger value="cognitive">Cognitive Exercises</TabsTrigger>
            </TabsList>

            {/* Meditation Tab */}
            <TabsContent value="meditation" className="space-y-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Guided Meditation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!meditationActive && timeLeft === meditationTime && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        onClick={() => startMeditation(180)}
                        variant="outline"
                        className="h-16"
                      >
                        <div className="text-center">
                          <div className="font-semibold">3 Minutes</div>
                          <div className="text-sm text-muted-foreground">Quick Reset</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => startMeditation(300)}
                        variant="outline"
                        className="h-16"
                      >
                        <div className="text-center">
                          <div className="font-semibold">5 Minutes</div>
                          <div className="text-sm text-muted-foreground">Standard</div>
                        </div>
                      </Button>
                      <Button 
                        onClick={() => startMeditation(600)}
                        variant="outline"
                        className="h-16"
                      >
                        <div className="text-center">
                          <div className="font-semibold">10 Minutes</div>
                          <div className="text-sm text-muted-foreground">Deep Practice</div>
                        </div>
                      </Button>
                    </div>
                  )}

                  {(meditationActive || timeLeft < meditationTime) && (
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-48 h-48 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">
                              {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {meditationActive ? 'Meditating...' : 'Paused'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                          {meditationActive 
                            ? "Focus on your breath. Let thoughts come and go without judgment."
                            : "Take your time. Resume when you're ready."
                          }
                        </p>
                        
                        <div className="flex justify-center gap-4">
                          <Button onClick={toggleMeditation} size="lg">
                            {meditationActive ? (
                              <>
                                <Pause className="mr-2 h-5 w-5" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-5 w-5" />
                                Resume
                              </>
                            )}
                          </Button>
                          <Button onClick={resetMeditation} variant="outline" size="lg">
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cognitive Exercises Tab */}
            <TabsContent value="cognitive" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{focusScore}</div>
                    <div className="text-sm text-muted-foreground">Focus Points</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{currentExercise + 1}</div>
                    <div className="text-sm text-muted-foreground">Current Exercise</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{cognitiveExercises.length}</div>
                    <div className="text-sm text-muted-foreground">Total Exercises</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {cognitiveExercises[currentExercise].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg mb-4">
                      {cognitiveExercises[currentExercise].instruction}
                    </p>
                    
                    {cognitiveExercises[currentExercise].type === 'memory' && (
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <div className="text-2xl font-mono tracking-wider">
                          {cognitiveExercises[currentExercise].sequence?.join(' - ')}
                        </div>
                      </div>
                    )}
                    
                    {cognitiveExercises[currentExercise].type === 'pattern' && (
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <div className="text-2xl font-mono tracking-wider">
                          {cognitiveExercises[currentExercise].pattern}
                        </div>
                      </div>
                    )}
                    
                    {cognitiveExercises[currentExercise].type === 'association' && (
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          RECOVERY
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <Button onClick={nextExercise} size="lg">
                      Next Exercise
                    </Button>
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

export default MindTraining;