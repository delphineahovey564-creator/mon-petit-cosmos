import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Trophy, Flame, Lock, Pencil, Headphones, Image as ImageIcon, RotateCcw, BookOpen } from "lucide-react";
import { ALPHABET } from "@/lib/eduData";
import { getChild, type ChildState } from "@/lib/storage";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/alphabet/")({ component: ModuleAlphabet });

function ModuleAlphabet() {
  const [child, setC] = useState<ChildState | null>(null);
  const nav = useNavigate();
  useEffect(() => setC(getChild()), []);
  if (!child) return <div className="min-h-screen bg-[#FFF9F0]" />;

  const done = new Set(child.completedLetters);
  const lastIdx = ALPHABET.reduce((acc, l, i) => (done.has(l) ? i : acc), -1);
  const currentIdx = lastIdx + 1;

  function getState(letter: string, i: number) {
    if (done.has(letter)) return "completed";
    if (i === currentIdx) return "current";
    return "locked";
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home" className="p-1"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">L'Alphabet</h1>
        <div className="flex items-center gap-1 bg-[#FFFBEB] rounded-full px-3 py-1.5">
          <Star size={14} fill="#FFE14D" color="#FFE14D" />
          <span className="font-extrabold text-[13px] text-[#1A1A2E]">{child.stars}</span>
        </div>
      </header>

      <section className="mx-4 mt-4">
        <div className="relative overflow-hidden rounded-[24px] p-5" style={{ height: 160, background: "linear-gradient(135deg,#FFB3BA,#FF8FA3)" }}>
          <div className="absolute" style={{ right: -10, top: -20, transform: "rotate(15deg)" }}>
            <span className="font-black text-white" style={{ fontSize: 130, opacity: 0.12, lineHeight: 1 }}>A</span>
          </div>
          <div className="absolute right-2 bottom-0"><Leo size={80} /></div>
          <div className="relative z-10">
            <span className="inline-block bg-white text-[#FF8FA3] font-bold text-[11px] uppercase rounded-full px-2.5 py-1">Niveau 2</span>
            <h2 className="mt-1.5 text-white font-black text-[30px] leading-tight">L'Alphabet</h2>
            <p className="text-white/85 font-semibold text-[13px]">26 lettres à maîtriser</p>
            <div className="mt-2.5 inline-block bg-white rounded-full px-3 py-1">
              <span className="text-[#FF8FA3] font-bold text-[13px]">{child.completedLetters.length} / 26 lettres</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card px-5 py-4 flex justify-around">
        <Stat icon={<Trophy size={20} color="#FF6B35" />} value={child.completedLetters.length} label="MAÎTRISÉES" />
        <div className="w-px bg-[#F3F4F6]" />
        <Stat icon={<Star size={20} fill="#FFE14D" color="#FFE14D" />} value={child.stars} label="ÉTOILES" />
        <div className="w-px bg-[#F3F4F6]" />
        <Stat icon={<Flame size={20} color="#FF5252" />} value={child.streak} label="JOURS" color="#FF5252" />
      </section>

      <div className="px-4 mt-5 flex items-center justify-between">
        <h3 className="font-extrabold text-[18px] text-[#1A1A2E]">Comment veux-tu apprendre ?</h3>
        <button onClick={() => nav({ to: "/module/alphabet/dictionary" })} className="flex items-center gap-1.5 bg-[#FFF0E8] rounded-full px-3.5 py-1.5">
          <BookOpen size={14} color="#FF6B35" /><span className="font-bold text-[13px] text-[#FF6B35]">Dictionnaire</span>
        </button>
      </div>
      <div className="mt-3 pl-4 flex gap-3 overflow-x-auto pb-2 pr-4">
        {[
          { id:"trace", bg:"#FFB3BA", Icon:Pencil, title:"Tracer", sub:"Suis les pointillés", onClick:() => document.getElementById("alphabet-grid")?.scrollIntoView({ behavior: "smooth" }) },
          { id:"listen", bg:"#B5EAD7", Icon:Headphones, title:"Écouter", sub:"Quel son entends-tu ?", onClick:() => nav({ to: "/module/alphabet/listen" }) },
          { id:"words", bg:"#C7CEEA", Icon:ImageIcon, title:"Mots illustrés", sub:"Trouve la lettre", onClick:() => nav({ to: "/module/alphabet/words" }) },
          { id:"review", bg:"#FFDAC1", Icon:RotateCcw, title:"Révision", sub:"Quiz éclair", onClick:() => nav({ to: "/module/alphabet/review" }) },
        ].map((m) => (
          <motion.button key={m.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={m.onClick}
            className="shrink-0 min-w-[130px] h-[90px] rounded-[20px] p-3.5 text-left text-white" style={{ background: m.bg }}>
            <m.Icon size={24} color="white" />
            <p className="mt-1 font-extrabold text-[14px]">{m.title}</p>
            <p className="font-medium text-[11px] text-white/80">{m.sub}</p>
          </motion.button>
        ))}
      </div>

      <h3 id="alphabet-grid" className="px-4 mt-5 font-extrabold text-[20px] text-[#1A1A2E]">Choisis une lettre</h3>
      <div className="px-4 mt-3 grid grid-cols-5 gap-2">
        {ALPHABET.map((letter, i) => {
          const state = getState(letter, i);
          return (
            <motion.button
              key={letter}
              initial={{ scale: 0, opacity: 0 }}
              animate={state === "current"
                ? { scale: 1, opacity: 1, borderColor: ["#FF6B35", "rgba(255,107,53,0.2)", "#FF6B35"] }
                : { scale: 1, opacity: 1 }}
              transition={state === "current"
                ? { delay: i * 0.02, borderColor: { duration: 1.5, repeat: Infinity } }
                : { delay: i * 0.02 }}
              whileHover={{ scale: state === "locked" ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (state === "locked") {
                  alert("Continue pour débloquer cette lettre !");
                  return;
                }
                nav({ to: "/module/alphabet/letter/$letter", params: { letter } });
              }}
              className="relative rounded-[14px] grid place-items-center font-black text-[20px]"
              style={{
                width: "100%", aspectRatio: "1",
                background: state === "completed" ? "#FF6B35" : state === "current" ? "#FFFFFF" : "#F3F4F6",
                color: state === "completed" ? "#FFFFFF" : state === "current" ? "#FF6B35" : "transparent",
                border: state === "current" ? "2px dashed #FF6B35" : "none",
              }}
            >
              {state === "locked" ? <Lock size={16} color="#D1D5DB" /> : letter}
              {state === "completed" && (
                <Star size={10} fill="#FFE14D" color="#FFE14D" className="absolute top-1 right-1" />
              )}
            </motion.button>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}

function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color?: string }) {
  return (
    <div className="text-center flex-1">
      <div className="flex justify-center">{icon}</div>
      <p className="font-black text-[22px]" style={{ color: color ?? "#1A1A2E" }}>{value}</p>
      <p className="font-medium text-[11px] text-[#9CA3AF]">{label}</p>
    </div>
  );
}
