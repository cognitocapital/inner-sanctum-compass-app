import type { Instrument, AnswerValue, ScoringResult, RedFlag } from "../types";

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "A little bit", value: 1 },
  { label: "Moderately", value: 2 },
  { label: "Quite a bit", value: 3 },
  { label: "Extremely", value: 4 },
];

// 20-item PCL-5 mapped to DSM-5 clusters
// B: 1-5, C: 6-7, D: 8-14, E: 15-20
const ITEMS: { prompt: string; cluster: "B" | "C" | "D" | "E" }[] = [
  { prompt: "Repeated, disturbing, and unwanted memories of the stressful experience", cluster: "B" },
  { prompt: "Repeated, disturbing dreams of the stressful experience", cluster: "B" },
  { prompt: "Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)", cluster: "B" },
  { prompt: "Feeling very upset when something reminded you of the stressful experience", cluster: "B" },
  { prompt: "Having strong physical reactions when something reminded you of the stressful experience (heart pounding, trouble breathing, sweating)", cluster: "B" },
  { prompt: "Avoiding memories, thoughts, or feelings related to the stressful experience", cluster: "C" },
  { prompt: "Avoiding external reminders of the stressful experience (people, places, conversations, activities, objects, situations)", cluster: "C" },
  { prompt: "Trouble remembering important parts of the stressful experience", cluster: "D" },
  { prompt: "Having strong negative beliefs about yourself, other people, or the world", cluster: "D" },
  { prompt: "Blaming yourself or someone else for the stressful experience or what happened after it", cluster: "D" },
  { prompt: "Having strong negative feelings such as fear, horror, anger, guilt, or shame", cluster: "D" },
  { prompt: "Loss of interest in activities that you used to enjoy", cluster: "D" },
  { prompt: "Feeling distant or cut off from other people", cluster: "D" },
  { prompt: "Trouble experiencing positive feelings (being unable to feel happiness or have loving feelings)", cluster: "D" },
  { prompt: "Irritable behaviour, angry outbursts, or acting aggressively", cluster: "E" },
  { prompt: "Taking too many risks or doing things that could cause you harm", cluster: "E" },
  { prompt: "Being 'superalert' or watchful or on guard", cluster: "E" },
  { prompt: "Feeling jumpy or easily startled", cluster: "E" },
  { prompt: "Having difficulty concentrating", cluster: "E" },
  { prompt: "Trouble falling or staying asleep", cluster: "E" },
];

export const pcl5: Instrument = {
  id: "pcl5",
  code: "PCL5",
  version: "1.0",
  name: "PTSD Checklist for DSM-5",
  shortName: "PCL-5",
  description:
    "20-item self-report measure of DSM-5 PTSD symptoms with cluster scoring and provisional diagnostic flag.",
  citation:
    "Weathers FW, Litz BT, Keane TM, et al. The PTSD Checklist for DSM-5 (PCL-5). National Center for PTSD. 2013.",
  copyrightNote:
    "Developed by U.S. National Center for PTSD. Public-domain for clinical, research, and educational use.",
  estimatedMinutes: 6,
  maxScore: 80,
  mcid: 10,
  items: ITEMS.map((it, i) => ({
    id: `q${i + 1}`,
    prompt: it.prompt,
    domain: `Cluster ${it.cluster}`,
    options: OPTIONS,
  })),
  score(responses: AnswerValue[]): ScoringResult {
    const score = responses.reduce((s, v) => s + (v ?? 0), 0);
    const sub = { "Cluster B": 0, "Cluster C": 0, "Cluster D": 0, "Cluster E": 0 };
    const symptomCounts = { B: 0, C: 0, D: 0, E: 0 };
    ITEMS.forEach((it, i) => {
      const v = responses[i] ?? 0;
      sub[`Cluster ${it.cluster}` as keyof typeof sub] += v;
      if (v >= 2) symptomCounts[it.cluster] += 1;
    });
    // Provisional DSM-5 PTSD diagnosis: ≥1 B, ≥1 C, ≥2 D, ≥2 E (each scored ≥2)
    const provisional =
      symptomCounts.B >= 1 && symptomCounts.C >= 1 && symptomCounts.D >= 2 && symptomCounts.E >= 2;

    let band, label, description, tone;
    if (score < 31) { band = "subthreshold" as const; label = "Below threshold"; description = "Symptoms present but below typical clinical threshold."; tone = "ok" as const; }
    else if (score < 38) { band = "moderate" as const; label = "Probable PTSD (lower)"; description = "Score in the lower probable PTSD range — clinical interview recommended."; tone = "elevated" as const; }
    else { band = "probable" as const; label = "Probable PTSD"; description = "Score consistent with probable PTSD — diagnostic assessment indicated."; tone = "high" as const; }

    const redFlags: RedFlag[] = [];
    if (provisional) {
      redFlags.push({
        type: "provisional-ptsd",
        severity: "high",
        message:
          "Symptom pattern meets provisional DSM-5 PTSD criteria (clusters B, C, D, E). A clinical diagnostic interview is recommended.",
      });
    }

    return {
      score,
      maxScore: 80,
      severity: { band, label, description, tone },
      subscores: sub,
      interpretation: `PCL-5 total ${score}/80. ${label}. Provisional DSM-5 PTSD criteria ${provisional ? "MET" : "not met"} (B${symptomCounts.B}/C${symptomCounts.C}/D${symptomCounts.D}/E${symptomCounts.E} items ≥ Moderate).`,
      redFlags,
    };
  },
};
