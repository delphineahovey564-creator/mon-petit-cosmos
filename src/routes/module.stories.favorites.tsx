import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Clock, Star } from "lucide-react";
import { STORIES } from "@/lib/eduData";
import { getChild } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";
import { BottomNav } from "@/components/educ/BottomNav";

export const Route = createFileRoute("/module/stories/favorites")({ component: StoryFavorites });

function StoryFavorites() {
  const nav = useNavigate();
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => { setFavs(getChild().favoriteStories); }, []);
  const list = STORIES.filter((s) => favs.includes(s.id));

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/stories"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px]">Mes Histoires Favorites</h1>
        <Heart size={20} fill="#FF5252" color="#FF5252" />
      </header>

      {!list.length ? (
        <div className="text-center px-6 py-10">
          <Leo size={80} float />
          <h2 className="mt-4 font-bold text-[18px] text-[#9CA3AF]">Aucun favori pour l'instant !</h2>
          <p className="mt-2 font-medium text-[14px] text-[#9CA3AF]">Appuie sur le ❤️ d'une histoire pour la sauvegarder</p>
          <Link to="/module/stories" className="mt-6 inline-block h-[52px] px-6 rounded-xl bg-[#FF6B35] text-white font-extrabold leading-[52px]">Voir toutes les histoires</Link>
        </div>
      ) : (
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          {list.map((s, i) => (
            <motion.button key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => nav({ to: "/module/stories/story/$storyId", params: { storyId: s.id } })}
              className="relative rounded-[20px] p-4 text-left flex flex-col" style={{ background: s.bg, height: 170 }}>
              <Heart size={20} fill="#FF5252" color="#FF5252" className="absolute top-2 right-2" />
              <span className="text-[40px] leading-none">{s.emoji}</span>
              <p className="mt-2 font-extrabold text-[15px] text-[#1A1A2E] leading-tight">{s.title}</p>
              <div className="mt-auto flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1 text-[#6B7280] font-medium"><Clock size={12} /> {s.duration}</span>
                <span className="flex items-center gap-1 font-bold text-[#1A1A2E]"><Star size={12} fill="#FFE14D" color="#FFE14D" /> +{s.stars}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
