import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BodyHeatMapProps {
  temperature: number; // 0-100 representing cold adaptation (0 = cold blue, 100 = warm red)
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BodyHeatMap = ({ temperature, isActive, size = 'md' }: BodyHeatMapProps) => {
  const sizes = {
    sm: { width: 80, height: 160 },
    md: { width: 120, height: 240 },
    lg: { width: 160, height: 320 }
  };

  const { width, height } = sizes[size];

  // Color interpolation from blue (cold) to red (warm/adapted)
  const getColor = (temp: number, region: 'core' | 'limbs' | 'extremities') => {
    // Different regions warm up at different rates
    const regionModifier = region === 'core' ? 1.2 : region === 'limbs' ? 1.0 : 0.7;
    const adjustedTemp = Math.min(100, temp * regionModifier);
    
    const hue = 200 - (adjustedTemp * 2); // 200 (blue) to 0 (red)
    const saturation = 70 + (adjustedTemp * 0.2);
    const lightness = 45 + (adjustedTemp * 0.15);
    
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
  };

  return (
    <div className="relative" style={{ width, height }}>
      <svg 
        viewBox="0 0 100 200" 
        className="w-full h-full drop-shadow-lg"
      >
        <defs>
          {/* Core gradient */}
          <linearGradient id="core-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: getColor(temperature, 'core') }}
              transition={{ duration: 1 }}
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: getColor(temperature * 0.9, 'core') }}
              transition={{ duration: 1 }}
            />
          </linearGradient>
          
          {/* Limbs gradient */}
          <linearGradient id="limbs-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: getColor(temperature * 0.8, 'limbs') }}
              transition={{ duration: 1 }}
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: getColor(temperature * 0.6, 'limbs') }}
              transition={{ duration: 1 }}
            />
          </linearGradient>

          {/* Extremities gradient */}
          <linearGradient id="extremities-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <motion.stop 
              offset="0%" 
              animate={{ stopColor: getColor(temperature * 0.5, 'extremities') }}
              transition={{ duration: 1 }}
            />
            <motion.stop 
              offset="100%" 
              animate={{ stopColor: getColor(temperature * 0.3, 'extremities') }}
              transition={{ duration: 1 }}
            />
          </linearGradient>

          {/* Glow filter */}
          <filter id="heat-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Body outline - simplified human figure */}
        <g filter={isActive ? "url(#heat-glow)" : undefined}>
          {/* Head */}
          <motion.circle 
            cx="50" cy="15" r="12"
            fill="url(#core-gradient)"
            animate={{ opacity: isActive ? 1 : 0.7 }}
          />
          
          {/* Neck */}
          <rect x="46" y="27" width="8" height="8" fill="url(#core-gradient)" />
          
          {/* Torso */}
          <motion.path 
            d="M35 35 Q30 35 28 50 L25 85 Q25 95 35 95 L65 95 Q75 95 75 85 L72 50 Q70 35 65 35 Z"
            fill="url(#core-gradient)"
            animate={{ 
              opacity: isActive ? 1 : 0.7,
              scale: isActive ? [1, 1.01, 1] : 1
            }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          />
          
          {/* Left Arm */}
          <motion.path 
            d="M28 40 Q18 42 15 60 L12 90 Q10 95 15 98 L20 95 L25 65 Q26 55 28 50"
            fill="url(#limbs-gradient)"
            animate={{ opacity: isActive ? 1 : 0.6 }}
          />
          
          {/* Right Arm */}
          <motion.path 
            d="M72 40 Q82 42 85 60 L88 90 Q90 95 85 98 L80 95 L75 65 Q74 55 72 50"
            fill="url(#limbs-gradient)"
            animate={{ opacity: isActive ? 1 : 0.6 }}
          />
          
          {/* Left Leg */}
          <motion.path 
            d="M35 95 L30 150 L28 185 Q27 195 35 195 L42 195 Q45 190 43 180 L45 120 L45 95"
            fill="url(#limbs-gradient)"
            animate={{ opacity: isActive ? 1 : 0.6 }}
          />
          
          {/* Right Leg */}
          <motion.path 
            d="M65 95 L70 150 L72 185 Q73 195 65 195 L58 195 Q55 190 57 180 L55 120 L55 95"
            fill="url(#limbs-gradient)"
            animate={{ opacity: isActive ? 1 : 0.6 }}
          />

          {/* Feet (extremities) */}
          <motion.ellipse 
            cx="35" cy="195" rx="10" ry="5"
            fill="url(#extremities-gradient)"
            animate={{ opacity: isActive ? 1 : 0.5 }}
          />
          <motion.ellipse 
            cx="65" cy="195" rx="10" ry="5"
            fill="url(#extremities-gradient)"
            animate={{ opacity: isActive ? 1 : 0.5 }}
          />
          
          {/* Hands (extremities) */}
          <motion.circle 
            cx="15" cy="98" r="5"
            fill="url(#extremities-gradient)"
            animate={{ opacity: isActive ? 1 : 0.5 }}
          />
          <motion.circle 
            cx="85" cy="98" r="5"
            fill="url(#extremities-gradient)"
            animate={{ opacity: isActive ? 1 : 0.5 }}
          />
        </g>

        {/* Pulse effect when adapting */}
        {isActive && temperature > 20 && (
          <motion.circle
            cx="50"
            cy="65"
            r="25"
            fill="none"
            stroke={getColor(temperature, 'core')}
            strokeWidth="2"
            animate={{
              r: [25, 40, 25],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Temperature indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-20 h-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-red-500 overflow-hidden">
          <motion.div
            className="h-full bg-white/80 rounded-full"
            style={{ width: 4 }}
            animate={{ x: `${temperature * 0.76}px` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{Math.round(temperature)}%</span>
      </div>
    </div>
  );
};

export default BodyHeatMap;
