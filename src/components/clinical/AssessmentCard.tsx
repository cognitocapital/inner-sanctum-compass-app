import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkline, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Instrument, AssessmentRecord } from "@/lib/clinical/types";
import { buildTrend } from "@/lib/clinical/trend";

interface Props {
  instrument: Instrument;
  history: AssessmentRecord[];
  onStart: () => void;
  onView: () => void;
}

const TONE_BADGE: Record<string, string> = {
  ok: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  watch: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  elevated: "bg-orange-500/15 text-orange-200 border-orange-400/30",
  high: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  critical: "bg-rose-600/20 text-rose-100 border-rose-500/40",
};

export const AssessmentCard = ({ instrument, history, onStart, onView }: Props) => {
  const latest = history[0];
  const trend = buildTrend(history, instrument);
  const tone =
    latest?.severity?.toLowerCase().includes("severe")
      ? "high"
      : latest?.severity?.toLowerCase().includes("moderate")
      ? "elevated"
      : latest?.severity?.toLowerCase().includes("mild")
      ? "watch"
      : latest
      ? "ok"
      : "ok";

  const DirIcon = trend.direction === "improving" ? TrendingDown : trend.direction === "worsening" ? TrendingUp : Minus;
  const dirColor = trend.direction === "improving" ? "text-emerald-300" : trend.direction === "worsening" ? "text-rose-300" : "text-white/45";

  return (
    <Card className="bg-slate-900/60 border-slate-700/40 hover:border-teal-400/40 transition-colors">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-base">{instrument.shortName}</h3>
              <Badge variant="outline" className="border-white/15 text-white/55 text-[10px] px-1.5 py-0">
                v{instrument.version}
              </Badge>
            </div>
            <p className="text-white/55 text-xs mt-1 line-clamp-2">{instrument.name}</p>
          </div>
          {latest ? (
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-white tabular-nums">
                {latest.score}<span className="text-white/40 text-sm">/{instrument.maxScore}</span>
              </div>
              <Badge variant="outline" className={`mt-1 text-[10px] ${TONE_BADGE[tone]}`}>
                {latest.severity}
              </Badge>
            </div>
          ) : (
            <Badge variant="outline" className="border-white/15 text-white/55 text-[10px]">No data</Badge>
          )}
        </div>

        {history.length >= 2 && trend.change !== null && (
          <div className="flex items-center gap-2 text-xs">
            <DirIcon className={`w-3.5 h-3.5 ${dirColor}`} aria-hidden="true" />
            <span className={dirColor}>
              {trend.change > 0 ? "+" : ""}{trend.change} vs baseline
            </span>
            {trend.mcidCrossed && (
              <Badge variant="outline" className="border-teal-400/40 text-teal-200 text-[10px] px-1.5 py-0">
                MCID crossed
              </Badge>
            )}
            <span className="text-white/35">· {history.length} assessments</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 text-[11px] text-white/45">
          <span>~{instrument.estimatedMinutes} min · {instrument.items.length} items</span>
        </div>

        <div className="flex gap-2">
          {history.length > 0 && (
            <Button variant="outline" onClick={onView} className="flex-1 border-white/15 text-white/75 hover:bg-white/5">
              History
            </Button>
          )}
          <Button onClick={onStart} className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold">
            {latest ? "Retake" : "Start"}
            <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
