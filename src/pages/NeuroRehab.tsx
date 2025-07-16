import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Eye, Mic, Activity, BookOpen, Users, Calendar, TrendingUp, Shield } from "lucide-react";

const NeuroRehab = () => {
    const [selectedModule, setSelectedModule] = useState<string | null>(null);

    const modules = [
        {
            id: "vr-vestibular",
            title: "VR Vestibular Rehabilitation",
            icon: Eye,
            status: "Coming Soon",
            description: "Hospital-grade virtual reality system for balance and spatial orientation recovery",
            features: ["3D Balance Training", "Gaze Stabilization", "Motion Tolerance", "Fall Prevention"]
        },
        {
            id: "cognitive-engine",
            title: "Adaptive Cognitive Training",
            icon: Brain,
            status: "Development",
            description: "AI-powered neuroplasticity-based cognitive rehabilitation modules",
            features: ["Attention Training", "Memory Enhancement", "Executive Function", "Processing Speed"]
        },
        {
            id: "speech-therapy",
            title: "Speech-Language Pathology Suite",
            icon: Mic,
            status: "Research Phase",
            description: "Comprehensive communication and swallowing rehabilitation platform",
            features: ["Aphasia Therapy", "Articulation Training", "Dysphagia Management", "Voice Recovery"]
        },
        {
            id: "analytics",
            title: "Recovery Analytics Dashboard",
            icon: TrendingUp,
            status: "Planning",
            description: "Real-time monitoring and predictive recovery modeling system",
            features: ["EEG Integration", "Progress Tracking", "Outcome Prediction", "Clinical Reports"]
        }
    ];

    const researchPartners = [
        "Mayo Clinic TBI Research",
        "NIH NINDS Database",
        "Shepherd Center",
        "ACRM Guidelines",
        "Cochrane Reviews"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-gray-900 text-white relative overflow-hidden">
            {/* Medical-grade background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse animation-delay-3000"></div>
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <header className="text-center mb-16">
                    <div className="mb-6">
                        <Button asChild variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                            <Link to="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Journey
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Brain className="h-24 w-24 text-blue-400 animate-pulse" />
                            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Phoenix Neuro-Rehabilitation Suite
                    </h1>
                    <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                        Hospital-grade traumatic brain injury rehabilitation platform combining cutting-edge technology 
                        with evidence-based clinical protocols for comprehensive neurological recovery.
                    </p>
                    
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <Badge variant="outline" className="border-green-400 text-green-400">
                            <Shield className="mr-1 h-3 w-3" />
                            FDA Compliant Design
                        </Badge>
                        <Badge variant="outline" className="border-blue-400 text-blue-400">
                            <Users className="mr-1 h-3 w-3" />
                            Clinical Grade
                        </Badge>
                        <Badge variant="outline" className="border-purple-400 text-purple-400">
                            <BookOpen className="mr-1 h-3 w-3" />
                            Evidence-Based
                        </Badge>
                    </div>
                </header>

                {/* Core Modules */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-300">
                        Rehabilitation Modules
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <Card 
                                    key={module.id} 
                                    className="bg-white/10 backdrop-blur-sm border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                                    onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-8 w-8 text-blue-400" />
                                                <CardTitle className="text-white text-xl">
                                                    {module.title}
                                                </CardTitle>
                                            </div>
                                            <Badge 
                                                variant="outline" 
                                                className={`
                                                    ${module.status === 'Coming Soon' ? 'border-yellow-400 text-yellow-400' : ''}
                                                    ${module.status === 'Development' ? 'border-orange-400 text-orange-400' : ''}
                                                    ${module.status === 'Research Phase' ? 'border-purple-400 text-purple-400' : ''}
                                                    ${module.status === 'Planning' ? 'border-gray-400 text-gray-400' : ''}
                                                `}
                                            >
                                                {module.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-blue-200 mb-4">{module.description}</p>
                                        
                                        {selectedModule === module.id && (
                                            <div className="space-y-3 animate-fade-in">
                                                <h4 className="font-semibold text-blue-300">Key Features:</h4>
                                                <ul className="grid grid-cols-2 gap-2">
                                                    {module.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center text-sm text-blue-200">
                                                            <Activity className="h-3 w-3 mr-2 text-blue-400" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Research Integration */}
                <section className="mb-16">
                    <Card className="bg-white/10 backdrop-blur-sm border-blue-400/30">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center text-blue-300 flex items-center justify-center gap-2">
                                <BookOpen className="h-6 w-6" />
                                Clinical Research Integration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-blue-200 text-center mb-6">
                                Real-time integration with leading research institutions and clinical databases 
                                to ensure treatment protocols remain current with latest scientific advances.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {researchPartners.map((partner, index) => (
                                    <div 
                                        key={index}
                                        className="bg-blue-500/20 rounded-lg p-4 text-center border border-blue-400/20"
                                    >
                                        <span className="text-blue-200 text-sm font-medium">{partner}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Live Platform Access */}
                <section className="text-center">
                    <Card className="bg-white/10 backdrop-blur-sm border-green-400/30">
                        <CardHeader>
                            <CardTitle className="text-2xl text-green-300 flex items-center justify-center gap-2">
                                <Activity className="h-6 w-6" />
                                Active Platform Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-green-200 mb-6">
                                Experience the full working rehabilitation platform with real-time assessments, 
                                interactive therapy modules, and comprehensive analytics dashboard.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button 
                                    asChild
                                    size="lg"
                                    className="bg-green-500/30 border-green-400 text-green-300 hover:bg-green-500/40"
                                >
                                    <Link to="/tbi-programs">
                                        <Brain className="mr-2 h-4 w-4" />
                                        Launch Platform
                                    </Link>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                                >
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Research Hub
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Footer */}
                <footer className="text-center mt-16 text-sm text-blue-400">
                    <p>Phoenix Neuro-Rehabilitation Suite - Future of TBI Recovery</p>
                </footer>
            </div>
        </div>
    );
};

export default NeuroRehab;