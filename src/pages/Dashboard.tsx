import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Headphones } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { MODULE_DATA } from "@/components/dashboard/moduleData";
import { useOpenAudiobook } from "@/hooks/use-audiobook";
import UniversalDisclaimer, { hasValidConsent } from "@/components/clinical/UniversalDisclaimer";

// Audiobook trigger button component
const AudiobookButton = () => {
  const openAudiobook = useOpenAudiobook();
  return (
    <Button 
      variant="ghost" 
      className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
      onClick={() => openAudiobook()}
    >
      <Headphones className="mr-2 h-4 w-4" />
      Listen to Audiobook
    </Button>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check consent on mount
  useEffect(() => {
    if (!hasValidConsent()) {
      setShowDisclaimer(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  const handleDisclaimerAcknowledge = () => {
    setShowDisclaimer(false);
    setShowIntro(true);
  };

  const handleBeginJourney = () => {
    setVideoStarted(true);
    videoRef.current?.play();
  };

  const handleVideoEnd = () => {
    setShowIntro(false);
  };

  // Universal Disclaimer Screen (first-time users)
  if (showDisclaimer) {
    return (
      <UniversalDisclaimer
        onAcknowledge={handleDisclaimerAcknowledge}
        onSkip={() => navigate('/')}
      />
    );
  }

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
        
        {!videoStarted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 animate-fade-in">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${4 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>
            
            <div className="text-center z-10">
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 drop-shadow-2xl animate-phoenix-rise">
                <span className="text-flame-gradient">Yellow Brick Road</span>
              </h1>
              <p className="text-xl text-white/60 mb-10 max-w-md mx-auto">
                Your journey to recovery begins here
              </p>
              <Button 
                onClick={handleBeginJourney}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-lg px-10 py-7 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105"
              >
                <Play className="mr-3 h-6 w-6" />
                Begin Your Journey
                </Button>
                
                <div className="flex justify-center gap-6 mt-6">
                  <button 
                    onClick={() => setShowIntro(false)}
                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                  >
                    Skip
                  </button>
                  
                  <span className="text-white/20">|</span>
                  
                  <button 
                    onClick={() => navigate('/')}
                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating embers */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`ember-${i}`}
            className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-ember-float shadow-lg shadow-orange-500/50"
            style={{
              left: `${5 + i * 6}%`,
              top: `${10 + (i % 5) * 18}%`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.4 + (i % 3) * 0.2
            }}
          />
        ))}
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <DashboardHeader />

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {MODULE_DATA.map((module, index) => (
            <ModuleCard
              key={module.title}
              {...module}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <AudiobookButton />
            <div className="w-px h-6 bg-white/20" />
            <Button 
              asChild 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Link to="/resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </Button>
            <div className="w-px h-6 bg-white/20" />
            <Button 
              asChild 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Link to="/challenges">Recovery Challenges</Link>
            </Button>
            <div className="w-px h-6 bg-white/20" />
            <Button 
              asChild 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Link to="/chapter-1">Continue Reading</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
