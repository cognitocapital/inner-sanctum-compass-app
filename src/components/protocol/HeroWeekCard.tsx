import { motion } from 'framer-motion';
import { BookOpen, Flame, Headphones, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { WeekData } from '@/data/protocolWeeks';

interface HeroWeekCardProps {
  weekData: WeekData;
  currentWeek: number;
  progress: {
    chapterCompleted: boolean;
    practiceCompleted: boolean;
    reflectionCompleted: boolean;
  };
  onStartChapter: () => void;
}

export const HeroWeekCard = ({ weekData, currentWeek, progress, onStartChapter }: HeroWeekCardProps) => {
  const completedTasks = [progress.chapterCompleted, progress.practiceCompleted, progress.reflectionCompleted].filter(Boolean).length;
  const progressPercent = (completedTasks / 3) * 100;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Dramatic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-red-900/40 to-gray-900" />
      
      {/* Animated glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative p-8 md:p-12">
        {/* Week indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
            <span className="text-orange-300 font-semibold text-sm tracking-wide">WEEK {currentWeek}</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent" />
        </div>

        {/* Chapter title - dramatic typography */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
          {weekData.chapter}
        </h2>

        {/* Theme */}
        <p className="text-xl md:text-2xl text-orange-300/90 font-light mb-8 italic">
          "{weekData.theme}"
        </p>

        {/* Progress visualization */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Week Progress</span>
            <span className="text-orange-400 font-medium">{completedTasks}/3 Complete</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap gap-4">
          {!progress.chapterCompleted ? (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 shadow-lg shadow-orange-500/30 group"
            >
              <Link to={weekData.chapterPath}>
                <Headphones className="mr-2 h-5 w-5" />
                Listen to Chapter
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          ) : !progress.practiceCompleted ? (
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Today's Practice
            </Button>
          ) : !progress.reflectionCompleted ? (
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold px-8"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Write Reflection
            </Button>
          ) : (
            <div className="flex items-center gap-3 text-emerald-400">
              <Flame className="w-6 h-6" />
              <span className="text-lg font-medium">Week Complete!</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative corner flame */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-500/30 to-transparent rounded-full blur-3xl" />
    </motion.div>
  );
};
