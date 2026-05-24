import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Type, Hash, Palette, Calculator, BookOpen, CheckCircle } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";
import { getChild, type ChildState, type Activity } from "@/lib/storage";

export const Route = createFileRoute("/parent/activites")({ component: ParentActivities });

const FILTERS = ["Tout", "Alphabet", "Chiffres", "Dessin", "Maths", "Histoires"] as const;
const FILTER_TO_MODULE: Record<string, string> = {
  Alphabet: "alphabet", Chiffres: "numbers", Dessin: "drawing", Maths: "maths", Histoires: "stories",
};
const ICONS: Record<string, { icon: any; bg: string }> = {
  alphabet: { icon: Type, bg: "#FFB3BA" },
  numbers: { icon: Hash, bg: "#B5EAD7" },
  drawing: { icon: Palette, bg: "#C7CEEA" },
  maths: { icon: Calculator, bg: "#FFDAC1" },
  stories: { icon: BookOpen, bg: "#D4EDDA" },
};

function ParentActivities() {
  const nav = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  const [filter, setFilter] = useState<string>("Tout");
  useEffect(() => { setC(getChild()); }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  const filtered = child.activities.filter((a) => filter === "Tout" || a.moduleId === FILTER_TO_MODULE[filter]);

  const groups = new Map<string, Activity[]>();
  filtered.forEach((a) => {
    const d = new Date(a.timestamp);
    const today = new Date(); today.setHours(0,0,0,0);
    const yest = new Date(today.getTime() - 86400000);
    const ad = new Date(d); ad.setHours(0,0,0,0);
    const key = ad.getTime() === today.getTime() ? "Aujourd'hui" : ad.getTime() === yest.getTime() ? "Hier" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  });

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/parent" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Activités</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)}
                    className={`shrink-0 rounded-full px-4 py-2 font-bold text-[13px] ${active ? "bg-edu-primary text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280]"}`}>
              {f}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mx-4 mt-8 text-center">
          <div className="flex justify-center"><Leo size={80} /></div>
          <p className="mt-2 font-semibold text-[15px] text-edu-muted">Aucune activité pour le moment</p>
          <p className="font-medium text-[13px] text-edu-muted">Invitez {child.name} à jouer !</p>
          <button onClick={() => nav({ to: "/home" })} className="mt-4 h-[52px] px-6 rounded-2xl bg-edu-primary text-white font-extrabold">Aller jouer →</button>
        </div>
      ) : (
        <div className="mt-4">
          {Array.from(groups.entries()).map(([date, items]) => (
            <div key={date} className="mb-4">
              <p className="px-4 mb-2 font-bold text-[13px] text-edu-muted">{date}</p>
              <div className="px-4 space-y-2">
                {items.map((a) => {
                  const meta = ICONS[a.moduleId] ?? ICONS.alphabet;
                  const Icon = meta.icon;
                  return (
                    <div key={a.id} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-edu-card">
                      <div className="w-10 h-10 rounded-full grid place-items-center" style={{ background: meta.bg }}>
                        <Icon size={20} color="#fff" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[14px] text-edu-dark">{a.title}</p>
                        <p className="font-medium text-[12px] text-edu-muted">{new Date(a.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-[14px]" style={{ color: "#FFE14D" }}>+{a.starsEarned} ⭐</span>
                        <CheckCircle size={16} color="#4CAF50" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav context="parent" />
    </div>
  );
}