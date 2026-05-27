import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Share2, Gift } from "lucide-react";
import { toast } from "sonner";
import { Leo } from "@/components/educ/Leo";
import { getParent, setParent } from "@/lib/storage";

export const Route = createFileRoute("/invite")({ component: InvitePage });

function generateCode(name: string): string {
  const base = (name || "ABC").replace(/[^a-zA-Z]/g, "").toUpperCase().padEnd(3, "X").slice(0, 3);
  const digits = Math.floor(100 + Math.random() * 900);
  return `${base}${digits}`;
}

function InvitePage() {
  const nav = useNavigate();
  const [code, setCode] = useState("ABC123");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = getParent();
    let c = p.referralCode;
    if (!c) { c = generateCode(p.firstName || "FAM"); setParent({ referralCode: c }); }
    setCode(c);
  }, []);

  const shareMessage = `Découvrez EducEnfant, l'app éducative pour les enfants ! Mon code de parrainage : ${code} 🦁 educenfant.app`;

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copié ! ✓");
    setTimeout(() => setCopied(false), 1500);
  }

  async function shareOther() {
    if (navigator.share) {
      try { await navigator.share({ title: "EducEnfant", text: shareMessage, url: "https://educenfant.app" }); } catch {}
    } else {
      navigator.clipboard.writeText(shareMessage);
      toast.success("Message copié !");
    }
  }

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/parent" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-edu-dark">Inviter des proches</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 rounded-[24px] p-6 text-center" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
        <div className="flex justify-center"><Leo size={80} float /></div>
        <p className="mt-3 font-black text-[20px] text-white">Partagez EducEnfant avec vos proches !</p>
        <p className="mt-1 font-medium text-[14px] text-white/80">Et gagnez des récompenses ensemble</p>
      </div>

      <div className="mx-4 mt-5 bg-white rounded-[20px] shadow-edu-card p-5">
        <p className="font-bold text-[14px] text-edu-muted text-center">Votre code de parrainage</p>
        <div className="mt-2 flex justify-center gap-2">
          {code.split("").map((c, i) => (
            <div key={i} className="w-9 h-9 rounded-[8px] bg-edu-primary grid place-items-center font-black text-[18px] text-white">{c}</div>
          ))}
        </div>
        <button onClick={copyCode} className="mt-4 w-full h-12 rounded-[12px] bg-edu-primary text-white flex items-center justify-center gap-2" style={{ background: copied ? "#4CAF50" : "#FF6B35" }}>
          <Copy size={16} color="white" /> <span className="font-bold text-[14px] text-white">{copied ? "Copié ✓" : "Copier"}</span>
        </button>
      </div>

      <div className="mx-4 mt-5">
        <p className="font-extrabold text-[16px] text-edu-dark">Comment ça marche ?</p>
        <div className="mt-3 space-y-3">
          {[
            { t: "Partagez votre code", d: "Envoyez le code à un parent ou ami" },
            { t: "Votre ami s'inscrit", d: "Il utilise votre code lors de l'inscription" },
            { t: "Vous gagnez tous les deux", d: "50 étoiles bonus pour vous et votre filleul !" },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-edu-primary grid place-items-center font-black text-white text-[14px] shrink-0">{i + 1}</div>
              <div><p className="font-bold text-[14px] text-edu-dark">{s.t}</p><p className="font-medium text-[12px] text-edu-muted">{s.d}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-5 space-y-2.5">
        <p className="font-bold text-[14px] text-edu-dark">Partager directement</p>
        <a href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`} target="_blank" rel="noreferrer" className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-extrabold text-[14px] text-white" style={{ background: "#25D366" }}>
          <Share2 size={20} color="white" /> Partager sur WhatsApp
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=educenfant.app&quote=${encodeURIComponent(shareMessage)}`} target="_blank" rel="noreferrer" className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-extrabold text-[14px] text-white" style={{ background: "#1877F2" }}>
          <Share2 size={20} color="white" /> Partager sur Facebook
        </a>
        <button onClick={shareOther} className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-extrabold text-[14px] text-edu-muted bg-white border-[1.5px] border-[#E5E7EB]">
          <Share2 size={20} color="#6B7280" /> Partager ailleurs
        </button>
      </div>

      <div className="mx-4 mt-5 bg-white rounded-[20px] shadow-edu-card p-5">
        <p className="font-bold text-[16px] text-edu-dark">Vos parrainages</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="text-center"><p className="font-black text-[24px] text-edu-primary">2</p><p className="font-medium text-[12px] text-edu-subtle">Amis invités</p></div>
          <div className="text-center"><p className="font-black text-[24px]" style={{ color: "#FFE14D" }}>100</p><p className="font-medium text-[12px] text-edu-subtle">Étoiles gagnées</p></div>
        </div>
      </div>
    </div>
  );
}