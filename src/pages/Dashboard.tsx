import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen, Heart, Users, Play } from "lucide-react";

const Dashboard = () => {
    const [showIntro, setShowIntro] = useState(true);
    const [videoStarted, setVideoStarted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleBeginJourney = () => {
      setVideoStarted(true);
      videoRef.current?.play();
    };

    const handleVideoEnd = () => {
      setShowIntro(false);
    };

    // Video Intro Screen
    if (showIntro) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
          <video
            ref={videoRef}
            src="/video/yellow-brick-road-intro.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            playsInline
          />
          
          {/* Overlay with button - shown before video starts */}
          {!videoStarted && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 text-center drop-shadow-lg px-4">
                Welcome to the Yellow Brick Road
              </h1>
              <Button 
                onClick={handleBeginJourney}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6 shadow-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
        {/* Animated background elements inspired by phoenix flames */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Primary flame particles */}
          <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
          <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
          <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
          <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-45 shadow-lg shadow-orange-500/30"></div>
          <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-35 shadow-lg shadow-orange-500/25"></div>
          <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s] opacity-55 shadow-lg shadow-orange-500/40"></div>
          
          {/* Additional ember particles */}
          <div className="absolute top-32 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_4s] opacity-40"></div>
          <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_5s] opacity-35"></div>
          <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_6s] opacity-30"></div>
          <div className="absolute bottom-24 right-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite_7s] opacity-45"></div>
          <div className="absolute top-1/4 right-1/8 w-1 h-1 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_8s] opacity-40"></div>
          
          {/* Subtle flame trails */}
          <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-[float_3s_ease-in-out_infinite_3.5s] opacity-30"></div>
          <div className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-[float_3s_ease-in-out_infinite_4.5s] opacity-25"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <Button asChild variant="ghost" className="pl-0 text-gray-300 hover:text-white transition-colors">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <header className="text-center mb-12 animate-phoenix-rise">
            {/* Phoenix image for dashboard */}
            <div className="relative mb-6 group mx-auto w-24 h-24">
              <div 
                className="w-full h-full rounded-full border-4 border-orange-500/40 shadow-2xl hover:scale-110 transition-all duration-700 cursor-pointer phoenix-image"
                style={{
                  backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              {/* Flame particles around phoenix */}
              <div className="absolute -top-4 -left-4 w-4 h-4 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-90"></div>
              <div className="absolute -top-6 right-12 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.8s] opacity-75"></div>
              <div className="absolute top-6 -right-5 w-3.5 h-3.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.2s] opacity-85"></div>
              <div className="absolute bottom-12 -left-6 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.3s] opacity-65"></div>
              <div className="absolute -bottom-5 right-8 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-80"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
              Yellow Brick Road
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed">
              Essential clinical-grade tools for traumatic brain injury recovery and rehabilitation
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phoenix Breath - Comprehensive breathing exercises */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in backdrop-blur-sm bg-white/80 border-orange-500/20 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Wind className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-gray-900">Phoenix Breath</CardTitle>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Neuroplasticity Training
                </span>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 text-base leading-relaxed">
                  Rise from the ashes with guided breathing exercises that promote neuroplasticity, reduce anxiety, and enhance cognitive recovery through evidence-based respiratory techniques.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>• Box Breathing (4-4-4-4 pattern)</div>
                  <div>• Wim Hof Method protocols</div>
                  <div>• Heart Rate Variability training</div>
                  <div>• Stress reduction techniques</div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/breathing">Begin Breathing Training</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Ice Warrior Academy - Cold exposure therapy */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-slate-800/80 to-cyan-900/80 border-cyan-500/30 group backdrop-blur-sm" style={{animationDelay: '200ms'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-xl">
                  <Thermometer className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-cyan-100">Ice Warrior Academy</CardTitle>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                  Resilience Building
                </span>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-cyan-200 text-base leading-relaxed">
                  Transform your resilience through deliberate cold exposure protocols, building mental fortitude and triggering beneficial stress responses for brain recovery.
                </p>
                <div className="space-y-2 text-sm text-cyan-300">
                  <div>• Progressive cold adaptation</div>
                  <div>• Ice bath protocols</div>
                  <div>• Cold shower challenges</div>
                  <div>• Mental resilience training</div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/cold-exposure">Begin Cold Training</Link>
                </Button>
              </CardContent>
            </Card>

            {/* TBI Computer Programs - New clinical-grade cognitive rehabilitation */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/30 group" style={{animationDelay: '300ms'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-indigo-100">TBI Computer Programs</CardTitle>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Evidence-Based
                </span>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-indigo-200 text-base leading-relaxed">
                  Access research-backed computer-based programs for traumatic brain injury rehabilitation, including Cogmed QM, RehaCom, and virtual reality therapies.
                </p>
                <div className="space-y-2 text-sm text-indigo-300">
                  <div>• Cogmed QM working memory training</div>
                  <div>• RehaCom cognitive rehabilitation</div>
                  <div>• Virtual reality therapy programs</div>
                  <div>• Evidence-based effectiveness data</div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/tbi-programs">Explore TBI Programs</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Mind Academy - Clinical cognitive training */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-purple-900/80 to-red-900/80 border-orange-500/30 group" style={{animationDelay: '400ms'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-orange-100">Phoenix Mind Academy</CardTitle>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  Clinical Grade
                </span>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-orange-200 text-base leading-relaxed">
                  Rise stronger with evidence-based cognitive training, clinical assessments, and rehabilitation tools used in Brain Injury Rehabilitation Units worldwide.
                </p>
                <div className="space-y-2 text-sm text-orange-300">
                  <div>• PHQ-9 & GAD-7 assessments</div>
                  <div>• Cognitive rehabilitation exercises</div>
                  <div>• Progress tracking & analytics</div>
                  <div>• Professional assessment resources</div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/mind">Enter Mind Academy</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Heart Sanctuary - Trauma-informed emotional healing */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-pink-900/80 to-red-900/80 border-pink-500/30 group" style={{animationDelay: '600ms'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-pink-100">Phoenix Heart Sanctuary</CardTitle>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                  Trauma-Informed Care
                </span>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-pink-200 text-base leading-relaxed">
                  Heal emotional wounds with trauma-informed practices, self-compassion exercises, and evidence-based therapeutic techniques for complete recovery.
                </p>
                <div className="space-y-2 text-sm text-pink-300">
                  <div>• Gratitude journaling practices</div>
                  <div>• Self-compassion exercises</div>
                  <div>• Trauma processing techniques</div>
                  <div>• Emotional regulation tools</div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/gratitude">Open Your Heart</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Circle Community - Peer support network */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-teal-900/80 to-blue-900/80 border-teal-500/30 group" style={{animationDelay: '800ms'}}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-teal-100">Phoenix Circle</CardTitle>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  Peer Support Network
                </span>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-teal-200 text-base leading-relaxed">
                  Connect with fellow phoenix warriors on their recovery journey, share wisdom, experiences, and build lasting supportive relationships.
                </p>
                <div className="space-y-2 text-sm text-teal-300">
                  <div>• Share your recovery story</div>
                  <div>• Connect with others</div>
                  <div>• Weekly support circles</div>
                  <div>• Mentorship opportunities</div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/unwritten">Join the Circle</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-serif text-white mb-6">Additional Resources</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="border-green-500/50 hover:bg-green-500/10 hover:border-green-500 transition-all duration-300">
                <Link to="/resources">Professional Resources</Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300">
                <Link to="/challenges">Recovery Challenges</Link>
              </Button>
              <Button asChild variant="outline" className="border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                <Link to="/chapter-1">Continue Reading Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Dashboard;
