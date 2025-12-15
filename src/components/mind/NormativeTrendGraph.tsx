import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// 2025 NINDS normative data benchmarks
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
  data,
  title,
  metric,
  normativeValue,
  normativeLabel,
  domain = [0, 10],
  higherIsBetter = true,
  nindsCategory,
  className
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

  const chartData = data.map(d => ({
    ...d,
    normative: normativeValue
  }));

  return (
    <Card className={cn("bg-black/40 border-orange-600/50", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-100 text-lg">
            <Activity className="h-5 w-5 text-orange-400" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {nindsCategory && (
              <Badge variant="outline" className="border-cyan-500 text-cyan-300 text-xs">
                NINDS: {nindsCategory}
              </Badge>
            )}
            {trend && (
              <Badge className={cn(
                "text-xs",
                trend.isPositive 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-red-500/20 text-red-400"
              )}>
                {trend.direction === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {trend.percentage}%
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-orange-300/70">{metric}</span>
          {comparison && (
            <span className={cn(
              "text-xs",
              comparison === 'above' && higherIsBetter ? "text-green-400" : 
              comparison === 'below' && !higherIsBetter ? "text-green-400" : "text-amber-400"
            )}>
              {comparison === 'above' ? '↑' : '↓'} vs 2025 norm
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={{ stroke: '#4b5563' }}
              />
              <YAxis 
                domain={domain}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={{ stroke: '#4b5563' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #4b5563',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              
              {/* Normative reference band */}
              <ReferenceLine 
                y={normativeValue} 
                stroke="#06b6d4" 
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              
              {/* User data area */}
              <Area
                type="monotone"
                dataKey="value"
                fill="url(#userGradient)"
                stroke="none"
              />
              
              {/* User data line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#fb923c' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-500 rounded"></div>
            <span className="text-orange-300">Your Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-cyan-500 rounded" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-cyan-300">{normativeLabel}</span>
          </div>
        </div>

        {/* Ch3 quanta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-2 bg-orange-900/20 rounded-lg border border-orange-700/30"
        >
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
            <p className="text-orange-200/70 text-xs italic">
              Ch3 "emotional rollercoaster" - your trends reveal patterns in the storm
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default NormativeTrendGraph;
