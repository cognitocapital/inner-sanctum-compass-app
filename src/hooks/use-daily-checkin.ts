import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DailyCheckinRow = Database["public"]["Tables"]["daily_checkins"]["Row"];

interface UseDailyCheckinReturn {
  todaysCheckin: DailyCheckinRow | null;
  hasCheckedInToday: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export const useDailyCheckin = (): UseDailyCheckinReturn => {
  const { user, isGuest } = useAuth();
  const [todaysCheckin, setTodaysCheckin] = useState<DailyCheckinRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodaysCheckin = async () => {
    if (!user || isGuest) {
      setTodaysCheckin(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("check_date", today)
        .maybeSingle();

      if (error) throw error;
      setTodaysCheckin(data);
    } catch (err) {
      console.error("Error fetching check-in:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysCheckin();
  }, [user, isGuest]);

  return {
    todaysCheckin,
    hasCheckedInToday: !!todaysCheckin,
    isLoading,
    refetch: fetchTodaysCheckin,
  };
};
