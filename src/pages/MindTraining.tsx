import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Brain, Timer, Flame, Zap, Target, Award } from "lucide-react";
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
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes
  const [timeLeft, setTimeLeft] = useState(300);
  const [phoenixScore, setPhoenixScore] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [completedGames, setCompletedGames] = useState(0);
  const [phoenixTheme, setPhoenixTheme] = useState('flame');
  const [totalMeditations, setTotalMeditations] = useState(0);
  const [currentGameType, setCurrentGameType] = useState<'hatching' | 'flying' | 'gathering' | 'transformation'>('hatching');
  const [phoenixMessage, setPhoenixMessage] = useState("");
  const { toast } = useToast();

  // Load progress from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('phoenixMindScore');
    const savedLevel = localStorage.getItem('phoenixMindLevel');
    const savedGames = localStorage.getItem('phoenixCompletedGames');
    const savedMeditations = localStorage.getItem('phoenixMeditations');
    
    if (savedScore) setPhoenixScore(parseInt(savedScore));
    if (savedLevel) setGameLevel(parseInt(savedLevel));
    if (savedGames) setCompletedGames(parseInt(savedGames));
    if (savedMeditations) setTotalMeditations(parseInt(savedMeditations));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('phoenixMindScore', phoenixScore.toString());
    localStorage.setItem('phoenixMindLevel', gameLevel.toString());
    localStorage.setItem('phoenixCompletedGames', completedGames.toString());
    localStorage.setItem('phoenixMeditations', totalMeditations.toString());
  }, [phoenixScore, gameLevel, completedGames, totalMeditations]);

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
              Phoenix Mind Training
            </h1>
            <p className="text-lg text-muted-foreground">
              Gamified cognitive exercises and meditation to strengthen your inner phoenix
            </p>
            <div className="flex justify-center items-center gap-4 mt-4">
              <Badge className={`${getPhoenixRank().color} bg-primary/20`}>
                {getPhoenixRank().icon} {getPhoenixRank().rank}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {phoenixScore} Phoenix Points • Level {gameLevel}
              </span>
            </div>
          </header>

          <Tabs defaultValue="mindfulness" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
              <TabsTrigger value="guided">Guided</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="games">Phoenix Games</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* Story-Integrated Mindfulness Tab */}
            <TabsContent value="mindfulness" className="space-y-6">
              <NarrativePrompts 
                currentChapter="Chapter 5"
                storyContext="Phoenix transformation scene"
                onComplete={(type, duration) => {
                  const points = Math.floor(duration / 30) * 5; // 5 points per 30 seconds
                  setPhoenixScore(prev => prev + points);
                  toast({
                    title: "Mindful Moment Complete! ✨",
                    description: `You've earned ${points} phoenix points for your mindful practice.`,
                  });
                }}
              />
            </TabsContent>

            {/* Guided Meditations Tab */}
            <TabsContent value="guided" className="space-y-6">
              <GuidedMeditations 
                onComplete={(duration, theme) => {
                  const newTotal = totalMeditations + 1;
                  setTotalMeditations(newTotal);
                  const points = Math.floor(duration / 60) * 15; // 15 points per minute for guided meditation
                  setPhoenixScore(prev => prev + points);
                  
                  toast({
                    title: "Guided Meditation Complete! 🧘‍♀️",
                    description: `You've earned ${points} phoenix points! Theme: ${theme}`,
                  });
                }}
              />
            </TabsContent>

            {/* Mindfulness Journal Tab */}
            <TabsContent value="journal" className="space-y-6">
              <MindfulnessJournal 
                currentChapter="Chapter 5"
                storyContext="Phoenix rises from ashes"
              />
            </TabsContent>

            {/* Phoenix Games Tab */}
            <TabsContent value="games" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Phoenix Companion */}
                <PhoenixCompanion 
                  phoenixScore={phoenixScore}
                  gameLevel={gameLevel}
                  onMessage={setPhoenixMessage}
                />
                
                {/* Phoenix Nest */}
                <PhoenixNest
                  phoenixScore={phoenixScore}
                  totalMeditations={totalMeditations}
                  completedGames={completedGames}
                  gameLevel={gameLevel}
                />
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
                  <CardContent className="p-4 text-center">
                    <Flame className="h-6 w-6 mx-auto mb-2 text-orange-400" />
                    <div className="text-2xl font-bold text-primary">{phoenixScore}</div>
                    <div className="text-sm text-muted-foreground">Phoenix Points</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-primary">{gameLevel}</div>
                    <div className="text-sm text-muted-foreground">Mind Level</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold text-primary">{completedGames}</div>
                    <div className="text-sm text-muted-foreground">Games Won</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold text-primary">{getPhoenixRank().rank}</div>
                    <div className="text-sm text-muted-foreground">Phoenix Rank</div>
                  </CardContent>
                </Card>
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

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Phoenix Journey Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Phoenix Points:</span>
                        <span className="font-bold text-orange-400">{phoenixScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mind Training Level:</span>
                        <span className="font-bold text-blue-400">Level {gameLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Games Completed:</span>
                        <span className="font-bold text-green-400">{completedGames}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meditation Sessions:</span>
                        <span className="font-bold text-purple-400">{totalMeditations}</span>
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
                    <CardTitle>Next Level Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Games until next level</span>
                          <span>{5 - (completedGames % 5)}/5</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${((completedGames % 5) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-center pt-4">
                        <div className="text-4xl mb-2">🔥</div>
                        <p className="text-sm text-muted-foreground">
                          Your phoenix mind grows stronger with each challenge completed
                        </p>
                      </div>
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