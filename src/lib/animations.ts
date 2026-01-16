// World-class animation library for Phoenix Protocol
// Premium micro-interactions and celebration animations

export const animations = {
  // Core phoenix animations
  phoenixRise: {
    initial: { opacity: 0, y: 100, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1 
      }
    },
    exit: { opacity: 0, y: -50, scale: 0.9 }
  },

  // Ember glow pulse for buttons
  emberPulse: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(249, 115, 22, 0)',
        '0 0 0 8px rgba(249, 115, 22, 0.3)',
        '0 0 0 16px rgba(249, 115, 22, 0)',
      ],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  },

  // Fade slide for page transitions
  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  },

  // Scale with spring for interactive elements
  springScale: {
    whileHover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
    whileTap: { scale: 0.95 }
  },

  // Staggered children for lists
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  },

  // Breathing animation for calm moments
  breathe: {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.9, 1, 0.9],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    }
  },

  // Cinematic fade for full-screen transitions
  cinematicFade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.8 }
    }
  },

  // Floating ember particle
  floatEmber: {
    animate: (i: number) => ({
      y: [0, -20, 0],
      x: [0, Math.sin(i) * 10, 0],
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.2
      }
    })
  },

  // Card entrance with perspective
  cardEntrance: {
    initial: { opacity: 0, y: 40, rotateX: 10 },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },

  // Glow pulse for active elements
  glowPulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
    }
  },

  // Celebration burst
  celebrationBurst: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.5, 1],
      opacity: [0, 1, 1],
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }
};

// Haptic feedback utility
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = { light: [10], medium: [20], heavy: [30, 10, 30] };
    navigator.vibrate(patterns[type]);
  }
};

// Random ember position generator
export const randomEmberPosition = () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 5
});
