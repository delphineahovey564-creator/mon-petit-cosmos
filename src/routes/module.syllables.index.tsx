import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { SYLLABLE_LEVELS } from "@/lib/syllablesData";
import { getChild, type ChildState } from "@/lib/storage";
import { BottomNav } from "@/components/educ/BottomNav";

export const Route = createFileRoute("/module/syllables/")({ component: SyllablesIndex });

function SyllablesIndex() {
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => setC(getChild()), []);
  const done = new Set(child?.completedSyllableLevels ?? []);
  const lastDone = SYLLABLE_LEVELS.reduce((acc, l) => (done.has(l.id) ? Math.max(acc, l.id) : acc), 0);

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-extrabold text-[18px]">💬 Syllabes</h1>
        <div className="w-6" />
      </header>

      <section className="mx-4 mt-4 rounded-3xl p-5 text-center" style={{ background: "linear-gradient(135deg,#E8CCFF,#C7CEEA)" }}>
        <p className="text-5xl mb-2">📚</p>
        <p className="font-extrabold text-[18px]">10 niveaux progressifs</p>
        <p className="text-[13px] text-[#1A1A2E]/70 mt-1">Apprends à former les syllabes et lire des mots</p>
      </section>

      <div className="mx-4 mt-6 space-y-3">
        {SYLLABLE_LEVELS.map((l, i) => {
          const isDone = done.has(l.id);
          const isLocked = l.id > lastDone + 1;
          return (
            <motion.div key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              {isLocked ? (
                <div className="rounded-2xl p-4 bg-white border-[1.5px] border-[#F3F4F6] flex items-center gap-3 opacity-60">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl" style={{ background: l.color }}>{l.emoji}</div>
                  <div className="flex-1">
                    <p className="font-extrabold text-[15px]">Niveau {l.id} — {l.title}</p>
                    <p className="text-[12px] text-[#6B7280]">{l.desc}</p>
                  </div>
                  <Lock size={20} color="#9CA3AF" />
                </div>
              ) : (
                <Link to="/module/syllables/level/$levelId" params={{ levelId: String(l.id) }} className="rounded-2xl p-4 bg-white shadow-edu-card flex items-center gap-3 active:scale-[0.98] spring">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl" style={{ background: l.color }}>{l.emoji}</div>
                  <div className="flex-1">
                    <p className="font-extrabold text-[15px]">Niveau {l.id} — {l.title}</p>
                    <p className="text-[12px] text-[#6B7280]">{l.desc}</p>
                  </div>
                  {isDone ? (
                    <span className="w-7 h-7 rounded-full bg-[#4CAF50] grid place-items-center"><Check size={16} color="#fff" strokeWidth={3} /></span>
                  ) : (
                    <span className="text-edu-primary font-extrabold">→</span>
                  )}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}