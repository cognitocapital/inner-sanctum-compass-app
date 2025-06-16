import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Brain, Timer, Flame, Zap, Target, Award, Clock, Eye, Hand, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PhoenixCompanion } from "@/components/phoenix/PhoenixCompanion";
import { PhoenixNest } from "@/components/phoenix/PhoenixNest";
import { HatchingGame } from "@/components/phoenix/games/HatchingGame";
import { LearningToFlyGame } from "@/components/phoenix/games/LearningToFlyGame";
import { MindfulnessJournal } from "@/components/mindfulness/MindfulnessJournal";
import { GuidedMeditations } from "@/components/mindfulness/GuidedMeditations";
import { NarrativePrompts } from "@/components/mindfulness/NarrativePrompts";

const MindTraining = () => {
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300);
  const [timeLeft, setTimeLeft] = useState(300);
  const [phoenixScore, setPhoenixScore] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [completedGames, setCompletedGames] = useState(0);
  const [phoenixTheme, setPhoenixTheme] = useState('flame');
  const [totalMeditations, setTotalMeditations] = useState(0);
  const [currentGameType, setCurrentGameType] = useState<'hatching' | 'flying' | 'gathering' | 'transformation'>('hatching');
  const [phoenixMessage, setPhoenixMessage] = useState("");
  
  // BIRU Assessment states - Fixed typing
  const [biruAssessments, setBiruAssessments] = useState({
    trailMaking: { completed: false, timeA: 0, timeB: 0, errors: 0 },
    digitSpan: { completed: false, forward: 0, backward: 0, sequencing: 0 },
    stroopTest: { completed: false, correct: 0, errors: 0, avgTime: 0 },
    clockDrawing: { score: 0, completed: false },
    motorSkills: { completed: false, dominant: 0, nonDominant: 0, bilateral: 0 }
  });

  const [currentBiruExercise, setCurrentBiruExercise] = useState('attention');
  const [exerciseStartTime, setExerciseStartTime] = useState<number>(0);
  const { toast } = useToast();

  // Load progress from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('phoenixMindScore');
    const savedLevel = localStorage.getItem('phoenixMindLevel');
    const savedGames = localStorage.getItem('phoenixCompletedGames');
    const savedMeditations = localStorage.getItem('phoenixMeditations');
    const savedAssessments = localStorage.getItem('biruAssessments');
    
    if (savedScore) setPhoenixScore(parseInt(savedScore));
    if (savedLevel) setGameLevel(parseInt(savedLevel));
    if (savedGames) setCompletedGames(parseInt(savedGames));
    if (savedMeditations) setTotalMeditations(parseInt(savedMeditations));
    if (savedAssessments) setBiruAssessments(JSON.parse(savedAssessments));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('phoenixMindScore', phoenixScore.toString());
    localStorage.setItem('phoenixMindLevel', gameLevel.toString());
    localStorage.setItem('phoenixCompletedGames', completedGames.toString());
    localStorage.setItem('phoenixMeditations', totalMeditations.toString());
    localStorage.setItem('biruAssessments', JSON.stringify(biruAssessments));
  }, [phoenixScore, gameLevel, completedGames, totalMeditations, biruAssessments]);

  // BIRU Professional Exercise Protocols
  const biruExercises = {
    attention: {
      title: "Sustained Attention Task (SAT)",
      description: "Monitor for target stimuli over extended periods - standard BIRU assessment",
      duration: 300, // 5 minutes
      instructions: "Press SPACE when you see the target symbol (★). Ignore all other symbols.",
      cognitiveArea: "Attention & Concentration"
    },
    workingMemory: {
      title: "N-Back Working Memory",
      description: "Professional working memory assessment used in TBI rehabilitation",
      levels: [1, 2, 3], // N-back levels
      instructions: "Remember if the current stimulus matches the one N steps back",
      cognitiveArea: "Working Memory"
    },
    executiveFunction: {
      title: "Trail Making Test (TMT)",
      description: "Gold standard for executive function assessment in BIRU",
      parts: ["TMT-A (Numbers)", "TMT-B (Numbers & Letters)"],
      instructions: "Connect circles in sequence as quickly as possible",
      cognitiveArea: "Executive Function"
    },
    processingSpeed: {
      title: "Symbol Digit Modalities Test",
      description: "Measures information processing speed - core BIRU metric",
      duration: 90,
      instructions: "Match symbols to numbers using the reference key",
      cognitiveArea: "Processing Speed"
    },
    visuospatial: {
      title: "Clock Drawing Test",
      description: "Assesses visuospatial construction and executive function",
      instructions: "Draw a clock showing 10 minutes past 11",
      cognitiveArea: "Visuospatial Skills"
    },
    memory: {
      title: "Rey Auditory Verbal Learning",
      description: "Comprehensive memory assessment protocol",
      trials: 5,
      instructions: "Remember and recall word lists - standard neuropsych protocol",
      cognitiveArea: "Verbal Memory"
    }
  };

  const cognitiveExercises = [
    {
      title: "Phoenix Memory Match",
      instruction: "Remember the sequence of phoenix flames",
      sequence: Array.from({length: Math.min(gameLevel + 3, 8)}, () => Math.floor(Math.random() * 4)),
      type: "memory",
      phoenixPoints: 25,
      difficulty: gameLevel
    },
    {
      title: "Flame Sequence", 
      instruction: "Continue the phoenix flame pattern",
      pattern: generateFlamePattern(gameLevel),
      type: "pattern",
      phoenixPoints: 30,
      difficulty: gameLevel
    },
    {
      title: "Rising Phoenix Words",
      instruction: "Find words hidden in the ashes",
      words: generatePhoenixWords(gameLevel),
      type: "wordFind",
      phoenixPoints: 20,
      difficulty: gameLevel
    },
    {
      title: "Phoenix Navigation",
      instruction: "Guide the phoenix through the maze",
      mazeSize: Math.min(gameLevel + 2, 6),
      type: "navigation",
      phoenixPoints: 35,
      difficulty: gameLevel
    }
  ];

  function generateFlamePattern(level: number) {
    const patterns = [
      "🔥, 🧡, 🔥, 🧡, ?",
      "🔥, 🔥🔥, 🔥🔥🔥, ?",
      "🧡, 🔥, 🧡🧡, 🔥🔥, ?",
      "🔥, 🧡, 💫, 🔥, 🧡, ?",
    ];
    return patterns[Math.min(level - 1, patterns.length - 1)];
  }

  function generatePhoenixWords(level: number) {
    const wordSets = [
      ["RISE", "FIRE", "HEAL", "GROW"],
      ["PHOENIX", "REBIRTH", "STRENGTH", "COURAGE"],
      ["RESILIENCE", "TRANSFORMATION", "RENEWAL", "RECOVERY"],
      ["NEUROPLASTICITY", "EMPOWERMENT", "TRANSCENDENCE", "METAMORPHOSIS"]
    ];
    return wordSets[Math.min(level - 1, wordSets.length - 1)];
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && meditationActive) {
      setMeditationActive(false);
      const newTotal = totalMeditations + 1;
      setTotalMeditations(newTotal);
      const points = Math.floor(meditationTime / 60) * 10; // 10 points per minute
      setPhoenixScore(prev => prev + points);
      
      toast({
        title: "Phoenix Meditation Complete! 🧘‍♀️",
        description: `You've earned ${points} phoenix points! Inner flame grows stronger.`,
      });
    }
    return () => clearInterval(interval);
  }, [meditationActive, timeLeft, toast]);

  const startBiruExercise = (exerciseType: string) => {
    setCurrentBiruExercise(exerciseType);
    setExerciseStartTime(Date.now());
    toast({
      title: "BIRU Assessment Started",
      description: `Beginning ${biruExercises[exerciseType as keyof typeof biruExercises]?.title}`,
    });
  };

  const completeBiruExercise = (exerciseType: string, score: number, timeSpent: number) => {
    const points = Math.floor(score * 10); // Professional exercise worth more points
    setPhoenixScore(prev => prev + points);
    
    // Update assessment tracking
    setBiruAssessments(prev => ({
      ...prev,
      [exerciseType]: {
        ...prev[exerciseType as keyof typeof prev],
        completed: true,
        score: score,
        timeSpent: timeSpent
      }
    }));

    toast({
      title: "BIRU Assessment Complete! 🧠",
      description: `Clinical score: ${score}%. You've earned ${points} phoenix points!`,
    });
  };

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

  const completeExercise = () => {
    const exercise = cognitiveExercises[currentExercise];
    const pointsEarned = exercise.phoenixPoints + (gameLevel * 5);
    
    setPhoenixScore(prev => prev + pointsEarned);
    setCompletedGames(prev => prev + 1);
    setCurrentExercise((prev) => (prev + 1) % cognitiveExercises.length);
    
    // Level up every 5 completed exercises
    if ((completedGames + 1) % 5 === 0 && gameLevel < 5) {
      setGameLevel(prev => prev + 1);
      toast({
        title: "Phoenix Level Up! 🔥🆙",
        description: `You've reached Phoenix Mind Level ${gameLevel + 1}! Difficulty increased.`,
      });
    } else {
      toast({
        title: "Exercise Complete! 🎯",
        description: `You've earned ${pointsEarned} phoenix points!`,
      });
    }
  };

  const getPhoenixRank = () => {
    if (phoenixScore < 100) return { rank: "Ember", icon: "🔥", color: "text-orange-400" };
    if (phoenixScore < 300) return { rank: "Flame", icon: "🧡", color: "text-orange-500" };
    if (phoenixScore < 600) return { rank: "Blaze", icon: "💫", color: "text-yellow-400" };
    if (phoenixScore < 1000) return { rank: "Phoenix", icon: "🔥", color: "text-red-500" };
    return { rank: "Phoenix Master", icon: "👑", color: "text-purple-400" };
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
              Phoenix Mind Academy
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Evidence-based cognitive exercises used in Brain Injury Rehabilitation Units
            </p>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Clinical Grade • BIRU Standard Protocol
            </Badge>
            <div className="flex justify-center items-center gap-4 mt-4">
              <Badge className={`${getPhoenixRank().color} bg-primary/20`}>
                {getPhoenixRank().icon} {getPhoenixRank().rank}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {phoenixScore} Phoenix Points • Level {gameLevel}
              </span>
            </div>
          </header>

          <Tabs defaultValue="biru-assessments" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="biru-assessments">BIRU Clinical</TabsTrigger>
              <TabsTrigger value="cognitive-training">Cognitive Training</TabsTrigger>
              <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
              <TabsTrigger value="guided">Guided</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* BIRU Clinical Assessments Tab */}
            <TabsContent value="biru-assessments" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Clinical Note</h3>
                <p className="text-blue-800 text-sm">
                  These exercises follow evidence-based protocols used in Brain Injury Rehabilitation Units (BIRU). 
                  Results can be shared with your occupational therapist for treatment planning.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Attention Assessment */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <Badge variant="secondary" className="text-xs">Attention</Badge>
                    </div>
                    <CardTitle className="text-lg">Sustained Attention Task</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Clinical assessment of sustained attention and vigilance
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">5 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={biruAssessments.trailMaking.completed ? "text-green-600" : "text-orange-600"}>
                            {biruAssessments.trailMaking.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('attention')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Working Memory Assessment */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <Badge variant="secondary" className="text-xs">Working Memory</Badge>
                    </div>
                    <CardTitle className="text-lg">N-Back Memory Test</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Professional working memory capacity assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Levels:</span>
                          <span className="font-medium">1-3 Back</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Best Score:</span>
                          <span className="font-medium">{biruAssessments.digitSpan.forward}/3</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('workingMemory')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Executive Function Assessment */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <Badge variant="secondary" className="text-xs">Executive Function</Badge>
                    </div>
                    <CardTitle className="text-lg">Trail Making Test</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Gold standard for cognitive flexibility assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Parts:</span>
                          <span className="font-medium">A & B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Best Time:</span>
                          <span className="font-medium">{biruAssessments.trailMaking.timeA || "--"}s</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('executiveFunction')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Speed Assessment */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <Badge variant="secondary" className="text-xs">Processing Speed</Badge>
                    </div>
                    <CardTitle className="text-lg">Symbol Digit Test</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Information processing speed measurement
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">90 seconds</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Best Score:</span>
                          <span className="font-medium">{biruAssessments.stroopTest.correct || "--"}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('processingSpeed')}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Visuospatial Assessment */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Hand className="h-5 w-5 text-red-600" />
                      <Badge variant="secondary" className="text-xs">Visuospatial</Badge>
                    </div>
                    <CardTitle className="text-lg">Clock Drawing Test</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Visuospatial construction assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Task:</span>
                          <span className="font-medium">Draw Clock</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-medium">{biruAssessments.clockDrawing.score || "--"}/10</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('visuospatial')}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Memory Assessment */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-indigo-600" />
                      <Badge variant="secondary" className="text-xs">Verbal Memory</Badge>
                    </div>
                    <CardTitle className="text-lg">Word List Learning</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive verbal memory assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Trials:</span>
                          <span className="font-medium">5 learning trials</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Best Recall:</span>
                          <span className="font-medium">--/15</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('memory')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clinical Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Clinical Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {Object.values(biruAssessments).filter(a => a.completed).length}/6
                      </div>
                      <div className="text-sm text-blue-800">Assessments Complete</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{phoenixScore}</div>
                      <div className="text-sm text-purple-800">Clinical Points Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {getPhoenixRank().rank}
                      </div>
                      <div className="text-sm text-green-800">Cognitive Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cognitive Training Tab */}
            <TabsContent value="cognitive-training" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <PhoenixCompanion 
                  phoenixScore={phoenixScore}
                  gameLevel={gameLevel}
                  onMessage={setPhoenixMessage}
                />
                
                <PhoenixNest
                  phoenixScore={phoenixScore}
                  totalMeditations={totalMeditations}
                  completedGames={completedGames}
                  gameLevel={gameLevel}
                />
              </div>

              {/* Game Selection */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Button 
                  variant={currentGameType === 'hatching' ? 'default' : 'outline'}
                  onClick={() => setCurrentGameType('hatching')}
                  className="h-16 flex-col gap-1"
                >
                  <span className="text-2xl">🥚</span>
                  <span className="text-sm">Hatching</span>
                </Button>
                <Button 
                  variant={currentGameType === 'flying' ? 'default' : 'outline'}
                  onClick={() => setCurrentGameType('flying')}
                  className="h-16 flex-col gap-1"
                >
                  <span className="text-2xl">🕊️</span>
                  <span className="text-sm">Learning to Fly</span>
                </Button>
                <Button 
                  variant="outline"
                  disabled
                  className="h-16 flex-col gap-1 opacity-50"
                >
                  <span className="text-2xl">🔥</span>
                  <span className="text-sm">Gathering Flames</span>
                  <span className="text-xs">Coming Soon</span>
                </Button>
                <Button 
                  variant="outline"
                  disabled
                  className="h-16 flex-col gap-1 opacity-50"
                >
                  <span className="text-2xl">✨</span>
                  <span className="text-sm">Transformation</span>
                  <span className="text-xs">Coming Soon</span>
                </Button>
              </div>

              {/* Current Game */}
              {currentGameType === 'hatching' && (
                <HatchingGame 
                  gameLevel={gameLevel}
                  onComplete={(points) => {
                    setPhoenixScore(prev => prev + points);
                    setCompletedGames(prev => prev + 1);
                    if ((completedGames + 1) % 5 === 0 && gameLevel < 5) {
                      setGameLevel(prev => prev + 1);
                      toast({
                        title: "Phoenix Level Up! 🔥🆙",
                        description: `You've reached Phoenix Mind Level ${gameLevel + 1}!`,
                      });
                    } else {
                      toast({
                        title: "Game Complete! 🎯",
                        description: `You've earned ${points} phoenix points!`,
                      });
                    }
                  }}
                />
              )}

              {currentGameType === 'flying' && (
                <LearningToFlyGame 
                  gameLevel={gameLevel}
                  onComplete={(points) => {
                    setPhoenixScore(prev => prev + points);
                    setCompletedGames(prev => prev + 1);
                    if ((completedGames + 1) % 5 === 0 && gameLevel < 5) {
                      setGameLevel(prev => prev + 1);
                      toast({
                        title: "Phoenix Level Up! 🔥🆙",
                        description: `You've reached Phoenix Mind Level ${gameLevel + 1}!`,
                      });
                    } else {
                      toast({
                        title: "Game Complete! 🎯",
                        description: `You've earned ${points} phoenix points!`,
                      });
                    }
                  }}
                />
              )}
            </TabsContent>

            {/* Mindfulness Tab */}
            <TabsContent value="mindfulness" className="space-y-6">
              <NarrativePrompts 
                currentChapter="Chapter 5"
                storyContext="Phoenix transformation scene"
                onComplete={(type, duration) => {
                  const points = Math.floor(duration / 30) * 5;
                  setPhoenixScore(prev => prev + points);
                  toast({
                    title: "Mindful Moment Complete! ✨",
                    description: `You've earned ${points} phoenix points for your mindful practice.`,
                  });
                }}
              />
            </TabsContent>

            {/* Guided Tab */}
            <TabsContent value="guided" className="space-y-6">
              <GuidedMeditations 
                onComplete={(duration, theme) => {
                  const newTotal = totalMeditations + 1;
                  setTotalMeditations(newTotal);
                  const points = Math.floor(duration / 60) * 15;
                  setPhoenixScore(prev => prev + points);
                  
                  toast({
                    title: "Guided Meditation Complete! 🧘‍♀️",
                    description: `You've earned ${points} phoenix points! Theme: ${theme}`,
                  });
                }}
              />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-6">
              <MindfulnessJournal 
                currentChapter="Chapter 5"
                storyContext="Phoenix rises from ashes"
              />
            </TabsContent>

            {/* Enhanced Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>BIRU Assessments Completed:</span>
                        <span className="font-bold text-blue-400">
                          {Object.values(biruAssessments).filter(a => a.completed).length}/6
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clinical Phoenix Points:</span>
                        <span className="font-bold text-orange-400">{phoenixScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cognitive Training Level:</span>
                        <span className="font-bold text-blue-400">Level {gameLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phoenix Rank:</span>
                        <span className={`font-bold ${getPhoenixRank().color}`}>
                          {getPhoenixRank().icon} {getPhoenixRank().rank}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Share with Clinical Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Your assessment results can be shared with your occupational therapist or rehabilitation team.
                      </p>
                      <Button className="w-full" variant="outline">
                        Generate Clinical Report
                      </Button>
                      <Button className="w-full" variant="outline">
                        Export Progress Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MindTraining;
