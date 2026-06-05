import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PUZZLE_THEMES } from "@/data/games";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/games/puzzle")({ component: PuzzleGame });

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function PuzzleGame() {
  const nav = useNavigate();
  const theme = useMemo(() => PUZZLE_THEMES[Math.floor(Math.random() * PUZZLE_THEMES.length)], []);
  const target = theme.grid3x3;
  const [tiles, setTiles] = useState<string[]>(() => {
    let s = shuffle(target);
    while (s.every((v, i) => v === target[i])) s = shuffle(target);
    return s;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  function tap(i: number) {
    if (selected === null) { setSelected(i); return; }
    if (selected === i) { setSelected(null); return; }
    const next = [...tiles];
    [next[selected], next[i]] = [next[i], next[selected]];
    setTiles(next);
    setSelected(null);
    setMoves((m) => m + 1);
  }

  useEffect(() => {
    if (!done && tiles.every((v, i) => v === target[i])) {
      setDone(true);
      speak("Puzzle terminé !");
      const stars = moves <= 10 ? 3 : moves <= 20 ? 2 : 1;
      recordGameSession("puzzle", 100 - moves, stars);
      const prev = getChild().highScores.puzzle;
      if (!prev || moves < prev.moves) saveHighScore("puzzle", { moves, stars });
      setTimeout(() => nav({ to: "/victory", search: { moduleName: "Puzzle", starsEarned: stars, achievementText: `${theme.name} en ${moves} coups !` } }), 800);
    }
  }, [tiles, done, moves, nav, target, theme.name]);

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-extrabold text-[18px] text-edu-dark">{theme.emoji} {theme.name}</h1>
        <span className="font-bold text-[13px] text-edu-muted">{moves} coups</span>
      </header>
      <p className="text-center mt-3 font-semibold text-edu-muted text-[13px] px-4">Touche 2 cases pour les échanger</p>
      <div className="px-4 mt-4 grid grid-cols-3 gap-2 max-w-[400px] mx-auto">
        {tiles.map((t, i) => (
          <motion.button key={i} onClick={() => tap(i)} whileTap={{ scale: 0.94 }}
            animate={{ scale: selected === i ? 1.05 : 1, borderColor: selected === i ? "#FF6B35" : "transparent" }}
            className="aspect-square rounded-xl grid place-items-center text-[40px] bg-white shadow-edu-card border-2">
            {t}
          </motion.button>
        ))}
      </div>
    </div>
  );
}