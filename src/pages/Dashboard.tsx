import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Thermometer, Brain, BookOpen } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Recovery Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive tools to support your healing journey after traumatic brain injury
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Breathing Exercises */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Wind className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif">Healing Breath</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Guided breathing exercises to reduce anxiety and promote neuroplasticity
              </p>
              <Button asChild className="w-full">
                <Link to="/breathing">Start Session</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Cold Exposure */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{animationDelay: '100ms'}}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Thermometer className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif">Challenge Tracking</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Track daily challenges and exposure therapy for building resilience
              </p>
              <Button asChild className="w-full">
                <Link to="/challenges">View Tracker</Link>
              </Button>
            </CardContent>
          </Card>

          {/* The Mind */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{animationDelay: '200ms'}}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif">Mind Training</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Cognitive exercises and meditation for brain recovery and focus
              </p>
              <Button asChild className="w-full">
                <Link to="/mind">Train Now</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Reading */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in md:col-span-2 lg:col-span-3" style={{animationDelay: '300ms'}}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif">Continue Reading</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Return to the story of recovery and discover what happens next
              </p>
              <Button asChild size="lg">
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