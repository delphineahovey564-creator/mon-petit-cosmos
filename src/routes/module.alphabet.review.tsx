import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ThumbsUp, RefreshCw } from "lucide-react";
import { WORD_DATA, speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/alphabet/review")({ component: AlphabetReview });

type Card = { letter: string; word: string; emoji: string };

function AlphabetReview() {
  const nav = useNavigate();
  const child = useMemo(() => getChild(), []);
  const initial = useMemo<Card[]>(() => {
    const ls = [...child.completedLetters].sort(() => Math.random() - 0.5);
    return ls.map((l) => ({ letter: l, word: WORD_DATA[l]?.word ?? l, emoji: WORD_DATA[l]?.emoji ?? "✨" }));
  }, [child]);
  const [cards, setCards] = useState<Card[]>(initial);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scores, setScores] = useState({ known: 0, learning: 0 });
  const done = idx >= cards.length;
  const card = cards[idx];

  useEffect(() => {
    if (showAnswer && card) speak(`${card.word}. ${card.word} commence par ${card.letter}`, { rate: 0.7 });
  }, [showAnswer, card]);

  if (child.completedLetters.length < 3) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] grid place-items-center px-6 text-center">
        <div>
          <Leo size={100} float />
          <h2 className="mt-4 font-black text-[22px] text-[#1A1A2E]">Pas encore assez de lettres !</h2>
          <p className="mt-2 text-[#6B7280] font-semibold">Apprends au moins 3 lettres d'abord !</p>
          <Link to="/module/alphabet" className="mt-6 inline-block h-[52px] px-6 rounded-xl bg-[#FF6B35] text-white font-extrabold leading-[52px]">Retour</Link>
        </div>
      </div>
    );
  }

  if (done) {
    const total = scores.known + scores.learning;
    const pct = total ? Math.round((scores.known / total) * 100) : 0;
    const earned = scores.known * 2;
    return (
      <div className="min-h-screen bg-[#FFF9F0] pb-10">
        <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
          <Link to="/module/alphabet"><ArrowLeft size={24} color="#FF6B35" /></Link>
          <h1 className="font-bold text-[18px]">Résultats</h1><div className="w-6" />
        </header>
        <div className="mt-6 text-center">
          <Leo size={80} float />
          <h2 className="mt-3 font-black text-[28px] text-[#1A1A2E]">Quiz terminé !</h2>
        </div>
        <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-6">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="font-black text-[28px] text-[#4CAF50]">✓ {scores.known}</p>
              <p className="text-[13px] text-[#6B7280]">Connues</p>
            </div>
            <div className="text-center">
              <p className="font-black text-[28px] text-[#FFB347]">↩ {scores.learning}</p>
              <p className="text-[13px] text-[#6B7280]">À revoir</p>
            </div>
          </div>
          <p className="mt-4 text-center font-bold text-[16px] text-[#1A1A2E]">{pct}% maîtrisé</p>
          <p className="mt-1 text-center font-bold text-[14px] text-[#FF6B35]">+{earned} étoiles</p>
        </div>
        <div className="mx-4 mt-6 flex gap-3">
          <button onClick={() => { setCards(initial); setIdx(0); setShowAnswer(false); setScores({ known: 0, learning: 0 }); }} className="flex-1 h-[52px] rounded-xl border-[1.5px] border-[#E5E7EB] bg-white font-bold text-[#6B7280]">Recommencer</button>
          <button onClick={() => { const c = getChild(); setChild({ stars: c.stars + earned }); nav({ to: "/module/alphabet" }); }} className="flex-1 h-[52px] rounded-xl bg-[#FF6B35] text-white font-extrabold">Retour</button>
        </div>
      </div>
    );
  }

  function next() { setIdx((i) => i + 1); setShowAnswer(false); }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/alphabet"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Quiz éclair</h1>
        <span className="bg-[#FFF0E8] text-[#FF6B35] font-extrabold text-[12px] rounded-full px-2.5 py-1">{idx + 1}/{cards.length}</span>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-[#FF6B35]" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} /></div>

      <div className="mx-4 mt-4 perspective-1000" style={{ perspective: "1000px" }}>
        <motion.div onClick={() => setShowAnswer((v) => !v)} animate={{ rotateY: showAnswer ? 180 : 0 }} transition={{ duration: 0.5 }} className="relative cursor-pointer" style={{ height: 280, transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 bg-white rounded-[28px] shadow-edu-float p-8 text-center grid place-items-center" style={{ backfaceVisibility: "hidden" }}>
            <div>
              <div className="w-[120px] h-[120px] mx-auto rounded-full bg-[#FF6B35] grid place-items-center text-white font-black" style={{ fontSize: 64 }}>{card.letter}</div>
              <p className="mt-4 text-[#9CA3AF] font-semibold text-[14px]">Connais-tu ce mot ?</p>
              <p className="mt-1 text-[#D1D5DB] font-medium text-[12px]">Appuie pour voir</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-white rounded-[28px] shadow-edu-float p-8 text-center grid place-items-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div>
              <div style={{ fontSize: 72, lineHeight: 1 }}>{card.emoji}</div>
              <h3 className="mt-2 font-black text-[28px] text-[#1A1A2E]">{card.word}</h3>
              <p className="mt-1 text-[#9CA3AF] font-medium text-[12px]">commence par</p>
              <p className="font-black text-[48px] text-[#FF6B35] leading-none">{card.letter}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAnswer && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-4 flex gap-3">
            <button onClick={() => { setScores((s) => ({ ...s, known: s.known + 1 })); next(); }} className="flex-1 h-14 rounded-[14px] bg-[#4CAF50] text-white font-extrabold text-[15px] flex items-center justify-center gap-2">
              <ThumbsUp size={18} /> Je savais !
            </button>
            <button onClick={() => { setScores((s) => ({ ...s, learning: s.learning + 1 })); setCards((cs) => [...cs.slice(0, idx + 1), card, ...cs.slice(idx + 1)]); next(); }} className="flex-1 h-14 rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-[#6B7280] font-bold text-[15px] flex items-center justify-center gap-2">
              <RefreshCw size={18} /> À revoir
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
