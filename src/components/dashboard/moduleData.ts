import { Wind, Thermometer, Brain, Heart, Users, Target } from "lucide-react";
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
    icon: Wind,
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
    icon: Thermometer,
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
    title: "TBI Programs",
    subtitle: "Evidence-Based",
    description: "Access research-backed computer programs for traumatic brain injury rehabilitation, including Cogmed and RehaCom.",
    features: [
      "Cogmed QM Training",
      "RehaCom Cognitive",
      "VR Therapy Programs",
      "Clinical Evidence"
    ],
    icon: Brain,
    href: "/tbi-programs",
    buttonText: "Explore Programs",
    gradient: "bg-gradient-to-br from-indigo-950/90 via-blue-950/80 to-indigo-900/70 border border-indigo-500/30",
    iconGradient: "from-indigo-400 to-blue-500",
    textColor: "text-indigo-50",
    subtextColor: "text-indigo-200/80",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    badgeText: "Clinical-Grade",
    ambientSound: "computer"
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
    icon: Brain,
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
    icon: Heart,
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
    title: "INCOG 2.0",
    subtitle: "Evidence-Based Rehab",
    description: "Interactive cognitive rehabilitation aligned with international INCOG 2.0 guidelines and professional assessments.",
    features: [
      "Goal Management (GMT)",
      "Spaced Repetition",
      "Music & Rhythm",
      "ADL Errorless Learning"
    ],
    icon: Target,
    href: "/incog",
    buttonText: "Open Modules",
    gradient: "bg-gradient-to-br from-emerald-950/90 via-teal-950/80 to-green-950/70 border border-emerald-500/30",
    iconGradient: "from-emerald-400 to-teal-500",
    textColor: "text-emerald-50",
    subtextColor: "text-emerald-200/80",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    badgeText: "INCOG Aligned",
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
    icon: Users,
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
