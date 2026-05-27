export type AppNotification = {
  id: string;
  type: "badge" | "streak" | "level" | "reminder" | "reward";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  color: string;
};

const KEY = "educenfant_notifications";

export const seedNotifications = (): void => {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEY)) return;
  const initial: AppNotification[] = [
    { id: "1", type: "badge", isRead: false, title: "Nouveau badge !", message: "Tu as débloqué \"Roi de l'Alphabet\"", icon: "Award", color: "#FFB3BA", timestamp: new Date().toISOString() },
    { id: "2", type: "streak", isRead: false, title: "7 jours de suite ! 🔥", message: "Incroyable ! Continue comme ça !", icon: "Flame", color: "#FFDAC1", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "3", type: "level", isRead: true, title: "Niveau supérieur !", message: "Tu es maintenant Niveau 2 : Apprenti", icon: "TrendingUp", color: "#B5EAD7", timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];
  localStorage.setItem(KEY, JSON.stringify(initial));
};

export const getNotifications = (): AppNotification[] => {
  if (typeof window === "undefined") return [];
  seedNotifications();
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export const setNotifications = (n: AppNotification[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(n));
};

export const addNotification = (n: Omit<AppNotification, "id" | "timestamp" | "isRead">): void => {
  const all = getNotifications();
  all.unshift({ ...n, id: Date.now().toString(), timestamp: new Date().toISOString(), isRead: false });
  setNotifications(all.slice(0, 50));
};

export const markAllRead = (): void => {
  setNotifications(getNotifications().map((n) => ({ ...n, isRead: true })));
};

export const removeNotification = (id: string): void => {
  setNotifications(getNotifications().filter((n) => n.id !== id));
};

export const unreadCount = (): number => getNotifications().filter((n) => !n.isRead).length;

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showReminderNotification = (childName: string): void => {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;
  const messages = [
    { title: `Léo t'attend, ${childName} ! 🦁`, body: "C'est l'heure d'apprendre et de gagner des étoiles !" },
    { title: `Viens jouer, ${childName} ! ⭐`, body: "Viens tracer des lettres avec Léo aujourd'hui !" },
    { title: "Ne casse pas ta série ! 🔥", body: `${childName}, Léo t'attend pour continuer ta série !` },
    { title: "Nouveau défi disponible ! 🏆", body: "Un nouveau défi du jour t'attend sur EducEnfant !" },
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const n = new Notification(msg.title, { body: msg.body, icon: "/favicon.ico", tag: "educenfant-daily" });
  n.onclick = () => { window.focus(); window.location.href = "/home"; n.close(); };
};

export const showStreakWarning = (childName: string, streak: number): void => {
  if (typeof window === "undefined" || Notification.permission !== "granted" || streak < 2) return;
  new Notification(`⚠️ Ne casse pas ta série, ${childName} !`, {
    body: `Tu as ${streak} jours de suite. Joue aujourd'hui pour ne pas perdre ta série !`,
    tag: "educenfant-streak", icon: "/favicon.ico",
  });
};

export const scheduleDailyReminder = (hour: number, minute: number): void => {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem("educenfant_reminder_interval");
  if (existing) clearInterval(Number(existing));
  const interval = window.setInterval(() => {
    const now = new Date();
    const child = JSON.parse(localStorage.getItem("educenfant_child") || "{}");
    const today = now.toDateString();
    const isTime = now.getHours() === hour && now.getMinutes() === minute;
    if (isTime && child.lastActiveDate !== today) {
      showReminderNotification(child.name || "toi");
    }
  }, 60000);
  localStorage.setItem("educenfant_reminder_interval", String(interval));
  localStorage.setItem("educenfant_reminder_time", JSON.stringify({ hour, minute }));
};

export const initNotifications = async (childName: string, streak: number): Promise<void> => {
  if (typeof window === "undefined") return;
  const granted = await requestNotificationPermission();
  if (!granted) return;
  const savedTime = localStorage.getItem("educenfant_reminder_time");
  if (savedTime) {
    try { const { hour, minute } = JSON.parse(savedTime); scheduleDailyReminder(hour, minute); } catch {}
  }
  const child = JSON.parse(localStorage.getItem("educenfant_child") || "{}");
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (child.lastActiveDate === yesterday && streak >= 3) {
    setTimeout(() => showStreakWarning(childName, streak), 3000);
  }
};