import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Volume2 } from "lucide-react";
import { ALPHABET, WORD_DATA, speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/alphabet/words")({ component: AlphabetWords });

type Q = { targetLetter: string; word: string; emoji: string; options: string[] };

function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

function gen(): Q[] {
  return Array.from({ length: 10 }, () => {
    const t = ALPHABET[Math.floor(Math.random() * 26)];
    const w = WORD_DATA[t];
    const opts = shuffle([t, ...shuffle(ALPHABET.filter((l) => l !== t)).slice(0, 3)]);
    return { targetLetter: t, word: w.word, emoji: w.emoji, options: opts };
  });
}

function AlphabetWords() {
  const nav = useNavigate();
  const [questions] = useState<Q[]>(() => gen());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const lockRef = useRef(false);
  const q = questions[idx];

  function onSelect(letter: string) {
    if (selected || lockRef.current) return;
    lockRef.current = true;
    setSelected(letter);
    const ok = letter === q.targetLetter;
    if (ok) { setScore((s) => s + 1); speak(`Oui ! ${q.word} commence par ${q.targetLetter}`); }
    else speak(`Non. ${q.word} commence par ${q.targetLetter}`);
    setTimeout(() => {
      lockRef.current = false;
      if (idx < 9) { setIdx(idx + 1); setSelected(null); }
      else {
        const final = score + (ok ? 1 : 0);
        const stars = final * 3;
        const c = getChild();
        setChild({ stars: c.stars + stars, activities: [{ id: Date.now().toString(), moduleId: "alphabet", title: "Mots illustrés", starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20) });
        nav({ to: "/victory", search: { moduleName: "Alphabet - Mots", starsEarned: stars, score: final, total: 10, nextRoute: "/module/alphabet" } });
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/alphabet"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Trouve la lettre !</h1>
        <span className="bg-[#C7CEEA] text-[#1A1A2E] font-extrabold text-[12px] rounded-full px-2.5 py-1">{idx + 1}/10</span>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-[#6C63FF] transition-all" style={{ width: `${((idx + 1) / 10) * 100}%` }} /></div>

      <div className="fixed top-16 right-3 flex items-center gap-1 bg-white shadow-edu-card rounded-full px-2.5 py-1 z-10">
        <Star size={14} fill="#FFE14D" color="#FFE14D" />
        <span className="font-extrabold text-[14px] text-[#1A1A2E]">{score} / {idx}</span>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-[28px] shadow-edu-float p-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1], opacity: 1 }} transition={{ duration: 0.4, type: "spring" }}>
            <div style={{ fontSize: 80, lineHeight: 1 }}>{q.emoji}</div>
            <h2 className="mt-2 font-black text-[32px] text-[#1A1A2E]">{q.word}</h2>
          </motion.div>
        </AnimatePresence>
        <p className="mt-1 font-semibold text-[14px] text-[#6B7280]">Par quelle lettre commence ce mot ?</p>
        <button onClick={() => speak(q.word, { rate: 0.7 })} className="mt-3 inline-flex items-center gap-1.5 bg-[#F3F4F6] rounded-full px-3.5 py-1.5">
          <Volume2 size={14} color="#6B7280" />
          <span className="font-semibold text-[12px] text-[#6B7280]">Écouter le mot</span>
        </button>
      </div>

      <div className="mx-4 mt-6 grid grid-cols-4 gap-3">
        {q.options.map((letter) => {
          const isThis = selected === letter;
          const showCorrect = selected && letter === q.targetLetter;
          const wrong = isThis && letter !== q.targetLetter;
          const bg = showCorrect ? "#4CAF50" : wrong ? "#FF5252" : "#FFFFFF";
          const color = showCorrect || wrong ? "#FFFFFF" : "#1A1A2E";
          return (
            <motion.button
              key={letter}
              onClick={() => onSelect(letter)}
              animate={wrong ? { x: [0, -10, 10, -10, 0] } : showCorrect ? { scale: [1, 1.15, 1] } : {}}
              whileTap={{ scale: 0.94 }}
              className="h-[68px] rounded-[18px] border-2 font-black text-[28px] shadow-edu-card"
              style={{ background: bg, color, borderColor: bg === "#FFFFFF" ? "#E5E7EB" : bg }}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
