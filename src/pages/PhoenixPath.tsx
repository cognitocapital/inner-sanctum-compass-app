import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, LogOut, User, Flame, Zap, BookHeart, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { usePhoenixPath } from "@/hooks/use-phoenix-path";
import { PHOENIX_QUESTS, PHASES, getQuestsForPhase, type QuestDefinition } from "@/data/phoenixQuests";
import { FlameStrength } from "@/components/path/FlameStrength";
import { QuestNode } from "@/components/path/QuestNode";
import { QuestCard } from "@/components/path/QuestCard";
import { toast } from "sonner";

const PhoenixPath = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const { profile } = useProfile();
  const { quests, currentPhase, flameStrength, isLoading, totalXp, completedCount, getQuestStatus, phases } = usePhoenixPath();
  const [selectedQuest, setSelectedQuest] = useState<QuestDefinition | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleBeginQuest = (quest: QuestDefinition) => {
    setSelectedQuest(null);
    navigate(`/quest/${quest.key}`);
  };

  const phaseColors: Record<number, string> = {
    1: "from-gray-950 via-gray-900 to-amber-950/40",
    2: "from-amber-950/40 via-orange-950/50 to-red-950/40",
    3: "from-red-950/30 via-amber-900/30 to-yellow-950/30",
    4: "from-yellow-950/20 via-orange-900/20 to-sky-950/30",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white relative overflow-hidden">
      {/* Ambient embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={`ember-${i}`}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ember-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${30 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.7}s`,
              opacity: 0.2 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
        </div>
      </header>

      <div className="container mx-auto px-4 pb-24 relative z-10">
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6 space-y-4"
        >
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-300 font-medium">The Phoenix Path</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white">
              {PHASES[currentPhase - 1]?.name}
            </h1>
            <p className="text-white/50 text-sm mt-1">{PHASES[currentPhase - 1]?.subtitle}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-orange-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">{totalXp} XP</span>
            </div>
            <div className="text-white/40">
              {completedCount}/{PHOENIX_QUESTS.length} quests
            </div>
          </div>

          {/* Flame Strength */}
          <div className="max-w-md mx-auto">
            <FlameStrength
              value={flameStrength}
              phase={currentPhase}
              phaseName={PHASES[currentPhase - 1]?.name || ""}
            />
          </div>
        </motion.div>

        {/* Phase Sections */}
        {PHASES.map((phase) => {
          const phaseQuests = getQuestsForPhase(phase.phase);
          const isCurrentPhase = phase.phase === currentPhase;
          const isUnlocked = phase.phase <= currentPhase;
          const completedInPhase = phaseQuests.filter(
            q => getQuestStatus(q.key) === 'completed'
          ).length;

          return (
            <motion.section
              key={phase.phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: phase.phase * 0.15 }}
              className={`mb-8 ${!isUnlocked ? 'opacity-40' : ''}`}
            >
              {/* Phase header */}
              <div className={`sticky top-16 z-20 py-3 mb-4 bg-gradient-to-r ${phaseColors[phase.phase] || ''} backdrop-blur-sm rounded-xl px-4 border ${isCurrentPhase ? 'border-orange-500/30' : 'border-white/5'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-serif text-white">{phase.name}</h2>
                    <p className="text-xs text-white/50">{phase.subtitle}</p>
                  </div>
                  <span className="text-xs text-white/40">
                    {completedInPhase}/{phaseQuests.length}
                  </span>
                </div>
              </div>

              {/* Quest nodes - vertical path */}
              <div className="relative pl-6 pr-2">
                {/* Vertical line */}
                <div className="absolute left-[calc(50%)] top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/20 via-orange-500/10 to-transparent" />

                <div className="space-y-3">
                  {phaseQuests.map((quest, idx) => (
                    <QuestNode
                      key={quest.key}
                      quest={quest}
                      status={getQuestStatus(quest.key)}
                      index={idx}
                      onSelect={setSelectedQuest}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          );
        })}

        {/* Bottom nav buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/5"
          >
            <Link to="/my-chapters">
              <BookHeart className="w-4 h-4 mr-2" />
              My Phoenix Chapters
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/5"
          >
            <Link to="/directory">
              <ExternalLink className="w-4 h-4 mr-2" />
              Resource Directory
            </Link>
          </Button>
        </div>
      </div>

      {/* Quest preview bottom sheet */}
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
