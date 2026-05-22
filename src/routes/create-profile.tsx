import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil, Check, Crown, Zap, Heart, Star, Eye, Smile, Anchor, Music } from "lucide-react";
import { PrimaryButton } from "@/components/educ/PrimaryButton";
import { Leo } from "@/components/educ/Leo";
import { setChild } from "@/lib/storage";

export const Route = createFileRoute("/create-profile")({ component: CreateProfile });

const AVATARS = [
  { id: "lion",     bg: "#FFB3BA", icon: Crown,  label: "Lion" },
  { id: "fox",      bg: "#FFDAC1", icon: Zap,    label: "Renard" },
  { id: "bear",     bg: "#B5EAD7", icon: Heart,  label: "Ours" },
  { id: "penguin",  bg: "#C7CEEA", icon: Star,   label: "Pingouin" },
  { id: "owl",      bg: "#D4EDDA", icon: Eye,    label: "Hibou" },
  { id: "rabbit",   bg: "#FFF0E8", icon: Smile,  label: "Lapin" },
  { id: "elephant", bg: "#E8F4FD", icon: Anchor, label: "Éléphant" },
  { id: "cat",      bg: "#F3E8FF", icon: Music,  label: "Chat" },
];

function CreateProfile() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("lion");
  const [name, setName] = useState("Toni");
  const [age, setAge] = useState(7);

  const submit = () => {
    setChild({ name, age, avatar });
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-edu-bg flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate({ to: "/signup" })} className="p-1.5">
            <ArrowLeft size={24} className="text-edu-primary" />
          </button>
          <div className="text-center">
            <p className="text-edu-dark font-bold text-base">Créer le profil</p>
            <span className="inline-block mt-0.5 bg-edu-primary-pale text-edu-primary text-xs font-bold rounded-full px-2.5 py-0.5">1 / 2</span>
          </div>
          <div className="w-8" />
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-edu-primary-pale overflow-hidden">
          <div className="h-full w-1/2 bg-edu-primary rounded-full" />
        </div>
      </div>

      {/* Leo + speech */}
      <div className="px-5 mt-5 flex items-end justify-between gap-3">
        <div className="bg-white border-[1.5px] border-edu-primary-pale rounded-xl rounded-bl-none px-3.5 py-2.5 flex-1">
          <p className="font-bold text-[14px] text-edu-dark">
            Choisissez un avatar pour <span className="text-edu-primary">{name}</span>
          </p>
        </div>
        <div className="rounded-xl overflow-hidden bg-edu-primary-pale p-1">
          <Leo size={80} />
        </div>
      </div>

      {/* Avatars grid */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((a) => {
            const Icon = a.icon;
            const selected = avatar === a.id;
            return (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.92 }}
                animate={{ scale: selected ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                onClick={() => setAvatar(a.id)}
                className="relative aspect-square rounded-full grid place-items-center"
                style={{
                  background: a.bg,
                  outline: selected ? "3px solid #FF6B35" : "1.5px solid #E5E7EB",
                  outlineOffset: selected ? "2px" : "0px",
                }}
              >
                <Icon size={28} className="text-edu-dark" strokeWidth={2.5} />
                {selected && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-edu-primary grid place-items-center border-2 border-edu-bg">
                    <Check size={12} color="white" strokeWidth={3.5} />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Name */}
      <div className="px-5 mt-7">
        <label className="block text-edu-dark font-bold text-base mb-2">Prénom de l'enfant</label>
        <div className="relative">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[60px] rounded-[14px] bg-white border-2 border-[#E5E7EB] text-center text-[22px] font-extrabold text-edu-dark outline-none focus:border-edu-primary transition-colors"
          />
          <Pencil size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-edu-primary" />
        </div>
      </div>

      {/* Age */}
      <div className="px-5 mt-6">
        <label className="block text-edu-dark font-bold text-base mb-3">Quel âge a-t-il/elle ?</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const sel = age === n;
            return (
              <button
                key={n}
                onClick={() => setAge(n)}
                className="w-12 h-12 shrink-0 rounded-full font-extrabold text-base transition-transform"
                style={{
                  background: sel ? "#FF6B35" : "white",
                  color: sel ? "white" : "#6B7280",
                  border: sel ? "none" : "1.5px solid #E5E7EB",
                  boxShadow: sel ? "0px 6px 16px rgba(255,107,53,0.28)" : undefined,
                  transform: sel ? "scale(1.1)" : "scale(1)",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-5 pb-6 pt-8" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}>
        <PrimaryButton disabled={!name.trim()} onClick={submit}>Continuer →</PrimaryButton>
      </div>
    </div>
  );
}