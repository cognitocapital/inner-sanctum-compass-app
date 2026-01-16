import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SimpleCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MOOD_PHOENIXES = [
  { level: 1, emoji: '🪹', label: 'Empty nest' },
  { level: 2, emoji: '🥚', label: 'Dormant' },
  { level: 3, emoji: '🐣', label: 'Stirring' },
  { level: 4, emoji: '🔥', label: 'Burning' },
  { level: 5, emoji: '🦅', label: 'Soaring' },
];

export const SimpleCheckIn = ({ isOpen, onClose, onComplete }: SimpleCheckInProps) => {
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [practiced, setPracticed] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (mood === null || practiced === null || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('daily_checkins')
        .insert({
          user_id: user.id,
          mood,
          energy_level: mood, // Using mood as energy for simplicity
        });

      if (error) throw error;

      toast.success('Check-in complete', {
        description: practiced ? 'Your flame burns bright!' : 'Tomorrow brings new opportunities.'
      });
      onComplete();
    } catch (error: any) {
      toast.error('Failed to save check-in', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = mood !== null && practiced !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">How are you today?</h2>
                <p className="text-white/60 text-sm">A moment of reflection</p>
              </div>

              {/* Mood Selection */}
              <div className="mb-8">
                <p className="text-sm text-white/60 mb-4 text-center">Where is your flame?</p>
                <div className="flex justify-center gap-3">
                  {MOOD_PHOENIXES.map((phoenix) => (
                    <button
                      key={phoenix.level}
                      onClick={() => setMood(phoenix.level)}
                      className={`group relative p-3 rounded-xl transition-all duration-200 ${
                        mood === phoenix.level
                          ? 'bg-orange-500/20 border-2 border-orange-500 scale-110'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      <span className="text-2xl">{phoenix.emoji}</span>
                      
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {phoenix.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Practice Question */}
              <div className="mb-8">
                <p className="text-sm text-white/60 mb-4 text-center">Did you practice today?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setPracticed(true)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                      practiced === true
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-300'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => setPracticed(false)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                      practiced === false
                        ? 'bg-white/10 border-2 border-white/30 text-white'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Not yet
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};