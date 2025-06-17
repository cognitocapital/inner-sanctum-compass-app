
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Computer, 
  Brain, 
  ArrowLeft, 
  ExternalLink,
  BookOpen,
  Info,
  Target,
  Zap
} from "lucide-react";

const TBIPrograms = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const computerPrograms = [
    {
      name: "Cogmed QM",
      description: "Focuses on working memory and attention, available through certified providers like healthcare professionals.",
      website: "https://www.cogmed.com/training",
      effectiveness: "High for Cognition",
      availability: "Commercially Available",
      keyFindings: "Improves working memory (p<0.045), cognition (p<0.044)",
      sessions: "25 sessions over 5 weeks, 30-45 minutes daily",
      methodology: "Involves 25 sessions over 5 weeks, with daily exercises lasting 30-45 minutes. Uses adaptive technology to adjust difficulty based on performance."
    },
    {
      name: "RehaCom", 
      description: "A comprehensive tool for cognitive training, widely used in rehab centers.",
      website: "https://www.hasomed.de/en/rehacom.html",
      effectiveness: "High for Cognition",
      availability: "Commercially Available",
      keyFindings: "Improves neuropsychological status, memory (p<0.05)",
      sessions: "Adjustable difficulty, tailored to cognitive deficits",
      methodology: "Computer-based exercises with adjustable difficulty levels, tailored to specific cognitive deficits."
    },
    {
      name: "Parrott Software",
      description: "Targets attention and memory, though it's less commonly available and more research-oriented.",
      website: "#",
      effectiveness: "Moderate to Variable",
      availability: "Research-Oriented",
      keyFindings: "Increases attention (p<0.005), memory (p<0.05)",
      sessions: "Computer-based exercises with adaptive difficulty",
      methodology: "Uses computer-based exercises to target specific cognitive domains, with adaptive difficulty to match patient progress."
    },
    {
      name: "ProMotor Exercise Games",
      description: "Uses virtual reality to improve executive functions, often found in specialized centers.",
      website: "#",
      effectiveness: "High for Motor, Cognition",
      availability: "Specialized Centers",
      keyFindings: "Improves executive function tasks (p=0.02, p=0.01)",
      sessions: "Interactive VR games simulating real-world tasks",
      methodology: "Interactive games delivered through virtual reality, simulating real-world tasks to enhance cognitive and motor outcomes."
    },
    {
      name: "Attention Process Training (APT-3)",
      description: "Targets attention training with structured exercises for focused, selective, and divided attention.",
      website: "#",
      effectiveness: "Moderate",
      availability: "Via Specialists",
      keyFindings: "Improves task difficulty, trend toward daily task generalization",
      sessions: "Structured attention exercises",
      methodology: "Involves structured exercises for focused, selective, and divided attention."
    },
    {
      name: "Lumosity",
      description: "General brain training app offering various cognitive games, but not TBI-specific.",
      website: "https://www.lumosity.com/",
      effectiveness: "Less Specific for TBI",
      availability: "Consumer App",
      keyFindings: "Mixed results for TBI, general cognitive improvements",
      sessions: "Adaptive games for memory, attention, problem-solving",
      methodology: "Provides adaptive games for memory, attention, and problem-solving, accessible at home or in clinical settings."
    },
    {
      name: "Virtual Reality CBT",
      description: "A 12-session program using virtual reality to improve cognition and memory.",
      website: "#",
      effectiveness: "High for Cognition",
      availability: "Research Settings",
      keyFindings: "Improves recall (p<0.05), ongoing tasks (p<0.01)",
      sessions: "12 sessions, 30-60 minutes in VR environments",
      methodology: "Involves immersive virtual environments to simulate real-world tasks and challenges, with sessions typically lasting 30-60 minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-indigo-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-indigo-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-purple-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-blue-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-blue-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-indigo-500/35"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-indigo-200 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Computer className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-100 mb-4 drop-shadow-lg">
            TBI Recovery Programs
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
            Comprehensive computer-based rehabilitation resources and research-backed cognitive training tools for TBI recovery.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-indigo-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600">Overview</TabsTrigger>
            <TabsTrigger value="programs" className="data-[state=active]:bg-indigo-600">Programs</TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-indigo-600">Research</TabsTrigger>
            <TabsTrigger value="building" className="data-[state=active]:bg-indigo-600">Building</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Key Points */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-indigo-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-100 flex items-center gap-3">
                    <Info className="h-6 w-6" />
                    Key Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-indigo-200">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      Research suggests computer-based programs like Cogmed QM and RehaCom improve cognitive functions in TBI rehabilitation.
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      It seems likely that virtual reality programs, such as ProMotor Exercise Games, enhance executive functions and motor skills.
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      The evidence leans toward these programs being effective, but their availability and long-term benefits vary, with ongoing debates about standardization.
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      Controversy exists on the best methods, with some programs like Lumosity being less specific to TBI.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Direct Answer */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-indigo-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-100 flex items-center gap-3">
                    <Target className="h-6 w-6" />
                    Direct Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-100 mb-2">Introduction</h3>
                    <p className="text-indigo-200 text-sm">
                      Computer-based programs for TBI (Traumatic Brain Injury) rehabilitation are tools designed to help improve cognitive functions like memory, attention, and problem-solving. These programs are often used alongside other therapies to support recovery.
                    </p>
                  </div>
                  
                  <Separator className="bg-indigo-500/20" />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-100 mb-2">Considerations</h3>
                    <p className="text-indigo-200 text-sm">
                      The evidence suggests these programs work, but there's debate about which is best and how to standardize them. If you're looking for options, consult a rehab specialist to find the right fit for your needs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-indigo-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-100">Available Programs</CardTitle>
                <p className="text-indigo-200">Comprehensive list of computer-based TBI rehabilitation programs</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {computerPrograms.map((program, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-indigo-500/20">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-indigo-100 text-lg">{program.name}</h4>
                            {program.website !== "#" && (
                              <a 
                                href={program.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-300 hover:text-indigo-200"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <p className="text-indigo-200 text-sm mb-3">{program.description}</p>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="border-green-500/50 text-green-300 text-xs">
                                {program.effectiveness}
                              </Badge>
                              <Badge variant="outline" className="border-orange-500/50 text-orange-300 text-xs">
                                {program.availability}
                              </Badge>
                            </div>
                            <p className="text-xs text-indigo-300"><strong>Key Findings:</strong> {program.keyFindings}</p>
                            <p className="text-xs text-indigo-300"><strong>Sessions:</strong> {program.sessions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research">
            <div className="space-y-6">
              {/* Research Findings Table */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-indigo-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-100 flex items-center gap-3">
                    <BookOpen className="h-6 w-6" />
                    Research Findings Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-indigo-500/30">
                        <TableHead className="text-indigo-200">Program Name</TableHead>
                        <TableHead className="text-indigo-200">Key Findings</TableHead>
                        <TableHead className="text-indigo-200">Effectiveness</TableHead>
                        <TableHead className="text-indigo-200">Availability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {computerPrograms.map((program, index) => (
                        <TableRow key={index} className="border-indigo-500/20">
                          <TableCell className="text-indigo-100 font-medium">{program.name}</TableCell>
                          <TableCell className="text-indigo-200 text-sm">{program.keyFindings}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-green-500/50 text-green-300 text-xs">
                              {program.effectiveness}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-orange-500/50 text-orange-300 text-xs">
                              {program.availability}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Methodologies */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-indigo-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-indigo-100">Research Methodologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-indigo-200 text-sm">
                    <div>
                      <h4 className="font-semibold text-indigo-100 mb-2">Study Types</h4>
                      <p>Included randomized controlled trials (RCTs), systematic reviews, and case studies. For instance, Cogmed QM studies often used RCTs, while Virtual Reality CBT relied on pilot studies.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-100 mb-2">Intervention Durations</h4>
                      <p>Ranged from short-term (e.g., 5 weeks for Cogmed QM) to longer-term (e.g., 12 sessions for Virtual Reality CBT), with varying session lengths based on patient needs.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-100 mb-2">Outcome Measures</h4>
                      <p>Encompassed cognitive assessments (e.g., memory, attention, executive function), functional outcomes (e.g., daily living skills), and quality of life.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="building">
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-indigo-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-100 flex items-center gap-3">
                    <Zap className="h-6 w-6" />
                    Building New Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-indigo-200">
                      Building new computer-based programs for TBI rehabilitation is a complex endeavor that requires significant resources and expertise.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-indigo-100">Requirements</h3>
                        <ul className="space-y-2 text-indigo-200 text-sm">
                          <li>• Multidisciplinary team including psychologists, neurologists, and software developers</li>
                          <li>• Significant financial and technical resources</li>
                          <li>• Research foundation in cognitive psychology and neurorehabilitation</li>
                          <li>• Clinical trial validation and testing</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-indigo-100">Challenges</h3>
                        <ul className="space-y-2 text-indigo-200 text-sm">
                          <li>• Ensuring accessibility and user-friendly design</li>
                          <li>• Standardization across different TBI severities</li>
                          <li>• Long-term efficacy validation</li>
                          <li>• Variability in TBI severity and patient needs</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/20 mt-6">
                      <h3 className="text-lg font-semibold text-orange-100 mb-3">Recommendation</h3>
                      <p className="text-orange-200 text-sm">
                        Given these complexities, it is more practical for individuals to access existing programs through rehabilitation centers or certified providers, rather than building new ones, unless there is a specific innovation or unmet need.
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
  );
};

export default TBIPrograms;
