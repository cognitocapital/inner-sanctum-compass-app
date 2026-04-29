import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import type { Instrument } from "@/lib/clinical/types";
import type { TrendSummary } from "@/lib/clinical/trend";
import { format } from "date-fns";

/**
 * Plots longitudinal scores with severity bands shaded behind the line.
 * Lower-is-better for all symptom instruments.
 */
interface Props {
  instrument: Instrument;
  trend: TrendSummary;
  /** Severity bands to shade (low→high). */
  bands?: { from: number; to: number; tone: "ok" | "watch" | "elevated" | "high" }[];
}

const TONE_FILL: Record<string, string> = {
  ok: "rgba(16,185,129,0.06)",
  watch: "rgba(245,158,11,0.06)",
  elevated: "rgba(249,115,22,0.07)",
  high: "rgba(244,63,94,0.07)",
};

export const ScoreTrendChart = ({ instrument, trend, bands }: Props) => {
  if (trend.points.length === 0) {
    return (
      <div className="text-white/50 text-sm py-8 text-center">
        No history yet — take this assessment again to start a trend.
      </div>
    );
  }
  const data = trend.points.map((p) => ({
    label: format(new Date(p.date), "d MMM"),
    score: p.score,
  }));
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          {bands?.map((b, i) => (
            <ReferenceArea key={i} y1={b.from} y2={b.to} fill={TONE_FILL[b.tone]} stroke="none" ifOverflow="extendDomain" />
          ))}
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={11} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[0, instrument.maxScore]} />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }}
            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#5eead4"
            strokeWidth={2}
            dot={{ r: 3, fill: "#5eead4" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
