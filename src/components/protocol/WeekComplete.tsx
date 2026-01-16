import { motion } from 'framer-motion';
import { Flame, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeekData } from '@/data/protocolWeeks';
import { getWeekData } from '@/data/protocolWeeks';

interface WeekCompleteProps {
  currentWeek: number;
  totalWeeks: number;
  onAdvance: () => void;
}

export const WeekComplete = ({ currentWeek, totalWeeks, onAdvance }: WeekCompleteProps) => {
  const nextWeekData = getWeekData(currentWeek + 1);
  const isProtocolComplete = currentWeek >= totalWeeks;

  if (isProtocolComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/30"
      >
        {/* Celebration particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ 
                y: -100, 
                opacity: [0, 1, 0],
                x: Math.sin(i) * 50
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{ left: `${(i / 20) * 100}%`, bottom: 0 }}
            />
          ))}
        </div>

        <div className="relative p-8 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/50"
          >
            <Star className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-serif text-white mb-3">
            Protocol Complete
          </h2>
          <p className="text-orange-200/80 mb-6 max-w-md mx-auto">
            You've completed The Phoenix Protocol. Your transformation is just beginning.
            The practices you've learned are yours forever.
          </p>

          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8"
          >
            View Your Transformation
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/30 to-teal-900/30 border border-green-500/30"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 animate-pulse" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Flame className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">
              Week {currentWeek} Complete! 🎉
            </h3>
            <p className="text-white/70 mb-4">
              You've completed all practices for this week. Ready for the next chapter?
            </p>

            {nextWeekData && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                <p className="text-sm text-white/60 mb-1">Coming up next:</p>
                <p className="text-lg font-medium text-white">
                  Week {currentWeek + 1}: "{nextWeekData.chapter}"
                </p>
                <p className="text-sm text-orange-400">{nextWeekData.theme}</p>
              </div>
            )}

            <Button
              onClick={onAdvance}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white shadow-lg shadow-green-500/20"
            >
              <span>Unlock Week {currentWeek + 1}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};