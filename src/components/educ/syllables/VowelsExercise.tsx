import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { VOWELS, VOWEL_COLORS, VOWEL_EXAMPLES } from "@/lib/syllablesData";
import { speak, speakLetter } from "@/lib/audio";

export function VowelsExercise({ onComplete }: { onComplete: () => void }) {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string>(VOWELS[0]);

  const pick = (v: string) => {
    setActive(v);
    const ex = VOWEL_EXAMPLES[v][0];
    speakLetter(v, ex.word);
    const next = new Set(seen);
    next.add(v);
    setSeen(next);
    if (next.size === VOWELS.length) setTimeout(onComplete, 1500);
  };

  const examples = VOWEL_EXAMPLES[active];

  return (
    <div>
      <p className="text-center font-extrabold text-[16px] mb-4">Touche chaque voyelle pour l'écouter</p>
      <div className="grid grid-cols-5 gap-2 mx-4">
        {VOWELS.map((v) => (
          <motion.button
            key={v}
            whileTap={{ scale: 0.9 }}
            onClick={() => pick(v)}
            className="aspect-square rounded-2xl grid place-items-center font-black text-4xl text-white shadow-edu-card"
            style={{ background: VOWEL_COLORS[v], outline: active === v ? "4px solid #1A1A2E" : "none" }}
          >
            {v}
          </motion.button>
        ))}
      </div>

      <div className="mx-4 mt-6 rounded-3xl bg-white p-5 shadow-edu-card">
        <p className="text-center font-extrabold text-[14px] text-[#6B7280] mb-3">{active} comme...</p>
        <div className="grid grid-cols-3 gap-3">
          {examples.map((e) => (
            <button key={e.word} onClick={() => speak(e.word)} className="rounded-2xl bg-[#FFF9F0] p-3 text-center active:scale-95 spring">
              <div className="text-4xl">{e.emoji}</div>
              <p className="font-bold text-[12px] mt-1">{e.word}</p>
            </button>
          ))}
        </div>
        <button onClick={() => speak(`${active}, ${examples[0].word}`)} className="mt-4 mx-auto flex items-center gap-2 text-edu-primary font-extrabold">
          <Volume2 size={18} /> Réécouter
        </button>
      </div>

      <p className="text-center text-[12px] text-[#6B7280] mt-4">{seen.size}/{VOWELS.length} voyelles découvertes</p>
    </div>
  );
}