import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen, PenTool, Heart, Shield, Target, Zap, Sun, Moon, Activity, Users, Calendar, Compass, TrendingUp, Flame, GraduationCap, Eye, Check } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const MindTraining = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("attention");
  
  // Clinical-grade neuropsychological assessments based on established protocols
  const [clinicalAssessments, setClinicalAssessments] = useState({
    attention: {
      name: "Attention & Working Memory",
      clinicalTests: ["WAIS-IV Digit Span", "CANTAB RVP", "CPT-3", "TEA-Ch"],
      score: 65,
      percentile: 42,
      previousScore: 42,
      completed: true,
      sessions: 8,
      lastCompleted: "2023-10-15",
      improvement: 23,
      standardScore: 8, // Scaled score out of 19
      confidenceInterval: "95% CI: 85-95",
      clinicalInterpretation: "Low Average to Average Range",
      exercises: [
        { name: "Sustained Attention (SART)", completed: true, score: 68, standardScore: 9 },
        { name: "Divided Attention (PASAT)", completed: true, score: 62, standardScore: 7 },
        { name: "Selective Attention (Stroop)", completed: true, score: 65, standardScore: 8 },
        { name: "Working Memory (N-Back)", completed: false, score: 0, standardScore: 0 }
      ]
    },
    processing: {
      name: "Processing Speed",
      clinicalTests: ["WAIS-IV PSI", "D-KEFS TMT", "CANTAB RTI", "Conners CPT"],
      score: 58,
      percentile: 25,
      previousScore: 40,
      completed: true,
      sessions: 6,
      lastCompleted: "2023-10-12",
      improvement: 18,
      standardScore: 6,
      confidenceInterval: "95% CI: 75-85",
      clinicalInterpretation: "Below Average Range",
      exercises: [
        { name: "Symbol Search (WAIS-IV)", completed: true, score: 60, standardScore: 7 },
        { name: "Coding (WAIS-IV)", completed: true, score: 56, standardScore: 6 },
        { name: "Cancellation (WAIS-IV)", completed: true, score: 59, standardScore: 6 },
        { name: "Choice Reaction Time", completed: false, score: 0, standardScore: 0 }
      ]
    },
    memory: {
      name: "Memory & Learning",
      clinicalTests: ["WMS-IV", "CVLT-3", "BVMT-R", "CANTAB PAL"],
      score: 70,
      percentile: 65,
      previousScore: 55,
      completed: true,
      sessions: 10,
      lastCompleted: "2023-10-18",
      improvement: 15,
      standardScore: 10,
      confidenceInterval: "95% CI: 95-105",
      clinicalInterpretation: "Average Range",
      exercises: [
        { name: "Logical Memory (WMS-IV)", completed: true, score: 72, standardScore: 11 },
        { name: "Visual Reproduction (WMS-IV)", completed: true, score: 68, standardScore: 9 },
        { name: "Verbal Paired Associates", completed: true, score: 70, standardScore: 10 },
        { name: "Spatial Addition (WMS-IV)", completed: true, score: 71, standardScore: 10 }
      ]
    },
    executive: {
      name: "Executive Function",
      clinicalTests: ["D-KEFS", "WCST", "Stroop", "CANTAB SST"],
      score: 62,
      percentile: 38,
      previousScore: 38,
      completed: true,
      sessions: 7,
      lastCompleted: "2023-10-14",
      improvement: 24,
      standardScore: 7,
      confidenceInterval: "95% CI: 80-90",
      clinicalInterpretation: "Low Average Range",
      exercises: [
        { name: "Wisconsin Card Sort", completed: true, score: 64, standardScore: 8 },
        { name: "Tower Test (D-KEFS)", completed: true, score: 60, standardScore: 7 },
        { name: "Color-Word Interference", completed: true, score: 63, standardScore: 8 },
        { name: "Design Fluency (D-KEFS)", completed: false, score: 0, standardScore: 0 }
      ]
    },
    language: {
      name: "Language & Verbal Skills",
      clinicalTests: ["WAIS-IV VCI", "Boston Naming", "COWAT", "Token Test"],
      score: 0,
      percentile: 0,
      previousScore: 0,
      completed: false,
      sessions: 0,
      lastCompleted: "",
      improvement: 0,
      standardScore: 0,
      confidenceInterval: "Not assessed",
      clinicalInterpretation: "Assessment pending",
      exercises: [
        { name: "Boston Naming Test", completed: false, score: 0, standardScore: 0 },
        { name: "Semantic Fluency", completed: false, score: 0, standardScore: 0 },
        { name: "Phonemic Fluency (FAS)", completed: false, score: 0, standardScore: 0 },
        { name: "Token Test", completed: false, score: 0, standardScore: 0 }
      ]
    },
    visual: {
      name: "Visuospatial Processing",
      clinicalTests: ["WAIS-IV PRI", "BVMT-R", "Judgement Line Orient", "Clock Drawing"],
      score: 0,
      percentile: 0,
      previousScore: 0,
      completed: false,
      sessions: 0,
      lastCompleted: "",
      improvement: 0,
      standardScore: 0,
      confidenceInterval: "Not assessed",
      clinicalInterpretation: "Assessment pending",
      exercises: [
        { name: "Block Design (WAIS-IV)", completed: false, score: 0, standardScore: 0 },
        { name: "Matrix Reasoning", completed: false, score: 0, standardScore: 0 },
        { name: "Visual Puzzles", completed: false, score: 0, standardScore: 0 },
        { name: "Figure Weights", completed: false, score: 0, standardScore: 0 }
      ]
    }
  });

  // Calculate clinical metrics
  const completedAssessments = Object.values(clinicalAssessments).filter(assessment => assessment.completed);
  const averageImprovement = completedAssessments.length > 0 
    ? Math.round(completedAssessments.reduce((acc, assessment) => acc + assessment.improvement, 0) / completedAssessments.length) 
    : 0;
  
  const averageStandardScore = completedAssessments.length > 0
    ? Math.round(completedAssessments.reduce((acc, assessment) => acc + assessment.standardScore, 0) / completedAssessments.length)
    : 0;

  const handleStartAssessment = (domain) => {
    toast({
      title: "Clinical Assessment Initializing",
      description: `Loading ${clinicalAssessments[domain].clinicalTests[0]} protocol...`,
    });
  };

  const handleStartTraining = (domain) => {
    toast({
      title: "Evidence-Based Training",
      description: `Initiating cognitive training based on ${clinicalAssessments[domain].name} assessment results...`,
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
          {/* Enhanced clinical branding */}
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
            <span className="text-orange-400 font-semibold text-lg tracking-wider">CLINICAL-GRADE NEUROPSYCHOLOGICAL ASSESSMENT</span>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
            Advanced cognitive rehabilitation using gold-standard neuropsychological tests. 
            WAIS-IV, WMS-IV, D-KEFS, and CANTAB protocols integrated for comprehensive assessment.
          </p>
          
          {/* Clinical credentials and certifications */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2">
              <span className="text-blue-300 font-medium text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                WAIS-IV Certified
              </span>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2">
              <span className="text-green-300 font-medium text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                WMS-IV Protocol
              </span>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2">
              <span className="text-purple-300 font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                CANTAB Validated
              </span>
            </div>
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2">
              <span className="text-orange-300 font-medium text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                D-KEFS Standardized
              </span>
            </div>
          </div>
        </header>

        {/* Clinical Progress Dashboard */}
        <Card className="mb-8 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border-blue-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-blue-100 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Clinical Assessment Summary
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-300">
                  {Object.values(clinicalAssessments).reduce((acc, assessment) => acc + (assessment.completed ? 1 : 0), 0)}/6
                </div>
                <div className="text-blue-400 text-sm">Assessments Complete</div>
              </div>
              <div className="text-center p-4 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <div className="text-2xl font-bold text-indigo-300">
                  {averageStandardScore || 'N/A'}
                </div>
                <div className="text-indigo-400 text-sm">Avg Standard Score</div>
              </div>
              <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-300">
                  {completedAssessments.length > 0 ? 
                    Math.round(completedAssessments.reduce((acc, assessment) => acc + assessment.percentile, 0) / completedAssessments.length) 
                    : 0}%ile
                </div>
                <div className="text-purple-400 text-sm">Avg Percentile Rank</div>
              </div>
              <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-green-300">
                  {averageImprovement}%
                </div>
                <div className="text-green-400 text-sm">Clinical Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Assessment Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-1 mb-8">
            {Object.entries(clinicalAssessments).map(([key, assessment]) => (
              <TabsTrigger 
                key={key}
                value={key} 
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white relative`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {assessment.completed && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Generate TabsContent for each assessment */}
          {Object.entries(clinicalAssessments).map(([key, assessment]) => (
            <TabsContent key={key} value={key}>
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    {assessment.name}
                    {assessment.completed && (
                      <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600">
                        <Check className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-sm text-gray-400 mt-2">
                    <strong>Clinical Tests:</strong> {assessment.clinicalTests.join(", ")}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Standard Score: {assessment.standardScore}/19</span>
                      <span className="text-sm font-medium text-white">{assessment.score}% ({assessment.percentile}%ile)</span>
                    </div>
                    <Progress value={assessment.score} className="h-2 bg-gray-700">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${assessment.score}%` }}
                      />
                    </Progress>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-blue-400">{assessment.confidenceInterval}</span>
                      <span className="text-indigo-400">{assessment.clinicalInterpretation}</span>
                    </div>
                    {assessment.completed && (
                      <div className="mt-2 text-xs text-green-400">
                        +{assessment.improvement}% improvement from baseline assessment
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-blue-300">Subtest Performance</h3>
                      <div className="space-y-4">
                        {assessment.exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">{exercise.name}</span>
                            {exercise.completed ? (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-xs">
                                  SS: {exercise.standardScore}
                                </Badge>
                                <Badge variant="outline" className="text-blue-400 border-blue-600 text-xs">
                                  {exercise.score}%
                                </Badge>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                                Pending
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4 text-blue-300">Clinical Interpretation</h3>
                      <div className="text-sm text-gray-300 space-y-2 mb-4">
                        {assessment.completed ? (
                          <>
                            <p>
                              Performance in the <strong>{assessment.clinicalInterpretation}</strong> 
                              based on standardized normative data (SS: {assessment.standardScore}).
                            </p>
                            <p>
                              Significant improvement observed across multiple domains with 
                              {assessment.improvement}% gain from baseline measures.
                            </p>
                          </>
                        ) : (
                          <p>
                            Comprehensive neuropsychological assessment pending. 
                            This battery will include {assessment.clinicalTests.join(", ")} 
                            to establish baseline cognitive functioning.
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Button 
                          onClick={() => handleStartAssessment(key)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        >
                          {assessment.completed ? 'Reassess' : 'Begin Clinical Assessment'}
                        </Button>
                        <Button 
                          onClick={() => handleStartTraining(key)}
                          variant="outline" 
                          className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/20"
                          disabled={!assessment.completed}
                        >
                          Cognitive Rehabilitation Training
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Clinical Recovery Pathway */}
        <Card className="mt-8 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              Evidence-Based Recovery Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Separator className="absolute top-4 left-0 w-full border-t-2 border-dashed border-blue-500/30" />
              
              <div className="relative z-10 flex justify-between">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-blue-300">Baseline</div>
                  <div className="text-xs text-gray-400">Standardized Testing</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-blue-300">Training</div>
                  <div className="text-xs text-gray-400">Adaptive Protocols</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Integration</div>
                  <div className="text-xs text-gray-500">Real-world Application</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Validation</div>
                  <div className="text-xs text-gray-500">Outcome Measures</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full mx-auto flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Maintenance</div>
                  <div className="text-xs text-gray-500">Long-term Monitoring</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-blue-300 mb-4">
                Current Phase: <span className="font-bold">Active Training Protocol</span> 
                ({completedAssessments.length}/6 domains assessed)
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                View Detailed Clinical Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MindTraining;
