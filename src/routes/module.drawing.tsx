import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Star, Sun, Cat, Dog, Fish, TreeDeciduous, Star as StarIcon, RotateCcw, Save, FileDown } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { TracingCanvas, clearCanvas } from "@/components/educ/TracingCanvas";
import { ExerciseToolbar } from "@/components/educ/ExerciseToolbar";
import { TOOLS } from "@/lib/eduData";
import { exportDrawingPDF } from "@/lib/pdfExport";
import { getChild } from "@/lib/storage";

export const Route = createFileRoute("/module/drawing")({ component: DrawingCanvas });

const GALLERY = [
  { id: "soleil", label: "Soleil", icon: Sun },
  { id: "chat", label: "Chat", icon: Cat },
  { id: "chien", label: "Chien", icon: Dog },
  { id: "poisson", label: "Poisson", icon: Fish },
  { id: "arbre", label: "Arbre", icon: TreeDeciduous },
  { id: "etoile", label: "Étoile", icon: StarIcon },
];

function DrawingCanvas() {
  const [tab, setTab] = useState<"galerie" | "libre">("galerie");
  const [toolId, setToolId] = useState("crayon");
  const [color, setColor] = useState("#FF6B35");
  const [guide, setGuide] = useState<string | undefined>(undefined);
  const tool = TOOLS.find((t) => t.id === toolId)!;
  const traceRef = useRef<HTMLDivElement | null>(null);

  function save() {
    alert("Création sauvegardée ! ⭐");
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-28">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <Link to="/home" className="p-1"><ArrowLeft size={24} color="#FF6B35" /></Link>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">Dessin & Coloriage</h1>
        <div className="flex items-center gap-1 bg-[#FFFBEB] rounded-full px-3 py-1.5">
          <Star size={14} fill="#FFE14D" color="#FFE14D" /><span className="font-extrabold text-[13px]">⭐</span>
        </div>
      </header>

      <div className="mx-4 mt-4 bg-[#F3F4F6] rounded-xl p-1 flex">
        {(["galerie", "libre"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 h-10 rounded-lg font-bold text-[14px] ${tab === t ? "bg-white shadow-edu-card text-[#1A1A2E]" : "text-[#9CA3AF]"}`}
          >
            {t === "galerie" ? "Galerie" : "Dessin libre"}
          </button>
        ))}
      </div>

      {tab === "galerie" ? (
        <div className="px-4 mt-4">
          <h2 className="font-extrabold text-[18px] text-[#1A1A2E] mb-3">Choisis un dessin à colorier</h2>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY.map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  onClick={() => { setGuide(undefined); setTab("libre"); }}
                  className="rounded-[20px] bg-[#F9FAFB] border-[1.5px] border-[#E5E7EB] flex flex-col items-center justify-center gap-2"
                  style={{ height: 140 }}
                >
                  <Icon size={64} color="#D1D5DB" />
                  <span className="font-bold text-[14px] text-[#1A1A2E]">{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div id="drawing-canvas-area" ref={traceRef} className="mx-4 mt-4 rounded-[20px] bg-white border-[1.5px] border-[#E5E7EB] overflow-hidden">
            <TracingCanvas guide={guide} color={color} strokeWidth={tool.strokeWidth} erase={toolId === "gomme"} height={400} bg="#FFFFFF" />
          </div>
          <ExerciseToolbar toolId={toolId} onTool={setToolId} color={color} onColor={setColor} />
          <div className="mx-4 mt-4 flex gap-3">
            <button onClick={() => clearCanvas(traceRef.current)} className="flex-1 h-[52px] rounded-xl border-[1.5px] border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#6B7280] font-bold text-[15px] active:scale-95 spring">
              <RotateCcw size={18} /> Effacer
            </button>
            <button onClick={save} className="flex-1 h-[52px] rounded-xl bg-edu-primary text-white font-extrabold text-[15px] shadow-edu-btn flex items-center justify-center gap-2 active:scale-95 spring">
              <Save size={18} /> Sauvegarder
            </button>
          </div>
          <button
            id="pdf-btn"
            onClick={() => exportDrawingPDF(getChild().name)}
            className="mx-auto mt-3 flex items-center gap-1.5 text-[#9CA3AF] font-medium text-[13px] underline disabled:opacity-50"
          >
            <FileDown size={16} /> Exporter en PDF
          </button>
        </>
      )}
      <BottomNav />
    </div>
  );
}