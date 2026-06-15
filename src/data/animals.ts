export type AnimalOutline = {
  name: string;
  emoji: string;
  color: string;
  path: string;
};

export const ANIMAL_OUTLINES: Record<string, AnimalOutline> = {
  lion: {
    name: "Lion",
    emoji: "🦁",
    color: "#FFB347",
    path: `M100,40 C70,40 50,60 50,90 C50,110 60,125 75,135 L70,160 L85,150 L90,165 L110,165 L115,150 L130,160 L125,135 C140,125 150,110 150,90 C150,60 130,40 100,40 Z`,
  },
  elephant: {
    name: "Éléphant",
    emoji: "🐘",
    color: "#B5EAD7",
    path: `M60,80 C40,80 30,100 35,120 C30,130 35,145 50,145 L150,145 C165,145 170,130 165,120 C170,100 155,80 130,80 C130,60 115,45 95,45 C75,45 60,60 60,80 Z`,
  },
  girafe: {
    name: "Girafe",
    emoji: "🦒",
    color: "#FFDAC1",
    path: `M90,30 L100,30 L100,90 C130,90 145,105 145,125 C145,140 135,150 120,150 L80,150 C65,150 55,140 55,125 C55,105 70,90 90,90 Z`,
  },
  zebre: {
    name: "Zèbre",
    emoji: "🦓",
    color: "#E8CCFF",
    path: `M70,50 L85,50 L85,90 C115,90 140,105 140,125 C140,145 120,155 100,155 L60,155 C45,155 35,145 35,125 C35,105 50,90 70,90 Z`,
  },
  singe: {
    name: "Singe",
    emoji: "🐵",
    color: "#FFEAA7",
    path: `M100,40 C75,40 60,60 60,85 C60,105 75,120 100,120 C125,120 140,105 140,85 C140,60 125,40 100,40 Z M65,75 C55,75 50,85 55,95 M135,75 C145,75 150,85 145,95`,
  },
  tortue: {
    name: "Tortue",
    emoji: "🐢",
    color: "#D4EDDA",
    path: `M100,60 C60,60 40,85 40,110 C40,135 65,150 100,150 C135,150 160,135 160,110 C160,85 140,60 100,60 Z M50,100 L30,90 M150,100 L170,90 M70,145 L65,165 M130,145 L135,165`,
  },
  poisson: {
    name: "Poisson",
    emoji: "🐟",
    color: "#C7CEEA",
    path: `M40,100 C40,75 70,60 100,60 C140,60 170,80 170,100 C170,120 140,140 100,140 C70,140 40,125 40,100 Z M170,100 L195,80 L195,120 Z`,
  },
  oiseau: {
    name: "Oiseau",
    emoji: "🐦",
    color: "#FFB3BA",
    path: `M60,90 C60,65 80,50 105,55 C130,60 150,75 150,95 C150,115 130,130 105,130 C80,130 60,115 60,90 Z M150,90 L175,80 L165,100 Z`,
  },
  chat: {
    name: "Chat",
    emoji: "🐱",
    color: "#FFB347",
    path: `M100,50 L80,30 L85,55 M100,50 L120,30 L115,55 M100,50 C70,50 55,75 55,100 C55,125 75,145 100,145 C125,145 145,125 145,100 C145,75 130,50 100,50 Z`,
  },
};

export const ANIMAL_LIST = Object.entries(ANIMAL_OUTLINES).map(([id, data]) => ({
  id,
  ...data,
}));