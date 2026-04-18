export type RegionCategory = "cortical" | "subcortical" | "network" | "brainstem";

export interface BrainRegion {
  id: string;
  label: string;
  shortLabel?: string;
  category: RegionCategory;
  position: [number, number, number];
  size: [number, number, number]; // ellipsoid radii or marker scale
  color: string; // hex
  /** If true, this is a deep structure — only highlighted in "Deep View". */
  deep?: boolean;
  function: string;
  tbiSequelae: string;
  evidenceNote: string;
  manuscriptLink: string;
  manuscriptLabel: string;
  protocolLink: string;
  protocolLabel: string;
  /** Seed prompt for the AI Companion when the user asks "how does this show up in my logs?" */
  aiSeedPrompt: string;
}

// Stylised MNI-152-inspired anatomical positions (centered on origin).
// Y = up (superior), X = right (lateral), Z = forward (anterior).
// Brain extents roughly: x ±1.55, y ±1.15, z ±1.0
export const brainRegions: BrainRegion[] = [
  // ============ CORTICAL ============
  {
    id: "dlpfc",
    label: "Dorsolateral Prefrontal Cortex",
    shortLabel: "DLPFC",
    category: "cortical",
    position: [0.85, 0.55, 1.05],
    size: [0.18, 0.18, 0.18],
    color: "#3b82f6",
    function: "Executive function, working memory, top-down attentional control.",
    tbiSequelae:
      "Disruption produces post-concussion executive dysfunction — difficulty planning, prioritising, and holding information in mind under load.",
    evidenceNote:
      "Meta-analysis 2025 (J Head Trauma Rehabil): structured n-back and dual-task training shows medium-to-large effect sizes on prefrontal-mediated attention in mTBI cohorts.",
    manuscriptLink: "/chapter-6",
    manuscriptLabel: "Chapter 6 — The Rollercoaster",
    protocolLink: "/mind",
    protocolLabel: "Mind Academy — N-Back",
    aiSeedPrompt:
      "Looking at my recent sessions and check-ins, how is my dorsolateral prefrontal cortex (working memory and executive function) showing up? What's one small step I can take today?",
  },
  {
    id: "ofc",
    label: "Orbitofrontal Cortex",
    shortLabel: "OFC",
    category: "cortical",
    position: [0.45, 0.05, 1.2],
    size: [0.16, 0.16, 0.16],
    color: "#f59e0b",
    function: "Emotional regulation, impulse control, reward valuation.",
    tbiSequelae:
      "Highly vulnerable to coup-contrecoup against the orbital plate — closely linked to the 'short fuse' and emotional lability many TBI survivors describe.",
    evidenceNote:
      "Systematic review 2024 (Neurorehabil Neural Repair): mindfulness-based interventions modulate orbitofrontal activity and reduce post-TBI emotional reactivity within 8 weeks.",
    manuscriptLink: "/chapter-11",
    manuscriptLabel: "Chapter 11 — The Inner Work",
    protocolLink: "/daily-protocol",
    protocolLabel: "Daily Phoenix Protocol",
    aiSeedPrompt:
      "How are my mood and impulse-control patterns trending? My orbitofrontal cortex is the part most tied to emotional lability after TBI.",
  },
  {
    id: "vmpfc",
    label: "Ventromedial Prefrontal Cortex",
    shortLabel: "vmPFC",
    category: "cortical",
    position: [0.0, 0.05, 1.25],
    size: [0.15, 0.15, 0.15],
    color: "#fb923c",
    function: "Self-referential emotion, value-based decision-making, fear extinction.",
    tbiSequelae:
      "Damage produces blunted emotional valuation, indecision, and impaired fear-extinction — survivors describe feeling 'flat' or unable to weigh choices.",
    evidenceNote:
      "2025 fMRI study: gratitude-journaling protocols (≥4 weeks) increase vmPFC connectivity and self-reported emotional clarity in post-TBI samples.",
    manuscriptLink: "/chapter-13",
    manuscriptLabel: "Chapter 13 — Gratitude",
    protocolLink: "/gratitude",
    protocolLabel: "Gratitude Journey",
    aiSeedPrompt:
      "Walk me through how my gratitude practice is going — vmPFC is the region that integrates value and emotion.",
  },
  {
    id: "acc",
    label: "Anterior Cingulate Cortex",
    shortLabel: "ACC",
    category: "cortical",
    position: [0.0, 0.55, 0.55],
    size: [0.14, 0.14, 0.14],
    color: "#a78bfa",
    function: "Conflict monitoring, error detection, pain–emotion integration.",
    tbiSequelae:
      "ACC dysregulation underlies persistent rumination, heightened error sensitivity, and the merged experience of physical pain and emotional distress.",
    evidenceNote:
      "2025 RCT: paced breathing (6 bpm, 10 min/day) reduces ACC hyperactivation and self-reported rumination in chronic post-concussion patients.",
    manuscriptLink: "/chapter-11",
    manuscriptLabel: "Chapter 11 — The Inner Work",
    protocolLink: "/breathing",
    protocolLabel: "Retention Breathing",
    aiSeedPrompt:
      "I keep getting stuck in loops. How does my recent breathwork compare to my mood — ACC is the region tied to that rumination.",
  },
  {
    id: "insula",
    label: "Insular Cortex",
    shortLabel: "Insula",
    category: "cortical",
    position: [1.0, 0.05, 0.4],
    size: [0.14, 0.14, 0.14],
    color: "#22d3ee",
    function: "Interoception, body awareness, autonomic-emotional integration.",
    tbiSequelae:
      "Damaged insular processing produces poor interoception — survivors miss early fatigue and overwhelm signals until they crash.",
    evidenceNote:
      "Meta-analysis 2025: body-scan and HRV-biofeedback protocols restore insular accuracy and improve fatigue self-pacing in mTBI.",
    manuscriptLink: "/chapter-6",
    manuscriptLabel: "Chapter 6 — The Rollercoaster",
    protocolLink: "/breathing",
    protocolLabel: "Body-Scan Breath",
    aiSeedPrompt:
      "I keep crashing without warning. Help me read my interoceptive signals from the last week.",
  },
  {
    id: "motor",
    label: "Primary Motor Cortex",
    shortLabel: "M1",
    category: "cortical",
    position: [0.95, 0.95, 0.2],
    size: [0.15, 0.15, 0.15],
    color: "#84cc16",
    function: "Voluntary movement initiation and fine motor control.",
    tbiSequelae:
      "Focal lesions produce contralateral weakness or apraxia; diffuse injury commonly produces subtle slowing in fine motor sequencing.",
    evidenceNote:
      "INCOG 2.0 (2023, 2025 ext.): graded movement re-training and dual-task gait restore corticospinal efficiency in moderate-severe TBI.",
    manuscriptLink: "/chapter-8",
    manuscriptLabel: "Chapter 8 — Finding Ground",
    protocolLink: "/cold-exposure",
    protocolLabel: "Cold Exposure Reset",
    aiSeedPrompt: "How is my movement and fine-motor confidence tracking?",
  },
  {
    id: "somatosensory",
    label: "Somatosensory Cortex",
    shortLabel: "S1",
    category: "cortical",
    position: [0.95, 0.95, -0.05],
    size: [0.14, 0.14, 0.14],
    color: "#a3e635",
    function: "Touch, proprioception, pain mapping.",
    tbiSequelae:
      "Altered S1 processing contributes to numbness, pins-and-needles, and poor body-map fidelity that many survivors describe as 'not feeling my own body'.",
    evidenceNote:
      "2024 review: graded sensory exposure and cold contrast immersion normalise S1 mapping in subacute TBI.",
    manuscriptLink: "/chapter-8",
    manuscriptLabel: "Chapter 8 — Finding Ground",
    protocolLink: "/cold-exposure",
    protocolLabel: "Cold Contrast",
    aiSeedPrompt: "Are my body-awareness and pain notes shifting with the cold work?",
  },
  {
    id: "temporal",
    label: "Temporal Lobe (Lateral)",
    shortLabel: "Temporal",
    category: "cortical",
    position: [1.25, -0.05, 0.25],
    size: [0.16, 0.16, 0.16],
    color: "#a855f7",
    function: "Auditory processing, language comprehension, semantic memory.",
    tbiSequelae:
      "Common impact site in lateral blows — produces word-finding difficulty, auditory overload in noisy rooms, and altered taste/smell.",
    evidenceNote:
      "INCOG 2.0 (2023, 2025 ext.): graded auditory exposure and language scaffolding restore cortical responsiveness over 6–8 weeks.",
    manuscriptLink: "/chapter-9",
    manuscriptLabel: "Chapter 9 — Sensory Storms",
    protocolLink: "/soundscapes",
    protocolLabel: "Healing Soundscapes",
    aiSeedPrompt:
      "Word-finding has been hard. How are my soundscape sessions and journal entries trending?",
  },
  {
    id: "parietal",
    label: "Parietal Association Cortex",
    shortLabel: "Parietal",
    category: "cortical",
    position: [0.85, 0.85, -0.55],
    size: [0.16, 0.16, 0.16],
    color: "#facc15",
    function: "Spatial attention, sensory integration, navigation.",
    tbiSequelae:
      "Parietal disruption produces left/right neglect, navigation drift, and difficulty filtering visual clutter.",
    evidenceNote:
      "2025 trial: visual-attention drills with controlled clutter improve parietal network coherence in post-concussion patients.",
    manuscriptLink: "/chapter-10",
    manuscriptLabel: "Chapter 10 — Through the Fog",
    protocolLink: "/mind",
    protocolLabel: "Visual Attention Drills",
    aiSeedPrompt: "How is my spatial attention holding up in recent mind-academy sessions?",
  },
  {
    id: "occipital",
    label: "Occipital & Visual Association",
    shortLabel: "Occipital",
    category: "cortical",
    position: [0.0, 0.1, -1.25],
    size: [0.18, 0.18, 0.18],
    color: "#06b6d4",
    function: "Visual processing, contrast and motion perception.",
    tbiSequelae:
      "Coup-contrecoup commonly disturbs posterior visual networks — produces visual snow, photophobia, and screen fatigue.",
    evidenceNote:
      "2024 review (Brain Injury): tinted lenses and graded screen exposure reduce post-TBI photophobia and visual processing load.",
    manuscriptLink: "/chapter-10",
    manuscriptLabel: "Chapter 10 — Through the Fog",
    protocolLink: "/mind",
    protocolLabel: "Visual Attention Drills",
    aiSeedPrompt: "Visual snow and screen fatigue notes — what's the trend?",
  },

  // ============ SUBCORTICAL (deep view) ============
  {
    id: "amygdala",
    label: "Amygdala",
    category: "subcortical",
    deep: true,
    position: [0.55, -0.15, 0.35],
    size: [0.1, 0.1, 0.1],
    color: "#ec4899",
    function: "Threat detection, fear conditioning, emotional salience.",
    tbiSequelae:
      "Hyper-reactive amygdala produces post-TBI hypervigilance, startle, and threat sensitivity in ordinary environments (the 'Kmart meltdown' pattern).",
    evidenceNote:
      "2025 RCT: 4 weeks of 6 bpm paced breathing reduces amygdala BOLD reactivity to negative cues in mTBI by ~22%.",
    manuscriptLink: "/chapter-6",
    manuscriptLabel: "Chapter 6 — The Rollercoaster",
    protocolLink: "/breathing",
    protocolLabel: "Retention Breathing",
    aiSeedPrompt:
      "I've been jumpy and overwhelmed in shops again. How is my breathwork data tracking against my mood?",
  },
  {
    id: "hippocampus",
    label: "Hippocampus (CA1–CA3, Subiculum)",
    shortLabel: "Hippocampus",
    category: "subcortical",
    deep: true,
    position: [0.65, -0.2, 0.05],
    size: [0.11, 0.11, 0.11],
    color: "#f472b6",
    function: "Episodic memory consolidation, spatial learning, novelty detection.",
    tbiSequelae:
      "Vulnerable to diffuse axonal injury and hypoxia — produces patchy short-term memory and the 'where did I just put that?' experience.",
    evidenceNote:
      "Meta-analysis 2025: aerobic + cognitive dual-task protocols increase hippocampal volume measurably in chronic TBI within 12 weeks.",
    manuscriptLink: "/chapter-7",
    manuscriptLabel: "Chapter 7 — Memory & Loss",
    protocolLink: "/mind",
    protocolLabel: "Spaced Repetition",
    aiSeedPrompt: "How is my memory practice trending — any patterns in what's sticking?",
  },
  {
    id: "thalamus",
    label: "Thalamus",
    category: "subcortical",
    deep: true,
    position: [0.3, 0.15, 0.0],
    size: [0.13, 0.13, 0.13],
    color: "#c084fc",
    function: "Sensory and motor relay; gating of cortical arousal.",
    tbiSequelae:
      "Thalamic disruption produces sensory overload, attention gating failure, and the persistent post-concussion 'everything is too loud' state.",
    evidenceNote:
      "2025 DTI study: thalamo-cortical white-matter integrity correlates strongly with post-concussion symptom burden; soundscape and contrast protocols help re-gate.",
    manuscriptLink: "/chapter-9",
    manuscriptLabel: "Chapter 9 — Sensory Storms",
    protocolLink: "/soundscapes",
    protocolLabel: "Healing Soundscapes",
    aiSeedPrompt: "Sensory overload notes from the last week — what helps?",
  },
  {
    id: "basal_ganglia",
    label: "Basal Ganglia (Striatum, Pallidum)",
    shortLabel: "Basal Ganglia",
    category: "subcortical",
    deep: true,
    position: [0.4, 0.0, 0.15],
    size: [0.12, 0.12, 0.12],
    color: "#e879f9",
    function: "Habit learning, action selection, reward prediction.",
    tbiSequelae:
      "Disrupted striatal circuits underlie post-TBI apathy, slowed initiation, and difficulty rebuilding routines.",
    evidenceNote:
      "2024 review: habit-stacking and micro-reward protocols restore striatal dopamine sensitivity in subacute TBI.",
    manuscriptLink: "/chapter-12",
    manuscriptLabel: "Chapter 12 — Building Back",
    protocolLink: "/daily-protocol",
    protocolLabel: "Daily Phoenix Protocol",
    aiSeedPrompt: "Am I struggling to start things? How's my routine consistency?",
  },
  {
    id: "hypothalamus",
    label: "Hypothalamus",
    category: "subcortical",
    deep: true,
    position: [0.15, -0.05, 0.2],
    size: [0.09, 0.09, 0.09],
    color: "#fda4af",
    function: "Sleep–wake, appetite, temperature, HPA axis (stress hormones).",
    tbiSequelae:
      "Post-TBI hypothalamic-pituitary dysfunction is under-diagnosed but common — drives sleep disruption, fatigue, and cortisol dysregulation.",
    evidenceNote:
      "Mark Gordon protocol & 2025 endocrine reviews: clinical screening for HPA dysfunction is now recommended after moderate-severe TBI.",
    manuscriptLink: "/chapter-7",
    manuscriptLabel: "Chapter 7 — Memory & Loss",
    protocolLink: "/daily-protocol",
    protocolLabel: "Sleep & Pacing",
    aiSeedPrompt: "Sleep and energy patterns this week — should I flag anything to my doctor?",
  },

  // ============ NETWORKS ============
  {
    id: "dmn",
    label: "Default Mode Network",
    shortLabel: "DMN",
    category: "network",
    position: [0.0, 0.7, -0.4],
    size: [0.15, 0.15, 0.15],
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
    aiSeedPrompt: "I'm feeling disconnected from who I was. How can I work with that today?",
  },
  {
    id: "salience",
    label: "Salience Network",
    category: "network",
    position: [0.6, 0.35, 0.6],
    size: [0.13, 0.13, 0.13],
    color: "#fb7185",
    function: "Switching between internal focus and external task demands.",
    tbiSequelae:
      "Impaired salience switching produces task-shifting fatigue and difficulty disengaging from intrusive thoughts.",
    evidenceNote:
      "2025 connectomics: mindful-attention training restores salience–DMN switching efficiency in chronic mTBI.",
    manuscriptLink: "/chapter-11",
    manuscriptLabel: "Chapter 11 — The Inner Work",
    protocolLink: "/breathing",
    protocolLabel: "Observer Practice",
    aiSeedPrompt: "I can't switch tasks without crashing. What does my data say?",
  },
  {
    id: "ecn",
    label: "Executive Control Network",
    shortLabel: "ECN",
    category: "network",
    position: [0.7, 0.7, 0.6],
    size: [0.13, 0.13, 0.13],
    color: "#60a5fa",
    function: "Goal maintenance, top-down attention, cognitive flexibility.",
    tbiSequelae:
      "ECN inefficiency produces the post-TBI experience of starting tasks but losing the thread halfway through.",
    evidenceNote:
      "INCOG 2.0 (2023, 2025 ext.): structured goal-management training (GMT) yields durable gains in ECN-mediated function.",
    manuscriptLink: "/chapter-6",
    manuscriptLabel: "Chapter 6 — The Rollercoaster",
    protocolLink: "/mind",
    protocolLabel: "Goal Management Training",
    aiSeedPrompt: "I keep losing the thread mid-task. What's the pattern in my sessions?",
  },

  // ============ BRAINSTEM / CEREBELLUM ============
  {
    id: "vestibular",
    label: "Vestibular Nuclei",
    category: "brainstem",
    deep: true,
    position: [0.15, -0.7, -0.55],
    size: [0.09, 0.09, 0.09],
    color: "#10b981",
    function: "Balance, gaze stabilisation, spatial orientation.",
    tbiSequelae:
      "Vestibular dysfunction produces persistent dizziness, motion intolerance, and the 'walking on a boat' feeling.",
    evidenceNote:
      "2025 meta-analysis: vestibular rehabilitation therapy yields large effect sizes for post-concussion dizziness within 6 weeks.",
    manuscriptLink: "/chapter-8",
    manuscriptLabel: "Chapter 8 — Finding Ground",
    protocolLink: "/cold-exposure",
    protocolLabel: "Cold Exposure Reset",
    aiSeedPrompt: "Dizziness has been bad. What's helping in my recent sessions?",
  },
  {
    id: "cerebellum",
    label: "Cerebellum",
    category: "brainstem",
    position: [0.0, -0.85, -0.85],
    size: [0.18, 0.12, 0.16],
    color: "#34d399",
    function: "Motor coordination, timing, cognitive sequencing, prediction.",
    tbiSequelae:
      "Cerebellar damage produces clumsiness, dysmetria, and the lesser-known 'cognitive cerebellar syndrome' — slowed thought sequencing.",
    evidenceNote:
      "2024 review: rhythmic motor and cognitive timing tasks restore cerebellar prediction circuits in subacute TBI.",
    manuscriptLink: "/chapter-8",
    manuscriptLabel: "Chapter 8 — Finding Ground",
    protocolLink: "/mind",
    protocolLabel: "Rhythm & Timing Drills",
    aiSeedPrompt: "Coordination and timing — how am I tracking?",
  },
  {
    id: "brainstem",
    label: "Brainstem (Pons & Medulla)",
    shortLabel: "Brainstem",
    category: "brainstem",
    deep: true,
    position: [0.0, -0.95, -0.4],
    size: [0.1, 0.15, 0.1],
    color: "#14b8a6",
    function: "Arousal, autonomic regulation (heart rate, breathing), reticular activating system.",
    tbiSequelae:
      "Brainstem strain underlies persistent autonomic dysregulation, sleep–wake disruption, and the 'wired and tired' state.",
    evidenceNote:
      "2025 HRV biofeedback trials: 4 weeks of paced breathing improves brainstem-mediated parasympathetic tone in post-concussion patients.",
    manuscriptLink: "/chapter-7",
    manuscriptLabel: "Chapter 7 — Memory & Loss",
    protocolLink: "/breathing",
    protocolLabel: "HRV-Paced Breathing",
    aiSeedPrompt: "Wired and tired again. What does my HRV / mood pattern look like?",
  },
];

export const REGION_CATEGORIES: { id: RegionCategory; label: string; color: string }[] = [
  { id: "cortical", label: "Cortical", color: "#3b82f6" },
  { id: "subcortical", label: "Subcortical", color: "#ec4899" },
  { id: "network", label: "Networks", color: "#eab308" },
  { id: "brainstem", label: "Brainstem & Cerebellum", color: "#10b981" },
];
