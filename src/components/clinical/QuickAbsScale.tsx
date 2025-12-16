import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickAbsScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  accentColor?: string;
}

const ABS_OPTIONS = [
  { value: 1, emoji: "😊", label: "Calm", color: "from-green-500 to-emerald-600" },
  { value: 2, emoji: "😐", label: "Mild", color: "from-yellow-500 to-amber-600" },
  { value: 3, emoji: "😤", label: "Moderate", color: "from-orange-500 to-red-500" },
  { value: 4, emoji: "😡", label: "Severe", color: "from-red-600 to-rose-700" },
];

const QuickAbsScale: React.FC<QuickAbsScaleProps> = ({ 
  value, 
  onChange, 
  accentColor = "cyan" 
}) => {
  const accentClasses: Record<string, string> = {
    cyan: "ring-cyan-500",
    orange: "ring-orange-500",
    purple: "ring-purple-500",
    pink: "ring-pink-500",
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">
        How are you feeling right now?
      </p>
      <div className="flex justify-center gap-3">
        {ABS_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={cn(
              "w-14 h-14 rounded-full flex flex-col items-center justify-center",
              "bg-gradient-to-br transition-all duration-200",
              option.color,
              value === option.value 
                ? `ring-2 ${accentClasses[accentColor] || accentClasses.cyan} ring-offset-2 ring-offset-background` 
                : "opacity-60 hover:opacity-100"
            )}
          >
            <span className="text-2xl">{option.emoji}</span>
          </motion.button>
        ))}
      </div>
      {value !== null && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center text-muted-foreground"
        >
          {ABS_OPTIONS.find(o => o.value === value)?.label} agitation level
        </motion.p>
      )}
    </div>
  );
};

export default QuickAbsScale;
