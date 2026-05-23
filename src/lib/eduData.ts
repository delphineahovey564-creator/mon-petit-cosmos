export const LETTER_WORDS: Record<string, string> = {
  A: "Arbre", B: "Bateau", C: "Chat", D: "Dauphin", E: "Étoile",
  F: "Fleur", G: "Girafe", H: "Hibou", I: "Île", J: "Jardin",
  K: "Koala", L: "Lion", M: "Maison", N: "Nuit", O: "Orange",
  P: "Papillon", Q: "Quille", R: "Roi", S: "Soleil", T: "Tapis",
  U: "Univers", V: "Vélo", W: "Wagon", X: "Xylophone",
  Y: "Yaourt", Z: "Zèbre",
};

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const NUMBER_WORDS: Record<number, string> = {
  0: "zéro", 1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq",
  6: "six", 7: "sept", 8: "huit", 9: "neuf", 10: "dix",
  11: "onze", 12: "douze", 13: "treize", 14: "quatorze", 15: "quinze",
  16: "seize", 17: "dix-sept", 18: "dix-huit", 19: "dix-neuf", 20: "vingt",
};

export const NUMBERS = Array.from({ length: 21 }, (_, i) => i);

export const PALETTE_COLORS = [
  "#FF6B35", "#1A5E47", "#6B5B00", "#1A4B8C",
  "#7B3FA0", "#E91E8C", "#C0392B", "#1A1A2E",
];

export type Tool = { id: string; label: string; strokeWidth: number };
export const TOOLS: Tool[] = [
  { id: "crayon", label: "Crayon", strokeWidth: 4 },
  { id: "stylo", label: "Stylo", strokeWidth: 2 },
  { id: "pinceau", label: "Pinceau", strokeWidth: 8 },
  { id: "gomme", label: "Gomme", strokeWidth: 20 },
];

export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = opts.rate ?? 0.85;
    u.pitch = opts.pitch ?? 1.15;
    window.speechSynthesis.speak(u);
  } catch {}
}

export type StoryData = {
  id: string; title: string; category: string; duration: string;
  stars: number; bg: string; emoji: string; description: string; content: string;
};

export const STORIES: StoryData[] = [
  {
    id: "lion-souris", title: "Le Lion et la Souris", category: "Fables",
    duration: "3 min", stars: 15, bg: "#FFB3BA", emoji: "🦁",
    description: "Une histoire sur l'amitié et l'entraide.",
    content: "Il était une fois un grand lion qui dormait paisiblement dans la savane. Un jour, une petite souris courut sur son nez. Le lion la attrapa mais la laissa partir. Plus tard, le lion fut pris dans un filet de chasseurs. La petite souris arriva et rongea les cordes pour le libérer. La morale : même les plus petits peuvent aider les plus grands.",
  },
  {
    id: "creation", title: "La Création du Monde", category: "Bible",
    duration: "5 min", stars: 20, bg: "#C7CEEA", emoji: "🌍",
    description: "Au commencement...",
    content: "Au commencement, Dieu créa le ciel et la terre. Il dit : Que la lumière soit ! Et la lumière fut. Il sépara la lumière des ténèbres. Il appela la lumière jour et les ténèbres nuit. Puis il créa les océans, les montagnes, les plantes et les animaux. Enfin, il créa l'homme à son image.",
  },
  {
    id: "anansi", title: "Anansi l'Araignée", category: "Contes africains",
    duration: "4 min", stars: 18, bg: "#B5EAD7", emoji: "🕷️",
    description: "Le conte africain célèbre de la sagesse.",
    content: "Anansi l'araignée était très rusée. Un jour, elle voulut acheter toutes les histoires du monde au Roi du Ciel. Le Roi lui demanda d'attraper le python, le léopard et les frelons. Grâce à sa ruse, Anansi réussit chaque épreuve et reçut le don des histoires qu'elle partagea avec tous les hommes.",
  },
  {
    id: "baobab", title: "Pourquoi le Baobab", category: "Contes africains",
    duration: "3 min", stars: 15, bg: "#FFDAC1", emoji: "🌳",
    description: "Un conte sur le baobab et la fierté.",
    content: "Au commencement, le baobab était l'arbre le plus beau de la savane. Mais il devint si fier de sa beauté qu'il se vanta auprès des dieux. Pour le punir, les dieux le retournèrent la tête en bas. C'est pour cela que ses branches ressemblent à des racines pointant vers le ciel.",
  },
  {
    id: "cigale-fourmi", title: "La Cigale et la Fourmi", category: "Fables",
    duration: "2 min", stars: 12, bg: "#D4EDDA", emoji: "🐜",
    description: "La fable de La Fontaine.",
    content: "La Cigale ayant chanté tout l'été se trouva fort dépourvue quand la bise fut venue. Pas un seul petit morceau de mouche ou de vermisseau. Elle alla crier famine chez la Fourmi sa voisine. La Fourmi n'est pas prêteuse, c'est là son moindre défaut.",
  },
  {
    id: "pays-arc-en-ciel", title: "Le Pays Arc-en-Ciel", category: "Imaginaires",
    duration: "4 min", stars: 16, bg: "#F3E8FF", emoji: "🌈",
    description: "Un voyage imaginaire et coloré.",
    content: "Toni fermait les yeux et voyageait dans un pays où tout était en couleurs. Les rivières étaient bleues comme le saphir, les montagnes roses comme des bonbons, et les nuages dorés comme du miel. Là-bas, les enfants volaient sur des oiseaux multicolores et chantaient des chansons magiques.",
  },
];

export function getStory(id: string) {
  return STORIES.find((s) => s.id === id);
}
