import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Bell, Shield, Star } from "lucide-react";
import { setParent } from "@/lib/storage";

export const Route = createFileRoute("/parent/tour")({ component: ParentTour });

const TOUR_STEPS = [
  { step: 1, Icon: BarChart2, color: "#FFB3BA", title: "Suivez la progression", description: "Consultez les statistiques détaillées de votre enfant module par module, semaine par semaine." },
  { step: 2, Icon: Bell, color: "#B5EAD7", title: "Activez les rappels", description: "Configurez une heure de rappel quotidien pour que votre enfant n'oublie jamais de jouer." },
  { step: 3, Icon: Shield, color: "#C7CEEA", title: "Contrôle parental", description: "Limitez le temps d'écran et activez ou désactivez les modules selon l'âge." },
  { step: 4, Icon: Star, color: "#FFDAC1", title: "Célébrez les réussites", description: "Recevez des notifications à chaque badge débloqué et exportez les certificats de votre enfant." },
];

function ParentTour() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const s = TOUR_STEPS[i];

  function finish() {
    localStorage.setItem("educenfant_parent_tour_done", "true");
    setParent({ tourDone: true });
    nav({ to: "/parent" });
  }

  return (
    <div className="min-h-screen bg-edu-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center p-5">
        <AnimatePresence mode="wait">
          <motion.div key={s.step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="w-full max-w-[400px]">
            <div className="rounded-[28px] p-10 grid place-items-center" style={{ background: `${s.color}33` }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <s.Icon size={80} color={s.color} strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="bg-white rounded-t-[28px] p-6 pb-10 shadow-edu-card">
        <div className="flex justify-between items-center">
          <span className="bg-edu-primary-pale text-edu-primary font-extrabold text-[12px] px-3 py-1 rounded-full">{s.step}/4</span>
          <button onClick={finish} className="font-bold text-[13px] text-edu-subtle">Passer</button>
        </div>
        <h2 className="mt-4 font-black text-[26px] text-edu-dark">{s.title}</h2>
        <p className="mt-2 font-medium text-[15px] text-edu-muted">{s.description}</p>
        <div className="mt-5 flex gap-2">
          {TOUR_STEPS.map((_, idx) => (
            <span key={idx} className="h-1.5 rounded-full transition-all" style={{ width: idx === i ? 28 : 8, background: idx === i ? "#FF6B35" : "#E5E7EB" }} />
          ))}
        </div>
        <button
          onClick={() => (i < TOUR_STEPS.length - 1 ? setI(i + 1) : finish())}
          className="mt-6 w-full h-[52px] rounded-[14px] bg-edu-primary text-white font-extrabold text-[16px] shadow-edu-btn"
        >
          {i < TOUR_STEPS.length - 1 ? "Suivant →" : "Commencer !"}
        </button>
      </div>
    </div>
  );
}