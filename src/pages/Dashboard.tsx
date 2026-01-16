import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Headphones, LogOut, User, TrendingUp } from "lucide-react";
import { PersonalizedHeader } from "@/components/dashboard/PersonalizedHeader";
import { TodaysPath } from "@/components/dashboard/TodaysPath";
import { DailyCheckInModal } from "@/components/dashboard/DailyCheckInModal";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { MODULE_DATA } from "@/components/dashboard/moduleData";
import { useOpenAudiobook } from "@/hooks/use-audiobook";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { toast } from "sonner";

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
  const { user, isGuest, signOut } = useAuth();
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { incrementStreak } = useUserProgress();
  
  const { hasCheckedInToday, refetch: refetchCheckin } = useDailyCheckin();
  
  const [showIntro, setShowIntro] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Show check-in modal if user hasn't checked in today
  useEffect(() => {
    if (!profileLoading && user && !isGuest && profile?.onboarding_completed && !hasCheckedInToday) {
      const timer = setTimeout(() => setShowCheckIn(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [profile, profileLoading, user, isGuest, hasCheckedInToday]);

  // Check if onboarding is needed and update streak
  useEffect(() => {
    if (!profileLoading && user && !isGuest) {
      if (profile && !profile.onboarding_completed) {
        setShowOnboarding(true);
        setShowIntro(false);
      } else if (profile?.onboarding_completed) {
        // Update streak on dashboard visit
        incrementStreak();
      }
    }
  }, [profile, profileLoading, user, isGuest]);

  const handleBeginJourney = () => {
    setVideoStarted(true);
    videoRef.current?.play();
  };

  const handleVideoEnd = () => {
    setShowIntro(false);
    if (user && !isGuest && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refetchProfile();
    toast.success("Welcome to Yellow Brick Road!", {
      description: "Your personalized journey awaits."
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const handleCheckInComplete = () => {
    setShowCheckIn(false);
    refetchCheckin();
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Video Intro Screen (only show on first visit or for guests)
  if (showIntro && (!profile?.onboarding_completed || isGuest)) {
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
      {/* User menu */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {user && !isGuest ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <User className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">{profile?.display_name || user.email?.split('@')[0]}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : isGuest ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">Guest Mode</span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-orange-400 hover:text-orange-300"
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
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
        {/* Personalized Header with greeting, level, streak */}
        <PersonalizedHeader />

        {/* Today's Path - AI Recommendation */}
        {!isGuest && profile?.onboarding_completed && <TodaysPath />}

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
              <Link to="/insights">
                <TrendingUp className="mr-2 h-4 w-4" />
                Insights
              </Link>
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

        {/* Daily Check-In Modal */}
        <DailyCheckInModal
          isOpen={showCheckIn}
          onClose={() => setShowCheckIn(false)}
          onComplete={handleCheckInComplete}
        />
      </div>
    </div>
  );
};

export default Dashboard;
