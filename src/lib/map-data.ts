export type FrictionType =
  | 'rotate'
  | 'script'
  | 'isolate'
  | 'reduce'
  | 'exclude'
  | 'invisible'
  | 'displace';

export type QualityType =
  | 'transnational_flow'
  | 'household_choreography'
  | 'invisible_labor'
  | 'cultural_anchoring'
  | 'adaptive_resistance'
  | 'intergenerational_exchange'
  | 'digital_bridging'
  | 'belonging_negotiation';

export interface FrictionCategory {
  id: FrictionType;
  label: string;
  color: string;
  description: string;
}

export interface QualityCategory {
  id: QualityType;
  label: string;
  color: string;
  description: string;
}

export type SolutionStage = 'mapping' | 'ideation' | 'prototyping' | 'testing' | 'implementing';

export interface DesignResponse {
  id: string;
  title: string;
  description: string;
  stage: SolutionStage;
  frictions: FrictionType[];
  outcome: string | null;
  source_stories: string[];
}

export interface StoryNode {
  id: string;
  title: string;
  summary: string;
  friction: FrictionType;
  qualities: QualityType[];
  scale: 'micro' | 'meso' | 'macro';
  lng: number;
  lat: number;
  connections: string[];
}

export const FRICTIONS: FrictionCategory[] = [
  { id: 'rotate', label: 'Rotate', color: '#C45D3E', description: 'Staff turnover breaks relational continuity' },
  { id: 'script', label: 'Script', color: '#5B6AAF', description: 'Technologies embed assumptions that don\'t fit' },
  { id: 'isolate', label: 'Isolate', color: '#3A8A7D', description: 'Care plans sever people from support systems' },
  { id: 'reduce', label: 'Reduce', color: '#8B6914', description: 'Complex lives flattened to categories' },
  { id: 'exclude', label: 'Exclude', color: '#9B59B6', description: 'Barriers prevent access to services' },
  { id: 'invisible', label: 'Invisible', color: '#D4A017', description: 'Care work the system doesn\'t see' },
  { id: 'displace', label: 'Displace', color: '#D14343', description: 'Interventions make people feel less at home' },
];

export const QUALITIES: QualityCategory[] = [
  { id: 'transnational_flow', label: 'Transnational flow', color: '#5B6AAF', description: 'Care circulating across borders' },
  { id: 'household_choreography', label: 'Household choreography', color: '#C45D3E', description: 'Daily orchestration of multi-use spaces' },
  { id: 'invisible_labor', label: 'Invisible labor', color: '#8B6914', description: 'Unpaid care by relatives and community' },
  { id: 'cultural_anchoring', label: 'Cultural anchoring', color: '#3A8A7D', description: 'Practices sustaining identity' },
  { id: 'adaptive_resistance', label: 'Adaptive resistance', color: '#9B59B6', description: 'Quietly working around services' },
  { id: 'intergenerational_exchange', label: 'Intergenerational exchange', color: '#D4A017', description: 'Bidirectional care between old and young' },
  { id: 'digital_bridging', label: 'Digital bridging', color: '#2D6A4F', description: 'Technology maintaining connections' },
  { id: 'belonging_negotiation', label: 'Belonging negotiation', color: '#D14343', description: 'Tension between here and there' },
];

export const FRICTION_MAP: Record<FrictionType, FrictionCategory> =
  Object.fromEntries(FRICTIONS.map((f) => [f.id, f])) as Record<FrictionType, FrictionCategory>;

