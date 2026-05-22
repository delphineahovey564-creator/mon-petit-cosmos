import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Star, Flame, Award, Settings } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";
import { getChild, averageProgress, type ChildState, MODULE_META } from "@/lib/storage";

export const Route = createFileRoute("/profile")({ component: Profile });

const BADGE_META: Record<string, { emoji: string; label: string }> = {
  early_bird: { emoji: "🌅", label: "Lève-tôt" },
  perfect_week: { emoji: "🏆", label: "Semaine parfaite" },
  alphabet_king: { emoji: "👑", label: "Roi de l'alphabet" },
};

function Profile() {
  const navigate = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => { setC(getChild()); }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;
  const avg = averageProgress(child);

  return (
    <div className="min-h-screen bg-edu-bg pb-28">
      <div className="px-5 pt-5 flex items-center justify-between">
        <button onClick={() => navigate({ to: "/home" })} className="p-1.5">
          <ArrowLeft size={24} className="text-edu-primary" />
        </button>
        <p className="text-edu-dark font-bold">Profil</p>
        <Link to="/parent" className="p-1.5"><Settings size={22} className="text-edu-muted" /></Link>
      </div>

      {/* Identity */}
      <div className="px-5 mt-3">
        <div className="rounded-[24px] p-6 text-center text-white" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
          <div className="flex justify-center"><Leo size={100} /></div>
          <h1 className="mt-3 font-black text-2xl">{child.name}</h1>
          <p className="opacity-90 font-semibold text-sm">{child.age} ans</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        <StatCard icon={<Star size={22} fill="#FFE14D" color="#FFE14D" />} value={child.stars} label="ÉTOILES" />
        <StatCard icon={<Flame size={22} color="#FF6B35" />} value={child.streak} label="JOURS" />
        <StatCard icon={<Award size={22} color="#FFB347" />} value={child.badges.length} label="BADGES" />
      </div>

      {/* Progress */}
      <div className="px-5 mt-5">
        <h2 className="text-edu-dark font-extrabold text-lg mb-3">Progression</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] space-y-3">
          {(Object.keys(MODULE_META) as Array<keyof typeof MODULE_META>).map((k) => {
            const meta = MODULE_META[k];
            const v = child.progress[k];
            return (
              <div key={k}>
                <div className="flex justify-between text-sm font-bold text-edu-dark">
                  <span>{meta.name}</span>
                  <span className="text-edu-primary">{v}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${v}%`, background: meta.color }} />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-edu-muted font-semibold pt-1">Moyenne globale : {avg}%</p>
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 mt-5">
        <h2 className="text-edu-dark font-extrabold text-lg mb-3">Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {child.badges.map((b) => {
            const m = BADGE_META[b] ?? { emoji: "🎖️", label: b };
            return (
              <div key={b} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl">{m.emoji}</div>
                <p className="mt-1 text-edu-dark font-bold text-xs">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="px-5 mt-5">
        <h2 className="text-edu-dark font-extrabold text-lg mb-3">Dernières activités</h2>
        <div className="bg-white rounded-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] divide-y divide-[#F3F4F6]">
          {child.activities.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-edu-dark text-sm">{a.title}</p>
                <p className="text-edu-muted text-xs font-semibold">{new Date(a.timestamp).toLocaleString("fr-FR")}</p>
              </div>
              <div className="flex items-center gap-1 bg-[#FFFBEB] rounded-full px-2.5 py-1">
                <Star size={12} fill="#FFE14D" color="#FFE14D" />
                <span className="font-bold text-xs text-edu-dark">+{a.starsEarned}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex justify-center">{icon}</div>
      <p className="text-edu-dark font-black text-xl mt-1">{value}</p>
      <p className="text-edu-muted text-[10px] font-bold tracking-wider">{label}</p>
    </div>
  );
}