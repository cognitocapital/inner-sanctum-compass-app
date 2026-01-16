import { motion } from "framer-motion";
import { Check, BookOpen, Flame, Feather } from "lucide-react";
import type { WeekData } from "@/data/protocolWeeks";

interface HeroWeekCardProps {
  weekData: WeekData;
  currentWeek: number;
  totalWeeks: number;
  progress: {
    chapter: boolean;
    practice: boolean;
    reflection: boolean;
  };
}

const WEEK_GRADIENTS: Record<number, string> = {
  1: "from-rose-950 via-orange-950 to-amber-950",
  2: "from-slate-950 via-blue-950 to-slate-900",
  3: "from-red-950 via-rose-950 to-red-900",
  4: "from-emerald-950 via-teal-950 to-emerald-900",
  5: "from-violet-950 via-purple-950 to-indigo-900",
  6: "from-cyan-950 via-teal-950 to-cyan-900",
  7: "from-amber-950 via-orange-950 to-amber-900",
  8: "from-green-950 via-emerald-950 to-green-900",
  9: "from-slate-950 via-zinc-900 to-slate-900",
  10: "from-orange-950 via-amber-950 to-yellow-900",
};

export const HeroWeekCard = ({ weekData, currentWeek, totalWeeks, progress }: HeroWeekCardProps) => {
  const gradient = WEEK_GRADIENTS[currentWeek] || WEEK_GRADIENTS[1];
  const completedCount = [progress.chapter, progress.practice, progress.reflection].filter(Boolean).length;
  const progressPercent = (completedCount / 3) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} border border-white/10`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative p-8 md:p-10">
        {/* Week badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6"
        >
          <span className="text-sm text-white/60">Week</span>
          <span className="text-sm font-bold text-white">{currentWeek}</span>
          <span className="text-sm text-white/40">of {totalWeeks}</span>
        </motion.div>

        {/* Theme */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm uppercase tracking-widest text-orange-400/80 mb-3"
        >
          {weekData.theme}
        </motion.p>

        {/* Chapter title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight"
        >
          {weekData.chapter}
        </motion.h1>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-white/60 italic font-light max-w-2xl mb-8"
        >
          "{weekData.quote}"
        </motion.blockquote>

        {/* Progress indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center gap-4"
        >
          <ProgressPill 
            icon={<BookOpen className="w-4 h-4" />}
            label="Chapter"
            completed={progress.chapter}
          />
          <ProgressPill 
            icon={<Flame className="w-4 h-4" />}
            label="Practice"
            completed={progress.practice}
          />
          <ProgressPill 
            icon={<Feather className="w-4 h-4" />}
            label="Reflection"
            completed={progress.reflection}
          />
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progressPercent / 100 }}
              transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 origin-left rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProgressPill = ({ 
  icon, 
  label, 
  completed 
}: { 
  icon: React.ReactNode; 
  label: string; 
  completed: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
      completed 
        ? "bg-green-500/20 border border-green-500/30" 
        : "bg-white/5 border border-white/10"
    }`}
  >
    <div className={completed ? "text-green-400" : "text-white/40"}>
      {completed ? <Check className="w-4 h-4" /> : icon}
    </div>
    <span className={`text-sm font-medium ${completed ? "text-green-300" : "text-white/60"}`}>
      {label}
    </span>
  </motion.div>
);
