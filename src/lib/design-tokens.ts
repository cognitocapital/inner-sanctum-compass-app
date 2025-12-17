// Phoenix Design System Tokens
// Centralized design constants for unified aesthetic

export const colors = {
  // Base palette (HSL values matching index.css)
  base: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    mutedForeground: "215 20.2% 65.1%",
  },
  
  // Phoenix accent colors
  phoenix: {
    primary: "24.6 95% 53.1%", // Orange flame
    ember: "14 90% 45%", // Deep ember
    glow: "35 100% 60%", // Golden glow
    ash: "220 15% 25%", // Cool ash
  },
  
  // Module-specific accents
  modules: {
    breath: "24.6 95% 53.1%", // Orange - warmth, life
    ice: "195 85% 50%", // Cyan - cold, clarity
    mind: "270 70% 55%", // Purple - cognition
    heart: "340 75% 55%", // Rose - emotion
    arsenal: "210 80% 55%", // Blue - precision
    circle: "45 90% 55%", // Amber - community
  },
  
  // Semantic colors
  semantic: {
    success: "142.1 76.2% 36.3%",
    warning: "47.9 95.8% 53.1%",
    error: "0 84.2% 60.2%",
    info: "217.2 91.2% 59.8%",
  },
} as const;

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem",  // 8px
  md: "0.75rem", // 12px
  lg: "1rem",    // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
} as const;

export const typography = {
  sizes: {
    xs: "0.75rem",   // 12px
    sm: "0.875rem",  // 14px
    base: "1rem",    // 16px
    lg: "1.125rem",  // 18px
    xl: "1.25rem",   // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

export const animation = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

export const borderRadius = {
  none: "0",
  sm: "0.5rem",   // 8px
  md: "0.75rem",  // 12px
  lg: "1rem",     // 16px
  xl: "1.5rem",   // 24px
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  glow: {
    orange: "0 0 40px hsl(24.6 95% 53.1% / 0.3)",
    cyan: "0 0 40px hsl(195 85% 50% / 0.3)",
    purple: "0 0 40px hsl(270 70% 55% / 0.3)",
    rose: "0 0 40px hsl(340 75% 55% / 0.3)",
    blue: "0 0 40px hsl(210 80% 55% / 0.3)",
  },
} as const;

export const glass = {
  light: "bg-white/5 backdrop-blur-sm border-white/10",
  medium: "bg-white/10 backdrop-blur-md border-white/15",
  strong: "bg-white/15 backdrop-blur-lg border-white/20",
} as const;

// Module configuration
export const moduleConfig = {
  breath: {
    name: "Phoenix Breath",
    accent: colors.modules.breath,
    icon: "Wind",
    glowClass: "shadow-[0_0_40px_hsl(24.6_95%_53.1%/0.3)]",
  },
  ice: {
    name: "Ice Warrior",
    accent: colors.modules.ice,
    icon: "Snowflake",
    glowClass: "shadow-[0_0_40px_hsl(195_85%_50%/0.3)]",
  },
  mind: {
    name: "Phoenix Mind",
    accent: colors.modules.mind,
    icon: "Brain",
    glowClass: "shadow-[0_0_40px_hsl(270_70%_55%/0.3)]",
  },
  heart: {
    name: "Phoenix Heart",
    accent: colors.modules.heart,
    icon: "Heart",
    glowClass: "shadow-[0_0_40px_hsl(340_75%_55%/0.3)]",
  },
  arsenal: {
    name: "Neurotech Arsenal",
    accent: colors.modules.arsenal,
    icon: "Cpu",
    glowClass: "shadow-[0_0_40px_hsl(210_80%_55%/0.3)]",
  },
  circle: {
    name: "Phoenix Circle",
    accent: colors.modules.circle,
    icon: "Users",
    glowClass: "shadow-[0_0_40px_hsl(45_90%_55%/0.3)]",
  },
} as const;

export type ModuleKey = keyof typeof moduleConfig;
