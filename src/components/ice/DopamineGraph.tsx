import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { TrendingUp, Zap, Brain, Heart } from "lucide-react";

interface DopamineGraphProps {
  moodHistory: number[];
  sessionDurations: number[];
  className?: string;
}

export const DopamineGraph = ({ moodHistory, sessionDurations, className }: DopamineGraphProps) => {
  // Combine data for visualization
  const data = moodHistory.map((mood, i) => ({
    session: i + 1,
    mood,
    duration: sessionDurations[i] || 30,
    dopamineEstimate: Math.min(100, mood * 15 + (sessionDurations[i] || 30) * 0.3),
  }));

  // Calculate trends
  const avgMood = moodHistory.length > 0 
    ? moodHistory.reduce((a, b) => a + b, 0) / moodHistory.length 
    : 0;
  const recentMood = moodHistory.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, moodHistory.length) || 0;
  const moodTrend = recentMood - avgMood;

  const totalDuration = sessionDurations.reduce((a, b) => a + b, 0);
  const avgDuration = sessionDurations.length > 0 
    ? totalDuration / sessionDurations.length 
    : 0;

  return (
    <motion.div
      className={cn("space-y-4", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-300">Dopamine Response</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.length > 0 ? Math.round(data[data.length - 1]?.dopamineEstimate || 0) : 0}%
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className={cn(
              "w-3 h-3",
              moodTrend >= 0 ? "text-green-400" : "text-red-400"
            )} />
            <span className={cn(
              "text-xs",
              moodTrend >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {moodTrend >= 0 ? "+" : ""}{moodTrend.toFixed(1)} trend
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300">Adaptation Level</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.min(100, Math.round(avgDuration * 0.8 + avgMood * 10))}%
          </div>
          <div className="text-xs text-purple-300 mt-1">
            Avg: {Math.round(avgDuration)}s sessions
          </div>
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dopamineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(180 80% 50%)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="hsl(180 80% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="session" 
                stroke="hsl(200 30% 50%)" 
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(200 30% 50%)" 
                fontSize={10}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(220 30% 15%)',
                  border: '1px solid hsl(200 50% 30%)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(label) => `Session ${label}`}
              />
              <Area
                type="monotone"
                dataKey="dopamineEstimate"
                stroke="hsl(180 80% 50%)"
                strokeWidth={2}
                fill="url(#dopamineGradient)"
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="hsl(280 70% 60%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(280 70% 60%)', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
          Complete sessions to see your dopamine response trends
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-cyan-300">Dopamine Est.</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-400" />
          <span className="text-purple-300">Mood Score</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DopamineGraph;
