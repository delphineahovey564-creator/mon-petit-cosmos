import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/module/numbers/count")({ component: NumbersCount });

const EMOJIS = ["🍎","🍌","🍇","🍓","🍊","🥕","🍒","🍑","🥝","🍐"];

function NumbersCount() {
  const nav = useNavigate();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [emoji, setEmoji] = useState(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const lockRef = useRef(false);

  function reset() {
    setTarget(Math.floor(Math.random() * 10) + 1);
    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setTapped(new Set());
  }

  function onTap(i: number) {
    if (lockRef.current || tapped.has(i)) return;
    const next = new Set(tapped); next.add(i); setTapped(next);
    if (next.size === target) {
      lockRef.current = true;
      speak(`Bravo ! Tu as compté ${target} objets !`);
      setScore((s) => s + 1);
      setTimeout(() => {
        lockRef.current = false;
        if (qIdx < 9) { setQIdx(qIdx + 1); reset(); }
        else {
          const stars = (score + 1) * 10;
          const c = getChild();
          setChild({ stars: c.stars + stars, activities: [{ id: Date.now().toString(), moduleId: "numbers", title: "Comptage", starsEarned: stars, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20) });
          nav({ to: "/victory", search: { moduleName: "Comptage", starsEarned: stars, score: score + 1, total: 10, nextRoute: "/module/numbers" } });
        }
      }, 1200);
    }
  }

  const objects = useMemo(() => Array.from({ length: 15 }, (_, i) => i), [qIdx]);
  const countColor = tapped.size === target ? "#4CAF50" : tapped.size > target ? "#FF5252" : "#FF6B35";

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-32">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/module/numbers"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Comptons ensemble !</h1>
        <span className="bg-[#FFB3BA] text-[#1A1A2E] font-extrabold text-[12px] rounded-full px-2.5 py-1">{qIdx + 1}/10</span>
      </header>

      <div className="mx-4 mt-4 bg-[#FFF0E8] rounded-[20px] p-4 flex items-center gap-3">
        <Leo size={40} />
        <p className="font-bold text-[16px] text-[#1A1A2E]">Appuie sur {target} objet{target > 1 ? "s" : ""} !</p>
      </div>

      <motion.div key={qIdx} initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ type: "spring" }} className="mt-4 mx-auto w-[100px] h-[100px] rounded-full bg-[#FF6B35] grid place-items-center text-white font-black" style={{ fontSize: 48 }}>{target}</motion.div>

      <div className="mx-4 mt-6 flex flex-wrap gap-3 justify-center">
        {objects.map((i) => {
          const isTapped = tapped.has(i);
          return (
            <motion.button key={i} onClick={() => onTap(i)} animate={isTapped ? { scale: [0.8, 1.2, 1] } : {}} transition={{ type: "spring" }}
              className="relative w-14 h-14 rounded-full grid place-items-center text-[28px]"
              style={{ background: isTapped ? "#FF6B35" : "#F3F4F6" }}>
              {emoji}
              {isTapped && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4CAF50] grid place-items-center"><Check size={12} color="white" strokeWidth={3} /></span>}
            </motion.button>
          );
        })}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#F3F4F6] px-5 py-4">
        <div className="flex items-end justify-center gap-2">
          <span className="font-black text-[32px]" style={{ color: countColor }}>{tapped.size}</span>
          <span className="font-medium text-[20px] text-[#9CA3AF] pb-1">/</span>
          <span className="font-black text-[32px] text-[#FF6B35]">{target}</span>
          <span className="font-semibold text-[13px] text-[#6B7280] pb-2 ml-2">objets sélectionnés</span>
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {Array.from({ length: Math.min(10, target) }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < tapped.size ? "#FF6B35" : "#F3F4F6" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
