import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/profil")({ component: ProfilPage });

const AVATARS = [
  { emoji: "🦁", bg: "#FFB3BA" },
  { emoji: "🐸", bg: "#B5EAD7" },
  { emoji: "🐼", bg: "#C7CEEA" },
  { emoji: "🦊", bg: "#FFDAC1" },
  { emoji: "🐧", bg: "#E2F0CB" },
  { emoji: "🦋", bg: "#FFE14D" },
  { emoji: "🐬", bg: "#B5EAD7" },
  { emoji: "🐙", bg: "#FFB3BA" },
];

function ProfilPage() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(0);
  const [name, setName] = useState("Aminata");
  const [age, setAge] = useState(7);

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl text-center">Qui joue aujourd'hui ? 🎉</h1>
        <p className="text-center text-muted-foreground mt-3 mb-10 text-lg">
          Choisis ton avatar et entre ton prénom
        </p>

        <div className="bg-card rounded-3xl p-6 sm:p-10 shadow-lg space-y-10">
          {/* Avatars */}
          <div>
            <label className="block text-lg mb-4 font-extrabold">Choisis ton avatar</label>
            <div className="grid grid-cols-4 gap-4 sm:gap-6 place-items-center">
              {AVATARS.map((a, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatar(i)}
                  className="w-20 h-20 rounded-full grid place-items-center text-4xl spring shadow-sm"
                  style={{
                    background: a.bg,
                    transform: avatar === i ? "scale(1.1)" : undefined,
                    outline: avatar === i ? "4px solid var(--primary)" : "4px solid transparent",
                  }}
                >
                  <motion.span
                    key={avatar === i ? "sel" : "no"}
                    initial={avatar === i ? { scale: 0.6 } : false}
                    animate={avatar === i ? { scale: 1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    {a.emoji}
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-lg mb-3 font-extrabold">Quel est ton prénom ?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon prénom..."
              className="w-full h-16 px-5 rounded-2xl border-2 border-border bg-background text-2xl font-bold spring focus:outline-none focus:border-primary"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-lg mb-4 font-extrabold">Quel âge as-tu ?</label>
            <div className="flex flex-wrap gap-3 justify-center">
              {[3,4,5,6,7,8,9,10].map((n) => (
                <button
                  key={n}
                  onClick={() => setAge(n)}
                  className="w-[52px] h-[52px] rounded-full border-2 spring active:scale-95"
                  style={{
                    borderColor: age === n ? "var(--primary)" : "var(--border)",
                    background: age === n ? "var(--primary)" : "transparent",
                    color: age === n ? "var(--primary-foreground)" : "var(--foreground)",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate({ to: "/dashboard" })}
            disabled={!name.trim()}
            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl spring hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-primary/30 disabled:opacity-50"
          >
            C'est parti ! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
