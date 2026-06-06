import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Timer, Target } from "lucide-react";
import { audioEngine } from "@/lib/audio";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";

export const Route = createFileRoute("/games/memory")({ component: MemoryGame });

const PAIRS = [
  { emoji: "🦁", word: "Lion" },
  { emoji: "🐘", word: "Éléphant" },
  { emoji: "🦒", word: "Girafe" },
  { emoji: "🐸", word: "Grenouille" },
  { emoji: "🍎", word: "Pomme" },
  { emoji: "🍌", word: "Banane" },
  { emoji: "🥭", word: "Mangue" },
  { emoji: "⭐", word: "Étoile" },
  { emoji: "🦋", word: "Papillon" },
  { emoji: "🌙", word: "Lune" },
  { emoji: "🐬", word: "Dauphin" },
  { emoji: "🌳", word: "Arbre" },
];

const CONFIGS = {
  easy:   { pairs: 6,  cols: 3, label: "Facile 🟢" },
  medium: { pairs: 8,  cols: 4, label: "Moyen 🟡" },
  hard:   { pairs: 12, cols: 4, label: "Difficile 🔴" },
} as const;

type Diff = keyof typeof CONFIGS;
type Card = { uid: number; pairId: number; emoji: string; word: string };

const shuffle = <T,>(a: T[]): T[] => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

