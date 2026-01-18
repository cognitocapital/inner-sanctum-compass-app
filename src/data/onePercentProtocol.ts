// The 1% Protocol: 16-Week Peak Performance Program
// Designed for high achievers looking to optimize through deliberate discomfort and flow states

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  duration: number;
  rounds?: number;
  performanceNote?: string;
}

export interface Challenge {
  type: 'cold' | 'cognitive' | 'physical' | 'flow' | 'contribution';
  name: string;
  description: string;
  duration: string;
  intensity: 'baseline' | 'progressive' | 'elite';
  performanceMetric?: string;
}

export interface OnePercentWeekData {
  week: number;
  phase: number;
  phaseName: string;
  theme: string;
  quote: string;
  insight: string;
  audioPath: string;
  practice: {
    breathing: BreathingPattern;
    challenge: Challenge;
    cognitiveTarget?: {
      exercise: string;
      level: number;
      duration: string;
    };
  };
  reflection: string;
  scienceNote: string;
  performancePrompt: string;
}

// Phase structure for 1% Protocol
export const ONE_PERCENT_PHASES = [
  { phase: 1, name: "Baseline", weeks: [1, 2, 3, 4], focus: "Establish foundations, assess capacity" },
  { phase: 2, name: "Optimization", weeks: [5, 6, 7, 8], focus: "Stack practices, build tolerance" },
  { phase: 3, name: "Flow States", weeks: [9, 10, 11, 12], focus: "Access flow, peak performance" },
  { phase: 4, name: "Elite", weeks: [13, 14, 15, 16], focus: "Integration, mastery, contribution" },
];

