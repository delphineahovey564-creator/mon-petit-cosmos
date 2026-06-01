import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { FRUITS_DATA, type FruitData } from "@/lib/fruitsData";
import { speak, speakEncouragement } from "@/lib/audio";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/fruits/quiz")({ component: FruitsQuiz });

type Q = { fruit: FruitData; choices: string[] };

function buildQuestions(): Q[] {
  const shuffled = [...FRUITS_DATA].sort(() => Math.random() - 0.5).slice(0, 5);
  return shuffled.map((f) => {
    const distractors = FRUITS_DATA.filter((x) => x.id !== f.id).sort(() => Math.random() - 0.5).slice(0, 3).map((x) => x.name);
    return { fruit: f, choices: [...distractors, f.name].sort(() => Math.random() - 0.5) };
  });
}

function FruitsQuiz() {
  const questions = useMemo(buildQuestions, []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "ko" | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  useEffect(() => { if (q) speak(`Quel est ce fruit ?`); }, [q]);

  const pick = (name: string) => {
    if (feedback) return;
    if (name === q.fruit.name) {
      setFeedback("ok");
      setScore((s) => s + 1);
      speakEncouragement();
    } else {
      setFeedback("ko");
      speak(`Non, c'est ${q.fruit.name}.`);
    }
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= questions.length) {
        const c = getChild();
        setChild({ stars: c.stars + score * 3 });
        setDone(true);
      } else setIdx((i) => i + 1);
    }, 1100);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] grid place-items-center p-6 text-center">
        <div>
          <div className="text-7xl mb-4">{score >= 4 ? "🏆" : score >= 2 ? "🎉" : "💪"}</div>
          <h2 className="font-black text-2xl mb-2">Quiz terminé !</h2>
          <p className="text-[#6B7280] mb-6">Score : {score}/{questions.length} — +{score * 3} ⭐</p>
          <Link to="/module/fruits" className="inline-flex h-[52px] px-6 items-center rounded-xl bg-edu-primary text-white font-extrabold">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-12">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/fruits"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-extrabold text-[18px]">Quiz</h1>
        <span className="font-bold text-[13px] text-[#6B7280]">{idx + 1}/{questions.length}</span>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-edu-primary" style={{ width: `${(idx / questions.length) * 100}%` }} /></div>

      <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-6 rounded-3xl p-8 grid place-items-center shadow-edu-card" style={{ background: q.fruit.color }}>
        <div style={{ fontSize: 130, lineHeight: 1 }}>{q.fruit.emoji}</div>
      </motion.div>

      <p className="mt-6 text-center font-extrabold text-[18px]">Quel est ce fruit ?</p>

      <div className="mx-4 mt-4 grid grid-cols-1 gap-3">
        {q.choices.map((name) => {
          const correct = feedback && name === q.fruit.name;
          return (
            <motion.button
              key={name}
              onClick={() => pick(name)}
              whileTap={{ scale: 0.97 }}
              className="h-[56px] rounded-xl bg-white border-[1.5px] font-extrabold text-[15px] active:scale-95 spring"
              style={{ borderColor: correct ? "#4CAF50" : "#E5E7EB", color: correct ? "#4CAF50" : "#1A1A2E" }}
            >
              {name}
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