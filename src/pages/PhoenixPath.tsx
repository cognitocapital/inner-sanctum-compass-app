import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Settings as SettingsIcon, Flame, Zap, BookHeart, ExternalLink, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { usePhoenixPath } from "@/hooks/use-phoenix-path";
import { PHOENIX_QUESTS, PHASES, getQuestsForPhase, type QuestDefinition } from "@/data/phoenixQuests";
import { FlameStrength } from "@/components/path/FlameStrength";
import { QuestNode } from "@/components/path/QuestNode";
import { QuestCard } from "@/components/path/QuestCard";
import { XCommunityLink } from "@/components/ui/community-footer";
import phoenixPathHero from "@/assets/phoenix-path-hero.jpg";

const PhoenixPath = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { profile } = useProfile();
  const { currentPhase, flameStrength, isLoading, totalXp, completedCount, getQuestStatus } = usePhoenixPath();
  const [selectedQuest, setSelectedQuest] = useState<QuestDefinition | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const displayName =
    profile?.display_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Traveler";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return "Still here";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  })();

  const handleBeginQuest = (quest: QuestDefinition) => {
    setSelectedQuest(null);
    navigate(`/quest/${quest.key}`);
  };

  // Find the next available quest in current phase
  const currentPhaseQuests = getQuestsForPhase(currentPhase);
  const nextQuest = currentPhaseQuests.find(q => {
    const status = getQuestStatus(q.key);
    return status === 'available' || status === 'in_progress';
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const currentPhaseData = PHASES[currentPhase - 1];
  const completedInCurrentPhase = currentPhaseQuests.filter(
    q => getQuestStatus(q.key) === 'completed'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-x-hidden">
      {/* ─── CINEMATIC HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[88svh] w-full overflow-hidden flex flex-col">
        {/* Hero image */}
        <img
          src={phoenixPathHero}
          alt="Phoenix rising from embers under a starlit sky"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover animate-[fade-in_1.6s_ease-out]"
          style={{ transform: "scale(1.05)" }}
        />
        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/55 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.95)_100%)]" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-300/70"
              style={{
                left: `${(i * 73) % 100}%`,
                bottom: `-${10 + (i % 4) * 5}%`,
                filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8))",
              }}
              animate={{
                y: ["0vh", "-110vh"],
                opacity: [0, 1, 0],
                x: [0, (i % 2 ? 30 : -30)],
              }}
              transition={{
                duration: 14 + (i % 5) * 3,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Floating glass header */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:bg-white/[0.14] transition"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10">
            <Flame className="w-3.5 h-3.5 text-orange-300" style={{ filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8))" }} />
            <span className="text-xs font-medium text-orange-200 tracking-wider">{totalXp} XP</span>
          </div>

          {user && !isGuest ? (
            <Link
              to="/settings"
              aria-label="Settings"
              className="w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.14] transition"
            >
              <SettingsIcon className="w-4 h-4" />
            </Link>
          ) : isGuest ? (
            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-400/30 text-xs font-medium text-orange-200 hover:bg-orange-500/30 transition"
            >
              Sign In
            </Link>
          ) : (
            <span className="w-10 h-10" />
          )}
        </div>

        {/* Editorial title block */}
        <div className="relative z-10 mt-auto px-6 pb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-[10px] tracking-[0.45em] uppercase text-orange-300/80 mb-4"
          >
            {greeting}, {displayName}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="font-serif font-bold text-white text-4xl md:text-6xl leading-[1.05] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
          >
            Phoenix Journey
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mx-auto mt-5 mb-4 h-px w-24 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1.2 }}
            className="font-serif italic text-white/70 text-base md:text-lg max-w-md mx-auto leading-relaxed"
          >
            {currentPhaseData?.subtitle ?? "Your path to rising"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="mt-3 text-[11px] uppercase tracking-[0.35em] text-cyan-300/70"
          >
            Chapter {currentPhase} · {currentPhaseData?.name}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-32 relative z-10 max-w-lg -mt-10">
        {/* Flame strength — glassmorphic medallion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(249,115,22,0.35)] p-6 sm:p-8 mb-10"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-orange-300/70 mb-3">Your flame</p>
            <div className="max-w-xs mx-auto">
              <FlameStrength
                value={flameStrength}
                phase={currentPhase}
                phaseName={currentPhaseData?.name || ""}
              />
            </div>
            <p className="font-serif italic text-xs text-white/40 mt-4">
              {completedInCurrentPhase} of {currentPhaseQuests.length} quests illuminated
            </p>
          </div>
        </motion.div>

        {/* Daily Protocol FAB is rendered as a fixed button outside the scroll container */}

        {/* Next Quest — Hero Card */}
        {nextQuest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-cyan-300/70 mb-3 px-1">Continue your journey</p>
            <button
              onClick={() => setSelectedQuest(nextQuest)}
              className="relative w-full text-left rounded-2xl p-6 bg-gradient-to-br from-orange-500/15 via-orange-500/8 to-amber-500/5 border border-orange-500/25 hover:border-orange-400/50 transition-all duration-500 group backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(249,115,22,0.5)] overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/25 transition-colors duration-700" />
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-orange-300/80 font-medium">
                    {nextQuest.type} · quest
                  </span>
                  <h3 className="text-xl font-serif text-white mt-2 group-hover:text-orange-100 transition-colors leading-snug">
                    {nextQuest.title}
                  </h3>
                  <p className="text-sm font-serif italic text-white/55 mt-2 line-clamp-2 leading-relaxed">{nextQuest.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5 text-orange-300/80">
                      <Zap className="w-3 h-3" />{nextQuest.xpReward} XP
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="tracking-wider">{nextQuest.estimatedMinutes} MIN</span>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/20 border border-orange-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-300/60 transition-all duration-500 shadow-[0_0_20px_rgba(251,146,60,0.3)]">
                    <ChevronDown className="w-5 h-5 text-orange-200 rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Current Phase Quests — Compact Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-cyan-300/70 mb-3 px-1">
            {currentPhaseData?.name} quests
          </p>
          <div className="grid grid-cols-2 gap-2">
            {currentPhaseQuests.map((quest) => {
              const status = getQuestStatus(quest.key);
              const isCompleted = status === 'completed';
              const isAvailable = status === 'available' || status === 'in_progress';
              const isNext = quest.key === nextQuest?.key;

              return (
                <button
                  key={quest.key}
                  onClick={() => isAvailable && setSelectedQuest(quest)}
                  disabled={status === 'locked'}
                  className={`text-left rounded-xl p-3 transition-all duration-200 border ${
                    isNext
                      ? 'border-orange-500/30 bg-orange-500/10'
                      : isCompleted
                      ? 'border-white/[0.06] bg-white/[0.03]'
                      : isAvailable
                      ? 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                      : 'border-transparent bg-white/[0.01] opacity-30 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {isCompleted && (
                      <div className="w-4 h-4 rounded-full bg-orange-500/30 flex items-center justify-center">
                        <span className="text-[8px] text-orange-300">✓</span>
                      </div>
                    )}
                    <span className="text-[10px] text-white/30 uppercase tracking-wider capitalize">{quest.type}</span>
                  </div>
                  <h4 className={`text-xs font-medium leading-tight line-clamp-2 ${
                    isCompleted ? 'text-white/40' : isAvailable ? 'text-white/80' : 'text-white/20'
                  }`}>
                    {quest.title}
                  </h4>
                  <span className="text-[10px] text-orange-400/50 mt-1 block">{quest.xpReward} XP</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Other Phases — Collapsed */}
        <div className="space-y-2 mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-cyan-300/70 mb-3 px-1">All phases</p>
          {PHASES.map((phase) => {
            if (phase.phase === currentPhase) return null;
            const phaseQuests = getQuestsForPhase(phase.phase);
            const isUnlocked = phase.phase <= currentPhase;
            const completedInPhase = phaseQuests.filter(q => getQuestStatus(q.key) === 'completed').length;
            const isExpanded = expandedPhase === phase.phase;

            return (
              <div key={phase.phase} className={`rounded-xl border transition-all ${
                isUnlocked ? 'border-white/[0.06] bg-white/[0.02]' : 'border-white/[0.03] bg-white/[0.01] opacity-40'
              }`}>
                <button
                  onClick={() => isUnlocked && setExpandedPhase(isExpanded ? null : phase.phase)}
                  disabled={!isUnlocked}
                  className="w-full text-left px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-white/70">{phase.name}</h3>
                    <p className="text-[10px] text-white/30">{phase.subtitle} · {completedInPhase}/{phaseQuests.length}</p>
                  </div>
                  {isUnlocked && (
                    <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 grid grid-cols-2 gap-2">
                        {phaseQuests.map((quest) => {
                          const status = getQuestStatus(quest.key);
                          const isCompleted = status === 'completed';
                          const isAvailable = status === 'available' || status === 'in_progress';

                          return (
                            <button
                              key={quest.key}
                              onClick={() => isAvailable && setSelectedQuest(quest)}
                              disabled={status === 'locked'}
                              className={`text-left rounded-lg p-2.5 transition-all border ${
                                isCompleted
                                  ? 'border-white/[0.06] bg-white/[0.03]'
                                  : isAvailable
                                  ? 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                                  : 'border-transparent opacity-30'
                              }`}
                            >
                              <span className="text-[10px] text-white/30 capitalize">{quest.type}</span>
                              <h4 className={`text-xs leading-tight line-clamp-2 mt-0.5 ${
                                isCompleted ? 'text-white/40' : isAvailable ? 'text-white/70' : 'text-white/20'
                              }`}>
                                {quest.title}
                              </h4>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom links — minimal */}
        <div className="flex gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex-1 text-white/30 hover:text-white/60 text-xs"
          >
            <Link to="/my-chapters">
              <BookHeart className="w-3.5 h-3.5 mr-1.5" />
              My Chapters
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex-1 text-white/30 hover:text-white/60 text-xs"
          >
            <Link to="/directory">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Resources
            </Link>
          </Button>
        </div>
      </div>

      {/* Quest preview */}
      <QuestCard
        quest={selectedQuest}
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        onBegin={handleBeginQuest}
        status={selectedQuest ? getQuestStatus(selectedQuest.key) : 'locked'}
      />

      {/* Daily Protocol FAB */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Link
          to="/daily-protocol"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Flame className="w-6 h-6 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }} />
          <span className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping" style={{ animationDuration: '3s' }} />
          <span className="absolute right-full mr-3 whitespace-nowrap bg-gray-900/95 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
            Daily Protocol
          </span>
        </Link>
      </motion.div>

      {/* AI Companion FAB */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Link
          to="/ai-companion"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.1] shadow-lg hover:bg-white/[0.1] hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5 text-orange-300" />
          <span className="absolute left-full ml-3 whitespace-nowrap bg-gray-900/95 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
            Phoenix Companion
          </span>
        </Link>
      </motion.div>

      {/* X Community Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-20 left-6 z-40"
      >
        <XCommunityLink />
      </motion.div>
    </div>
  );
};

export default PhoenixPath;
