import { motion } from "framer-motion";
import { Play, ArrowRight, Check, Headphones, Wind, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { WeekData } from "@/data/protocolWeeks";

interface TodaysFocusProps {
  weekData: WeekData;
  progress: {
    chapter: boolean;
    practice: boolean;
    reflection: boolean;
  };
  onStartChapter: () => void;
  onStartPractice: () => void;
  onStartReflection: () => void;
}

type ActionType = "chapter" | "practice" | "reflection";

interface ActionConfig {
  type: ActionType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  completed: boolean;
  onClick: () => void;
  linkTo?: string;
}

export const TodaysFocus = ({
  weekData,
  progress,
  onStartChapter,
  onStartPractice,
  onStartReflection,
}: TodaysFocusProps) => {
  const actions: ActionConfig[] = [
    {
      type: "chapter",
      title: `Listen: ${weekData.chapter}`,
      subtitle: "Today's chapter",
      icon: <Headphones className="w-6 h-6" />,
      gradient: "from-blue-600 to-indigo-600",
      completed: progress.chapter,
      onClick: onStartChapter,
    },
    {
      type: "practice",
      title: weekData.practice.breathing.name,
      subtitle: `${weekData.practice.breathing.duration} min breathing`,
      icon: <Wind className="w-6 h-6" />,
      gradient: "from-orange-600 to-red-600",
      completed: progress.practice,
      onClick: onStartPractice,
      linkTo: "/breathing-exercise",
    },
    {
      type: "reflection",
      title: "Daily Reflection",
      subtitle: "Journal your thoughts",
      icon: <Feather className="w-6 h-6" />,
      gradient: "from-purple-600 to-pink-600",
      completed: progress.reflection,
      onClick: onStartReflection,
    },
  ];

  // Find next incomplete action
  const nextAction = actions.find(a => !a.completed) || actions[0];
  const secondaryActions = actions.filter(a => a !== nextAction);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white/80">Today's Focus</h2>
        <span className="text-sm text-white/40">
          {actions.filter(a => a.completed).length} of 3 complete
        </span>
      </div>

      {/* Primary action card */}
      <PrimaryActionCard action={nextAction} />

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3">
        {secondaryActions.map((action) => (
          <SecondaryActionCard key={action.type} action={action} />
        ))}
      </div>
    </motion.div>
  );
};

const PrimaryActionCard = ({ action }: { action: ActionConfig }) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={action.onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-6 cursor-pointer group shadow-xl`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {action.completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <Check className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              {action.icon}
            </div>
          )}

          <div>
            <p className="text-sm text-white/70">{action.subtitle}</p>
            <h3 className="text-xl font-semibold text-white">{action.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {action.completed ? (
            <span className="text-sm text-white/80 font-medium">Done</span>
          ) : (
            <>
              <span className="text-sm text-white/80 hidden sm:inline">Start</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (action.linkTo && !action.completed) {
    return <Link to={action.linkTo}>{content}</Link>;
  }

  return content;
};

const SecondaryActionCard = ({ action }: { action: ActionConfig }) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={action.onClick}
      className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all ${
        action.completed
          ? "bg-green-500/10 border border-green-500/20"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            action.completed
              ? "bg-green-500/20 text-green-400"
              : `bg-gradient-to-br ${action.gradient} text-white`
          }`}
        >
          {action.completed ? <Check className="w-5 h-5" /> : action.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-xs ${action.completed ? "text-green-400/70" : "text-white/50"}`}>
            {action.subtitle}
          </p>
          <h4
            className={`text-sm font-medium truncate ${
              action.completed ? "text-green-300" : "text-white/90"
            }`}
          >
            {action.title}
          </h4>
        </div>
      </div>
    </motion.div>
  );

  if (action.linkTo && !action.completed) {
    return <Link to={action.linkTo}>{content}</Link>;
  }

  return content;
};
