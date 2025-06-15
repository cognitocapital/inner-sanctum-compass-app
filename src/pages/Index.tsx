import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
    // For now, showing planned chapters - will be updated as chapters are added
    const totalChapters = 21;
    const availableChapters = [1]; // Only Chapter 1 is currently available

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <header className="text-center mb-16 animate-fade-in">
                    <img src="/lovable-uploads/61737177-dd9d-47dd-a325-27269cef1702.png" alt="A phoenix holding a skateboard, rising from flames" className="mx-auto mb-6 h-32 w-32 rounded-full object-cover border-4 border-primary/20 shadow-lg" />
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary">What a Journey</h1>
                    <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                        An intimate account of recovering from a traumatic brain injury, finding new strength, and embracing life's unwritten chapters.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link to="/chapter-1">
                                Start Reading <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link to="/dashboard">
                                Interactive Tools <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </header>

                <main>
                    <Card className="animate-fade-in" style={{animationDelay: '200ms'}}>
                        <CardHeader>
                            <CardTitle className="text-3xl font-serif">Table of Contents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chapterNum) => {
                                    const isAvailable = availableChapters.includes(chapterNum);
                                    return (
                                        <Button 
                                            key={chapterNum} 
                                            asChild={isAvailable} 
                                            variant="outline" 
                                            className={`h-20 flex-col gap-1 transition-all duration-200 ${
                                                isAvailable 
                                                    ? 'hover:border-primary hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
                                                    : 'opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={!isAvailable}
                                        >
                                            {isAvailable ? (
                                                <Link to={`/chapter-${chapterNum}`}>
                                                    <span className="text-sm text-muted-foreground">Chapter</span>
                                                    <span className="text-2xl font-bold">{chapterNum}</span>
                                                </Link>
                                            ) : (
                                                <div>
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

                <footer className="text-center mt-16 text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '400ms'}}>
                    <p>© 2024 Michael Heron. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Index;
