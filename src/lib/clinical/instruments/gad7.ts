import type { Instrument, AnswerValue, ScoringResult } from "../types";

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const PROMPTS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

export const gad7: Instrument = {
  id: "gad7",
  code: "GAD7",
  version: "1.0",
  name: "Generalized Anxiety Disorder-7",
  shortName: "GAD-7",
  description: "Validated 7-item screen for generalized anxiety severity.",
  citation:
    "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097.",
  copyrightNote:
    "Developed by Drs. Spitzer, Kroenke, Williams, Löwe with grant from Pfizer Inc. No permission required to reproduce, translate, display or distribute.",
  estimatedMinutes: 2,
  maxScore: 21,
  mcid: 4,
  items: PROMPTS.map((prompt, i) => ({ id: `q${i + 1}`, prompt, options: OPTIONS })),
  score(responses: AnswerValue[]): ScoringResult {
    const score = responses.reduce((s, v) => s + (v ?? 0), 0);
    let band, label, description, tone;
    if (score <= 4) { band = "minimal" as const; label = "Minimal"; description = "Minimal anxiety symptoms."; tone = "ok" as const; }
    else if (score <= 9) { band = "mild" as const; label = "Mild"; description = "Mild anxiety — monitor; reassess at follow-up."; tone = "watch" as const; }
    else if (score <= 14) { band = "moderate" as const; label = "Moderate"; description = "Moderate anxiety — possible clinically significant condition; further evaluation recommended."; tone = "elevated" as const; }
    else { band = "severe" as const; label = "Severe"; description = "Severe anxiety — active treatment likely warranted."; tone = "high" as const; }
    return {
      score,
      maxScore: 21,
      severity: { band, label, description, tone },
      subscores: {},
      interpretation: `GAD-7 total ${score}/21 — ${label} anxiety. ${description}`,
      redFlags: [],
    };
  },
};
