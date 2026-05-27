export const trackSessionStart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("educenfant_session_start", Date.now().toString());
};

export const trackSessionEnd = (): void => {
  if (typeof window === "undefined") return;
  const start = Number(localStorage.getItem("educenfant_session_start"));
  if (!start) return;
  const duration = Math.floor((Date.now() - start) / 60000);
  if (duration <= 0) return;
  const today = new Date().toDateString();
  const existing = JSON.parse(localStorage.getItem("educenfant_screen_time") || "{}");
  existing[today] = (existing[today] || 0) + duration;
  localStorage.setItem("educenfant_screen_time", JSON.stringify(existing));
  localStorage.removeItem("educenfant_session_start");
};

export const getTodayScreenTime = (): number => {
  if (typeof window === "undefined") return 0;
  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem("educenfant_screen_time") || "{}");
  return data[today] || 0;
};

export const getDailyLimit = (): number => {
  if (typeof window === "undefined") return 60;
  return Number(localStorage.getItem("educenfant_daily_limit")) || 60;
};

export const setDailyLimit = (n: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("educenfant_daily_limit", String(n));
};

export const isLimitReached = (): boolean => getTodayScreenTime() >= getDailyLimit();

export const bypassLimit = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("educenfant_limit_bypass", "1");
};

export const hasBypass = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("educenfant_limit_bypass") === "1";
};