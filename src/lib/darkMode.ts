export const DARK_TOKENS: Record<string, string> = {
  "--bg": "#0F0F1A",
  "--bg-card": "#1A1A2E",
  "--bg-card-2": "#252538",
  "--text-primary": "#F1F1F1",
  "--text-secondary": "#9CA3AF",
  "--border": "#2D2D45",
  "--primary": "#FF6B35",
  "--accent": "#FFE14D",
};

export const LIGHT_TOKENS: Record<string, string> = {
  "--bg": "#FFF9F0",
  "--bg-card": "#FFFFFF",
  "--bg-card-2": "#F3F4F6",
  "--text-primary": "#1A1A2E",
  "--text-secondary": "#6B7280",
  "--border": "#E5E7EB",
  "--primary": "#FF6B35",
  "--accent": "#FFE14D",
};

export const applyTheme = (isDark: boolean): void => {
  if (typeof document === "undefined") return;
  const tokens = isDark ? DARK_TOKENS : LIGHT_TOKENS;
  const root = document.documentElement;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
  root.classList.toggle("dark", isDark);
  localStorage.setItem("educenfant_dark_mode", String(isDark));
};

export const isDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("educenfant_dark_mode") === "true";
};

export const loadTheme = (): void => {
  if (typeof window === "undefined") return;
  if (isDarkMode()) applyTheme(true);
};