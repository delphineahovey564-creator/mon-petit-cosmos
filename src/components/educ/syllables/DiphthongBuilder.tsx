import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { VOWELS } from "@/lib/syllablesData";
import { speakSyllable } from "@/lib/audio";

export function DiphthongBuilder({ consonant, onComplete }: { consonant: string; onComplete: () => void }) {
  const [vowel, setVowel] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const pick = (v: string) => {
    setVowel(v);
    const syll = consonant + v;
    speakSyllable(syll);
    const next = new Set(seen);
    next.add(v);
    setSeen(next);
    if (next.size === VOWELS.length) setTimeout(onComplete, 1500);
  };

  return (
    <div>
      <p className="text-center font-extrabold text-[16px] mb-4">Touche une voyelle pour former une syllabe</p>

      <div className="mx-4 rounded-3xl bg-gradient-to-br from-[#FFB3BA] to-[#FFDAC1] p-8 grid place-items-center shadow-edu-card">
        <div className="flex items-center gap-3 font-black text-white" style={{ fontSize: 72 }}>
          <span>{consonant}</span>
          <span style={{ fontSize: 40 }}>+</span>
          <motion.span
            key={vowel ?? "?"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block min-w-[60px] text-center"
          >
            {vowel ?? "?"}
          </motion.span>
          <span style={{ fontSize: 40 }}>=</span>
          <span>{consonant}{vowel ?? "?"}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mx-4 mt-6">
        {VOWELS.map((v) => (
          <motion.button
            key={v}
            whileTap={{ scale: 0.9 }}
            onClick={() => pick(v)}
            className="aspect-square rounded-2xl grid place-items-center font-black text-3xl shadow-edu-card"
            style={{ background: seen.has(v) ? "#4CAF50" : "#FFEAA7", color: seen.has(v) ? "#fff" : "#1A1A2E" }}
          >
            {v}
          </motion.button>
        ))}
      </div>

      {vowel && (
        <button onClick={() => speakSyllable(consonant + vowel)} className="mt-5 mx-auto flex items-center gap-2 bg-edu-primary text-white px-5 py-2.5 rounded-full font-extrabold active:scale-95 spring">
          <Volume2 size={18} /> Réécouter {consonant}{vowel}
        </button>
      )}

      <p className="text-center text-[12px] text-[#6B7280] mt-4">{seen.size}/{VOWELS.length} syllabes formées</p>
    </div>
  );
}