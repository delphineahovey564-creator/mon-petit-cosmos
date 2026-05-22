import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/splash")({ component: Splash });

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/onboarding" }), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, #FF6B35 0%, #FFB347 100%)" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Leo size={160} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-[14px] h-14 px-6 flex items-center gap-3 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
        >
          <div className="w-9 h-9 rounded-full bg-edu-primary grid place-items-center text-white font-black text-lg">E</div>
          <span className="text-edu-primary font-black text-[22px] tracking-tight">EducEnfant</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="italic text-white text-sm font-semibold text-center"
        >
          Apprendre en jouant, grandir en créant.
        </motion.p>
      </div>

      <div className="pb-12 flex flex-col items-center gap-2">
        <div className="w-[120px] h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-edu-accent animate-loader-fill" />
        </div>
        <span className="text-white/60 text-[11px] font-bold uppercase tracking-[2px]">Chargement…</span>
      </div>
    </div>
  );
}