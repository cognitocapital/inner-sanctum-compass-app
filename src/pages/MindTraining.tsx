import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen, PenTool, Heart, Shield, Target, Zap, Sun, Moon, Activity, Users, Calendar, Compass, TrendingUp, Flame, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const MindTraining = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("attention");
  
  // BIRU = Brain Injury Rehabilitation Unit
  const [biruAssessments, setBiruAssessments] = useState({
    attention: {
      name: "Attention & Concentration",
      score: 65,
      previousScore: 42,
      completed: true,
      sessions: 8,
      lastCompleted: "2023-10-15",
      improvement: 23,
      exercises: [
        { name: "Sustained Attention", completed: true, score: 68 },
        { name: "Divided Attention", completed: true, score: 62 },
        { name: "Selective Attention", completed: true, score: 65 },
        { name: "Alternating Attention", completed: false, score: 0 }
      ]
    },
    processing: {
      name: "Processing Speed",
      score: 58,
      previousScore: 40,
      completed: true,
      sessions: 6,
      lastCompleted: "2023-10-12",
      improvement: 18,
      exercises: [
        { name: "Visual Processing", completed: true, score: 60 },
        { name: "Auditory Processing", completed: true, score: 56 },
        { name: "Reaction Time", completed: true, score: 59 },
        { name: "Decision Speed", completed: false, score: 0 }
      ]
    },
    memory: {
      name: "Memory Function",
      score: 70,
      previousScore: 55,
      completed: true,
      sessions: 10,
      lastCompleted: "2023-10-18",
      improvement: 15,
      exercises: [
        { name: "Working Memory", completed: true, score: 72 },
        { name: "Short-term Memory", completed: true, score: 68 },
        { name: "Long-term Memory", completed: true, score: 70 },
        { name: "Episodic Memory", completed: true, score: 71 }
      ]
    },
    executive: {
      name: "Executive Function",
      score: 62,
      previousScore: 38,
      completed: true,
      sessions: 7,
      lastCompleted: "2023-10-14",
      improvement: 24,
      exercises: [
        { name: "Planning", completed: true, score: 64 },
        { name: "Organization", completed: true, score: 60 },
        { name: "Problem Solving", completed: true, score: 63 },
        { name: "Cognitive Flexibility", completed: false, score: 0 }
      ]
    },
    language: {
      name: "Language Processing",
      score: 0,
      previousScore: 0,
      completed: false,
      sessions: 0,
      lastCompleted: "",
      improvement: 0,
      exercises: [
        { name: "Comprehension", completed: false, score: 0 },
        { name: "Expression", completed: false, score: 0 },
        { name: "Word Finding", completed: false, score: 0 },
        { name: "Reading & Writing", completed: false, score: 0 }
      ]
    },
    visual: {
      name: "Visual-Spatial Skills",
      score: 0,
      previousScore: 0,
      completed: false,
      sessions: 0,
      lastCompleted: "",
      improvement: 0,
      exercises: [
        { name: "Visual Perception", completed: false, score: 0 },
        { name: "Spatial Orientation", completed: false, score: 0 },
        { name: "Visual Construction", completed: false, score: 0 },
        { name: "Visual Memory", completed: false, score: 0 }
      ]
    }
  });

  // Calculate average improvement
  const completedAssessments = Object.values(biruAssessments).filter(assessment => assessment.completed);
  const averageImprovement = completedAssessments.length > 0 
    ? Math.round(completedAssessments.reduce((acc, assessment) => acc + assessment.improvement, 0) / completedAssessments.length) 
    : 0;

  const handleStartAssessment = (domain) => {
    toast({
      title: "Assessment Starting",
      description: `Preparing your ${biruAssessments[domain].name} assessment...`,
    });
  };

  const handleStartTraining = (domain) => {
    toast({
      title: "Training Session Starting",
      description: `Preparing your ${biruAssessments[domain].name} training session...`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white relative overflow-hidden">
      {/* Enhanced Phoenix-themed animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Phoenix flame particles with enhanced glow */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-90 shadow-2xl shadow-orange-500/80"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-red-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-75 shadow-xl shadow-red-500/70"></div>
        <div className="absolute bottom-60 left-1/4 w-3.5 h-3.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-85 shadow-2xl shadow-orange-500/75"></div>
        <div className="absolute bottom-40 right-1/3 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-70 shadow-xl shadow-yellow-500/60"></div>
        <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-red-400 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-65 shadow-lg shadow-red-400/50"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1.5 h-1.5 bg-orange-400 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-55 shadow-lg shadow-orange-400/45"></div>
        
        {/* Phoenix wing trail effects */}
        <div className="absolute top-16 left-1/2 w-1 h-12 bg-gradient-to-t from-orange-500/80 to-transparent animate-[float_4s_ease-in-out_infinite_3.5s] opacity-40"></div>
        <div className="absolute bottom-32 right-1/2 w-0.5 h-8 bg-gradient-to-t from-red-500/60 to-transparent animate-[float_4s_ease-in-out_infinite_4.5s] opacity-35"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-gray-300 hover:text-white transition-colors">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <header className="text-center mb-12 animate-phoenix-rise">
          {/* Enhanced Phoenix branding with larger, more prominent phoenix */}
          <div className="relative mb-8 group mx-auto w-32 h-32">
            <div 
              className="w-full h-full rounded-full border-4 border-orange-500/50 shadow-2xl hover:scale-110 transition-all duration-700 cursor-pointer phoenix-image"
              style={{
                backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Enhanced flame particles around phoenix */}
            <div className="absolute -top-6 -left-6 w-5 h-5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-95 shadow-xl shadow-orange-500/80"></div>
            <div className="absolute -top-8 right-16 w-4 h-4 bg-red-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.8s] opacity-85 shadow-lg shadow-red-500/70"></div>
            <div className="absolute top-8 -right-7 w-4.5 h-4.5 bg-yellow-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.2s] opacity-90 shadow-xl shadow-yellow-500/75"></div>
            <div className="absolute bottom-16 -left-8 w-3.5 h-3.5 bg-orange-400 rounded-full animate-[float_3s_ease-in-out_infinite_0.3s] opacity-75 shadow-lg shadow-orange-400/60"></div>
            <div className="absolute -bottom-7 right-12 w-4 h-4 bg-red-400 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-85 shadow-lg shadow-red-400/65"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            Mind Academy
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 font-semibold text-lg tracking-wider">RISE FROM THE ASHES OF COGNITIVE CHALLENGE</span>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transform your cognitive abilities with clinical-grade neuropsychological assessments used in Brain Injury Rehabilitation Units worldwide. 
            Like the phoenix, your mind can rise stronger than before.
          </p>
          
          {/* Phoenix-themed clinical credentials */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2">
              <span className="text-orange-300 font-medium text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Clinical Grade Assessments
              </span>
            </div>
            <div className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
              <span className="text-red-300 font-medium text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Evidence-Based Protocols
              </span>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2">
              <span className="text-yellow-300 font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Personalized Recovery
              </span>
            </div>
          </div>
        </header>

        {/* Phoenix Progress Dashboard */}
        <Card className="mb-8 bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur-sm border-orange-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-orange-100 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Phoenix Recovery Progress
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-300">
                  {Object.values(biruAssessments).reduce((acc, assessment) => acc + (assessment.completed ? 1 : 0), 0)}
                </div>
                <div className="text-orange-400 text-sm">Assessments Completed</div>
              </div>
              <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                <div className="text-2xl font-bold text-red-300">
                  {Object.values(biruAssessments).reduce((acc, assessment) => acc + (assessment.sessions || 0), 0)}
                </div>
                <div className="text-red-400 text-sm">Training Sessions</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-300">
                  {averageImprovement}%
                </div>
                <div className="text-yellow-400 text-sm">Average Improvement</div>
              </div>
              <div className="text-center p-4 bg-orange-400/20 rounded-lg border border-orange-400/30">
                <div className="text-2xl font-bold text-orange-200">
                  {Object.values(biruAssessments).filter(assessment => assessment.completed).length > 0 ? 'Rising' : 'Ready to Rise'}
                </div>
                <div className="text-orange-300 text-sm">Phoenix Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cognitive Assessment Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-1 mb-8">
            <TabsTrigger 
              value="attention" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white`}
            >
              Attention
            </TabsTrigger>
            <TabsTrigger 
              value="processing" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white`}
            >
              Processing
            </TabsTrigger>
            <TabsTrigger 
              value="memory" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white`}
            >
              Memory
            </TabsTrigger>
            <TabsTrigger 
              value="executive" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white`}
            >
              Executive
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white`}
            >
              Language
            </TabsTrigger>
            <TabsTrigger 
              value="visual" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white`}
            >
              Visual
            </TabsTrigger>
          </TabsList>

          {/* Attention & Concentration */}
          <TabsContent value="attention">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Attention & Concentration
                  {biruAssessments.attention.completed && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Current Score</span>
                    <span className="text-sm font-medium text-white">{biruAssessments.attention.score}%</span>
                  </div>
                  <Progress value={biruAssessments.attention.score} className="h-2 bg-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${biruAssessments.attention.score}%` }}
                    />
                  </Progress>
                  {biruAssessments.attention.completed && (
                    <div className="mt-2 text-xs text-green-400">
                      +{biruAssessments.attention.improvement}% improvement from previous assessment
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Exercise Breakdown</h3>
                    <div className="space-y-4">
                      {biruAssessments.attention.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{exercise.name}</span>
                          {exercise.completed ? (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                              {exercise.score}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Clinical Insights</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        Attention is your ability to focus on specific stimuli while filtering out distractions. 
                        Your performance shows significant improvement in sustained attention tasks.
                      </p>
                      <p>
                        Recommended focus: Continue working on divided attention exercises to improve 
                        your ability to manage multiple tasks simultaneously.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleStartAssessment('attention')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Start Assessment
                      </Button>
                      <Button 
                        onClick={() => handleStartTraining('attention')}
                        variant="outline" 
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                      >
                        Begin Training Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processing Speed */}
          <TabsContent value="processing">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  Processing Speed
                  {biruAssessments.processing.completed && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Current Score</span>
                    <span className="text-sm font-medium text-white">{biruAssessments.processing.score}%</span>
                  </div>
                  <Progress value={biruAssessments.processing.score} className="h-2 bg-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${biruAssessments.processing.score}%` }}
                    />
                  </Progress>
                  {biruAssessments.processing.completed && (
                    <div className="mt-2 text-xs text-green-400">
                      +{biruAssessments.processing.improvement}% improvement from previous assessment
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Exercise Breakdown</h3>
                    <div className="space-y-4">
                      {biruAssessments.processing.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{exercise.name}</span>
                          {exercise.completed ? (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                              {exercise.score}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Clinical Insights</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        Processing speed refers to how quickly you can perform cognitive tasks. 
                        Your visual processing has shown the most significant improvement.
                      </p>
                      <p>
                        Recommended focus: Continue with decision speed exercises to improve 
                        your ability to make quick, accurate decisions under time pressure.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleStartAssessment('processing')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Start Assessment
                      </Button>
                      <Button 
                        onClick={() => handleStartTraining('processing')}
                        variant="outline" 
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                      >
                        Begin Training Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Function */}
          <TabsContent value="memory">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  Memory Function
                  {biruAssessments.memory.completed && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Current Score</span>
                    <span className="text-sm font-medium text-white">{biruAssessments.memory.score}%</span>
                  </div>
                  <Progress value={biruAssessments.memory.score} className="h-2 bg-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${biruAssessments.memory.score}%` }}
                    />
                  </Progress>
                  {biruAssessments.memory.completed && (
                    <div className="mt-2 text-xs text-green-400">
                      +{biruAssessments.memory.improvement}% improvement from previous assessment
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Exercise Breakdown</h3>
                    <div className="space-y-4">
                      {biruAssessments.memory.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{exercise.name}</span>
                          {exercise.completed ? (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                              {exercise.score}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Clinical Insights</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        Memory function encompasses your ability to encode, store, and retrieve information. 
                        Your working memory shows the strongest performance.
                      </p>
                      <p>
                        Recommended focus: Continue with comprehensive memory exercises to maintain 
                        your balanced improvement across all memory domains.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleStartAssessment('memory')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Start Assessment
                      </Button>
                      <Button 
                        onClick={() => handleStartTraining('memory')}
                        variant="outline" 
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                      >
                        Begin Training Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Executive Function */}
          <TabsContent value="executive">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Executive Function
                  {biruAssessments.executive.completed && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Current Score</span>
                    <span className="text-sm font-medium text-white">{biruAssessments.executive.score}%</span>
                  </div>
                  <Progress value={biruAssessments.executive.score} className="h-2 bg-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${biruAssessments.executive.score}%` }}
                    />
                  </Progress>
                  {biruAssessments.executive.completed && (
                    <div className="mt-2 text-xs text-green-400">
                      +{biruAssessments.executive.improvement}% improvement from previous assessment
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Exercise Breakdown</h3>
                    <div className="space-y-4">
                      {biruAssessments.executive.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{exercise.name}</span>
                          {exercise.completed ? (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                              {exercise.score}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Clinical Insights</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        Executive function involves higher-level cognitive processes like planning and decision-making. 
                        Your planning abilities have shown remarkable improvement.
                      </p>
                      <p>
                        Recommended focus: Begin cognitive flexibility exercises to enhance your 
                        ability to adapt to changing situations and requirements.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleStartAssessment('executive')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Start Assessment
                      </Button>
                      <Button 
                        onClick={() => handleStartTraining('executive')}
                        variant="outline" 
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                      >
                        Begin Training Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Processing */}
          <TabsContent value="language">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  Language Processing
                  {biruAssessments.language.completed && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Current Score</span>
                    <span className="text-sm font-medium text-white">{biruAssessments.language.score || 'Not Started'}%</span>
                  </div>
                  <Progress value={biruAssessments.language.score} className="h-2 bg-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${biruAssessments.language.score}%` }}
                    />
                  </Progress>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Exercise Breakdown</h3>
                    <div className="space-y-4">
                      {biruAssessments.language.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{exercise.name}</span>
                          {exercise.completed ? (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                              {exercise.score}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Clinical Insights</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        Language processing involves understanding and producing verbal and written communication. 
                        You have not yet completed this assessment.
                      </p>
                      <p>
                        Recommended focus: Begin with the comprehension assessment to establish 
                        your baseline language processing abilities.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleStartAssessment('language')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Start Assessment
                      </Button>
                      <Button 
                        onClick={() => handleStartTraining('language')}
                        variant="outline" 
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                        disabled={!biruAssessments.language.completed}
                      >
                        Begin Training Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visual-Spatial Skills */}
          <TabsContent value="visual">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Visual-Spatial Skills
                  {biruAssessments.visual.completed && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">Completed</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Current Score</span>
                    <span className="text-sm font-medium text-white">{biruAssessments.visual.score || 'Not Started'}%</span>
                  </div>
                  <Progress value={biruAssessments.visual.score} className="h-2 bg-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${biruAssessments.visual.score}%` }}
                    />
                  </Progress>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Exercise Breakdown</h3>
                    <div className="space-y-4">
                      {biruAssessments.visual.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{exercise.name}</span>
                          {exercise.completed ? (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                              {exercise.score}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400 border-gray-600">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-300">Clinical Insights</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        Visual-spatial skills involve understanding and manipulating visual information in space. 
                        You have not yet completed this assessment.
                      </p>
                      <p>
                        Recommended focus: Begin with the visual perception assessment to establish 
                        your baseline visual-spatial abilities.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleStartAssessment('visual')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Start Assessment
                      </Button>
                      <Button 
                        onClick={() => handleStartTraining('visual')}
                        variant="outline" 
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                        disabled={!biruAssessments.visual.completed}
                      >
                        Begin Training Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Phoenix Recovery Journey */}
        <Card className="mt-8 bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur-sm border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-orange-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              Your Phoenix Recovery Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Separator className="absolute top-4 left-0 w-full border-t-2 border-dashed border-orange-500/30" />
              
              <div className="relative z-10 flex justify-between">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-orange-300">Assessment</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-orange-300">Training</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Integration</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Mastery</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Rebirth</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-orange-300 mb-4">You are currently in the <span className="font-bold">Training Phase</span> of your cognitive recovery journey</p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                View Recovery Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MindTraining;
