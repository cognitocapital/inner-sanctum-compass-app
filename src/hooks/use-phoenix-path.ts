import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PHOENIX_QUESTS, PHASES, getQuestsForPhase, type QuestDefinition, type QuestPhase } from "@/data/phoenixQuests";

export interface UserQuestState {
  quest_key: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completed_at: string | null;
  metadata: Record<string, unknown>;
}

export interface PhoenixPathState {
  quests: UserQuestState[];
  currentPhase: QuestPhase;
  flameStrength: number;
  isLoading: boolean;
  totalXp: number;
  completedCount: number;
}

export const usePhoenixPath = () => {
  const { user, isGuest } = useAuth();
  const [state, setState] = useState<PhoenixPathState>({
    quests: [],
    currentPhase: 1,
    flameStrength: 0,
    isLoading: true,
    totalXp: 0,
    completedCount: 0,
  });

  const fetchState = useCallback(async () => {
    if (!user || isGuest) {
      // Guest mode: all phase 1 quests available, rest locked
      const guestQuests: UserQuestState[] = PHOENIX_QUESTS.map(q => ({
        quest_key: q.key,
        status: q.phase === 1 ? 'available' : 'locked',
        completed_at: null,
        metadata: {},
      }));
      setState({
        quests: guestQuests,
        currentPhase: 1,
        flameStrength: 0,
        isLoading: false,
        totalXp: 0,
        completedCount: 0,
      });
      return;
    }

    try {
      // Fetch user quest progress + profile in parallel
      const [questsRes, profileRes] = await Promise.all([
        supabase.from("phoenix_quests").select("*").eq("user_id", user.id),
        supabase.from("profiles").select("phoenix_phase, flame_strength").eq("id", user.id).single(),
      ]);

      const savedQuests = questsRes.data || [];
      const profile = profileRes.data;
      const currentPhase = (profile?.phoenix_phase || 1) as QuestPhase;
      const flameStrength = profile?.flame_strength || 0;

      // Build full quest state: merge saved with definitions
      const savedMap = new Map(savedQuests.map(q => [q.quest_key, q]));
      const completedCount = savedQuests.filter(q => q.status === 'completed').length;
      const totalXp = savedQuests
        .filter(q => q.status === 'completed')
        .reduce((sum, q) => sum + (q.xp_reward || 0), 0);

      const allQuests: UserQuestState[] = PHOENIX_QUESTS.map(def => {
        const saved = savedMap.get(def.key);
        if (saved) {
          return {
            quest_key: saved.quest_key,
            status: saved.status as UserQuestState['status'],
            completed_at: saved.completed_at,
            metadata: (saved.metadata as Record<string, unknown>) || {},
          };
        }
        // Default status based on phase
        return {
          quest_key: def.key,
          status: def.phase <= currentPhase ? 'available' : 'locked',
          completed_at: null,
          metadata: {},
        };
      });

      setState({
        quests: allQuests,
        currentPhase,
        flameStrength,
        isLoading: false,
        totalXp,
        completedCount,
      });
    } catch (err) {
      console.error("Error fetching phoenix path:", err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, isGuest]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const completeQuest = useCallback(async (questKey: string, metadata?: Record<string, unknown>) => {
    if (!user || isGuest) return;

    const def = PHOENIX_QUESTS.find(q => q.key === questKey);
    if (!def) return;

    const now = new Date().toISOString();

    // Upsert quest completion
    const { error } = await supabase.from("phoenix_quests").upsert(
      [{
        user_id: user.id,
        quest_key: questKey,
        quest_type: def.type,
        phase: def.phase,
        status: 'completed',
        xp_reward: def.xpReward,
        completed_at: now,
        metadata: (metadata || {}) as unknown as import('@/integrations/supabase/types').Json,
        book_chapter_ref: def.bookChapterRef || null,
        symptom_tags: def.symptomTags,
      }],
      { onConflict: 'user_id,quest_key' }
    );

    if (error) {
      console.error("Error completing quest:", error);
      return;
    }

    // Update flame strength
    const flameGain = Math.min(Math.ceil(def.xpReward / 10), 15);
    const newFlame = Math.min((state.flameStrength || 0) + flameGain, 100);

    // Check if phase should advance
    const currentPhaseQuests = getQuestsForPhase(state.currentPhase);
    const completedInPhase = state.quests.filter(
      q => currentPhaseQuests.some(cp => cp.key === q.quest_key) && q.status === 'completed'
    ).length + 1; // +1 for the one we just completed
    const threshold = Math.ceil(currentPhaseQuests.length * 0.6); // 60% to advance
    const shouldAdvance = completedInPhase >= threshold && state.currentPhase < 4 && newFlame >= 60;

    const newPhase = shouldAdvance ? ((state.currentPhase + 1) as QuestPhase) : state.currentPhase;

    await supabase.from("profiles").update({
      flame_strength: shouldAdvance ? 0 : newFlame, // reset flame on phase advance
      phoenix_phase: newPhase,
    }).eq("id", user.id);

    // Also update user_progress XP
    await supabase.from("user_progress").update({
      total_xp: (state.totalXp || 0) + def.xpReward,
    }).eq("user_id", user.id);

    await fetchState();
    return { advanced: shouldAdvance, newPhase, xpEarned: def.xpReward };
  }, [user, isGuest, state, fetchState]);

  const getQuestStatus = useCallback((questKey: string): UserQuestState['status'] => {
    const q = state.quests.find(q => q.quest_key === questKey);
    return q?.status || 'locked';
  }, [state.quests]);

  return {
    ...state,
    completeQuest,
    getQuestStatus,
    refetch: fetchState,
    phases: PHASES,
  };
};
