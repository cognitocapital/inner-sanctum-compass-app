import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Clock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuestDefinition } from "@/data/phoenixQuests";

interface QuestCardProps {
  quest: QuestDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onBegin: (quest: QuestDefinition) => void;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
}

export const QuestCard = ({ quest, isOpen, onClose, onBegin, status }: QuestCardProps) => {
  if (!quest) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-white/10 rounded-t-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              {/* Handle bar */}
              <div className="flex justify-center">
                <div className="w-12 h-1 rounded-full bg-white/20" />
              </div>

              {/* Close button */}
              <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              {/* Quest type badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 capitalize font-medium">
                  {quest.type}
                </span>
                {quest.bookChapterRef && (
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Chapter {quest.bookChapterRef}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-serif text-white">{quest.title}</h2>
              <p className="text-white/60 text-sm">{quest.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Zap className="w-4 h-4" />
                  <span>{quest.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50">
                  <Clock className="w-4 h-4" />
                  <span>~{quest.estimatedMinutes} min</span>
                </div>
              </div>

              {/* Quote */}
              {quest.quote && (
                <blockquote className="border-l-2 border-orange-500/50 pl-4 italic text-white/50 text-sm">
                  "{quest.quote}"
                </blockquote>
              )}

              {/* Science note */}
              {quest.scienceNote && (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/40 mb-1 font-medium uppercase tracking-wider">Science Note</p>
                  <p className="text-sm text-white/60">{quest.scienceNote}</p>
                </div>
              )}

              {/* Self-compassion prompt */}
              {quest.selfCompassionPrompt && (
                <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                  <p className="text-sm text-orange-200/80 italic">💛 {quest.selfCompassionPrompt}</p>
                </div>
              )}

              {/* Symptom tags */}
              {quest.symptomTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {quest.symptomTags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40 capitalize">
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* Action button */}
              <Button
                onClick={() => onBegin(quest)}
                disabled={status === 'completed'}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-6 text-lg"
              >
                {status === 'completed' ? (
                  'Completed ✓'
                ) : (
                  <>
                    Begin Quest <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
