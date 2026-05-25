import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/numbers/compare")({ component: NumbersCompare });

type Q = { a: number; b: number; correct: ">" | "<" | "=" };
function gen(): Q[] {
  return Array.from({ length: 10 }, () => {
    const a = Math.floor(Math.random() * 21);
    const b = Math.floor(Math.random() * 21);
    return { a, b, correct: a > b ? ">" : a < b ? "<" : "=" } as Q;
  });
}

function Dots({ n, color }: { n: number; color: string }) {
  return (
    <div className="grid grid-cols-10 gap-1 max-w-[140px] mx-auto mt-2">
      {Array.from({ length: n }).map((_, i) => <span key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />)}
    </div>
  );
}

function NumbersCompare() {
  const nav = useNavigate();
  const [questions] = useState(gen);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const lockRef = useRef(false);
  const q = questions[idx];

  function onSelect(op: ">" | "<" | "=") {
    if (selected || lockRef.current) return;
    lockRef.current = true;
    setSelected(op);
    const ok = op === q.correct;
    if (ok) {
      setScore((s) => s + 1);
      if (q.correct === ">") speak(`${q.a} est plus grand que ${q.b}`);
      else if (q.correct === "<") speak(`${q.a} est plus petit que ${q.b}`);
      else speak(`${q.a} est égal à ${q.b}`);
    } else speak(`La bonne réponse est ${q.correct === ">" ? "plus grand" : q.correct === "<" ? "plus petit" : "égal"}`);
    setTimeout(() => {
      lockRef.current = false;
      if (idx < 9) { setIdx(idx + 1); setSelected(null); }
      else {
        const final = score + (ok ? 1 : 0); const stars = final * 3;
        const c = getChild();
        setChild({ stars: c.stars + stars, activities: [{ id: Date.now().toString(), moduleId: "numbers", title: "Comparer", starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20) });
        nav({ to: "/victory", search: { moduleName: "Comparer", starsEarned: stars, score: final, total: 10, nextRoute: "/module/numbers" } });
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/numbers"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[16px] text-[#1A1A2E]">Plus grand ou plus petit ?</h1>
        <span className="bg-[#C7CEEA] text-[#1A1A2E] font-extrabold text-[12px] rounded-full px-2.5 py-1">{idx + 1}/10</span>
      </header>

      <div className="mx-4 mt-4 bg-white rounded-[28px] shadow-edu-float p-7">
        <div className="flex justify-center gap-5">
          <div>
            <div className="w-[100px] h-[100px] rounded-[20px] bg-[#FFB3BA] grid place-items-center text-white font-black" style={{ fontSize: 48 }}>{q.a}</div>
            <Dots n={q.a} color="#FFB3BA" />
          </div>
          <div>
            <div className="w-[100px] h-[100px] rounded-[20px] bg-[#B5EAD7] grid place-items-center text-white font-black" style={{ fontSize: 48 }}>{q.b}</div>
            <Dots n={q.b} color="#B5EAD7" />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {(["<", "=", ">"] as const).map((op) => {
            const isThis = selected === op;
            const showCorrect = selected && op === q.correct;
            const wrong = isThis && op !== q.correct;
            const bg = showCorrect ? "#4CAF50" : wrong ? "#FF5252" : "#FFFFFF";
            const color = showCorrect || wrong ? "#FFFFFF" : "#6B7280";
            return (
              <motion.button key={op} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onSelect(op)}
                animate={wrong ? { x: [0, -10, 10, -10, 0] } : showCorrect ? { scale: [1, 1.15, 1] } : {}}
                className="flex-1 h-[68px] rounded-[16px] border-2 font-black text-[32px]"
                style={{ background: bg, color, borderColor: bg === "#FFFFFF" ? "#E5E7EB" : bg }}>{op}</motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
