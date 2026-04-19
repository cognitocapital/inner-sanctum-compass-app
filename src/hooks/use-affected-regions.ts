import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AffectedRegionRow {
  region_id: string;
  severity: string | null;
  source: string | null;
}

/**
 * Loads the current user's affected regions (self-reported + AI-suggested)
 * and refreshes when the underlying table changes via Supabase Realtime.
 */
export const useAffectedRegions = () => {
  const { user } = useAuth();
  const [regions, setRegions] = useState<AffectedRegionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRegions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("user_affected_regions")
        .select("region_id, severity, source")
        .eq("user_id", user.id);
      if (cancelled) return;
      if (!error && data) setRegions(data as AffectedRegionRow[]);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel(`affected-regions-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_affected_regions",
          filter: `user_id=eq.${user.id}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { regions, loading };
};
