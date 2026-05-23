import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { STORIES } from "@/lib/eduData";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/stories/")({ component: StoriesModule });

const CATEGORIES = ["Toutes", "Contes africains", "Bible", "Fables", "Imaginaires"];

function StoriesModule() {
  const [cat, setCat] = useState("Toutes");
  const nav = useNavigate();
  const filtered = cat === "Toutes" ? STORIES : STORIES.filter((s) => s.category === cat);

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home" className="p-1"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Histoires</h1>
        <div className="w-8" />
      </header>

      <section className="mx-4 mt-4">
        <div className="relative overflow-hidden rounded-[24px] p-5" style={{ height: 160, background: "linear-gradient(135deg,#D4EDDA,#52A874)" }}>
          <div className="absolute right-2 bottom-0"><Leo size={80} /></div>
          <div className="relative z-10">
            <span className="inline-block bg-white text-[#52A874] font-bold text-[11px] uppercase rounded-full px-2.5 py-1">Lecture</span>
            <h2 className="mt-1.5 text-white font-black text-[28px] leading-tight">Histoires & Lecture</h2>
            <p className="text-white/85 font-semibold text-[13px]">Lis, écoute et imagine !</p>
          </div>
        </div>
      </section>

      <div className="mx-4 mt-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-4 py-2 font-bold text-[13px] border ${active ? "bg-edu-primary text-white border-edu-primary" : "bg-white text-[#6B7280] border-[#E5E7EB]"}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {filtered.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => nav({ to: "/module/stories/story/$storyId", params: { storyId: s.id } })}
            className="relative rounded-[20px] p-4 text-left flex flex-col"
            style={{ background: s.bg, height: 170 }}
          >
            <span className="absolute top-2 right-2 bg-white text-[#6B7280] font-bold text-[10px] rounded-full px-2 py-0.5">{s.category}</span>
            <span className="text-[40px] leading-none">{s.emoji}</span>
            <p className="mt-2 font-extrabold text-[15px] text-[#1A1A2E] leading-tight">{s.title}</p>
            <div className="mt-auto flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1 text-[#6B7280] font-medium"><Clock size={12} /> {s.duration}</span>
              <span className="flex items-center gap-1 font-bold text-[#1A1A2E]"><Star size={12} fill="#FFE14D" color="#FFE14D" /> +{s.stars}</span>
            </div>
          </motion.button>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}