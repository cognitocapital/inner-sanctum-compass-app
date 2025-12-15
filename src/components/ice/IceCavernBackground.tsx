import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IceCavernBackgroundProps {
  intensity: number; // 0-100 representing timer progress
  isActive: boolean;
  phase: 'prepare' | 'enter' | 'endure' | 'exit';
}

export const IceCavernBackground = ({ intensity, isActive, phase }: IceCavernBackgroundProps) => {
  const crystalCount = 8;
  const snowflakeCount = 15;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cavern gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center bottom, 
            hsl(200 80% ${15 + intensity * 0.1}%) 0%, 
            hsl(210 90% ${8 + intensity * 0.05}%) 40%, 
            hsl(220 95% ${3}%) 100%)`
        }}
      />

      {/* Ice crystals growing from edges */}
      {[...Array(crystalCount)].map((_, i) => {
        const side = i % 4;
        const position = (i / crystalCount) * 100;
        
        return (
          <motion.div
            key={`crystal-${i}`}
            className="absolute"
            style={{
              left: side === 0 ? `${position}%` : side === 1 ? '0' : side === 2 ? `${position}%` : '100%',
              top: side === 0 ? '0' : side === 1 ? `${position}%` : side === 2 ? '100%' : `${position}%`,
              transform: `rotate(${side * 90 + (i % 2 === 0 ? 15 : -15)}deg)`,
            }}
            initial={{ scale: 0.3, opacity: 0.3 }}
            animate={{ 
              scale: isActive ? 0.6 + (intensity / 100) * 0.8 : 0.3,
              opacity: isActive ? 0.4 + (intensity / 100) * 0.4 : 0.3
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <svg width="60" height="100" viewBox="0 0 60 100" className="drop-shadow-lg">
              <defs>
                <linearGradient id={`crystal-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(190 90% 70%)" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="hsl(200 85% 60%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(210 80% 50%)" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <polygon 
                points="30,0 50,40 40,100 20,100 10,40" 
                fill={`url(#crystal-grad-${i})`}
                className="drop-shadow-xl"
              />
              <polygon 
                points="30,0 50,40 30,35" 
                fill="hsl(180 100% 90%)"
                opacity="0.3"
              />
            </svg>
          </motion.div>
        );
      })}

      {/* Snowfall particles */}
      {[...Array(snowflakeCount)].map((_, i) => (
        <motion.div
          key={`snow-${i}`}
          className="absolute rounded-full bg-white/80"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${Math.random() * 100}%`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.sin(i) * 30],
            opacity: isActive ? [0, 0.8, 0.8, 0] : [0, 0.3, 0.3, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear"
          }}
        />
      ))}

      {/* Frost overlay intensifying with timer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, 
            transparent 30%, 
            hsl(200 80% 90% / ${intensity * 0.003}) 70%, 
            hsl(200 90% 95% / ${intensity * 0.008}) 100%)`
        }}
        animate={{
          opacity: isActive ? [0.5, 0.8, 0.5] : 0.3
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Phase-specific aurora */}
      {phase === 'endure' && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, 
              hsl(180 80% 50% / 0.1) 0%, 
              hsl(200 70% 40% / 0.05) 50%,
              transparent 100%)`
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            x: [-20, 20, -20]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Phoenix thaw effect on exit */}
      {phase === 'exit' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, 
                  hsl(30 90% 60% / 0.6) 0%, 
                  hsl(20 85% 50% / 0.3) 50%,
                  transparent 70%)`
              }}
              animate={{
                scale: [1, 1.5, 1.2],
                opacity: [0.4, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                background: `radial-gradient(circle, 
                  hsl(35 95% 65% / 0.8) 0%, 
                  transparent 60%)`
              }}
              animate={{ scale: [0.8, 1.1, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IceCavernBackground;
