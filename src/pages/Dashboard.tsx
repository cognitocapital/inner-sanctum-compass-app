
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen, PenTool, Heart, Shield, Target, Zap, Sun, Moon, Activity, Users, Calendar, Compass } from "lucide-react";

const Dashboard = () => {
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
            {/* Smaller phoenix image for dashboard */}
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
              Clinical-grade tools and interactive support for traumatic brain injury recovery
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Breathing Exercises */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in backdrop-blur-sm bg-white/80 border-orange-500/20 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Wind className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-gray-900">Phoenix Breath</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Rise from the ashes with guided breathing exercises that promote neuroplasticity and inner healing
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/breathing">Ignite Your Breath</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cold Exposure - Updated */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-slate-800/80 to-cyan-900/80 border-cyan-500/30 group backdrop-blur-sm" style={{animationDelay: '200ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-xl">
                  <Thermometer className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-cyan-100">Ice Warrior Academy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-cyan-200 mb-4">
                  Transform your resilience through deliberate cold exposure and ice bath protocols
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/cold-exposure">Begin Cold Training</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Mind Academy - Renamed */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-purple-900/80 to-red-900/80 border-orange-500/30 group" style={{animationDelay: '400ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-orange-100">Phoenix Mind Academy</CardTitle>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Clinical Grade
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-orange-200 mb-4">
                  Rise stronger with evidence-based cognitive training used in Brain Injury Rehabilitation Units
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/mind">Awaken Your Mind</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Heart Sanctuary */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-pink-900/80 to-red-900/80 border-pink-500/30 group" style={{animationDelay: '600ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-pink-500 to-red-500 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-pink-100">Phoenix Heart Sanctuary</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-pink-200 mb-4">
                  Heal emotional wounds with guided trauma-informed practices and self-compassion exercises
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/heart-sanctuary">Open Your Heart</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Shield Resilience */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-green-500/30 group" style={{animationDelay: '800ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-green-100">Phoenix Shield</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-200 mb-4">
                  Build unbreakable resilience through adaptive coping strategies and stress management
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/phoenix-shield">Forge Your Shield</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Goals Navigator */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-500/30 group" style={{animationDelay: '1000ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-indigo-100">Phoenix Goals Navigator</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-indigo-200 mb-4">
                  Chart your recovery path with SMART goal setting and progress tracking tools
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/goals-navigator">Navigate Your Path</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Energy Tracker */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-yellow-900/80 to-orange-900/80 border-yellow-500/30 group" style={{animationDelay: '1200ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-yellow-100">Phoenix Energy Tracker</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-yellow-200 mb-4">
                  Monitor your energy levels, fatigue patterns, and optimize your daily rhythms
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/energy-tracker">Track Your Energy</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Circle Community */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-teal-900/80 to-blue-900/80 border-teal-500/30 group" style={{animationDelay: '1400ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-teal-100">Phoenix Circle</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-teal-200 mb-4">
                  Connect with fellow phoenix warriors on their recovery journey and share wisdom
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/phoenix-circle">Join the Circle</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Rhythm Tracker */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-violet-900/80 to-purple-900/80 border-violet-500/30 group" style={{animationDelay: '1600ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-violet-100">Phoenix Rhythm</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-violet-200 mb-4">
                  Optimize your sleep, activity, and recovery patterns with circadian rhythm insights
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/phoenix-rhythm">Find Your Rhythm</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Dawn Journal */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-amber-900/80 to-yellow-900/80 border-amber-500/30 group" style={{animationDelay: '1800ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-amber-100">Phoenix Dawn Journal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-amber-200 mb-4">
                  Start each day with intention through guided morning reflections and gratitude practices
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/dawn-journal">Greet the Dawn</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Dusk Reflection */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-slate-900/80 to-blue-900/80 border-slate-500/30 group" style={{animationDelay: '2000ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-slate-500 to-blue-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Moon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-slate-100">Phoenix Dusk Reflection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-200 mb-4">
                  End your day with peaceful reflection, processing experiences and preparing for rest
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-slate-500 to-blue-600 hover:from-slate-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/dusk-reflection">Embrace the Dusk</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Path Planner */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border-emerald-500/30 group" style={{animationDelay: '2200ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-emerald-100">Phoenix Path Planner</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-emerald-200 mb-4">
                  Plan your recovery journey with adaptive scheduling and milestone tracking
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/path-planner">Plan Your Path</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Phoenix Compass Guide */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-rose-900/80 to-pink-900/80 border-rose-500/30 group" style={{animationDelay: '2400ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-rose-100">Phoenix Compass Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-rose-200 mb-4">
                  Navigate life transitions with personalized guidance and decision-making support
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/compass-guide">Find Your Direction</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Unwritten Chapters */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-primary/5 border-primary/20 group" style={{animationDelay: '2600ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-phoenix-gradient rounded-full w-fit group-hover:animate-glow-pulse transition-all duration-300">
                  <PenTool className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Unwritten Chapters</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Share your story and connect with others on their recovery journey
                </p>
                <Button asChild className="w-full bg-phoenix-gradient hover:bg-flame-gradient text-white">
                  <Link to="/unwritten">Share Your Story</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Reading */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in md:col-span-2 bg-gradient-to-r from-card to-primary/5 border-primary/20" style={{animationDelay: '2800ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-flame-gradient rounded-full w-fit">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Continue Reading</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Return to the story of recovery and discover what happens next
                </p>
                <Button asChild size="lg" className="bg-flame-gradient hover:bg-ember-gradient text-white">
                  <Link to="/chapter-1">Read Chapter 1</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
};

export default Dashboard;
