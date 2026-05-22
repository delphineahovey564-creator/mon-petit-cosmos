import { Link, useLocation } from "@tanstack/react-router";
import { Home, Star, FolderOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const TABS = [
  { id: "home",      icon: Home,       label: "Accueil",      to: "/home" as const },
  { id: "stars",     icon: Star,       label: "Mes étoiles",  to: "/profile" as const },
  { id: "creations", icon: FolderOpen, label: "Créations",    to: "/profile" as const },
  { id: "profile",   icon: User,       label: "Profil",       to: "/profile" as const },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      className="fixed bottom-0 inset-x-0 h-[72px] bg-white border-t border-[#F3F4F6] z-[100]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-2xl mx-auto h-full grid grid-cols-4">
        {TABS.map((t) => {
          const active = (t.id === "home" && pathname === "/home") ||
            (t.id !== "home" && pathname.startsWith("/profile") && t.id === "profile");
          const Icon = t.icon;
          return (
            <Link
              key={t.id}
              to={t.to}
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