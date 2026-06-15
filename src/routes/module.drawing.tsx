import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Star, RotateCcw, Save, FileDown } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { TracingCanvas, clearCanvas } from "@/components/educ/TracingCanvas";
import { ExerciseToolbar } from "@/components/educ/ExerciseToolbar";
import { TOOLS, STAMPS, BG_COLORS } from "@/lib/eduData";
import { exportDrawingPDF } from "@/lib/pdfExport";
import { getChild, addCreation } from "@/lib/storage";
import { ANIMAL_LIST } from "@/data/animals";

export const Route = createFileRoute("/module/drawing")({ component: DrawingCanvas });

const CATEGORIES = [
  { title: "Alphabet illustré", pill: "#FFB3BA", items: [
    { name: "A comme Arbre", emoji: "🌳" }, { name: "B comme Ballon", emoji: "🎈" },
    { name: "C comme Chat", emoji: "🐱" }, { name: "L comme Lion", emoji: "🦁" },
    { name: "S comme Soleil", emoji: "☀️" }, { name: "P comme Papillon", emoji: "🦋" }] },
  { title: "Fêtes & Saisons", pill: "#C7CEEA", items: [
    { name: "Noël", emoji: "🎄" }, { name: "Pâques", emoji: "🐣" },
    { name: "Anniversaire", emoji: "🎂" }, { name: "Été", emoji: "🌊" },
    { name: "Pluie", emoji: "🌧️" }, { name: "Arc-en-ciel", emoji: "🌈" }] },
];

function DrawingCanvas() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"galerie" | "libre">("galerie");
  const [toolId, setToolId] = useState("crayon");
  const [color, setColor] = useState("#FF6B35");
  const [guide, setGuide] = useState<string | undefined>(undefined);
  const [stamp, setStamp] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const tool = TOOLS.find((t) => t.id === toolId)!;
  const traceRef = useRef<HTMLDivElement | null>(null);

  function save() {
    try {
      const cv = traceRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
      const img = cv?.toDataURL("image/png");
      addCreation({ type: "drawing", label: guide ?? "Dessin libre", imageBase64: img, starsEarned: 5 });
      alert("Création sauvegardée ! ⭐");
    } catch { alert("Sauvegarde impossible."); }
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

      <div className="mx-4 mt-4 bg-[#F3F4F6] rounded-xl p-1 flex gap-1">
        <button onClick={() => setTab("galerie")} className={`flex-1 h-10 rounded-lg font-bold text-[13px] ${tab === "galerie" ? "bg-white shadow-edu-card text-[#1A1A2E]" : "text-[#9CA3AF]"}`}>Galerie</button>
        <button onClick={() => setTab("libre")} className={`flex-1 h-10 rounded-lg font-bold text-[13px] ${tab === "libre" ? "bg-white shadow-edu-card text-[#1A1A2E]" : "text-[#9CA3AF]"}`}>Dessin libre</button>
        <button onClick={() => nav({ to: "/my-creations" })} className="flex-1 h-10 rounded-lg font-bold text-[13px] text-[#9CA3AF]">Mes créations</button>
      </div>

      {tab === "galerie" ? (
        <div className="mt-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.title} className="mt-5">
              <div className="px-4 mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: cat.pill }} />
                  <span className="font-bold text-[14px] text-[#1A1A2E]">{cat.title}</span>
                </div>
                <span className="text-[12px] font-bold text-[#FF6B35]">Voir tout →</span>
              </div>
              <div className="pl-4 flex gap-2.5 overflow-x-auto pb-2 pr-4">
                {cat.items.map((it) => (
                  <button key={it.name} onClick={() => { setGuide(it.name); setTab("libre"); }}
                    className="shrink-0 w-[120px] h-[120px] rounded-[20px] flex flex-col items-center justify-center"
                    style={{ background: cat.pill }}>
                    <span style={{ fontSize: 64, lineHeight: 1 }}>{it.emoji}</span>
                    <span className="mt-1 font-bold text-[13px] text-[#1A1A2E]">{it.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div id="drawing-canvas-area" ref={traceRef} className="mx-4 mt-4 rounded-[20px] bg-white border-[1.5px] border-[#E5E7EB] overflow-hidden">
            <TracingCanvas guide={guide} color={stamp ?? color} strokeWidth={stamp ? 36 : tool.strokeWidth} erase={toolId === "gomme"} height={360} bg={bgColor} />
          </div>

          <div className="mx-4 mt-3">
            <p className="font-bold text-[13px] text-[#6B7280] mb-1.5">Tampons</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {STAMPS.map((s) => {
                const active = stamp === s;
                return (
                  <button key={s} onClick={() => setStamp(active ? null : s)}
                    className="shrink-0 w-10 h-10 rounded-full grid place-items-center text-[22px] transition-transform"
                    style={{ background: active ? "#FF6B35" : "#F3F4F6", transform: active ? "scale(1.15)" : "scale(1)" }}>{s}</button>
                );
              })}
            </div>
          </div>

          <div className="mx-4 mt-3">
            <p className="font-bold text-[13px] text-[#6B7280] mb-1.5">Fond</p>
            <div className="flex gap-2">
              {BG_COLORS.map((c) => (
                <button key={c} onClick={() => setBgColor(c)} className="w-7 h-7 rounded-full border-[1.5px]" style={{ background: c, borderColor: bgColor === c ? "#FF6B35" : "#E5E7EB", boxShadow: bgColor === c ? "0 0 0 2px #FF6B35" : "none" }} />
              ))}
            </div>
          </div>

          <ExerciseToolbar toolId={toolId} onTool={setToolId} color={color} onColor={setColor} />

          <div className="mx-4 mt-4 flex gap-3">
            <button onClick={() => clearCanvas(traceRef.current)} className="flex-1 h-[52px] rounded-xl border-[1.5px] border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#6B7280] font-bold text-[15px] active:scale-95">
              <RotateCcw size={18} /> Effacer
            </button>
            <button onClick={save} className="flex-1 h-[52px] rounded-xl bg-edu-primary text-white font-extrabold text-[15px] shadow-edu-btn flex items-center justify-center gap-2 active:scale-95">
              <Save size={18} /> Sauvegarder
            </button>
          </div>
          <button id="pdf-btn" onClick={() => exportDrawingPDF(getChild().name)} className="mx-auto mt-3 flex items-center gap-1.5 text-[#9CA3AF] font-medium text-[13px] underline disabled:opacity-50">
            <FileDown size={16} /> Exporter en PDF
          </button>
        </>
      )}
      <BottomNav />
    </div>
  );
}
