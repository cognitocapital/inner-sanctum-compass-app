import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
            {/* Animated background elements inspired by phoenix flames */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Primary flame particles */}
                <div key="particle-1" className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-float opacity-80 shadow-lg shadow-orange-500/50"></div>
                <div key="particle-2" className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60 shadow-lg shadow-orange-500/40" style={{ animationDelay: '1s' }}></div>
                <div key="particle-3" className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-float opacity-70 shadow-lg shadow-orange-500/45" style={{ animationDelay: '2s' }}></div>
                <div key="particle-4" className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-50 shadow-lg shadow-orange-500/35" style={{ animationDelay: '3s' }}></div>
                <div key="particle-5" className="absolute top-1/3 left-[16%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-float opacity-45 shadow-lg shadow-orange-500/30" style={{ animationDelay: '1.5s' }}></div>
                <div key="particle-6" className="absolute bottom-1/3 right-[16%] w-1 h-1 bg-orange-500 rounded-full animate-float opacity-35 shadow-lg shadow-orange-500/25" style={{ animationDelay: '2.5s' }}></div>
                <div key="particle-7" className="absolute top-2/3 right-[20%] w-2 h-2 bg-orange-500 rounded-full animate-float opacity-55 shadow-lg shadow-orange-500/40" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Additional ember particles */}
                <div key="ember-1" className="absolute top-32 left-[20%] w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }}></div>
                <div key="ember-2" className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-float opacity-35" style={{ animationDelay: '5s' }}></div>
                <div key="ember-3" className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-30" style={{ animationDelay: '6s' }}></div>
                <div key="ember-4" className="absolute bottom-24 right-[16%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-float opacity-45" style={{ animationDelay: '7s' }}></div>
                <div key="ember-5" className="absolute top-1/4 right-[12%] w-1 h-1 bg-red-500 rounded-full animate-float opacity-40" style={{ animationDelay: '8s' }}></div>
                
                {/* Subtle flame trails */}
                <div key="trail-1" className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-float opacity-30" style={{ animationDelay: '3.5s' }}></div>
                <div key="trail-2" className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-float opacity-25" style={{ animationDelay: '4.5s' }}></div>
            </div>
            
            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 flex flex-col items-center justify-center min-h-screen">
                <header className="text-center">
                    {/* Phoenix image and title */}
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
                            <div key="phoenix-particle-1" className="absolute -top-4 -left-4 w-4 h-4 bg-orange-500 rounded-full animate-float opacity-90"></div>
                            <div key="phoenix-particle-2" className="absolute -top-6 right-12 w-3 h-3 bg-orange-500 rounded-full animate-float opacity-75" style={{ animationDelay: '0.8s' }}></div>
                            <div key="phoenix-particle-3" className="absolute top-6 -right-5 w-3.5 h-3.5 bg-orange-500 rounded-full animate-float opacity-85" style={{ animationDelay: '1.2s' }}></div>
                            <div key="phoenix-particle-4" className="absolute bottom-12 -left-6 w-2.5 h-2.5 bg-orange-500 rounded-full animate-float opacity-65" style={{ animationDelay: '0.3s' }}></div>
                            <div key="phoenix-particle-5" className="absolute -bottom-5 right-8 w-3 h-3 bg-orange-500 rounded-full animate-float opacity-80" style={{ animationDelay: '1.5s' }}></div>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                        What a Journey
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                        An intimate account of recovering from a traumatic brain injury, finding new strength, and embracing life's unwritten chapters.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Link to="/dedication">
                                Dedication <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <Link to="/disclaimer">
                                Disclaimer <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-gray-900 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group border-2 border-yellow-300 relative overflow-hidden">
                            <Link to="/dashboard">
                                <span className="flex items-center relative z-10">
                                    ✨ Yellow Brick Road ✨
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-yellow-400/20 animate-pulse"></div>
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-green-500">
                            <Link to="/resources">
                                Growth Resources <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* footer */}
                <footer className="text-center mt-16 text-sm text-gray-400">
                    <p>© 2024 Michael Heron. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Index;