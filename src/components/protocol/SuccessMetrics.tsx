import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, TrendingUp, Calendar, Target } from "lucide-react";

interface MetricsData {
  completionRate: number;
  avgSessionsPerWeek: number;
  sevenDayRetention: boolean;
  totalSessions: number;
}

export const SuccessMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Dev toggle: triple-tap bottom-right corner to show
    let tapCount = 0;
    let tapTimer: ReturnType<typeof setTimeout>;
    const handler = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth - 60 && e.clientY > window.innerHeight - 60) {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tapCount = 0; }, 600);
        if (tapCount >= 3) {
          setIsVisible(v => !v);
          tapCount = 0;
        }
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!user || !isVisible) return;
    const fetchMetrics = async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data: sessions } = await supabase
        .from("session_logs")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo);

      const { data: allSessions } = await supabase
        .from("session_logs")
        .select("created_at")
        .eq("user_id", user.id);

      const totalSessions = allSessions?.length || 0;
      const recentSessions = sessions?.length || 0;
      const uniqueDays = new Set(sessions?.map(s => s.created_at?.split("T")[0])).size;

      setMetrics({
        completionRate: totalSessions > 0 ? Math.min(100, Math.round((recentSessions / 7) * 100)) : 0,
        avgSessionsPerWeek: recentSessions,
        sevenDayRetention: uniqueDays >= 2,
        totalSessions,
      });
    };
    fetchMetrics();
  }, [user, isVisible]);

  if (!isVisible || !metrics) return null;

  const items = [
    { label: "Day-1 Completion", value: `${metrics.completionRate}%`, target: "70%", icon: Target, color: metrics.completionRate >= 70 ? "text-green-400" : "text-orange-400" },
    { label: "7-Day Retention", value: metrics.sevenDayRetention ? "Yes" : "No", target: "Active", icon: Calendar, color: metrics.sevenDayRetention ? "text-green-400" : "text-red-400" },
    { label: "Sessions/Week", value: String(metrics.avgSessionsPerWeek), target: "5+", icon: Activity, color: metrics.avgSessionsPerWeek >= 5 ? "text-green-400" : "text-yellow-400" },
    { label: "Total Sessions", value: String(metrics.totalSessions), target: "—", icon: TrendingUp, color: "text-white/60" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-4 right-4 z-40 max-w-sm mx-auto"
    >
      <Card className="bg-gray-900/95 border-yellow-500/20 backdrop-blur-xl">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-xs uppercase tracking-widest text-yellow-400/70 flex items-center gap-2">
            📊 Dev Metrics (hidden)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 grid grid-cols-2 gap-3">
          {items.map(item => (
            <div key={item.label} className="space-y-0.5">
              <div className="flex items-center gap-1">
                <item.icon className="w-3 h-3 text-white/30" />
                <span className="text-[10px] text-white/30">{item.label}</span>
              </div>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[9px] text-white/20">Target: {item.target}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
