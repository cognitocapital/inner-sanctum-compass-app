import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  module: string;
  exercise: string;
  duration: number;
  reason: string;
  message: string;
  insight: string;
}

interface UsePhoenixGuideReturn {
  recommendation: Recommendation | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const FALLBACK_RECOMMENDATION: Recommendation = {
  module: "breathing",
  exercise: "4-7-8 Breathing",
  duration: 10,
  reason: "Breathing exercises are a great foundation for any recovery day.",
  message: "Your inner flame still burns bright. Take a moment to breathe and center yourself today.",
  insight: "Consistent practice builds stronger neural pathways over time.",
};

export const usePhoenixGuide = (): UsePhoenixGuideReturn => {
  const { user, session, isGuest } = useAuth();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    if (!user || !session || isGuest) {
      setRecommendation(FALLBACK_RECOMMENDATION);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("phoenix-guide", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (fnError) throw fnError;

      if (data.error && data.fallback) {
        // AI had an issue but provided fallback
        setRecommendation(data.fallback);
        setError(data.error);
      } else {
        setRecommendation(data);
      }
    } catch (err: any) {
      console.error("Error fetching recommendation:", err);
      setError(err.message || "Failed to get recommendation");
      setRecommendation(FALLBACK_RECOMMENDATION);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && session && !isGuest) {
      fetchRecommendation();
    } else {
      setRecommendation(FALLBACK_RECOMMENDATION);
    }
  }, [user, session, isGuest]);

  return { recommendation, isLoading, error, refresh: fetchRecommendation };
};
