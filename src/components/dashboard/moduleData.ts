import type { ModuleCardProps } from "./ModuleCard";

export const MODULE_DATA: Omit<ModuleCardProps, "delay">[] = [
  {
    title: "Phoenix Breath",
    subtitle: "Breathwork",
    description: "Guided breathing that rewires your brain and reduces anxiety through HRV training.",
    features: [
      "4 Core Patterns",
      "HRV Biofeedback",
      "Manuscript Prompts"
    ],
    iconVariant: "breath",
    href: "/breathing",
    buttonText: "Begin Breathing",
    gradient: "bg-gradient-to-br from-orange-950/90 via-red-950/80 to-orange-900/70 border border-orange-500/30",
    iconGradient: "from-orange-500 to-red-500",
    textColor: "text-orange-50",
    subtextColor: "text-orange-200/80",
    badgeColor: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    badgeText: "INCOG Level A",
    ambientSound: "breath"
  },
  {
    title: "Frost Forge",
    subtitle: "Cold Exposure",
    description: "Build mental resilience through deliberate cold exposure with guided phases.",
    features: [
      "Phase-Based Timer",
      "Progress Tracking",
      "Mood Feedback"
    ],
    iconVariant: "ice",
    href: "/cold-exposure",
    buttonText: "Enter Forge",
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
    subtitle: "N-Back Training",
    description: "Evidence-based cognitive training to strengthen working memory and attention.",
    features: [
      "Dual N-Back Game",
      "Difficulty Levels",
      "Score Tracking"
    ],
    iconVariant: "mind",
    href: "/mind",
    buttonText: "Train Mind",
    gradient: "bg-gradient-to-br from-purple-950/90 via-fuchsia-950/80 to-red-950/70 border border-purple-500/30",
    iconGradient: "from-purple-500 to-red-500",
    textColor: "text-purple-50",
    subtextColor: "text-purple-200/80",
    badgeColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    badgeText: "INCOG Level A",
    ambientSound: "mind"
  },
  {
    title: "Phoenix Heart",
    subtitle: "Gratitude Journal",
    description: "Cultivate emotional healing through daily gratitude practice and heart garden.",
    features: [
      "Visual Heart Garden",
      "Mood Tracking",
      "Streak Building"
    ],
    iconVariant: "heart",
    href: "/gratitude",
    buttonText: "Open Heart",
    gradient: "bg-gradient-to-br from-pink-950/90 via-rose-950/80 to-red-950/70 border border-pink-500/30",
    iconGradient: "from-pink-500 to-rose-500",
    textColor: "text-pink-50",
    subtextColor: "text-pink-200/80",
    badgeColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
    badgeText: "INCOG Level B",
    ambientSound: "heart"
  },
  {
    title: "Neurotech Arsenal",
    subtitle: "Goal Management",
    description: "INCOG 2.0 Goal Management Training: Plan → Do → Check → Review for executive function.",
    features: [
      "GMT Dashboard",
      "Step-by-Step Goals",
      "Phase Tracking"
    ],
    iconVariant: "incog",
    href: "/incog",
    buttonText: "Enter Arsenal",
    gradient: "bg-gradient-to-br from-blue-950/90 via-purple-950/80 to-indigo-950/70 border border-blue-500/30",
    iconGradient: "from-blue-400 to-purple-500",
    textColor: "text-blue-50",
    subtextColor: "text-blue-200/80",
    badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    badgeText: "INCOG Level A",
    ambientSound: "incog"
  },
  {
    title: "Phoenix Circle",
    subtitle: "Peer Support",
    description: "Share your journey and connect with fellow phoenix warriors through stories.",
    features: [
      "Story Sharing",
      "Community Feed",
      "Support Reactions"
    ],
    iconVariant: "circle",
    href: "/unwritten",
    buttonText: "Join Circle",
    gradient: "bg-gradient-to-br from-teal-950/90 via-blue-950/80 to-cyan-950/70 border border-teal-500/30",
    iconGradient: "from-teal-400 to-blue-500",
    textColor: "text-teal-50",
    subtextColor: "text-teal-200/80",
    badgeColor: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
    badgeText: "INCOG Level A",
    ambientSound: "circle"
  }
];