export const ONE_PERCENT_WEEKS: OnePercentWeekData[] = [
  // Phase 1: Baseline (Weeks 1-4)
  {
    week: 1,
    phase: 1,
    phaseName: "Baseline",
    theme: "Know Your Numbers",
    quote: "Elite performers don't guess—they measure.",
    insight: "This week establishes your baseline. Every metric you track becomes a lever for improvement.",
    audioPath: "/audio/chapter1.mp3",
    practice: {
      breathing: {
        name: "Box Breathing Baseline",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 10,
        performanceNote: "Track how long you can comfortably hold. This is your baseline."
      },
      challenge: {
        type: 'cold',
        name: "Cold Baseline",
        description: "1 minute cold shower. Full immersion. Time your heart rate recovery.",
        duration: "1 minute",
        intensity: 'baseline',
        performanceMetric: "Recovery time to normal heart rate"
      },
      cognitiveTarget: {
        exercise: "Dual N-Back",
        level: 2,
        duration: "10 minutes"
      }
    },
    reflection: "What's my current ceiling? Where's my next level?",
    scienceNote: "Baseline testing prevents overtraining and enables precise progressive overload.",
    performancePrompt: "Champions know where they stand before they start climbing."
  },
  {
    week: 2,
    phase: 1,
    phaseName: "Baseline",
    theme: "Breath as Performance Tool",
    quote: "Control your breath, control your state.",
    insight: "Your breathing pattern directly affects your nervous system. Master this, master yourself.",
    audioPath: "/audio/chapter2.mp3",
    practice: {
      breathing: {
        name: "Wim Hof Introduction",
        inhale: 2,
        hold: 0,
        exhale: 2,
        pause: 0,
        duration: 12,
        rounds: 3,
        performanceNote: "30 deep breaths, retention hold, recovery breath. Track hold time."
      },
      challenge: {
        type: 'cold',
        name: "Extended Cold",
        description: "90 seconds cold exposure. Notice your mind's response.",
        duration: "90 seconds",
        intensity: 'baseline'
      },
      cognitiveTarget: {
        exercise: "Dual N-Back",
        level: 2,
        duration: "12 minutes"
      }
    },
    reflection: "How does my breath affect my mental state? What patterns emerge under stress?",
    scienceNote: "Wim Hof breathing alkalizes the blood and voluntarily activates the sympathetic nervous system.",
    performancePrompt: "The breath is the remote control for your nervous system."
  },
  {
    week: 3,
    phase: 1,
    phaseName: "Baseline",
    theme: "Stress Inoculation",
    quote: "Comfort is the enemy of growth.",
    insight: "Deliberate stress exposure builds resilience. Small doses create antifragility.",
    audioPath: "/audio/chapter3.mp3",
    practice: {
      breathing: {
        name: "Physiological Sigh",
        inhale: 4,
        hold: 0,
        exhale: 8,
        pause: 0,
        duration: 8,
        performanceNote: "Double inhale through nose, long exhale through mouth. Fastest way to calm."
      },
      challenge: {
        type: 'cold',
        name: "Two Minute Challenge",
        description: "2 minutes cold. Sit with the uncomfortable. Don't escape it—embrace it.",
        duration: "2 minutes",
        intensity: 'progressive'
      },
      cognitiveTarget: {
        exercise: "Stroop Test",
        level: 3,
        duration: "15 minutes"
      }
    },
    reflection: "What discomfort am I avoiding that could make me stronger?",
    scienceNote: "Hormetic stress—short, controlled exposure—triggers adaptation and growth.",
    performancePrompt: "Seek discomfort. That's where the growth lives."
  },
  {
    week: 4,
    phase: 1,
    phaseName: "Baseline",
    theme: "Recovery as Strategy",
    quote: "Recovery isn't weakness—it's strategy.",
    insight: "Elite performers optimize recovery as seriously as they optimize training.",
    audioPath: "/audio/chapter4.mp3",
    practice: {
      breathing: {
        name: "4-7-8 Recovery",
        inhale: 4,
        hold: 7,
        exhale: 8,
        pause: 0,
        duration: 10,
        performanceNote: "Activates parasympathetic system. Use before sleep."
      },
      challenge: {
        type: 'physical',
        name: "Recovery Protocol",
        description: "Contrast therapy: 2 min cold, 1 min warm, repeat 3x. Track recovery metrics.",
        duration: "9 minutes",
        intensity: 'baseline',
        performanceMetric: "Subjective recovery score"
      }
    },
    reflection: "Am I optimizing recovery as much as effort? Where's the imbalance?",
    scienceNote: "Adaptation occurs during recovery, not during stress. More recovery = faster adaptation.",
    performancePrompt: "Work hard. Recover harder."
  },
  
  // Phase 2: Optimization (Weeks 5-8)
  {
    week: 5,
    phase: 2,
    phaseName: "Optimization",
    theme: "Stack the Practices",
    quote: "Compound interest works for habits too.",
    insight: "Now we layer practices. Breathing + cold + cognitive training creates multiplicative effects.",
    audioPath: "/audio/chapter5.mp3",
    practice: {
      breathing: {
        name: "Extended Box",
        inhale: 5,
        hold: 5,
        exhale: 5,
        pause: 5,
        duration: 15,
        performanceNote: "Increase from 4-count to 5-count. This is progressive overload for breath."
      },
      challenge: {
        type: 'cold',
        name: "Three Minute Mark",
        description: "3 minutes cold exposure. This is where adaptation accelerates.",
        duration: "3 minutes",
        intensity: 'progressive',
        performanceMetric: "Comfort level at 3 min"
      },
      cognitiveTarget: {
        exercise: "Dual N-Back",
        level: 3,
        duration: "15 minutes"
      }
    },
    reflection: "How are my practices compounding? What synergies am I noticing?",
    scienceNote: "Stacking hormetic stressors creates cross-adaptation—benefits in one area transfer to others.",
    performancePrompt: "Stack practices. Stack results."
  },
  {
    week: 6,
    phase: 2,
    phaseName: "Optimization",
    theme: "Focus Architecture",
    quote: "Where attention goes, energy flows.",
    insight: "Deep work requires architecture. Design your environment for focus.",
    audioPath: "/audio/chapter6.mp3",
    practice: {
      breathing: {
        name: "Focus Breath",
        inhale: 4,
        hold: 8,
        exhale: 4,
        pause: 0,
        duration: 10,
        performanceNote: "Extended hold increases CO2 tolerance and sharpens focus."
      },
      challenge: {
        type: 'flow',
        name: "Deep Work Block",
        description: "60-minute uninterrupted focus block. No phone, no notifications. Track output.",
        duration: "60 minutes",
        intensity: 'progressive',
        performanceMetric: "Work output volume"
      },
      cognitiveTarget: {
        exercise: "Task Switching",
        level: 3,
        duration: "10 minutes"
      }
    },
    reflection: "What's my focus architecture? What environment enables my best work?",
    scienceNote: "It takes 23 minutes to refocus after an interruption. Protect your focus time.",
    performancePrompt: "Design your environment. Willpower is overrated."
  },
  {
    week: 7,
    phase: 2,
    phaseName: "Optimization",
    theme: "Edge of Capacity",
    quote: "Growth happens at 4% beyond your comfort zone.",
    insight: "The challenge-skill sweet spot: 4% harder than comfortable. Not too easy, not too hard.",
    audioPath: "/audio/chapter7.mp3",
    practice: {
      breathing: {
        name: "Aggressive Wim Hof",
        inhale: 2,
        hold: 0,
        exhale: 2,
        pause: 0,
        duration: 15,
        rounds: 4,
        performanceNote: "Push retention hold times. Track improvement."
      },
      challenge: {
        type: 'cold',
        name: "Four Minute Protocol",
        description: "4 minutes cold. This is the adaptation threshold. Push it.",
        duration: "4 minutes",
        intensity: 'progressive'
      },
      cognitiveTarget: {
        exercise: "Dual N-Back",
        level: 4,
        duration: "15 minutes"
      }
    },
    reflection: "Where's my 4% edge? What's just beyond comfortable?",
    scienceNote: "The 4% challenge-skills balance is a key flow trigger identified by Steven Kotler.",
    performancePrompt: "Find your edge. Live there."
  },
  {
    week: 8,
    phase: 2,
    phaseName: "Optimization",
    theme: "Measure What Matters",
    quote: "You can't manage what you don't measure.",
    insight: "Mid-protocol assessment. Compare to Week 1 baseline. Celebrate progress.",
    audioPath: "/audio/chapter8.mp3",
    practice: {
      breathing: {
        name: "Coherence Breathing",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 0,
        duration: 20,
        performanceNote: "5-second rhythm maximizes HRV. Track with wearable if available."
      },
      challenge: {
        type: 'cognitive',
        name: "Progress Assessment",
        description: "Re-test all baseline metrics. Document improvements.",
        duration: "30 minutes",
        intensity: 'baseline',
        performanceMetric: "% improvement from Week 1"
      }
    },
    reflection: "What progress am I seeing? What needs adjustment?",
    scienceNote: "Tracking progress increases motivation and enables precise optimization.",
    performancePrompt: "Data drives decisions. Measure everything that matters."
  },
  
  // Phase 3: Flow States (Weeks 9-12)
  {
    week: 9,
    phase: 3,
    phaseName: "Flow States",
    theme: "Flow Triggers",
    quote: "Flow doesn't happen by accident. It's engineered.",
    insight: "Steven Kotler identified 22 flow triggers. This week, we activate the physical ones.",
    audioPath: "/audio/chapter9.mp3",
    practice: {
      breathing: {
        name: "Pre-Flow Breath",
        inhale: 3,
        hold: 0,
        exhale: 6,
        pause: 0,
        duration: 5,
        performanceNote: "Use before flow-inducing activities. Calms and primes."
      },
      challenge: {
        type: 'flow',
        name: "Physical Flow",
        description: "30 minutes of challenging physical activity with clear goals and immediate feedback.",
        duration: "30 minutes",
        intensity: 'elite',
        performanceMetric: "Flow state depth (1-10)"
      },
      cognitiveTarget: {
        exercise: "Dual N-Back",
        level: 4,
        duration: "20 minutes"
      }
    },
    reflection: "When does time disappear for me? What activities trigger flow?",
    scienceNote: "Flow increases productivity by 500% and learning speed by 250%.",
    performancePrompt: "Engineer flow. Don't wait for it."
  },
  {
    week: 10,
    phase: 3,
    phaseName: "Flow States",
    theme: "Ice Bath Mastery",
    quote: "The ice doesn't care about your excuses.",
    insight: "Ice bath graduation. 5+ minutes. This is where champions separate from everyone else.",
    audioPath: "/audio/chapter10.mp3",
    practice: {
      breathing: {
        name: "Ice Bath Prep",
        inhale: 2,
        hold: 0,
        exhale: 2,
        pause: 0,
        duration: 10,
        rounds: 3,
        performanceNote: "Wim Hof breathing immediately before ice bath. Maximum oxygenation."
      },
      challenge: {
        type: 'cold',
        name: "Five Minute Ice Bath",
        description: "5 minutes full immersion in ice water (50°F/10°C or below). No escape.",
        duration: "5 minutes",
        intensity: 'elite',
        performanceMetric: "Heart rate, subjective difficulty"
      }
    },
    reflection: "What mental patterns emerge in extreme discomfort? Can I observe without reacting?",
    scienceNote: "5 minutes cold exposure triggers significant norepinephrine release (2-3x baseline).",
    performancePrompt: "The ice is the teacher. Listen."
  },
  {
    week: 11,
    phase: 3,
    phaseName: "Flow States",
    theme: "Cognitive Peak",
    quote: "A sharp mind cuts through any obstacle.",
    insight: "This week: maximum cognitive training intensity. Push your mental limits.",
    audioPath: "/audio/chapter11.mp3",
    practice: {
      breathing: {
        name: "Alertness Breath",
        inhale: 4,
        hold: 4,
        exhale: 2,
        pause: 0,
        duration: 10,
        performanceNote: "Shorter exhale increases alertness. Use before cognitive challenges."
      },
      challenge: {
        type: 'cognitive',
        name: "Cognitive Marathon",
        description: "45 minutes of alternating cognitive exercises. No breaks. Push through.",
        duration: "45 minutes",
        intensity: 'elite',
        performanceMetric: "Accuracy under fatigue"
      },
      cognitiveTarget: {
        exercise: "Dual N-Back",
        level: 5,
        duration: "25 minutes"
      }
    },
    reflection: "How do I perform under cognitive load? Where does my mind crack?",
    scienceNote: "Cognitive training under fatigue creates robust neural pathways that perform in any condition.",
    performancePrompt: "The mind is a muscle. Train it like one."
  },
  {
    week: 12,
    phase: 3,
    phaseName: "Flow States",
    theme: "The Stack Complete",
    quote: "When everything works together, you become unstoppable.",
    insight: "Full stack day: breathing + cold + cognitive + flow work. Integration of all practices.",
    audioPath: "/audio/chapter12.mp3",
    practice: {
      breathing: {
        name: "Full Protocol",
        inhale: 4,
        hold: 8,
        exhale: 8,
        pause: 4,
        duration: 20,
        performanceNote: "Extended pattern. Only for those who've built tolerance."
      },
      challenge: {
        type: 'flow',
        name: "Integration Day",
        description: "Morning: Wim Hof + 5 min ice bath. Midday: 90 min deep work. Evening: Reflect.",
        duration: "Full day",
        intensity: 'elite',
        performanceMetric: "Total flow time"
      }
    },
    reflection: "How do all practices work together? What's my optimal stack?",
    scienceNote: "Integration creates systems that are greater than the sum of their parts.",
    performancePrompt: "The stack is complete. You are the system."
  },
  
  // Phase 4: Elite (Weeks 13-16)
  {
    week: 13,
    phase: 4,
    phaseName: "Elite",
    theme: "High Hard Goals",
    quote: "Impossible is a starting point, not a verdict.",
    insight: "Steven Kotler's High Hard Goals: 25 years out, with clear micro-milestones. What's yours?",
    audioPath: "/audio/chapter13.mp3",
    practice: {
      breathing: {
        name: "Vision Breath",
        inhale: 6,
        hold: 0,
        exhale: 6,
        pause: 3,
        duration: 15,
        performanceNote: "Use during goal visualization. Slow breathing opens creative thinking."
      },
      challenge: {
        type: 'flow',
        name: "High Hard Goal Setting",
        description: "Define one impossible goal. Break into 5-year, 1-year, 90-day, weekly milestones.",
        duration: "60 minutes",
        intensity: 'elite'
      }
    },
    reflection: "What impossible thing am I now pursuing? What would make me proud in 25 years?",
    scienceNote: "High Hard Goals trigger flow states by creating clear purpose and immediate feedback.",
    performancePrompt: "Set goals that scare you. Then reverse-engineer the path."
  },
  {
    week: 14,
    phase: 4,
    phaseName: "Elite",
    theme: "Extreme Protocol",
    quote: "Limits are illusions we believe until we shatter them.",
    insight: "Peak cold challenge. 7+ minutes. This is elite territory.",
    audioPath: "/audio/chapter15.mp3",
    practice: {
      breathing: {
        name: "Extreme Prep",
        inhale: 2,
        hold: 0,
        exhale: 2,
        pause: 0,
        duration: 15,
        rounds: 5,
        performanceNote: "Maximum hyperventilation before extreme cold. Safety first."
      },
      challenge: {
        type: 'cold',
        name: "Seven Minute Ice",
        description: "7+ minutes ice bath. This is elite territory. Prepare properly.",
        duration: "7+ minutes",
        intensity: 'elite',
        performanceMetric: "Mental state, recovery time"
      }
    },
    reflection: "What limits have I shattered? What limits remain?",
    scienceNote: "Extended cold exposure (5-10 min) creates lasting changes to brown fat and dopamine baseline.",
    performancePrompt: "You've done what most never will. Keep going."
  },
  {
    week: 15,
    phase: 4,
    phaseName: "Elite",
    theme: "Teach to Master",
    quote: "You don't fully understand until you can teach it.",
    insight: "Share what you've learned. Teaching deepens mastery and creates accountability.",
    audioPath: "/audio/chapter18.mp3",
    practice: {
      breathing: {
        name: "Presence Breath",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 0,
        duration: 10,
        performanceNote: "Use before teaching or presenting. Creates calm authority."
      },
      challenge: {
        type: 'contribution',
        name: "Teach Someone",
        description: "Teach one practice to someone else. Guide them through it. Share your journey.",
        duration: "Variable",
        intensity: 'elite'
      }
    },
    reflection: "What have I learned that others need to hear? How can I give back?",
    scienceNote: "Teaching activates different neural networks than practicing, deepening understanding.",
    performancePrompt: "Leaders create leaders. Share what you know."
  },
  {
    week: 16,
    phase: 4,
    phaseName: "Elite",
    theme: "The 1% Life",
    quote: "The 1% don't do different things—they do things differently.",
    insight: "Protocol complete. But this is just the beginning. Design your maintenance stack.",
    audioPath: "/audio/introduction.mp3",
    practice: {
      breathing: {
        name: "Complete Coherence",
        inhale: 5,
        hold: 5,
        exhale: 5,
        pause: 5,
        duration: 25,
        performanceNote: "Final practice. 25 minutes of complete coherence. You've earned this."
      },
      challenge: {
        type: 'flow',
        name: "Design Your System",
        description: "Create your daily/weekly practice schedule. What stays? What goes? Design your life.",
        duration: "60 minutes",
        intensity: 'elite'
      }
    },
    reflection: "Who have I become? What's the next impossible goal?",
    scienceNote: "Sustainable change requires systems, not willpower. Design systems that run automatically.",
    performancePrompt: "You're in the 1% now. What will you do with it?"
  }
];

export const getOnePercentWeekData = (weekNumber: number): OnePercentWeekData | undefined => {
  return ONE_PERCENT_WEEKS.find(w => w.week === weekNumber);
};

export const getOnePercentPhase = (weekNumber: number): typeof ONE_PERCENT_PHASES[0] | undefined => {
  return ONE_PERCENT_PHASES.find(phase => phase.weeks.includes(weekNumber));
};

export const getOnePercentTotalWeeks = (): number => {
  return ONE_PERCENT_WEEKS.length;
};
