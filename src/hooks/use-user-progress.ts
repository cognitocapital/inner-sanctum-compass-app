import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserProgressRow = Database["public"]["Tables"]["user_progress"]["Row"];

interface UseUserProgressReturn {
  progress: UserProgressRow | null;
  isLoading: boolean;
  error: Error | null;
  addXp: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUserProgress = (): UseUserProgressReturn => {
  const { user, isGuest } = useAuth();
  const [progress, setProgress] = useState<UserProgressRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = async () => {
    if (!user || isGuest) {
      setProgress(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          setProgress(null);
        } else {
          throw fetchError;
        }
      } else {
        setProgress(data);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addXp = async (amount: number) => {
    if (!user || isGuest || !progress) return;

    const newXp = (progress.total_xp || 0) + amount;
    const xpForNextLevel = (progress.current_level || 1) * 100;
    let newLevel = progress.current_level || 1;
    let remainingXp = newXp;

    // Level up if needed
    while (remainingXp >= xpForNextLevel) {
      remainingXp -= xpForNextLevel;
      newLevel += 1;
    }

    const { error } = await supabase
      .from("user_progress")
      .update({
        total_xp: newXp,
        current_level: newLevel,
      })
      .eq("user_id", user.id);

    if (!error) await fetchProgress();
  };

  const incrementStreak = async () => {
    if (!user || isGuest || !progress) return;

    const today = new Date().toISOString().split("T")[0];
    const lastActive = progress.last_active_date;
    
    let newStreak = progress.current_streak || 0;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const { error } = await supabase
        .from("user_progress")
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, progress.longest_streak || 0),
          last_active_date: today,
        })
        .eq("user_id", user.id);

      if (!error) await fetchProgress();
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user, isGuest]);

  return { progress, isLoading, error, addXp, incrementStreak, refetch: fetchProgress };
};
