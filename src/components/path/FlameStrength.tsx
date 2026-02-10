import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface FlameStrengthProps {
  value: number; // 0-100
  phase: number;
  phaseName: string;
}

export const FlameStrength = ({ value, phase, phaseName }: FlameStrengthProps) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame
          className="w-6 h-6"
          style={{
            color: `hsl(${35 - (clampedValue / 100) * 15}, ${70 + clampedValue * 0.3}%, ${50 + clampedValue * 0.2}%)`,
            filter: `drop-shadow(0 0 ${4 + clampedValue * 0.1}px hsl(35, 90%, 55%))`,
          }}
        />
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/60 truncate">
            Phase {phase}: {phaseName}
          </span>
          <span className="text-xs text-orange-300 font-medium">{clampedValue}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, hsl(35, 80%, 45%), hsl(25, 90%, 55%))`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};
