import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Check, Sparkles } from "lucide-react";
import { FRUITS_DATA, getFruit } from "@/lib/fruitsData";
import { getChild, setChild } from "@/lib/storage";
import { speak, speakEncouragement } from "@/lib/audio";

export const Route = createFileRoute("/module/fruits/fruit/$id")({ component: FruitDetail });

function FruitDetail() {
  const { id } = useParams({ from: "/module/fruits/fruit/$id" });
  const nav = useNavigate();
  const fruit = getFruit(id);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!fruit) return;
    setDone(getChild().completedFruits.includes(fruit.id));
    const t = setTimeout(() => speak(`${fruit.name}. ${fruit.description}.`), 400);
    return () => clearTimeout(t);
  }, [fruit]);

  if (!fruit) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Link to="/module/fruits" className="text-edu-primary font-bold">← Retour</Link>
      </div>
    );
  }

  const idx = FRUITS_DATA.findIndex((f) => f.id === fruit.id);
  const next = FRUITS_DATA[(idx + 1) % FRUITS_DATA.length];

  const validate = () => {
    const c = getChild();
    if (!c.completedFruits.includes(fruit.id)) {
      setChild({
        completedFruits: [...c.completedFruits, fruit.id],
        stars: c.stars + 5,
        progress: { ...c.progress, fruits: Math.round(((c.completedFruits.length + 1) / FRUITS_DATA.length) * 100) },
      });
    }
    setDone(true);
    speakEncouragement();
  };

  return (
    <div className="min-h-screen pb-12" style={{ background: fruit.color }}>
      <header className="h-14 px-4 flex items-center justify-between">
        <button onClick={() => nav({ to: "/module/fruits" })}><ArrowLeft size={24} color="#1A1A2E" /></button>
        <h1 className="font-extrabold text-[18px] text-[#1A1A2E]">{fruit.name}</h1>
        <div className="w-6" />
      </header>

      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mt-6 text-center">
        <div style={{ fontSize: 160, lineHeight: 1 }}>{fruit.emoji}</div>
      </motion.div>

      <div className="mx-4 mt-6 rounded-3xl bg-white p-5 shadow-edu-card">
        <p className="text-[16px] font-bold text-[#1A1A2E] text-center">{fruit.description}</p>
        <button
          onClick={() => speak(`${fruit.name}. ${fruit.description}.`)}
          className="mt-4 mx-auto flex items-center gap-2 bg-edu-primary text-white rounded-full px-5 py-2.5 font-extrabold active:scale-95 spring"
        >
          <Volume2 size={18} /> Écouter
        </button>
        <div className="mt-5 rounded-2xl bg-[#FFF9F0] p-4 flex gap-2">
          <Sparkles size={20} color="#FF6B35" className="shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#6B7280]"><span className="font-extrabold text-[#1A1A2E]">Le savais-tu ?</span> {fruit.funFact}</p>
        </div>
      </div>

      <div className="mx-4 mt-5 flex gap-3">
        <button
          onClick={validate}
          disabled={done}
          className="flex-1 h-[52px] rounded-xl bg-edu-primary text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 spring"
        >
          <Check size={18} /> {done ? "Appris !" : "J'ai appris !"}
        </button>
        <Link to="/module/fruits/fruit/$id" params={{ id: next.id }} className="flex-1 h-[52px] rounded-xl bg-white border-[1.5px] border-edu-primary text-edu-primary font-extrabold grid place-items-center active:scale-95 spring">
          Suivant →
        </Link>
      </div>
    </div>
  );
}