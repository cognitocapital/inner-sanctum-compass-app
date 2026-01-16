import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useOverallProgress } from "@/hooks/use-module-progress";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { 
  TrendingUp, Calendar, Clock, Zap, Brain, Heart, 
  Activity, Target, Award, Flame
} from "lucide-react";
import { format, subDays, parseISO } from "date-fns";

interface CheckinData {
  check_date: string;
  mood: number | null;
  energy_level: number | null;
  sleep_quality: number | null;
}

const COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#22c55e', '#f43f5e'];

export const InsightsDashboard = () => {
  const { user } = useAuth();
  const { progress } = useUserProgress();
  const { stats } = useOverallProgress();
  const [checkinData, setCheckinData] = useState<CheckinData[]>([]);
  const [moduleBreakdown, setModuleBreakdown] = useState<{name: string; value: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch last 14 days of check-ins
        const fourteenDaysAgo = subDays(new Date(), 14).toISOString().split('T')[0];
        
        const { data: checkins } = await supabase
          .from("daily_checkins")
          .select("check_date, mood, energy_level, sleep_quality")
          .eq("user_id", user.id)
          .gte("check_date", fourteenDaysAgo)
          .order("check_date", { ascending: true });

        if (checkins) {
          setCheckinData(checkins);
        }

        // Fetch module breakdown
        const { data: sessions } = await supabase
          .from("session_logs")
          .select("module_type, duration_seconds")
          .eq("user_id", user.id);

        if (sessions) {
          const breakdown: Record<string, number> = {};
          sessions.forEach(s => {
            breakdown[s.module_type] = (breakdown[s.module_type] || 0) + (s.duration_seconds || 0);
          });
          
          const pieData = Object.entries(breakdown).map(([name, seconds]) => ({
            name: name.replace("_", " "),
            value: Math.round(seconds / 60),
          }));
          setModuleBreakdown(pieData);
        }

      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Format check-in data for chart
  const chartData = checkinData.map(d => ({
    date: format(parseISO(d.check_date), "MMM d"),
    mood: d.mood,
    energy: d.energy_level,
    sleep: d.sleep_quality,
  }));

  // Calculate trends
  const calculateTrend = (data: CheckinData[], field: keyof Pick<CheckinData, 'mood' | 'energy_level' | 'sleep_quality'>) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7);
    const older = data.slice(0, 7);
    
    const recentAvg = recent.reduce((sum, d) => sum + (d[field] || 0), 0) / recent.length;
    const olderAvg = older.length > 0 
      ? older.reduce((sum, d) => sum + (d[field] || 0), 0) / older.length
      : recentAvg;
    
    return Math.round(((recentAvg - olderAvg) / Math.max(olderAvg, 1)) * 100);
  };

  const moodTrend = calculateTrend(checkinData, 'mood');
  const energyTrend = calculateTrend(checkinData, 'energy_level');
  const sleepTrend = calculateTrend(checkinData, 'sleep_quality');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Recovery Insights
        </h2>
        <p className="text-white/60 mt-1">
          Track your progress and understand your recovery patterns
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{progress?.current_streak || 0}</div>
                <div className="text-xs text-white/50">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalXp}</div>
                <div className="text-xs text-white/50">Total XP</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalMinutes}</div>
                <div className="text-xs text-white/50">Total Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
                <div className="text-xs text-white/50">Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span className="text-white/70">Mood</span>
              </div>
              <Badge className={moodTrend >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                {moodTrend >= 0 ? "+" : ""}{moodTrend}%
              </Badge>
            </div>
            <p className="text-xs text-white/50 mt-2">vs previous week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white/70">Energy</span>
              </div>
              <Badge className={energyTrend >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                {energyTrend >= 0 ? "+" : ""}{energyTrend}%
              </Badge>
            </div>
            <p className="text-xs text-white/50 mt-2">vs previous week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <span className="text-white/70">Sleep</span>
              </div>
              <Badge className={sleepTrend >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                {sleepTrend >= 0 ? "+" : ""}{sleepTrend}%
              </Badge>
            </div>
            <p className="text-xs text-white/50 mt-2">vs previous week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="trends" className="data-[state=active]:bg-white/10">
            Mood Trends
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-white/10">
            Module Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">14-Day Mood & Energy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} />
                    <YAxis domain={[0, 5]} stroke="#ffffff50" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="mood" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} name="Mood" />
                    <Line type="monotone" dataKey="energy" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} name="Energy" />
                    <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Sleep" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/50">
                  Complete daily check-ins to see your trends
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Time Spent by Module</CardTitle>
            </CardHeader>
            <CardContent>
              {moduleBreakdown.length > 0 ? (
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width="50%" height={250}>
                    <PieChart>
                      <Pie
                        data={moduleBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {moduleBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        formatter={(value: number) => [`${value} min`, 'Time']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {moduleBreakdown.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-white/70 capitalize">{item.name}</span>
                        <span className="text-white/50 text-sm">({item.value} min)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-white/50">
                  Complete sessions to see your module breakdown
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
