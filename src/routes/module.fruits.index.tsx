import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, Trophy, Check } from "lucide-react";
import { FRUITS_DATA } from "@/lib/fruitsData";
import { getChild, type ChildState } from "@/lib/storage";
import { BottomNav } from "@/components/educ/BottomNav";

export const Route = createFileRoute("/module/fruits/")({ component: FruitsIndex });

function FruitsIndex() {
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => setC(getChild()), []);
  const done = new Set(child?.completedFruits ?? []);

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-extrabold text-[18px] text-[#1A1A2E]">🍎 Les Fruits</h1>
        <div className="w-6" />
      </header>

      <section className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <Link to="/module/fruits/listen" className="rounded-2xl p-4 bg-[#FFEAA7] shadow-edu-card spring active:scale-95">
          <Headphones size={24} className="mb-2" />
          <p className="font-extrabold text-[15px]">Écouter</p>
          <p className="text-[12px] text-[#6B7280]">Reconnais le fruit</p>
        </Link>
        <Link to="/module/fruits/quiz" className="rounded-2xl p-4 bg-[#FFB3BA] shadow-edu-card spring active:scale-95">
          <Trophy size={24} className="mb-2" />
          <p className="font-extrabold text-[15px]">Quiz</p>
          <p className="text-[12px] text-[#6B7280]">5 questions</p>
        </Link>
      </section>

      <h2 className="mx-4 mt-6 mb-3 font-extrabold text-[16px] text-[#1A1A2E]">Découvre les 20 fruits</h2>
      <div className="mx-4 grid grid-cols-3 gap-3">
        {FRUITS_DATA.map((f, i) => {
          const isDone = done.has(f.id);
          return (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link
                to="/module/fruits/fruit/$id"
                params={{ id: f.id }}
                className="relative block rounded-2xl p-3 text-center shadow-edu-card spring active:scale-95"
                style={{ background: f.color }}
              >
                <div className="text-4xl">{f.emoji}</div>
                <p className="mt-1 font-bold text-[12px] text-[#1A1A2E] truncate">{f.name}</p>
                {isDone && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#4CAF50] grid place-items-center">
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}