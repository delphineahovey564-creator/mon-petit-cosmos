import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MEMORY_PAIRS } from "@/data/games";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/games/memory")({ component: MemoryGame });

type Card = { id: number; key: string; label: string; emoji: boolean };

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function MemoryGame() {
  const nav = useNavigate();
  const deck = useMemo<Card[]>(() => {
    const pairs = shuffle(MEMORY_PAIRS).slice(0, 6);
    const cards: Card[] = [];
    pairs.forEach((p, i) => {
      cards.push({ id: i * 2, key: p.word, label: p.emoji, emoji: true });
      cards.push({ id: i * 2 + 1, key: p.word, label: p.word, emoji: false });
    });
    return shuffle(cards);
  }, []);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [t0] = useState(Date.now());
  const [done, setDone] = useState(false);

  function flip(i: number) {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(deck[i].key)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (deck[i].emoji) speak(deck[i].key);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].key === deck[b].key) {
        setTimeout(() => { setMatched((m) => [...m, deck[a].key]); setFlipped([]); speak("Super !"); }, 500);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }

  useEffect(() => {
    if (matched.length === 6 && !done) {
      setDone(true);
      const time = Math.round((Date.now() - t0) / 1000);
      const stars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;
      recordGameSession("memory", 100 - moves, stars);
      const prev = getChild().highScores.memory;
      if (!prev || moves < prev.moves) saveHighScore("memory", { moves, time, stars });
      setTimeout(() => nav({ to: "/victory", search: { moduleName: "Memory", starsEarned: stars, achievementText: `${moves} coups en ${time}s !` } }), 800);
    }
  }, [matched, moves, done, nav, t0]);

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-extrabold text-[18px] text-edu-dark">Memory</h1>
        <span className="font-bold text-[13px] text-edu-muted">{moves} coups</span>
      </header>
      <p className="text-center mt-4 font-semibold text-edu-muted text-[14px]">Trouve les paires emoji ↔ mot</p>
      <div className="px-4 mt-5 grid grid-cols-3 gap-3 max-w-[430px] mx-auto">
        {deck.map((c, i) => {
          const isUp = flipped.includes(i) || matched.includes(c.key);
          return (
            <motion.button
              key={c.id} onClick={() => flip(i)} whileTap={{ scale: 0.95 }}
              className="aspect-square rounded-2xl grid place-items-center text-center font-extrabold shadow-edu-card"
              animate={{ rotateY: isUp ? 0 : 180, background: isUp ? (matched.includes(c.key) ? "#D4EDDA" : "#FFFFFF") : "#FF6B35" }}
              transition={{ duration: 0.3 }}
              style={{ color: isUp ? "#1A1A2E" : "transparent" }}
            >
              <span className={c.emoji ? "text-[40px]" : "text-[14px] px-1"}>{isUp ? c.label : "?"}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}