import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ExerciseScreen } from "@/components/educ/ExerciseScreen";
import { ALPHABET, LETTER_WORDS, speak } from "@/lib/eduData";
import { getChild, setChild } from "@/lib/storage";

export const Route = createFileRoute("/module/alphabet/letter/$letter")({ component: LetterExercise });

function LetterExercise() {
  const { letter: raw } = useParams({ from: "/module/alphabet/letter/$letter" });
  const letter = raw.toUpperCase();
  const nav = useNavigate();
  const word = LETTER_WORDS[letter] ?? "";

  const handleValidate = () => {
    const c = getChild();
    const completed = c.completedLetters.includes(letter) ? c.completedLetters : [...c.completedLetters, letter];
    const activity = {
      id: Date.now().toString(),
      moduleId: "alphabet",
      title: `Lettre ${letter} tracée`,
      starsEarned: 15,
      timestamp: new Date().toISOString(),
    };
    setChild({
      completedLetters: completed,
      stars: c.stars + 15,
      progress: { ...c.progress, alphabet: Math.min(100, Math.round((completed.length / 26) * 100)) },
      activities: [activity, ...c.activities].slice(0, 20),
    });
    speak(`Bravo ! Tu as tracé la lettre ${letter} !`);
    const idx = ALPHABET.indexOf(letter);
    const next = ALPHABET[idx + 1];
    nav({
      to: "/victory",
      search: {
        letter,
        moduleName: "Alphabet",
        starsEarned: 15,
        nextRoute: next ? `/module/alphabet/letter/${next}` : "/module/alphabet",
      },
    });
  };

  return (
    <ExerciseScreen
      title={`Lettre ${letter}`}
      guide={letter}
      speakText={`${letter}. ${letter} comme dans ${word}`}
      instruction={`Trace la lettre ${letter} en suivant les pointillés !`}
      backTo="/module/alphabet"
      closeTo="/module/alphabet"
      onValidate={handleValidate}
      pdfKind="letter"
    />
  );
}