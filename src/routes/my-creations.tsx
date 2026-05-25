import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Download, Trash2, Plus } from "lucide-react";
import { getChild, removeCreation, type Creation } from "@/lib/storage";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";

export const Route = createFileRoute("/my-creations")({ component: MyCreations });

const FILTERS = ["Tout", "Dessins", "Lettres", "Chiffres"] as const;

function MyCreations() {
  const nav = useNavigate();
  const [items, setItems] = useState<Creation[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tout");

  useEffect(() => { setItems(getChild().creations); }, []);

  const filtered = items.filter((c) => {
    if (filter === "Tout") return true;
    if (filter === "Dessins") return c.type === "drawing";
    if (filter === "Lettres") return c.type === "letter";
    if (filter === "Chiffres") return c.type === "number";
    return true;
  });

  function del(id: string) {
    if (!confirm("Supprimer cette création ?")) return;
    removeCreation(id);
    setItems(getChild().creations);
  }
  function share(c: Creation) {
    const navAny = navigator as any;
    if (navAny.share) navAny.share({ title: "Ma création EducEnfant", text: "Regarde ce que j'ai créé !" }).catch(() => {});
    else alert("Partage non disponible — capture d'écran possible !");
  }
  function pdf(c: Creation) {
    if (!c.imageBase64) { alert("Pas d'image à exporter."); return; }
    const w = window.open(""); if (!w) return;
    w.document.write(`<img src="${c.imageBase64}" style="max-width:100%"/><script>window.print()</script>`);
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] pb-28">
        <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
          <Link to="/home"><ArrowLeft size={24} color="#FF6B35" /></Link>
          <h1 className="font-bold text-[18px]">Mes Créations</h1><div className="w-6" />
        </header>
        <div className="text-center px-6 py-10">
          <Leo size={80} float />
          <h2 className="mt-4 font-bold text-[18px] text-[#9CA3AF]">Aucune création pour l'instant !</h2>
          <p className="mt-2 font-medium text-[14px] text-[#9CA3AF]">Va dans Dessin pour créer quelque chose !</p>
          <Link to="/module/drawing" className="mt-6 inline-block h-[52px] px-6 rounded-xl bg-[#FF6B35] text-white font-extrabold leading-[52px]">Aller dessiner →</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const totalStars = items.reduce((s, c) => s + (c.starsEarned ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px]">Mes Créations</h1><div className="w-6" />
      </header>

      <div className="mx-4 mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="shrink-0 rounded-full px-4 py-2 font-bold text-[13px] border"
            style={{ background: filter === f ? "#FF6B35" : "#FFFFFF", color: filter === f ? "#FFFFFF" : "#6B7280", borderColor: filter === f ? "#FF6B35" : "#E5E7EB" }}>{f}</button>
        ))}
      </div>

      <div className="mx-4 mt-3 bg-white rounded-[16px] shadow-edu-card py-3.5 px-5 flex justify-around">
        <div className="text-center"><p className="font-black text-[20px] text-[#FF6B35]">{items.length}</p><p className="text-[12px] text-[#9CA3AF]">Créations</p></div>
        <div className="text-center"><p className="font-black text-[20px] text-[#FF6B35]">{totalStars}</p><p className="text-[12px] text-[#9CA3AF]">Étoiles</p></div>
        <div className="text-center"><p className="font-black text-[20px] text-[#FF6B35]">{items.filter(c => new Date(c.timestamp).getMonth() === new Date().getMonth()).length}</p><p className="text-[12px] text-[#9CA3AF]">Ce mois</p></div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <AnimatePresence>
          {filtered.map((c) => {
            const typeLabel = c.type === "drawing" ? "Dessin" : c.type === "letter" ? `Lettre ${c.label}` : `Chiffre ${c.label}`;
            const typeBg = c.type === "drawing" ? "#C7CEEA" : c.type === "letter" ? "#FFB3BA" : "#B5EAD7";
            return (
              <motion.div key={c.id} layout exit={{ scale: 0, opacity: 0 }} className="rounded-[20px] overflow-hidden shadow-edu-card bg-white">
                <div className="h-[140px] bg-[#F3F4F6] grid place-items-center">
                  {c.imageBase64 ? <img src={c.imageBase64} alt={c.label} className="w-full h-full object-cover" /> : <span className="text-[48px]">🎨</span>}
                </div>
                <div className="p-3">
                  <span className="inline-block rounded-full px-2 py-0.5 font-bold text-[10px] text-[#1A1A2E]" style={{ background: typeBg }}>{typeLabel}</span>
                  <p className="mt-1 text-[11px] text-[#9CA3AF] font-medium">{new Date(c.timestamp).toLocaleDateString("fr-FR")}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => share(c)} className="w-8 h-8 rounded-full bg-[#FF6B35] grid place-items-center"><Share2 size={14} color="white" /></button>
                    <button onClick={() => pdf(c)} className="w-8 h-8 rounded-full bg-white border-[1.5px] border-[#E5E7EB] grid place-items-center"><Download size={14} color="#6B7280" /></button>
                    <button onClick={() => del(c.id)} className="w-8 h-8 rounded-full bg-white border-[1.5px] border-[#E5E7EB] grid place-items-center"><Trash2 size={14} color="#FF5252" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
        onClick={() => nav({ to: "/module/drawing" })}
        className="fixed bottom-[90px] right-5 w-14 h-14 rounded-full bg-[#FF6B35] grid place-items-center shadow-edu-btn z-50">
        <Plus size={24} color="white" />
      </motion.button>
      <BottomNav />
    </div>
  );
}
