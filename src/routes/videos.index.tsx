import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, PlayCircle, Lock } from "lucide-react";
import { VIDEOS_DATA, VIDEO_CATEGORIES, type EducVideo } from "@/data/videos";
import { BottomNav } from "@/components/educ/BottomNav";
import { isPremium } from "@/lib/premium";

export const Route = createFileRoute("/videos/")({ component: VideosHome });

function VideosHome() {
  const [cat, setCat] = useState("Tout");
  const nav = useNavigate();
  const premium = isPremium();

  const filtered = cat === "Tout" ? VIDEOS_DATA : VIDEOS_DATA.filter((v) => v.category === cat);

  function open(v: EducVideo) {
    if (!v.isFree && !premium) { nav({ to: "/pricing" }); return; }
    nav({ to: "/videos/watch/$videoId", params: { videoId: v.id } });
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-extrabold text-[18px] text-[#1A1A2E]">Vidéos Éducatives</h1>
        <div className="w-6" />
      </header>

      <section className="mx-4 mt-4 rounded-[24px] p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1A1A2E,#2D3748)", minHeight: 140 }}>
        <PlayCircle size={80} className="absolute -right-2 top-1/2 -translate-y-1/2 text-white/20" />
        <span className="inline-block bg-edu-primary text-white text-[10px] font-extrabold rounded-full px-2 py-1 uppercase">En français ✓</span>
        <h2 className="mt-2 text-white font-black text-[22px]">Apprends en regardant !</h2>
        <p className="text-white/70 font-medium text-[13px]">Des vidéos choisies pour toi</p>
        <p className="mt-1 text-[#FFE14D] font-bold text-[13px]">{VIDEOS_DATA.length} vidéos disponibles</p>
      </section>

      <div className="mx-4 mt-4 flex gap-2 overflow-x-auto pb-1">
        {VIDEO_CATEGORIES.map((c) => {
          const active = c === cat;
          return (
            <button key={c} onClick={() => setCat(c)}
              className="shrink-0 rounded-full px-4 py-2 font-bold text-[13px] border"
              style={{ background: active ? "#FF6B35" : "#fff", color: active ? "#fff" : "#6B7280", borderColor: active ? "#FF6B35" : "#E5E7EB" }}>
              {c}
            </button>
          );
        })}
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {filtered.map((v, i) => {
          const locked = !v.isFree && !premium;
          return (
            <motion.button key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.97 }} onClick={() => open(v)}
              className="rounded-[16px] overflow-hidden bg-white shadow-edu-card text-left flex flex-col">
              <div className="relative bg-[#1A1A2E]" style={{ height: 110 }}>
                <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title}
                  loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-9 h-9 rounded-full bg-white/85 grid place-items-center">
                    {locked ? <Lock size={14} color="#1A1A2E" /> : <Play size={14} color="#1A1A2E" fill="#1A1A2E" />}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold rounded px-1.5 py-0.5">{v.durationMin} min</span>
                <span className="absolute top-1 left-1 text-white text-[10px] font-bold rounded px-1.5 py-0.5" style={{ background: v.isFree ? "#4CAF50" : "#FF6B35" }}>
                  {v.isFree ? "Gratuit" : "Premium"}
                </span>
              </div>
              <div className="p-2.5">
                <p className="font-bold text-[13px] text-[#1A1A2E] line-clamp-2 leading-tight">{v.title}</p>
                <p className="mt-1 font-medium text-[11px] text-[#9CA3AF] truncate">{v.channel}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}