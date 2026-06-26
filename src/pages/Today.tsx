import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Flame, MessageCircle, HeartPulse, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { useDailyCheckin } from "@/hooks/use-daily-checkin";
import { usePhoenixGuide } from "@/hooks/use-phoenix-guide";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { SimpleCheckIn } from "@/components/protocol/SimpleCheckIn";
import { getWeekData } from "@/data/protocolWeeks";
import SEOHead from "@/components/seo/SEOHead";

// Local module → route map (replicated from TodaysPath; do NOT edit TodaysPath).
const MODULE_ROUTES: Record<string, string> = {
  breathing: "/breathing",
  mind: "/mind",
  gratitude: "/gratitude",
  "cold-exposure": "/cold-exposure",
  incog: "/incog",
};

const Today = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { hasCheckedInToday, refetch: refetchCheckin } = useDailyCheckin();
  const { recommendation, isLoading, refresh } = usePhoenixGuide();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  // Onboarding gate — replicated from PhoenixPath exactly.
  useEffect(() => {
    if (!profileLoading && user && !isGuest && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [profile, profileLoading, user, isGuest]);

  // Daily check-in nudge — replicated from PhoenixPath exactly.
  useEffect(() => {
    if (!profileLoading && user && !isGuest && profile?.onboarding_completed && !hasCheckedInToday) {
      const t = setTimeout(() => setShowCheckIn(true), 1500);
      return () => clearTimeout(t);
    }
  }, [profile, profileLoading, user, isGuest, hasCheckedInToday]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refetchProfile();
    toast.success("Welcome — your journey starts here.", {
      description: "One gentle step at a time.",
    });
  };

  if (showOnboarding) return <OnboardingFlow onComplete={handleOnboardingComplete} />;

  // ── Layer 1: Orientation (ambient, non-tappable) ──────────────────
  const rawWeek = profile?.current_week ?? 1;
  const safeWeek = Math.min(Math.max(rawWeek, 1), 20);
  const weekData = getWeekData(safeWeek);
  const chapterTitle = weekData?.chapter; // may be undefined
  const flame = Math.max(0, Math.min(100, profile?.flame_strength ?? 0));
  const flameScale = 0.85 + (flame / 100) * 0.5; // 0.85 → 1.35
  const flameOpacity = 0.35 + (flame / 100) * 0.65; // 0.35 → 1.0

  // ── Layer 2: The one step ─────────────────────────────────────────
  const moduleRoute =
    (recommendation && MODULE_ROUTES[recommendation.module]) || "/breathing";

  const handleBegin = () => {
    if (!recommendation) return;
    navigate(moduleRoute);
  };

  const handleNotToday = async () => {
    if (isLoading) return;
    await refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <SEOHead
        title="Today — Phoenix Journey"
        description="Your Phoenix Journey today: one gentle, suggested step for TBI recovery."
        path="/today"
      />

      <div className="max-w-2xl mx-auto px-5 pt-10 pb-24 space-y-10">
        {/* ── LAYER 1: ORIENTATION (ambient, non-tappable) ── */}
        <section
          aria-label="Where you are"
          className="flex flex-col items-center text-center select-none"
        >
          <div
            aria-hidden="true"
            className="mb-4"
            style={{
              transform: `scale(${flameScale})`,
              opacity: flameOpacity,
              transition: "transform 700ms ease, opacity 700ms ease",
              filter: `drop-shadow(0 0 ${6 + flame * 0.18}px rgba(251,146,60,0.6))`,
            }}
          >
            <Flame className="w-10 h-10 text-orange-300" />
          </div>
          <p className="text-[10px] tracking-[0.45em] uppercase text-orange-300/70 mb-2">
            Inner flame
          </p>
          <p className="text-sm text-white/60 font-serif italic">
            {chapterTitle ? `Chapter ${safeWeek} · ${chapterTitle}` : `Chapter ${safeWeek}`}
          </p>
        </section>

        {/* ── LAYER 2: THE ONE STEP (only primary action) ── */}
        <section aria-label="Your next step">
          {isLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 text-center">
              <div className="mx-auto mb-3 w-8 h-8 rounded-full border-2 border-orange-400/40 border-t-orange-300 animate-spin" />
              <p className="text-sm text-white/60 font-serif italic">
                Phoenix is choosing your step…
              </p>
            </div>
          )}

          {!isLoading && recommendation && (
            <div className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-amber-500/5 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(249,115,22,0.5)] p-6 sm:p-8">
              <p className="text-[10px] tracking-[0.4em] uppercase text-orange-300/80 mb-3">
                Your one step
              </p>
              <h2 className="text-2xl font-serif text-white leading-snug">
                {recommendation.exercise}
              </h2>
              <p className="text-xs text-white/40 mt-2 tracking-wider uppercase">
                {recommendation.duration} min
              </p>
              <p className="text-sm text-white/70 font-serif italic mt-4 leading-relaxed">
                {recommendation.reason}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleBegin}
                  className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-medium shadow-[0_0_20px_rgba(251,146,60,0.35)]"
                >
                  Begin
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  onClick={handleNotToday}
                  variant="ghost"
                  disabled={isLoading}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/5"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                  Not today
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !recommendation && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 text-center">
              <p className="text-[10px] tracking-[0.4em] uppercase text-orange-300/70 mb-3">
                Start where you are
              </p>
              <h2 className="text-xl font-serif text-white">A single breath is enough.</h2>
              <p className="text-sm text-white/60 font-serif italic mt-3 leading-relaxed">
                No pressure today. Just one quiet moment with your breath.
              </p>
              <Button
                onClick={() => navigate("/breathing")}
                className="mt-6 bg-orange-500 hover:bg-orange-400 text-white"
              >
                Take a breath
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </section>

        {/* ── Secondary affordances (low emphasis) ── */}
        <section aria-label="More" className="flex flex-col items-center gap-3 pt-2">
          <button
            onClick={() => setShowCheckIn(true)}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <HeartPulse className="w-4 h-4" />
            How are you today?
          </button>
          <Link
            to="/ai-companion"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Talk to Phoenix
          </Link>
        </section>
      </div>

      <SimpleCheckIn
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onComplete={refetchCheckin}
      />
    </div>
  );
};

export default Today;