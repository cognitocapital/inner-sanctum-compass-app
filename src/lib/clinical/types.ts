/**
 * Hospital-grade clinical instrument framework.
 * Every validated instrument in src/lib/clinical/instruments/ implements `Instrument<T>`.
 */

export type AnswerValue = number;

export interface InstrumentItem {
  id: string;
  prompt: string;
  /** Optional clinical sub-domain tag (e.g. "vestibular", "cognitive", "PCL-cluster-B"). */
  domain?: string;
  /** Anchored response options, ordered low→high score. */
  options: { label: string; value: AnswerValue; description?: string }[];
  /** Reverse-scored items (rare). */
  reverse?: boolean;
}

export type SeverityBand =
  | "minimal"
  | "mild"
  | "moderate"
  | "moderately-severe"
  | "severe"
  | "normal"
  | "subthreshold"
  | "probable"
  | "vegetative"
  | "lower-severe-disability"
  | "upper-severe-disability"
  | "lower-moderate-disability"
  | "upper-moderate-disability"
  | "lower-good-recovery"
  | "upper-good-recovery"
  | "death";

export interface SeverityResult {
  band: SeverityBand;
  label: string;
  description: string;
  /** Tailwind text color class for the band (semantic, calm clinical palette). */
  tone: "ok" | "watch" | "elevated" | "high" | "critical";
}

export interface RedFlag {
  type: string;
  severity: "info" | "warn" | "high" | "critical";
  message: string;
  itemId?: string;
  /** When true, the runner must show the safety modal before saving. */
  blocking?: boolean;
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  severity: SeverityResult;
  subscores: Record<string, number>;
  interpretation: string;
  redFlags: RedFlag[];
}

export interface Instrument {
  id: string;
  /** Stored in clinical_assessments.assessment_type */
  code: string;
  version: string;
  name: string;
  shortName: string;
  description: string;
  /** Validated citation / attribution shown in InstrumentInfoSheet. */
  citation: string;
  /** Public domain or licensed (most are public domain when used non-commercially). */
  copyrightNote: string;
  /** Estimated completion time in minutes. */
  estimatedMinutes: number;
  items: InstrumentItem[];
  maxScore: number;
  /** Minimum Clinically Important Difference — change ≥ MCID is meaningful. */
  mcid: number;
  score: (responses: AnswerValue[]) => ScoringResult;
  /** Optional clinical interpretation guidance for the report. */
  interpretFor?: "patient" | "clinician";
}

export interface AssessmentRecord {
  id: string;
  user_id: string;
  assessment_type: string;
  instrument_version: string | null;
  score: number | null;
  severity: string | null;
  subscores: Record<string, number> | null;
  responses: AnswerValue[] | null;
  interpretation: string | null;
  red_flags: RedFlag[] | null;
  mcid_change: number | null;
  administered_in: string | null;
  created_at: string;
}