// Seed story nodes placed across Oslo (Alna / Søndre Nordstrand) and Skien
export const SEED_STORIES: StoryNode[] = [
  {
    id: 'story-1',
    title: 'The rotating helper',
    summary:
      'Fatima receives a different care worker every week. Each time she must explain her medications, her prayer schedule, and how she takes her tea. The system treats continuity as a luxury.',
    friction: 'rotate',
    qualities: ['cultural_anchoring', 'adaptive_resistance'],
    scale: 'micro',
    lng: 10.838,
    lat: 59.929,
    connections: ['story-2', 'story-5'],
  },
  {
    id: 'story-2',
    title: 'The tablet on the nightstand',
    summary:
      'A welfare technology tablet sits unused beside the bed. Its interface is only in Norwegian. The care plan says the patient is "non-compliant with digital tools."',
    friction: 'script',
    qualities: ['digital_bridging', 'adaptive_resistance'],
    scale: 'micro',
    lng: 10.847,
    lat: 59.924,
    connections: ['story-1', 'story-3'],
  },
  {
    id: 'story-3',
    title: 'The missing daughter',
    summary:
      'Amira\'s daughter calls from Amman every evening via WhatsApp. The care plan doesn\'t acknowledge this as part of the care ecosystem. The daughter\'s emotional labor is invisible.',
    friction: 'invisible',
    qualities: ['transnational_flow', 'invisible_labor', 'digital_bridging'],
    scale: 'meso',
    lng: 10.825,
    lat: 59.920,
    connections: ['story-2', 'story-4'],
  },
  {
    id: 'story-4',
    title: 'The kitchen as clinic',
    summary:
      'Hassan\'s family cooks traditional meals that manage his diabetes better than the hospital menu. But home care assessments count the kitchen as a fall risk, not a health resource.',
    friction: 'reduce',
    qualities: ['household_choreography', 'cultural_anchoring', 'intergenerational_exchange'],
    scale: 'micro',
    lng: 10.810,
    lat: 59.918,
    connections: ['story-3', 'story-6'],
  },
  {
    id: 'story-5',
    title: 'The waiting room barrier',
    summary:
      'At the district health center, all intake forms are digital and in Norwegian. An interpreter service exists but must be booked three days in advance. Many give up.',
    friction: 'exclude',
    qualities: ['belonging_negotiation', 'adaptive_resistance'],
    scale: 'meso',
    lng: 10.855,
    lat: 59.935,
    connections: ['story-1', 'story-7'],
  },
  {
    id: 'story-6',
    title: 'The grandson\'s burden',
    summary:
      'Sixteen-year-old Omar translates medical letters, books appointments, and explains insurance forms. His care labor is invisible to the system that relies on it.',
    friction: 'invisible',
    qualities: ['intergenerational_exchange', 'invisible_labor'],
    scale: 'meso',
    lng: 10.800,
    lat: 59.912,
    connections: ['story-4', 'story-8'],
  },
  {
    id: 'story-7',
    title: 'The policy ripple',
    summary:
      'Bo Trygt Hjemme promises personalized care at home. But when the district implements it, "personalized" means a standardized checklist translated into five languages.',
    friction: 'script',
    qualities: ['belonging_negotiation'],
    scale: 'macro',
    lng: 10.870,
    lat: 59.940,
    connections: ['story-5', 'story-9'],
  },
  {
    id: 'story-8',
    title: 'The prayer rug and the fall sensor',
    summary:
      'A motion sensor triggers an alarm every time Yusuf kneels to pray five times a day. After two weeks, he unplugs it. His file notes "patient removed safety equipment."',
    friction: 'displace',
    qualities: ['cultural_anchoring', 'adaptive_resistance'],
    scale: 'micro',
    lng: 10.790,
    lat: 59.905,
    connections: ['story-6'],
  },
  {
    id: 'story-9',
    title: 'The isolated caregiver',
    summary:
      'Khadija cares for her husband full-time. The respite care service requires him to travel to a center across the city. She hasn\'t had a day off in three years.',
    friction: 'isolate',
    qualities: ['invisible_labor', 'household_choreography'],
    scale: 'meso',
    lng: 10.815,
    lat: 59.945,
    connections: ['story-7', 'story-10'],
  },
  {
    id: 'story-10',
    title: 'The municipal boundary',
    summary:
      'When Aisha moved from Alna to Søndre Nordstrand, her care plan didn\'t follow. She spent four months without home visits while the new district "assessed her needs from scratch."',
    friction: 'exclude',
    qualities: ['belonging_negotiation'],
    scale: 'macro',
    lng: 10.830,
    lat: 59.850,
    connections: ['story-9', 'story-11'],
  },
  {
    id: 'story-11',
    title: 'The video call lifeline',
    summary:
      'Every Friday, three generations gather on a group video call spanning Oslo, Mogadishu, and Minneapolis. This is where family care decisions are actually made.',
    friction: 'invisible',
    qualities: ['transnational_flow', 'digital_bridging', 'intergenerational_exchange'],
    scale: 'meso',
    lng: 10.792,
    lat: 59.860,
    connections: ['story-10', 'story-12'],
  },
  {
    id: 'story-12',
    title: 'The Skien experiment',
    summary:
      'Skien municipality tries a new model: pairing immigrant elders with bilingual community health workers. It works — but there\'s no budget line for "cultural competence."',
    friction: 'reduce',
    qualities: ['cultural_anchoring', 'belonging_negotiation', 'adaptive_resistance'],
    scale: 'macro',
    lng: 9.612,
    lat: 59.210,
    connections: ['story-11', 'story-13'],
  },
  {
    id: 'story-13',
    title: 'The locked medicine cabinet',
    summary:
      'Mariam\'s pain medication is dispensed by a smart cabinet that unlocks at scheduled times. But her pain doesn\'t follow a schedule, and the override requires a phone call to a Norwegian-only helpline.',
    friction: 'script',
    qualities: ['adaptive_resistance', 'cultural_anchoring'],
    scale: 'micro',
    lng: 9.618,
    lat: 59.205,
    connections: ['story-12', 'story-14'],
  },
  {
    id: 'story-14',
    title: 'The son who stopped visiting',
    summary:
      'After his mother was assigned a GPS tracker she didn\'t understand, Ahmed felt the system had replaced him. He visits less now. The care plan calls this "improved independence."',
    friction: 'displace',
    qualities: ['intergenerational_exchange', 'belonging_negotiation'],
    scale: 'micro',
    lng: 10.820,
    lat: 59.933,
    connections: ['story-13', 'story-1'],
  },
  {
    id: 'story-15',
    title: 'The hallway consultation',
    summary:
      'Two home care workers meet in the stairwell between apartments. In three minutes they share more clinically useful information about Mrs. Osman than exists in her digital journal.',
    friction: 'invisible',
    qualities: ['invisible_labor', 'household_choreography'],
    scale: 'meso',
    lng: 10.842,
    lat: 59.916,
    connections: ['story-2', 'story-6'],
  },
  {
    id: 'story-16',
    title: 'The language of the body',
    summary:
      'Nurses document "patient is non-verbal." But Fatou communicates fluently through gestures, facial expressions, and sounds her family understands perfectly. The system only counts words.',
    friction: 'reduce',
    qualities: ['cultural_anchoring', 'intergenerational_exchange'],
    scale: 'micro',
    lng: 10.805,
    lat: 59.926,
    connections: ['story-4', 'story-15'],
  },
  {
    id: 'story-17',
    title: 'The remittance trade-off',
    summary:
      'Ibrahim sends money to his sister in Eritrea every month. This leaves too little for the dietary supplements the doctor prescribed. His care plan doesn\'t ask about financial obligations abroad.',
    friction: 'isolate',
    qualities: ['transnational_flow', 'invisible_labor'],
    scale: 'meso',
    lng: 10.860,
    lat: 59.922,
    connections: ['story-3', 'story-5'],
  },
  {
    id: 'story-18',
    title: 'The community fridge',
    summary:
      'A Somali women\'s group runs an informal meal delivery for homebound elders in Søndre Nordstrand. It operates outside every official channel. The municipality doesn\'t know it exists.',
    friction: 'invisible',
    qualities: ['household_choreography', 'cultural_anchoring', 'belonging_negotiation'],
    scale: 'meso',
    lng: 10.815,
    lat: 59.855,
    connections: ['story-10', 'story-11'],
  },
  {
    id: 'story-19',
    title: 'The double documentation',
    summary:
      'Care worker Lina spends 40 minutes with Mr. Khalil and 25 minutes documenting the visit in two separate systems. She writes what the system needs to hear, not what actually happened.',
    friction: 'script',
    qualities: ['invisible_labor', 'adaptive_resistance'],
    scale: 'meso',
    lng: 10.835,
    lat: 59.938,
    connections: ['story-7', 'story-14'],
  },
  {
    id: 'story-20',
    title: 'The balcony mosque',
    summary:
      'After mobility loss, Youssef can no longer reach the mosque. His balcony faces east. He prays there, and neighbors below complain about the rug dripping after washing. Home means negotiation.',
    friction: 'displace',
    qualities: ['cultural_anchoring', 'belonging_negotiation', 'adaptive_resistance'],
    scale: 'micro',
    lng: 10.795,
    lat: 59.870,
    connections: ['story-8', 'story-18'],
  },
  {
    id: 'story-21',
    title: 'The funding cliff',
    summary:
      'A successful pilot program matching bilingual volunteers with isolated elders loses funding after two years. The evaluation report said it "lacked scalable metrics." The elders lost their visitors.',
    friction: 'exclude',
    qualities: ['belonging_negotiation'],
    scale: 'macro',
    lng: 10.875,
    lat: 59.928,
    connections: ['story-7', 'story-12'],
  },
  {
    id: 'story-22',
    title: 'The night call',
    summary:
      'When Amina falls at 2 a.m., the emergency response system connects her to a stranger who speaks only Norwegian. Her daughter in London, six time zones away, is the one who calms her down over FaceTime.',
    friction: 'rotate',
    qualities: ['transnational_flow', 'digital_bridging', 'intergenerational_exchange'],
    scale: 'micro',
    lng: 10.850,
    lat: 59.910,
    connections: ['story-1', 'story-3'],
  },
  {
    id: 'story-23',
    title: 'The garden that heals',
    summary:
      'A small plot behind a Skien apartment block grows herbs from Pakistan, Somalia, and Syria. The residents tend it together. No care plan mentions it, but it\'s the most therapeutic space in the building.',
    friction: 'invisible',
    qualities: ['cultural_anchoring', 'household_choreography', 'belonging_negotiation'],
    scale: 'micro',
    lng: 9.605,
    lat: 59.215,
    connections: ['story-12', 'story-13'],
  },
  {
    id: 'story-24',
    title: 'The interpreter shortage',
    summary:
      'Oslo has 34 certified health interpreters for Tigrinya. There are over 4,000 Tigrinya-speaking residents over 65. Most medical consultations happen in broken Norwegian or through children.',
    friction: 'exclude',
    qualities: ['intergenerational_exchange', 'adaptive_resistance'],
    scale: 'macro',
    lng: 10.865,
    lat: 59.945,
    connections: ['story-5', 'story-21'],
  },
];

