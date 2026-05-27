import { getParent, setParent } from "./storage";

export const isPremium = (): boolean => {
  const p = getParent() as any;
  if (p.plan !== "premium") return false;
  if (!p.planExpiry) return false;
  return new Date(p.planExpiry) > new Date();
};

export const activatePremium = (months = 1): void => {
  const expiry = new Date(Date.now() + months * 30 * 24 * 3600 * 1000).toISOString();
  setParent({ plan: "premium", planExpiry: expiry, subscriptionId: "demo_" + Date.now() } as any);
};

export const PREMIUM_FEATURES = {
  alphabet: { free: ["A","B","C","D","E","F","G","H","I","J","K","L","M"], premium: "all" as const },
  numbers: { free: [0,1,2,3,4,5,6,7,8,9,10], premium: "all" as const },
  stories: { free: ["lion-souris", "cigale-fourmi"], premium: "all" as const },
  pdfExport: { free: 3, premium: Infinity },
  modules: { free: ["alphabet","numbers","drawing"], premium: ["alphabet","numbers","drawing","maths","stories"] },
};

export const isLetterLocked = (letter: string): boolean =>
  !isPremium() && !PREMIUM_FEATURES.alphabet.free.includes(letter.toUpperCase());

export const isNumberLocked = (n: number): boolean =>
  !isPremium() && !PREMIUM_FEATURES.numbers.free.includes(n);

export const isStoryLocked = (id: string): boolean =>
  !isPremium() && !PREMIUM_FEATURES.stories.free.includes(id);

export const isMathOpLocked = (op: string): boolean =>
  !isPremium() && (op === "multiplication" || op === "division");

export const canExportPDF = (): boolean => {
  if (isPremium()) return true;
  if (typeof window === "undefined") return true;
  const count = Number(localStorage.getItem("educenfant_pdf_count") || 0);
  return count < 3;
};

export const incrementPDFCount = (): void => {
  if (typeof window === "undefined") return;
  const count = Number(localStorage.getItem("educenfant_pdf_count") || 0);
  localStorage.setItem("educenfant_pdf_count", String(count + 1));
};

export const pdfRemaining = (): number => {
  if (isPremium()) return Infinity;
  if (typeof window === "undefined") return 3;
  const count = Number(localStorage.getItem("educenfant_pdf_count") || 0);
  return Math.max(0, 3 - count);
};