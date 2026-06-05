import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Timer } from "lucide-react";
import { CHRONO_QUESTIONS } from "@/data/games";
import { recordGameSession, saveHighScore, getChild } from "@/lib/storage";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/games/quiz")({ component: QuizGame });

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }
const TOTAL = 10;

function QuizGame() {
  const nav = useNavigate();
  const qs = useMemo(() => shuffle(CHRONO_QUESTIONS).slice(0, TOTAL), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [time, setTime] = useState(10);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const q = qs[idx];

  useEffect(() => { setTime(10); setPicked(null); }, [idx]);
  useEffect(() => {
    if (picked !== null || done) return;
    if (time <= 0) { advance(false); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, picked, done]);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === q.correct;
    if (ok) speak("Bravo !"); else speak("Oups");
    advance(ok);
  }

  function advance(ok: boolean) {
    if (ok) {
      const bonus = Math.max(5, time * 2);
      setScore((s) => s + 10 + bonus);
      setStreak((s) => { const n = s + 1; setMaxStreak((m) => Math.max(m, n)); return n; });
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (idx + 1 >= TOTAL) finish(ok);
      else setIdx((i) => i + 1);
    }, 900);
  }

  function finish(lastOk: boolean) {
    setDone(true);
    const finalScore = score + (lastOk ? 10 + Math.max(5, time * 2) : 0);
    const stars = finalScore >= 200 ? 3 : finalScore >= 120 ? 2 : 1;
    recordGameSession("quiz", finalScore, stars);
    const prev = getChild().highScores.quiz;
    if (!prev || finalScore > prev.score) saveHighScore("quiz", { score: finalScore, maxStreak, stars });
    setTimeout(() => nav({ to: "/victory", search: { moduleName: "Chrono Quiz", starsEarned: stars, achievementText: `${finalScore} points — série ${maxStreak} !` } }), 400);
  }

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/games" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-extrabold text-[18px] text-edu-dark">Chrono Quiz</h1>
        <span className="font-bold text-[13px] text-edu-muted">{idx + 1}/{TOTAL}</span>
      </header>
      <div className="px-5 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-edu-card">
          <Timer size={16} color="#FF6B35" />
          <span className="font-extrabold text-edu-dark text-[14px]">{time}s</span>
        </div>
        <span className="font-extrabold text-edu-primary text-[14px]">{score} pts · 🔥{streak}</span>
      </div>
      <div className="px-5 mt-5 bg-white rounded-[20px] p-5 shadow-edu-card mx-4">
        <p className="text-[11px] font-extrabold text-edu-primary uppercase tracking-wider">{q.category}</p>
        {q.emoji && <p className="text-[60px] text-center mt-2">{q.emoji}</p>}
        <p className="mt-2 font-black text-edu-dark text-[18px] text-center">{q.q}</p>
      </div>
      <div className="px-4 mt-4 grid grid-cols-1 gap-3 max-w-[430px] mx-auto">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = picked !== null && i === q.correct;
          const isWrong = isPicked && i !== q.correct;
          return (
            <motion.button key={i} onClick={() => pick(i)} whileTap={{ scale: 0.97 }}
              animate={{ background: isCorrect ? "#D4EDDA" : isWrong ? "#FFB3BA" : "#FFFFFF" }}
              className="min-h-[56px] rounded-[14px] px-5 font-extrabold text-edu-dark text-[15px] text-left shadow-edu-card">
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}