import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CreditCard, Calendar, Lock, Shield, Loader } from "lucide-react";
import { activatePremium } from "@/lib/premium";

export const Route = createFileRoute("/subscribe")({ component: SubscribePage });

function SubscribePage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"mobile" | "card">("mobile");
  const [operator, setOperator] = useState<"mtn" | "moov" | null>(null);
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "" });
  const [loading, setLoading] = useState(false);

  function pay() {
    setLoading(true);
    setTimeout(() => {
      activatePremium(1);
      nav({ to: "/subscribe/success" });
    }, 2000);
  }

  function fmtCard(v: string) { return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/pricing" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-edu-dark">Finaliser l'abonnement</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-5">
        <p className="font-bold text-[16px] text-edu-dark">Récapitulatif de commande</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-[14px] text-edu-dark">EducEnfant Premium</p>
            <span className="inline-block mt-1 bg-edu-primary text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">Premium</span>
          </div>
          <p className="font-black text-[18px] text-edu-primary">3 000 FCFA</p>
        </div>
        <p className="font-medium text-[12px] text-edu-subtle">/ mois — résiliation à tout moment</p>
        <div className="my-3 h-px bg-[#F3F4F6]" />
        <ul className="space-y-1">
          {["Accès complet illimité", "1 compte, profils illimités", "Essai 7 jours remboursable"].map((t) => (
            <li key={t} className="font-semibold text-[13px] text-[#4CAF50]">✓ {t}</li>
          ))}
        </ul>
      </div>

      <div className="mx-4 mt-5">
        <p className="font-bold text-[16px] text-edu-dark">Choisir le mode de paiement</p>
        <div className="mt-3 bg-[#F3F4F6] rounded-[12px] p-1 flex">
          {[
            { id: "mobile", label: "Mobile Money" },
            { id: "card", label: "Carte bancaire" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex-1 py-2 rounded-[10px] font-bold text-[14px] ${tab === t.id ? "bg-white shadow-edu-card text-edu-dark" : "text-edu-muted"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab === "mobile" ? (
        <div className="mx-4 mt-4">
          <p className="font-semibold text-[14px] text-edu-muted mb-3">Votre numéro Mobile Money</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setOperator("mtn")} className="h-14 rounded-[12px] font-extrabold text-[14px] text-edu-dark" style={{ background: "#FFE14D", border: operator === "mtn" ? "2px solid #FF6B35" : "2px solid transparent" }}>MTN Money</button>
            <button onClick={() => setOperator("moov")} className="h-14 rounded-[12px] font-extrabold text-[14px] text-edu-dark" style={{ background: "#E8F4FD", border: operator === "moov" ? "2px solid #2EC4B6" : "2px solid transparent" }}>Moov Money</button>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-[13px] text-edu-muted mb-1.5">Numéro de téléphone</p>
            <div className="flex items-center bg-white rounded-[12px] border border-[#E5E7EB] h-14 px-4">
              <span className="font-bold text-edu-dark mr-2">+229</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="XX XX XX XX" type="tel" className="flex-1 outline-none font-bold text-[16px] text-edu-dark" />
            </div>
            <p className="font-medium text-[12px] text-edu-subtle mt-2">Vous recevrez une notification sur votre téléphone pour confirmer</p>
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-4 space-y-3">
          <Field icon={<CreditCard size={18} color="#9CA3AF" />} placeholder="0000 0000 0000 0000" value={card.num} onChange={(v) => setCard({ ...card, num: fmtCard(v) })} />
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Calendar size={18} color="#9CA3AF" />} placeholder="MM / AA" value={card.exp} onChange={(v) => setCard({ ...card, exp: v })} />
            <Field icon={<Lock size={18} color="#9CA3AF" />} placeholder="123" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 4) })} />
          </div>
          <Field icon={<CreditCard size={18} color="#9CA3AF" />} placeholder="Nom sur la carte" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
        </div>
      )}

      <div className="mx-4 mt-6">
        <button disabled={loading} onClick={pay} className="w-full h-14 rounded-[14px] bg-edu-primary text-white font-extrabold text-[16px] shadow-edu-btn flex items-center justify-center gap-2 disabled:opacity-70">
          {loading ? <><Loader size={18} className="animate-spin" /> Traitement...</> : "Payer 3 000 FCFA →"}
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <Shield size={14} color="#4CAF50" />
          <span className="font-medium text-[12px] text-edu-subtle">Paiement 100% sécurisé — SSL</span>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, placeholder, value, onChange }: { icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center bg-white rounded-[12px] border border-[#E5E7EB] h-14 px-4 gap-2">
      {icon}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1 outline-none font-bold text-[15px] text-edu-dark placeholder:text-edu-subtle" />
    </div>
  );
}