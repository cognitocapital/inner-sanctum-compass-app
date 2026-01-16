import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { useProtocolProgress } from "@/hooks/use-protocol-progress";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { JourneyRoad } from "@/components/protocol/JourneyRoad";
import { WeeklyChapter } from "@/components/protocol/WeeklyChapter";
import { DailyPractice } from "@/components/protocol/DailyPractice";
import { ReflectionJournal } from "@/components/protocol/ReflectionJournal";
import { SimpleCheckIn } from "@/components/protocol/SimpleCheckIn";
import { WeekComplete } from "@/components/protocol/WeekComplete";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { hasCheckedInToday, refetch: refetchCheckin } = useDailyCheckin();
  const {
    currentWeek,
    weekData,
    weekProgress,
    allProgress,
    isLoading: progressLoading,
    totalWeeks,
    completeChapter,
    completePractice,
    completeReflection,
    isWeekComplete,
    canAdvance,
    advanceWeek
  } = useProtocolProgress();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const completedWeeks = allProgress
    .filter(p => p.chapter_completed && p.practice_completed && p.reflection_completed)
    .map(p => p.week_number);

  // Show check-in modal if user hasn't checked in today
  useEffect(() => {
    if (!profileLoading && user && !isGuest && profile?.onboarding_completed && !hasCheckedInToday) {
      const timer = setTimeout(() => setShowCheckIn(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [profile, profileLoading, user, isGuest, hasCheckedInToday]);

  // Check if onboarding is needed
  useEffect(() => {
    if (!profileLoading && user && !isGuest && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [profile, profileLoading, user, isGuest]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refetchProfile();
    toast.success("Welcome to The Phoenix Protocol!", {
      description: "Your 20-week transformation begins now."
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const isLoading = profileLoading || progressLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {[...Array(10)].map((_, i) => (
          <div
            key={`ember-${i}`}
            className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-ember-float shadow-lg shadow-orange-500/50"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.3 + (i % 3) * 0.2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 p-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
          <Link to="/"><Home className="w-4 h-4 mr-2" />Home</Link>
        </Button>

        <div className="flex items-center gap-2">
          {user && !isGuest ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <User className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-white/80">{profile?.display_name || user.email?.split('@')[0]}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white/60 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : isGuest ? (
            <Button asChild variant="ghost" size="sm" className="text-orange-400">
              <Link to="/auth">Sign In</Link>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">The Phoenix Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">
            Week {currentWeek}: {weekData?.chapter}
          </h1>
          <p className="text-white/60">{weekData?.theme}</p>
        </motion.div>

        {/* Journey Road */}
        <div className="mb-8">
          <JourneyRoad currentWeek={currentWeek} completedWeeks={completedWeeks} />
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : weekData ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Week Complete Banner */}
            {isWeekComplete && (
              <WeekComplete
                currentWeek={currentWeek}
                totalWeeks={totalWeeks}
                onAdvance={advanceWeek}
              />
            )}

            {/* Chapter */}
            <WeeklyChapter
              weekData={weekData}
              isCompleted={weekProgress?.chapter_completed || false}
              onComplete={completeChapter}
            />

            {/* Practice */}
            <DailyPractice
              weekData={weekData}
              isPracticeCompleted={weekProgress?.practice_completed || false}
              onCompletePractice={completePractice}
            />

            {/* Reflection */}
            <ReflectionJournal
              weekData={weekData}
              isCompleted={weekProgress?.reflection_completed || false}
              existingReflection={weekProgress?.reflection_text}
              onComplete={completeReflection}
            />
          </div>
        ) : (
          <div className="text-center py-20 text-white/60">
            Unable to load week data
          </div>
        )}
      </div>

      {/* Simple Check-In Modal */}
      <SimpleCheckIn
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onComplete={() => {
          setShowCheckIn(false);
          refetchCheckin();
        }}
      />
    </div>
  );
};

export default Dashboard;