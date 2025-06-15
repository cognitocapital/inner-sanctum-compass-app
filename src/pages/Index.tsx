import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
    // For now, showing planned chapters - will be updated as chapters are added
    const totalChapters = 21;
    const availableChapters = [1]; // Only Chapter 1 is currently available

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-flame-flicker opacity-60"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-40" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-60 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-flame-flicker opacity-50" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-30" style={{animationDelay: '3s'}}></div>
            </div>
            
            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                <header className="text-center mb-16 animate-phoenix-rise">
                    <div className="relative mb-8 group">
                        {/* Main phoenix image with enhanced effects */}
                        <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56">
                            <img 
                                src="/lovable-uploads/61737177-dd9d-47dd-a325-27269cef1702.png" 
                                alt="A phoenix holding a skateboard, rising from flames" 
                                className="w-full h-full rounded-full object-cover border-4 border-primary/40 shadow-2xl animate-glow-pulse hover:scale-110 transition-all duration-700 cursor-pointer" 
                            />
                            
                            {/* Animated flame rings */}
                            <div className="absolute inset-0 rounded-full bg-flame-gradient opacity-30 animate-flame-flicker"></div>
                            <div className="absolute inset-2 rounded-full bg-ember-gradient opacity-20 animate-flame-flicker" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute inset-4 rounded-full bg-phoenix-gradient opacity-15 animate-flame-flicker" style={{animationDelay: '1s'}}></div>
                            
                            {/* Floating particles around the phoenix */}
                            <div className="absolute -top-2 -left-2 w-3 h-3 bg-primary rounded-full animate-flame-flicker opacity-80"></div>
                            <div className="absolute -top-4 right-8 w-2 h-2 bg-primary rounded-full animate-flame-flicker opacity-60" style={{animationDelay: '0.8s'}}></div>
                            <div className="absolute top-4 -right-3 w-2.5 h-2.5 bg-primary rounded-full animate-flame-flicker opacity-70" style={{animationDelay: '1.2s'}}></div>
                            <div className="absolute bottom-8 -left-4 w-1.5 h-1.5 bg-primary rounded-full animate-flame-flicker opacity-50" style={{animationDelay: '0.3s'}}></div>
                            <div className="absolute -bottom-3 right-6 w-2 h-2 bg-primary rounded-full animate-flame-flicker opacity-65" style={{animationDelay: '1.5s'}}></div>
                            <div className="absolute bottom-12 -right-2 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-40" style={{animationDelay: '0.7s'}}></div>
                            
                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 rounded-full bg-flame-gradient opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                        </div>
                        
                        {/* Additional floating elements */}
                        <div className="absolute top-0 left-1/4 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-30" style={{animationDelay: '2s'}}></div>
                        <div className="absolute top-8 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-flame-flicker opacity-40" style={{animationDelay: '2.5s'}}></div>
                        <div className="absolute bottom-0 left-1/3 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-35" style={{animationDelay: '1.8s'}}></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-flame-gradient mb-4 drop-shadow-lg animate-flame-flicker">
                        What a Journey
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
                        An intimate account of recovering from a traumatic brain injury, finding new strength, and embracing life's unwritten chapters.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-flame-gradient hover:bg-ember-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Link to="/chapter-1">
                                Start Reading <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 group">
                            <Link to="/dashboard">
                                Interactive Tools <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </header>

                <main>
                    <Card className="animate-fade-in backdrop-blur-sm bg-card/80 border-primary/20 shadow-2xl" style={{animationDelay: '400ms'}}>
                        <CardHeader className="bg-flame-gradient bg-opacity-5 rounded-t-lg">
                            <CardTitle className="text-3xl font-serif text-center">Table of Contents</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chapterNum) => {
                                    const isAvailable = availableChapters.includes(chapterNum);
                                    return (
                                        <Button 
                                            key={chapterNum} 
                                            asChild={isAvailable} 
                                            variant="outline" 
                                            className={`h-20 flex-col gap-1 transition-all duration-300 ${
                                                isAvailable 
                                                    ? 'hover:border-primary hover:shadow-lg hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20' 
                                                    : 'opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={!isAvailable}
                                        >
                                            {isAvailable ? (
                                                <Link to={`/chapter-${chapterNum}`} className="flex flex-col items-center justify-center h-full w-full">
                                                    <span className="text-sm text-muted-foreground">Chapter</span>
                                                    <span className="text-2xl font-bold text-primary">{chapterNum}</span>
                                                </Link>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <span className="text-sm text-muted-foreground">Chapter</span>
                                                    <span className="text-2xl font-bold">{chapterNum}</span>
                                                    <span className="text-xs text-muted-foreground">Coming Soon</span>
                                                </div>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </main>

                <footer className="text-center mt-16 text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '600ms'}}>
                    <p>© 2024 Michael Heron. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Index;
