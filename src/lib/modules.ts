export type ModuleId = "alphabet" | "numbers" | "drawing" | "maths" | "stories";

export interface ModuleData {
  id: ModuleId;
  emoji: string;
  name: string;
  desc: string;
  color: string;
  description: string;
  activities: string[];
  stars: number;
  action: string;
  progress: number;
}

export const MODULES: ModuleData[] = [
  {
    id: "alphabet",
    emoji: "🔤",
    name: "L'Alphabet",
    desc: "Trace les lettres, écoute leur son, colorie !",
    color: "#FFB3BA",
    description: "Apprends à tracer les lettres, écoute leur son et colorie !",
    activities: ["Tracer la lettre A", "Écouter le son", "Colorier le dessin", "Exercice de reconnaissance"],
    stars: 12,
    action: "26 lettres à apprendre",
    progress: 60,
  },
  {
    id: "numbers",
    emoji: "🔢",
    name: "Les Chiffres",
    desc: "Compte, trace et apprends les nombres !",
    color: "#B5EAD7",
    description: "Compte, trace les chiffres et joue avec les nombres !",
    activities: ["Tracer le chiffre 1", "Compter les objets", "Quel chiffre manque ?", "Plus grand ou plus petit ?"],
    stars: 5,
    action: "10 chiffres à découvrir",
    progress: 40,
  },
  {
    id: "drawing",
    emoji: "🎨",
    name: "Dessin & Coloriage",
    desc: "Colorie et crée tes dessins préférés !",
    color: "#C7CEEA",
    description: "Colorie des dessins et laisse libre cours à ta créativité !",
    activities: ["Colorier un animal", "Dessiner librement", "Compléter le dessin", "Ma galerie"],
    stars: 7,
    action: "12 coloriages disponibles",
    progress: 80,
  },
  {
    id: "maths",
    emoji: "➕",
    name: "Mathématiques",
    desc: "Additionne, soustrait et joue avec les calculs !",
    color: "#FFDAC1",
    description: "Additionne, soustrait et joue avec les calculs !",
    activities: ["Addition facile", "Soustraction", "Compter les bâtonnets", "Défi du jour"],
    stars: 3,
    action: "Défis quotidiens",
    progress: 25,
  },
  {
    id: "stories",
    emoji: "📚",
    name: "Histoires",
    desc: "Lis des contes et des histoires magiques !",
    color: "#E2F0CB",
    description: "Lis des contes et des histoires magiques !",
    activities: ["Le lion et la souris", "Histoire biblique", "Conte africain", "Fable de La Fontaine"],
    stars: 4,
    action: "8 histoires à lire",
    progress: 50,
  },
];

export const getModule = (id: string) => MODULES.find((m) => m.id === id);
