// The Phoenix Protocol: 20-Week Transformation Journey
// Each week maps to a chapter from the manuscript with prescribed practices

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  duration: number; // minutes
}

export interface WeekData {
  week: number;
  chapter: string;
  theme: string;
  quote: string;
  audioPath: string;
  chapterPath: string;
  practice: {
    breathing: BreathingPattern;
    challenge: {
      type: 'cold' | 'cognitive' | 'physical' | 'mindfulness';
      name: string;
      description: string;
      duration: string;
    };
  };
  reflection: string;
}

export const PROTOCOL_WEEKS: WeekData[] = [
  {
    week: 1,
    chapter: "Australia Day",
    theme: "Awakening",
    quote: "In the chaos, a spark remained...",
    audioPath: "/audio/chapter1.mp3",
    chapterPath: "/chapter-1",
    practice: {
      breathing: {
        name: "4-4 Grounding",
        inhale: 4,
        hold: 0,
        exhale: 4,
        pause: 0,
        duration: 5
      },
      challenge: {
        type: 'cold',
        name: "First Cold Exposure",
        description: "End your shower with 30 seconds of cold water",
        duration: "30 seconds"
      }
    },
    reflection: "What moment changed everything for you?"
  },
  {
    week: 2,
    chapter: "Hospital Daze",
    theme: "Acceptance",
    quote: "Sometimes we must lie still to learn how to move again...",
    audioPath: "/audio/chapter2.mp3",
    chapterPath: "/chapter-2",
    practice: {
      breathing: {
        name: "Body Scan Breath",
        inhale: 4,
        hold: 2,
        exhale: 4,
        pause: 2,
        duration: 7
      },
      challenge: {
        type: 'cold',
        name: "Cold Adaptation",
        description: "45 seconds of cold water at shower end",
        duration: "45 seconds"
      }
    },
    reflection: "What fog am I sitting in right now?"
  },
  {
    week: 3,
    chapter: "The Gun to My Head",
    theme: "Confrontation",
    quote: "The overwhelming chaos that eventually gives way to peace...",
    audioPath: "/audio/chapter3.mp3",
    chapterPath: "/chapter-3",
    practice: {
      breathing: {
        name: "Sitting With Discomfort",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 8
      },
      challenge: {
        type: 'cold',
        name: "One Minute Mark",
        description: "60 seconds of deliberate cold exposure",
        duration: "60 seconds"
      }
    },
    reflection: "What am I afraid of facing?"
  },
  {
    week: 4,
    chapter: "Finding My Footing",
    theme: "Foundation",
    quote: "One step, then another. That's all recovery asks...",
    audioPath: "/audio/chapter4.mp3",
    chapterPath: "/chapter-4",
    practice: {
      breathing: {
        name: "4-7-8 Relaxation",
        inhale: 4,
        hold: 7,
        exhale: 8,
        pause: 0,
        duration: 8
      },
      challenge: {
        type: 'mindfulness',
        name: "Gratitude Foundation",
        description: "Write one thing you're grateful for each morning",
        duration: "5 minutes daily"
      }
    },
    reflection: "What one thing am I grateful for today?"
  },
  {
    week: 5,
    chapter: "Choose Your Own Adventure",
    theme: "Agency",
    quote: "Every choice is a doorway to who you're becoming...",
    audioPath: "/audio/chapter5.mp3",
    chapterPath: "/chapter-5",
    practice: {
      breathing: {
        name: "Box Breathing",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 10
      },
      challenge: {
        type: 'cold',
        name: "Extended Cold",
        description: "90 seconds of cold exposure",
        duration: "90 seconds"
      }
    },
    reflection: "What adventure am I choosing for my life?"
  },
  {
    week: 6,
    chapter: "The Roller Coaster",
    theme: "Emotional Awareness",
    quote: "Emotions are waves—we learn to surf, not fight...",
    audioPath: "/audio/chapter6.mp3",
    chapterPath: "/chapter-6",
    practice: {
      breathing: {
        name: "Wave Breath",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 0,
        duration: 10
      },
      challenge: {
        type: 'mindfulness',
        name: "Mood Tracking",
        description: "Notice and name your emotions 3 times today",
        duration: "Throughout day"
      }
    },
    reflection: "What emotions am I experiencing right now?"
  },
  {
    week: 7,
    chapter: "Mind Games",
    theme: "Cognitive Rebuilding",
    quote: "The mind is not fixed—it grows with every challenge...",
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
        name: "N-Back Introduction",
        description: "Complete 5 minutes of 1-Back training",
        duration: "5 minutes"
      }
    },
    reflection: "How has my thinking changed since I began?"
  },
  {
    week: 8,
    chapter: "Nourishing the Body",
    theme: "Physical Foundation",
    quote: "The body heals when we give it what it needs...",
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
        type: 'cold',
        name: "Two Minute Challenge",
        description: "2 minutes of cold exposure",
        duration: "2 minutes"
      }
    },
    reflection: "How am I nourishing my body and mind?"
  },
  {
    week: 9,
    chapter: "The Business Dilemma",
    theme: "Decision Making",
    quote: "Clarity comes not from certainty, but from acceptance...",
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
        name: "Decision Framework",
        description: "Apply a structured decision process to one choice",
        duration: "15 minutes"
      }
    },
    reflection: "What decision am I avoiding, and why?"
  },
  {
    week: 10,
    chapter: "A New Chapter",
    theme: "Transformation",
    quote: "Every ending is a beginning in disguise...",
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
        name: "Ice Bath Preparation",
        description: "3 minutes cold shower or first ice bath attempt",
        duration: "3 minutes"
      }
    },
    reflection: "What new chapter is beginning in my life?"
  },
  {
    week: 11,
    chapter: "The Inner Work",
    theme: "Self-Discovery",
    quote: "The answers we seek are already within us...",
    audioPath: "/audio/chapter11.mp3",
    chapterPath: "/chapter-11",
    practice: {
      breathing: {
        name: "Deep Journaling Breath",
        inhale: 6,
        hold: 0,
        exhale: 8,
        pause: 0,
        duration: 10
      },
      challenge: {
        type: 'mindfulness',
        name: "Extended Journaling",
        description: "15 minutes of freeform writing",
        duration: "15 minutes"
      }
    },
    reflection: "What truth about myself am I discovering?"
  },
  {
    week: 12,
    chapter: "Reclaiming Independence",
    theme: "Autonomy",
    quote: "Independence is not about doing it alone—it's about choosing your path...",
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
        name: "Capability Review",
        description: "Complete one activity you couldn't do before",
        duration: "Variable"
      }
    },
    reflection: "What independence have I reclaimed?"
  },
  {
    week: 13,
    chapter: "The Power of Gratitude",
    theme: "Appreciation",
    quote: "Gratitude turns what we have into enough...",
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
        description: "Write three things you're grateful for with detail",
        duration: "10 minutes"
      }
    },
    reflection: "What unexpected blessings has this journey brought?"
  },
  {
    week: 14,
    chapter: "The Universe's Message",
    theme: "Meaning",
    quote: "When we listen, life speaks clearly...",
    audioPath: "/audio/chapter15.mp3",
    chapterPath: "/chapter-14",
    practice: {
      breathing: {
        name: "Mindfulness Meditation",
        inhale: 5,
        hold: 0,
        exhale: 5,
        pause: 3,
        duration: 15
      },
      challenge: {
        type: 'mindfulness',
        name: "Silent Sitting",
        description: "10 minutes of meditation without guidance",
        duration: "10 minutes"
      }
    },
    reflection: "What message is life trying to send me?"
  },
  {
    week: 15,
    chapter: "Still Standing",
    theme: "Resilience",
    quote: "We don't know how strong we are until being strong is the only choice...",
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
        name: "Peak Cold Challenge",
        description: "4+ minutes cold exposure",
        duration: "4+ minutes"
      }
    },
    reflection: "What proof do I have that I am stronger than I thought?"
  },
  {
    week: 16,
    chapter: "Looking Forward",
    theme: "Vision",
    quote: "The future is written by those who dare to imagine it...",
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
        name: "Vision Journaling",
        description: "Write a letter to yourself one year from now",
        duration: "15 minutes"
      }
    },
    reflection: "Who am I becoming through this transformation?"
  },
  {
    week: 17,
    chapter: "The Torch Rekindled",
    theme: "Peak Challenge",
    quote: "From the ashes, we rise brighter than before...",
    audioPath: "/audio/chapter18.mp3",
    chapterPath: "/chapter-17",
    practice: {
      breathing: {
        name: "Wim Hof Breathing",
        inhale: 2,
        hold: 0,
        exhale: 2,
        pause: 0,
        duration: 15
      },
      challenge: {
        type: 'cold',
        name: "Wim Hof Protocol",
        description: "Breathing + 5 minute cold exposure",
        duration: "20 minutes total"
      }
    },
    reflection: "What flame within me refuses to be extinguished?"
  },
  {
    week: 18,
    chapter: "Unwritten Chapters",
    theme: "Integration",
    quote: "The best stories are the ones we're still writing...",
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
        description: "Review all practices and identify your essentials",
        duration: "20 minutes"
      }
    },
    reflection: "Which practices have become essential to who I am?"
  },
  {
    week: 19,
    chapter: "A New Resource",
    theme: "Contribution",
    quote: "Our scars become our gifts to others...",
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
        description: "Write your transformation story to share with others",
        duration: "30 minutes"
      }
    },
    reflection: "How can my journey help someone else?"
  },
  {
    week: 20,
    chapter: "The Next Page",
    theme: "Mastery",
    quote: "The protocol ends. The phoenix continues to rise...",
    audioPath: "/audio/introduction.mp3",
    chapterPath: "/chapter-20",
    practice: {
      breathing: {
        name: "Personal Protocol",
        inhale: 4,
        hold: 4,
        exhale: 4,
        pause: 4,
        duration: 15
      },
      challenge: {
        type: 'mindfulness',
        name: "Create Your Protocol",
        description: "Design your personal daily practice for life",
        duration: "30 minutes"
      }
    },
    reflection: "What is the next page of my story?"
  }
];

export const getWeekData = (weekNumber: number): WeekData | undefined => {
  return PROTOCOL_WEEKS.find(w => w.week === weekNumber);
};

export const getTotalWeeks = (): number => {
  return PROTOCOL_WEEKS.length;
};