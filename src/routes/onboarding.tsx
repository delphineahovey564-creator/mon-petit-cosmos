import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setOnboardingDone } from "@/lib/storage";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const SLIDES = [
  {
    cardBg: "#FFF0E8",
    pageBg: "#FFF9F0",
    title1: "Apprends l'alphabet",
    title2: "en t'amusant !",
    body: "Trace les lettres, écoute leur son et colorie avec Léo. L'apprentissage n'a jamais été aussi amusant !",
    bubbles: [
      { ch: "A", bg: "#FFB3BA", x: "8%", y: "18%" },
      { ch: "B", bg: "#B5EAD7", x: "68%", y: "32%" },
      { ch: "C", bg: "#C7CEEA", x: "12%", y: "58%" },
    ],
  },
  {
    cardBg: "#F0FBF9",
    pageBg: "#F0FBF9",
    title1: "Joue avec les maths et",
    title2: "les chiffres !",
    body: "Additionne, compte et résous des défis mathématiques colorés. Ton cerveau grandit à chaque partie !",
    bubbles: [
      { ch: "1", bg: "#FFDAC1", x: "10%", y: "15%" },
      { ch: "+", bg: "#FFE14D", x: "70%", y: "20%" },
      { ch: "2", bg: "#FFB347", x: "75%", y: "60%" },
      { ch: "=", bg: "#FFF0E8", x: "15%", y: "62%" },
    ],
  },
  {
    cardBg: "#FEF9E7",
    pageBg: "#FFF9F0",
    title1: "Découvre des",
    title2: "histoires magiques !",
    body: "Des contes africains, des fables et des histoires de la Bible. Lis, écoute et laisse ton imagination s'envoler !",
    bubbles: [
      { ch: "★", bg: "#FFE14D", x: "12%", y: "18%" },
      { ch: "★", bg: "#FFE14D", x: "72%", y: "26%" },
      { ch: "★", bg: "#FFE14D", x: "20%", y: "62%" },
    ],
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const slide = SLIDES[i];

  const finish = () => {
    setOnboardingDone(true);
    navigate({ to: "/signup" });
  };

  const next = () => {
    if (i === SLIDES.length - 1) finish();
    else { setDir(1); setI(i + 1); }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      animate={{ backgroundColor: slide.pageBg }}
      transition={{ duration: 0.4 }}
    >
      {/* Illustration card */}
      <div className="px-5 pt-5">
        <div className="relative rounded-[32px] h-[60vh] min-h-[380px] overflow-hidden" style={{ background: slide.cardBg }}>
          <span className="absolute top-4 right-4 z-10 bg-edu-primary text-white text-xs font-bold rounded-full px-2.5 py-1">
            {i + 1}/3
          </span>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={i}
              custom={dir}
              initial={{ x: dir * 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir * -60, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {slide.bubbles.map((b, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3 + idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-12 h-12 rounded-full grid place-items-center font-black text-white text-lg shadow-md"
                  style={{ background: b.bg, left: b.x, top: b.y }}
                >
                  {b.ch}
                </motion.div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <Leo size={180} float />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Text + CTA */}
      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h1 className="text-[28px] leading-[1.15] font-black text-edu-dark">
              {slide.title1}
              <br />
              <span className="text-edu-primary">{slide.title2}</span>
            </h1>
            <p className="mt-4 text-edu-muted font-semibold text-[15px] leading-relaxed">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {SLIDES.map((_, idx) => (
            <motion.span
              key={idx}
              animate={{ width: idx === i ? 24 : 8 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="h-2 rounded-full"
              style={{ background: idx === i ? "#FF6B35" : "#E5E7EB" }}
            />
          ))}
        </div>

        <div className="mt-auto pt-6 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
            onClick={next}
            className="w-full h-14 rounded-[14px] bg-edu-primary text-white font-extrabold shadow-[0px_6px_16px_rgba(255,107,53,0.28)]"
          >
            {i === SLIDES.length - 1 ? "Commencer l'aventure ! 🚀" : "Suivant →"}
          </motion.button>
          {i < SLIDES.length - 1 && (
            <button onClick={finish} className="block w-full text-center text-edu-subtle font-medium text-sm">
              Passer
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}