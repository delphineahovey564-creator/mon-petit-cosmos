import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { audioEngine } from "@/lib/audio";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";

export const Route = createFileRoute("/games/find")({ component: FindGame });

const ROUNDS = [
  { target: "🦁", name: "lion",     pool: ["🐘","🦒","🐸","🐧","🦊","🐨","🦋","🐬","🦓","🐆","🦏","🐃","🦬","🦌","🐊","🦙","🐑","🦝"] },
  { target: "🍎", name: "pomme",    pool: ["🍌","🥭","🍊","🍋","🍇","🍓","🍒","🍑","🥝","🍐","🫐","🍈","🥥","🍍","🍅","🥑","🍆","🥦"] },
  { target: "⭐", name: "étoile",   pool: ["🌙","☀️","⚡","🌈","❄️","🌸","💧","🔥","🌊","🍀","💎","🎯","🔮","🌺","🦄","🌟","💫","🌻"] },
  { target: "🐟", name: "poisson",  pool: ["🐬","🦈","🐳","🦑","🦞","🦀","🐙","🦐","🐠","🐡","🦭","🐚","🪸","🪼","🐊","🦎","🐢","🦦"] },
  { target: "🌳", name: "arbre",    pool: ["🌴","🌵","🌿","🍀","🌾","🍄","🌺","🌻","🌹","🌷","🪷","🍁","🍂","🍃","🪴","🌱","🌲","🎋"] },
  { target: "🎈", name: "ballon",   pool: ["🎉","🎂","🎁","🎠","🎡","🎢","🎪","🎭","🎨","🎯","🪀","🎻","🎸","🥁","🎺","🎷","🪗","🎵"] },
  { target: "✈️", name: "avion",    pool: ["🚗","🚂","🚢","🚁","🛸","🚀","🛺","🛵","🚌","🚐","🚑","🚒","🛻","🚜","🏎️","🚕","🚙","🛳"] },
  { target: "📚", name: "livres",   pool: ["✏️","📝","🖊️","📐","📏","🔬","🔭","🎒","🖍️","📌","📎","🗂️","📋","📁","🖇️","🗒️","📓","📔"] },
  { target: "🦋", name: "papillon", pool: ["🐝","🐛","🐌","🐜","🪲","🪳","🦗","🦟","🪰","🕷️","🦂","🐞","🪱","🐾","🦎","🐍","🦖","🦕"] },
  { target: "🏆", name: "trophée",  pool: ["🥇","🥈","🥉","🎖️","🏅","🎗️","🏵️","🎫","🎟️","🃏","🎴","♟️","🎲","🎯","🪃","🎳","🎾","⚽"] },
];

const shuffle = <T,>(a: T[]): T[] => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

