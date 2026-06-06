import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";
import { audioEngine } from "@/lib/audio";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";

export const Route = createFileRoute("/games/puzzle")({ component: PuzzleGame });

const THEMES = [
  { name: "La Savane 🌍", color: "#FFEAA7", grid: ["☀️","🌤️","⛅","🦒","🦁","🌳","🌿","🐘","🌾"] },
  { name: "L'Océan 🌊",   color: "#B5EAD7", grid: ["🌊","🐬","🌊","🐟","🦈","🐠","🪸","🐙","🪸"] },
  { name: "La Forêt 🌲",  color: "#D4EDDA", grid: ["🌲","🌲","🌲","🦊","🌺","🐦","🍄","🌿","🌸"] },
  { name: "L'Espace 🚀",  color: "#C7CEEA", grid: ["⭐","🌙","⭐","🪐","🚀","🌟","⭐","🌌","💫"] },
];
const SIZE = 3;

const getNeighbors = (idx: number) => {
  const row = Math.floor(idx / SIZE), col = idx % SIZE; const n: number[] = [];
  if (row > 0) n.push(idx - SIZE); if (row < SIZE - 1) n.push(idx + SIZE);
  if (col > 0) n.push(idx - 1);    if (col < SIZE - 1) n.push(idx + 1);
  return n;
};

const shuffleBoard = (solved: string[]): [string[], number] => {
  const g = [...solved]; g[SIZE * SIZE - 1] = ""; let eIdx = SIZE * SIZE - 1;
  for (let i = 0; i < 150; i++) {
    const nbrs = getNeighbors(eIdx); const pick = nbrs[Math.floor(Math.random() * nbrs.length)];
    [g[eIdx], g[pick]] = [g[pick], g[eIdx]]; eIdx = pick;
  }
  return [g, eIdx];
};

