import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Apple, Check, X, Volume2 } from "lucide-react";
import { speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/maths/exercise/$type")({ component: MathsExercise });

type Q = { a: number; b: number; op: string; correct: number; options: number[] };

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genQuestion(type: string): Q {
  let a = 0, b = 0, op = "+", correct = 0;
  if (type === "addition") {
    a = rand(1, 10); b = rand(1, 10); op = "+"; correct = a + b;
  } else if (type === "soustraction") {
    a = rand(5, 15); b = rand(1, a); op = "−"; correct = a - b;
  } else if (type === "multiplication") {
    a = rand(1, 5); b = rand(1, 10); op = "×"; correct = a * b;
  } else {
    b = rand(1, 5); const result = rand(1, 5); a = b * result; op = "÷"; correct = result;
  }
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const off = rand(-3, 3);
    if (off === 0) continue;
    const v = correct + off;
    if (v < 0 || v === correct) continue;
    wrong.add(v);
  }
  const options = [correct, ...wrong].sort(() => Math.random() - 0.5);
  return { a, b, op, correct, options };
}

const NAMES: Record<string, string> = { addition: "Addition", soustraction: "Soustraction", multiplication: "Multiplication", division: "Division" };
const SPOKEN: Record<string, string> = { "+": "plus", "−": "moins", "×": "fois", "÷": "divisé par" };

function MathsExercise() {
  const { type } = useParams({ from: "/module/maths/exercise/$type" });
  const nav = useNavigate();
  const questions = useMemo(() => Array.from({ length: 10 }, () => genQuestion(type)), [type]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const q = questions[idx];

  useEffect(() => {
    if (!q) return;
    setSelected(null);
    speak(`${q.a} ${SPOKEN[q.op]} ${q.b} égal combien ?`);
  }, [idx]);

  function pick(v: number) {
    if (selected !== null) return;
    setSelected(v);
    const ok = v === q.correct;
    if (ok) {
      setScore((s) => s + 1);
      speak("Bravo ! Bonne réponse !");
    } else {
      speak(`Ce n'est pas ça. La bonne réponse est ${q.correct}.`);
    }
    setTimeout(() => {
      if (idx + 1 >= 10) {
        const finalScore = ok ? score + 1 : score;
        const stars = finalScore * 2;
        const c = getChild();
        setChild({
          stars: c.stars + stars,
          progress: { ...c.progress, maths: Math.min(100, c.progress.maths + 5) },
          activities: [{ id: Date.now().toString(), moduleId: "maths", title: `${NAMES[type]} ${finalScore}/10`, starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20),
        });
        nav({ to: "/victory", search: { moduleName: "Mathématiques", starsEarned: stars, score: finalScore, total: 10, nextRoute: "/module/maths" } });
      } else {
        setIdx((i) => i + 1);
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-12">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/module/maths" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">{NAMES[type] ?? "Mathématiques"}</h1>
        <div className="bg-edu-primary rounded-full px-3 py-1 text-white font-extrabold text-[13px]">{idx + 1} / 10</div>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-edu-primary spring" style={{ width: `${(idx / 10) * 100}%` }} /></div>

      <div className="mx-4 mt-4 bg-[#FFFBEB] rounded-[24px] p-6 text-center shadow-edu-card">
        <div className="flex justify-center"><Leo size={60} /></div>
        {(type === "addition" || type === "soustraction") && q.a <= 10 && q.b <= 10 ? (
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2">
            <div className="flex gap-1 flex-wrap justify-center max-w-[110px]">
              {Array.from({ length: q.a }).map((_, i) => <Apple key={i} size={22} color="#FF6B35" />)}
            </div>
            <span className="font-black text-[32px] text-[#1A1A2E]">{q.op}</span>
            <div className="flex gap-1 flex-wrap justify-center max-w-[110px]">
              {Array.from({ length: q.b }).map((_, i) => <Apple key={i} size={22} color="#FF6B35" />)}
            </div>
            <span className="font-black text-[32px] text-[#1A1A2E]">= ?</span>
          </div>
        ) : (
          <p className="mt-3 font-black text-[36px] text-[#1A1A2E]">
            {q.a} {q.op} {q.b} = ?
          </p>
        )}
        <button
          onClick={() => speak(`${q.a} ${SPOKEN[q.op]} ${q.b} égal combien ?`)}
          className="mt-3 inline-flex items-center gap-1.5 bg-white border-[1.5px] border-edu-primary text-edu-primary rounded-full px-3 py-1.5"
        >
          <Volume2 size={16} /> <span className="font-bold text-[12px]">Réécouter</span>
        </button>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {q.options.map((v) => {
          const isSel = selected === v;
          const isCorrect = v === q.correct;
          const showCorrect = selected !== null && isCorrect;
          const wrong = isSel && !isCorrect;
          return (
            <motion.button
              key={v}
              onClick={() => pick(v)}
              animate={wrong ? { x: [0, -8, 8, -8, 8, 0] } : isSel && isCorrect ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="h-16 rounded-2xl font-black text-[24px] border-2 flex items-center justify-center gap-2"
              style={{
                background: wrong ? "#FF5252" : showCorrect ? "#4CAF50" : "#FFFFFF",
                color: wrong || showCorrect ? "#FFFFFF" : "#1A1A2E",
                borderColor: wrong ? "#FF5252" : showCorrect ? "#4CAF50" : "#E5E7EB",
              }}
            >
              {v}
              {showCorrect && <Check size={20} />}
              {wrong && <X size={20} />}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-6 text-center text-[#6B7280] font-bold">Score : {score} / 10</p>
    </div>
  );
}