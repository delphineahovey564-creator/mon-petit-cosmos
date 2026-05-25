import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Heart } from "lucide-react";
import { STORIES } from "@/lib/eduData";
import { getChild, toggleFavoriteStory } from "@/lib/storage";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/stories/")({ component: StoriesModule });

const CATEGORIES = ["Toutes", "Contes africains", "Bible", "Fables", "Imaginaires"];

function StoriesModule() {
  const [cat, setCat] = useState("Toutes");
  const [tab, setTab] = useState<"all" | "favs">("all");
  const [favs, setFavs] = useState<string[]>([]);
  const nav = useNavigate();

  useEffect(() => { setFavs(getChild().favoriteStories); }, []);

  function toggle(id: string) {
    const next = toggleFavoriteStory(id);
    setFavs(next.favoriteStories);
  }

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

      <div className="mx-4 mt-4 flex gap-2">
        {(["all","favs"] as const).map((t) => (
          <button key={t} onClick={() => { if (t === "favs") nav({ to: "/module/stories/favorites" }); else setTab(t); }}
            className="flex-1 h-10 rounded-xl font-bold text-[14px]"
            style={{ background: tab === t ? "#FF6B35" : "#FFFFFF", color: tab === t ? "#FFFFFF" : "#6B7280", border: tab === t ? "none" : "1.5px solid #E5E7EB" }}>
            {t === "all" ? "Toutes" : "Mes favoris"}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => {
          const active = c === cat;
          return (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-4 py-2 font-bold text-[13px] border ${active ? "bg-edu-primary text-white border-edu-primary" : "bg-white text-[#6B7280] border-[#E5E7EB]"}`}>
              {c}
            </button>
          );
        })}
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {filtered.map((s, i) => {
          const isFav = favs.includes(s.id);
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="relative rounded-[20px] p-4 text-left flex flex-col" style={{ background: s.bg, height: 170 }}>
              <motion.button whileTap={{ scale: 1.4 }} onClick={(e) => { e.stopPropagation(); toggle(s.id); }} className="absolute top-2 right-2 z-10">
                <Heart size={20} fill={isFav ? "#FF5252" : "transparent"} color={isFav ? "#FF5252" : "#D1D5DB"} />
              </motion.button>
              <button onClick={() => nav({ to: "/module/stories/story/$storyId", params: { storyId: s.id } })} className="absolute inset-0 z-0" />
              <span className="text-[40px] leading-none relative">{s.emoji}</span>
              <p className="mt-2 font-extrabold text-[15px] text-[#1A1A2E] leading-tight relative">{s.title}</p>
              <div className="mt-auto flex items-center justify-between text-[12px] relative">
                <span className="flex items-center gap-1 text-[#6B7280] font-medium"><Clock size={12} /> {s.duration}</span>
                <span className="flex items-center gap-1 font-bold text-[#1A1A2E]"><Star size={12} fill="#FFE14D" color="#FFE14D" /> +{s.stars}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
