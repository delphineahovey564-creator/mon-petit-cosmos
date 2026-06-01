import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getLevel, SIMPLE_WORDS, TWO_SYLLABLE_WORDS, THREE_SYLLABLE_WORDS } from "@/lib/syllablesData";
import { getChild, setChild } from "@/lib/storage";
import { speakEncouragement } from "@/lib/audio";
import { VowelsExercise } from "@/components/educ/syllables/VowelsExercise";
import { DiphthongBuilder } from "@/components/educ/syllables/DiphthongBuilder";
import { WordFormation } from "@/components/educ/syllables/WordFormation";
import { ReadingSentence } from "@/components/educ/syllables/ReadingSentence";

export const Route = createFileRoute("/module/syllables/level/$levelId")({ component: LevelPage });

function LevelPage() {
  const { levelId } = useParams({ from: "/module/syllables/level/$levelId" });
  const nav = useNavigate();
  const level = getLevel(parseInt(levelId, 10));
  const [completed, setCompleted] = useState(false);

  if (!level) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Link to="/module/syllables" className="text-edu-primary font-extrabold">← Retour</Link>
      </div>
    );
  }

  const finish = () => {
    const c = getChild();
    const lvls = c.completedSyllableLevels.includes(level.id) ? c.completedSyllableLevels : [...c.completedSyllableLevels, level.id];
    setChild({
      completedSyllableLevels: lvls,
      stars: c.stars + 10,
      progress: { ...c.progress, syllables: Math.round((lvls.length / 10) * 100) },
    });
    speakEncouragement();
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] grid place-items-center p-6 text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <div className="text-8xl mb-4">🏆</div>
          <h2 className="font-black text-2xl mb-2">Niveau {level.id} réussi !</h2>
          <p className="text-[#6B7280] mb-2">+10 ⭐</p>
          <p className="text-[#1A1A2E] font-bold mb-6">{level.title}</p>
          <div className="flex flex-col gap-3">
            <Link to="/module/syllables" className="inline-flex h-[52px] px-6 items-center justify-center rounded-xl bg-edu-primary text-white font-extrabold">Retour aux niveaux</Link>
            {level.id < 10 && (
              <Link to="/module/syllables/level/$levelId" params={{ levelId: String(level.id + 1) }} className="inline-flex h-[52px] px-6 items-center justify-center rounded-xl bg-white border-[1.5px] border-edu-primary text-edu-primary font-extrabold">Niveau suivant →</Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const renderExercise = () => {
    switch (level.type) {
      case "vowels": return <VowelsExercise onComplete={finish} />;
      case "consonant": return <DiphthongBuilder consonant={level.consonant!} onComplete={finish} />;
      case "words": return <WordFormation words={SIMPLE_WORDS.slice(0, 4)} onComplete={finish} />;
      case "twoSyllables": return <WordFormation words={TWO_SYLLABLE_WORDS} onComplete={finish} />;
      case "threeSyllables": return <WordFormation words={THREE_SYLLABLE_WORDS} onComplete={finish} />;
      case "reading": return <ReadingSentence onComplete={finish} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-12">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/module/syllables" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="font-extrabold text-[16px]">N°{level.id} — {level.title}</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 rounded-2xl p-3 text-center" style={{ background: level.color }}>
        <p className="font-bold text-[14px] text-[#1A1A2E]">{level.desc}</p>
      </div>

      <div className="mt-6">{renderExercise()}</div>
    </div>
  );
}