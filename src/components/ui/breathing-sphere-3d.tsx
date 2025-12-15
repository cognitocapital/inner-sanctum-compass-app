import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface BreathingSphere3DProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  hrvLevel?: number; // 0-100 HRV proxy
  showHrvRings?: boolean;
}

const phaseConfig = {
  inhale: { 
    scale: 1.3, 
    gradient: ['#06b6d4', '#3b82f6', '#6366f1'],
    glow: 'rgba(6, 182, 212, 0.6)',
    duration: 4 
  },
  hold: { 
    scale: 1.2, 
    gradient: ['#f97316', '#ef4444', '#dc2626'],
    glow: 'rgba(249, 115, 22, 0.6)',
    duration: 4 
  },
  exhale: { 
    scale: 0.85, 
    gradient: ['#10b981', '#14b8a6', '#06b6d4'],
    glow: 'rgba(16, 185, 129, 0.6)',
    duration: 6 
  },
  pause: { 
    scale: 1.0, 
    gradient: ['#8b5cf6', '#7c3aed', '#6366f1'],
    glow: 'rgba(139, 92, 246, 0.6)',
    duration: 2 
  },
};

const sizeClasses = {
  sm: { container: 'w-40 h-40', sphere: 160 },
  md: { container: 'w-56 h-56', sphere: 224 },
  lg: { container: 'w-72 h-72', sphere: 288 },
};

export const BreathingSphere3D = ({ 
  phase, 
  isActive, 
  size = 'lg',
  hrvLevel = 50,
  showHrvRings = true 
}: BreathingSphere3DProps) => {
  const config = phaseConfig[phase];
  const sizeConfig = sizeClasses[size];
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) * (Math.PI / 180),
      delay: i * 0.1,
    }));
    setParticles(newParticles);
  }, []);

  const gradientId = `sphere-gradient-${phase}`;
  
  return (
    <div className={cn("relative flex items-center justify-center", sizeConfig.container)}>
      {/* HRV Rings - Pulsing based on HRV level */}
      {showHrvRings && (
        <>
          <motion.div
            className="absolute rounded-full border-2 opacity-20"
            style={{ 
              borderColor: config.gradient[0],
              width: '120%',
              height: '120%',
            }}
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
              opacity: isActive ? [0.1, 0.3, 0.1] : 0.1,
            }}
            transition={{
              duration: 2 + (hrvLevel / 50),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute rounded-full border opacity-10"
            style={{ 
              borderColor: config.gradient[1],
              width: '140%',
              height: '140%',
            }}
            animate={{
              scale: isActive ? [1, 1.15, 1] : 1,
              opacity: isActive ? [0.05, 0.2, 0.05] : 0.05,
            }}
            transition={{
              duration: 3 + (hrvLevel / 50),
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Outer Glow */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{ 
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
          width: '150%',
          height: '150%',
        }}
        animate={{
          scale: isActive ? config.scale * 1.2 : 1,
          opacity: isActive ? 0.8 : 0.3,
        }}
        transition={{
          duration: config.duration,
          ease: "easeInOut",
        }}
      />

      {/* Main Sphere with 3D Effect */}
      <motion.div
        className="relative rounded-full shadow-2xl overflow-hidden"
        style={{
          width: sizeConfig.sphere * 0.7,
          height: sizeConfig.sphere * 0.7,
          background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]}, ${config.gradient[2]})`,
          boxShadow: `
            0 0 60px ${config.glow},
            inset 0 -20px 40px rgba(0,0,0,0.3),
            inset 0 20px 40px rgba(255,255,255,0.2)
          `,
        }}
        animate={{
          scale: isActive ? config.scale : 1,
        }}
        transition={{
          duration: config.duration,
          ease: "easeInOut",
        }}
      >
        {/* Inner Highlight - 3D Effect */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '50%',
            height: '50%',
            top: '10%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />
        
        {/* Core Glow */}
        <motion.div
          className="absolute inset-1/4 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <AnimatePresence>
        {isActive && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: config.gradient[particle.id % 3],
              boxShadow: `0 0 10px ${config.gradient[particle.id % 3]}`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0,
              scale: 0,
            }}
            animate={{ 
              x: Math.cos(particle.angle) * (sizeConfig.sphere * 0.5),
              y: Math.sin(particle.angle) * (sizeConfig.sphere * 0.5),
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Breath Ripples */}
      <AnimatePresence>
        {isActive && (phase === 'inhale' || phase === 'exhale') && (
          <motion.div
            className="absolute rounded-full border-2"
            style={{ 
              borderColor: config.gradient[0],
              width: sizeConfig.sphere * 0.7,
              height: sizeConfig.sphere * 0.7,
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ 
              scale: phase === 'inhale' ? 2 : 0.5, 
              opacity: 0 
            }}
            transition={{ 
              duration: config.duration, 
              ease: "easeOut",
              repeat: Infinity,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingSphere3D;
