import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Volume2, Check, X, RefreshCw } from "lucide-react";
import { ALPHABET, speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/alphabet/listen")({ component: AlphabetListen });

type Q = { targetLetter: string; options: string[] };

function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

function genQuestions(): Q[] {
  return Array.from({ length: 10 }, () => {
    const target = ALPHABET[Math.floor(Math.random() * 26)];
    const distractors = shuffle(ALPHABET.filter((l) => l !== target)).slice(0, 3);
    return { targetLetter: target, options: shuffle([target, ...distractors]) };
  });
}

function AlphabetListen() {
  const nav = useNavigate();
  const [questions] = useState<Q[]>(() => genQuestions());
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const lockRef = useRef(false);
  const q = questions[idx];
  const isCorrect = selected === q.targetLetter;

  function play() {
    setHasPlayed(true);
    speak(q.targetLetter, { rate: 0.6, pitch: 1.3 });
  }

  function onSelect(letter: string) {
    if (!hasPlayed || selected || lockRef.current) return;
    lockRef.current = true;
    setSelected(letter);
    const ok = letter === q.targetLetter;
    if (ok) { setScore((s) => s + 1); speak(`Bravo ! C'est la lettre ${q.targetLetter}`); }
    else speak(`C'est la lettre ${q.targetLetter}`);
    setTimeout(() => {
      lockRef.current = false;
      if (idx < 9) { setIdx(idx + 1); setSelected(null); setHasPlayed(false); }
      else {
        const final = score + (ok ? 1 : 0);
        const stars = final * 3;
        const c = getChild();
        setChild({ stars: c.stars + stars, activities: [{ id: Date.now().toString(), moduleId: "alphabet", title: "Quiz Écouter", starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20) });
        nav({ to: "/victory", search: { moduleName: "Alphabet - Écouter", starsEarned: stars, score: final, total: 10, nextRoute: "/module/alphabet" } });
      }
    }, 1500);
  }

  const bigBg = selected ? (isCorrect ? "#4CAF50" : "#FF5252") : "linear-gradient(135deg,#2EC4B6,#26A69A)";

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/alphabet"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Quel son entends-tu ?</h1>
        <span className="bg-[#B5EAD7] text-[#1A1A2E] font-extrabold text-[12px] rounded-full px-2.5 py-1">{idx + 1} / 10</span>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-[#2EC4B6] transition-all" style={{ width: `${((idx + 1) / 10) * 100}%` }} /></div>

      <div className="mx-4 mt-4 bg-[#F0FBF9] rounded-[20px] p-4 flex items-center gap-3">
        <Leo size={40} />
        <p className="font-bold text-[14px] text-[#1A1A2E]">Écoute bien et trouve la bonne lettre !</p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <motion.button
          onClick={play}
          whileTap={{ scale: 0.95 }}
          className="relative w-[120px] h-[120px] rounded-full grid place-items-center"
          style={{ background: bigBg, boxShadow: "0 12px 32px rgba(46,196,182,0.35)" }}
        >
          {!hasPlayed && <Play size={52} color="white" fill="white" />}
          {hasPlayed && !selected && (
            <>
              <Volume2 size={52} color="white" />
              <motion.span className="absolute inset-0 rounded-full border-2 border-white/40" animate={{ scale: [1, 1.4], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </>
          )}
          {selected && (isCorrect ? <Check size={52} color="white" /> : <X size={52} color="white" />)}
        </motion.button>
        {!hasPlayed && <p className="mt-3 text-[#6B7280] font-bold text-[13px]">Appuie pour écouter</p>}
        {hasPlayed && !selected && (
          <button onClick={play} className="mt-3 flex items-center gap-1.5 text-[#6B7280] font-semibold text-[13px]">
            <RefreshCw size={14} /> Rejouer
          </button>
        )}
      </div>

      <div className="mx-5 mt-8 grid grid-cols-2 gap-3.5">
        {q.options.map((letter) => {
          const isThis = selected === letter;
          const showCorrect = selected && letter === q.targetLetter;
          const wrong = isThis && !isCorrect;
          const bg = showCorrect ? "#4CAF50" : wrong ? "#FF5252" : "#FFFFFF";
          const color = showCorrect || wrong ? "#FFFFFF" : "#1A1A2E";
          return (
            <motion.button
              key={letter}
              disabled={!hasPlayed}
              onClick={() => onSelect(letter)}
              animate={wrong ? { x: [0, -10, 10, -10, 0] } : showCorrect ? { scale: [1, 1.1, 1] } : {}}
              transition={{ type: "spring", stiffness: 400 }}
              className="h-[72px] rounded-[18px] border-2 font-black text-[32px] shadow-edu-card"
              style={{ background: bg, color, borderColor: bg === "#FFFFFF" ? "#E5E7EB" : bg, opacity: !hasPlayed ? 0.4 : 1 }}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
