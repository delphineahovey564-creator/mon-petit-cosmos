import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Crown, Check, Shield, RefreshCw, Users, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

const FREE_FEATURES = [
  { ok: true, t: "Alphabet A à M (13 lettres)" },
  { ok: true, t: "Chiffres 0 à 10" },
  { ok: true, t: "2 histoires gratuites" },
  { ok: true, t: "Dessin libre basique" },
  { ok: true, t: "3 exports PDF" },
  { ok: false, t: "Alphabet complet A-Z" },
  { ok: false, t: "Chiffres 0-20 complets" },
  { ok: false, t: "Maths (multiplication, division)" },
  { ok: false, t: "Toutes les histoires (6+)" },
  { ok: false, t: "PDF illimité" },
  { ok: false, t: "Suivi parent avancé" },
];
const PREMIUM_FEATURES = [
  "Alphabet complet A-Z (26 lettres)",
  "Chiffres 0 à 20 (21 chiffres)",
  "Mathématiques complet (4 opérations)",
  "Toutes les histoires + nouveautés",
  "Dessin : galerie thématique complète",
  "Export PDF illimité",
  "Suivi parent détaillé avec graphiques",
  "Notifications et rappels quotidiens",
  "Badges et récompenses exclusifs",
  "Certificats imprimables",
  "Support prioritaire",
];
const FAQ = [
  { q: "Puis-je annuler à tout moment ?", a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis les réglages." },
  { q: "Le paiement est-il sécurisé ?", a: "Oui, nous utilisons CinetPay pour les paiements Mobile Money et Stripe pour les cartes bancaires." },
  { q: "Puis-je utiliser un seul abonnement pour plusieurs enfants ?", a: "Oui, un abonnement Premium couvre tous les profils enfants de votre compte." },
  { q: "Y a-t-il une version d'essai ?", a: "La version gratuite est disponible sans limite de temps. Le Premium offre 7 jours de remboursement." },
];

function PricingPage() {
  const nav = useNavigate();
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-edu-dark">Choisir un forfait</h1>
        <button onClick={() => nav({ to: "/home" })}><X size={24} color="#6B7280" /></button>
      </header>

      <div className="mx-4 mt-4 rounded-[24px] p-6 text-center" style={{ background: "linear-gradient(135deg,#1A1A2E,#2D3748)" }}>
        <Crown size={48} color="#FFE14D" className="mx-auto" />
        <p className="mt-2 font-black text-[22px] text-white">Débloquez tout EducEnfant !</p>
        <p className="mt-1 font-medium text-[14px] text-white/70">Des centaines d'exercices pour votre enfant</p>
      </div>

      <div className="mx-4 mt-5 bg-[#F3F4F6] rounded-[12px] p-1 flex">
        {(["monthly", "annual"] as const).map((p) => (
          <button key={p} onClick={() => setPlan(p)} className={`flex-1 py-2 rounded-[10px] font-bold text-[14px] ${plan === p ? "bg-white shadow-edu-card text-edu-dark" : "text-edu-muted"}`}>
            {p === "monthly" ? "Mensuel" : "Annuel (-30%)"}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 bg-white rounded-[24px] shadow-edu-card p-6">
        <span className="inline-block bg-[#F3F4F6] text-edu-dark font-bold text-[11px] px-3 py-1 rounded-full">Gratuit</span>
        <p className="mt-2 font-black text-[28px] text-edu-dark">0 FCFA <span className="text-[14px] font-bold text-edu-muted">/ mois</span></p>
        <ul className="mt-4 space-y-2">
          {FREE_FEATURES.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              {f.ok ? <Check size={16} color="#4CAF50" className="mt-0.5 shrink-0" /> : <X size={16} color="#D1D5DB" className="mt-0.5 shrink-0" />}
              <span className="font-semibold text-[14px]" style={{ color: f.ok ? "#1A1A2E" : "#D1D5DB" }}>{f.t}</span>
            </li>
          ))}
        </ul>
        <button disabled className="mt-5 w-full h-12 rounded-[14px] bg-[#F3F4F6] text-edu-subtle font-bold">Votre forfait actuel</button>
      </div>

      <div className="relative mx-4 mt-3 rounded-[24px] p-6 shadow-edu-btn border-2 border-[#FFE14D]" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
        <span className="absolute -top-3 right-3 bg-[#FFE14D] text-edu-dark font-extrabold text-[11px] uppercase tracking-wider rounded-full px-3 py-1">Meilleur choix</span>
        <span className="inline-block bg-white/30 text-white font-bold text-[11px] px-3 py-1 rounded-full">Premium</span>
        <p className="mt-2 font-black text-[28px] text-white">
          {plan === "monthly" ? "3 000 FCFA" : "25 200 FCFA"} <span className="text-[14px] font-bold text-white/80">/ {plan === "monthly" ? "mois" : "an"}</span>
        </p>
        <p className="font-medium text-[12px] text-white/80">{plan === "monthly" ? "(~5€ / mois)" : "(= 2 100 FCFA/mois — 30% économisé)"}</p>
        <ul className="mt-4 space-y-2">
          {PREMIUM_FEATURES.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={16} color="white" className="mt-0.5 shrink-0" />
              <span className="font-semibold text-[14px] text-white">{f}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => nav({ to: "/subscribe" })} className="mt-5 w-full h-14 rounded-[14px] bg-white text-edu-primary font-extrabold text-[16px]" style={{ boxShadow: "0px 6px 16px rgba(0,0,0,0.15)" }}>
          Commencer maintenant →
        </button>
      </div>

      <div className="mx-4 mt-4 flex gap-2">
        {[
          { Icon: Shield, color: "#4CAF50", label: "Paiement sécurisé" },
          { Icon: RefreshCw, color: "#2EC4B6", label: "Remboursement 7j" },
          { Icon: Users, color: "#FF6B35", label: "500+ familles" },
        ].map((b, i) => (
          <div key={i} className="flex-1 bg-white rounded-[12px] shadow-edu-card px-3 py-2.5 flex items-center gap-1.5">
            <b.Icon size={16} color={b.color} />
            <span className="font-semibold text-[11px] text-edu-muted">{b.label}</span>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-6">
        <h3 className="font-extrabold text-[18px] text-edu-dark mb-2">Questions fréquentes</h3>
        <div className="space-y-2">
          {FAQ.map((f, i) => (
            <div key={i} className="bg-white rounded-[16px] shadow-edu-card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-4 py-3.5 flex items-center justify-between text-left">
                <span className="font-bold text-[14px] text-edu-dark">{f.q}</span>
                <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }}><ChevronDown size={18} color="#6B7280" /></motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-4 pb-4 font-medium text-[13px] text-edu-muted">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}