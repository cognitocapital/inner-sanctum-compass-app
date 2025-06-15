import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen, PenTool } from "lucide-react";

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
              Recovery Tools
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed">
              Interactive tools to support your healing journey after traumatic brain injury
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Breathing Exercises */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in backdrop-blur-sm bg-white/80 border-orange-500/20 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-500 hover:bg-orange-600 rounded-full w-fit group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Wind className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-gray-900">Healing Breath</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Guided breathing exercises to reduce anxiety and promote neuroplasticity
                </p>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Link to="/breathing">Start Session</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cold Exposure */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-primary/5 border-primary/20 group" style={{animationDelay: '200ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-ember-gradient rounded-full w-fit group-hover:animate-glow-pulse transition-all duration-300">
                  <Thermometer className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Challenge Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Track daily challenges and exposure therapy for building resilience
                </p>
                <Button asChild className="w-full bg-ember-gradient hover:bg-flame-gradient text-white">
                  <Link to="/challenges">View Tracker</Link>
                </Button>
              </CardContent>
            </Card>

            {/* The Mind */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-primary/5 border-primary/20 group" style={{animationDelay: '400ms'}}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-phoenix-gradient rounded-full w-fit group-hover:animate-glow-pulse transition-all duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Mind Training</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Cognitive exercises and meditation for brain recovery and focus
                </p>
                <Button asChild className="w-full bg-phoenix-gradient hover:bg-flame-gradient text-white">
                  <Link to="/mind">Train Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Unwritten Chapters */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-primary/5 border-primary/20 group" style={{animationDelay: '600ms'}}>
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
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in md:col-span-2 bg-gradient-to-r from-card to-primary/5 border-primary/20" style={{animationDelay: '800ms'}}>
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