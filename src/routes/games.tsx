import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { GAME_META } from "@/data/games";
import { getChild } from "@/lib/storage";

export const Route = createFileRoute("/games")({ component: GamesHub });

function GamesHub() {
  const nav = useNavigate();
  const c = getChild();
  const hs = c.highScores;
  const items = [
    { id: "memory", to: "/games/memory" as const, best: hs.memory ? `${hs.memory.moves} coups` : null },
    { id: "find", to: "/games/find" as const, best: hs.find ? `${hs.find.totalTime}s` : null },
    { id: "puzzle", to: "/games/puzzle" as const, best: hs.puzzle ? `${hs.puzzle.moves} coups` : null },
    { id: "quiz", to: "/games/quiz" as const, best: hs.quiz ? `${hs.quiz.score} pts` : null },
  ];
  return (
    <div className="min-h-screen bg-edu-bg pb-28">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-extrabold text-[18px] text-edu-dark">🎮 Mini-jeux</h1>
        <div className="w-6" />
      </header>
      <div className="px-4 mt-4 grid grid-cols-2 gap-3.5">
        {items.map((it, i) => {
          const meta = (GAME_META as any)[it.id];
          return (
            <motion.div key={it.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.97 }}>
              <Link to={it.to} className="block rounded-[22px] h-[160px] p-4 text-white shadow-edu-card" style={{ background: meta.gradient }}>
                <p className="font-black text-[18px]">{meta.name}</p>
                <p className="font-semibold text-[12px] opacity-90">{meta.desc}</p>
                <p className="mt-2 text-[11px] font-bold opacity-90">{"⭐".repeat(meta.difficulty)}</p>
                <p className="mt-auto pt-6 text-[11px] font-bold opacity-90">{it.best ? `Meilleur : ${it.best}` : "Jamais joué"}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
      <div className="px-4 mt-5 bg-white rounded-[20px] p-4 shadow-edu-card flex items-center gap-3 mx-4">
        <Star size={28} fill="#FFE14D" color="#FFE14D" />
        <div>
          <p className="font-extrabold text-edu-dark text-[14px]">{c.stars} étoiles</p>
          <p className="font-medium text-[12px] text-edu-muted">Joue pour en gagner plus !</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}