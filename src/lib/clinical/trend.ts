import type { AssessmentRecord, Instrument } from "./types";

export interface TrendPoint {
  date: string;
  score: number;
  severityBand: string | null;
}

export interface TrendSummary {
  baseline: number | null;
  latest: number | null;
  change: number | null;
  /** True if absolute change crosses MCID. */
  mcidCrossed: boolean;
  /** "improving" (score down for symptom scales), "worsening", "stable". */
  direction: "improving" | "worsening" | "stable" | "unknown";
  points: TrendPoint[];
}

/**
 * For all symptom scales currently implemented (RPQ, PHQ-9, GAD-7, PCL-5, NSI),
 * lower score = better. GOSE is the inverse (higher = better) but is handled
 * outside this trend builder.
 */
export function buildTrend(
  records: AssessmentRecord[],
  instrument: Instrument,
): TrendSummary {
  const sorted = [...records]
    .filter((r) => typeof r.score === "number")
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));

  const points: TrendPoint[] = sorted.map((r) => ({
    date: r.created_at,
    score: r.score as number,
    severityBand: r.severity ?? null,
  }));

  if (sorted.length === 0) {
    return { baseline: null, latest: null, change: null, mcidCrossed: false, direction: "unknown", points };
  }
  const baseline = sorted[0].score as number;
  const latest = sorted[sorted.length - 1].score as number;
  const change = latest - baseline;
  const mcidCrossed = Math.abs(change) >= instrument.mcid;
  const direction =
    change === 0 || !mcidCrossed
      ? "stable"
      : change < 0
      ? "improving"
      : "worsening";

  return { baseline, latest, change, mcidCrossed, direction, points };
}