function MemoryGame() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"setup" | "playing" | "win">("setup");
  const [difficulty, setDifficulty] = useState<Diff>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [secs, setSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordedRef = useRef(false);

  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setSecs((s) => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startGame = () => {
    const cfg = CONFIGS[difficulty];
    const pool = shuffle(PAIRS).slice(0, cfg.pairs);
    const deck: Card[] = [];
    pool.forEach((p, pid) => {
      deck.push({ uid: pid * 2, pairId: pid, ...p });
      deck.push({ uid: pid * 2 + 1, pairId: pid, ...p });
    });
    setCards(shuffle(deck));
    setFlipped([]); setMatched(new Set()); setMoves(0); setSecs(0); setLocked(false);
    recordedRef.current = false;
    setPhase("playing");
    audioEngine.speak("Trouve les paires identiques !", { rate: 0.85 });
  };

  const tapCard = (uid: number) => {
    if (locked || matched.has(uid) || flipped.includes(uid) || flipped.length === 2) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = next;
      const ca = cards.find((c) => c.uid === a)!;
      const cb = cards.find((c) => c.uid === b)!;
      if (ca.pairId === cb.pairId) {
        setTimeout(() => {
          const nm = new Set(matched); nm.add(a); nm.add(b);
          setMatched(nm); setFlipped([]); setLocked(false);
          audioEngine.speak(ca.word, { pitch: 1.4, rate: 0.9 });
          if (nm.size === cards.length && !recordedRef.current) {
            recordedRef.current = true;
            if (timerRef.current) clearInterval(timerRef.current);
            const time = Math.round((Date.now() - 0) / 1000);
            const stars = moves <= cards.length ? 3 : moves <= cards.length * 1.5 ? 2 : 1;
            recordGameSession("memory", Math.max(10, 100 - moves), stars);
            const prev = getChild().highScores.memory;
            if (!prev || moves < prev.moves) saveHighScore("memory", { moves: moves + 1, time: secs, stars });
            setPhase("win");
            audioEngine.speak("Bravo ! Tu as gagné !", { pitch: 1.5, rate: 0.85 });
          }
        }, 500);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  };

  const cfg = CONFIGS[difficulty];

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
        <header className="flex items-center gap-3 px-5 py-4">
          <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#1A1A2E" /></button>
          <span className="font-extrabold text-[18px] text-edu-dark">Memory</span>
        </header>
        <div className="mx-4 mb-5 rounded-[24px] p-7 text-center text-white" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
          <div className="text-[56px]">🧠</div>
          <div className="font-black text-[26px] mt-2">Memory</div>
          <div className="font-medium text-[14px] opacity-90 mt-1">Retourne 2 cartes et trouve les paires !</div>
        </div>
        <div className="px-4">
          <div className="font-extrabold text-[18px] text-edu-dark mb-3">Difficulté</div>
          <div className="flex gap-2.5">
            {(Object.keys(CONFIGS) as Diff[]).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)} className="flex-1 rounded-2xl py-3.5 px-2 text-center border-2 font-bold text-[13px] active:scale-95 transition"
                style={{ borderColor: difficulty === d ? "#FF6B35" : "#E5E7EB", background: difficulty === d ? "#FFF0E8" : "#fff", color: difficulty === d ? "#FF6B35" : "#6B7280" }}>
                <div>{CONFIGS[d].label}</div>
                <div className="font-medium text-[11px] text-[#9CA3AF] mt-1">{CONFIGS[d].pairs} paires</div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pt-6">
          <button onClick={startGame} className="w-full h-14 rounded-[14px] text-white font-extrabold text-[17px] shadow-edu-card" style={{ background: "#FF6B35" }}>Commencer ! 🚀</button>
        </div>
      </div>
    );
  }

  if (phase === "win") {
    const stars = moves <= cfg.pairs ? 3 : moves <= cfg.pairs * 1.5 ? 2 : 1;
    return (
      <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col items-center justify-center px-6 py-8 text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
          <div className="text-[80px]">🎉</div>
        </motion.div>
        <div className="font-black text-[34px] mt-3" style={{ color: "#FF6B35" }}>Bravo !</div>
        <div className="font-semibold text-[16px] text-edu-muted mt-1">Tu as trouvé toutes les paires !</div>
        <div className="bg-edu-bg rounded-[20px] px-7 py-5 my-6 w-full flex justify-around">
          <div className="text-center"><div className="font-black text-[28px] text-edu-dark">{moves}</div><div className="font-medium text-[12px] text-[#9CA3AF]">Coups</div></div>
          <div className="text-center"><div className="font-black text-[28px] text-edu-dark">{secs}s</div><div className="font-medium text-[12px] text-[#9CA3AF]">Temps</div></div>
          <div className="text-center"><div className="font-black text-[28px]" style={{ color: "#FF6B35" }}>+{stars}⭐</div><div className="font-medium text-[12px] text-[#9CA3AF]">Étoiles</div></div>
        </div>
        <button onClick={startGame} className="w-full h-[52px] rounded-[14px] text-white font-extrabold text-[16px] mb-3" style={{ background: "#FF6B35" }}>Rejouer 🔄</button>
        <button onClick={() => nav({ to: "/games" })} className="w-full h-12 rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-edu-muted font-bold text-[15px]">Menu des jeux</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto pb-5" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center justify-between px-4 py-3 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={22} color="#6B7280" /></button>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1"><Target size={16} color="#FF6B35" /><span className="font-bold text-[14px] text-edu-dark">{moves}</span></div>
          <div className="flex items-center gap-1"><Timer size={16} color="#9CA3AF" /><span className="font-bold text-[14px] text-edu-muted">{secs}s</span></div>
          <div className="rounded-full px-2.5 py-1 font-bold text-[13px]" style={{ background: "#FFF0E8", color: "#FF6B35" }}>{matched.size / 2}/{cfg.pairs}</div>
        </div>
      </header>
      <div className="grid gap-2 p-4" style={{ gridTemplateColumns: `repeat(${cfg.cols},1fr)` }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uid);
          const isMatched = matched.has(card.uid);
          const faceUp = isFlipped || isMatched;
          return (
            <motion.div key={card.uid} onClick={() => tapCard(card.uid)} whileTap={{ scale: faceUp ? 1 : 0.93 }}
              className="aspect-square rounded-[14px] flex flex-col items-center justify-center font-extrabold shadow-edu-card"
              style={{
                background: isMatched ? "#E8F5E9" : faceUp ? "#FFFFFF" : "linear-gradient(135deg,#FF6B35,#FFB347)",
                border: isMatched ? "2px solid #4CAF50" : faceUp ? "2px solid #F3F4F6" : "none",
                color: faceUp ? "#1A1A2E" : "white",
                cursor: faceUp ? "default" : "pointer",
              }}>
              {faceUp ? (
                <>
                  <span className="text-[28px] leading-none">{card.emoji}</span>
                  <span className="font-bold text-[9px] mt-1" style={{ color: isMatched ? "#4CAF50" : "#9CA3AF" }}>{card.word}</span>
                </>
              ) : (
                <div className="w-8 h-8 rounded-full grid place-items-center font-black" style={{ background: "rgba(255,255,255,.3)" }}>E</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}