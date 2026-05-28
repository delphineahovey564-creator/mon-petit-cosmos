export type FruitData = {
  id: string; name: string; emoji: string; color: string;
  description: string; sound: string; funFact: string;
};

export const FRUITS_DATA: FruitData[] = [
  { id: "mangue",    name: "La Mangue",       emoji: "🥭", color: "#FFDAC1", description: "Un fruit tropical sucré et juteux",       sound: "mangue",       funFact: "La mangue pousse en Afrique et en Asie !" },
  { id: "banane",    name: "La Banane",       emoji: "🍌", color: "#FFEAA7", description: "Un fruit doux et énergisant",             sound: "banane",       funFact: "Les singes adorent les bananes !" },
  { id: "orange",    name: "L'Orange",        emoji: "🍊", color: "#FFDAC1", description: "Un fruit rond et vitaminé",               sound: "orange",       funFact: "L'orange est pleine de vitamine C !" },
  { id: "ananas",    name: "L'Ananas",        emoji: "🍍", color: "#FFEAA7", description: "Un fruit épineux et délicieux",           sound: "ananas",       funFact: "L'ananas est le roi des fruits tropicaux !" },
  { id: "pomme",     name: "La Pomme",        emoji: "🍎", color: "#FFB3BA", description: "Un fruit croquant et sucré",              sound: "pomme",        funFact: "Il existe plus de 7 000 variétés de pommes !" },
  { id: "fraise",    name: "La Fraise",       emoji: "🍓", color: "#FFB3BA", description: "Un petit fruit rouge et parfumé",         sound: "fraise",       funFact: "La fraise n'est pas vraiment un fruit !" },
  { id: "raisin",    name: "Le Raisin",       emoji: "🍇", color: "#C7CEEA", description: "De petites boules sucrées en grappe",     sound: "raisin",       funFact: "On fait du jus avec le raisin !" },
  { id: "citron",    name: "Le Citron",       emoji: "🍋", color: "#FFEAA7", description: "Un fruit acide et jaune",                 sound: "citron",       funFact: "Le citron est très acide mais plein de vitamines !" },
  { id: "pasteque",  name: "La Pastèque",     emoji: "🍉", color: "#B5EAD7", description: "Un grand fruit rouge et rafraîchissant",  sound: "pastèque",     funFact: "La pastèque est composée à 92% d'eau !" },
  { id: "avocat",    name: "L'Avocat",        emoji: "🥑", color: "#B5EAD7", description: "Un fruit vert et crémeux",                sound: "avocat",       funFact: "L'avocat est originaire du Mexique !" },
  { id: "papaye",    name: "La Papaye",       emoji: "🍈", color: "#FFDAC1", description: "Un fruit orange tropical",                sound: "papaye",       funFact: "La papaye pousse partout en Afrique !" },
  { id: "noix-coco", name: "La Noix de Coco", emoji: "🥥", color: "#F5E6D3", description: "Un fruit dur avec du lait à l'intérieur", sound: "noix de coco", funFact: "Le cocotier peut vivre 100 ans !" },
  { id: "cerise",    name: "La Cerise",       emoji: "🍒", color: "#FFB3BA", description: "Un petit fruit rouge en paire",           sound: "cerise",       funFact: "Les cerises poussent au printemps !" },
  { id: "poire",     name: "La Poire",        emoji: "🍐", color: "#B5EAD7", description: "Un fruit vert et doux",                   sound: "poire",        funFact: "Il existe plus de 3 000 variétés de poires !" },
  { id: "peche",     name: "La Pêche",        emoji: "🍑", color: "#FFDAC1", description: "Un fruit duveteux et sucré",              sound: "pêche",        funFact: "La pêche est originaire de Chine !" },
  { id: "melon",     name: "Le Melon",        emoji: "🍈", color: "#FFEAA7", description: "Un fruit sucré avec des graines",         sound: "melon",        funFact: "Le melon est cousin de la pastèque !" },
  { id: "kiwi",      name: "Le Kiwi",         emoji: "🥝", color: "#B5EAD7", description: "Un petit fruit brun, vert à l'intérieur", sound: "kiwi",         funFact: "Le kiwi vient de Nouvelle-Zélande !" },
  { id: "myrtille",  name: "La Myrtille",     emoji: "🫐", color: "#C7CEEA", description: "Un petit fruit bleu et vitaminé",         sound: "myrtille",     funFact: "Les myrtilles colorent la langue en bleu !" },
  { id: "figue",     name: "La Figue",        emoji: "🍈", color: "#C7CEEA", description: "Un fruit doux et sucré",                  sound: "figue",        funFact: "La figue est très ancienne !" },
  { id: "grenade",   name: "La Grenade",      emoji: "🍎", color: "#FFB3BA", description: "Un fruit rouge avec des graines brillantes", sound: "grenade",   funFact: "La grenade est symbole de fertilité en Afrique !" },
];

export const getFruit = (id: string) => FRUITS_DATA.find((f) => f.id === id);