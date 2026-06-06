import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { audioEngine } from "@/lib/audio";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";

export const Route = createFileRoute("/games/quiz")({ component: ChronoQuiz });

type Q = { cat: string; q: string; visual: string; opts: string[]; ans: number; explain: string };

const BANK: Q[] = [
  { cat: "🔤 Alphabet", q: "Quelle lettre vient après D ?", visual: "D → ?", opts: ["C","E","F","B"], ans: 1, explain: "L'alphabet: A B C D E F..." },
  { cat: "🔤 Alphabet", q: "Quel animal commence par L ?", visual: "L... ?", opts: ["Éléphant","Bateau","Lion","Girafe"], ans: 2, explain: "Lion commence par L !" },
  { cat: "🔤 Alphabet", q: "Combien de lettres dans l'alphabet ?", visual: "A → Z = ?", opts: ["24","25","26","28"], ans: 2, explain: "26 lettres de A à Z !" },
  { cat: "🔤 Alphabet", q: "Quelle est la 1ère lettre ?", visual: "? B C D...", opts: ["Z","M","A","E"], ans: 2, explain: "A est la 1ère lettre !" },
  { cat: "🔤 Alphabet", q: "Quel mot commence par E ?", visual: "E... ?", opts: ["Lion","Girafe","Éléphant","Zèbre"], ans: 2, explain: "Éléphant commence par E !" },
  { cat: "🔢 Chiffres", q: "Combien font 3 + 4 ?", visual: "🍎🍎🍎 + 🍎🍎🍎🍎", opts: ["6","7","8","5"], ans: 1, explain: "3 + 4 = 7 !" },
  { cat: "🔢 Chiffres", q: "Combien font 10 - 3 ?", visual: "10 - 3 = ?", opts: ["6","8","7","9"], ans: 2, explain: "10 - 3 = 7 !" },
  { cat: "🔢 Chiffres", q: "Quel chiffre vient après 9 ?", visual: "7 → 8 → 9 → ?", opts: ["11","10","12","8"], ans: 1, explain: "Après 9 vient 10 !" },
  { cat: "🔢 Chiffres", q: "Combien de pattes a un lion ?", visual: "🦁 = ? pattes", opts: ["2","6","4","8"], ans: 2, explain: "Un lion a 4 pattes !" },
  { cat: "🔢 Chiffres", q: "Combien font 2 × 5 ?", visual: "2 × 5 = ?", opts: ["8","10","7","12"], ans: 1, explain: "2 × 5 = 10 !" },
  { cat: "🍎 Fruits", q: "Quel est ce fruit ?", visual: "🥭", opts: ["Banane","Mangue","Orange","Citron"], ans: 1, explain: "C'est une mangue !" },
  { cat: "🍎 Fruits", q: "Quel fruit est jaune et long ?", visual: "Jaune + Long = ?", opts: ["Pomme","Raisin","Banane","Pêche"], ans: 2, explain: "La banane est jaune et longue !" },
  { cat: "🍎 Fruits", q: "De quelle couleur est une orange ?", visual: "🍊 = ?", opts: ["Rouge","Vert","Orange","Jaune"], ans: 2, explain: "L'orange est orange !" },
  { cat: "🦁 Animaux", q: "Quel animal est le roi de la savane ?", visual: "👑 + Savane = ?", opts: ["Éléphant","Girafe","Lion","Zèbre"], ans: 2, explain: "Le lion est le roi de la savane !" },
  { cat: "🦁 Animaux", q: "Quel animal a le plus long cou ?", visual: "Long cou = ?", opts: ["Éléphant","Girafe","Hippo","Rhino"], ans: 1, explain: "La girafe a le plus long cou !" },
];

const shuffle = <T,>(a: T[]): T[] => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

const TOTAL = 15;
const TIME_PER_Q = 10;

