import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import { getModule } from "@/lib/modules";

export const Route = createFileRoute("/module/$id")({ component: ModulePage });

function ModulePage() {
  const { id } = useParams({ from: "/module/$id" });
  const mod = getModule(id);

  if (!mod) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="text-6xl mb-4">🤔</p>
          <p className="text-2xl font-black mb-6">Cet univers n'existe pas</p>
          <Link to="/dashboard" className="inline-flex h-14 px-6 items-center rounded-2xl bg-primary text-primary-foreground font-extrabold">
            ← Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Link to="/dashboard"
          className="inline-flex items-center gap-2 h-12 px-4 rounded-2xl bg-card shadow-sm font-extrabold spring hover:scale-[1.03] active:scale-95">
          <ArrowLeft className="w-5 h-5" /> Retour
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-[32px] p-8 sm:p-12 shadow-lg text-center"
          style={{ background: mod.color }}
        >
          <div className="text-8xl sm:text-9xl mb-4">{mod.emoji}</div>
          <h1 className="text-4xl sm:text-5xl font-black">{mod.name}</h1>
          <p className="mt-4 text-lg sm:text-xl text-foreground/75 max-w-xl mx-auto">
            {mod.description}
          </p>
        </motion.section>

        <h2 className="text-2xl sm:text-3xl mt-10 mb-5">Les activités disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mod.activities.map((a, i) => {
            const unlocked = i === 0;
            return (
              <motion.div
                key={a}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-3xl p-5 shadow-md flex items-center justify-between gap-4 spring hover:-translate-y-1"
              >
                <div>
                  <p className="font-black text-lg">{a}</p>
                  <p className="text-sm text-muted-foreground">Activité {i + 1}</p>
                </div>
                {unlocked ? (
                  <button className="h-12 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold spring hover:scale-[1.04] active:scale-95 shadow-md shadow-primary/30 whitespace-nowrap">
                    Jouer →
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 h-10 px-3 rounded-full bg-muted text-muted-foreground text-sm font-extrabold whitespace-nowrap">
                    <Lock className="w-4 h-4" /> Bientôt
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 bg-card rounded-3xl p-6 shadow-md text-center">
          <p className="text-lg font-extrabold">⭐ Étoiles gagnées dans ce module : 0/20</p>
          <div className="mt-3 h-3 bg-muted rounded-full overflow-hidden max-w-md mx-auto">
            <div className="h-full" style={{ width: "0%", background: "var(--primary)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
