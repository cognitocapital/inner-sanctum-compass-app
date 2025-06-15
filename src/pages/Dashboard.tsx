import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen } from "lucide-react";

const Dashboard = () => {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-10 w-1.5 h-1.5 bg-primary rounded-full animate-flame-flicker opacity-50"></div>
          <div className="absolute bottom-40 left-16 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-40" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground transition-colors">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <header className="text-center mb-12 animate-phoenix-rise">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-flame-gradient mb-4 drop-shadow-lg">
              Recovery Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive tools to support your healing journey after traumatic brain injury
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Breathing Exercises */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-primary/5 border-primary/20 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-flame-gradient rounded-full w-fit group-hover:animate-glow-pulse transition-all duration-300">
                  <Wind className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Healing Breath</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Guided breathing exercises to reduce anxiety and promote neuroplasticity
                </p>
                <Button asChild className="w-full bg-flame-gradient hover:bg-ember-gradient text-white">
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

            {/* Reading */}
            <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in md:col-span-2 lg:col-span-3 bg-gradient-to-r from-card to-primary/5 border-primary/20" style={{animationDelay: '600ms'}}>
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