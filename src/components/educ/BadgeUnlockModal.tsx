import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { popPendingBadge, clearPendingBadge } from "@/lib/streak";

const COLORS = ["#FF6B35", "#FFE14D", "#2EC4B6", "#FFB3BA", "#B5EAD7", "#C7CEEA"];

export function BadgeUnlockModal() {
  const [badge, setBadge] = useState<ReturnType<typeof popPendingBadge>>(null);

  useEffect(() => {
    const check = () => {
      const b = popPendingBadge();
      if (b) setBadge(b);
    };
    check();
    const id = setInterval(check, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!badge) return;
    const t = setTimeout(() => close(), 5000);
    return () => clearTimeout(t);
  }, [badge]);

  function close() {
    clearPendingBadge();
    setBadge(null);
  }

  if (!badge) return null;
  const Icon = (LucideIcons as any)[badge.icon] ?? LucideIcons.Award;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] grid place-items-center px-8 backdrop-blur-sm"
        style={{ background: "rgba(26,26,46,0.6)" }}
        onClick={close}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring" }}
          className="relative bg-white rounded-[24px] p-8 text-center max-w-sm w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const left = Math.random() * 100;
            const c = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: 400, rotate: 360 }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.4, ease: "linear" }}
                style={{ position: "absolute", left: `${left}%`, top: 0, width: 8, height: 6, background: c, borderRadius: 2 }}
              />
            );
          })}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ type: "spring" }}
            className="mx-auto w-24 h-24 rounded-full grid place-items-center shadow-edu-float"
            style={{ background: badge.color }}
          >
            <Icon size={48} color="#fff" />
          </motion.div>
          <p className="mt-4 font-bold text-[14px] text-edu-muted uppercase tracking-[2px]">Nouveau badge !</p>
          <h2 className="mt-1 font-black text-[22px] text-edu-dark">{badge.name}</h2>
          <p className="mt-1 font-medium text-[14px] text-[#6B7280]">{badge.desc}</p>
          <button onClick={close} className="mt-5 w-full h-[52px] rounded-[14px] bg-edu-primary text-white font-extrabold text-[15px]">
            Super !
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}