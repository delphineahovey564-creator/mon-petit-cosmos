import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, Flame, TrendingUp, Bell, Gift } from "lucide-react";
import { Leo } from "@/components/educ/Leo";
import { BottomNav } from "@/components/educ/BottomNav";
import { getNotifications, markAllRead, removeNotification, type AppNotification } from "@/lib/notifications";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

const ICON_MAP: Record<string, any> = { Award, Flame, TrendingUp, Bell, Gift };

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diff < 1) return "à l'instant";
  if (diff < 60) return `il y a ${diff} min`;
  if (diff < 1440) return `il y a ${Math.floor(diff / 60)}h`;
  return `hier à ${d.getHours().toString().padStart(2, "0")}h${d.getMinutes().toString().padStart(2, "0")}`;
}

function groupKey(iso: string): "Aujourd'hui" | "Hier" | "Plus ancien" {
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 86400000).toDateString();
  const d = new Date(iso).toDateString();
  if (d === today) return "Aujourd'hui";
  if (d === yest) return "Hier";
  return "Plus ancien";
}

function NotificationsPage() {
  const nav = useNavigate();
  const [list, setList] = useState<AppNotification[]>([]);

  useEffect(() => {
    setList(getNotifications());
    markAllRead();
  }, []);

  const groups = list.reduce<Record<string, AppNotification[]>>((acc, n) => {
    const k = groupKey(n.timestamp);
    (acc[k] = acc[k] || []).push(n);
    return acc;
  }, {});

  const dismiss = (id: string) => {
    removeNotification(id);
    setList(getNotifications());
  };

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-edu-dark">Notifications</h1>
        <button onClick={() => { markAllRead(); setList(getNotifications()); }} className="text-edu-primary font-bold text-[13px]">Tout lire</button>
      </header>

      {list.length === 0 ? (
        <div className="mt-24 flex flex-col items-center gap-3">
          <Leo size={60} />
          <p className="font-semibold text-[15px] text-edu-subtle">Tout est à jour !</p>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-5">
          {(["Aujourd'hui", "Hier", "Plus ancien"] as const).map((g) =>
            groups[g] ? (
              <section key={g}>
                <p className="font-bold text-[12px] text-edu-subtle uppercase tracking-wider mb-2">{g}</p>
                <ul className="space-y-2.5">
                  <AnimatePresence>
                    {groups[g].map((n, i) => {
                      const Icon = ICON_MAP[n.icon] || Bell;
                      return (
                        <motion.li
                          key={n.id}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          transition={{ delay: i * 0.06 }}
                          drag="x"
                          dragConstraints={{ left: -120, right: 0 }}
                          onDragEnd={(_, info) => { if (info.offset.x < -80) dismiss(n.id); }}
                          className="rounded-2xl shadow-edu-card p-3.5 flex items-center gap-3"
                          style={{ background: n.isRead ? "#FFFFFF" : "#FFF9F0" }}
                        >
                          <div className="w-11 h-11 rounded-full grid place-items-center shrink-0" style={{ background: n.color }}>
                            <Icon size={22} color="white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[14px] text-edu-dark truncate">{n.title}</p>
                            <p className="font-medium text-[13px] text-edu-muted line-clamp-2">{n.message}</p>
                            <p className="font-medium text-[11px] text-edu-subtle mt-0.5">{timeAgo(n.timestamp)}</p>
                          </div>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-edu-primary shrink-0" />}
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </section>
            ) : null
          )}
        </div>
      )}
      <BottomNav />
    </div>
  );
}