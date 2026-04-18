export interface BrainRegion {
  id: string;
  label: string;
  position: [number, number, number];
  size: [number, number, number]; // ellipsoid radii
  color: string; // hex
  function: string;
  tbiSequelae: string;
  evidenceNote: string;
  manuscriptLink: string;
  manuscriptLabel: string;
  protocolLink: string;
  protocolLabel: string;
}

// Stylised MNI-152-inspired anatomical positions (centered on origin).
// Y = up (superior), X = right, Z = forward (anterior).
export const brainRegions: BrainRegion[] = [
  {
    id: "dlpfc",
    label: "Dorsolateral Prefrontal Cortex",
    position: [0, 0.55, 1.05],
    size: [0.85, 0.55, 0.55],
    color: "#3b82f6",
    function: "Executive function, decision-making, working memory.",
    tbiSequelae:
      "Disruption here frequently produces post-concussion executive dysfunction — difficulty planning, prioritising, and holding information in mind under load.",
    evidenceNote:
      "Meta-analysis 2025: structured neuroplasticity training targeting prefrontal circuits shows measurable gains in attention and working memory in mTBI cohorts.",
    manuscriptLink: "/chapter-6",
    manuscriptLabel: "Chapter 6 — The Rollercoaster",
    protocolLink: "/mind",
    protocolLabel: "Mind Academy — N-Back",
  },
  {
    id: "ofc",
    label: "Orbitofrontal Cortex",
    position: [0, 0.15, 1.15],
    size: [0.7, 0.4, 0.45],
    color: "#f59e0b",
    function: "Emotional regulation, impulse control, reward valuation.",
    tbiSequelae:
      "Damage here is closely linked to emotional lability and impulsivity — the 'short fuse' many TBI survivors describe months after injury.",
    evidenceNote:
      "2024 systematic review: mindfulness-based interventions modulate orbitofrontal activity and reduce post-TBI emotional reactivity.",
    manuscriptLink: "/chapter-11",
    manuscriptLabel: "Chapter 11 — The Inner Work",
    protocolLink: "/daily-protocol",
    protocolLabel: "Daily Phoenix Protocol",
  },
  {
    id: "amygdala_hippocampus",
    label: "Amygdala & Hippocampus",
    position: [0, -0.1, 0.2],
    size: [0.55, 0.4, 0.55],
    color: "#ec4899",
    function: "Fear response, memory consolidation, emotional memory.",
    tbiSequelae:
      "Vulnerable to diffuse axonal injury — manifests as heightened threat sensitivity, flashbacks, and patchy short-term memory consolidation.",
    evidenceNote:
      "2025 RCT: paced diaphragmatic breathing reduces amygdala reactivity and improves hippocampal-dependent recall in post-concussion patients.",
    manuscriptLink: "/chapter-7",
    manuscriptLabel: "Chapter 7 — Memory & Loss",
    protocolLink: "/breathing",
    protocolLabel: "Retention Breathing",
  },
  {
    id: "temporal",
    label: "Temporal Lobe",
    position: [-1.05, 0.05, 0.25],
    size: [0.55, 0.55, 0.85],
    color: "#a855f7",
    function: "Language, auditory processing, taste/smell pathways.",
    tbiSequelae:
      "Common impact site in lateral blows — produces word-finding difficulty, auditory overload in noisy rooms, and altered taste/smell.",
    evidenceNote:
      "INCOG 2.0 (2023, 2025 ext.): graded auditory exposure and language scaffolding restore cortical responsiveness.",
    manuscriptLink: "/chapter-9",
    manuscriptLabel: "Chapter 9 — Sensory Storms",
    protocolLink: "/soundscapes",
    protocolLabel: "Healing Soundscapes",
  },
  {
    id: "vestibular_cerebellum",
    label: "Vestibular Nuclei & Cerebellum",
    position: [0, -0.75, -0.55],
    size: [0.85, 0.45, 0.55],
    color: "#10b981",
    function: "Balance, vertigo, spatial orientation, motor coordination.",
    tbiSequelae:
      "Vestibular dysfunction produces persistent dizziness, motion intolerance, and the 'walking on a boat' feeling that lingers post-injury.",
    evidenceNote:
      "2025 meta-analysis: vestibular rehabilitation therapy yields large effect sizes for post-concussion dizziness within 6 weeks.",
    manuscriptLink: "/chapter-8",
    manuscriptLabel: "Chapter 8 — Finding Ground",
    protocolLink: "/cold-exposure",
    protocolLabel: "Cold Exposure Reset",
  },
  {
    id: "occipital",
    label: "Occipital & Visual Association",
    position: [0, 0.1, -1.1],
    size: [0.85, 0.55, 0.45],
    color: "#06b6d4",
    function: "Visual processing, visual snow, contrast and motion perception.",
    tbiSequelae:
      "Coup-contrecoup injuries commonly disturb posterior visual networks — produces visual snow, light sensitivity, and screen fatigue.",
    evidenceNote:
      "2024 review: tinted lenses and graded screen exposure reduce post-TBI photophobia and visual processing load.",
    manuscriptLink: "/chapter-10",
    manuscriptLabel: "Chapter 10 — Through the Fog",
    protocolLink: "/mind",
    protocolLabel: "Visual Attention Drills",
  },
  {
    id: "dmn",
    label: "Default Mode Network",
    position: [0, 0.4, -0.2],
    size: [0.5, 0.45, 0.85],
    color: "#eab308",
    function: "Self-referential thinking, identity, autobiographical memory.",
    tbiSequelae:
      "DMN dysregulation underlies the 'I don't recognise myself' experience — rumination loops and a fractured sense of continuity.",
    evidenceNote:
      "2025 fMRI study: 8-week meditation protocols normalise DMN connectivity and improve self-reported identity coherence post-TBI.",
    manuscriptLink: "/chapter-11",
    manuscriptLabel: "Chapter 11 — The Inner Work",
    protocolLink: "/gratitude",
    protocolLabel: "Gratitude Journey",
  },
];
