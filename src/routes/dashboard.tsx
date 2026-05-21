import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Settings, Home, Star, FolderOpen, User } from "lucide-react";
import { MODULES } from "@/lib/modules";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const RECENT = [
  { emoji: "🔤", title: "Lettre A", when: "il y a 2h", stars: 3 },
  { emoji: "➕", title: "Addition facile", when: "hier", stars: 2 },
  { emoji: "🎨", title: "Coloriage lion", when: "il y a 2j", stars: 4 },
];

function Dashboard() {
  const child = { name: "Aminata", avatar: "🦁", stars: 24 };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top bar */}
      <header className="bg-card shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full grid place-items-center text-2xl shadow-sm"
              style={{ background: "var(--color-card1)" }}>
              {child.avatar}
            </div>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">Bienvenue</p>
              <p className="font-black text-lg">Bonjour, {child.name} ! 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              key={child.stars}
              initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.2, 1] }}
              className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-black flex items-center gap-1"
            >
              ⭐ {child.stars}
              <span className="hidden sm:inline">étoiles</span>
            </motion.div>
            <button className="w-11 h-11 rounded-full grid place-items-center bg-muted spring hover:bg-muted/70" aria-label="Réglages">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Welcome banner */}
        <motion.section
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-3xl p-6 sm:p-8 flex items-center justify-between text-primary-foreground shadow-lg"
          style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">Que veux-tu faire aujourd'hui ?</h2>
            <p className="opacity-90 mt-1">Choisis un univers et gagne des étoiles !</p>
          </div>
          <div className="text-7xl sm:text-8xl select-none">🦁</div>
        </motion.section>

        {/* Progress */}
        <section className="mt-8">
          <h3 className="text-xl mb-4">Ta progression cette semaine</h3>
          <div className="bg-card rounded-3xl p-5 sm:p-6 shadow-md space-y-3">
            {MODULES.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-2xl w-8">{m.emoji}</span>
                <span className="w-28 sm:w-40 truncate font-bold">{m.name}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${m.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                </div>
                <span className="w-10 text-right font-black text-sm">{m.progress}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Modules grid */}
        <section className="mt-10">
          <h3 className="text-xl mb-4">Tes univers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {MODULES.map((m, i) => (
              <Link
                key={m.id} to="/module/$id" params={{ id: m.id }}
                className="group rounded-3xl overflow-hidden bg-card shadow-md spring hover:scale-[1.03] active:scale-[0.98]"
              >
                <div
                  className="aspect-square grid place-items-center text-6xl sm:text-7xl"
                  style={{ background: m.color, animation: `float-card 3s ease-in-out infinite alternate`, animationDelay: `${i * 0.5}s` }}
                >
                  {m.emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-lg font-black leading-tight">{m.name}</h4>
                    <span className="text-xs font-extrabold bg-accent/40 px-2 py-1 rounded-full whitespace-nowrap">⭐ {m.stars}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{m.action}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent */}
        <section className="mt-10">
          <h3 className="text-xl mb-4">Tes dernières activités</h3>
          <div className="bg-card rounded-3xl shadow-md divide-y divide-border">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <span className="text-3xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-black">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.when}</p>
                </div>
                <p className="text-lg">{"⭐".repeat(r.stars)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-card border-t border-border z-40">
        <div className="max-w-6xl mx-auto h-full grid grid-cols-4">
          {[
            { Icon: Home, label: "Accueil", active: true },
            { Icon: Star, label: "Mes étoiles" },
            { Icon: FolderOpen, label: "Mes créations" },
            { Icon: User, label: "Profil" },
          ].map(({ Icon, label, active }) => (
            <button key={label} className="flex flex-col items-center justify-center gap-0.5 spring"
              style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}>
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-extrabold">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
