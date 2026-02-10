import { motion } from "framer-motion";
import { Check, Lock, BookOpen, Wind, Snowflake, Brain, Heart, PenLine, Wrench, Users, Footprints, Moon } from "lucide-react";
import type { QuestDefinition } from "@/data/phoenixQuests";
import type { UserQuestState } from "@/hooks/use-phoenix-path";

interface QuestNodeProps {
  quest: QuestDefinition;
  status: UserQuestState['status'];
  index: number;
  onSelect: (quest: QuestDefinition) => void;
}

const QUEST_TYPE_ICONS: Record<string, React.ElementType> = {
  narrative: BookOpen,
  breathing: Wind,
  cold: Snowflake,
  cognitive: Brain,
  mindfulness: Heart,
  reflection: PenLine,
  toolkit: Wrench,
  echo: Users,
  physical: Footprints,
  rest: Moon,
};

export const QuestNode = ({ quest, status, index, onSelect }: QuestNodeProps) => {
  const Icon = QUEST_TYPE_ICONS[quest.type] || BookOpen;
  const isLeft = index % 2 === 0;
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  const isAvailable = status === 'available' || status === 'in_progress';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`flex items-center gap-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'} w-full`}
    >
      {/* Content card */}
      <button
        onClick={() => !isLocked && onSelect(quest)}
        disabled={isLocked}
        className={`flex-1 text-left rounded-xl p-3 transition-all duration-300 border ${
          isCompleted
            ? 'bg-orange-500/15 border-orange-500/30 hover:bg-orange-500/20'
            : isAvailable
            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/30 cursor-pointer'
            : 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 capitalize">
            {quest.type}
          </span>
          <span className="text-xs text-orange-400/80">{quest.xpReward} XP</span>
          <span className="text-xs text-white/40">~{quest.estimatedMinutes}min</span>
        </div>
        <h4 className={`text-sm font-medium ${isCompleted ? 'text-orange-300' : isAvailable ? 'text-white' : 'text-white/40'}`}>
          {quest.title}
        </h4>
        <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{quest.description}</p>
      </button>

      {/* Node circle on the path line */}
      <div className="relative flex-shrink-0">
        <motion.div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            isCompleted
              ? 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/30'
              : isAvailable
              ? 'bg-white/10 border-orange-500/50'
              : 'bg-white/5 border-white/10'
          }`}
          animate={isAvailable && !isCompleted ? {
            boxShadow: ['0 0 0px hsl(35, 90%, 55%)', '0 0 12px hsl(35, 90%, 55%)', '0 0 0px hsl(35, 90%, 55%)'],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-white" />
          ) : isLocked ? (
            <Lock className="w-4 h-4 text-white/30" />
          ) : (
            <Icon className="w-4 h-4 text-orange-400" />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
