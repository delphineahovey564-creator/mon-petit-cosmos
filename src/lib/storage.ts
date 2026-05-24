export type Activity = {
  id: string;
  moduleId: string;
  title: string;
  starsEarned: number;
  timestamp: string;
};

export type ChildState = {
  name: string;
  age: number;
  avatar: string;
  stars: number;
  streak: number;
  badges: string[];
  progress: {
    alphabet: number;
    numbers: number;
    drawing: number;
    maths: number;
    stories: number;
  };
  completedLetters: string[];
  completedNumbers: number[];
  activities: Activity[];
  level?: { current: number; name: string; xp: number; nextLevelXp: number };
  lastActiveDate?: string;
  lastChestOpened?: string;
};

export type ParentState = {
  firstName: string;
  email: string;
  isLoggedIn: boolean;
};

const KEYS = {
  parent: "educenfant_parent",
  child: "educenfant_child",
  onboarding: "educenfant_onboarding_done",
};

const DEFAULT_CHILD: ChildState = {
  name: "Toni",
  age: 7,
  avatar: "lion",
  stars: 248,
  streak: 7,
  badges: ["early_bird", "perfect_week", "alphabet_king"],
  progress: { alphabet: 69, numbers: 42, drawing: 90, maths: 26, stories: 55 },
  completedLetters: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R"],
  completedNumbers: [0,1,2,3,4,5,6,7,8],
  activities: [
    { id: "1", moduleId: "alphabet", title: "Lettre S tracée", starsEarned: 15, timestamp: "2025-05-22T09:30:00" },
    { id: "2", moduleId: "maths", title: "Addition 5+3=8", starsEarned: 10, timestamp: "2025-05-22T10:15:00" },
    { id: "3", moduleId: "drawing", title: "Coloriage : Lion", starsEarned: 20, timestamp: "2025-05-22T14:20:00" },
  ],
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeed() {
  if (!isBrowser()) return;
  if (!localStorage.getItem(KEYS.child)) write(KEYS.child, DEFAULT_CHILD);
}

export function getChild(): ChildState {
  ensureSeed();
  return read<ChildState>(KEYS.child, DEFAULT_CHILD);
}
export function setChild(c: Partial<ChildState>) {
  const merged = { ...getChild(), ...c };
  write(KEYS.child, merged);
  return merged;
}

export function getParent(): ParentState {
  return read<ParentState>(KEYS.parent, { firstName: "", email: "", isLoggedIn: false });
}
export function setParent(p: Partial<ParentState>) {
  const merged = { ...getParent(), ...p };
  write(KEYS.parent, merged);
  return merged;
}

export function getOnboardingDone(): boolean {
  return read<boolean>(KEYS.onboarding, false);
}
export function setOnboardingDone(v: boolean) {
  write(KEYS.onboarding, v);
}

export function averageProgress(c: ChildState): number {
  const p = c.progress;
  return Math.round((p.alphabet + p.numbers + p.drawing + p.maths + p.stories) / 5);
}

export const MODULE_META = {
  alphabet: { id: "alphabet", name: "L'Alphabet", color: "#FFB3BA", subtitle: "26 lettres à explorer" },
  numbers:  { id: "numbers",  name: "Les Chiffres", color: "#B5EAD7", subtitle: "0 → 20" },
  drawing:  { id: "drawing",  name: "Dessin", color: "#C7CEEA", subtitle: "Colorie !" },
  maths:    { id: "maths",    name: "Maths", color: "#FFDAC1", subtitle: "Calcule !" },
  stories:  { id: "stories",  name: "Histoires", color: "#D4EDDA", subtitle: "Lis et écoute" },
} as const;

export type ModuleId = keyof typeof MODULE_META;