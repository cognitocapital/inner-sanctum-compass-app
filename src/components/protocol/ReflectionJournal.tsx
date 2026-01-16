import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Feather, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { WeekData } from '@/data/protocolWeeks';

interface ReflectionJournalProps {
  weekData: WeekData;
  isCompleted: boolean;
  existingReflection?: string | null;
  onComplete: (text: string) => void;
}

export const ReflectionJournal = ({ 
  weekData, 
  isCompleted, 
  existingReflection,
  onComplete 
}: ReflectionJournalProps) => {
  const [text, setText] = useState(existingReflection || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    const key = `reflection-draft-week-${weekData.week}`;
    const saved = localStorage.getItem(key);
    if (saved && !existingReflection) {
      setText(saved);
    }
  }, [weekData.week, existingReflection]);

  useEffect(() => {
    if (text && !isCompleted) {
      const key = `reflection-draft-week-${weekData.week}`;
      localStorage.setItem(key, text);
    }
  }, [text, weekData.week, isCompleted]);

  const handleComplete = async () => {
    if (!text.trim()) return;
    
    setIsSaving(true);
    try {
      await onComplete(text);
      setLastSaved(new Date());
      // Clear draft after successful save
      localStorage.removeItem(`reflection-draft-week-${weekData.week}`);
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 backdrop-blur-xl">
        {/* Decorative ember */}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                <Feather className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reflect</h3>
                <p className="text-sm text-white/60">Week {weekData.week}</p>
              </div>
            </div>
            {isCompleted && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
          
          {/* Reflection Prompt */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <p className="text-sm text-orange-300/80 mb-1">This week's reflection:</p>
            <p className="text-white italic">"{weekData.reflection}"</p>
          </div>
          
          {/* Journal Input */}
          <div className="relative mb-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="The flames listen... Let your thoughts flow freely."
              className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none focus:border-orange-500/50 focus:ring-orange-500/20"
              disabled={isCompleted}
            />
            
            {/* Word count */}
            <div className="absolute bottom-3 right-3 text-xs text-white/40">
              {wordCount} words
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/40">
              {lastSaved && `Last saved: ${lastSaved.toLocaleTimeString()}`}
            </div>
            
            {!isCompleted && (
              <Button
                onClick={handleComplete}
                disabled={!text.trim() || isSaving}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Reflection
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};