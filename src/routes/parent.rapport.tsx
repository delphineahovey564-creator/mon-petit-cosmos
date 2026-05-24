import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { getChild, averageProgress, MODULE_META, type ChildState } from "@/lib/storage";
import { exportParentReportPDF } from "@/lib/pdfExport";

export const Route = createFileRoute("/parent/rapport")({ component: ParentReport });

function ParentReport() {
  const nav = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => { setC(getChild()); }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/parent" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Rapport hebdo</h1>
        <div className="w-6" />
      </header>

      <div id="parent-report-area" className="mx-4 mt-4 bg-white rounded-[24px] shadow-edu-card p-6">
        <p className="font-black text-[22px] text-edu-dark">{child.name}, {child.age} ans</p>
        <p className="font-medium text-[13px] text-[#6B7280] mt-1">Score moyen : {averageProgress(child)}% — {child.stars} ⭐</p>

        <div className="mt-5 space-y-3">
          {(Object.keys(MODULE_META) as Array<keyof typeof MODULE_META>).map((k) => (
            <div key={k}>
              <div className="flex justify-between font-bold text-[13px] text-edu-dark">
                <span>{MODULE_META[k].name}</span><span>{child.progress[k]}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${child.progress[k]}%`, background: MODULE_META[k].color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="font-extrabold text-[15px] text-edu-dark mb-2">Activités récentes</p>
          <ul className="space-y-1.5 text-[13px]">
            {child.activities.slice(0, 8).map((a) => (
              <li key={a.id} className="flex justify-between font-medium text-[#1A1A2E]">
                <span>{a.title}</span><span className="text-edu-primary font-bold">+{a.starsEarned}⭐</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button id="pdf-btn" onClick={() => exportParentReportPDF(child.name)} className="mx-auto mt-5 flex items-center gap-2 bg-edu-primary text-white font-extrabold rounded-2xl px-6 py-3 disabled:opacity-50">
        <Download size={18} /> Télécharger en PDF
      </button>

      <BottomNav context="parent" />
    </div>
  );
}