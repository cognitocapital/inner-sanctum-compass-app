import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
    const totalChapters = 21;
    const availableChapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-foreground relative overflow-hidden">
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
            
            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                <header className="text-center mb-16">
                    <div className="relative mb-8 group">
                        <div className="relative mx-auto w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
                            <div 
                                className="w-full h-full rounded-full border-4 border-orange-500/40 shadow-2xl hover:scale-110 transition-all duration-700 cursor-pointer"
                                style={{
                                    backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
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
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                        What a Journey
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                        An intimate account of recovering from a traumatic brain injury, finding new strength, and embracing life's unwritten chapters.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Link to="/dedication">
                                Dedication <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Link to="/prologue">
                                Start Reading <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300 hover:scale-105 group">
                            <Link to="/dashboard">
                                Interactive Tools <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Link to="/gratitude">
                                Gratitude Journey <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </header>

                <main>
                    <Card className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
                        <CardHeader className="bg-orange-500/10 rounded-t-lg">
                            <CardTitle className="text-3xl font-serif text-center text-gray-900">Table of Contents</CardTitle>
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
                                                    ? 'hover:border-orange-500 hover:shadow-lg hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-orange-500/10 to-orange-500/20' 
                                                    : 'opacity-50 cursor-not-allowed'
                                            }`}
                                            disabled={!isAvailable}
                                        >
                                            {isAvailable ? (
                                                <Link to={`/chapter-${chapterNum}`} className="flex flex-col items-center justify-center h-full w-full">
                                                    <span className="text-sm text-gray-600">Chapter</span>
                                                    <span className="text-2xl font-bold text-orange-500">{chapterNum}</span>
                                                </Link>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <span className="text-sm text-gray-600">Chapter</span>
                                                    <span className="text-2xl font-bold">{chapterNum}</span>
                                                    <span className="text-xs text-gray-600">Coming Soon</span>
                                                </div>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </main>

                <footer className="text-center mt-16 text-sm text-gray-400">
                    <p>© 2024 Michael Heron. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Index;
