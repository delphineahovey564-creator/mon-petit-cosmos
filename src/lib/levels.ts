import type { ChildState } from "./storage";

export const LEVELS = [
  { level: 1, name: "Petit Explorateur", maxXp: 100 },
  { level: 2, name: "Apprenti", maxXp: 300 },
  { level: 3, name: "Savant", maxXp: 600 },
  { level: 4, name: "Champion", maxXp: 1000 },
  { level: 5, name: "Maître EducEnfant", maxXp: 9999 },
];

export function computeLevel(stars: number) {
  let prevMax = 0;
  for (const l of LEVELS) {
    if (stars < l.maxXp) {
      return { current: l.level, name: l.name, xp: stars, nextLevelXp: l.maxXp, prevXp: prevMax };
    }
    prevMax = l.maxXp;
  }
  const last = LEVELS[LEVELS.length - 1];
  return { current: last.level, name: last.name, xp: stars, nextLevelXp: last.maxXp, prevXp: prevMax };
}

export function levelProgressPct(stars: number) {
  const l = computeLevel(stars);
  const range = l.nextLevelXp - l.prevXp;
  const inLevel = l.xp - l.prevXp;
  return Math.max(0, Math.min(100, Math.round((inLevel / range) * 100)));
}

export type AllBadge = {
  id: string;
  cat: string;
  icon: string;
  color: string;
  name: string;
  desc: string;
  check: (c: ChildState) => boolean;
};

export const ALL_BADGES: AllBadge[] = [
  { id: "first_letter", cat: "Alphabet", icon: "Type", color: "#FFB3BA", name: "Première lettre", desc: "Trace ta première lettre", check: (c) => c.completedLetters.length >= 1 },
  { id: "alphabet_half", cat: "Alphabet", icon: "BookOpen", color: "#FFB3BA", name: "Mi-chemin", desc: "13 lettres apprises", check: (c) => c.completedLetters.length >= 13 },
  { id: "alphabet_king", cat: "Alphabet", icon: "Crown", color: "#FFB3BA", name: "Roi de l'Alphabet", desc: "26 lettres maîtrisées", check: (c) => c.completedLetters.length >= 26 },
  { id: "first_calc", cat: "Maths", icon: "Calculator", color: "#FFDAC1", name: "Premier calcul", desc: "Résous ton premier exercice", check: (c) => c.progress.maths > 0 },
  { id: "math_champion", cat: "Maths", icon: "Trophy", color: "#FFDAC1", name: "Champion des maths", desc: "50% du module Maths", check: (c) => c.progress.maths >= 50 },
  { id: "first_story", cat: "Histoires", icon: "BookOpen", color: "#D4EDDA", name: "Premier conte", desc: "Lis ta première histoire", check: (c) => c.progress.stories > 0 },
  { id: "streak_3", cat: "Régularité", icon: "Flame", color: "#FFE14D", name: "3 jours de suite", desc: "Joue 3 jours consécutifs", check: (c) => c.streak >= 3 },
  { id: "early_bird", cat: "Régularité", icon: "Sun", color: "#FFE14D", name: "Lève-tôt", desc: "Joue avant 9h du matin", check: () => false },
  { id: "perfect_week", cat: "Régularité", icon: "Sparkles", color: "#2EC4B6", name: "Semaine parfaite", desc: "7 jours de suite", check: (c) => c.streak >= 7 },
  { id: "stars_50", cat: "Étoiles", icon: "Star", color: "#FF6B35", name: "Collectionneur", desc: "50 étoiles gagnées", check: (c) => c.stars >= 50 },
  { id: "stars_500", cat: "Étoiles", icon: "Zap", color: "#FF6B35", name: "Superstar", desc: "500 étoiles gagnées", check: (c) => c.stars >= 500 },
  { id: "first_drawing", cat: "Créativité", icon: "Palette", color: "#C7CEEA", name: "Petit artiste", desc: "Sauvegarde ton premier dessin", check: () => false },
];

export function checkUnlockBadges(c: ChildState): { newBadges: string[]; pending: AllBadge | null } {
  const newBadges: string[] = [];
  let pending: AllBadge | null = null;
  for (const b of ALL_BADGES) {
    if (b.check(c) && !c.badges.includes(b.id)) {
      newBadges.push(b.id);
      if (!pending) pending = b;
    }
  }
  return { newBadges, pending };
}