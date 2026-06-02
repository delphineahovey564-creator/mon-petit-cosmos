export type MemoryPair = { emoji: string; word: string };
export const MEMORY_PAIRS: MemoryPair[] = [
  { emoji: "🦁", word: "Lion" },
  { emoji: "🐘", word: "Éléphant" },
  { emoji: "🦒", word: "Girafe" },
  { emoji: "🐸", word: "Grenouille" },
  { emoji: "🍎", word: "Pomme" },
  { emoji: "🍌", word: "Banane" },
  { emoji: "🥭", word: "Mangue" },
  { emoji: "🌳", word: "Arbre" },
  { emoji: "⭐", word: "Étoile" },
  { emoji: "🌙", word: "Lune" },
];

export type FindRound = { target: string; theme: string; distractors: string[] };
export const FIND_ROUNDS: FindRound[] = [
  { target: "🦁", theme: "animaux", distractors: ["🐘","🦒","🐸","🐧","🦊","🐨","🦋","🐬","🦓","🐆"] },
  { target: "🍎", theme: "fruits", distractors: ["🍌","🥭","🍊","🍋","🍇","🍓","🍒","🍑","🥝","🍐"] },
  { target: "⭐", theme: "symboles", distractors: ["🌙","☀️","⚡","🌈","❄️","🌸","💧","🔥","🌊","🍀"] },
  { target: "🎈", theme: "fête", distractors: ["🎉","🎂","🎁","🎠","🎡","🎢","🎪","🎭","🎨","🎯"] },
  { target: "🐟", theme: "mer", distractors: ["🐬","🦈","🐳","🦑","🦞","🦀","🐙","🦐","🐠","🐡"] },
  { target: "🌳", theme: "nature", distractors: ["🌴","🌵","🌿","🍀","🌾","🍄","🌺","🌻","🌹","🌷"] },
  { target: "✈️", theme: "transport", distractors: ["🚗","🚂","🚢","🚁","🛸","🚀","🛺","🛵","🚌","🚐"] },
  { target: "🍕", theme: "nourriture", distractors: ["🍔","🌮","🍜","🍣","🧁","🍰","🍦","🍩","🥗","🥪"] },
  { target: "⚽", theme: "sport", distractors: ["🏀","🏈","⚾","🎾","🏐","🏉","🥊","🎱","🏓","🥅"] },
  { target: "📚", theme: "école", distractors: ["✏️","📝","🖊️","📐","📏","🔬","🔭","🎒","🖍️","📌"] },
];

export type PuzzleTheme = { name: string; emoji: string; grid3x3: string[]; grid4x4?: string[] };
export const PUZZLE_THEMES: PuzzleTheme[] = [
  {
    name: "La Savane",
    emoji: "🌍",
    grid3x3: ["☀️","🌤️","⛅","🌳","🦁","🌳","🌿","🐘","🌿"],
    grid4x4: ["☀️","🌤️","⛅","🌥️","🌳","🦒","🦁","🌳","🌿","🦓","🐘","🌿","🌾","🌾","🌾","🌾"],
  },
  { name: "Sous la Mer", emoji: "🌊", grid3x3: ["🌊","🌊","🌊","🐬","🐟","🦈","🪸","🐠","🪸"] },
  { name: "La Forêt", emoji: "🌲", grid3x3: ["🌲","🌲","🌲","🦊","🌲","🐦","🍄","🌿","🌺"] },
];

export type QuizQ = { category: string; q: string; emoji?: string; options: string[]; correct: number };
export const CHRONO_QUESTIONS: QuizQ[] = [
  { category: "Alphabet", q: "Quel est le son de la lettre A ?", options: ["AAA", "BBB", "MMM", "SSS"], correct: 0 },
  { category: "Alphabet", q: "Quelle image commence par M ?", emoji: "", options: ["🐱 Chat", "🌙 Lune", "🦁 Lion", "🍎 Pomme"], correct: 1 },
  { category: "Maths", q: "Combien font 3 + 4 ?", options: ["6", "7", "8", "5"], correct: 1 },
  { category: "Maths", q: "Combien font 9 − 4 ?", options: ["3", "4", "5", "6"], correct: 2 },
  { category: "Fruits", q: "Quel fruit est-ce ?", emoji: "🍌", options: ["Mangue", "Banane", "Citron", "Poire"], correct: 1 },
  { category: "Fruits", q: "Quel fruit est-ce ?", emoji: "🍎", options: ["Pomme", "Cerise", "Tomate", "Fraise"], correct: 0 },
  { category: "Chiffres", q: "Compte les pommes 🍎🍎🍎🍎. Combien ?", options: ["3", "4", "5", "6"], correct: 1 },
  { category: "Chiffres", q: "Compte les étoiles ⭐⭐⭐. Combien ?", options: ["2", "3", "4", "5"], correct: 1 },
  { category: "Animaux", q: "Quel animal est-ce ?", emoji: "🦁", options: ["Tigre", "Lion", "Chat", "Loup"], correct: 1 },
  { category: "Animaux", q: "Quel animal est-ce ?", emoji: "🐘", options: ["Rhino", "Hippo", "Éléphant", "Bison"], correct: 2 },
  { category: "Alphabet", q: "Quelle image commence par S ?", options: ["☀️ Soleil", "🐱 Chat", "🦁 Lion", "🌙 Lune"], correct: 0 },
  { category: "Maths", q: "Combien font 2 × 3 ?", options: ["5", "6", "7", "8"], correct: 1 },
  { category: "Chiffres", q: "Quel nombre vient après 7 ?", options: ["6", "9", "8", "10"], correct: 2 },
  { category: "Fruits", q: "Quel fruit est-ce ?", emoji: "🥭", options: ["Pêche", "Abricot", "Mangue", "Orange"], correct: 2 },
  { category: "Animaux", q: "Quel animal est-ce ?", emoji: "🦒", options: ["Girafe", "Zèbre", "Cheval", "Antilope"], correct: 0 },
];

export const GAME_META = {
  memory: { name: "Memory", desc: "Retrouve les paires !", difficulty: 2, gradient: "linear-gradient(135deg,#FF6B35,#FF8C42)" },
  find: { name: "Cherche & Trouve", desc: "Observe bien !", difficulty: 1, gradient: "linear-gradient(135deg,#2EC4B6,#26A69A)" },
  puzzle: { name: "Puzzle", desc: "Assemble les pièces !", difficulty: 2, gradient: "linear-gradient(135deg,#C7CEEA,#A8B3D8)" },
  quiz: { name: "Chrono Quiz", desc: "Réponds vite !", difficulty: 3, gradient: "linear-gradient(135deg,#FFDAC1,#FFB347)" },
};