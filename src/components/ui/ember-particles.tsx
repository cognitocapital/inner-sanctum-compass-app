import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: "orange" | "red" | "yellow";
}

interface EmberParticlesProps {
  count?: number;
  className?: string;
  burst?: boolean;
  origin?: { x: number; y: number };
}

const COLORS = {
  orange: "bg-orange-500",
  red: "bg-red-500", 
  yellow: "bg-yellow-400",
};

const GLOW_COLORS = {
  orange: "shadow-orange-500/50",
  red: "shadow-red-500/50",
  yellow: "shadow-yellow-400/50",
};

export const EmberParticles = ({ 
  count = 12, 
  className = "",
  burst = false,
  origin
}: EmberParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    const colors: ("orange" | "red" | "yellow")[] = ["orange", "red", "yellow"];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: origin?.x ?? Math.random() * 100,
        y: origin?.y ?? Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  }, [count, origin]);

  if (burst) {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${COLORS[particle.color]} shadow-lg ${GLOW_COLORS[particle.color]}`}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${origin?.x ?? 50}%`,
              top: `${origin?.y ?? 50}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200 - 100,
              scale: [0, 1.5, 0],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              ease: "easeOut",
              delay: particle.delay * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${COLORS[particle.color]} shadow-lg ${GLOW_COLORS[particle.color]}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 50, 0],
            x: [0, (particle.id % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20), 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

// Burst effect for celebrations
export const EmberBurst = ({ 
  trigger, 
  onComplete 
}: { 
  trigger: boolean; 
  onComplete?: () => void;
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <EmberParticles count={30} burst origin={{ x: 50, y: 50 }} />
    </motion.div>
  );
};
