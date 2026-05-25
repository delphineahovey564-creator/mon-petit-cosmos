import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Volume2 } from "lucide-react";
import { ALPHABET, DICTIONARY_DATA, speak } from "@/lib/eduData";

export const Route = createFileRoute("/module/alphabet/dictionary")({ component: AlphabetDictionary });

function AlphabetDictionary() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("A");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const letters = ALPHABET.filter((l) => !query || l.toLowerCase().includes(query.toLowerCase()) || DICTIONARY_DATA[l].some((w) => w.word.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6] sticky top-0 z-20">
        <Link to="/module/alphabet"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Mon Dictionnaire</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 bg-white rounded-[14px] border-[1.5px] border-[#E5E7EB] h-[52px] px-4 flex items-center gap-2.5">
        <Search size={20} color="#9CA3AF" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cherche une lettre..." className="flex-1 outline-none font-semibold text-[15px] text-[#1A1A2E] placeholder:text-[#9CA3AF]" />
      </div>

      <div className="mx-4 mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {ALPHABET.map((l) => (
          <button key={l} onClick={() => { setActive(l); refs.current[l]?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            className="shrink-0 w-9 h-9 rounded-full grid place-items-center font-extrabold text-[14px]"
            style={{ background: active === l ? "#FF6B35" : "#FFFFFF", color: active === l ? "#FFFFFF" : "#1A1A2E", border: active === l ? "none" : "1.5px solid #E5E7EB" }}>
            {l}
          </button>
        ))}
      </div>

      <div className="px-4">
        {letters.map((letter) => {
          const words = DICTIONARY_DATA[letter].filter((w) => !query || w.word.toLowerCase().includes(query.toLowerCase()) || letter.toLowerCase().includes(query.toLowerCase()));
          if (!words.length) return null;
          return (
            <div key={letter} ref={(el) => { refs.current[letter] = el; }} className="mt-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF6B35] grid place-items-center text-white font-black text-[22px]">{letter}</div>
                <div className="flex-1 h-px bg-[#E5E7EB]" />
              </div>
              <div className="mt-2 flex gap-2.5 overflow-x-auto pb-1">
                {words.map((w) => (
                  <div key={w.word} className="shrink-0 w-[100px] h-[110px] bg-white rounded-[20px] shadow-edu-card p-3 text-center flex flex-col items-center">
                    <div style={{ fontSize: 36, lineHeight: 1 }}>{w.emoji}</div>
                    <p className="mt-1 font-bold text-[12px] text-[#1A1A2E] leading-tight">{w.word}</p>
                    <motion.button whileTap={{ scale: 1.2 }} onClick={() => speak(w.word, { rate: 0.7 })} className="mt-1.5 w-7 h-7 rounded-full bg-[#FF6B35] grid place-items-center">
                      <Volume2 size={12} color="white" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
