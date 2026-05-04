import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut, User, ArrowLeft, Flame, ChevronDown, ClipboardCheck, FileDown, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { useProtocolProgress } from "@/hooks/use-protocol-progress";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

import BetaDisclaimerBanner from "@/components/ui/beta-disclaimer-banner";
import { CommunityFooter } from "@/components/ui/community-footer";
import { WeeklyChapter } from "@/components/protocol/WeeklyChapter";
import { DailyPractice } from "@/components/protocol/DailyPractice";
import { ReflectionJournal } from "@/components/protocol/ReflectionJournal";
import { SimpleCheckIn } from "@/components/protocol/SimpleCheckIn";
import { WeekComplete } from "@/components/protocol/WeekComplete";
import { toast } from "sonner";
import phoenixJourneyHero from "@/assets/phoenix-journey-hero.jpg";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
        {/* Illustration backdrop */}
        <img
          src={phoenixJourneyHero}
          alt="Phoenix rising from glowing embers — visual metaphor for the Phoenix Journey TBI recovery protocol, rebirth, and resilience."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[35%] right-[20%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[55%] left-[25%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[45%] right-[30%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-[float_7s_ease-in-out_infinite_3s]" />
          <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute top-[75%] left-[40%] w-1 h-1 bg-amber-300 rounded-full opacity-55 shadow-[0_0_8px_3px_rgba(252,211,77,0.4)] animate-[float_6s_ease-in-out_infinite_2.5s]" />
        </div>

        {/* Back to Home — top left */}
        <Link
          to="/"
          replace
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          title="Back to Home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* User chip — top right */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
          {user && !isGuest ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                <User className="w-4 h-4 text-orange-300" />
                <span className="text-sm text-white/90">{profile?.display_name || user.email?.split('@')[0]}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : isGuest ? (
            <Button asChild variant="ghost" size="sm" className="text-orange-300 hover:text-orange-200 hover:bg-white/10 rounded-full backdrop-blur-sm border border-white/15">
              <Link to="/auth">Sign In</Link>
            </Button>
          ) : null}
        </div>

        {/* Editorial title block — bottom-aligned */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30 backdrop-blur-sm mb-6">
              <Flame className="w-3.5 h-3.5 text-orange-300" />
              <span className="text-xs text-orange-200 tracking-[0.3em] uppercase font-light">The Phoenix Protocol</span>
            </div>
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
              Week {currentWeek} · Your Recovery Chapter
            </p>
            <h1 className="font-serif font-bold text-white text-5xl md:text-7xl leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {weekData?.chapter || "Phoenix Journey"}
            </h1>
            {weekData?.theme && (
              <p className="mt-6 text-white/75 text-base md:text-lg max-w-xl font-light italic leading-relaxed mx-auto md:mx-0">
                {weekData.theme}
              </p>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      {/* Background ambience for content section */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

      <div className="container mx-auto px-4 pt-16 pb-12 relative z-10">

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

            {/* Care Provider Dashboard CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 rounded-3xl overflow-hidden border border-amber-400/20 bg-gradient-to-br from-gray-900/90 via-orange-950/40 to-gray-900/90 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(249,115,22,0.4)]"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 backdrop-blur-sm">
                    <ClipboardCheck className="w-6 h-6 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-300/80 tracking-[0.3em] text-[10px] uppercase font-light mb-2">
                      Clinical Companion
                    </p>
                    <h3 className="font-serif text-white text-2xl md:text-3xl leading-tight">
                      Care Provider Dashboard
                    </h3>
                    <p className="text-white/65 text-sm md:text-base mt-3 font-light leading-relaxed max-w-xl">
                      Track validated clinical assessments (GOSE, RPQ, PHQ-9), brain training sessions, mood &amp; symptom trends — and export a printable report for your neurologist, therapist, or carer.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <Activity className="w-4 h-4 text-emerald-400 mb-2" />
                    <p className="text-white/85 text-sm font-medium">Recovery Trends</p>
                    <p className="text-white/45 text-xs mt-1">14-day mood, energy, sleep</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <ClipboardCheck className="w-4 h-4 text-purple-400 mb-2" />
                    <p className="text-white/85 text-sm font-medium">Clinical Assessments</p>
                    <p className="text-white/45 text-xs mt-1">GOSE • RPQ • PHQ-9 history</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <FileDown className="w-4 h-4 text-amber-400 mb-2" />
                    <p className="text-white/85 text-sm font-medium">Exportable Report</p>
                    <p className="text-white/45 text-xs mt-1">Print-ready for clinicians</p>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full md:w-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-semibold px-8 py-6 text-base shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-[1.02]"
                >
                  <Link to="/insights">
                    Open Care Provider Dashboard
                    <ChevronDown className="w-4 h-4 ml-2 -rotate-90" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-20 text-white/60">
            Unable to load week data
          </div>
        )}
      </div>
      </div>

      <BetaDisclaimerBanner />
      <CommunityFooter />

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