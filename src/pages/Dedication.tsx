import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { UploadedAudiobookPlayer } from "@/components/ui/uploaded-audiobook-player";

const Dedication = () => {
    const [showVideoIntro, setShowVideoIntro] = useState(false);
    const [videoStarted, setVideoStarted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const handleStartReading = () => {
        setShowVideoIntro(true);
    };

    const handleBeginVideo = () => {
        setVideoStarted(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleVideoEnd = () => {
        navigate("/prologue");
    };

    const handleSkip = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        navigate("/prologue");
    };

    if (showVideoIntro) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                {!videoStarted ? (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-3xl md:text-5xl font-serif text-orange-400 mb-8 drop-shadow-lg">
                            Your Journey Begins
                        </h2>
                        <button
                            onClick={handleBeginVideo}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                        >
                            Start Reading
                        </button>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            src="/video/start-reading-intro.mp4"
                            className="w-full h-full object-contain"
                            onEnded={handleVideoEnd}
                            playsInline
                        />
                        <button
                            onClick={handleSkip}
                            className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-300"
                        >
                            Skip Intro
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-foreground relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
                <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
                <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
                <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
            </div>
            
            <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                <div className="mb-8">
                    <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500">
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <main className="max-w-4xl mx-auto">
                    <Card className="backdrop-blur-sm bg-white/90 border-orange-500/20 shadow-2xl">
                        <CardContent className="p-12">
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
                                    Dedication
                                </h1>
                                
                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                    <p className="text-xl md:text-2xl font-medium italic mb-8">
                                        This book is dedicated to the brave souls who are forging their own paths through the wilderness of recovery, whether from traumatic brain injury or other life-altering challenges.
                                    </p>
                                    
                                    <p className="text-lg md:text-xl mb-6">
                                        It's for those who refuse to be defined by their limitations, who choose to embrace the unknown with courage, and who are committed to unlocking their own potential for healing and growth.
                                    </p>
                                    
                                    <p className="text-lg md:text-xl mb-6">
                                        May you find within these pages a source of strength, resilience, and wisdom.
                                    </p>
                                    
                                    <p className="text-lg md:text-xl mb-6">
                                        May you discover the extraordinary power that resides within you.
                                    </p>
                                    
                                    <p className="text-lg md:text-xl font-semibold text-orange-600">
                                        And may you never give up on the journey back to yourself.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Audiobook Player */}
                            <div className="mt-12">
                                <UploadedAudiobookPlayer startChapterId="dedication" />
                            </div>
                            
                            <div className="flex justify-center mt-8">
                                <Button 
                                    onClick={handleStartReading}
                                    size="lg" 
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                                >
                                    Start Reading <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default Dedication;
