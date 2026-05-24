import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { getChild, type ChildState } from "@/lib/storage";
import { ALL_BADGES, LEVELS, computeLevel, levelProgressPct } from "@/lib/levels";

export const Route = createFileRoute("/badges")({ component: BadgesPage });

function BadgesPage() {
  const nav = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => { setC(getChild()); }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  const lvl = computeLevel(child.stars);
  const pct = levelProgressPct(child.stars);
  const cats = Array.from(new Set(ALL_BADGES.map((b) => b.cat)));

  return (
    <div className="min-h-screen bg-edu-bg pb-28">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Mes badges & Niveaux</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 rounded-[24px] p-6 text-white" style={{ background: "linear-gradient(135deg,#1A1A2E,#2D3748)" }}>
        <div className="flex items-center justify-between">
          <p className="font-black text-[22px]">{lvl.name}</p>
          <span className="bg-edu-primary px-3 py-1 rounded-full font-bold text-[12px]">Niveau {lvl.current}</span>
        </div>
        <div className="mt-4 h-[10px] rounded-full bg-white/15 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, type: "spring" }} className="h-full" style={{ background: "#FFE14D" }} />
        </div>
        <div className="flex justify-between mt-2 text-[13px]">
          <span className="font-bold">{lvl.xp} XP</span>
          <span className="text-white/60">{lvl.nextLevelXp} XP</span>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-extrabold text-[18px] text-edu-dark mb-4">Parcours des niveaux</h2>
        <div className="space-y-0">
          {LEVELS.map((l, idx) => {
            const completed = l.level < lvl.current;
            const current = l.level === lvl.current;
            const prevMax = idx === 0 ? 0 : LEVELS[idx - 1].maxXp;
            return (
              <div key={l.level}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-full grid place-items-center shrink-0 ${current ? "border-[3px] border-edu-primary bg-white" : ""}`}
                       style={{ background: completed ? "#FF6B35" : current ? "#fff" : "#F3F4F6" }}>
                    {completed ? <Check size={24} color="#fff" strokeWidth={3} /> :
                     current ? <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="font-black text-[16px] text-edu-primary">N.{l.level}</motion.span> :
                     <Lock size={20} color="#D1D5DB" />}
                  </div>
                  <div>
                    <p className="font-bold text-[15px]" style={{ color: completed ? "#4CAF50" : current ? "#FF6B35" : "#9CA3AF" }}>{l.name}</p>
                    <p className="font-medium text-[12px] text-edu-muted">{prevMax} → {l.maxXp} XP</p>
                  </div>
                </div>
                {idx < LEVELS.length - 1 && <div className="ml-6 h-6 border-l border-dashed border-[#E5E7EB]" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-7">
        <h2 className="font-extrabold text-[18px] text-edu-dark mb-3">Tous les badges</h2>
        {cats.map((cat) => {
          const items = ALL_BADGES.filter((b) => b.cat === cat);
          const catColor = items[0]?.color ?? "#FF6B35";
          return (
            <div key={cat} className="mb-5">
              <span className="inline-block font-bold text-[12px] uppercase tracking-[1px] rounded-full px-3 py-1 mb-3" style={{ background: catColor, color: "#1A1A2E" }}>{cat}</span>
              <div className="grid grid-cols-3 gap-3">
                {items.map((b, i) => {
                  const earned = child.badges.includes(b.id) || b.check(child);
                  const Icon = (LucideIcons as any)[b.icon] ?? LucideIcons.Award;
                  return (
                    <motion.div
                      key={b.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.06, type: "spring" }}
                      className="rounded-[20px] p-4 text-center"
                      style={{
                        height: 130,
                        background: earned ? b.color : "#F3F4F6",
                        boxShadow: earned ? "0 4px 14px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      {earned ? <Icon size={36} color="#fff" /> : <Lock size={28} color="#D1D5DB" className="mx-auto" />}
                      <p className={`mt-1.5 font-bold text-[12px] ${earned ? "text-white" : "text-[#D1D5DB]"}`}>{b.name}</p>
                      {!earned && <p className="text-[10px] font-medium text-edu-muted mt-1">{b.desc}</p>}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav context="child" />
    </div>
  );
}