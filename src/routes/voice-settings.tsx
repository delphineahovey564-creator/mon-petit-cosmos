import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Leo } from "@/components/educ/Leo";
import { audioEngine, VOICE_PROFILES, type VoiceProfile, speak } from "@/lib/audio";

export const Route = createFileRoute("/voice-settings")({ component: VoiceSettings });

function rateLabel(r: number) { return r <= 0.7 ? "Lent" : r <= 0.85 ? "Normal" : "Rapide"; }
function pitchLabel(p: number) { return p >= 1.4 ? "Aigu" : p >= 1.0 ? "Normal" : "Grave"; }

function VoiceSettings() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<VoiceProfile>(audioEngine.getProfile());
  const [previewed, setPreviewed] = useState(false);

  function preview(p: VoiceProfile) {
    setSelected(p);
    setPreviewed(true);
    audioEngine.speak(`Bonjour ! Je suis ${p.displayName}. Je vais t'aider à apprendre !`, { pitch: p.pitch, rate: p.rate });
  }

  function confirm() {
    audioEngine.setProfile(selected);
    setTimeout(() => speak("Super ! J'utiliserai cette voix pour toi !"), 200);
    setTimeout(() => nav({ to: "/parent/reglages" }), 1500);
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-[180px]">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/parent/reglages" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Choisir la voix</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 bg-[#FFF0E8] rounded-[20px] p-5 flex items-center gap-3">
        <Leo size={48} />
        <div>
          <p className="font-bold text-[16px] text-edu-dark">Quelle voix préfères-tu ?</p>
          <p className="font-medium text-[13px] text-edu-muted">Appuie sur une voix pour l'essayer !</p>
        </div>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-3">
        {VOICE_PROFILES.map((p) => {
          const isSel = selected.name === p.name;
          return (
            <motion.button
              key={p.name}
              onClick={() => preview(p)}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: isSel ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="rounded-[20px] p-4 shadow-edu-card flex items-center gap-3 text-left"
              style={{
                background: isSel ? "#FFF0E8" : "#FFFFFF",
                border: isSel ? "2px solid #FF6B35" : "2px solid transparent",
              }}
            >
              <div className="w-[52px] h-[52px] rounded-full grid place-items-center text-[28px] shrink-0" style={{ background: p.color }}>
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-[16px] text-edu-dark">{p.displayName}</p>
                <p className="font-medium text-[12px] text-edu-muted">{p.description}</p>
                <div className="mt-1.5 flex gap-2">
                  <span className="bg-[#F3F4F6] text-edu-muted font-semibold text-[11px] rounded-full px-2 py-0.5">{rateLabel(p.rate)}</span>
                  <span className="bg-[#F3F4F6] text-edu-muted font-semibold text-[11px] rounded-full px-2 py-0.5">{pitchLabel(p.pitch)}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                {isSel ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <Check size={22} color="#FF6B35" />
                  </motion.div>
                ) : (
                  <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-[#E5E7EB]" />
                )}
                <span className="bg-edu-primary text-white font-bold text-[11px] rounded-full px-2.5 py-0.5">Essayer</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#F3F4F6] px-5 py-4 z-50">
        <p className="text-center font-medium text-[12px] text-[#9CA3AF] mb-3">Écoute les voix et choisis ta préférée</p>
        <button
          onClick={confirm}
          disabled={!previewed}
          className="w-full h-[52px] rounded-[14px] font-extrabold text-[15px] text-white"
          style={{ background: previewed ? "#FF6B35" : "#D1D5DB" }}
        >
          Confirmer ce choix
        </button>
      </div>
    </div>
  );
}