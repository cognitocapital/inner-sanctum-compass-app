import type { ModuleCardProps } from "./ModuleCard";

export const MODULE_DATA: Omit<ModuleCardProps, "delay">[] = [
  {
    title: "Phoenix Breath",
    subtitle: "Neuroplasticity Training",
    description: "Rise from the ashes with guided breathing that rewires your brain, reduces anxiety, and accelerates cognitive recovery.",
    features: [
      "Box Breathing (4-4-4-4)",
      "Wim Hof Method",
      "HRV Training",
      "Stress Dissolution"
    ],
    iconVariant: "breath",
    href: "/breathing",
    buttonText: "Begin Breathing",
    gradient: "bg-gradient-to-br from-orange-950/90 via-red-950/80 to-orange-900/70 border border-orange-500/30",
    iconGradient: "from-orange-500 to-red-500",
    textColor: "text-orange-50",
    subtextColor: "text-orange-200/80",
    badgeColor: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    badgeText: "Neuroplasticity",
    ambientSound: "breath"
  },
  {
    title: "Ice Warrior Academy",
    subtitle: "Resilience Building",
    description: "Transform your mental fortitude through deliberate cold exposure, triggering beneficial stress responses for brain recovery.",
    features: [
      "Progressive Adaptation",
      "Ice Bath Protocols",
      "Cold Shower Challenges",
      "Mental Resilience"
    ],
    iconVariant: "ice",
    href: "/cold-exposure",
    buttonText: "Enter Academy",
    gradient: "bg-gradient-to-br from-slate-900/90 via-cyan-950/80 to-blue-950/70 border border-cyan-500/30",
    iconGradient: "from-cyan-400 to-blue-500",
    textColor: "text-cyan-50",
    subtextColor: "text-cyan-200/80",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    badgeText: "Resilience",
    ambientSound: "ice"
  },
  {
    title: "Phoenix Mind",
    subtitle: "Clinical Training",
    description: "Evidence-based cognitive training, assessments, and rehabilitation tools used in Brain Injury Units worldwide.",
    features: [
      "PHQ-9 & GAD-7",
      "Cognitive Rehab",
      "Progress Analytics",
      "Professional Tools"
    ],
    iconVariant: "mind",
    href: "/mind",
    buttonText: "Train Your Mind",
    gradient: "bg-gradient-to-br from-purple-950/90 via-fuchsia-950/80 to-red-950/70 border border-purple-500/30",
    iconGradient: "from-purple-500 to-red-500",
    textColor: "text-purple-50",
    subtextColor: "text-purple-200/80",
    badgeColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    badgeText: "Clinical-Grade",
    ambientSound: "mind"
  },
  {
    title: "Phoenix Heart",
    subtitle: "Emotional Healing",
    description: "Heal emotional wounds with trauma-informed practices, gratitude journaling, and evidence-based therapeutic techniques.",
    features: [
      "Gratitude Journaling",
      "Self-Compassion",
      "Trauma Processing",
      "Emotional Regulation"
    ],
    iconVariant: "heart",
    href: "/gratitude",
    buttonText: "Open Your Heart",
    gradient: "bg-gradient-to-br from-pink-950/90 via-rose-950/80 to-red-950/70 border border-pink-500/30",
    iconGradient: "from-pink-500 to-rose-500",
    textColor: "text-pink-50",
    subtextColor: "text-pink-200/80",
    badgeColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
    badgeText: "Trauma-Informed",
    ambientSound: "heart"
  },
  {
    title: "Neurotech Arsenal",
    subtitle: "INCOG 2.0 Clinical Suite",
    description: "Complete cognitive rehabilitation: VR Vestibular, Speech-Language, N-Back training, GMT, and professional programs.",
    features: [
      "VR Vestibular & Speech",
      "Dual N-Back & GMT",
      "Cogmed & RehaCom Links",
      "Clinician Reports"
    ],
    iconVariant: "incog",
    href: "/incog",
    buttonText: "Enter Arsenal",
    gradient: "bg-gradient-to-br from-blue-950/90 via-purple-950/80 to-indigo-950/70 border border-blue-500/30",
    iconGradient: "from-blue-400 to-purple-500",
    textColor: "text-blue-50",
    subtextColor: "text-blue-200/80",
    badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    badgeText: "Hospital-Grade",
    ambientSound: "incog"
  },
  {
    title: "Phoenix Circle",
    subtitle: "Peer Support",
    description: "Connect with fellow phoenix warriors on their recovery journey, share wisdom, and build lasting supportive relationships.",
    features: [
      "Share Your Story",
      "Peer Connections",
      "Weekly Circles",
      "Mentorship"
    ],
    iconVariant: "circle",
    href: "/unwritten",
    buttonText: "Join the Circle",
    gradient: "bg-gradient-to-br from-teal-950/90 via-blue-950/80 to-cyan-950/70 border border-teal-500/30",
    iconGradient: "from-teal-400 to-blue-500",
    textColor: "text-teal-50",
    subtextColor: "text-teal-200/80",
    badgeColor: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
    badgeText: "Community",
    ambientSound: "circle"
  }
];
