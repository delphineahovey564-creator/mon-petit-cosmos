export interface EducVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  channelVerified?: boolean;
  category: string;
  moduleId: string;
  durationMin: number;
  ageMin: number;
  ageMax: number;
  description: string;
  isFree: boolean;
  lang?: string;
  thumbnail?: string;
}

// Verified French educational YouTube videos. Primary channel: Monde des Titounis.
export const VIDEOS_DATA: EducVideo[] = [
  // ── ALPHABET ──────────────────────────────────────────
  { id: "alpha-1", youtubeId: "bDjHQq8e5fY", title: "Apprendre l'alphabet en français", channel: "Monde des Titounis", channelVerified: true, category: "Alphabet", moduleId: "alphabet", durationMin: 4, ageMin: 3, ageMax: 6, description: "Apprends toutes les lettres A à Z avec les Titounis en 3D !", isFree: true, lang: "fr" },
  { id: "alpha-2", youtubeId: "_fVReZx6ZxQ", title: "Comptines de l'Alphabet — ABCD", channel: "Monde des Titounis", channelVerified: true, category: "Alphabet", moduleId: "alphabet", durationMin: 3, ageMin: 3, ageMax: 5, description: "La chanson de l'alphabet facile pour apprendre les lettres !", isFree: true, lang: "fr" },
  { id: "alpha-3", youtubeId: "imX-MJsZ_z0", title: "L'Alphabet des Animaux", channel: "Monde des Titounis", channelVerified: true, category: "Alphabet", moduleId: "alphabet", durationMin: 5, ageMin: 3, ageMax: 6, description: "Apprends l'alphabet avec les animaux de la savane !", isFree: false, lang: "fr" },
  { id: "alpha-4", youtubeId: "FSEVdi1rQ-w", title: "L'Alphabet en chanson — Les Pirates", channel: "Monde des Titounis", channelVerified: true, category: "Alphabet", moduleId: "alphabet", durationMin: 4, ageMin: 4, ageMax: 7, description: "Apprends l'alphabet avec les pirates et les super-héros !", isFree: false, lang: "fr" },
  { id: "alpha-5", youtubeId: "GVzXC7M6r_U", title: "L'Alphabet — 95 mots de vocabulaire", channel: "Tidoon", channelVerified: true, category: "Alphabet", moduleId: "alphabet", durationMin: 8, ageMin: 4, ageMax: 8, description: "Apprends l'alphabet avec 95 nouveaux mots illustrés.", isFree: false, lang: "fr" },

  // ── CHIFFRES ──────────────────────────────────────────
  { id: "num-1", youtubeId: "mydYJMq3PV0", title: "Apprendre les couleurs et les chiffres", channel: "Monde des Titounis", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 18, ageMin: 3, ageMax: 6, description: "Les chiffres, les couleurs et l'alphabet en 18 min de comptines !", isFree: true, lang: "fr" },
  { id: "num-2", youtubeId: "rBjwM2KHPnc", title: "ABC des fruits et légumes", channel: "Monde des Titounis", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 6, ageMin: 3, ageMax: 6, description: "Apprends l'alphabet avec les fruits et les légumes en comptant !", isFree: true, lang: "fr" },
  { id: "num-3", youtubeId: "Il0Y3ZoDS_g", title: "Apprendre l'alphabet en chanson", channel: "Comptines Françaises", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 4, ageMin: 3, ageMax: 6, description: "Découvre comment apprendre l'alphabet en chanson !", isFree: false, lang: "fr" },
  { id: "num-4", youtubeId: "z0ra65ZGZSI", title: "L'Alphabet avec les animaux et leurs cris", channel: "Comptines Françaises", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 5, ageMin: 3, ageMax: 6, description: "Apprends les lettres et les cris des animaux !", isFree: false, lang: "fr" },

  // ── MATHÉMATIQUES ─────────────────────────────────────
  { id: "maths-1", youtubeId: "S5PB9CqjCXc", title: "Fruits et légumes — apprendre en comptant", channel: "Monde des Titounis", channelVerified: true, category: "Mathématiques", moduleId: "maths", durationMin: 4, ageMin: 3, ageMax: 6, description: "Apprends à compter avec les fruits et légumes !", isFree: true, lang: "fr" },
  { id: "maths-2", youtubeId: "2rB7CY6hFDc", title: "Légumes et fruits — comptine", channel: "Monde des Titounis", channelVerified: true, category: "Mathématiques", moduleId: "maths", durationMin: 3, ageMin: 3, ageMax: 5, description: "Compte et apprends les fruits et légumes en chanson !", isFree: false, lang: "fr" },
  { id: "maths-3", youtubeId: "FSEVdi1rQ-w", title: "Compter avec les Titounis", channel: "Monde des Titounis", channelVerified: true, category: "Mathématiques", moduleId: "maths", durationMin: 4, ageMin: 4, ageMax: 7, description: "Une aventure musicale pour apprendre à compter !", isFree: false, lang: "fr" },

  // ── HISTOIRES ─────────────────────────────────────────
  { id: "story-1", youtubeId: "bDjHQq8e5fY", title: "Comptines et histoires Titounis", channel: "Monde des Titounis", channelVerified: true, category: "Histoires", moduleId: "stories", durationMin: 4, ageMin: 3, ageMax: 7, description: "Des histoires chantées avec les personnages Titounis.", isFree: true, lang: "fr" },
  { id: "story-2", youtubeId: "imX-MJsZ_z0", title: "Les animaux de la savane — histoire", channel: "Monde des Titounis", channelVerified: true, category: "Histoires", moduleId: "stories", durationMin: 5, ageMin: 4, ageMax: 8, description: "Une belle histoire avec les animaux d'Afrique.", isFree: false, lang: "fr" },
  { id: "story-3", youtubeId: "GVzXC7M6r_U", title: "Apprends le vocabulaire en histoire", channel: "Tidoon", channelVerified: true, category: "Histoires", moduleId: "stories", durationMin: 8, ageMin: 4, ageMax: 8, description: "Découvre 95 mots de vocabulaire à travers des images éducatives.", isFree: false, lang: "fr" },

  // ── FRUITS ────────────────────────────────────────────
  { id: "fruits-1", youtubeId: "S5PB9CqjCXc", title: "Les fruits et légumes en comptine", channel: "Monde des Titounis", channelVerified: true, category: "Fruits", moduleId: "fruits", durationMin: 4, ageMin: 3, ageMax: 6, description: "Apprends le nom des fruits en chanson avec les Titounis !", isFree: true, lang: "fr" },
  { id: "fruits-2", youtubeId: "2rB7CY6hFDc", title: "Légumes et fruits — comptine éducative", channel: "Monde des Titounis", channelVerified: true, category: "Fruits", moduleId: "fruits", durationMin: 3, ageMin: 3, ageMax: 5, description: "Une comptine colorée sur les fruits et les légumes.", isFree: false, lang: "fr" },

  // ── SYLLABES ──────────────────────────────────────────
  { id: "syl-1", youtubeId: "_fVReZx6ZxQ", title: "Les syllabes avec l'alphabet", channel: "Monde des Titounis", channelVerified: true, category: "Syllabes", moduleId: "syllables", durationMin: 3, ageMin: 4, ageMax: 7, description: "Apprends les syllabes en découvrant les lettres de l'alphabet.", isFree: true, lang: "fr" },
  { id: "syl-2", youtubeId: "rBjwM2KHPnc", title: "Lire avec les fruits — syllabes", channel: "Monde des Titounis", channelVerified: true, category: "Syllabes", moduleId: "syllables", durationMin: 6, ageMin: 4, ageMax: 7, description: "Apprends à former des syllabes avec les fruits.", isFree: false, lang: "fr" },

  // ── CHIFFRES (additionnels) ───────────────────────────
  { id: "num-5", youtubeId: "IQY_rk0o29Y", title: "Les chiffres en chanson — 0 à 10", channel: "Monde des Titounis", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 12, ageMin: 3, ageMax: 6, description: "Apprends les chiffres de 0 à 10 avec des chansons et comptines joyeuses !", isFree: true, lang: "fr" },
  { id: "num-6", youtubeId: "zqPs8uKpsRQ", title: "123 — Compter de 1 à 10 en chanson", channel: "Monde des Titounis", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 5, ageMin: 3, ageMax: 5, description: "123 ! Les chiffres de 1 à 10 en chansons pour les tout-petits !", isFree: true, lang: "fr" },
  { id: "num-7", youtubeId: "2vQk8BPrUtU", title: "Apprendre les chiffres — Titounis 2024", channel: "Monde des Titounis", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 4, ageMin: 3, ageMax: 6, description: "Des chansons pour apprendre à compter avec des chiffres rigolos !", isFree: false, lang: "fr" },
  { id: "num-8", youtubeId: "wbFdydVp8rc", title: "Chiffres avec les voitures — Vroum Vroum", channel: "Monde des Titounis", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 5, ageMin: 3, ageMax: 6, description: "Apprends les chiffres en chanson avec des voitures et des camions !", isFree: false, lang: "fr" },
  { id: "num-9", youtubeId: "hEymwDeKBII", title: "Apprendre les chiffres — Little Angel", channel: "Little Angel Français", channelVerified: true, category: "Chiffres", moduleId: "numbers", durationMin: 4, ageMin: 3, ageMax: 5, description: "1, 2, 3 — Répète après moi ! Apprendre les chiffres en s'amusant.", isFree: false, lang: "fr" },

  // ── HISTOIRES (additionnels) ──────────────────────────
  { id: "story-4", youtubeId: "PAMyI4a_NNw", title: "Peau d'âne — conte Titounis", channel: "Monde des Titounis", channelVerified: true, category: "Histoires", moduleId: "stories", durationMin: 8, ageMin: 4, ageMax: 8, description: "Le célèbre conte de Charles Perrault raconté par les Titounis !", isFree: true, lang: "fr" },
  { id: "story-5", youtubeId: "rDM1up1eW-M", title: "Raiponce — histoire et comptines", channel: "Monde des Titounis", channelVerified: true, category: "Histoires", moduleId: "stories", durationMin: 10, ageMin: 4, ageMax: 8, description: "Raiponce en chanson et histoire pour les enfants avec les Titounis.", isFree: false, lang: "fr" },
  { id: "story-6", youtubeId: "U0WVothpd5o", title: "Kofi et l'arbre magique — Conte africain", channel: "Contes africains", channelVerified: true, category: "Histoires", moduleId: "stories", durationMin: 6, ageMin: 4, ageMax: 9, description: "Kofi, un garçon courageux, défie la sorcière grâce à l'arbre magique !", isFree: true, lang: "fr" },

  // ── FRUITS (additionnels) ─────────────────────────────
  { id: "fruits-3", youtubeId: "IQY_rk0o29Y", title: "Compter les fruits — chiffres et couleurs", channel: "Monde des Titounis", channelVerified: true, category: "Fruits", moduleId: "fruits", durationMin: 12, ageMin: 3, ageMax: 6, description: "Apprends à compter et reconnaître les fruits avec les chiffres !", isFree: true, lang: "fr" },
  { id: "fruits-4", youtubeId: "rBjwM2KHPnc", title: "ABC des fruits — alphabet illustré", channel: "Monde des Titounis", channelVerified: true, category: "Fruits", moduleId: "fruits", durationMin: 6, ageMin: 3, ageMax: 6, description: "L'alphabet avec les fruits et légumes — apprendre en s'amusant !", isFree: false, lang: "fr" },

  // ── JEUX ──────────────────────────────────────────────
  { id: "games-1", youtubeId: "mydYJMq3PV0", title: "Comptines pour apprendre — Titounis", channel: "Monde des Titounis", channelVerified: true, category: "Jeux", moduleId: "games", durationMin: 18, ageMin: 3, ageMax: 6, description: "18 minutes de comptines éducatives pour apprendre en s'amusant !", isFree: true, lang: "fr" },
  { id: "games-2", youtubeId: "zqPs8uKpsRQ", title: "Chansons éducatives — chiffres et lettres", channel: "Monde des Titounis", channelVerified: true, category: "Jeux", moduleId: "games", durationMin: 5, ageMin: 3, ageMax: 5, description: "Des chansons joyeuses pour apprendre les lettres et les chiffres.", isFree: true, lang: "fr" },
];

export const getVideosByModule = (moduleId: string): EducVideo[] =>
  VIDEOS_DATA.filter((v) => v.moduleId === moduleId);

export const getFreeVideos = (): EducVideo[] => VIDEOS_DATA.filter((v) => v.isFree);

export const getVideoById = (id: string): EducVideo | undefined =>
  VIDEOS_DATA.find((v) => v.id === id);

export const VIDEO_CATEGORIES = ["Tout", "Alphabet", "Chiffres", "Mathématiques", "Histoires", "Fruits", "Syllabes", "Jeux"];
