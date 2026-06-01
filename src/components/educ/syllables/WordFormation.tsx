import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Check } from "lucide-react";
import { type SimpleWord } from "@/lib/syllablesData";
import { speakSyllable, speakWord, speakEncouragement } from "@/lib/audio";

export function WordFormation({ words, onComplete }: { words: SimpleWord[]; onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const w = words[idx];
  const distractors = useMemo(() => {
    const others = ["RI", "LO", "TO", "MI", "BU", "NA"].filter((x) => !w.syllables.includes(x));
    return [...w.syllables, ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
  }, [w]);

  useEffect(() => { setBuilt([]); setDone(false); speakWord(w.word); }, [w]);

  const pick = (s: string) => {
    if (done) return;
    const expected = w.syllables[built.length];
    if (s !== expected) return;
    speakSyllable(s);
    const next = [...built, s];
    setBuilt(next);
    if (next.length === w.syllables.length) {
      setDone(true);
      setTimeout(() => { speakEncouragement(); speakWord(w.word); }, 400);
      setTimeout(() => {
        if (idx + 1 >= words.length) onComplete();
        else setIdx((i) => i + 1);
      }, 2200);
    }
  };

  return (
    <div>
      <p className="text-center font-extrabold text-[16px] mb-3">Reconstruis : <span className="text-edu-primary">{w.meaning}</span></p>
      <p className="text-center text-[13px] text-[#6B7280] mb-4">Mot {idx + 1}/{words.length}</p>

      <div className="mx-4 rounded-3xl bg-white p-6 grid place-items-center shadow-edu-card">
        <div className="text-7xl mb-3">{w.emoji}</div>
        <div className="flex gap-2 min-h-[64px] items-center">
          {w.syllables.map((s, i) => (
            <motion.div
              key={i}
              animate={built[i] ? { scale: [0.5, 1.2, 1] } : {}}
              className="min-w-[56px] h-14 px-3 rounded-xl grid place-items-center font-black text-2xl"
              style={{ background: built[i] ? "#4CAF50" : "#F3F4F6", color: built[i] ? "#fff" : "#9CA3AF" }}
            >
              {built[i] ?? "_"}
            </motion.div>
          ))}
        </div>
        {done && (
          <motion.p initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 font-black text-2xl text-edu-primary flex items-center gap-2">
            <Check size={24} /> {w.word} !
          </motion.p>
        )}
        <button onClick={() => speakWord(w.word)} className="mt-3 flex items-center gap-2 text-edu-primary font-extrabold text-[13px]">
          <Volume2 size={16} /> Écouter le mot
        </button>
      </div>

      <div className="mx-4 mt-5 grid grid-cols-3 gap-2">
        {distractors.map((s, i) => (
          <motion.button
            key={`${s}-${i}`}
            whileTap={{ scale: 0.92 }}
            onClick={() => pick(s)}
            disabled={built.includes(s) || done}
            className="h-14 rounded-xl bg-edu-primary text-white font-black text-xl active:scale-95 disabled:opacity-30 spring"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  );
}