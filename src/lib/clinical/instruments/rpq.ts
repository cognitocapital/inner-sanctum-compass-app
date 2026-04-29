import type { Instrument, AnswerValue, ScoringResult } from "../types";

const OPTIONS = [
  { label: "Not experienced at all", value: 0 },
  { label: "No more of a problem", value: 1, description: "Same as before injury — not counted in score" },
  { label: "A mild problem", value: 2 },
  { label: "A moderate problem", value: 3 },
  { label: "A severe problem", value: 4 },
];

const PROMPTS = [
  "Headaches",
  "Feelings of dizziness",
  "Nausea and/or vomiting",
  "Noise sensitivity (easily upset by loud noise)",
  "Sleep disturbance",
  "Fatigue, tiring more easily",
  "Being irritable, easily angered",
  "Feeling depressed or tearful",
  "Feeling frustrated or impatient",
  "Forgetfulness, poor memory",
  "Poor concentration",
  "Taking longer to think",
  "Blurred vision",
  "Light sensitivity (easily upset by bright light)",
  "Double vision",
  "Restlessness",
];

export const rpq: Instrument = {
  id: "rpq",
  code: "RPQ",
  version: "1.0",
  name: "Rivermead Post-Concussion Symptoms Questionnaire",
  shortName: "RPQ-16",
  description:
    "Gold-standard measure of post-concussion symptom burden. Reports RPQ-3 (early symptoms) and RPQ-13 (late symptoms) subscores.",
  citation:
    "King NS, Crawford S, Wenden FJ, Moss NEG, Wade DT. The Rivermead Post Concussion Symptoms Questionnaire: a measure of symptoms commonly experienced after head injury and its reliability. J Neurol. 1995;242(9):587-592.",
  copyrightNote: "Public-domain for clinical and research use.",
  estimatedMinutes: 4,
  maxScore: 64,
  mcid: 9,
  items: PROMPTS.map((prompt, i) => ({
    id: `q${i + 1}`,
    prompt,
    domain: i < 3 ? "RPQ-3" : "RPQ-13",
    options: OPTIONS,
  })),
  score(responses: AnswerValue[]): ScoringResult {
    // RPQ scoring: 0=0, 1=0 (same as before injury), 2=2, 3=3, 4=4
    const adjusted = responses.map((v) => (v <= 1 ? 0 : v));
    const rpq3 = adjusted.slice(0, 3).reduce((s, v) => s + v, 0);
    const rpq13 = adjusted.slice(3).reduce((s, v) => s + v, 0);
    const score = rpq3 + rpq13;

    let band, label, description, tone;
    if (score <= 12) { band = "minimal" as const; label = "Low symptom burden"; description = "Few or mild post-concussion symptoms."; tone = "ok" as const; }
    else if (score <= 24) { band = "mild" as const; label = "Mild–moderate burden"; description = "Symptoms present; recovery support recommended."; tone = "watch" as const; }
    else if (score <= 39) { band = "moderate" as const; label = "Moderate burden"; description = "Substantial symptom load — multidisciplinary input recommended."; tone = "elevated" as const; }
    else { band = "severe" as const; label = "High burden"; description = "Persistent severe post-concussion symptoms — specialist neurorehabilitation indicated."; tone = "high" as const; }

    return {
      score,
      maxScore: 64,
      severity: { band, label, description, tone },
      subscores: { "RPQ-3": rpq3, "RPQ-13": rpq13 },
      interpretation: `RPQ-16 total ${score}/64 (RPQ-3: ${rpq3}, RPQ-13: ${rpq13}) — ${label}. ${description}`,
      redFlags: [],
    };
  },
};
