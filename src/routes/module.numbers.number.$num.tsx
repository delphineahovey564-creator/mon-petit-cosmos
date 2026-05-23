import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Apple } from "lucide-react";
import { ExerciseScreen } from "@/components/educ/ExerciseScreen";
import { NUMBER_WORDS, speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/numbers/number/$num")({ component: NumberExercise });

function NumberExercise() {
  const { num: raw } = useParams({ from: "/module/numbers/number/$num" });
  const num = parseInt(raw, 10);
  const nav = useNavigate();
  const word = NUMBER_WORDS[num] ?? String(num);

  const handleValidate = () => {
    const c = getChild();
    const completed = c.completedNumbers.includes(num) ? c.completedNumbers : [...c.completedNumbers, num];
    setChild({
      completedNumbers: completed,
      stars: c.stars + 12,
      progress: { ...c.progress, numbers: Math.min(100, Math.round((completed.length / 21) * 100)) },
      activities: [{ id: Date.now().toString(), moduleId: "numbers", title: `Chiffre ${num} tracé`, starsEarned: 12, timestamp: new Date().toISOString() }, ...c.activities].slice(0, 20),
    });
    speak(`Bravo ! Tu as tracé le chiffre ${word} !`);
    const next = num + 1 <= 20 ? num + 1 : null;
    nav({
      to: "/victory",
      search: {
        moduleName: "Chiffres",
        starsEarned: 12,
        achievementText: `Tu as tracé le chiffre ${num} !`,
        nextRoute: next !== null ? `/module/numbers/number/${next}` : "/module/numbers",
      },
    });
  };

  const extra = !isNaN(num) ? (
    <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-4">
      <p className="font-bold text-[16px] text-[#1A1A2E] mb-2">Compte les objets !</p>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: num }).map((_, i) => <Apple key={i} size={28} color="#FF6B35" />)}
        {num === 0 && <span className="text-[#9CA3AF] font-bold text-sm">Zéro objet !</span>}
      </div>
    </div>
  ) : null;

  return (
    <ExerciseScreen
      title={`Chiffre ${num}`}
      guide={String(num)}
      speakText={`${word}. Le chiffre ${word}.`}
      instruction={`Trace le chiffre ${num} en suivant les pointillés !`}
      backTo="/module/numbers"
      closeTo="/module/numbers"
      onValidate={handleValidate}
      extra={extra}
      pdfTitle={`Mon chiffre ${num} — EducEnfant`}
      pdfFile={`chiffre_${num}_EducEnfant.pdf`}
    />
  );
}