export const STORY_MAP: Record<string, StoryNode> =
  Object.fromEntries(SEED_STORIES.map((s) => [s.id, s])) as Record<string, StoryNode>;

export const QUALITY_MAP: Record<QualityType, QualityCategory> =
  Object.fromEntries(QUALITIES.map((q) => [q.id, q])) as Record<QualityType, QualityCategory>;

export const SOLUTION_STAGES: { id: SolutionStage; label: string; color: string }[] = [
  { id: 'mapping', label: 'Mapping', color: '#5B6AAF' },
  { id: 'ideation', label: 'Ideation', color: '#3A8A7D' },
  { id: 'prototyping', label: 'Prototyping', color: '#C45D3E' },
  { id: 'testing', label: 'Testing', color: '#8B6914' },
  { id: 'implementing', label: 'Implementing', color: '#2D6A4F' },
];

export const SEED_SOLUTIONS: DesignResponse[] = [
  {
    id: 'sol-1',
    title: 'Guest mode for security alarms',
    description:
      'Prototyping a configurable setting that adjusts motion sensor sensitivity during family visits, without compromising safety protocols.',
    stage: 'prototyping',
    frictions: ['script', 'displace'],
    outcome: null,
    source_stories: ['story-8', 'story-2'],
  },
  {
    id: 'sol-2',
    title: 'Extended dietary care profiles',
    description:
      'Co-designing care profiles with families that go beyond medical categories — capturing cultural food practices, preferred preparations, and family cooking schedules.',
    stage: 'ideation',
    frictions: ['reduce', 'rotate'],
    outcome: null,
    source_stories: ['story-4', 'story-16'],
  },
  {
    id: 'sol-3',
    title: 'Family care dashboard for transnational relatives',
    description:
      'A lightweight interface giving remote family members appropriate visibility into care plans and the ability to contribute observations.',
    stage: 'mapping',
    frictions: ['invisible', 'exclude'],
    outcome: null,
    source_stories: ['story-3', 'story-11'],
  },
  {
    id: 'sol-4',
    title: 'Multilingual emergency response protocol',
    description:
      'Developing a language-detection system for emergency call lines that routes callers to interpreters within 30 seconds, with pre-recorded reassurance in 12 languages.',
    stage: 'prototyping',
    frictions: ['exclude', 'rotate'],
    outcome: null,
    source_stories: ['story-22', 'story-24'],
  },
  {
    id: 'sol-5',
    title: 'Community care recognition toolkit',
    description:
      'A framework for municipalities to identify, acknowledge, and support informal care networks — like the Somali women\'s meal delivery — without bureaucratizing them.',
    stage: 'mapping',
    frictions: ['invisible', 'reduce'],
    outcome: null,
    source_stories: ['story-18', 'story-6'],
  },
  {
    id: 'sol-6',
    title: 'Continuity matching algorithm',
    description:
      'A scheduling tool that prioritizes relational continuity by matching care workers to households based on language, cultural familiarity, and visit history.',
    stage: 'ideation',
    frictions: ['rotate', 'isolate'],
    outcome: null,
    source_stories: ['story-1', 'story-9'],
  },
  {
    id: 'sol-7',
    title: 'Cross-district care passport',
    description:
      'A portable digital care record that follows the patient across municipal boundaries, eliminating the need to restart assessments when moving between districts.',
    stage: 'testing',
    frictions: ['exclude', 'script'],
    outcome: 'Pilot running in Alna and Søndre Nordstrand with 15 participants.',
    source_stories: ['story-10', 'story-5'],
  },
  {
    id: 'sol-8',
    title: 'Prayer-aware sensor scheduling',
    description:
      'Configurable time windows in motion sensors that account for regular prayer schedules, reducing false alarms while maintaining safety monitoring.',
    stage: 'testing',
    frictions: ['displace', 'script'],
    outcome: 'Technical prototype validated with three households.',
    source_stories: ['story-8', 'story-20'],
  },
];
