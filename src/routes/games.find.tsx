import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { FIND_ROUNDS } from "@/data/games";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/games/find")({ component: FindGame });

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function FindGame() {
  const nav = useNavigate();
  const rounds = useMemo(() => shuffle(FIND_ROUNDS).slice(0, 5), []);
  const [idx, setIdx] = useState(0);
  const [t0] = useState(Date.now());
  const [wrong, setWrong] = useState<number | null>(null);
  const round = rounds[idx];

  const grid = useMemo(() => {
    const items = shuffle([round.target, ...shuffle(round.distractors).slice(0, 8)]);
    return items;
  }, [round]);

  useEffect(() => { speak(`Trouve ${round.target}`); }, [round]);

  function pick(i: number) {
    if (grid[i] === round.target) {
      speak("Bravo !");
      if (idx + 1 >= rounds.length) {
        const time = Math.round((Date.now() - t0) / 1000);
        const stars = time <= 30 ? 3 : time <= 60 ? 2 : 1;
        recordGameSession("find", 100 - time, stars);
        const prev = getChild().highScores.find;
        if (!prev || time < prev.totalTime) saveHighScore("find", { totalTime: time, stars });
        setTimeout(() => nav({ to: "/victory", search: { moduleName: "Cherche & Trouve", starsEarned: stars, achievementText: `Terminé en ${time}s !` } }), 600);
      } else {
        setTimeout(() => setIdx((i) => i + 1), 400);
      }
    } else {
      setWrong(i);
      setTimeout(() => setWrong(null), 400);
    }
  }

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-extrabold text-[18px] text-edu-dark">Cherche & Trouve</h1>
        <span className="font-bold text-[13px] text-edu-muted">{idx + 1}/{rounds.length}</span>
      </header>
      <div className="text-center mt-5 px-4">
        <p className="font-bold text-edu-muted text-[14px]">Thème : {round.theme}</p>
        <p className="font-black text-edu-dark text-[20px] mt-1">Trouve <span className="text-[36px]">{round.target}</span></p>
      </div>
      <div className="px-4 mt-5 grid grid-cols-3 gap-3 max-w-[430px] mx-auto">
        {grid.map((g, i) => (
          <motion.button key={i} onClick={() => pick(i)} whileTap={{ scale: 0.92 }}
            animate={{ background: wrong === i ? "#FFB3BA" : "#FFFFFF", x: wrong === i ? [-4, 4, -4, 0] : 0 }}
            className="aspect-square rounded-2xl grid place-items-center text-[40px] shadow-edu-card">
            {g}
          </motion.button>
        ))}
      </div>
    </div>
  );
}