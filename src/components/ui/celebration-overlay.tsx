import { motion, AnimatePresence } from "framer-motion";
import { fullscreenVariants } from "@/lib/animations";
import { EmberParticles } from "./ember-particles";
import { Flame, Star, Sparkles } from "lucide-react";
import { Button } from "./button";

interface CelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  type: "week" | "streak" | "milestone" | "protocol";
  title: string;
  subtitle?: string;
  stats?: { label: string; value: string | number }[];
  ctaText?: string;
  onCta?: () => void;
}

export const CelebrationOverlay = ({
  isOpen,
  onClose,
  type,
  title,
  subtitle,
  stats,
  ctaText = "Continue",
  onCta,
}: CelebrationOverlayProps) => {
  const icons = {
    week: Flame,
    streak: Flame,
    milestone: Star,
    protocol: Sparkles,
  };

  const Icon = icons[type];

  const gradients = {
    week: "from-green-600 via-teal-600 to-cyan-600",
    streak: "from-orange-600 via-red-600 to-orange-500",
    milestone: "from-purple-600 via-pink-600 to-rose-500",
    protocol: "from-amber-500 via-orange-500 to-red-500",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={fullscreenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          {/* Background particles */}
          <EmberParticles count={25} />

          {/* Radial glow */}
          <div className={`absolute inset-0 bg-gradient-radial ${gradients[type]} opacity-20 blur-3xl`} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center px-6 max-w-lg"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 200 }}
              className={`w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br ${gradients[type]} flex items-center justify-center shadow-2xl`}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-serif text-white mb-4"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-white/70 mb-8"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center gap-8 mb-10"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={onCta || onClose}
                size="lg"
                className={`bg-gradient-to-r ${gradients[type]} hover:opacity-90 text-white px-10 py-6 text-lg font-semibold shadow-2xl`}
              >
                {ctaText}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
