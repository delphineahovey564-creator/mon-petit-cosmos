import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const Route = createFileRoute("/subscribe/success")({ component: SubscribeSuccess });

const COLORS = ["#FFE14D", "#FFFFFF", "#FFB347", "#FF6B35", "#B5EAD7"];

function SubscribeSuccess() {
  const nav = useNavigate();
  useEffect(() => { const t = setTimeout(() => nav({ to: "/home" }), 8000); return () => clearTimeout(t); }, [nav]);

  const confetti = useMemo(() => Array.from({ length: 50 }, () => ({
    left: Math.random() * 100, color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random(), duration: 2 + Math.random() * 2, rotate: 360 + Math.random() * 360,
  })), []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-6" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((c, i) => (
          <motion.div key={i} initial={{ y: -20 }} animate={{ y: 800, rotate: c.rotate }} transition={{ duration: c.duration, delay: c.delay, ease: "linear" }} style={{ position: "absolute", left: `${c.left}%`, top: 0, width: 10, height: 8, background: c.color, borderRadius: 2 }} />
        ))}
      </div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.2, type: "spring" }} className="w-[100px] h-[100px] rounded-full bg-white grid place-items-center">
        <Check size={52} color="#4CAF50" strokeWidth={3} />
      </motion.div>
      <h1 className="mt-5 font-black text-[28px] text-white text-center">Bienvenue dans Premium ! 🎉</h1>
      <p className="mt-1 font-medium text-[16px] text-white/85 text-center">Votre abonnement est actif.</p>

      <div className="mt-6 w-full max-w-[400px] bg-white rounded-[20px] p-6">
        <p className="font-bold text-[14px] text-edu-dark mb-3">Ce qui est maintenant débloqué :</p>
        <ul className="space-y-2">
          {["Alphabet complet (26 lettres)", "Tous les chiffres et modules maths", "6 histoires + nouvelles chaque mois", "Export PDF illimité", "Suivi parent avancé"].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check size={16} color="#4CAF50" /><span className="font-semibold text-[14px] text-edu-dark">{t}</span></li>
          ))}
        </ul>
      </div>

      <button onClick={() => nav({ to: "/home" })} className="mt-6 w-full max-w-[400px] h-14 rounded-[14px] bg-white text-edu-primary font-extrabold text-[16px]">Commencer à explorer →</button>
    </div>
  );
}