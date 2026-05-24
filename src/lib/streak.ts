import { getChild, setChild } from "./storage";

export const updateStreak = (): void => {
  const c = getChild();
  const today = new Date().toDateString();
  const lastActive = c.lastActiveDate;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastActive === today) return;

  let streak = c.streak || 0;
  if (lastActive === yesterday) streak = streak + 1;
  else streak = 1;

  const badges = [...c.badges];
  if (streak >= 3 && !badges.includes("streak_3")) {
    badges.push("streak_3");
    if (typeof window !== "undefined")
      localStorage.setItem("educenfant_pending_badge", JSON.stringify({ id: "streak_3", name: "3 jours de suite", desc: "Joue 3 jours consécutifs", color: "#FFE14D", icon: "Flame" }));
  }
  if (streak >= 7 && !badges.includes("perfect_week")) {
    badges.push("perfect_week");
    if (typeof window !== "undefined")
      localStorage.setItem("educenfant_pending_badge", JSON.stringify({ id: "perfect_week", name: "Semaine parfaite", desc: "7 jours de suite", color: "#2EC4B6", icon: "Sparkles" }));
  }

  setChild({ streak, lastActiveDate: today, badges });
};

export const setPendingBadge = (b: { id: string; name: string; desc: string; color: string; icon: string }) => {
  if (typeof window !== "undefined") localStorage.setItem("educenfant_pending_badge", JSON.stringify(b));
};

export const popPendingBadge = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("educenfant_pending_badge");
  if (!raw) return null;
  return JSON.parse(raw) as { id: string; name: string; desc: string; color: string; icon: string };
};

export const clearPendingBadge = () => {
  if (typeof window !== "undefined") localStorage.removeItem("educenfant_pending_badge");
};