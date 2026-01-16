import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getWeekData, getTotalWeeks, type WeekData } from '@/data/protocolWeeks';
import { toast } from 'sonner';

interface WeekProgress {
  week_number: number;
  chapter_completed: boolean;
  practice_completed: boolean;
  reflection_completed: boolean;
  reflection_text: string | null;
  completed_at: string | null;
}

interface UseProtocolProgressReturn {
  currentWeek: number;
  weekData: WeekData | undefined;
  weekProgress: WeekProgress | null;
  allProgress: WeekProgress[];
  isLoading: boolean;
  protocolStartedAt: string | null;
  totalWeeks: number;
  completeChapter: () => Promise<void>;
  completePractice: () => Promise<void>;
  completeReflection: (text: string) => Promise<void>;
  isWeekComplete: boolean;
  canAdvance: boolean;
  advanceWeek: () => Promise<void>;
}

export const useProtocolProgress = (): UseProtocolProgressReturn => {
  const { user, isGuest } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [protocolStartedAt, setProtocolStartedAt] = useState<string | null>(null);
  const [weekProgress, setWeekProgress] = useState<WeekProgress | null>(null);
  const [allProgress, setAllProgress] = useState<WeekProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalWeeks = getTotalWeeks();
  const weekData = getWeekData(currentWeek);

  // Fetch user's current week and progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || isGuest) {
        setIsLoading(false);
        return;
      }

      try {
        // Get profile for current week
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_week, protocol_started_at')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCurrentWeek(profile.current_week || 1);
          setProtocolStartedAt(profile.protocol_started_at);
        }

        // Get all week progress
        const { data: progress } = await supabase
          .from('week_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('week_number', { ascending: true });

        if (progress) {
          setAllProgress(progress as WeekProgress[]);
          const currentProgress = progress.find(p => p.week_number === (profile?.current_week || 1));
          setWeekProgress(currentProgress as WeekProgress || null);
        }
      } catch (error) {
        console.error('Error fetching protocol progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user, isGuest]);

  const ensureWeekProgressExists = async () => {
    if (!user) return null;

    // Check if progress exists for current week
    const { data: existing } = await supabase
      .from('week_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_number', currentWeek)
      .single();

    if (existing) return existing;

    // Create new progress entry
    const { data: newProgress, error } = await supabase
      .from('week_progress')
      .insert({
        user_id: user.id,
        week_number: currentWeek,
        chapter_completed: false,
        practice_completed: false,
        reflection_completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating week progress:', error);
      return null;
    }

    return newProgress;
  };

  const completeChapter = async () => {
    if (!user || isGuest) return;

    await ensureWeekProgressExists();

    const { error } = await supabase
      .from('week_progress')
      .update({ chapter_completed: true })
      .eq('user_id', user.id)
      .eq('week_number', currentWeek);

    if (error) {
      toast.error('Failed to update progress');
      return;
    }

    setWeekProgress(prev => prev ? { ...prev, chapter_completed: true } : null);
    toast.success('Chapter completed!', { description: 'The story continues...' });
  };

  const completePractice = async () => {
    if (!user || isGuest) return;

    await ensureWeekProgressExists();

    const { error } = await supabase
      .from('week_progress')
      .update({ practice_completed: true })
      .eq('user_id', user.id)
      .eq('week_number', currentWeek);

    if (error) {
      toast.error('Failed to update progress');
      return;
    }

    setWeekProgress(prev => prev ? { ...prev, practice_completed: true } : null);
    toast.success('Practice completed!', { description: 'Your flame grows stronger.' });
  };

  const completeReflection = async (text: string) => {
    if (!user || isGuest) return;

    await ensureWeekProgressExists();

    const { error } = await supabase
      .from('week_progress')
      .update({ 
        reflection_completed: true,
        reflection_text: text,
        completed_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('week_number', currentWeek);

    if (error) {
      toast.error('Failed to save reflection');
      return;
    }

    setWeekProgress(prev => prev ? { 
      ...prev, 
      reflection_completed: true, 
      reflection_text: text,
      completed_at: new Date().toISOString()
    } : null);
    
    toast.success('Reflection saved!', { description: 'Your journey is recorded.' });
  };

  const isWeekComplete = Boolean(
    weekProgress?.chapter_completed && 
    weekProgress?.practice_completed && 
    weekProgress?.reflection_completed
  );

  const canAdvance = isWeekComplete && currentWeek < totalWeeks;

  const advanceWeek = async () => {
    if (!user || isGuest || !canAdvance) return;

    const newWeek = currentWeek + 1;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        current_week: newWeek,
        protocol_started_at: protocolStartedAt || new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to advance week');
      return;
    }

    setCurrentWeek(newWeek);
    setWeekProgress(null);
    toast.success(`Week ${newWeek} unlocked!`, { 
      description: `Welcome to "${getWeekData(newWeek)?.chapter}"` 
    });
  };

  return {
    currentWeek,
    weekData,
    weekProgress,
    allProgress,
    isLoading,
    protocolStartedAt,
    totalWeeks,
    completeChapter,
    completePractice,
    completeReflection,
    isWeekComplete,
    canAdvance,
    advanceWeek
  };
};