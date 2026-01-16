// Phoenix Protocol Animation Library
// Reusable Framer Motion animation configurations

import { Variants, Transition } from "framer-motion";

// =============================================================================
// TRANSITIONS
// =============================================================================

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const smoothTransition: Transition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const dramaticTransition: Transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
};

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
};

// =============================================================================
// PHOENIX SPECIFIC ANIMATIONS
// =============================================================================

export const phoenixRise: Variants = {
  initial: { 
    opacity: 0, 
    y: 100, 
    scale: 0.8,
    filter: "blur(10px)"
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  },
};

export const emberFloat: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    y: [-10, 10, -10],
    x: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const pulseGlow: Variants = {
  initial: { opacity: 0.6, scale: 1 },
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const breatheScale: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// =============================================================================
// CARD ANIMATIONS
// =============================================================================

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: springTransition,
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: smoothTransition
  },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

// =============================================================================
// STAGGER ANIMATIONS
// =============================================================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: smoothTransition
  },
};

export const staggerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// =============================================================================
// CELEBRATION ANIMATIONS
// =============================================================================

export const celebrationBurst: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

export const streakFlame: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.1, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

export const confettiPiece: Variants = {
  initial: { y: 0, opacity: 1, rotate: 0 },
  animate: (i: number) => ({
    y: [0, -200, 400],
    x: [0, (i % 2 === 0 ? 1 : -1) * (Math.random() * 100)],
    opacity: [1, 1, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 2 + Math.random(),
      ease: "easeOut",
    },
  }),
};

// =============================================================================
// BUTTON ANIMATIONS
// =============================================================================

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

export const ctaPulse: Variants = {
  initial: { boxShadow: "0 0 0 0 rgba(251, 146, 60, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(251, 146, 60, 0.4)",
      "0 0 0 12px rgba(251, 146, 60, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
    },
  },
};

// =============================================================================
// MODAL / OVERLAY ANIMATIONS
// =============================================================================

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.2 }
  },
};

export const fullscreenVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 1.02,
    transition: { duration: 0.3 }
  },
};

// =============================================================================
// PROGRESS ANIMATIONS
// =============================================================================

export const progressFill: Variants = {
  initial: { scaleX: 0, originX: 0 },
  animate: (progress: number) => ({
    scaleX: progress,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const countUp = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

// =============================================================================
// TEXT ANIMATIONS
// =============================================================================

export const heroText: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export const subtitleText: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const createStaggerDelay = (index: number, baseDelay: number = 0.1) => ({
  delay: index * baseDelay,
});

export const getRandomEmberAnimation = (index: number) => ({
  y: [0, -20 - Math.random() * 30, 0],
  x: [0, (index % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20), 0],
  opacity: [0.3, 0.8, 0.3],
  scale: [0.8, 1.2, 0.8],
  transition: {
    duration: 2 + Math.random() * 2,
    repeat: Infinity,
    ease: "easeInOut",
    delay: Math.random() * 2,
  },
});
