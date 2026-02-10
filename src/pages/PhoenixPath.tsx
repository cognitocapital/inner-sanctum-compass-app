import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, LogOut, User, Flame, Zap, BookHeart, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { usePhoenixPath } from "@/hooks/use-phoenix-path";
import { PHOENIX_QUESTS, PHASES, getQuestsForPhase, type QuestDefinition } from "@/data/phoenixQuests";
import { FlameStrength } from "@/components/path/FlameStrength";
import { QuestNode } from "@/components/path/QuestNode";
import { QuestCard } from "@/components/path/QuestCard";

const PhoenixPath = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const { profile } = useProfile();
  const { currentPhase, flameStrength, isLoading, totalXp, completedCount, getQuestStatus } = usePhoenixPath();
  const [selectedQuest, setSelectedQuest] = useState<QuestDefinition | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-amber-500/[0.03] rounded-full blur-[80px]" />
      </div>

      {/* Minimal header */}
      <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-white/[0.04]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="text-white/50 hover:text-white">
            <Link to="/"><Home className="w-4 h-4" /></Link>
          </Button>
          <div className="flex items-center gap-1.5 text-sm text-white/40">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-medium text-orange-300">{totalXp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            {user && !isGuest ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white/50 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            ) : isGuest ? (
              <Button asChild variant="ghost" size="sm" className="text-orange-400">
                <Link to="/auth">Sign In</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-32 relative z-10 max-w-lg">
        {/* Hero — Current Phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-6 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-400" style={{ filter: 'drop-shadow(0 0 8px hsl(25, 90%, 55%))' }} />
            </div>
          </motion.div>

          <h1 className="text-2xl font-serif text-white mb-1">
            {currentPhaseData?.name}
          </h1>
          <p className="text-sm text-white/40 mb-5">{currentPhaseData?.subtitle}</p>

          {/* Flame Strength — clean and prominent */}
          <div className="max-w-xs mx-auto">
            <FlameStrength
              value={flameStrength}
              phase={currentPhase}
              phaseName={currentPhaseData?.name || ""}
            />
          </div>

          <p className="text-xs text-white/30 mt-3">
            {completedInCurrentPhase} of {currentPhaseQuests.length} quests completed
          </p>
        </motion.div>

        {/* Next Quest — Hero Card */}
        {nextQuest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3 px-1">Continue your journey</p>
            <button
              onClick={() => setSelectedQuest(nextQuest)}
              className="w-full text-left rounded-2xl p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-orange-400/70 font-medium">
                    {nextQuest.type} quest
                  </span>
                  <h3 className="text-lg font-serif text-white mt-1 group-hover:text-orange-200 transition-colors">
                    {nextQuest.title}
                  </h3>
                  <p className="text-sm text-white/40 mt-1 line-clamp-2">{nextQuest.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-white/30">
                    <span className="flex items-center gap-1 text-orange-400/70">
                      <Zap className="w-3 h-3" />{nextQuest.xpReward} XP
                    </span>
                    <span>~{nextQuest.estimatedMinutes} min</span>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <ChevronDown className="w-5 h-5 text-orange-400 rotate-[-90deg]" />
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
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3 px-1">
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
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3 px-1">All phases</p>
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
    </div>
  );
};

export default PhoenixPath;
