import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "./use-user-progress";
import { toast } from "sonner";

interface SessionData {
  moduleType: "breathing" | "cold_exposure" | "mind" | "gratitude" | "incog" | "clinical";
  exerciseId?: string;
  durationSeconds: number;
  xpEarned?: number;
  moodBefore?: number;
  moodAfter?: number;
  metrics?: Record<string, any>;
}

interface UseSessionLoggerReturn {
  logSession: (data: SessionData) => Promise<void>;
}

export const useSessionLogger = (): UseSessionLoggerReturn => {
  const { user, isGuest } = useAuth();
  const { addXp, incrementStreak } = useUserProgress();

  const logSession = async (data: SessionData) => {
    if (!user || isGuest) {
      if (data.xpEarned) {
        toast.success(`Session complete!`, {
          description: "Sign in to save your progress and earn XP."
        });
      }
      return;
    }

    try {
      const { error } = await supabase.from("session_logs").insert({
        user_id: user.id,
        module_type: data.moduleType,
        exercise_id: data.exerciseId || null,
        duration_seconds: data.durationSeconds,
        xp_earned: data.xpEarned || 0,
        mood_before: data.moodBefore || null,
        mood_after: data.moodAfter || null,
        metrics: data.metrics || {},
      });

      if (error) throw error;

      if (data.xpEarned && data.xpEarned > 0) {
        await addXp(data.xpEarned);
      }

      await incrementStreak();

      const minutes = Math.floor(data.durationSeconds / 60);
      toast.success("Session logged! 🔥", {
        description: `${minutes} min session • +${data.xpEarned || 0} XP earned`
      });

    } catch (err) {
      console.error("Error logging session:", err);
    }
  };

  return { logSession };
};

export const calculateXP = (
  moduleType: string,
  durationSeconds: number,
  metrics?: Record<string, any>
): number => {
  const baseXP = Math.floor(durationSeconds / 60) * 10;
  
  const moduleMultipliers: Record<string, number> = {
    breathing: 1.0,
    cold_exposure: 1.5,
    mind: 1.2,
    gratitude: 1.0,
    incog: 1.3,
    clinical: 2.0,
  };

  const multiplier = moduleMultipliers[moduleType] || 1.0;
  let xp = Math.floor(baseXP * multiplier);

  if (metrics?.moodImproved) xp += 10;
  if (metrics?.coherenceScore && metrics.coherenceScore > 70) xp += 15;

  return Math.max(xp, 5);
};
