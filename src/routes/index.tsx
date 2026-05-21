import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MODULES } from "@/lib/modules";

export const Route = createFileRoute("/")({ component: Landing });

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full grid place-items-center text-white font-black text-lg"
        style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>EE</div>
      <span className="text-2xl font-black tracking-tight">EducEnfant</span>
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/dashboard"
              className="hidden sm:inline-flex items-center justify-center min-h-[48px] px-5 rounded-2xl border-2 border-secondary text-secondary spring hover:bg-secondary/10">
              Se connecter
            </Link>
            <Link to="/profil"
              className="inline-flex items-center justify-center min-h-[48px] min-w-[160px] px-5 rounded-2xl bg-primary text-primary-foreground spring hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-primary/30">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center px-4 sm:px-6">
        {/* blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-10 -left-20 w-[420px] h-[420px] rounded-full animate-float-slow"
            style={{ background: "var(--color-card1)", opacity: 0.5, filter: "blur(20px)" }} />
          <div className="absolute top-40 right-0 w-[360px] h-[360px] rounded-full animate-float-slow"
            style={{ background: "var(--color-card2)", opacity: 0.45, filter: "blur(20px)", animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full animate-float-slow"
            style={{ background: "var(--color-card3)", opacity: 0.4, filter: "blur(20px)", animationDelay: "4s" }} />
        </div>

        <div className="max-w-5xl mx-auto py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-[48px] sm:text-6xl md:text-7xl leading-[1.05] font-black">
            Apprendre en jouant,<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--secondary))" }}>
              grandir en créant.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Des jeux éducatifs créatifs pour les enfants de 3 à 10 ans 🌟
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/profil"
              className="inline-flex items-center justify-center min-h-[64px] min-w-[220px] px-8 text-xl rounded-2xl bg-primary text-primary-foreground spring hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-primary/40">
              Jouer maintenant →
            </Link>
            <a href="#modules"
              className="inline-flex items-center justify-center min-h-[64px] min-w-[200px] px-8 text-xl rounded-2xl border-2 border-secondary text-secondary spring hover:bg-secondary/10">
              Voir les activités
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base">
            {["✅ 100% Gratuit pour commencer","🔒 Sécurisé pour les enfants","🎯 Maternelle → CM2"].map((t) => (
              <span key={t} className="bg-card px-4 py-2 rounded-full shadow-sm border border-border/50">{t}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl text-center mb-12">5 Univers d'Apprentissage</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="snap-center shrink-0 w-[260px] md:w-auto rounded-3xl p-6 spring hover:scale-[1.04] shadow-lg"
                style={{ background: m.color }}>
                <div className="text-6xl mb-3">{m.emoji}</div>
                <h3 className="text-xl mb-1">{m.name}</h3>
                <p className="text-sm text-foreground/70 mb-4 min-h-[40px]">{m.desc}</p>
                <Link to="/module/$id" params={{ id: m.id }} className="font-extrabold underline-offset-4 hover:underline">
                  Découvrir →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl text-center mb-14">Comment ça marche ?</h2>
          <div className="relative grid md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] border-t-4 border-dashed border-primary/30 -z-0" />
            {[
              { icon: "👶", title: "Crée ton profil", desc: "Choisis ton avatar et entre ton prénom" },
              { icon: "🎮", title: "Choisis une activité", desc: "5 univers éducatifs t'attendent" },
              { icon: "⭐", title: "Gagne des étoiles", desc: "Progresse et collectionne tes réussites" },
            ].map((s, i) => (
              <div key={i} className="relative z-10 bg-card rounded-3xl p-8 text-center shadow-md spring hover:-translate-y-1">
                <div className="text-7xl mb-4">{s.icon}</div>
                <h3 className="text-2xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-[32px] p-12 sm:p-16 text-center text-primary-foreground"
          style={{ background: "linear-gradient(135deg,var(--primary),#FFB347)" }}>
          <h2 className="text-4xl sm:text-5xl mb-8">Prêt à commencer l'aventure ?</h2>
          <Link to="/profil"
            className="inline-flex items-center justify-center min-h-[64px] min-w-[280px] px-10 text-xl rounded-2xl bg-white text-primary spring hover:scale-[1.04] active:scale-[0.97] shadow-2xl">
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">Apprendre en jouant, grandir en créant.</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">À propos</a>
            <a href="#" className="hover:text-primary">Contact</a>
            <a href="#" className="hover:text-primary">Confidentialité</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 EducEnfant — Fait avec ❤️ pour les enfants</p>
        </div>
      </footer>
    </div>
  );
}
