// Phoenix Rising Protocol: 20-Week TBI Recovery Journey
// Designed for Traumatic Brain Injury survivors with gentle pacing and self-compassion

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  duration: number;
  safetyNote?: string;
}

export interface Challenge {
  type: 'cold' | 'cognitive' | 'physical' | 'mindfulness' | 'rest';
  name: string;
  description: string;
  duration: string;
  intensity: 'gentle' | 'moderate' | 'progressive';
  safetyNote?: string;
}

export interface PhoenixWeekData {
  week: number;
  phase: number;
  phaseName: string;
  chapter: string;
  theme: string;
  quote: string;
  manuscriptExcerpt: string;
  audioPath: string;
  chapterPath: string;
  practice: {
    breathing: BreathingPattern;
    challenge: Challenge;
  };
  reflection: string;
  scienceNote: string;
  selfCompassionPrompt: string;
}

// Phase structure for Phoenix Rising
export const PHOENIX_PHASES = [
  { phase: 1, name: "Survival", weeks: [1, 2, 3, 4, 5], focus: "Basic self-care, grounding, acceptance" },
  { phase: 2, name: "Foundations", weeks: [6, 7, 8, 9, 10], focus: "Emotional regulation, cognitive rebuilding, nourishment" },
  { phase: 3, name: "Integration", weeks: [11, 12, 13, 14, 15], focus: "Inner work, independence, gratitude, meaning" },
  { phase: 4, name: "Mastery", weeks: [16, 17, 18, 19, 20], focus: "Flow states, purpose, contribution, legacy" },
];

