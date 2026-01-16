import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CelebrationProps {
  type: 'week-complete' | 'streak' | 'practice' | 'reflection';
  message: string;
  subMessage?: string;
  onComplete?: () => void;
  show: boolean;
}

export const Celebration = ({ type, message, subMessage, onComplete, show }: CelebrationProps) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const icons = {
    'week-complete': Flame,
    'streak': Flame,
    'practice': Sparkles,
    'reflection': Star
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ember particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: 4 + Math.random() * 8,
                  height: 4 + Math.random() * 8,
                  background: `radial-gradient(circle, rgba(249, 115, 22, 0.9) 0%, transparent 70%)`
                }}
                initial={{ y: '100vh', opacity: 0 }}
                animate={{ 
                  y: '-20vh', 
                  opacity: [0, 1, 0],
                  x: (Math.random() - 0.5) * 100
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>

          {/* Main celebration content */}
          <motion.div
            className="relative text-center z-10 px-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
          >
            {/* Glowing icon */}
            <motion.div
              className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(249, 115, 22, 0)',
                  '0 0 40px 20px rgba(249, 115, 22, 0.3)',
                  '0 0 0 0 rgba(249, 115, 22, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-12 h-12 text-white" />
            </motion.div>

            {/* Message */}
            <motion.h2
              className="text-4xl md:text-5xl font-serif font-bold text-white mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.h2>

            {subMessage && (
              <motion.p
                className="text-xl text-white/70"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {subMessage}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mini celebration for smaller achievements
export const MiniCelebration = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50"
      initial={{ x: 100, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
        <span className="font-medium">Great job!</span>
      </div>
    </motion.div>
  );
};
