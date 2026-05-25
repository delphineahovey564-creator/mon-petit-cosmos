import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/numbers/sequence")({ component: NumbersSequence });

type Q = { sequence: number[]; blanks: number[] };
function gen(): Q[] {
  return Array.from({ length: 10 }, () => {
    const start = Math.floor(Math.random() * 15);
    const len = Math.random() < 0.5 ? 5 : 6;
    const seq = Array.from({ length: len }, (_, i) => start + i);
    const nBlanks = Math.random() < 0.5 ? 1 : 2;
    const positions: number[] = [];
    while (positions.length < nBlanks) {
      const p = Math.floor(Math.random() * len);
      if (!positions.includes(p)) positions.push(p);
    }
    return { sequence: seq, blanks: positions.sort((a, b) => a - b) };
  });
}

function NumbersSequence() {
  const nav = useNavigate();
  const [questions] = useState(gen);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"ok" | "ko" | null>(null);
  const lockRef = useRef(false);
  const q = questions[idx];
  const expectedFirst = q.sequence[q.blanks[0]];

  function press(k: string) {
    if (lockRef.current) return;
    if (k === "C") setInput("");
    else if (k === "OK") confirm();
    else if (input.length < 3) setInput(input + k);
  }

  function confirm() {
    if (lockRef.current || !input) return;
    lockRef.current = true;
    const ok = parseInt(input) === expectedFirst;
    if (ok) { setScore((s) => s + 1); setFeedback("ok"); speak(`Oui ! C'est ${expectedFirst}`); }
    else { setFeedback("ko"); speak(`Non. C'est ${expectedFirst}`); }
    setTimeout(() => {
      lockRef.current = false; setInput(""); setFeedback(null);
      if (idx < 9) setIdx(idx + 1);
      else {
        const final = score + (ok ? 1 : 0); const stars = final * 3;
        const c = getChild();
        setChild({ stars: c.stars + stars, activities: [{ id: Date.now().toString(), moduleId: "numbers", title: "Séquences", starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20) });
        nav({ to: "/victory", search: { moduleName: "Séquences", starsEarned: stars, score: final, total: 10, nextRoute: "/module/numbers" } });
      }
    }, 1500);
  }

  const keys = ["1","2","3","4","5","6","7","8","9","C","0","OK"];

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/numbers"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[16px] text-[#1A1A2E]">Quel nombre manque ?</h1>
        <span className="bg-[#FFDAC1] text-[#1A1A2E] font-extrabold text-[12px] rounded-full px-2.5 py-1">{idx + 1}/10</span>
      </header>

      <div className="mx-4 mt-6 flex gap-2 justify-center flex-wrap">
        {q.sequence.map((n, i) => {
          const isBlank = q.blanks.includes(i);
          const isFirstBlank = i === q.blanks[0];
          const filled = feedback === "ok" && isFirstBlank;
          return (
            <motion.div key={i} animate={feedback === "ko" && isFirstBlank ? { x: [0, -8, 8, -8, 0] } : {}}
              className="w-12 h-[52px] rounded-[12px] grid place-items-center font-black text-[22px]"
              style={{
                background: filled ? "#4CAF50" : isBlank ? "#FFF0E8" : "#B5EAD7",
                color: filled ? "white" : isBlank ? "#FF6B35" : "white",
                border: isBlank && !filled ? "2px dashed #FF6B35" : "none",
              }}>
              {isBlank && !filled ? "?" : n}
            </motion.div>
          );
        })}
      </div>

      <div className="mx-4 mt-6 bg-white rounded-[12px] h-[52px] grid place-items-center font-black text-[28px] text-[#1A1A2E] shadow-edu-card">{input || "—"}</div>

      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => press(k)}
            className="h-14 rounded-[12px] font-black text-[22px] shadow-edu-card"
            style={{
              background: k === "OK" ? "#FF6B35" : k === "C" ? "#FFF0E8" : "#FFFFFF",
              color: k === "OK" ? "white" : k === "C" ? "#FF6B35" : "#1A1A2E",
            }}>{k === "C" ? "⌫" : k === "OK" ? "✓" : k}</motion.button>
        ))}
      </div>
    </div>
  );
}
