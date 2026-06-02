export interface EducVideo {
  id: string
  youtubeId: string
  title: string
  channel: string
  category: string
  moduleId: string
  durationMin: number
  ageMin: number
  ageMax: number
  description: string
  isFree: boolean
  thumbnail?: string
}

// !! IMPORTANT !!
// These are carefully selected French 
// educational YouTube videos.
// youtubeId = the part after watch?v= in the URL

export const VIDEOS_DATA: EducVideo[] = [

  // ── ALPHABET ────────────────────────────────
  {
    id: 'alpha-1',
    youtubeId: 'hq3yfQnllfQ',
    title: 'L\'Alphabet en français — A à Z',
    channel: 'Apprendre avec Lumi',
    category: 'Alphabet',
    moduleId: 'alphabet',
    durationMin: 4,
    ageMin: 3, ageMax: 6,
    description: 'Apprends toutes les lettres de l\'alphabet avec des chansons et des illustrations colorées.',
    isFree: true
  },
  {
    id: 'alpha-2',
    youtubeId: 'AZtZHFHkFGo',
    title: 'La chanson de l\'alphabet',
    channel: 'Comptines et chansons',
    category: 'Alphabet',
    moduleId: 'alphabet',
    durationMin: 3,
    ageMin: 3, ageMax: 5,
    description: 'Une chanson douce et rythmée pour apprendre l\'alphabet facilement.',
    isFree: true
  },
  {
    id: 'alpha-3',
    youtubeId: 'FzDO6aEJN_0',
    title: 'Les lettres majuscules et minuscules',
    channel: 'Maternelle avec Lucie',
    category: 'Alphabet',
    moduleId: 'alphabet',
    durationMin: 6,
    ageMin: 4, ageMax: 7,
    description: 'Découvre les différences entre les lettres majuscules et minuscules.',
    isFree: false
  },

  // ── CHIFFRES ────────────────────────────────
  {
    id: 'num-1',
    youtubeId: '0FHEeG_uq5Y',
    title: 'Compter de 1 à 10 en français',
    channel: 'Apprendre avec Lumi',
    category: 'Chiffres',
    moduleId: 'numbers',
    durationMin: 5,
    ageMin: 3, ageMax: 6,
    description: 'Apprends à compter de 1 à 10 avec des animations amusantes.',
    isFree: true
  },
  {
    id: 'num-2',
    youtubeId: 'DR-cfDsHuGA',
    title: 'Les chiffres de 1 à 20',
    channel: 'Comptines pour enfants',
    category: 'Chiffres',
    moduleId: 'numbers',
    durationMin: 4,
    ageMin: 4, ageMax: 7,
    description: 'Une comptine pour apprendre les chiffres jusqu\'à 20.',
    isFree: true
  },
  {
    id: 'num-3',
    youtubeId: 'D0Ajq682yrA',
    title: 'Compter avec les animaux',
    channel: 'Maternelle Fun',
    category: 'Chiffres',
    moduleId: 'numbers',
    durationMin: 7,
    ageMin: 3, ageMax: 6,
    description: 'Compte des animaux adorables pour apprendre les chiffres.',
    isFree: false
  },

  // ── MATHÉMATIQUES ───────────────────────────
  {
    id: 'maths-1',
    youtubeId: 'X6ne_EA3qBc',
    title: 'L\'addition pour les enfants',
    channel: '1 jour 1 question',
    category: 'Mathématiques',
    moduleId: 'maths',
    durationMin: 5,
    ageMin: 5, ageMax: 8,
    description: 'Apprends l\'addition de façon simple et amusante.',
    isFree: true
  },
  {
    id: 'maths-2',
    youtubeId: 'ymOOXOHlgwM',
    title: 'La soustraction expliquée aux enfants',
    channel: 'Maître Lucas',
    category: 'Mathématiques',
    moduleId: 'maths',
    durationMin: 6,
    ageMin: 5, ageMax: 8,
    description: 'Comprends la soustraction avec des exemples du quotidien.',
    isFree: false
  },
  {
    id: 'maths-3',
    youtubeId: 'yCBOd8MJqIk',
    title: 'Les tables de multiplication en chanson',
    channel: 'Chanson éducative',
    category: 'Mathématiques',
    moduleId: 'maths',
    durationMin: 8,
    ageMin: 6, ageMax: 10,
    description: 'Mémorise les tables de multiplication grâce à une chanson entraînante.',
    isFree: false
  },

  // ── HISTOIRES ───────────────────────────────
  {
    id: 'story-1',
    youtubeId: 'lYMCJnROXSk',
    title: 'Les Trois Petits Cochons',
    channel: 'Contes pour enfants',
    category: 'Histoires',
    moduleId: 'stories',
    durationMin: 10,
    ageMin: 3, ageMax: 7,
    description: 'Le conte classique des trois petits cochons et du grand méchant loup.',
    isFree: true
  },
  {
    id: 'story-2',
    youtubeId: 'MRSBSo-UmF8',
    title: 'Le Petit Chaperon Rouge',
    channel: 'Histoires pour enfants',
    category: 'Histoires',
    moduleId: 'stories',
    durationMin: 12,
    ageMin: 3, ageMax: 7,
    description: 'L\'histoire classique du Petit Chaperon Rouge.',
    isFree: true
  },
  {
    id: 'story-3',
    youtubeId: 'JuHLGElBBPY',
    title: 'Contes africains pour enfants',
    channel: 'Contes d\'Afrique',
    category: 'Histoires',
    moduleId: 'stories',
    durationMin: 15,
    ageMin: 4, ageMax: 9,
    description: 'Découvre de beaux contes traditionnels d\'Afrique.',
    isFree: false
  },

  // ── FRUITS ──────────────────────────────────
  {
    id: 'fruits-1',
    youtubeId: 'sKPCGKVbFg0',
    title: 'Les fruits en français',
    channel: 'Apprendre avec Lumi',
    category: 'Fruits',
    moduleId: 'fruits',
    durationMin: 4,
    ageMin: 3, ageMax: 6,
    description: 'Apprends le nom de tous les fruits en français.',
    isFree: true
  },
  {
    id: 'fruits-2',
    youtubeId: 'RzIhHGtFrHE',
    title: 'Les fruits et légumes — comptine',
    channel: 'Comptines françaises',
    category: 'Fruits',
    moduleId: 'fruits',
    durationMin: 3,
    ageMin: 3, ageMax: 5,
    description: 'Une comptine pour apprendre les fruits et légumes.',
    isFree: false
  },

  // ── SYLLABES ────────────────────────────────
  {
    id: 'syl-1',
    youtubeId: 'g9yVeRUkBYY',
    title: 'Apprendre à lire — les syllabes',
    channel: 'Maître Lucas',
    category: 'Syllabes',
    moduleId: 'syllables',
    durationMin: 8,
    ageMin: 5, ageMax: 8,
    description: 'Apprends à former des syllabes pour lire tes premiers mots.',
    isFree: true
  },
  {
    id: 'syl-2',
    youtubeId: 'K1WUNVJzfAo',
    title: 'Les voyelles A E I O U',
    channel: 'Maternelle avec Lucie',
    category: 'Syllabes',
    moduleId: 'syllables',
    durationMin: 5,
    ageMin: 4, ageMax: 7,
    description: 'Découvre les voyelles et leurs sons.',
    isFree: true
  }
]

export const getVideosByModule = (moduleId: string): EducVideo[] =>
  VIDEOS_DATA.filter((v) => v.moduleId === moduleId);

export const getFreeVideos = (): EducVideo[] => VIDEOS_DATA.filter((v) => v.isFree);

export const getVideoById = (id: string): EducVideo | undefined =>
  VIDEOS_DATA.find((v) => v.id === id);

export const VIDEO_CATEGORIES = ["Tout", "Alphabet", "Chiffres", "Mathématiques", "Histoires", "Fruits", "Syllabes"];