export const PHOENIX_RISING_WEEKS: PhoenixWeekData[] = [
  // Phase 1: Survival (Weeks 1-5)
  {
    week: 1,
    phase: 1,
    phaseName: "Survival",
    chapter: "Australia Day",
    theme: "Awakening",
    quote: "I had no idea that this would be my last moment of bliss before my world turned upside down.",
    manuscriptExcerpt: "What a journey. My life, my world, everything I knew changed in an instant...",
    audioPath: "/audio/chapter1.mp3",
    chapterPath: "/chapter-1",
    practice: {
      breathing: {
        name: "4-4 Grounding",
        inhale: 4,
        hold: 0,
        exhale: 4,
        pause: 0,
        duration: 5,
        safetyNote: "If you feel dizzy, return to normal breathing. This is gentle and safe."
      },
      challenge: {
        type: 'cold',
        name: "Gentle Cool Water",
        description: "End your shower with 30 seconds of cool (not cold) water. Focus on sensory awareness.",
        duration: "30 seconds",
        intensity: 'gentle',
        safetyNote: "Skip if you have temperature sensitivity issues. Listen to your body."
      }
    },
    reflection: "What moment changed everything for you? Take your time to remember.",
    scienceNote: "The brain's neuroplasticity begins immediately after injury. Even small actions help rewire neural pathways.",
    selfCompassionPrompt: "It's okay to rest. Recovery is not a race."
  },
  {
    week: 2,
    phase: 1,
    phaseName: "Survival",
    chapter: "Hospital Daze",
    theme: "Acceptance",
    quote: "The fog was thick, but I was still in there, somewhere.",
    manuscriptExcerpt: "Waking up and wondering where I am has become my new normal...",
    audioPath: "/audio/chapter2.mp3",
    chapterPath: "/chapter-2",
    practice: {
      breathing: {
        name: "Body Scan Breath",
        inhale: 4,
        hold: 2,
        exhale: 4,
        pause: 2,
        duration: 7,
        safetyNote: "If concentration is difficult, just focus on breathing naturally."
      },
      challenge: {
        type: 'rest',
        name: "Intentional Rest",
        description: "Take three 10-minute rest breaks today. No phone, no stimulation.",
        duration: "3 × 10 minutes",
        intensity: 'gentle',
        safetyNote: "Rest is productive. Your brain heals during downtime."
      }
    },
    reflection: "What fog am I sitting in right now? Can I accept it without fighting?",
    scienceNote: "Post-traumatic amnesia is common. The brain protects itself by limiting processing.",
    selfCompassionPrompt: "Confusion is not weakness—it's your brain healing."
  },
  {
    week: 3,
    phase: 1,
    phaseName: "Survival",
    chapter: "The Gun to My Head",
    theme: "Confrontation",
    quote: "The overwhelming chaos that eventually gives way to peace...",
    manuscriptExcerpt: "A gun to the head, metaphorically speaking—the overwhelming pressure of everything at once...",
    audioPath: "/audio/chapter3.mp3",
    chapterPath: "/chapter-3",
    practice: {
      breathing: {
        name: "Sitting With Discomfort",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 8,
        safetyNote: "If the hold feels too long, reduce to 2 seconds."
      },
      challenge: {
        type: 'cold',
        name: "One Minute Mark",
        description: "60 seconds of cool water exposure. Notice your body's response.",
        duration: "60 seconds",
        intensity: 'moderate',
        safetyNote: "This is about awareness, not endurance. Stop if uncomfortable."
      }
    },
    reflection: "What am I afraid of facing? Can I look at it for just one moment?",
    scienceNote: "Controlled stress exposure builds resilience. Small doses strengthen the nervous system.",
    selfCompassionPrompt: "Facing fear takes courage. You're doing it."
  },
  {
    week: 4,
    phase: 1,
    phaseName: "Survival",
    chapter: "Finding My Footing",
    theme: "Foundation",
    quote: "One step, then another. That's all recovery asks.",
    manuscriptExcerpt: "Walking was the first thing I focused on. One foot in front of the other...",
    audioPath: "/audio/chapter4.mp3",
    chapterPath: "/chapter-4",
    practice: {
      breathing: {
        name: "4-7-8 Relaxation",
        inhale: 4,
        hold: 7,
        exhale: 8,
        pause: 0,
        duration: 8,
        safetyNote: "This is a calming pattern. Perfect before sleep."
      },
      challenge: {
        type: 'physical',
        name: "Daily Walk",
        description: "Take a 10-minute walk. Focus on each step, not the destination.",
        duration: "10 minutes",
        intensity: 'gentle',
        safetyNote: "Start with 5 minutes if 10 feels like too much."
      }
    },
    reflection: "What one thing am I grateful for today? Write it down.",
    scienceNote: "Walking stimulates neurogenesis—the creation of new brain cells.",
    selfCompassionPrompt: "Every step forward counts, no matter how small."
  },
  {
    week: 5,
    phase: 1,
    phaseName: "Survival",
    chapter: "Choose Your Own Adventure",
    theme: "Agency",
    quote: "I chose my own adventure after my traumatic brain injury.",
    manuscriptExcerpt: "Dr. Joe Dispenza's work showed me that our brains can reprogram themselves...",
    audioPath: "/audio/chapter5.mp3",
    chapterPath: "/chapter-5",
    practice: {
      breathing: {
        name: "Box Breathing",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 10,
        safetyNote: "Used by Navy SEALs for focus. Gentle yet powerful."
      },
      challenge: {
        type: 'cold',
        name: "Extended Cool Exposure",
        description: "90 seconds of cool water. You're building tolerance.",
        duration: "90 seconds",
        intensity: 'moderate'
      }
    },
    reflection: "What adventure am I choosing for my life? What's one small choice I can make today?",
    scienceNote: "Neuroplasticity means your brain can form new neural pathways at any age.",
    selfCompassionPrompt: "Choosing your path is brave. Trust your instincts."
  },
  
  // Phase 2: Foundations (Weeks 6-10)
  {
    week: 6,
    phase: 2,
    phaseName: "Foundations",
    chapter: "The Roller Coaster",
    theme: "Emotional Awareness",
    quote: "Emotions are waves—we learn to surf, not fight.",
    manuscriptExcerpt: "The emotional roller coaster was real. One moment fine, the next completely overwhelmed...",
    audioPath: "/audio/chapter6.mp3",
    chapterPath: "/chapter-6",
    practice: {
      breathing: {
        name: "Wave Breath",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 0,
        duration: 10,
        safetyNote: "Let your breath flow like waves. No force needed."
      },
      challenge: {
        type: 'mindfulness',
        name: "Mood Tracking",
        description: "Notice and name your emotions 3 times today. No judgment, just awareness.",
        duration: "Throughout day",
        intensity: 'gentle'
      }
    },
    reflection: "What emotions am I experiencing right now? Can I name them without judging?",
    scienceNote: "Emotional dysregulation after TBI is normal. Awareness is the first step to regulation.",
    selfCompassionPrompt: "All emotions are valid. They're messengers, not enemies."
  },
  {
    week: 7,
    phase: 2,
    phaseName: "Foundations",
    chapter: "Mind Games",
    theme: "Cognitive Rebuilding",
    quote: "The mind is not fixed—it grows with every challenge.",
    manuscriptExcerpt: "Concentration became my biggest challenge. Simple tasks felt impossible...",
    audioPath: "/audio/chapter7.mp3",
    chapterPath: "/chapter-7",
    practice: {
      breathing: {
        name: "Focus Breath",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 0,
        duration: 8
      },
      challenge: {
        type: 'cognitive',
        name: "Gentle N-Back",
        description: "5 minutes of 1-Back training. This is brain exercise—not a test.",
        duration: "5 minutes",
        intensity: 'gentle',
        safetyNote: "If you feel mental fatigue, stop. Rest is part of training."
      }
    },
    reflection: "How has my thinking changed since I began? What small improvements have I noticed?",
    scienceNote: "Cognitive training creates new neural connections. Consistency matters more than intensity.",
    selfCompassionPrompt: "Mental fog is temporary. Your brain is rebuilding."
  },
  {
    week: 8,
    phase: 2,
    phaseName: "Foundations",
    chapter: "Nourishing the Body",
    theme: "Physical Foundation",
    quote: "The body heals when we give it what it needs.",
    manuscriptExcerpt: "My taste was distorted. Everything tasted like cardboard with a chemical aftertaste...",
    audioPath: "/audio/chapter8.mp3",
    chapterPath: "/chapter-8",
    practice: {
      breathing: {
        name: "Energizing Breath",
        inhale: 3,
        hold: 0,
        exhale: 3,
        pause: 0,
        duration: 5
      },
      challenge: {
        type: 'physical',
        name: "Nourishment Focus",
        description: "Today, eat one meal mindfully. Notice colors, textures, tastes.",
        duration: "One meal",
        intensity: 'gentle'
      }
    },
    reflection: "How am I nourishing my body and mind? What does my body need right now?",
    scienceNote: "Nutrition directly impacts brain recovery. Omega-3s and antioxidants support healing.",
    selfCompassionPrompt: "Feeding yourself well is an act of self-love."
  },
  {
    week: 9,
    phase: 2,
    phaseName: "Foundations",
    chapter: "The Business Dilemma",
    theme: "Decision Making",
    quote: "Clarity comes not from certainty, but from acceptance.",
    manuscriptExcerpt: "My business had to change. Making decisions with a foggy brain was terrifying...",
    audioPath: "/audio/chapter9.mp3",
    chapterPath: "/chapter-9",
    practice: {
      breathing: {
        name: "Clarity Breath",
        inhale: 5,
        hold: 5,
        exhale: 5,
        pause: 0,
        duration: 10
      },
      challenge: {
        type: 'cognitive',
        name: "One Decision",
        description: "Make one small decision today using a simple pros/cons list.",
        duration: "15 minutes",
        intensity: 'moderate'
      }
    },
    reflection: "What decision am I avoiding, and why? What's the smallest step I could take?",
    scienceNote: "Decision fatigue is real after TBI. Limiting choices reduces cognitive load.",
    selfCompassionPrompt: "You don't have to have all the answers right now."
  },
  {
    week: 10,
    phase: 2,
    phaseName: "Foundations",
    chapter: "A New Chapter",
    theme: "Transformation",
    quote: "Every ending is a beginning in disguise.",
    manuscriptExcerpt: "Post-concussion syndrome diagnosis changed everything. Finally, an explanation...",
    audioPath: "/audio/chapter10.mp3",
    chapterPath: "/chapter-10",
    practice: {
      breathing: {
        name: "Advanced Box",
        inhale: 5,
        hold: 5,
        exhale: 5,
        pause: 5,
        duration: 12
      },
      challenge: {
        type: 'cold',
        name: "Cold Progression",
        description: "2 minutes cold water. Feel the transformation.",
        duration: "2 minutes",
        intensity: 'progressive'
      }
    },
    reflection: "What new chapter is beginning in my life? What story am I ready to write?",
    scienceNote: "Cold exposure releases norepinephrine, improving mood and focus.",
    selfCompassionPrompt: "Transformation takes time. You're exactly where you need to be."
  },
  
  // Phase 3: Integration (Weeks 11-15)
  {
    week: 11,
    phase: 3,
    phaseName: "Integration",
    chapter: "The Inner Work",
    theme: "Self-Discovery",
    quote: "The observer, the silent witness—the part of me that can watch without getting swept away.",
    manuscriptExcerpt: "Eckhart Tolle's words resonated deeply. The concept of 'the observer' changed how I saw my thoughts...",
    audioPath: "/audio/chapter11.mp3",
    chapterPath: "/chapter-11",
    practice: {
      breathing: {
        name: "Observer Breath",
        inhale: 6,
        hold: 0,
        exhale: 8,
        pause: 0,
        duration: 10
      },
      challenge: {
        type: 'mindfulness',
        name: "Extended Journaling",
        description: "15 minutes of freeform writing. Let thoughts flow without editing.",
        duration: "15 minutes",
        intensity: 'moderate'
      }
    },
    reflection: "What truth about myself am I discovering? Who is the observer behind my thoughts?",
    scienceNote: "Mindfulness physically changes brain structure, increasing gray matter in areas related to self-awareness.",
    selfCompassionPrompt: "You are not your thoughts. You are the awareness behind them."
  },
  {
    week: 12,
    phase: 3,
    phaseName: "Integration",
    chapter: "Reclaiming Independence",
    theme: "Autonomy",
    quote: "Independence is not about doing it alone—it's about choosing your path.",
    manuscriptExcerpt: "Driving again felt like reclaiming a piece of myself that I thought I'd lost...",
    audioPath: "/audio/chapter12.mp3",
    chapterPath: "/chapter-12",
    practice: {
      breathing: {
        name: "Power Breath",
        inhale: 4,
        hold: 7,
        exhale: 8,
        pause: 0,
        duration: 10
      },
      challenge: {
        type: 'physical',
        name: "Capability Celebration",
        description: "Do one thing today you couldn't do a month ago. Celebrate it.",
        duration: "Variable",
        intensity: 'progressive'
      }
    },
    reflection: "What independence have I reclaimed? What's still waiting for me?",
    scienceNote: "Regaining abilities builds confidence and creates positive neural associations.",
    selfCompassionPrompt: "Every reclaimed ability is a victory worth celebrating."
  },
  {
    week: 13,
    phase: 3,
    phaseName: "Integration",
    chapter: "The Power of Gratitude",
    theme: "Appreciation",
    quote: "Gratitude turns what we have into enough.",
    manuscriptExcerpt: "Bailey's report card reminded me of what really matters. The small moments are everything...",
    audioPath: "/audio/chapter13.mp3",
    chapterPath: "/chapter-13",
    practice: {
      breathing: {
        name: "Heart-Opening Breath",
        inhale: 4,
        hold: 4,
        exhale: 6,
        pause: 2,
        duration: 10
      },
      challenge: {
        type: 'mindfulness',
        name: "Gratitude Expansion",
        description: "Write three things you're grateful for with rich detail. Why do they matter?",
        duration: "10 minutes",
        intensity: 'gentle'
      }
    },
    reflection: "What unexpected blessings has this journey brought? What gifts came from struggle?",
    scienceNote: "Gratitude practice physically rewires the brain toward positive thinking patterns.",
    selfCompassionPrompt: "Even in darkness, there are stars. Can you see them?"
  },
  {
    week: 14,
    phase: 3,
    phaseName: "Integration",
    chapter: "The Universe's Message",
    theme: "Meaning",
    quote: "When we listen, life speaks clearly.",
    manuscriptExcerpt: "Wendy the Bowen therapist saw something I couldn't see—a wake-up call...",
    audioPath: "/audio/chapter15.mp3",
    chapterPath: "/chapter-14",
    practice: {
      breathing: {
        name: "Listening Breath",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 3,
        duration: 15
      },
      challenge: {
        type: 'mindfulness',
        name: "Silent Sitting",
        description: "10 minutes of meditation without guidance. Just be present.",
        duration: "10 minutes",
        intensity: 'moderate'
      }
    },
    reflection: "What message is life trying to send me? What am I being called toward?",
    scienceNote: "Meditation increases connectivity between brain regions, improving insight and intuition.",
    selfCompassionPrompt: "Sometimes the message is simply: slow down and listen."
  },
  {
    week: 15,
    phase: 3,
    phaseName: "Integration",
    chapter: "Still Standing",
    theme: "Resilience",
    quote: "We don't know how strong we are until being strong is the only choice.",
    manuscriptExcerpt: "Scrambled eggs days—when nothing works and everything is hard. Self-compassion became essential...",
    audioPath: "/audio/chapter16.mp3",
    chapterPath: "/chapter-15",
    practice: {
      breathing: {
        name: "Resilience Breath",
        inhale: 4,
        hold: 8,
        exhale: 8,
        pause: 0,
        duration: 12
      },
      challenge: {
        type: 'cold',
        name: "Resilience Cold",
        description: "3+ minutes cold exposure. You've come so far.",
        duration: "3+ minutes",
        intensity: 'progressive'
      }
    },
    reflection: "What proof do I have that I am stronger than I thought?",
    scienceNote: "Resilience is built through repeated recovery from stress, not avoidance of it.",
    selfCompassionPrompt: "On scrambled eggs days, rest is the bravest choice."
  },
  
  // Phase 4: Mastery (Weeks 16-20)
  {
    week: 16,
    phase: 4,
    phaseName: "Mastery",
    chapter: "Looking Forward",
    theme: "Vision",
    quote: "The future is written by those who dare to imagine it.",
    manuscriptExcerpt: "The Companion app, the BIRU program—new tools for a new chapter...",
    audioPath: "/audio/chapter17.mp3",
    chapterPath: "/chapter-16",
    practice: {
      breathing: {
        name: "Vision Breath",
        inhale: 5,
        hold: 5,
        exhale: 5,
        pause: 5,
        duration: 12
      },
      challenge: {
        type: 'mindfulness',
        name: "Future Letter",
        description: "Write a letter to yourself one year from now. What do you want to tell them?",
        duration: "15 minutes",
        intensity: 'moderate'
      }
    },
    reflection: "Who am I becoming through this transformation? What vision calls to me?",
    scienceNote: "Visualization activates the same brain regions as actual experience, preparing neural pathways.",
    selfCompassionPrompt: "Your future self is grateful for the work you're doing today."
  },
  {
    week: 17,
    phase: 4,
    phaseName: "Mastery",
    chapter: "The Torch Rekindled",
    theme: "Flow States",
    quote: "Flow states, where time melts and focus sharpens, helped me push through the fog.",
    manuscriptExcerpt: "Steven Kotler's work on flow states opened new doors. The Art of the Impossible became my guide...",
    audioPath: "/audio/chapter18.mp3",
    chapterPath: "/chapter-17",
    practice: {
      breathing: {
        name: "Wim Hof Adapted",
        inhale: 2,
        hold: 0,
        exhale: 2,
        pause: 0,
        duration: 15,
        safetyNote: "30 deep breaths, then hold on exhale. Stop if dizzy."
      },
      challenge: {
        type: 'cold',
        name: "Flow Cold Protocol",
        description: "Breathing + 4 minute cold exposure. Find your flow state.",
        duration: "20 minutes total",
        intensity: 'progressive'
      }
    },
    reflection: "What flame within me refuses to be extinguished? When do I feel most alive?",
    scienceNote: "Flow states increase neuroplasticity and accelerate learning by 400-500%.",
    selfCompassionPrompt: "You were made for more than survival. You were made to thrive."
  },
  {
    week: 18,
    phase: 4,
    phaseName: "Mastery",
    chapter: "Unwritten Chapters",
    theme: "Possibility",
    quote: "The best stories are the ones we're still writing.",
    manuscriptExcerpt: "Embracing uncertainty became my superpower. The unwritten chapters are the most exciting...",
    audioPath: "/audio/chapter19.mp3",
    chapterPath: "/chapter-18",
    practice: {
      breathing: {
        name: "Integration Breath",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 15
      },
      challenge: {
        type: 'mindfulness',
        name: "Practice Review",
        description: "Review all 17 weeks. Which practices are now essential to who you are?",
        duration: "20 minutes",
        intensity: 'moderate'
      }
    },
    reflection: "Which practices have become essential to who I am? What has changed?",
    scienceNote: "Integration solidifies new neural pathways, making changes permanent.",
    selfCompassionPrompt: "The journey continues. Every ending is a new beginning."
  },
  {
    week: 19,
    phase: 4,
    phaseName: "Mastery",
    chapter: "A New Resource",
    theme: "Contribution",
    quote: "Our scars become our gifts to others.",
    manuscriptExcerpt: "Daniel Amen's book reinforced everything I'd learned. Now I wanted to share it...",
    audioPath: "/audio/prologue.mp3",
    chapterPath: "/chapter-19",
    practice: {
      breathing: {
        name: "Heart Coherence",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 0,
        duration: 10
      },
      challenge: {
        type: 'mindfulness',
        name: "Share Your Story",
        description: "Share one thing you've learned with someone who might benefit.",
        duration: "Variable",
        intensity: 'moderate'
      }
    },
    reflection: "How can my journey help others? What wisdom do I now carry?",
    scienceNote: "Helping others activates reward centers in the brain and reinforces positive neural pathways.",
    selfCompassionPrompt: "Your story matters. Someone needs to hear it."
  },
  {
    week: 20,
    phase: 4,
    phaseName: "Mastery",
    chapter: "The Next Page",
    theme: "Legacy",
    quote: "What a journey. And it's only beginning.",
    manuscriptExcerpt: "Building from pieces, building a new life. The Companion app, this protocol—my gift forward...",
    audioPath: "/audio/introduction.mp3",
    chapterPath: "/chapter-20",
    practice: {
      breathing: {
        name: "Complete Breath",
        inhale: 5,
        hold: 5,
        exhale: 5,
        pause: 5,
        duration: 20
      },
      challenge: {
        type: 'mindfulness',
        name: "Protocol Completion",
        description: "Create your personal maintenance practice. What will you carry forward?",
        duration: "30 minutes",
        intensity: 'moderate'
      }
    },
    reflection: "What legacy am I creating? What story will I tell?",
    scienceNote: "Completing a structured program creates lasting behavioral change.",
    selfCompassionPrompt: "You've come so far. Be proud of every step."
  }
];

export const getPhoenixWeekData = (weekNumber: number): PhoenixWeekData | undefined => {
  return PHOENIX_RISING_WEEKS.find(w => w.week === weekNumber);
};

export const getPhoenixPhase = (weekNumber: number): typeof PHOENIX_PHASES[0] | undefined => {
  return PHOENIX_PHASES.find(phase => phase.weeks.includes(weekNumber));
};

export const getPhoenixTotalWeeks = (): number => {
  return PHOENIX_RISING_WEEKS.length;
};
