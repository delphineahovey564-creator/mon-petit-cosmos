import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Award, Download, Share2, Printer, Star } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { getChild } from "@/lib/storage";

export const Route = createFileRoute("/certificate/$type")({ component: CertificatePage });

const MODULE_LABEL: Record<string, string> = {
  alphabet: "L'Alphabet EducEnfant",
  numbers: "Les Chiffres EducEnfant",
  drawing: "Le Dessin EducEnfant",
  maths: "Les Mathématiques EducEnfant",
  stories: "Les Histoires EducEnfant",
  weekly: "Le Défi de la Semaine",
};

function CertificatePage() {
  const { type } = Route.useParams();
  const nav = useNavigate();
  const [child] = useState(() => getChild());
  const label = MODULE_LABEL[type] || "EducEnfant";
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  async function capture(): Promise<HTMLCanvasElement | null> {
    const el = document.getElementById("certificate-card");
    if (!el) return null;
    return html2canvas(el, { scale: 3, backgroundColor: "#ffffff" });
  }

  async function download() {
    const canvas = await capture(); if (!canvas) return;
    const link = document.createElement("a");
    link.download = `certificat_${type}_${child.name}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
    toast.success("Certificat téléchargé !");
  }

  async function share() {
    const canvas = await capture(); if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `certificat_${child.name}.png`, { type: "image/png" });
      if (navigator.share && (navigator as any).canShare?.({ files: [file] })) {
        try { await navigator.share({ title: `${child.name} a réussi sur EducEnfant ! 🎉`, text: "Découvrez EducEnfant, l'app éducative pour les enfants !", files: [file] }); } catch {}
      } else {
        await navigator.clipboard.writeText(`${child.name} vient de maîtriser ${type} sur EducEnfant ! 🦁⭐ educenfant.app`);
        toast.success("Lien copié ! Partagez sur WhatsApp ou Facebook.");
      }
    });
  }

  async function print() {
    const canvas = await capture(); if (!canvas) return;
    const win = window.open("", "_blank"); if (!win) return;
    win.document.write(`<html><head><title>Certificat ${child.name}</title><style>body{margin:0}img{width:100%;max-width:600px;display:block;margin:0 auto}</style></head><body><img src="${canvas.toDataURL()}" /><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
  }

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-edu-dark">Mon Certificat</h1>
        <div className="w-6" />
      </header>

      <div id="certificate-card" className="mx-4 mt-4 bg-white rounded-[24px] overflow-hidden border-2 border-[#FFE14D]" style={{ boxShadow: "0px 12px 40px rgba(0,0,0,0.1)" }}>
        <div className="h-20 px-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
          <div>
            <p className="font-black text-[18px] text-white">EducEnfant</p>
            <p className="font-medium text-[11px] text-white/80">Apprendre en jouant</p>
          </div>
          <Award size={36} color="white" />
        </div>
        <div className="p-7 text-center">
          <p className="font-medium text-[14px] text-edu-subtle uppercase tracking-[2px]">Certificat de réussite</p>
          <div className="my-4 flex items-center justify-center gap-3">
            <div className="h-px bg-[#FFE14D] w-12" />
            <Star size={18} fill="#FFE14D" color="#FFE14D" />
            <div className="h-px bg-[#FFE14D] w-12" />
          </div>
          <p className="font-black text-[36px] text-edu-dark italic">{child.name}</p>
          <p className="mt-1 font-medium text-[15px] text-edu-muted">a maîtrisé avec succès</p>
          <p className="mt-2 font-extrabold text-[22px] text-edu-primary">{label}</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat v={child.stars} l="Étoiles" />
            <Stat v={child.completedLetters.length} l="Lettres" />
            <Stat v={child.streak} l="Jours" />
          </div>

          <div className="mt-5 flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={20} fill="#FFE14D" color="#FFE14D" />)}
          </div>
          <p className="mt-4 font-medium text-[12px] text-edu-subtle">Obtenu le {today}</p>
        </div>
        <div className="px-5 pb-3 flex items-center justify-between">
          <span className="font-medium text-[10px] text-[#D1D5DB]">educenfant.app</span>
          <div className="w-16 h-16 rounded-full bg-edu-primary grid place-items-center text-2xl">🦁</div>
        </div>
      </div>

      <div className="mx-4 mt-6 space-y-3">
        <button onClick={download} className="w-full h-[52px] rounded-[14px] bg-edu-primary text-white font-extrabold shadow-edu-btn flex items-center justify-center gap-2"><Download size={18} /> Télécharger le certificat</button>
        <button onClick={share} className="w-full h-[52px] rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-edu-muted font-bold flex items-center justify-center gap-2"><Share2 size={18} /> Partager</button>
        <button onClick={print} className="w-full h-12 rounded-[14px] bg-white border-[1.5px] border-[#E5E7EB] text-edu-muted font-bold flex items-center justify-center gap-2"><Printer size={18} /> Imprimer</button>
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: number; l: string }) {
  return (
    <div className="bg-edu-bg rounded-[12px] p-3">
      <p className="font-black text-[20px] text-edu-primary">{v}</p>
      <p className="font-bold text-[10px] text-edu-subtle uppercase">{l}</p>
    </div>
  );
}