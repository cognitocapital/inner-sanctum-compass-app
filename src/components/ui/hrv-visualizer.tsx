import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart, Activity, TrendingUp } from "lucide-react";

interface HRVVisualizerProps {
  hrvValue: number; // 0-100
  isActive: boolean;
  breathsPerMinute?: number;
  coherenceScore?: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const HRVVisualizer = ({
  hrvValue,
  isActive,
  breathsPerMinute = 6,
  coherenceScore = 50,
  size = 'md',
  className,
}: HRVVisualizerProps) => {
  const sizeClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  };

  // Generate wave points based on HRV and coherence
  const generateWavePoints = () => {
    const points = [];
    const segments = 60;
    const amplitude = hrvValue / 2;
    const coherenceSmooth = coherenceScore / 100;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      // Higher coherence = more regular wave
      const variation = (1 - coherenceSmooth) * Math.random() * 10;
      const y = 50 + Math.sin((i / segments) * Math.PI * 4) * amplitude + variation;
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  const getHrvColor = () => {
    if (hrvValue >= 70) return '#10b981'; // emerald - excellent
    if (hrvValue >= 50) return '#06b6d4'; // cyan - good
    if (hrvValue >= 30) return '#f97316'; // orange - moderate
    return '#ef4444'; // red - needs improvement
  };

  const getHrvLabel = () => {
    if (hrvValue >= 70) return 'Excellent';
    if (hrvValue >= 50) return 'Good';
    if (hrvValue >= 30) return 'Moderate';
    return 'Building';
  };

  return (
    <div className={cn("relative rounded-xl bg-slate-900/60 border border-white/10 overflow-hidden", sizeClasses[size], className)}>
      {/* Wave Animation */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="hrv-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getHrvColor()} stopOpacity="0.1" />
            <stop offset="50%" stopColor={getHrvColor()} stopOpacity="0.3" />
            <stop offset="100%" stopColor={getHrvColor()} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Background wave */}
        <motion.polyline
          fill="none"
          stroke={getHrvColor()}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          points={generateWavePoints()}
          animate={{
            translateX: isActive ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: 60 / breathsPerMinute,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Main wave */}
        <motion.polyline
          fill="none"
          stroke={getHrvColor()}
          strokeWidth="1.5"
          points={generateWavePoints()}
          animate={{
            translateX: isActive ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 60 / breathsPerMinute,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Fill under wave */}
        <motion.polygon
          fill="url(#hrv-gradient)"
          points={`0,100 ${generateWavePoints()} 100,100`}
          animate={{
            translateX: isActive ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 60 / breathsPerMinute,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>

      {/* Stats Overlay */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: isActive ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 60 / breathsPerMinute / 2,
              repeat: Infinity,
            }}
          >
            <Heart 
              className="w-5 h-5" 
              style={{ color: getHrvColor() }}
              fill={getHrvColor()}
            />
          </motion.div>
          <div>
            <div className="text-lg font-bold text-white">{Math.round(hrvValue)}%</div>
            <div className="text-xs text-white/60">HRV Index</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm font-semibold" style={{ color: getHrvColor() }}>
            {getHrvLabel()}
          </div>
          <div className="text-xs text-white/50">Coherence</div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white/60" />
          <div>
            <div className="text-sm font-bold text-white">{breathsPerMinute}</div>
            <div className="text-xs text-white/60">BPM</div>
          </div>
        </div>
      </div>

      {/* Pulse indicator */}
      {isActive && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: getHrvColor() }}
          animate={{
            opacity: [1, 0.3, 1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
};

export default HRVVisualizer;
