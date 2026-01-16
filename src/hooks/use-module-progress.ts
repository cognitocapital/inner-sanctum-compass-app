import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ModuleProgress {
  totalSessions: number;
  totalMinutes: number;
  totalXp: number;
  lastSession: string | null;
  averageDuration: number;
}

interface UseModuleProgressReturn {
  progress: ModuleProgress;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const DEFAULT_PROGRESS: ModuleProgress = {
  totalSessions: 0,
  totalMinutes: 0,
  totalXp: 0,
  lastSession: null,
  averageDuration: 0,
};

export const useModuleProgress = (moduleType: string): UseModuleProgressReturn => {
  const { user, isGuest } = useAuth();
  const [progress, setProgress] = useState<ModuleProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user || isGuest) {
      setProgress(DEFAULT_PROGRESS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("session_logs")
        .select("duration_seconds, xp_earned, created_at")
        .eq("user_id", user.id)
        .eq("module_type", moduleType)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setProgress(DEFAULT_PROGRESS);
        return;
      }

      const totalSessions = data.length;
      const totalSeconds = data.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
      const totalXp = data.reduce((sum, s) => sum + (s.xp_earned || 0), 0);

      setProgress({
        totalSessions,
        totalMinutes: Math.floor(totalSeconds / 60),
        totalXp,
        lastSession: data[0]?.created_at || null,
        averageDuration: Math.floor(totalSeconds / totalSessions / 60),
      });

    } catch (err) {
      console.error("Error fetching module progress:", err);
      setProgress(DEFAULT_PROGRESS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user, isGuest, moduleType]);

  return { progress, isLoading, refetch: fetchProgress };
};

// Hook for overall stats across all modules
export const useOverallProgress = () => {
  const { user, isGuest } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    totalXp: 0,
    modulesUsed: 0,
    thisWeekSessions: 0,
    thisWeekMinutes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || isGuest) {
        setIsLoading(false);
        return;
      }

      try {
        // Get all sessions
        const { data: allSessions } = await supabase
          .from("session_logs")
          .select("module_type, duration_seconds, xp_earned, created_at")
          .eq("user_id", user.id);

        if (!allSessions) {
          setIsLoading(false);
          return;
        }

        // Calculate this week's sessions
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeekSessions = allSessions.filter(
          s => s.created_at && new Date(s.created_at) >= weekAgo
        );

        // Get unique modules
        const uniqueModules = new Set(allSessions.map(s => s.module_type));

        setStats({
          totalSessions: allSessions.length,
          totalMinutes: Math.floor(
            allSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
          ),
          totalXp: allSessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0),
          modulesUsed: uniqueModules.size,
          thisWeekSessions: thisWeekSessions.length,
          thisWeekMinutes: Math.floor(
            thisWeekSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
          ),
        });
      } catch (err) {
        console.error("Error fetching overall progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, isGuest]);

  return { stats, isLoading };
};
