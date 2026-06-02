import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { getStoryById, getStoryQuiz } from "@/data/stories";
import { speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/stories/story/$storyId/quiz")({ component: StoryQuiz });

function StoryQuiz() {
  const { storyId } = useParams({ from: "/module/stories/story/$storyId/quiz" });
  const nav = useNavigate();
  const story = getStoryById(storyId);
  const questions = getStoryQuiz(storyId);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  if (!story || !questions.length) {
    return <div className="min-h-screen grid place-items-center bg-[#FFF9F0]"><p className="font-bold">Quiz indisponible</p></div>;
  }

  const q = questions[idx];

  function onAnswer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === q.correct;
    if (ok) { setScore((s) => s + 1); speak("Bravo ! Bonne réponse"); }
    else speak("Ce n'est pas la bonne réponse");
    setTimeout(() => {
      if (idx < questions.length - 1) { setIdx(idx + 1); setSelected(null); }
      else {
        const final = score + (ok ? 1 : 0);
        const stars = final * 5;
        const c = getChild();
        setChild({
          stars: c.stars + stars,
          completedQuizzes: Array.from(new Set([...c.completedQuizzes, storyId])),
          activities: [{ id: Date.now().toString(), moduleId: "stories", title: `Quiz : ${story!.title}`, starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20),
        });
        setDone(true);
      }
    }, 1500);
  }

  if (done) {
    const final = score;
    const msg = final === 3 ? "Parfait !" : final === 2 ? "Très bien !" : "Continue à lire !";
    return (
      <div className="min-h-screen bg-[#FFF9F0] pb-10">
        <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
          <Link to="/module/stories/story/$storyId" params={{ storyId }}><ArrowLeft size={24} color="#FF6B35" /></Link>
          <h1 className="font-bold text-[18px]">Résultats</h1><div className="w-6" />
        </header>
        <div className="text-center mt-6">
          <Leo size={80} float />
          <h2 className="mt-3 font-black text-[28px]">{msg}</h2>
          <p className="mt-2 font-black text-[40px] text-[#FF6B35]">{final}/{questions.length}</p>
          <p className="mt-1 font-bold text-[#FFE14D]">+{final * 5} étoiles ⭐</p>
        </div>
        <div className="mx-4 mt-8 flex gap-3">
          <Link to="/module/stories/story/$storyId" params={{ storyId }} className="flex-1 h-[52px] rounded-xl border-[1.5px] border-[#E5E7EB] bg-white font-bold text-[#6B7280] leading-[48px] text-center">Retour à l'histoire</Link>
          <Link to="/module/stories" className="flex-1 h-[52px] rounded-xl bg-[#FF6B35] text-white font-extrabold leading-[52px] text-center">Autre histoire</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/stories/story/$storyId" params={{ storyId }}><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[16px]">Quiz de compréhension</h1>
        <span className="bg-[#FFF0E8] text-[#FF6B35] font-extrabold text-[12px] rounded-full px-2.5 py-1">{idx + 1}/{questions.length}</span>
      </header>

      <div className="mx-4 mt-4 rounded-[20px] p-4 text-center" style={{ background: story.bg }}>
        <span className="text-[48px]">{story.emoji}</span>
        <h2 className="font-extrabold text-[18px] text-[#1A1A2E]">{story.title}</h2>
      </div>

      <div className="mx-4 mt-4 bg-[#FFF0E8] rounded-[20px] p-4 flex items-center gap-3">
        <Leo size={40} />
        <p className="font-bold text-[16px] text-[#1A1A2E]">{q.q}</p>
      </div>
      <div className="mt-3 text-center text-[48px]">{q.emoji}</div>

      <div className="mx-4 mt-4 flex flex-col gap-3">
        {q.options.map((opt: string, i: number) => {
          const isThis = selected === i;
          const showCorrect = selected !== null && i === q.correct;
          const wrong = isThis && i !== q.correct;
          const bg = showCorrect ? "#4CAF50" : wrong ? "#FF5252" : "#FFFFFF";
          const color = showCorrect || wrong ? "#FFFFFF" : "#1A1A2E";
          return (
            <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={() => onAnswer(i)}
              className="h-[60px] rounded-[14px] border-[1.5px] text-left px-5 font-semibold text-[14px] flex items-center justify-between"
              style={{ background: bg, color, borderColor: bg === "#FFFFFF" ? "#E5E7EB" : bg }}>
              <span><span className="font-extrabold text-[#9CA3AF] mr-3">{String.fromCharCode(65 + i)}.</span>{opt}</span>
              {showCorrect && <Check size={20} color="white" />}
              {wrong && <X size={20} color="white" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
