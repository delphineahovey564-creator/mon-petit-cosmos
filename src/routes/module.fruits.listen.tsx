import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Check, X } from "lucide-react";
import { FRUITS_DATA, type FruitData } from "@/lib/fruitsData";
import { speak, speakEncouragement } from "@/lib/audio";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/fruits/listen")({ component: FruitsListen });

function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr].sort(() => Math.random() - 0.5);
  return a.slice(0, n);
}

function FruitsListen() {
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "ko" | null>(null);
  const [score, setScore] = useState(0);
  const total = 5;

  const { answer, choices } = useMemo<{ answer: FruitData; choices: FruitData[] }>(() => {
    const picks = sample(FRUITS_DATA, 4);
    const ans = picks[Math.floor(Math.random() * picks.length)];
    return { answer: ans, choices: picks };
  }, [round]);

  useEffect(() => {
    const t = setTimeout(() => speak(answer.sound), 400);
    return () => clearTimeout(t);
  }, [answer]);

  const pick = (f: FruitData) => {
    if (feedback) return;
    if (f.id === answer.id) {
      setFeedback("ok");
      setScore((s) => s + 1);
      speakEncouragement();
      setTimeout(() => {
        setFeedback(null);
        if (round + 1 >= total) finish();
        else setRound((r) => r + 1);
      }, 900);
    } else {
      setFeedback("ko");
      setTimeout(() => setFeedback(null), 700);
    }
  };

  const finish = () => {
    const c = getChild();
    setChild({ stars: c.stars + score * 2 });
  };

  if (round >= total) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] grid place-items-center p-6 text-center">
        <div>
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="font-black text-2xl mb-2">Bravo !</h2>
          <p className="text-[#6B7280] mb-6">Score : {score}/{total} — +{score * 2} ⭐</p>
          <Link to="/module/fruits" className="inline-flex h-[52px] px-6 items-center rounded-xl bg-edu-primary text-white font-extrabold">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-12">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/fruits"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-extrabold text-[18px]">Écouter</h1>
        <span className="font-bold text-[13px] text-[#6B7280]">{round + 1}/{total}</span>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-edu-primary transition-all" style={{ width: `${((round) / total) * 100}%` }} /></div>

      <div className="mx-4 mt-8 text-center">
        <p className="font-extrabold text-[18px] text-[#1A1A2E]">Écoute et trouve le fruit !</p>
        <button onClick={() => speak(answer.sound)} className="mt-5 mx-auto flex items-center gap-2 bg-edu-primary text-white rounded-full px-6 py-3 font-extrabold active:scale-95 spring">
          <Volume2 size={20} /> Réécouter
        </button>
      </div>

      <div className="mx-4 mt-8 grid grid-cols-2 gap-3">
        {choices.map((f) => {
          const isAns = feedback && f.id === answer.id;
          return (
            <motion.button
              key={f.id}
              onClick={() => pick(f)}
              whileTap={{ scale: 0.95 }}
              animate={feedback === "ko" && f.id === answer.id ? { scale: [1, 1.1, 1] } : {}}
              className="aspect-square rounded-3xl grid place-items-center shadow-edu-card"
              style={{ background: f.color, outline: isAns ? "4px solid #4CAF50" : "none" }}
            >
              <div className="text-6xl">{f.emoji}</div>
              <p className="mt-2 font-bold text-[13px]">{f.name}</p>
            </motion.button>
          );
        })}
      </div>

      {feedback && (
        <div className="fixed inset-0 grid place-items-center pointer-events-none">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-24 h-24 rounded-full grid place-items-center ${feedback === "ok" ? "bg-[#4CAF50]" : "bg-[#EF4444]"}`}>
            {feedback === "ok" ? <Check size={48} color="#fff" /> : <X size={48} color="#fff" />}
          </motion.div>
        </div>
      )}
    </div>
  );
}