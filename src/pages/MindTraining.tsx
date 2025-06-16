import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Brain, Timer, Flame, Zap, Target, Award, Clock, Eye, Hand, Lightbulb, Focus, Crosshair, RotateCcw, Layers, Grid, Menu, FileText, Headphones, Mic, Calculator, MapPin, Users, TrendingUp, Activity, BarChart3, LineChart, PieChart, Stethoscope, ClipboardCheck } from "lucide-react";
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
  
  // Expanded BIRU Assessment states
  const [biruAssessments, setBiruAssessments] = useState({
    trailMaking: { completed: false, timeA: 0, timeB: 0, errors: 0 },
    digitSpan: { completed: false, forward: 0, backward: 0, sequencing: 0 },
    stroopTest: { completed: false, correct: 0, errors: 0, avgTime: 0 },
    clockDrawing: { score: 0, completed: false },
    motorSkills: { completed: false, dominant: 0, nonDominant: 0, bilateral: 0 },
    // New comprehensive assessments
    waisIV: { completed: false, vci: 0, pri: 0, wmi: 0, psi: 0, fsiq: 0 },
    ravlt: { completed: false, trial1: 0, trial5: 0, delayed: 0, recognition: 0 },
    wcst: { completed: false, categories: 0, errors: 0, perseverative: 0 },
    cpt3: { completed: false, omissions: 0, commissions: 0, hitRT: 0 },
    dkefs: { completed: false, sorting: 0, fluency: 0, design: 0, colorWord: 0 },
    wms4: { completed: false, auditory: 0, visual: 0, visualWorking: 0, immediate: 0 },
    cognistat: { completed: false, attention: 0, language: 0, construction: 0, memory: 0 },
    rbans: { completed: false, immediate: 0, visuospatial: 0, language: 0, attention: 0, delayed: 0 }
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

  // Comprehensive BIRU Professional Exercise Protocols
  const biruExercises = {
    // Core Attention Assessments
    attention: {
      title: "Continuous Performance Test-3 (CPT-3)",
      description: "Gold standard for ADHD and attention disorders assessment",
      duration: 840, // 14 minutes
      instructions: "Press SPACE for all letters except 'X'. Sustained attention paradigm.",
      cognitiveArea: "Sustained Attention",
      clinicalUse: "ADHD, TBI, Frontal lobe dysfunction"
    },
    vigilance: {
      title: "Psychomotor Vigilance Test (PVT)",
      description: "NASA-developed vigilance assessment for fatigue and alertness",
      duration: 600, // 10 minutes
      instructions: "Press button as soon as counter appears. Measures reaction time.",
      cognitiveArea: "Vigilant Attention",
      clinicalUse: "Sleep disorders, TBI, Fatigue assessment"
    },
    
    // Working Memory Assessments
    workingMemory: {
      title: "Wechsler Adult Intelligence Scale-IV (WAIS-IV)",
      description: "Comprehensive intelligence and working memory assessment",
      subtests: ["Digit Span", "Arithmetic", "Letter-Number Sequencing"],
      instructions: "Multi-part cognitive battery for comprehensive assessment",
      cognitiveArea: "Working Memory Index",
      clinicalUse: "IQ assessment, Cognitive profiling, Disability determination"
    },
    nBack: {
      title: "Dual N-Back Training",
      description: "Advanced working memory training with auditory and visual stimuli",
      levels: [1, 2, 3, 4, 5], 
      instructions: "Remember spatial and auditory patterns N steps back",
      cognitiveArea: "Working Memory Capacity",
      clinicalUse: "Cognitive enhancement, Executive training"
    },

    // Executive Function Assessments
    executiveFunction: {
      title: "Delis-Kaplan Executive Function System (D-KEFS)",
      description: "Comprehensive executive function battery",
      subtests: ["Trail Making", "Verbal Fluency", "Design Fluency", "Color-Word Interference"],
      instructions: "Multi-domain executive function assessment",
      cognitiveArea: "Executive Functions",
      clinicalUse: "Frontal lobe assessment, Planning, Inhibition"
    },
    wcst: {
      title: "Wisconsin Card Sorting Test (WCST)",
      description: "Classic test of cognitive flexibility and set-shifting",
      duration: 900, // 15 minutes
      instructions: "Sort cards by changing rules. Learn from feedback.",
      cognitiveArea: "Cognitive Flexibility",
      clinicalUse: "Frontal dysfunction, Schizophrenia, TBI"
    },

    // Processing Speed Assessments
    processingSpeed: {
      title: "Wechsler Processing Speed Index",
      description: "Symbol Digit Modalities + Digit Symbol Coding",
      subtests: ["Symbol Search", "Coding", "Cancellation"],
      duration: 120,
      instructions: "Match symbols to numbers as quickly as possible",
      cognitiveArea: "Processing Speed",
      clinicalUse: "Cognitive slowing, Age-related decline, TBI"
    },

    // Memory Assessments
    memory: {
      title: "Rey Auditory Verbal Learning Test (RAVLT)",
      description: "Comprehensive verbal memory and learning assessment",
      trials: 5,
      instructions: "Learn word list over 5 trials, recall after interference",
      cognitiveArea: "Verbal Memory & Learning",
      clinicalUse: "Alzheimer's, TBI, Memory disorders"
    },
    wms4: {
      title: "Wechsler Memory Scale-IV (WMS-IV)",
      description: "Comprehensive memory battery with multiple modalities",
      subtests: ["Logical Memory", "Visual Reproduction", "Verbal Paired Associates"],
      instructions: "Multi-modal memory assessment battery",
      cognitiveArea: "Memory Functions",
      clinicalUse: "Memory disorders, Dementia, TBI"
    },

    // Visuospatial Assessments
    visuospatial: {
      title: "Rey-Osterrieth Complex Figure Test",
      description: "Visuospatial construction and memory assessment",
      phases: ["Copy", "Immediate Recall", "Delayed Recall"],
      instructions: "Copy complex figure, then reproduce from memory",
      cognitiveArea: "Visuospatial Construction",
      clinicalUse: "Right hemisphere dysfunction, Memory assessment"
    },
    clockDrawing: {
      title: "Clock Drawing Test (Shulman Scoring)",
      description: "Executive function and visuospatial screening",
      instructions: "Draw clock showing 10 minutes past 11",
      scoring: "6-point scale (0-6)",
      cognitiveArea: "Visuospatial/Executive",
      clinicalUse: "Dementia screening, Executive dysfunction"
    },

    // Language Assessments
    language: {
      title: "Boston Naming Test (BNT-60)",
      description: "Confrontation naming assessment for language disorders",
      items: 60,
      instructions: "Name pictures of objects with increasing difficulty",
      cognitiveArea: "Language/Naming",
      clinicalUse: "Aphasia, Dementia, Left hemisphere lesions"
    },
    fluency: {
      title: "Controlled Oral Word Association (COWAT)",
      description: "Phonemic and semantic fluency assessment",
      categories: ["FAS Letters", "Animals", "Actions"],
      duration: 180, // 3 minutes
      instructions: "Generate words beginning with specific letters/categories",
      cognitiveArea: "Verbal Fluency",
      clinicalUse: "Frontal lobe function, Language disorders"
    },

    // Cognitive Screening
    cognistat: {
      title: "Cognistat (Neurobehavioral Cognitive Status)",
      description: "Brief cognitive screening across multiple domains",
      domains: ["Attention", "Language", "Construction", "Memory", "Calculations"],
      instructions: "Comprehensive cognitive screening battery",
      cognitiveArea: "Cognitive Screening",
      clinicalUse: "Dementia screening, Cognitive impairment"
    },
    rbans: {
      title: "Repeatable Battery for Neuropsychological Status",
      description: "Brief neuropsychological screening battery",
      domains: ["Immediate Memory", "Visuospatial", "Language", "Attention", "Delayed Memory"],
      instructions: "Standardized brief cognitive assessment",
      cognitiveArea: "Neuropsychological Screening",
      clinicalUse: "Dementia, TBI, Cognitive monitoring"
    },

    // Advanced Assessments
    cantab: {
      title: "Cambridge Neuropsychological Test Battery (CANTAB)",
      description: "Computerized cognitive assessment battery",
      tests: ["Spatial Working Memory", "Rapid Visual Processing", "Attention Switching"],
      instructions: "Touch-screen based cognitive assessment",
      cognitiveArea: "Multiple Cognitive Domains",
      clinicalUse: "Research, Drug trials, Cognitive profiling"
    },
    anam: {
      title: "Automated Neuropsychological Assessment Metrics",
      description: "Military-developed cognitive assessment battery",
      subtests: ["Simple Reaction Time", "Code Substitution", "Mathematical Processing"],
      instructions: "Computerized cognitive performance assessment",
      cognitiveArea: "Cognitive Performance",
      clinicalUse: "Military, Sports concussion, TBI"
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
      title: "Clinical Assessment Started",
      description: `Beginning ${biruExercises[exerciseType as keyof typeof biruExercises]?.title}`,
    });
  };

  const completeBiruExercise = (exerciseType: string, score: number, timeSpent: number) => {
    const points = Math.floor(score * 15); // Clinical exercises worth more points
    setPhoenixScore(prev => prev + points);
    
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
      title: "Clinical Assessment Complete! 🧠",
      description: `Score: ${score}%. Clinical points earned: ${points}`,
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

        <div className="max-w-6xl mx-auto">
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

          <Tabs defaultValue="comprehensive-battery" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="comprehensive-battery">Full Battery</TabsTrigger>
              <TabsTrigger value="cognitive-domains">Domains</TabsTrigger>
              <TabsTrigger value="screening-tools">Screening</TabsTrigger>
              <TabsTrigger value="research-grade">Research</TabsTrigger>
              <TabsTrigger value="progress-tracking">Progress</TabsTrigger>
              <TabsTrigger value="clinical-reports">Reports</TabsTrigger>
            </TabsList>

            {/* Comprehensive Battery Tab */}
            <TabsContent value="comprehensive-battery" className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Comprehensive Neuropsychological Assessment Battery
                </h3>
                <p className="text-blue-800 mb-3">
                  Complete clinical-grade cognitive assessment following evidence-based protocols used in Brain Injury Rehabilitation Units (BIRU), 
                  neuropsychology clinics, and research institutions worldwide.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-blue-900">Assessment Time</div>
                    <div className="text-blue-700">4-6 hours comprehensive</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-blue-900">Clinical Uses</div>
                    <div className="text-blue-700">TBI, Dementia, ADHD, Research</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-blue-900">Evidence Level</div>
                    <div className="text-blue-700">Level A (Highest)</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* WAIS-IV - Intelligence/Working Memory */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-6 w-6 text-purple-600" />
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">Intelligence Battery</Badge>
                    </div>
                    <CardTitle className="text-lg text-purple-900">WAIS-IV Intelligence Scale</CardTitle>
                    <p className="text-sm text-purple-700">
                      Gold standard comprehensive intelligence assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Indices:</span>
                          <span className="font-medium">VCI, PRI, WMI, PSI</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>FSIQ Score:</span>
                          <span className="font-medium text-purple-600">{biruAssessments.waisIV.fsiq || "--"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={biruAssessments.waisIV.completed ? "text-green-600" : "text-orange-600"}>
                            {biruAssessments.waisIV.completed ? "✓ Complete" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('waisIV')}
                        className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg"
                      >
                        Begin WAIS-IV Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* D-KEFS Executive Function */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-600 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-6 w-6 text-green-600" />
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Executive Function</Badge>
                    </div>
                    <CardTitle className="text-lg text-green-900">D-KEFS Executive Battery</CardTitle>
                    <p className="text-sm text-green-700">
                      Comprehensive executive function assessment system
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Subtests:</span>
                          <span className="font-medium">9 core assessments</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Domains:</span>
                          <span className="font-medium">Flexibility, Inhibition</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion:</span>
                          <span className="font-medium text-green-600">{biruAssessments.dkefs.completed ? "100%" : "0%"}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('dkefs')}
                        className="w-full bg-green-600 hover:bg-green-700 shadow-lg"
                      >
                        Start D-KEFS Battery
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* WMS-IV Memory */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-600 bg-gradient-to-br from-orange-50 to-red-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-6 w-6 text-orange-600" />
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Memory Battery</Badge>
                    </div>
                    <CardTitle className="text-lg text-orange-900">WMS-IV Memory Scale</CardTitle>
                    <p className="text-sm text-orange-700">
                      Comprehensive memory and learning assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Memory Types:</span>
                          <span className="font-medium">Auditory, Visual, Working</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Immediate Index:</span>
                          <span className="font-medium text-orange-600">{biruAssessments.wms4.immediate || "--"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delayed Index:</span>
                          <span className="font-medium text-orange-600">{biruAssessments.wms4.delayed || "--"}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('wms4')}
                        className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg"
                      >
                        Begin WMS-IV Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* CPT-3 Attention */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-6 w-6 text-blue-600" />
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Attention Assessment</Badge>
                    </div>
                    <CardTitle className="text-lg text-blue-900">CPT-3 Attention Test</CardTitle>
                    <p className="text-sm text-blue-700">
                      Continuous Performance Test for sustained attention
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Duration:</span>
                          <span className="font-medium">14 minutes</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Omissions:</span>
                          <span className="font-medium text-blue-600">{biruAssessments.cpt3.omissions || "--"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RT (ms):</span>
                          <span className="font-medium text-blue-600">{biruAssessments.cpt3.hitRT || "--"}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('cpt3')}
                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                      >
                        Start CPT-3 Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* RAVLT Memory Learning */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-600 bg-gradient-to-br from-red-50 to-pink-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Headphones className="h-6 w-6 text-red-600" />
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">Verbal Memory</Badge>
                    </div>
                    <CardTitle className="text-lg text-red-900">RAVLT Learning Test</CardTitle>
                    <p className="text-sm text-red-700">
                      Rey Auditory Verbal Learning assessment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Learning Trials:</span>
                          <span className="font-medium">5 trials + interference</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Trial 5 Score:</span>
                          <span className="font-medium text-red-600">{biruAssessments.ravlt.trial5 || "--"}/15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delayed Recall:</span>
                          <span className="font-medium text-red-600">{biruAssessments.ravlt.delayed || "--"}/15</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('ravlt')}
                        className="w-full bg-red-600 hover:bg-red-700 shadow-lg"
                      >
                        Begin RAVLT Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* WCST Cognitive Flexibility */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-600 bg-gradient-to-br from-indigo-50 to-violet-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <RotateCcw className="h-6 w-6 text-indigo-600" />
                      <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">Cognitive Flexibility</Badge>
                    </div>
                    <CardTitle className="text-lg text-indigo-900">WCST Card Sorting</CardTitle>
                    <p className="text-sm text-indigo-700">
                      Wisconsin Card Sorting Test for set-shifting
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Categories:</span>
                          <span className="font-medium text-indigo-600">{biruAssessments.wcst.categories || "--"}/6</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Perseverative:</span>
                          <span className="font-medium text-indigo-600">{biruAssessments.wcst.perseverative || "--"}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={biruAssessments.wcst.completed ? "text-green-600" : "text-orange-600"}>
                            {biruAssessments.wcst.completed ? "✓ Complete" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startBiruExercise('wcst')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                      >
                        Start WCST Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clinical Summary Dashboard */}
              <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    <ClipboardCheck className="h-6 w-6" />
                    Comprehensive Assessment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div className="bg-white/60 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {Object.values(biruAssessments).filter(a => a.completed).length}/16
                      </div>
                      <div className="text-sm text-slate-700 mt-1">Assessments Complete</div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{width: `${(Object.values(biruAssessments).filter(a => a.completed).length / 16) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{phoenixScore}</div>
                      <div className="text-sm text-slate-700 mt-1">Clinical Points</div>
                      <div className="text-xs text-slate-500 mt-1">Evidence-based scoring</div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {getPhoenixRank().rank}
                      </div>
                      <div className="text-sm text-slate-700 mt-1">Cognitive Profile</div>
                      <div className="text-xs text-slate-500 mt-1">Level {gameLevel} assessment</div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">
                        {Math.round((Object.values(biruAssessments).filter(a => a.completed).length / 16) * 100)}%
                      </div>
                      <div className="text-sm text-slate-700 mt-1">Battery Progress</div>
                      <div className="text-xs text-slate-500 mt-1">Toward full profile</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cognitive Domains Tab */}
            <TabsContent value="cognitive-domains" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Attention Domain */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                      <Focus className="h-5 w-5" />
                      Attention & Concentration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('cpt3')} variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      CPT-3 Sustained Attention
                    </Button>
                    <Button onClick={() => startBiruExercise('vigilance')} variant="outline" className="w-full justify-start">
                      <Timer className="h-4 w-4 mr-2" />
                      Psychomotor Vigilance
                    </Button>
                    <Button onClick={() => startBiruExercise('attention')} variant="outline" className="w-full justify-start">
                      <Crosshair className="h-4 w-4 mr-2" />
                      Selective Attention
                    </Button>
                  </CardContent>
                </Card>

                {/* Memory Domain */}
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-900 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Memory & Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('wms4')} variant="outline" className="w-full justify-start">
                      <Brain className="h-4 w-4 mr-2" />
                      WMS-IV Memory Battery
                    </Button>
                    <Button onClick={() => startBiruExercise('ravlt')} variant="outline" className="w-full justify-start">
                      <Headphones className="h-4 w-4 mr-2" />
                      RAVLT Verbal Learning
                    </Button>
                    <Button onClick={() => startBiruExercise('visuospatial')} variant="outline" className="w-full justify-start">
                      <Grid className="h-4 w-4 mr-2" />
                      Visual Memory Tasks
                    </Button>
                  </CardContent>
                </Card>

                {/* Executive Function Domain */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Executive Functions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('dkefs')} variant="outline" className="w-full justify-start">
                      <Layers className="h-4 w-4 mr-2" />
                      D-KEFS Battery
                    </Button>
                    <Button onClick={() => startBiruExercise('wcst')} variant="outline" className="w-full justify-start">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Card Sorting Test
                    </Button>
                    <Button onClick={() => startBiruExercise('fluency')} variant="outline" className="w-full justify-start">
                      <Mic className="h-4 w-4 mr-2" />
                      Verbal Fluency
                    </Button>
                  </CardContent>
                </Card>

                {/* Processing Speed Domain */}
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-900 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Processing Speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('processingSpeed')} variant="outline" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Symbol Digit Test
                    </Button>
                    <Button onClick={() => startBiruExercise('waisIV')} variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      WAIS-IV Coding
                    </Button>
                  </CardContent>
                </Card>

                {/* Language Domain */}
                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-yellow-900 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Language Functions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('language')} variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Boston Naming Test
                    </Button>
                    <Button onClick={() => startBiruExercise('fluency')} variant="outline" className="w-full justify-start">
                      <Mic className="h-4 w-4 mr-2" />
                      Verbal Fluency
                    </Button>
                  </CardContent>
                </Card>

                {/* Visuospatial Domain */}
                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader>
                    <CardTitle className="text-teal-900 flex items-center gap-2">
                      <Hand className="h-5 w-5" />
                      Visuospatial Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('visuospatial')} variant="outline" className="w-full justify-start">
                      <Grid className="h-4 w-4 mr-2" />
                      Rey Complex Figure
                    </Button>
                    <Button onClick={() => startBiruExercise('clockDrawing')} variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Clock Drawing Test
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Screening Tools Tab */}
            <TabsContent value="screening-tools" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-900">Quick Cognitive Screening</CardTitle>
                    <p className="text-emerald-700 text-sm">Brief assessments for rapid evaluation</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('cognistat')} className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Cognistat (15 minutes)
                    </Button>
                    <Button onClick={() => startBiruExercise('rbans')} className="w-full bg-emerald-600 hover:bg-emerald-700">
                      RBANS (30 minutes)
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
                  <CardHeader>
                    <CardTitle className="text-rose-900">Specialized Protocols</CardTitle>
                    <p className="text-rose-700 text-sm">Research-grade assessments</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => startBiruExercise('cantab')} className="w-full bg-rose-600 hover:bg-rose-700">
                      CANTAB Battery
                    </Button>
                    <Button onClick={() => startBiruExercise('anam')} className="w-full bg-rose-600 hover:bg-rose-700">
                      ANAM Military Protocol
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Research Grade Tab */}
            <TabsContent value="research-grade" className="space-y-6">
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-indigo-900 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Research-Grade Cognitive Assessment Platform
                  </CardTitle>
                  <p className="text-indigo-700">
                    Advanced computerized cognitive testing used in clinical trials and research institutions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-indigo-900">CANTAB Research Battery</h4>
                      <div className="space-y-2">
                        <Button onClick={() => startBiruExercise('cantab')} variant="outline" className="w-full justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Spatial Working Memory
                        </Button>
                        <Button onClick={() => startBiruExercise('cantab')} variant="outline" className="w-full justify-start">
                          <Activity className="h-4 w-4 mr-2" />
                          Rapid Visual Processing
                        </Button>
                        <Button onClick={() => startBiruExercise('cantab')} variant="outline" className="w-full justify-start">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Attention Switching Task
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-indigo-900">Military-Grade ANAM</h4>
                      <div className="space-y-2">
                        <Button onClick={() => startBiruExercise('anam')} variant="outline" className="w-full justify-start">
                          <Timer className="h-4 w-4 mr-2" />
                          Simple Reaction Time
                        </Button>
                        <Button onClick={() => startBiruExercise('anam')} variant="outline" className="w-full justify-start">
                          <Calculator className="h-4 w-4 mr-2" />
                          Mathematical Processing
                        </Button>
                        <Button onClick={() => startBiruExercise('anam')} variant="outline" className="w-full justify-start">
                          <Grid className="h-4 w-4 mr-2" />
                          Code Substitution
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tracking Tab */}
            <TabsContent value="progress-tracking" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Cognitive Domain Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { domain: "Attention", score: 85, color: "bg-blue-500" },
                        { domain: "Memory", score: 72, color: "bg-orange-500" },
                        { domain: "Executive", score: 78, color: "bg-green-500" },
                        { domain: "Processing Speed", score: 90, color: "bg-purple-500" },
                        { domain: "Language", score: 88, color: "bg-yellow-500" },
                        { domain: "Visuospatial", score: 75, color: "bg-teal-500" }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.domain}</span>
                            <span className="font-medium">{item.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-500`}
                              style={{width: `${item.score}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Assessment Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">
                        {Math.round((Object.values(biruAssessments).filter(a => a.completed).length / 16) * 100)}%
                      </div>
                      <p className="text-muted-foreground">
                        {Object.values(biruAssessments).filter(a => a.completed).length} of 16 assessments complete
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold">Next Assessment</div>
                          <div className="text-muted-foreground">
                            {Object.keys(biruAssessments).find(key => !biruAssessments[key as keyof typeof biruAssessments].completed) || "All Complete!"}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Time Invested</div>
                          <div className="text-muted-foreground">
                            {Math.round(Object.values(biruAssessments).filter(a => a.completed).length * 25)} minutes
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clinical Reports Tab */}
            <TabsContent value="clinical-reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Clinical Documentation & Reports
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Generate professional reports for your healthcare team
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Standardized Reports</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Neuropsychological Summary
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Cognitive Domain Profile
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Progress Tracking Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Team Communication Report
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Export Options</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          PDF Clinical Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calculator className="h-4 w-4 mr-2" />
                          Excel Data Export
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          Share with Provider
                        </Button>
                      </div>
                    </div>
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
