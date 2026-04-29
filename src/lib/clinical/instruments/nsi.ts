import type { Instrument, AnswerValue, ScoringResult } from "../types";

const OPTIONS = [
  { label: "None — Rarely if ever present; not a problem", value: 0 },
  { label: "Mild — Occasionally present, doesn't disrupt activities", value: 1 },
  { label: "Moderate — Often present, occasionally disrupts activities", value: 2 },
  { label: "Severe — Frequently present and disrupts activities", value: 3 },
  { label: "Very severe — Almost always present, unable to perform activities", value: 4 },
];

const ITEMS: { prompt: string; domain: "vestibular" | "somatic" | "cognitive" | "affective" }[] = [
  { prompt: "Feeling dizzy", domain: "vestibular" },
  { prompt: "Loss of balance", domain: "vestibular" },
  { prompt: "Poor coordination, clumsy", domain: "vestibular" },
  { prompt: "Headaches", domain: "somatic" },
  { prompt: "Nausea", domain: "somatic" },
  { prompt: "Vision problems, blurring, trouble seeing", domain: "somatic" },
  { prompt: "Sensitivity to light", domain: "somatic" },
  { prompt: "Hearing difficulty", domain: "somatic" },
  { prompt: "Sensitivity to noise", domain: "somatic" },
  { prompt: "Numbness or tingling on parts of my body", domain: "somatic" },
  { prompt: "Change in taste and/or smell", domain: "somatic" },
  { prompt: "Loss of appetite or increased appetite", domain: "somatic" },
  { prompt: "Poor concentration, can't pay attention, easily distracted", domain: "cognitive" },
  { prompt: "Forgetfulness, can't remember things", domain: "cognitive" },
  { prompt: "Difficulty making decisions", domain: "cognitive" },
  { prompt: "Slowed thinking, difficulty getting organized, can't finish things", domain: "cognitive" },
  { prompt: "Fatigue, loss of energy, getting tired easily", domain: "affective" },
  { prompt: "Difficulty falling or staying asleep", domain: "affective" },
  { prompt: "Feeling anxious or tense", domain: "affective" },
  { prompt: "Feeling depressed or sad", domain: "affective" },
  { prompt: "Irritability, easily annoyed", domain: "affective" },
  { prompt: "Poor frustration tolerance, feeling easily overwhelmed by things", domain: "affective" },
];

export const nsi: Instrument = {
  id: "nsi",
  code: "NSI",
  version: "1.0",
  name: "Neurobehavioral Symptom Inventory",
  shortName: "NSI-22",
  description:
    "22-item measure of post-concussive neurobehavioral symptoms across vestibular, somatic, cognitive, and affective domains. Standard in U.S. VA/DoD TBI clinics.",
  citation:
    "Cicerone KD, Kalmar K. Persistent postconcussion syndrome: the structure of subjective complaints after mild traumatic brain injury. J Head Trauma Rehabil. 1995;10(3):1-17.",
  copyrightNote: "Public-domain, developed for U.S. Department of Veterans Affairs.",
  estimatedMinutes: 5,
  maxScore: 88,
  mcid: 9,
  items: ITEMS.map((it, i) => ({
    id: `q${i + 1}`,
    prompt: it.prompt,
    domain: it.domain,
    options: OPTIONS,
  })),
  score(responses: AnswerValue[]): ScoringResult {
    const score = responses.reduce((s, v) => s + (v ?? 0), 0);
    const sub = { vestibular: 0, somatic: 0, cognitive: 0, affective: 0 };
    ITEMS.forEach((it, i) => { sub[it.domain] += responses[i] ?? 0; });

    let band, label, description, tone;
    if (score <= 14) { band = "minimal" as const; label = "Low"; description = "Low overall neurobehavioral symptom burden."; tone = "ok" as const; }
    else if (score <= 28) { band = "mild" as const; label = "Mild"; description = "Mild symptom burden — supportive care."; tone = "watch" as const; }
    else if (score <= 44) { band = "moderate" as const; label = "Moderate"; description = "Moderate burden — multidisciplinary review recommended."; tone = "elevated" as const; }
    else { band = "severe" as const; label = "Severe"; description = "Severe burden — specialist neurorehabilitation indicated."; tone = "high" as const; }

    return {
      score,
      maxScore: 88,
      severity: { band, label, description, tone },
      subscores: sub,
      interpretation: `NSI-22 total ${score}/88 — ${label}. Vestibular ${sub.vestibular}/12, Somatic ${sub.somatic}/36, Cognitive ${sub.cognitive}/16, Affective ${sub.affective}/24.`,
      redFlags: [],
    };
  },
};
