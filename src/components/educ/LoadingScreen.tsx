import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type LoadingContext = "alphabet" | "numbers" | "drawing" | "maths" | "stories" | "default";

const LOADING_SCENES: Record<LoadingContext, { emoji: string; bg: string; messages: string[] }> = {
  alphabet: { emoji: "🔤", bg: "#FFB3BA", messages: ["Léo prépare les lettres...", "Chargement de l'alphabet...", "Presque prêt à tracer !"] },
  numbers: { emoji: "🔢", bg: "#B5EAD7", messages: ["Léo compte les étoiles...", "Chargement des chiffres...", "Les nombres arrivent !"] },
  drawing: { emoji: "🎨", bg: "#C7CEEA", messages: ["Léo sort ses crayons...", "Préparation du canvas...", "Le dessin va commencer !"] },
  maths: { emoji: "➕", bg: "#FFDAC1", messages: ["Léo calcule dans sa tête...", "Chargement des exercices...", "Les maths arrivent !"] },
  stories: { emoji: "📚", bg: "#D4EDDA", messages: ["Léo ouvre son grand livre...", "Chargement des histoires...", "Une aventure vous attend !"] },
  default: { emoji: "⭐", bg: "#FF6B35", messages: ["Léo se réveille...", "Chargement en cours...", "Presque prêt !"] },
};

export function LoadingScreen({ context = "default" }: { context?: LoadingContext }) {
  const scene = LOADING_SCENES[context];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % scene.messages.length), 1200);
    return () => clearInterval(t);
  }, [scene.messages.length]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{ background: `linear-gradient(180deg, ${scene.bg}, ${scene.bg}88)` }}>
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="w-[100px] h-[100px] rounded-full grid place-items-center mb-4" style={{ background: "rgba(255,255,255,0.3)" }}>
        <span style={{ fontSize: 80 }}>{scene.emoji}</span>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="font-bold text-white text-[16px] text-center px-6">
          {scene.messages[idx]}
        </motion.p>
      </AnimatePresence>
      <div className="mt-6 flex gap-2">
        {[0, 0.2, 0.4].map((d, i) => (
          <motion.div key={i} animate={{ scale: [0.5, 1, 0.5] }} transition={{ duration: 0.8, delay: d, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.7)" }} />
        ))}
      </div>
    </div>
  );
}