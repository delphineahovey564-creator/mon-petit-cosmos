export type SyllableLevel = {
  id: number;
  title: string;
  desc: string;
  color: string;
  emoji: string;
  type: "vowels" | "consonant" | "words" | "twoSyllables" | "threeSyllables" | "reading";
  consonant?: string;
};

export const SYLLABLE_LEVELS: SyllableLevel[] = [
  { id: 1,  title: "Les voyelles",        desc: "A, E, I, O, U",            color: "#FFB3BA", emoji: "🔤", type: "vowels" },
  { id: 2,  title: "PA, PE, PI, PO, PU",  desc: "La consonne P",            color: "#FFDAC1", emoji: "🅿️", type: "consonant", consonant: "P" },
  { id: 3,  title: "MA, ME, MI, MO, MU",  desc: "La consonne M",            color: "#B5EAD7", emoji: "〽️", type: "consonant", consonant: "M" },
  { id: 4,  title: "LA, LE, LI, LO, LU",  desc: "La consonne L",            color: "#C7CEEA", emoji: "🔵", type: "consonant", consonant: "L" },
  { id: 5,  title: "BA, BE, BI, BO, BU",  desc: "La consonne B",            color: "#D4EDDA", emoji: "🅱️", type: "consonant", consonant: "B" },
  { id: 6,  title: "TA, TE, TI, TO, TU",  desc: "La consonne T",            color: "#FFEAA7", emoji: "🔤", type: "consonant", consonant: "T" },
  { id: 7,  title: "Former des mots",     desc: "MA + MA = MAMA",           color: "#FFB3BA", emoji: "💬", type: "words" },
  { id: 8,  title: "Mots de 2 syllabes",  desc: "PA-PA, MA-MA, MO-TO",      color: "#E8CCFF", emoji: "👶", type: "twoSyllables" },
  { id: 9,  title: "Mots de 3 syllabes",  desc: "CA-NA-RI, PA-PA-YE",       color: "#B5EAD7", emoji: "🐦", type: "threeSyllables" },
  { id: 10, title: "Lecture de phrases",  desc: "Lis une phrase complète",  color: "#FFDAC1", emoji: "📖", type: "reading" },
];

export const getLevel = (id: number) => SYLLABLE_LEVELS.find((l) => l.id === id);

export const VOWELS = ["A", "E", "I", "O", "U"];
export const VOWEL_COLORS: Record<string, string> = { A: "#FF6B35", E: "#4CAF50", I: "#2196F3", O: "#FF9800", U: "#9C27B0" };
export const VOWEL_EXAMPLES: Record<string, { word: string; emoji: string }[]> = {
  A: [{ word: "Arbre", emoji: "🌳" }, { word: "Avion", emoji: "✈️" }, { word: "Ananas", emoji: "🍍" }],
  E: [{ word: "Étoile", emoji: "⭐" }, { word: "Éléphant", emoji: "🐘" }, { word: "Enfant", emoji: "👶" }],
  I: [{ word: "Île", emoji: "🏝️" }, { word: "Igloo", emoji: "🏔️" }, { word: "Insecte", emoji: "🐛" }],
  O: [{ word: "Orange", emoji: "🍊" }, { word: "Oiseau", emoji: "🐦" }, { word: "Ourson", emoji: "🐻" }],
  U: [{ word: "Univers", emoji: "🌌" }, { word: "Usine", emoji: "🏭" }, { word: "Uniforme", emoji: "👔" }],
};

export type SimpleWord = { word: string; syllables: string[]; emoji: string; meaning: string };

export const SIMPLE_WORDS: SimpleWord[] = [
  { word: "PAPA",   syllables: ["PA", "PA"],       emoji: "👨", meaning: "ton papa" },
  { word: "MAMA",   syllables: ["MA", "MA"],       emoji: "👩", meaning: "ta maman" },
  { word: "BÉBÉ",   syllables: ["BÉ", "BÉ"],       emoji: "👶", meaning: "un bébé" },
  { word: "LOLO",   syllables: ["LO", "LO"],       emoji: "🍼", meaning: "du lait" },
  { word: "TATA",   syllables: ["TA", "TA"],       emoji: "👩", meaning: "ta tante" },
  { word: "MOTO",   syllables: ["MO", "TO"],       emoji: "🏍️", meaning: "une moto" },
  { word: "LUNE",   syllables: ["LU", "NE"],       emoji: "🌙", meaning: "la lune" },
  { word: "PAPAYE", syllables: ["PA", "PA", "YE"], emoji: "🥭", meaning: "une papaye" },
  { word: "BANANE", syllables: ["BA", "NA", "NE"], emoji: "🍌", meaning: "une banane" },
];

export const TWO_SYLLABLE_WORDS: SimpleWord[] = [
  { word: "MAMAN",  syllables: ["MA", "MAN"], emoji: "👩",  meaning: "ta maman" },
  { word: "PAPA",   syllables: ["PA", "PA"],  emoji: "👨",  meaning: "ton papa" },
  { word: "SOLEIL", syllables: ["SO", "LEIL"],emoji: "☀️",  meaning: "le soleil" },
  { word: "MAISON", syllables: ["MAI", "SON"],emoji: "🏠",  meaning: "une maison" },
  { word: "LION",   syllables: ["LI", "ON"],  emoji: "🦁",  meaning: "un lion" },
];

export const THREE_SYLLABLE_WORDS: SimpleWord[] = [
  { word: "PAPAYE",  syllables: ["PA", "PA", "YE"],  emoji: "🥭", meaning: "une papaye" },
  { word: "BANANE",  syllables: ["BA", "NA", "NE"],  emoji: "🍌", meaning: "une banane" },
  { word: "CANARI",  syllables: ["CA", "NA", "RI"],  emoji: "🐦", meaning: "un oiseau" },
  { word: "LIBERTÉ", syllables: ["LI", "BER", "TÉ"], emoji: "🕊️", meaning: "être libre" },
  { word: "FAMILLE", syllables: ["FA", "MIL", "LE"], emoji: "👨‍👩‍👧", meaning: "ta famille" },
];

export const SENTENCES = [
  { text: "Ma ma-man me don-ne u-ne man-go.", words: ["Ma", "maman", "me", "donne", "une", "mangue"], emoji: "🥭" },
  { text: "Le li-on est dans la sa-va-ne.",   words: ["Le", "lion", "est", "dans", "la", "savane"],   emoji: "🦁" },
  { text: "Pa-pa a u-ne mo-to rou-ge.",       words: ["Papa", "a", "une", "moto", "rouge"],          emoji: "🏍️" },
  { text: "La lu-ne bril-le dans le ci-el.",  words: ["La", "lune", "brille", "dans", "le", "ciel"], emoji: "🌙" },
  { text: "Je man-ge u-ne ba-na-ne jau-ne.",  words: ["Je", "mange", "une", "banane", "jaune"],      emoji: "🍌" },
];