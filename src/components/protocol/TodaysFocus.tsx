import { motion } from 'framer-motion';
import { BookOpen, Wind, PenLine, Check, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeekData } from '@/data/protocolWeeks';
import { Link } from 'react-router-dom';

interface TodaysFocusProps {
  weekData: WeekData;
  progress: {
    chapterCompleted: boolean;
    practiceCompleted: boolean;
    reflectionCompleted: boolean;
  };
  onStartPractice: () => void;
  onStartReflection: () => void;
}

type FocusType = 'chapter' | 'practice' | 'reflection' | 'complete';

export const TodaysFocus = ({ weekData, progress, onStartPractice, onStartReflection }: TodaysFocusProps) => {
  // Determine the current focus
  const getCurrentFocus = (): FocusType => {
    if (!progress.chapterCompleted) return 'chapter';
    if (!progress.practiceCompleted) return 'practice';
    if (!progress.reflectionCompleted) return 'reflection';
    return 'complete';
  };

  const focus = getCurrentFocus();

  const focusConfig = {
    chapter: {
      icon: BookOpen,
      title: 'Read This Week\'s Chapter',
      description: weekData.chapter,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
      action: () => {},
      route: weekData.chapterRoute,
      buttonText: 'Start Reading'
    },
    practice: {
      icon: Wind,
      title: 'Complete Today\'s Practice',
      description: `${weekData.breathingPattern} • ${weekData.challenge}`,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-500/10 to-teal-500/10',
      action: onStartPractice,
      buttonText: 'Begin Practice'
    },
    reflection: {
      icon: PenLine,
      title: 'Write Your Reflection',
      description: weekData.reflectionPrompt,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-500/10 to-indigo-500/10',
      action: onStartReflection,
      buttonText: 'Start Writing'
    },
    complete: {
      icon: Flame,
      title: 'Week Complete!',
      description: 'You\'ve completed all activities for this week. Amazing work!',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-500/10 to-orange-500/10',
      action: () => {},
      buttonText: 'View Progress'
    }
  };

  const config = focusConfig[focus];
  const Icon = config.icon;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-medium text-white/60 mb-4 flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        Today's Focus
      </h3>

      <motion.div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bgColor} border border-white/10 backdrop-blur-sm`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Subtle animated background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-5`}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative p-6 md:p-8">
          <div className="flex items-start gap-4 md:gap-6">
            {/* Icon */}
            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xl md:text-2xl font-semibold text-white mb-2">
                {config.title}
              </h4>
              <p className="text-white/60 line-clamp-2 mb-4">
                {config.description}
              </p>

              {/* Action */}
              {focus !== 'complete' ? (
                config.route ? (
                  <Button
                    asChild
                    className={`bg-gradient-to-r ${config.color} text-white font-medium group`}
                  >
                    <Link to={config.route}>
                      {config.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={config.action}
                    className={`bg-gradient-to-r ${config.color} text-white font-medium group`}
                  >
                    {config.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">All done for this week!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary actions (collapsed by default) */}
      {focus !== 'complete' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {progress.chapterCompleted && !progress.practiceCompleted && (
            <div className="flex items-center gap-2 text-white/40 text-sm p-3 rounded-lg bg-white/5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Chapter read</span>
            </div>
          )}
          {progress.practiceCompleted && !progress.reflectionCompleted && (
            <div className="flex items-center gap-2 text-white/40 text-sm p-3 rounded-lg bg-white/5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Practice done</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
