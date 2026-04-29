import type { Instrument, AnswerValue, ScoringResult, RedFlag } from "../types";

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const PROMPTS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed; or being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

export const phq9: Instrument = {
  id: "phq9",
  code: "PHQ9",
  version: "1.0",
  name: "Patient Health Questionnaire-9",
  shortName: "PHQ-9",
  description:
    "Validated 9-item depression screen used worldwide in primary care and mental-health settings.",
  citation:
    "Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.",
  copyrightNote:
    "Developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. No permission required to reproduce, translate, display or distribute.",
  estimatedMinutes: 3,
  maxScore: 27,
  mcid: 5,
  items: PROMPTS.map((prompt, i) => ({
    id: `q${i + 1}`,
    prompt,
    domain: i === 8 ? "suicidality" : "depression",
    options: OPTIONS,
  })),
  score(responses: AnswerValue[]): ScoringResult {
    const score = responses.reduce((s, v) => s + (v ?? 0), 0);
    const q9 = responses[8] ?? 0;
    const redFlags: RedFlag[] = [];
    if (q9 >= 1) {
      redFlags.push({
        type: "suicidality",
        severity: q9 >= 2 ? "critical" : "high",
        message:
          "You indicated thoughts of being better off dead or hurting yourself. This is important — please review the safety resources before continuing.",
        itemId: "q9",
        blocking: true,
      });
    }
    let band, label, description, tone;
    if (score <= 4) { band = "minimal" as const; label = "Minimal"; description = "No depression or minimal symptoms."; tone = "ok" as const; }
    else if (score <= 9) { band = "mild" as const; label = "Mild"; description = "Mild depression — watchful waiting; repeat at follow-up."; tone = "watch" as const; }
    else if (score <= 14) { band = "moderate" as const; label = "Moderate"; description = "Moderate depression — treatment plan, considering counseling, follow-up and/or pharmacotherapy."; tone = "elevated" as const; }
    else if (score <= 19) { band = "moderately-severe" as const; label = "Moderately severe"; description = "Active treatment with pharmacotherapy and/or psychotherapy recommended."; tone = "high" as const; }
    else { band = "severe" as const; label = "Severe"; description = "Immediate initiation of pharmacotherapy and expedited referral to mental health specialist for psychotherapy and collaborative management."; tone = "critical" as const; }

    return {
      score,
      maxScore: 27,
      severity: { band, label, description, tone },
      subscores: { suicidality: q9 },
      interpretation: `PHQ-9 total ${score}/27 — ${label} depression. ${description}${q9 >= 1 ? " Suicidality item endorsed." : ""}`,
      redFlags,
    };
  },
};
