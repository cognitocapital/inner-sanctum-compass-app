export interface SoundscapeTrack {
  id: string;
  title: string;
  description: string;
  category: "528hz" | "432hz" | "solfeggio" | "bowls" | "binaural";
  frequency?: string;
  audioUrl: string | null; // null = coming soon
  manuscriptTieIn: string;
  icon: string;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: "miracle-528",
    title: "Miracle Tone 528 Hz",
    description: "The 'Love frequency' — DNA repair and deep cellular healing",
    category: "528hz",
    frequency: "528 Hz",
    audioUrl: "/audio/soundscapes/528hz-miracle-tone.mp3",
    manuscriptTieIn: "This is the frequency I kept coming back to when my brain felt like static — it was the first thing that made the noise quiet down.",
    icon: "✨",
  },
  {
    id: "deep-healing-432",
    title: "Deep Healing 432 Hz",
    description: "Tuned to nature's frequency for profound relaxation",
    category: "432hz",
    frequency: "432 Hz",
    audioUrl: "/audio/soundscapes/432hz-deep-healing.mp3",
    manuscriptTieIn: "After Wendy's sessions, I'd sit with this kind of sound and let my nervous system remember what calm felt like.",
    icon: "🌿",
  },
  {
    id: "tibetan-bowl-bath",
    title: "Tibetan Bowl Sound Bath",
    description: "Authentic singing bowl recordings for meditative states",
    category: "bowls",
    audioUrl: "/audio/soundscapes/tibetan-bowl-bath.mp3",
    manuscriptTieIn: "The vibrations cut through the brain fog in a way words never could — like being tuned from the inside out.",
    icon: "🔔",
  },
  {
    id: "nervous-system-reset",
    title: "Nervous System Reset",
    description: "Singing bowls + soft synth layers for vagal tone activation",
    category: "bowls",
    audioUrl: "/audio/soundscapes/nervous-system-reset.mp3",
    manuscriptTieIn: "Wendy sessions felt like this — the moment your body finally unclenches and the world gets quiet.",
    icon: "🧠",
  },
  {
    id: "solfeggio-396",
    title: "Liberation 396 Hz",
    description: "Release guilt and fear — foundational Solfeggio frequency",
    category: "solfeggio",
    frequency: "396 Hz",
    audioUrl: "/audio/soundscapes/solfeggio-396.mp3",
    manuscriptTieIn: "Letting go of the guilt of not being who I was before — that was the hardest and most necessary work.",
    icon: "🕊️",
  },
  {
    id: "solfeggio-639",
    title: "Connection 639 Hz",
    description: "Harmonize relationships and enhance communication",
    category: "solfeggio",
    frequency: "639 Hz",
    audioUrl: "/audio/soundscapes/solfeggio-639.mp3",
    manuscriptTieIn: "Rebuilding connections after TBI meant learning to communicate all over again — finding the bridge back to people.",
    icon: "🤝",
  },
  {
    id: "crystal-bowls",
    title: "Crystal Bowl Meditation",
    description: "Pure crystal singing bowl tones for clarity and focus",
    category: "bowls",
    audioUrl: "/audio/soundscapes/crystal-bowls.mp3",
    manuscriptTieIn: "Clarity came in waves, never all at once — these tones mirror that rhythm perfectly.",
    icon: "💎",
  },
  {
    id: "sleep-528",
    title: "Deep Sleep 528 Hz",
    description: "Extended healing tone for restorative sleep cycles",
    category: "528hz",
    frequency: "528 Hz",
    audioUrl: "/audio/soundscapes/528hz-miracle-tone.mp3",
    manuscriptTieIn: "Sleep was the battlefield — nights of staring at the ceiling, wishing my brain had an off switch.",
    icon: "🌙",
  },
  {
    id: "binaural-focus",
    title: "Focus & Clarity Binaural",
    description: "Binaural beats designed for cognitive enhancement",
    category: "binaural",
    audioUrl: "/audio/soundscapes/binaural-focus.mp3",
    manuscriptTieIn: "The brain games helped, but the right background sound made concentration feel possible again.",
    icon: "🎯",
  },
  {
    id: "gong-bath",
    title: "Healing Gong Bath",
    description: "Deep resonant gong tones for full-body relaxation",
    category: "bowls",
    audioUrl: null,
    manuscriptTieIn: "Sometimes healing isn't gentle — it's the deep rumble that shakes loose what you've been holding.",
    icon: "🥁",
  },
  {
    id: "dna-repair-432",
    title: "DNA Repair 432 Hz",
    description: "Extended 432 Hz tone for cellular regeneration",
    category: "432hz",
    frequency: "432 Hz",
    audioUrl: "/audio/soundscapes/432hz-deep-healing.mp3",
    manuscriptTieIn: "Recovery happens at a level you can't see — cell by cell, synapse by synapse, rebuilding from the inside.",
    icon: "🧬",
  },
  {
    id: "solfeggio-852",
    title: "Awakening 852 Hz",
    description: "Return to spiritual order and inner awareness",
    category: "solfeggio",
    frequency: "852 Hz",
    audioUrl: "/audio/soundscapes/solfeggio-852.mp3",
    manuscriptTieIn: "Becoming the observer — Eckhart's teaching — this frequency is what that moment sounds like.",
    icon: "👁️",
  },
];

export const CATEGORIES = [
  { key: "all", label: "All Sounds", icon: "🎵" },
  { key: "528hz", label: "528 Hz", icon: "✨" },
  { key: "432hz", label: "432 Hz", icon: "🌿" },
  { key: "solfeggio", label: "Solfeggio", icon: "🔮" },
  { key: "bowls", label: "Singing Bowls", icon: "🔔" },
  { key: "binaural", label: "Binaural", icon: "🎯" },
] as const;

export const TIMER_OPTIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
  { label: "90 min", minutes: 90 },
  { label: "∞", minutes: 0 },
];