function FindGame() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"intro" | "playing" | "win">("intro");
  const [round, setRound] = useState(0);
  const [grid, setGrid] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [totalPts, setTotalPts] = useState(0);
  const [found, setFound] = useState(false);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [correctIdx, setCorrectIdx] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildGrid = (r: number) => {
    const rd = ROUNDS[r];
    const pool = shuffle([...rd.pool]).slice(0, 29);
    const pos = Math.floor(Math.random() * 30);
    pool.splice(pos, 0, rd.target);
    return pool.slice(0, 30);
  };

  const startRound = (r: number) => {
    setGrid(buildGrid(r)); setElapsed(0); setFound(false); setWrongIdx(null); setCorrectIdx(null);
    setPhase("playing");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    setTimeout(() => audioEngine.speak(`Trouve le ${ROUNDS[r].name} !`, { rate: 0.85 }), 300);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const tapCell = (idx: number, emoji: string) => {
    if (found) return;
    const target = ROUNDS[round].target;
    if (emoji === target) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFound(true); setCorrectIdx(idx);
      const pts = Math.max(1, 10 - elapsed);
      const newPts = totalPts + pts;
      const newTime = totalTime + elapsed;
      setTotalPts(newPts); setTotalTime(newTime);
      audioEngine.speak("Trouvé ! Bravo !", { pitch: 1.5, rate: 0.9 });
      setTimeout(() => {
        if (round >= ROUNDS.length - 1) {
          const stars = newPts >= 70 ? 3 : newPts >= 40 ? 2 : 1;
          recordGameSession("find", newPts, stars);
          const prev = getChild().highScores.find;
          if (!prev || newTime < prev.totalTime) saveHighScore("find", { totalTime: newTime, stars });
          setPhase("win");
        } else { setRound((r) => r + 1); startRound(round + 1); }
      }, 1200);
    } else {
      setWrongIdx(idx); audioEngine.speak("Non ! Continue !", { pitch: 1.2, rate: 0.9 });
      setTimeout(() => setWrongIdx(null), 500);
    }
  };

  if (phase === "intro") return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#1A1A2E" /></button>
        <span className="font-extrabold text-[18px] text-edu-dark">Cherche et Trouve</span>
      </header>
      <div className="mx-4 mb-5 rounded-[24px] p-7 text-center text-white" style={{ background: "linear-gradient(135deg,#2EC4B6,#26A69A)" }}>
        <div className="text-[56px]">🔍</div>
        <div className="font-black text-[24px] mt-2">Cherche et Trouve</div>
        <div className="font-medium text-[14px] opacity-90 mt-1">Trouve l'objet caché parmi les autres !</div>
        <div className="mt-3 font-bold text-[13px]" style={{ color: "#FFE14D" }}>10 niveaux • Plus tu es rapide, plus tu marques !</div>
      </div>
      <div className="px-4">
        <div className="bg-white rounded-[20px] p-5 shadow-edu-card">
          <div className="font-extrabold text-[16px] text-edu-dark mb-3.5">Comment jouer ?</div>
          {[["👁️", "Regarde bien la cible en haut"], ["🔍", "Cherche-la dans les 30 cases"], ["⚡", "Touche-la le plus vite possible"]].map(([i, t]) => (
            <div key={t} className="flex items-center gap-3 mb-2.5">
              <span className="text-[22px]">{i}</span>
              <span className="font-semibold text-[14px] text-edu-muted">{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pt-6">
        <button onClick={() => startRound(0)} className="w-full h-14 rounded-[14px] text-white font-extrabold text-[17px] shadow-edu-card" style={{ background: "#2EC4B6" }}>Commencer ! 🚀</button>
      </div>
    </div>
  );

  if (phase === "win") return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col items-center justify-center px-6 py-8 text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="text-[80px]">🏆</div>
      <div className="font-black text-[32px] mt-3" style={{ color: "#2EC4B6" }}>Terminé !</div>
      <div className="font-semibold text-[16px] text-edu-muted mt-1">Tu as trouvé tous les objets !</div>
      <div className="rounded-[20px] py-5 px-8 my-6 w-full" style={{ background: "#F0FBF9" }}>
        <div className="font-black text-[36px]" style={{ color: "#FF6B35" }}>{totalPts} pts</div>
        <div className="font-bold text-[14px] text-[#9CA3AF]">Score total / 100</div>
        <div className="font-black text-[24px] mt-2" style={{ color: "#FF6B35" }}>+{totalPts}⭐</div>
      </div>
      <button onClick={() => { setRound(0); setTotalPts(0); setTotalTime(0); startRound(0); }} className="w-full h-[52px] rounded-[14px] text-white font-extrabold text-[16px] mb-3" style={{ background: "#2EC4B6" }}>Rejouer 🔄</button>
      <button onClick={() => nav({ to: "/games" })} className="w-full h-12 rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-edu-muted font-bold text-[15px]">Menu des jeux</button>
    </div>
  );

  const rd = ROUNDS[round];
  return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto pb-5" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center justify-between px-4 py-3 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={22} color="#6B7280" /></button>
        <div className="rounded-full px-3.5 py-1 font-bold text-[13px] text-white" style={{ background: "#2EC4B6" }}>Niveau {round + 1} / {ROUNDS.length}</div>
        <div className="font-bold text-[14px]" style={{ color: "#FF6B35" }}>{totalPts} pts</div>
      </header>
      <div className="mx-4 my-3 bg-white rounded-[20px] shadow-edu-card px-5 py-3.5 flex items-center gap-4">
        <div>
          <div className="font-semibold text-[12px] text-[#9CA3AF] mb-0.5">Tu cherches :</div>
          <div className="font-extrabold text-[16px] text-edu-dark">Le/La {rd.name}</div>
        </div>
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-auto text-[52px] leading-none">{rd.target}</motion.div>
        <div className="rounded-full px-3 py-1.5 font-black text-[18px] min-w-[48px] text-center"
          style={{ background: elapsed < 5 ? "#E8F5E9" : elapsed < 10 ? "#FFF3E0" : "#FFEBEE", color: elapsed < 5 ? "#4CAF50" : elapsed < 10 ? "#FFB347" : "#FF5252" }}>
          {elapsed}s
        </div>
      </div>
      <div className="grid gap-1.5 px-3" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {grid.map((emoji, idx) => (
          <motion.button key={idx} onClick={() => tapCell(idx, emoji)} initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: correctIdx === idx ? 1.2 : 1, opacity: 1 }} transition={{ delay: idx * 0.015, duration: 0.2 }} whileTap={{ scale: 0.88 }}
            className="aspect-square rounded-[12px] text-[22px] flex items-center justify-center shadow-edu-card"
            style={{ background: correctIdx === idx ? "#4CAF50" : wrongIdx === idx ? "#FF5252" : "white", border: "none" }}>
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}