import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";
import { TrendingUp, TrendingDown, Activity, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  value: number;
  normative?: number;
}

interface NormativeTrendGraphProps {
  data: DataPoint[];
  title: string;
  metric: string;
  normativeValue: number;
  normativeLabel: string;
  domain?: [number, number];
  higherIsBetter?: boolean;
  nindsCategory?: string;
  className?: string;
}

export const NORMATIVE_BENCHMARKS = {
  cognitiveIndex: { value: 5.5, label: "TBI Avg Recovery (6mo)", range: [4.0, 7.0] },
  phq9: { value: 8, label: "TBI Depression Avg", range: [5, 15] },
  gad7: { value: 7, label: "TBI Anxiety Avg", range: [4, 12] },
  moca: { value: 24, label: "Mild TBI Avg", range: [20, 28] },
  attention: { value: 15, label: "TBI Attention Span (min)", range: [8, 25] },
  memory: { value: 4.5, label: "Digit Span Avg", range: [3, 6] },
  abs: { value: 10, label: "Post-Acute Agitation", range: [5, 18] }
};

export const NormativeTrendGraph = ({
  data, title, metric, normativeValue, normativeLabel,
  domain = [0, 10], higherIsBetter = true, nindsCategory, className
}: NormativeTrendGraphProps) => {
  const trend = useMemo(() => {
    if (data.length < 2) return null;
    const recent = data.slice(-3);
    const older = data.slice(-6, -3);
    if (recent.length === 0 || older.length === 0) return null;
    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length;
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    return { 
      direction: change > 0 ? 'up' : 'down', 
      percentage: Math.abs(change).toFixed(1),
      isPositive: higherIsBetter ? change > 0 : change < 0
    };
  }, [data, higherIsBetter]);

  const latestValue = data.length > 0 ? data[data.length - 1].value : null;
  const comparison = latestValue !== null 
    ? higherIsBetter 
      ? latestValue >= normativeValue ? 'above' : 'below'
      : latestValue <= normativeValue ? 'below' : 'above'
    : null;

  const chartData = data.map(d => ({ ...d, normative: normativeValue }));

  return (
    <div className={cn("rounded-2xl academy-glass-strong p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15">
            <Activity className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="font-semibold text-amber-200">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {nindsCategory && (
            <Badge className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs">
              NINDS: {nindsCategory}
            </Badge>
          )}
          {trend && (
            <Badge className={cn(
              "text-xs",
              trend.isPositive 
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                : "bg-red-500/15 text-red-400 border border-red-500/25"
            )}>
              {trend.direction === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {trend.percentage}%
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mb-4 ml-12">
        <span className="text-white/35">{metric}</span>
        {comparison && (
          <span className={cn(
            "text-xs",
            comparison === 'above' && higherIsBetter ? "text-emerald-400" : 
            comparison === 'below' && !higherIsBetter ? "text-emerald-400" : "text-amber-400"
          )}>
            {comparison === 'above' ? '↑' : '↓'} vs 2025 norm
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#ffffff40', fontSize: 10 }}
              axisLine={{ stroke: '#ffffff10' }}
            />
            <YAxis 
              domain={domain}
              tick={{ fill: '#ffffff40', fontSize: 10 }}
              axisLine={{ stroke: '#ffffff10' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px',
                color: '#fff'
              }}
              labelStyle={{ color: '#ffffff60' }}
            />
            <ReferenceLine 
              y={normativeValue} 
              stroke="#06b6d4" 
              strokeDasharray="5 5"
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="value"
              fill={`url(#gradient-${title})`}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: '#f59e0b', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-amber-500 rounded" />
          <span className="text-white/35">Your Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-cyan-500 rounded opacity-60" style={{ borderBottom: '1px dashed' }} />
          <span className="text-white/35">{normativeLabel}</span>
        </div>
      </div>

      {/* Quanta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
      >
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-400/50 mt-0.5 shrink-0" />
          <p className="text-white/25 text-xs italic">
            Ch3 "emotional rollercoaster" — your trends reveal patterns in the storm
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NormativeTrendGraph;
