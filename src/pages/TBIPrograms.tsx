import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Monitor, Gamepad2, Eye, Target, Zap, ExternalLink } from "lucide-react";
import { MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileHeader } from "@/components/ui/mobile-header";
import { cn } from "@/lib/utils";

const programs = [
  {
    name: "Cogmed QM",
    icon: Target,
    color: "green",
    description: "Working memory and attention training",
    features: ["25 sessions / 5 weeks", "Adaptive technology", "120+ peer-reviewed studies"],
    url: "https://www.cogmed.com/training",
    available: true
  },
  {
    name: "RehaCom",
    icon: Monitor,
    color: "purple",
    description: "Comprehensive cognitive rehabilitation",
    features: ["Adjustable difficulty", "Clinical setting focused", "Widely used in rehab"],
    url: "https://www.hasomed.de/en/rehacom.html",
    available: true
  },
  {
    name: "ProMotor VR",
    icon: Gamepad2,
    color: "orange",
    description: "VR-based executive function training",
    features: ["Interactive VR games", "Real-world simulation", "Specialized centers"],
    url: null,
    available: false
  },
  {
    name: "APT-3",
    icon: Eye,
    color: "teal",
    description: "Attention Process Training",
    features: ["Structured exercises", "Clinical and home use", "Available via specialists"],
    url: null,
    available: true
  },
  {
    name: "Lumosity",
    icon: Zap,
    color: "yellow",
    description: "General brain training app",
    features: ["Adaptive games", "Consumer accessible", "Mixed TBI results"],
    url: "https://www.lumosity.com/",
    available: true
  },
  {
    name: "VR CBT",
    icon: Brain,
    color: "pink",
    description: "Virtual reality cognitive training",
    features: ["Immersive VR", "12-session program", "Research settings only"],
    url: null,
    available: false
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; icon: string; button: string }> = {
    green: { bg: "from-green-900/80 to-blue-900/80", border: "border-green-500/30", text: "text-green-100", icon: "bg-green-500", button: "bg-green-600 hover:bg-green-700" },
    purple: { bg: "from-purple-900/80 to-blue-900/80", border: "border-purple-500/30", text: "text-purple-100", icon: "bg-purple-500", button: "bg-purple-600 hover:bg-purple-700" },
    orange: { bg: "from-orange-900/80 to-red-900/80", border: "border-orange-500/30", text: "text-orange-100", icon: "bg-orange-500", button: "bg-orange-600 hover:bg-orange-700" },
    teal: { bg: "from-teal-900/80 to-cyan-900/80", border: "border-teal-500/30", text: "text-teal-100", icon: "bg-teal-500", button: "bg-teal-600 hover:bg-teal-700" },
    yellow: { bg: "from-yellow-900/80 to-orange-900/80", border: "border-yellow-500/30", text: "text-yellow-100", icon: "bg-yellow-500", button: "bg-yellow-600 hover:bg-yellow-700" },
    pink: { bg: "from-pink-900/80 to-purple-900/80", border: "border-pink-500/30", text: "text-pink-100", icon: "bg-pink-500", button: "bg-pink-600 hover:bg-pink-700" },
  };
  return colors[color] || colors.blue;
};

const TBIPrograms = () => {
  return (
    <MobilePageContainer hasBottomNav={false} className="bg-gradient-to-b from-gray-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 bg-blue-500/50 rounded-full animate-[float_3s_ease-in-out_infinite]"
            style={{ left: `${20 + i * 30}%`, top: `${15 + i * 20}%`, animationDelay: `${i}s` }} />
        ))}
      </div>
      
      <div className="relative z-10">
        <MobileHeader
          title="TBI Programs"
          subtitle="Evidence-based computer programs for cognitive recovery"
          backHref="/dashboard"
          backLabel="Dashboard"
          accentColor="blue"
          icon={
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Brain className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
          }
        />

        {/* Key Findings */}
        <div className="px-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-blue-500/30">
            <CardContent className="p-4 space-y-2 text-blue-200 text-sm">
              <p>• Cogmed and RehaCom show improved cognitive functions in TBI rehab</p>
              <p>• VR programs enhance executive functions and motor skills</p>
              <p>• Evidence supports effectiveness but availability varies</p>
            </CardContent>
          </Card>
        </div>

        {/* Programs Grid */}
        <div className="px-4 pb-8">
          <h2 className="text-lg md:text-2xl font-serif text-center mb-4 text-white">Available Programs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => {
              const colors = getColorClasses(program.color);
              const Icon = program.icon;
              
              return (
                <Card key={program.name} className={cn("backdrop-blur-sm hover:scale-[1.02] transition-transform", `bg-gradient-to-br ${colors.bg} ${colors.border}`)}>
                  <CardHeader className="pb-2 text-center">
                    <div className={cn("mx-auto mb-2 p-2.5 rounded-full w-fit", colors.icon)}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className={cn("text-base md:text-lg", colors.text)}>{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-gray-300">{program.description}</p>
                    <ul className="text-xs space-y-1 text-gray-400">
                      {program.features.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                    {program.url ? (
                      <Button asChild size="sm" className={cn("w-full text-xs", colors.button)}>
                        <a href={program.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 h-3 w-3" />
                          Learn More
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full text-xs bg-gray-600 cursor-not-allowed" disabled>
                        {program.available ? 'Contact Specialist' : 'Research Only'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Research Links */}
        <div className="px-4 pb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-gray-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-100">Research Citations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5510482/" target="_blank" rel="noopener noreferrer" 
                className="block text-blue-300 hover:text-blue-200 truncate">
                • Computer-Based Cognitive Rehabilitation for TBI
              </a>
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9775990/" target="_blank" rel="noopener noreferrer"
                className="block text-blue-300 hover:text-blue-200 truncate">
                • Innovative Technologies in TBI Neurorehabilitation
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobilePageContainer>
  );
};

export default TBIPrograms;
