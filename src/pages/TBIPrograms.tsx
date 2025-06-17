
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Brain, Monitor, Gamepad2, Eye, Target, Zap } from "lucide-react";

const TBIPrograms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-blue-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-cyan-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-blue-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70"></div>
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

        <header className="text-center mb-12">
          <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full w-fit">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            TBI Computer-Based Programs
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-4xl mx-auto leading-relaxed">
            Evidence-based computer programs for Traumatic Brain Injury rehabilitation and cognitive recovery
          </p>
        </header>

        {/* Key Points Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-100">Key Research Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-blue-200">
            <ul className="space-y-3">
              <li>• Research suggests computer-based programs like Cogmed QM and RehaCom improve cognitive functions in TBI rehabilitation.</li>
              <li>• Virtual reality programs, such as ProMotor Exercise Games, enhance executive functions and motor skills.</li>
              <li>• The evidence leans toward these programs being effective, but their availability and long-term benefits vary.</li>
              <li>• Controversy exists on the best methods, with some programs like Lumosity being less specific to TBI.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Available Programs Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-serif text-center mb-8 text-white">Available Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Cogmed QM */}
            <Card className="bg-gradient-to-br from-green-900/80 to-blue-900/80 border-green-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-500 rounded-full w-fit">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-green-100">Cogmed QM</CardTitle>
              </CardHeader>
              <CardContent className="text-green-200 space-y-3">
                <p className="text-sm">Focuses on working memory and attention, available through certified providers.</p>
                <div className="text-xs space-y-1">
                  <div>• 25 sessions over 5 weeks</div>
                  <div>• Adaptive technology</div>
                  <div>• Significant improvements (p&lt;0.045)</div>
                  <div>• 120+ peer-reviewed studies</div>
                </div>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <a href="https://www.cogmed.com/training" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* RehaCom */}
            <Card className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 border-purple-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-500 rounded-full w-fit">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-purple-100">RehaCom</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-200 space-y-3">
                <p className="text-sm">Comprehensive cognitive rehabilitation software targeting attention, memory, and executive functions.</p>
                <div className="text-xs space-y-1">
                  <div>• Adjustable difficulty levels</div>
                  <div>• Clinical setting focused</div>
                  <div>• Memory improvements (p&lt;0.05)</div>
                  <div>• Widely used in rehab centers</div>
                </div>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <a href="https://www.hasomed.de/en/rehacom.html" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* ProMotor Exercise Games */}
            <Card className="bg-gradient-to-br from-orange-900/80 to-red-900/80 border-orange-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-500 rounded-full w-fit">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-orange-100">ProMotor VR Games</CardTitle>
              </CardHeader>
              <CardContent className="text-orange-200 space-y-3">
                <p className="text-sm">Virtual reality-based program for improving executive functions and motor skills.</p>
                <div className="text-xs space-y-1">
                  <div>• Interactive VR games</div>
                  <div>• Real-world task simulation</div>
                  <div>• Executive function gains (p=0.02)</div>
                  <div>• Specialized centers only</div>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" disabled>
                  Research/Clinical Only
                </Button>
              </CardContent>
            </Card>

            {/* APT-3 */}
            <Card className="bg-gradient-to-br from-teal-900/80 to-cyan-900/80 border-teal-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-teal-500 rounded-full w-fit">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-teal-100">APT-3</CardTitle>
              </CardHeader>
              <CardContent className="text-teal-200 space-y-3">
                <p className="text-sm">Attention Process Training for focused, selective, and divided attention.</p>
                <div className="text-xs space-y-1">
                  <div>• Structured attention exercises</div>
                  <div>• Clinical and home use</div>
                  <div>• Task difficulty improvements</div>
                  <div>• Available via specialists</div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Contact Specialist
                </Button>
              </CardContent>
            </Card>

            {/* Lumosity */}
            <Card className="bg-gradient-to-br from-yellow-900/80 to-orange-900/80 border-yellow-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-yellow-500 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-yellow-100">Lumosity</CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-200 space-y-3">
                <p className="text-sm">General brain training app with cognitive games for memory, attention, and problem-solving.</p>
                <div className="text-xs space-y-1">
                  <div>• Adaptive cognitive games</div>
                  <div>• Consumer accessibility</div>
                  <div>• Mixed TBI-specific results</div>
                  <div>• Not TBI-specialized</div>
                </div>
                <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <a href="https://www.lumosity.com/" target="_blank" rel="noopener noreferrer">
                    Try Lumosity
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Virtual Reality CBT */}
            <Card className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-pink-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-pink-500 rounded-full w-fit">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-pink-100">VR CBT</CardTitle>
              </CardHeader>
              <CardContent className="text-pink-200 space-y-3">
                <p className="text-sm">12-session program using virtual reality to improve cognition and memory.</p>
                <div className="text-xs space-y-1">
                  <div>• Immersive VR environments</div>
                  <div>• Real-world task simulation</div>
                  <div>• Improved recall (p&lt;0.05)</div>
                  <div>• Research settings only</div>
                </div>
                <Button className="w-full bg-pink-600 hover:bg-pink-700" disabled>
                  Research Only
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Effectiveness Comparison Table */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-100">Program Effectiveness Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/30">
                  <TableHead className="text-blue-200">Program Name</TableHead>
                  <TableHead className="text-blue-200">Key Findings</TableHead>
                  <TableHead className="text-blue-200">Effectiveness</TableHead>
                  <TableHead className="text-blue-200">Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-blue-500/20">
                  <TableCell className="text-green-200 font-medium">Cogmed QM</TableCell>
                  <TableCell className="text-blue-200">Improves working memory (p&lt;0.045), cognition (p&lt;0.044)</TableCell>
                  <TableCell className="text-green-300">High for Cognition</TableCell>
                  <TableCell className="text-blue-200">Commercially Available</TableCell>
                </TableRow>
                <TableRow className="border-blue-500/20">
                  <TableCell className="text-purple-200 font-medium">RehaCom</TableCell>
                  <TableCell className="text-blue-200">Improves neuropsychological status, memory (p&lt;0.05)</TableCell>
                  <TableCell className="text-green-300">High for Cognition</TableCell>
                  <TableCell className="text-blue-200">Commercially Available</TableCell>
                </TableRow>
                <TableRow className="border-blue-500/20">
                  <TableCell className="text-orange-200 font-medium">ProMotor VR</TableCell>
                  <TableCell className="text-blue-200">Improves executive function tasks (p=0.02, p=0.01)</TableCell>
                  <TableCell className="text-green-300">High for Motor, Cognition</TableCell>
                  <TableCell className="text-yellow-300">Specialized Centers</TableCell>
                </TableRow>
                <TableRow className="border-blue-500/20">
                  <TableCell className="text-teal-200 font-medium">APT-3</TableCell>
                  <TableCell className="text-blue-200">Improves task difficulty, trend toward daily task generalization</TableCell>
                  <TableCell className="text-yellow-300">Moderate</TableCell>
                  <TableCell className="text-blue-200">Via Specialists</TableCell>
                </TableRow>
                <TableRow className="border-blue-500/20">
                  <TableCell className="text-yellow-200 font-medium">Lumosity</TableCell>
                  <TableCell className="text-blue-200">General cognitive improvements, less TBI-specific</TableCell>
                  <TableCell className="text-yellow-300">Variable</TableCell>
                  <TableCell className="text-green-300">Consumer App</TableCell>
                </TableRow>
                <TableRow className="border-blue-500/20">
                  <TableCell className="text-pink-200 font-medium">VR CBT</TableCell>
                  <TableCell className="text-blue-200">Improves recall (p&lt;0.05), ongoing tasks (p&lt;0.01)</TableCell>
                  <TableCell className="text-green-300">High for Cognition</TableCell>
                  <TableCell className="text-red-300">Research Settings</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Building Programs Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-100">Building New Programs</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-200 space-y-4">
            <p>Building new computer-based programs for TBI rehabilitation is complex and requires:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-yellow-100 mb-2">Required Expertise:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Psychologists and neurologists</li>
                  <li>• Software developers</li>
                  <li>• Cognitive psychology researchers</li>
                  <li>• Neurorehabilitation specialists</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-100 mb-2">Challenges:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Significant financial resources</li>
                  <li>• Clinical trials and validation</li>
                  <li>• Standardization across TBI types</li>
                  <li>• Long-term efficacy studies</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-900/30 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Recommendation:</strong> It's more practical to access existing programs through rehabilitation centers or certified providers rather than building new ones, unless there's a specific innovation or unmet need.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Citations */}
        <Card className="bg-white/10 backdrop-blur-sm border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-100">Key Research Citations</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <div className="grid gap-3 text-sm">
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5510482/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors">
                • Computer-Based Cognitive Rehabilitation Interventions for Traumatic Brain Injury: A Critical Review
              </a>
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9775990/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors">
                • Innovative Technologies in the Neurorehabilitation of Traumatic Brain Injury: A Systematic Review
              </a>
              <a href="https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2025.1608645/full" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors">
                • Frontiers in Neurology Comprehensive Review on TBI Rehabilitation
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TBIPrograms;
