import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { useProtocolProgress } from "@/hooks/use-protocol-progress";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

import { HeroWeekCard } from "@/components/protocol/HeroWeekCard";
import { TodaysFocus } from "@/components/protocol/TodaysFocus";
import { PersonalizedHero } from "@/components/dashboard/PersonalizedHero";
import { WeeklyChapter } from "@/components/protocol/WeeklyChapter";
import { DailyPractice } from "@/components/protocol/DailyPractice";
import { ReflectionJournal } from "@/components/protocol/ReflectionJournal";
import { SimpleCheckIn } from "@/components/protocol/SimpleCheckIn";
import { WeekComplete } from "@/components/protocol/WeekComplete";
import { CelebrationOverlay } from "@/components/ui/celebration-overlay";
import { EmberParticles } from "@/components/ui/ember-particles";
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"chapter" | "practice" | "reflection" | null>(null);

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

  // Show celebration when week is complete
  useEffect(() => {
    if (isWeekComplete && !showCelebration) {
      setShowCelebration(true);
    }
  }, [isWeekComplete]);

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

  const progress = {
    chapter: weekProgress?.chapter_completed || false,
    practice: weekProgress?.practice_completed || false,
    reflection: weekProgress?.reflection_completed || false,
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const isLoading = profileLoading || progressLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
        <EmberParticles count={15} />
      </div>

      {/* Header */}
      <header className="relative z-20 p-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5">
          <Link to="/"><Home className="w-4 h-4 mr-2" />Home</Link>
        </Button>

        <div className="flex items-center gap-2">
          {user && !isGuest ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-white/80">{profile?.display_name || user.email?.split('@')[0]}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white/60 hover:text-white hover:bg-white/5">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : isGuest ? (
            <Button asChild variant="ghost" size="sm" className="text-orange-400 hover:bg-orange-500/10">
              <Link to="/auth">Sign In</Link>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="container mx-auto px-4 pb-16 relative z-10 max-w-4xl">
        {/* Personalized greeting */}
        <PersonalizedHero currentWeek={currentWeek} totalWeeks={totalWeeks} />

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full"
            />
            <p className="text-white/50">Preparing your journey...</p>
          </div>
        ) : weekData ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Week Complete Banner */}
            <AnimatePresence>
              {isWeekComplete && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <WeekComplete
                    currentWeek={currentWeek}
                    totalWeeks={totalWeeks}
                    onAdvance={advanceWeek}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero Week Card */}
            <HeroWeekCard
              weekData={weekData}
              currentWeek={currentWeek}
              totalWeeks={totalWeeks}
              progress={progress}
            />

            {/* Today's Focus */}
            <TodaysFocus
              weekData={weekData}
              progress={progress}
              onStartChapter={() => setExpandedSection("chapter")}
              onStartPractice={() => setExpandedSection("practice")}
              onStartReflection={() => setExpandedSection("reflection")}
            />

            {/* Expanded sections */}
            <AnimatePresence mode="wait">
              {expandedSection === "chapter" && (
                <motion.div
                  key="chapter"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <WeeklyChapter
                    weekData={weekData}
                    isCompleted={progress.chapter}
                    onComplete={completeChapter}
                  />
                </motion.div>
              )}
              
              {expandedSection === "practice" && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <DailyPractice
                    weekData={weekData}
                    isPracticeCompleted={progress.practice}
                    onCompletePractice={completePractice}
                  />
                </motion.div>
              )}
              
              {expandedSection === "reflection" && (
                <motion.div
                  key="reflection"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ReflectionJournal
                    weekData={weekData}
                    isCompleted={progress.reflection}
                    existingReflection={weekProgress?.reflection_text}
                    onComplete={completeReflection}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section toggle buttons when expanded */}
            {expandedSection && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <Button
                  variant="ghost"
                  onClick={() => setExpandedSection(null)}
                  className="text-white/60 hover:text-white"
                >
                  Collapse
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-white/60">
            <p>Unable to load week data</p>
            <Button variant="link" onClick={() => window.location.reload()} className="text-orange-400 mt-2">
              Try again
            </Button>
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

      {/* Week Celebration Overlay */}
      <CelebrationOverlay
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        type="week"
        title={`Week ${currentWeek} Complete!`}
        subtitle="You've completed all practices for this week. Your transformation continues."
        stats={[
          { label: "Days", value: 7 },
          { label: "Practices", value: 3 },
          { label: "Reflections", value: 1 },
        ]}
        ctaText="Continue Journey"
        onCta={() => {
          setShowCelebration(false);
          advanceWeek();
        }}
      />
    </div>
  );
};

export default Dashboard;