function ChronoQuiz() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"intro" | "playing" | "win">("intro");
  const questions = useMemo(() => shuffle(BANK).slice(0, TOTAL), []);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    if (phase !== "playing" || selected !== null) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, selected]);

  useEffect(() => {
    if (phase === "playing") {
      setTimeLeft(TIME_PER_Q); setSelected(null);
      const q = questions[qIdx];
      if (q) setTimeout(() => audioEngine.speak(q.q, { rate: 0.82 }), 500);
    }
  }, [qIdx, phase]);

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const q = questions[qIdx]; const ok = optIdx === q.ans;
    let newScore = score, newStreak = streak, newMax = maxStreak;
    if (ok) {
      newStreak = streak + 1; newMax = Math.max(maxStreak, newStreak);
      newScore = score + 2 + (newStreak >= 3 ? 1 : 0);
      setStreak(newStreak); setMaxStreak(newMax); setScore(newScore);
      setResults((r) => [...r, true]); audioEngine.speak("Correct !", { pitch: 1.5, rate: 0.9 });
    } else {
      setStreak(0); setResults((r) => [...r, false]);
      audioEngine.speak(optIdx === -1 ? "Temps écoulé !" : "Faux ! " + q.explain, { pitch: 1.0, rate: 0.8 });
    }
    setTimeout(() => {
      if (qIdx >= TOTAL - 1) {
        const stars = newScore >= 25 ? 3 : newScore >= 18 ? 2 : 1;
        recordGameSession("quiz", newScore, stars);
        const prev = getChild().highScores.quiz;
        if (!prev || newScore > prev.score) saveHighScore("quiz", { score: newScore, maxStreak: newMax, stars });
        setPhase("win");
      } else setQIdx((i) => i + 1);
    }, 1600);
  };

  if (phase === "intro") return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#1A1A2E" /></button>
        <span className="font-extrabold text-[18px] text-edu-dark">Chrono Quiz</span>
      </header>
      <div className="mx-4 mb-5 rounded-[24px] p-7 text-center text-white" style={{ background: "linear-gradient(135deg,#FFB347,#FFDAC1)" }}>
        <div className="text-[56px]">⏱️</div>
        <div className="font-black text-[24px] mt-2">Chrono Quiz</div>
        <div className="font-medium text-[14px] opacity-90 mt-1">15 questions · 10 secondes chacune !</div>
      </div>
      <div className="px-4">
        <div className="bg-white rounded-[20px] p-5 shadow-edu-card">
          {[["⏰","10 secondes par question"],["🔥","Série = points bonus"],["🏆","15 questions · score max 45 pts"]].map(([i, t]) => (
            <div key={t} className="flex items-center gap-3 mb-2.5">
              <span className="text-[22px]">{i}</span>
              <span className="font-semibold text-[14px] text-edu-muted">{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pt-6">
        <button onClick={() => setPhase("playing")} className="w-full h-14 rounded-[14px] text-white font-extrabold text-[17px] shadow-edu-card" style={{ background: "#FFB347" }}>Commencer ! 🚀</button>
      </div>
    </div>
  );

  if (phase === "win") {
    const perf = score >= 25 ? { label: "GÉNIAL ! 🎯", color: "#FF6B35" }
      : score >= 18 ? { label: "EXCELLENT ! 🏆", color: "#4CAF50" }
      : score >= 10 ? { label: "BIEN JOUÉ ! ⭐", color: "#2EC4B6" }
      : { label: "CONTINUE ! 💪", color: "#FFB347" };
    return (
      <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col items-center justify-center px-6 py-8 text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="text-[72px]">🏆</div>
        <div className="font-black text-[30px] mt-3" style={{ color: perf.color }}>{perf.label}</div>
        <div className="rounded-[20px] p-5 my-5 w-full bg-[#F9FAFB]">
          <div className="flex justify-around">
            <div className="text-center"><div className="font-black text-[32px]" style={{ color: "#FF6B35" }}>{score}</div><div className="font-medium text-[12px] text-[#9CA3AF]">Points</div></div>
            <div className="text-center"><div className="font-black text-[32px] text-edu-dark">{results.filter(Boolean).length}/15</div><div className="font-medium text-[12px] text-[#9CA3AF]">Bonnes rép.</div></div>
            <div className="text-center"><div className="font-black text-[32px]" style={{ color: "#FF5252" }}>🔥{maxStreak}</div><div className="font-medium text-[12px] text-[#9CA3AF]">Meilleure série</div></div>
          </div>
          <div className="mt-3 flex gap-1 justify-center flex-wrap">
            {results.map((ok, i) => <div key={i} className="w-4 h-4 rounded-full" style={{ background: ok ? "#4CAF50" : "#FF5252" }} />)}
          </div>
        </div>
        <div className="font-black text-[28px] mb-5" style={{ color: "#FF6B35" }}>+{score * 2}⭐</div>
        <button onClick={() => { setQIdx(0); setScore(0); setStreak(0); setMaxStreak(0); setResults([]); setPhase("playing"); }} className="w-full h-[52px] rounded-[14px] text-white font-extrabold text-[16px] mb-3" style={{ background: "#FFB347" }}>Rejouer 🔄</button>
        <button onClick={() => nav({ to: "/games" })} className="w-full h-12 rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-edu-muted font-bold text-[15px]">Menu des jeux</button>
      </div>
    );
  }

  const q = questions[qIdx];
  const timerColor = timeLeft > 6 ? "#4CAF50" : timeLeft > 3 ? "#FFB347" : "#FF5252";
  const circumference = 2 * Math.PI * 38;

  return (
    <div className="min-h-screen bg-edu-bg max-w-[430px] mx-auto pb-5" style={{ fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center justify-between px-4 py-2.5 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={22} color="#6B7280" /></button>
        <div className="rounded-full px-3 py-1 font-bold text-[13px]" style={{ background: "#FFF0E8", color: "#FF6B35" }}>{qIdx + 1} / {TOTAL}</div>
        {streak >= 2 ? <div className="font-extrabold text-[13px]" style={{ color: "#FF6B35" }}>🔥 {streak} série</div> : <div className="w-6" />}
      </header>
      <div className="flex justify-center mt-4">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="38" fill="none" stroke="#F3F4F6" strokeWidth="7" />
          <circle cx="45" cy="45" r="38" fill="none" stroke={timerColor} strokeWidth="7"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - timeLeft / TIME_PER_Q)}
            strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: "stroke-dashoffset 0.8s linear, stroke 0.3s" }} />
          <text x="45" y="52" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="26" fill={timerColor}>{timeLeft}</text>
        </svg>
      </div>
      <div className="text-center mt-1.5">
        <span className="rounded-full px-3 py-1 font-bold text-[12px] text-edu-muted bg-[#F3F4F6]">{q.cat}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.25 }}
          className="mx-4 my-3 bg-white rounded-[24px] shadow-edu-card p-5 text-center">
          <div className="text-[44px] leading-none mb-2.5">{q.visual.length <= 4 && /\p{Emoji}/u.test(q.visual) ? q.visual : ""}</div>
          <div className="font-extrabold text-[17px] text-edu-dark leading-[1.4]">{q.q}</div>
          {q.visual.length > 4 && (
            <div className="mt-2 font-bold text-[14px] rounded-[10px] px-3 py-1.5 inline-block" style={{ background: "#FFF0E8", color: "#FF6B35" }}>{q.visual}</div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {q.opts.map((opt, i) => {
          const isSelected = selected === i, isCorrect = i === q.ans;
          const bg = selected !== null ? (isCorrect ? "#4CAF50" : isSelected ? "#FF5252" : "white") : "white";
          const color = selected !== null && (isCorrect || isSelected) ? "white" : "#1A1A2E";
          return (
            <motion.button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null} whileTap={{ scale: 0.94 }}
              animate={isSelected && !isCorrect ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
              className="h-[58px] rounded-[14px] border-[1.5px] flex items-center gap-2.5 px-3.5"
              style={{ borderColor: selected !== null ? (isCorrect ? "#4CAF50" : isSelected ? "#FF5252" : "#E5E7EB") : "#E5E7EB", background: bg, cursor: selected !== null ? "default" : "pointer" }}>
              <span className="font-extrabold text-[13px] min-w-4" style={{ color: selected !== null && (isCorrect || isSelected) ? "rgba(255,255,255,.7)" : "#9CA3AF" }}>{["A","B","C","D"][i]}.</span>
              <span className="font-bold text-[14px]" style={{ color }}>{opt}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}