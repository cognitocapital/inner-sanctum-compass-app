
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Heart, 
  Wind, 
  Snowflake, 
  Target, 
  Gamepad2, 
  BookOpen, 
  Users, 
  Trophy,
  Computer,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";

const Dashboard = () => {
  const [showComputerPrograms, setShowComputerPrograms] = useState(false);

  const journeyItems = [
    {
      title: "Phoenix Breath Academy",
      description: "Master breathing techniques for recovery and resilience",
      icon: Wind,
      link: "/breathing",
      color: "from-blue-500 to-cyan-500",
      status: "active"
    },
    {
      title: "Cold Forge Mastery",
      description: "Build mental toughness through cold exposure",
      icon: Snowflake,
      link: "/cold-exposure",
      color: "from-cyan-500 to-blue-600",
      status: "active"
    },
    {
      title: "Challenge Tracker",
      description: "Track your daily growth and achievements",
      icon: Target,
      link: "/challenges",
      color: "from-orange-500 to-red-500",
      status: "active"
    },
    {
      title: "Mind Training Grounds",
      description: "Strengthen cognitive abilities and focus",
      icon: Brain,
      link: "/mind",
      color: "from-purple-500 to-indigo-500",
      status: "active"
    },
    {
      title: "Gratitude Journey",
      description: "Cultivate appreciation and positive mindset",
      icon: Heart,
      link: "/gratitude",
      color: "from-pink-500 to-rose-500",
      status: "active"
    }
  ];

  const computerPrograms = [
    {
      name: "Cogmed QM",
      description: "Focuses on working memory and attention, available through certified providers like healthcare professionals.",
      website: "https://www.cogmed.com/training",
      effectiveness: "High for Cognition",
      availability: "Commercially Available",
      keyFindings: "Improves working memory (p<0.045), cognition (p<0.044)",
      sessions: "25 sessions over 5 weeks, 30-45 minutes daily"
    },
    {
      name: "RehaCom", 
      description: "A comprehensive tool for cognitive training, widely used in rehab centers.",
      website: "https://www.hasomed.de/en/rehacom.html",
      effectiveness: "High for Cognition",
      availability: "Commercially Available",
      keyFindings: "Improves neuropsychological status, memory (p<0.05)",
      sessions: "Adjustable difficulty, tailored to cognitive deficits"
    },
    {
      name: "Parrott Software",
      description: "Targets attention and memory, though it's less commonly available and more research-oriented.",
      website: "#",
      effectiveness: "Moderate to Variable",
      availability: "Research-Oriented",
      keyFindings: "Increases attention (p<0.005), memory (p<0.05)",
      sessions: "Computer-based exercises with adaptive difficulty"
    },
    {
      name: "ProMotor Exercise Games",
      description: "Uses virtual reality to improve executive functions, often found in specialized centers.",
      website: "#",
      effectiveness: "High for Motor, Cognition",
      availability: "Specialized Centers",
      keyFindings: "Improves executive function tasks (p=0.02, p=0.01)",
      sessions: "Interactive VR games simulating real-world tasks"
    },
    {
      name: "Attention Process Training (APT-3)",
      description: "Targets attention training with structured exercises for focused, selective, and divided attention.",
      website: "#",
      effectiveness: "Moderate",
      availability: "Via Specialists",
      keyFindings: "Improves task difficulty, trend toward daily task generalization",
      sessions: "Structured attention exercises"
    },
    {
      name: "Lumosity",
      description: "General brain training app offering various cognitive games, but not TBI-specific.",
      website: "https://www.lumosity.com/",
      effectiveness: "Less Specific for TBI",
      availability: "Consumer App",
      keyFindings: "Mixed results for TBI, general cognitive improvements",
      sessions: "Adaptive games for memory, attention, problem-solving"
    },
    {
      name: "Virtual Reality CBT",
      description: "A 12-session program using virtual reality to improve cognition and memory.",
      website: "#",
      effectiveness: "High for Cognition",
      availability: "Research Settings",
      keyFindings: "Improves recall (p<0.05), ongoing tasks (p<0.01)",
      sessions: "12 sessions, 30-60 minutes in VR environments"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-orange-100 mb-4 drop-shadow-lg">
            The Yellow Brick Road
          </h1>
          <p className="text-xl text-orange-200 max-w-3xl mx-auto leading-relaxed">
            Your personal journey to recovery and growth. Each step builds strength, 
            each challenge builds character, each breath builds a better you.
          </p>
        </div>

        {/* Journey Navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {journeyItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link key={index} to={item.link}>
                <Card className="group bg-gradient-to-br from-slate-900/80 to-orange-900/80 border-orange-500/30 hover:border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-orange-100 group-hover:text-white transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200 text-center group-hover:text-orange-100 transition-colors">
                      {item.description}
                    </p>
                    <div className="flex justify-center mt-4">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-500/40">
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Computer-Based Rehabilitation Programs Section */}
        <Card className="bg-gradient-to-br from-slate-900/80 to-blue-900/80 border-blue-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Computer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-100">Computer-Based Rehabilitation Programs</CardTitle>
                  <p className="text-blue-200 text-sm mt-1">Research-backed cognitive training tools for TBI recovery</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowComputerPrograms(!showComputerPrograms)}
                className="text-blue-200 hover:text-white"
              >
                {showComputerPrograms ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          
          {showComputerPrograms && (
            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Key Points */}
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-100 mb-3">Key Points</h3>
                  <ul className="space-y-2 text-blue-200 text-sm">
                    <li>• Research suggests computer-based programs like Cogmed QM and RehaCom improve cognitive functions in TBI rehabilitation.</li>
                    <li>• It seems likely that virtual reality programs, such as ProMotor Exercise Games, enhance executive functions and motor skills.</li>
                    <li>• The evidence leans toward these programs being effective, but their availability and long-term benefits vary, with ongoing debates about standardization.</li>
                    <li>• Controversy exists on the best methods, with some programs like Lumosity being less specific to TBI.</li>
                  </ul>
                </div>

                <Separator className="bg-blue-500/20" />

                {/* Available Programs */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-100 mb-4">Available Programs</h3>
                  <div className="grid gap-4">
                    {computerPrograms.map((program, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-blue-100 text-lg">{program.name}</h4>
                              {program.website !== "#" && (
                                <a 
                                  href={program.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-300 hover:text-blue-200"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            <p className="text-blue-200 text-sm mb-3">{program.description}</p>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-green-500/50 text-green-300 text-xs">
                                  {program.effectiveness}
                                </Badge>
                                <Badge variant="outline" className="border-orange-500/50 text-orange-300 text-xs">
                                  {program.availability}
                                </Badge>
                              </div>
                              <p className="text-xs text-blue-300"><strong>Key Findings:</strong> {program.keyFindings}</p>
                              <p className="text-xs text-blue-300"><strong>Sessions:</strong> {program.sessions}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Building Programs Consideration */}
                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-500/20">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Building Programs</h3>
                  <p className="text-slate-200 text-sm">
                    Building new programs is complex and requires experts like psychologists and software developers. 
                    It's more practical to access existing programs through rehabilitation specialists, as creating new ones 
                    involves significant resources and research to ensure they're effective.
                  </p>
                </div>

                {/* Considerations */}
                <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/20">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Considerations</h3>
                  <p className="text-orange-200 text-sm">
                    The evidence suggests these programs work, but there's debate about which is best and how to standardize them. 
                    If you're looking for options, consult a rehab specialist to find the right fit for your needs.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Book Chapters */}
        <Card className="bg-gradient-to-br from-slate-900/80 to-orange-900/80 border-orange-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-100 flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              What a Journey - The Story
            </CardTitle>
            <p className="text-orange-200">Follow the complete recovery story from beginning to transformation</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/dedication">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Dedication
                </Button>
              </Link>
              <Link to="/prologue">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Prologue
                </Button>
              </Link>
              <Link to="/introduction">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Introduction
                </Button>
              </Link>
              {Array.from({ length: 21 }, (_, i) => (
                <Link key={i} to={`/chapter-${i + 1}`}>
                  <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                    Chapter {i + 1}
                  </Button>
                </Link>
              ))}
              <Link to="/unwritten">
                <Button variant="outline" className="w-full justify-start border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300">
                  Unwritten Chapters
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-purple-100 flex items-center gap-3">
                <Users className="h-5 w-5" />
                Community & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 mb-4 text-sm">
                Connect with recovery resources and expert guidance for your journey.
              </p>
              <Link to="/resources">
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                  Explore Resources
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border-emerald-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-100 flex items-center gap-3">
                <Trophy className="h-5 w-5" />
                Achievement Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-200 mb-4 text-sm">
                Track your progress and celebrate milestones on your recovery journey.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
