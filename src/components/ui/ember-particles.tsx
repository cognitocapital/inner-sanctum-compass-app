import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface EmberParticlesProps {
  count?: number;
  className?: string;
}

export const EmberParticles = ({ count = 20, className = '' }: EmberParticlesProps) => {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    const generated: Ember[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5
      });
    }
    setEmbers(generated);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            top: `${ember.y}%`,
            width: ember.size,
            height: ember.size,
            background: `radial-gradient(circle, rgba(249, 115, 22, 0.9) 0%, rgba(234, 88, 12, 0.6) 50%, transparent 100%)`,
            boxShadow: `0 0 ${ember.size * 2}px rgba(249, 115, 22, 0.5)`
          }}
          animate={{
            y: [0, -60 - Math.random() * 40, -120],
            x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            delay: ember.delay,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
};

// Burst animation for celebrations
export const EmberBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(249, 115, 22, 1) 0%, rgba(234, 88, 12, 0.8) 100%)`,
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.8)'
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 500,
            y: (Math.random() - 0.5) * 500,
            opacity: 0,
            scale: 0
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            ease: 'easeOut',
            delay: Math.random() * 0.2
          }}
        />
      ))}
    </div>
  );
};
