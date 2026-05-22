import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getChild, getParent, averageProgress, type ChildState, type ParentState, MODULE_META } from "@/lib/storage";

export const Route = createFileRoute("/parent/")({ component: ParentDashboard });

function ParentDashboard() {
  const navigate = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  const [parent, setP] = useState<ParentState | null>(null);
  useEffect(() => { setC(getChild()); setP(getParent()); }, []);
  if (!child || !parent) return <div className="min-h-screen bg-edu-bg" />;

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <div className="px-5 pt-5 flex items-center justify-between">
        <button onClick={() => navigate({ to: "/home" })} className="p-1.5">
          <ArrowLeft size={24} className="text-edu-primary" />
        </button>
        <p className="text-edu-dark font-bold">Espace parent</p>
        <Link to="/parent/settings" className="p-1.5"><Settings size={22} className="text-edu-muted" /></Link>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
          <p className="text-edu-muted text-sm font-bold">Bonjour</p>
          <p className="text-edu-dark font-black text-2xl">{parent.firstName || "Parent"} 👋</p>
          <p className="text-edu-muted text-xs mt-1 font-semibold">{parent.email || "—"}</p>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
          <p className="text-edu-dark font-extrabold text-lg">{child.name}, {child.age} ans</p>
          <p className="text-edu-muted text-sm font-semibold">Progression moyenne : {averageProgress(child)}%</p>
          <div className="mt-4 space-y-2.5">
            {(Object.keys(MODULE_META) as Array<keyof typeof MODULE_META>).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-xs font-bold text-edu-dark">
                  <span>{MODULE_META[k].name}</span>
                  <span>{child.progress[k]}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden mt-1">
                  <div className="h-full rounded-full" style={{ width: `${child.progress[k]}%`, background: MODULE_META[k].color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
          <p className="text-edu-dark font-extrabold text-lg mb-3">Activité récente</p>
          <div className="space-y-3">
            {child.activities.map((a) => (
              <div key={a.id} className="flex justify-between text-sm">
                <span className="text-edu-dark font-semibold">{a.title}</span>
                <span className="text-edu-primary font-bold">+{a.starsEarned}⭐</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}