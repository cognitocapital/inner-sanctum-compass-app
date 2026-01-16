import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakFlameProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 16, container: 32, text: "text-xs" },
  md: { icon: 20, container: 40, text: "text-sm" },
  lg: { icon: 28, container: 56, text: "text-base" },
};

export const StreakFlame = ({ 
  streak, 
  size = "md", 
  showLabel = true,
  className = ""
}: StreakFlameProps) => {
  const { icon, container, text } = SIZES[size];
  
  // Intensity increases with streak
  const intensity = Math.min(streak / 30, 1);
  const glowOpacity = 0.3 + intensity * 0.5;
  
  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div 
        className="relative flex items-center justify-center"
        style={{ width: container, height: container }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500 blur-md"
          animate={{ 
            opacity: [glowOpacity, glowOpacity + 0.2, glowOpacity],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Inner circle */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
          <motion.div
            animate={{ 
              y: [0, -2, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame 
              className="text-white" 
              style={{ width: icon, height: icon }} 
            />
          </motion.div>
        </div>
      </div>
      
      {showLabel && (
        <div className="flex flex-col">
          <motion.span 
            className={`font-bold text-white ${text}`}
            key={streak}
            initial={{ scale: 1.3, color: "#fb923c" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {streak}
          </motion.span>
          <span className="text-white/50 text-xs uppercase tracking-wider">
            day{streak !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Mini version for inline use
export const StreakBadge = ({ streak }: { streak: number }) => {
  if (streak === 0) return null;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Flame className="w-3.5 h-3.5 text-orange-400" />
      </motion.div>
      <span className="text-sm font-medium text-orange-300">{streak}</span>
    </motion.div>
  );
};
