import { Link, useLocation } from "@tanstack/react-router";
import { Home, Star, FolderOpen, User, BarChart3, ListChecks, Settings } from "lucide-react";
import { motion } from "framer-motion";

const CHILD_TABS = [
  { id: "home",      icon: Home,       label: "Accueil",      to: "/home" },
  { id: "stars",     icon: Star,       label: "Mes étoiles",  to: "/badges" },
  { id: "creations", icon: FolderOpen, label: "Créations",    to: "/module/drawing" },
  { id: "profile",   icon: User,       label: "Profil",       to: "/profile" },
];
const PARENT_TABS = [
  { id: "home",        icon: Home,       label: "Accueil",     to: "/parent" },
  { id: "progression", icon: BarChart3,  label: "Progression", to: "/parent/progression" },
  { id: "activites",   icon: ListChecks, label: "Activités",   to: "/parent/activites" },
  { id: "reglages",    icon: Settings,   label: "Réglages",    to: "/parent/reglages" },
];

export function BottomNav({ context }: { context?: "child" | "parent" } = {}) {
  const { pathname } = useLocation();
  const ctx = context ?? (pathname.startsWith("/parent") ? "parent" : "child");
  const TABS = ctx === "parent" ? PARENT_TABS : CHILD_TABS;
  return (
    <nav
      className="fixed bottom-0 inset-x-0 h-[72px] bg-white border-t border-[#F3F4F6] z-[100]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-2xl mx-auto h-full grid grid-cols-4">
        {TABS.map((t) => {
          const active = pathname === t.to || (t.to !== "/home" && t.to !== "/parent" && pathname.startsWith(t.to));
          const Icon = t.icon;
          return (
            <Link
              key={t.id}
              to={t.to as any}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <motion.div
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
              >
                <Icon size={active ? 26 : 24} color={active ? "#FF6B35" : "#9CA3AF"} strokeWidth={active ? 2.4 : 2} />
              </motion.div>
              <span
                className="text-[11px]"
                style={{ color: active ? "#FF6B35" : "#9CA3AF", fontWeight: active ? 700 : 500 }}
              >
                {t.label}
              </span>
              {active && <span className="w-1 h-1 rounded-full bg-edu-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}