function PuzzleGame() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"setup" | "playing" | "win">("setup");
  const [themeIdx, setThemeIdx] = useState(0);
  const [tiles, setTiles] = useState<string[]>([]);
  const [emptyIdx, setEmptyIdx] = useState(8);
  const [moves, setMoves] = useState(0);
  const [preview, setPreview] = useState(false);

  const startGame = () => {
    const [shuffled, e] = shuffleBoard(THEMES[themeIdx].grid);
    setTiles(shuffled); setEmptyIdx(e); setMoves(0); setPhase("playing");
    audioEngine.speak(`Assemble le puzzle ${THEMES[themeIdx].name} !`, { rate: 0.85 });
  };

  const tap = (idx: number) => {
    if (idx === emptyIdx) return;
    const nbrs = getNeighbors(emptyIdx);
    if (!nbrs.includes(idx)) return;
    const newTiles = [...tiles];
    [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
    setTiles(newTiles); setEmptyIdx(idx); setMoves((m) => m + 1);
    const solved = THEMES[themeIdx].grid;
    const winCheck = newTiles.slice(0, SIZE * SIZE - 1).every((t, i) => t === solved[i]);
    if (winCheck) {
      setTimeout(() => {
        setPhase("win");
        audioEngine.speak("Bravo ! Puzzle terminé !", { pitch: 1.5, rate: 0.85 });
        const m = moves + 1;
        const stars = m <= 30 ? 3 : m <= 60 ? 2 : 1;
        recordGameSession("puzzle", Math.max(10, 100 - m), stars);
        const prev = getChild().highScores.puzzle;
        if (!prev || m < prev.moves) saveHighScore("puzzle", { moves: m, time: 0, stars });
      }, 400);
    }
  };

  if (phase === "setup") return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#1A1A2E" /></button>
        <span className="font-extrabold text-[18px] text-edu-dark">Puzzle</span>
      </header>
      <div className="mx-4 mb-5 rounded-[24px] p-7 text-center text-white" style={{ background: "linear-gradient(135deg,#A8B3D8,#C7CEEA)" }}>
        <div className="text-[56px]">🧩</div>
        <div className="font-black text-[24px] mt-2">Puzzle</div>
        <div className="font-medium text-[14px] opacity-90 mt-1">Glisse les pièces pour reconstituer l'image !</div>
      </div>
      <div className="px-4">
        <div className="font-extrabold text-[18px] text-edu-dark mb-3">Choisis un thème</div>
        <div className="grid grid-cols-2 gap-2.5">
          {THEMES.map((t, i) => (
            <button key={i} onClick={() => setThemeIdx(i)} className="rounded-2xl p-3.5 text-center border-2"
              style={{ background: themeIdx === i ? t.color : "white", borderColor: themeIdx === i ? "#FF6B35" : "#E5E7EB" }}>
              <div className="grid grid-cols-3 gap-0.5 w-[60px] mx-auto mb-2">
                {t.grid.map((e, j) => (
                  <div key={j} className="text-[14px] rounded p-0.5 text-center" style={{ background: themeIdx === i ? "rgba(255,255,255,.5)" : "#F9FAFB" }}>{e}</div>
                ))}
              </div>
              <div className="font-bold text-[12px]" style={{ color: themeIdx === i ? "#FF6B35" : "#1A1A2E" }}>{t.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-6">
        <button onClick={startGame} className="w-full h-14 rounded-[14px] text-white font-extrabold text-[17px] shadow-edu-card" style={{ background: "#6C6CC7" }}>Commencer ! 🚀</button>
      </div>
    </div>
  );

  if (phase === "win") return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col items-center justify-center px-6 py-8 text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="text-[80px]">🧩</div>
      <div className="font-black text-[32px] mt-3" style={{ color: "#6C6CC7" }}>Parfait !</div>
      <div className="font-semibold text-[16px] text-edu-muted mt-1">Puzzle terminé en {moves} coups !</div>
      <div className="rounded-[20px] p-5 my-6 w-full bg-[#F3F4F6]">
        <div className="font-black text-[32px]" style={{ color: "#FF6B35" }}>+{Math.max(5, 20 - Math.floor(moves / 2))}⭐</div>
        <div className="font-medium text-[13px] text-[#9CA3AF]">étoiles gagnées</div>
      </div>
      <button onClick={startGame} className="w-full h-[52px] rounded-[14px] text-white font-extrabold text-[16px] mb-3" style={{ background: "#6C6CC7" }}>Rejouer 🔄</button>
      <button onClick={() => nav({ to: "/games" })} className="w-full h-12 rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-edu-muted font-bold text-[15px]">Menu des jeux</button>
    </div>
  );

  const theme = THEMES[themeIdx];
  return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center justify-between px-4 py-3 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
        <button onClick={() => setPhase("setup")}><ArrowLeft size={22} color="#6B7280" /></button>
        <div className="font-bold text-[14px] text-edu-dark">{moves} déplacements</div>
        <button onMouseDown={() => setPreview(true)} onMouseUp={() => setPreview(false)} onTouchStart={() => setPreview(true)} onTouchEnd={() => setPreview(false)} className="rounded-lg px-2 py-2 flex items-center gap-1" style={{ background: "#F3F4F6" }}>
          <Eye size={18} color="#6B7280" /><span className="font-semibold text-[12px] text-edu-muted">Voir</span>
        </button>
      </header>
      {preview && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3" style={{ background: "rgba(0,0,0,.7)" }}>
          <div className="font-bold text-[14px] text-white mb-2">Image à reconstituer</div>
          <div className="grid grid-cols-3 gap-1 p-3 bg-white rounded-2xl">
            {theme.grid.map((e, i) => (
              <div key={i} className="w-[70px] h-[70px] rounded-[10px] flex items-center justify-center text-[32px]" style={{ background: theme.color }}>{e}</div>
            ))}
          </div>
        </div>
      )}
      <div className="px-4 py-5">
        <div className="bg-white rounded-[20px] p-3 shadow-edu-card grid grid-cols-3 gap-1.5">
          {tiles.map((emoji, idx) => (
            <motion.button key={idx} onClick={() => tap(idx)} layout transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="aspect-square rounded-[12px] text-[36px] flex items-center justify-center"
              style={{ background: emoji === "" ? "#F3F4F6" : theme.color, opacity: emoji === "" ? 0.3 : 1, cursor: emoji === "" ? "default" : "pointer", boxShadow: emoji === "" ? "none" : "0 2px 8px rgba(0,0,0,.08)", border: "none" }}>
              {emoji}
            </motion.button>
          ))}
        </div>
        <div className="text-center mt-4 font-semibold text-[13px] text-[#9CA3AF]">Glisse les pièces adjacentes à la case vide</div>
      </div>
    </div>
  );
}