import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, Award, Printer } from "lucide-react";
import { exportVictoryPDF } from "@/lib/pdfExport";
import { z } from "zod";
import { Leo } from "@/components/educ/Leo";
import { getChild } from "@/lib/storage";
import { speak } from "@/lib/eduData";

const victorySearch = z.object({
  letter: z.string().optional(),
  moduleName: z.string().default("Activité"),
  starsEarned: z.coerce.number().default(10),
  score: z.coerce.number().optional(),
  total: z.coerce.number().optional(),
  achievementText: z.string().optional(),
  nextRoute: z.string().optional(),
});

export const Route = createFileRoute("/victory")({
  component: VictoryScreen,
  validateSearch: (s) => victorySearch.parse(s),
});

const CONFETTI_COLORS = ["#FF6B35", "#FFE14D", "#2EC4B6", "#FFB3BA", "#B5EAD7", "#C7CEEA"];

function VictoryScreen() {
  const { letter, moduleName, starsEarned, score, total, achievementText, nextRoute } = Route.useSearch();
  const nav = useNavigate();
  const [child] = useState(() => getChild());
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);

  useEffect(() => {
    setW(window.innerWidth); setH(window.innerHeight);
    speak(`Bravo ${child.name} ! Tu as gagné ${starsEarned} étoiles !`);
  }, []);

  const confetti = useMemo(() => Array.from({ length: 40 }, () => ({
    left: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    sizeW: 8 + Math.random() * 6,
    sizeH: 6 + Math.random() * 4,
    delay: Math.random(),
    duration: 2 + Math.random() * 2,
    rotate: 360 + Math.random() * 360,
  })), []);

  const message = achievementText
    ?? (letter ? `Tu as tracé la lettre ${letter} parfaitement !`
    : score !== undefined ? `Tu as eu ${score}/${total} bonnes réponses !`
    : `Belle activité dans ${moduleName} !`);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 1 }}
            animate={{ y: h + 40, rotate: c.rotate }}
            transition={{ duration: c.duration, delay: c.delay, ease: "linear" }}
            style={{
              position: "absolute", left: `${c.left}%`, top: 0,
              width: c.sizeW, height: c.sizeH, background: c.color, borderRadius: 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-10 flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: [1.2, 0.9, 1.05, 1], opacity: 1 }} transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}>
          <Leo size={180} />
        </motion.div>

        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 font-black text-[36px] text-edu-primary">
          Bravo, {child.name} !
        </motion.h1>
        <p className="mt-2 font-semibold text-[16px] text-[#6B7280] max-w-xs">{message}</p>

        <motion.div id="victory-card" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }} className="mt-7 w-full max-w-xs bg-[#FFF9F0] rounded-[24px] p-6 border-2 border-[#FFE14D]">
          <div className="flex justify-center gap-2">
            {[0, 0.1, 0.2].map((d, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.7 + d, duration: 0.4 }}>
                <Star size={32} fill="#FFE14D" color="#FFE14D" />
              </motion.div>
            ))}
          </div>
          <p className="mt-3 font-black text-[28px] text-edu-primary">+{starsEarned} étoiles</p>
          <p className="text-[14px] text-[#6B7280] font-medium">ajoutées à ton compte</p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-white font-bold text-[12px]" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
            <Award size={18} /> Badge débloqué : Apprenti de l'alphabet !
          </div>
        </motion.div>

        <div className="mt-8 w-full max-w-xs space-y-3">
          <button
            onClick={() => nextRoute ? (window.location.href = nextRoute) : nav({ to: "/home" })}
            className="w-full h-14 rounded-2xl bg-edu-primary text-white font-extrabold shadow-edu-btn"
          >
            Continuer →
          </button>
          <button
            onClick={() => nav({ to: "/home" })}
            className="w-full h-[52px] rounded-2xl bg-white border-[1.5px] border-[#E5E7EB] text-[#6B7280] font-bold"
          >
            Retour au menu
          </button>
        </div>

        <button
          id="pdf-btn"
          onClick={() => exportVictoryPDF(moduleName, child.name)}
          className="mt-4 flex items-center gap-1.5 text-[#9CA3AF] font-medium text-[13px] underline disabled:opacity-50"
        >
          <Printer size={16} /> Imprimer ma réalisation (PDF)
        </button>
      </div>
    </div>
  );
}