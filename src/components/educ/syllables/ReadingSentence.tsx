import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Check } from "lucide-react";
import { SENTENCES } from "@/lib/syllablesData";
import { speak, speakWord, speakEncouragement } from "@/lib/audio";

export function ReadingSentence({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const s = SENTENCES[idx];

  useEffect(() => { setTapped(new Set()); const t = setTimeout(() => speak(s.text), 400); return () => clearTimeout(t); }, [idx]);

  const tapWord = (w: string, i: number) => {
    speakWord(w);
    const next = new Set(tapped);
    next.add(i);
    setTapped(next);
  };

  const validate = () => {
    speakEncouragement();
    setTimeout(() => {
      if (idx + 1 >= SENTENCES.length) onComplete();
      else setIdx((i) => i + 1);
    }, 1200);
  };

  return (
    <div>
      <p className="text-center font-extrabold text-[16px] mb-3">Lis la phrase</p>
      <p className="text-center text-[13px] text-[#6B7280] mb-4">{idx + 1}/{SENTENCES.length}</p>

      <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 rounded-3xl bg-white p-6 text-center shadow-edu-card">
        <div className="text-6xl mb-4">{s.emoji}</div>
        <p className="font-black text-[22px] text-[#1A1A2E] leading-relaxed">{s.text}</p>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {s.words.map((w, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              onClick={() => tapWord(w, i)}
              className="px-3 h-10 rounded-full font-extrabold text-[14px]"
              style={{ background: tapped.has(i) ? "#4CAF50" : "#FFF9F0", color: tapped.has(i) ? "#fff" : "#1A1A2E" }}
            >
              {w}
            </motion.button>
          ))}
        </div>

        <button onClick={() => speak(s.text)} className="mt-5 mx-auto flex items-center gap-2 text-edu-primary font-extrabold">
          <Volume2 size={18} /> Réécouter
        </button>
      </motion.div>

      <button onClick={validate} className="mx-4 mt-5 w-[calc(100%-2rem)] h-[52px] rounded-xl bg-edu-primary text-white font-extrabold flex items-center justify-center gap-2 active:scale-95 spring">
        <Check size={18} /> J'ai lu !
      </button>
    </div>
  );
}