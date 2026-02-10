// Resource Directory: Curated TBI support resources
// Inspired by Synapse.org.au's practical approach

export interface DirectoryResource {
  name: string;
  category: 'organization' | 'telehealth' | 'support_group' | 'financial' | 'app' | 'toolkit';
  description: string;
  url: string;
  region: 'australia' | 'international' | 'global';
  tags: string[];
  isVerified: boolean;
}

export const DIRECTORY_RESOURCES: DirectoryResource[] = [
  // Australian Organizations
  {
    name: "Synapse",
    category: "organization",
    description: "Australia's leading brain injury organisation. Information, eLearning, support services, and pathways to independence.",
    url: "https://synapse.org.au",
    region: "australia",
    tags: ["brain injury", "support", "education", "advocacy"],
    isVerified: true,
  },
  {
    name: "Brain Injury Australia",
    category: "organization",
    description: "National peak body representing the needs and interests of people with acquired brain injury.",
    url: "https://www.braininjuryaustralia.org.au",
    region: "australia",
    tags: ["brain injury", "advocacy", "policy", "awareness"],
    isVerified: true,
  },
  {
    name: "Headway ABI",
    category: "organization",
    description: "Community-based services for people with acquired brain injury in Victoria.",
    url: "https://www.headway.org.au",
    region: "australia",
    tags: ["brain injury", "community", "victoria"],
    isVerified: true,
  },
  {
    name: "Brain Injury SA",
    category: "organization",
    description: "South Australian organisation providing support, advocacy, and community for brain injury survivors.",
    url: "https://braininjurysa.org.au",
    region: "australia",
    tags: ["brain injury", "south australia", "community"],
    isVerified: true,
  },

  // International Organizations
  {
    name: "BrainLine",
    category: "organization",
    description: "US-based national multimedia project offering information and resources on TBI prevention, treatment, and living with TBI.",
    url: "https://www.brainline.org",
    region: "international",
    tags: ["brain injury", "resources", "multimedia", "research"],
    isVerified: true,
  },
  {
    name: "International Brain Injury Association (IBIA)",
    category: "organization",
    description: "Global organisation promoting research, treatment, and education in brain injury.",
    url: "https://www.internationalbrain.org",
    region: "international",
    tags: ["brain injury", "research", "global", "education"],
    isVerified: true,
  },
  {
    name: "Headway UK",
    category: "organization",
    description: "UK charity providing support and information to brain injury survivors and families.",
    url: "https://www.headway.org.uk",
    region: "international",
    tags: ["brain injury", "UK", "charity", "support"],
    isVerified: true,
  },
  {
    name: "Brain Injury Canada",
    category: "organization",
    description: "National voice for Canadians affected by acquired brain injury.",
    url: "https://www.braininjurycanada.ca",
    region: "international",
    tags: ["brain injury", "canada", "advocacy"],
    isVerified: true,
  },

  // Telehealth
  {
    name: "TeleTBI Clinic",
    category: "telehealth",
    description: "Specialized telehealth consultations with neuropsychologists and TBI specialists.",
    url: "https://www.teletbi.com",
    region: "global",
    tags: ["telehealth", "neuropsychology", "consultation"],
    isVerified: false,
  },
  {
    name: "Beyond Blue",
    category: "telehealth",
    description: "Mental health support including phone and online counselling. Relevant for TBI-related anxiety and depression.",
    url: "https://www.beyondblue.org.au",
    region: "australia",
    tags: ["mental health", "counselling", "anxiety", "depression"],
    isVerified: true,
  },
  {
    name: "Lifeline Australia",
    category: "telehealth",
    description: "24/7 crisis support and suicide prevention. Call 13 11 14 anytime.",
    url: "https://www.lifeline.org.au",
    region: "australia",
    tags: ["crisis", "mental health", "24/7", "support"],
    isVerified: true,
  },

  // Support Groups
  {
    name: "Synapse Reconnections",
    category: "support_group",
    description: "Peer support groups for brain injury survivors. Online and in-person options across Australia.",
    url: "https://synapse.org.au/support-services/reconnections/",
    region: "australia",
    tags: ["peer support", "brain injury", "community", "groups"],
    isVerified: true,
  },
  {
    name: "TBI Survivors Network",
    category: "support_group",
    description: "Online community forum for traumatic brain injury survivors worldwide.",
    url: "https://www.tbisurvivor.com",
    region: "global",
    tags: ["online community", "forum", "peer support"],
    isVerified: false,
  },
  {
    name: "Reddit r/TBI",
    category: "support_group",
    description: "Active online community for TBI survivors sharing experiences, tips, and support.",
    url: "https://www.reddit.com/r/TBI/",
    region: "global",
    tags: ["online community", "forum", "peer support", "discussion"],
    isVerified: true,
  },

  // Financial
  {
    name: "NDIS (National Disability Insurance Scheme)",
    category: "financial",
    description: "Australian government scheme providing support for people with disability, including acquired brain injury.",
    url: "https://www.ndis.gov.au",
    region: "australia",
    tags: ["funding", "disability", "government", "support"],
    isVerified: true,
  },
  {
    name: "Centrelink Disability Support Pension",
    category: "financial",
    description: "Financial support for Australians unable to work due to permanent medical conditions including TBI.",
    url: "https://www.servicesaustralia.gov.au/disability-support-pension",
    region: "australia",
    tags: ["pension", "financial support", "government"],
    isVerified: true,
  },

  // Apps
  {
    name: "Lumosity",
    category: "app",
    description: "Brain training app with games designed to improve memory, attention, and processing speed.",
    url: "https://www.lumosity.com",
    region: "global",
    tags: ["brain training", "cognitive", "memory", "app"],
    isVerified: true,
  },
  {
    name: "Calm",
    category: "app",
    description: "Meditation and relaxation app with guided sessions ideal for TBI-related stress and sleep issues.",
    url: "https://www.calm.com",
    region: "global",
    tags: ["meditation", "sleep", "relaxation", "mindfulness"],
    isVerified: true,
  },
  {
    name: "Constant Therapy",
    category: "app",
    description: "Evidence-based speech, language, and cognitive therapy app designed by neuroscientists.",
    url: "https://constanttherapy.com",
    region: "global",
    tags: ["speech therapy", "cognitive therapy", "evidence-based"],
    isVerified: true,
  },
  {
    name: "BrainHQ",
    category: "app",
    description: "Clinically proven brain training exercises designed by neuroscientists.",
    url: "https://www.brainhq.com",
    region: "global",
    tags: ["brain training", "cognitive", "evidence-based", "neuroscience"],
    isVerified: true,
  },

  // Toolkits
  {
    name: "Synapse Practical Fact Sheets",
    category: "toolkit",
    description: "Free downloadable fact sheets on managing brain injury in daily life, including memory, fatigue, and emotions.",
    url: "https://synapse.org.au/fact-sheets/",
    region: "australia",
    tags: ["fact sheets", "practical", "daily living", "free"],
    isVerified: true,
  },
  {
    name: "Model Systems Knowledge Translation Center",
    category: "toolkit",
    description: "Evidence-based factsheets and videos on TBI recovery topics from leading US rehabilitation centres.",
    url: "https://msktc.org/tbi/factsheets",
    region: "international",
    tags: ["evidence-based", "factsheets", "rehabilitation", "research"],
    isVerified: true,
  },
  {
    name: "Concussion Legacy Foundation",
    category: "toolkit",
    description: "Resources for understanding concussion and CTE, including recovery guides and prevention information.",
    url: "https://concussionfoundation.org",
    region: "international",
    tags: ["concussion", "CTE", "prevention", "recovery guide"],
    isVerified: true,
  },
  {
    name: "Wim Hof Method",
    category: "toolkit",
    description: "Cold exposure and breathing techniques used in recovery. Scientific evidence for nervous system benefits.",
    url: "https://www.wimhofmethod.com",
    region: "global",
    tags: ["cold exposure", "breathing", "nervous system", "resilience"],
    isVerified: true,
  },
];

export const DIRECTORY_CATEGORIES = [
  { key: 'organization', label: 'Organisations', icon: '🏢' },
  { key: 'telehealth', label: 'Telehealth', icon: '📱' },
  { key: 'support_group', label: 'Support Groups', icon: '🤝' },
  { key: 'financial', label: 'Financial Aid', icon: '💰' },
  { key: 'app', label: 'Apps & Tools', icon: '📲' },
  { key: 'toolkit', label: 'Toolkits & Guides', icon: '🧰' },
] as const;

export const DIRECTORY_REGIONS = [
  { key: 'all', label: 'All Regions' },
  { key: 'australia', label: 'Australia' },
  { key: 'international', label: 'International' },
  { key: 'global', label: 'Global' },
] as const;
