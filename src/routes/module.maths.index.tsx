import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { getChild, type ChildState } from "@/lib/storage";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/maths/")({ component: MathsModule });

const LEVELS = [
  { type: "addition", op: "+", title: "Addition", level: "Niveau Facile", bg: "#4CAF50" },
  { type: "soustraction", op: "−", title: "Soustraction", level: "Niveau Facile", bg: "#2196F3" },
  { type: "multiplication", op: "×", title: "Multiplication", level: "Niveau Moyen", bg: "#FF6B35" },
  { type: "division", op: "÷", title: "Division", level: "Niveau Moyen", bg: "#9C27B0" },
];

function MathsModule() {
  const [child, setC] = useState<ChildState | null>(null);
  const nav = useNavigate();
  useEffect(() => setC(getChild()), []);
  if (!child) return <div className="min-h-screen bg-[#FFF9F0]" />;

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home" className="p-1"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Mathématiques</h1>
        <div className="flex items-center gap-1 bg-[#FFFBEB] rounded-full px-3 py-1.5">
          <Star size={14} fill="#FFE14D" color="#FFE14D" />
          <span className="font-extrabold text-[13px] text-[#1A1A2E]">{child.stars}</span>
        </div>
      </header>

      <section className="mx-4 mt-4">
        <div className="relative overflow-hidden rounded-[24px] p-5" style={{ height: 160, background: "linear-gradient(135deg,#FFDAC1,#FFB347)" }}>
          <div className="absolute right-2 bottom-0"><Leo size={80} /></div>
          <div className="relative z-10">
            <span className="inline-block bg-white text-[#FFB347] font-bold text-[11px] uppercase rounded-full px-2.5 py-1">Calcul</span>
            <h2 className="mt-1.5 text-white font-black text-[30px] leading-tight">Mathématiques</h2>
            <p className="text-white/85 font-semibold text-[13px]">Calcule, additionne et joue !</p>
          </div>
        </div>
      </section>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {LEVELS.map((l, i) => (
          <motion.button
            key={l.type}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.96 }}
            onClick={() => nav({ to: "/module/maths/exercise/$type", params: { type: l.type } })}
            className="rounded-[20px] p-5 text-left flex flex-col justify-between"
            style={{ background: l.bg, height: 130 }}
          >
            <span className="text-white font-black text-[40px] leading-none">{l.op}</span>
            <div>
              <p className="text-white font-extrabold text-[16px]">{l.title}</p>
              <p className="text-white/85 text-[12px]">{l.level}</p>
              <p className="text-white/85 text-[12px]">⭐ +10 étoiles</p>
            </div>
          </motion.button>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}