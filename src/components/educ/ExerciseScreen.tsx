import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, X, Volume2, RotateCcw, Check, FileDown, Loader2 } from "lucide-react";
import { TracingCanvas, clearCanvas } from "./TracingCanvas";
import { ExerciseToolbar } from "./ExerciseToolbar";
import { TOOLS, speak } from "@/lib/eduData";
import { exportElementAsPdf } from "@/lib/pdfExport";
import { Leo } from "./Leo";

type Props = {
  title: string;
  guide: string;
  speakText: string;
  instruction: string;
  backTo: string;
  closeTo: string;
  onValidate: () => void;
  extra?: React.ReactNode;
  pdfTitle: string;
  pdfFile: string;
};

export function ExerciseScreen(p: Props) {
  const nav = useNavigate();
  const [toolId, setToolId] = useState("crayon");
  const [color, setColor] = useState("#FF6B35");
  const [speaking, setSpeaking] = useState(false);
  const tool = TOOLS.find((t) => t.id === toolId)!;
  const erase = toolId === "gomme";
  const traceRef = useRef<HTMLDivElement | null>(null);

  const handleSpeak = () => {
    setSpeaking(true);
    speak(p.speakText);
    setTimeout(() => setSpeaking(false), 2200);
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      <header className="h-14 bg-white border-b border-[#F3F4F6] px-4 flex items-center justify-between">
        <button onClick={() => nav({ to: p.backTo as any })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">{p.title}</h1>
        <button onClick={() => nav({ to: p.closeTo as any })}><X size={22} color="#9CA3AF" /></button>
      </header>
      <div className="h-1 bg-[#F3F4F6]"><div className="h-full bg-edu-primary" style={{ width: "60%" }} /></div>

      <div className="mx-4 mt-4 rounded-[20px] p-4 bg-[#FFF0E8] flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-[#FFB3BA] grid place-items-center text-xl shrink-0">🦁</div>
        <div className="flex-1">
          <p className="font-bold text-[14px] text-[#1A1A2E]">{p.instruction}</p>
          <button
            onClick={handleSpeak}
            className="mt-2 inline-flex items-center gap-1.5 bg-white border-[1.5px] border-edu-primary text-edu-primary rounded-full px-3.5 py-1.5"
          >
            {speaking ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
            <span className="font-bold text-[13px]">{speaking ? "En cours..." : "Écouter"}</span>
          </button>
        </div>
      </div>

      <div ref={traceRef} className="mx-4 mt-4 rounded-[24px] bg-white border-[1.5px] border-[#F3F4F6] shadow-edu-card overflow-hidden">
        <div className="grid grid-cols-2" style={{ height: 260 }}>
          <div className="p-2 flex flex-col">
            <p className="text-center font-medium text-[12px] text-[#9CA3AF] mb-1">Modèle</p>
            <div className="flex-1 bg-[#F9FAFB] rounded-[16px] grid place-items-center">
              <span className="font-black text-edu-primary" style={{ fontSize: 140, lineHeight: 1 }}>{p.guide}</span>
            </div>
          </div>
          <div className="p-2 flex flex-col border-l border-[#F3F4F6]">
            <p className="text-center font-bold text-[12px] text-edu-primary mb-1">À toi !</p>
            <div className="flex-1">
              <TracingCanvas guide={p.guide} color={color} strokeWidth={tool.strokeWidth} erase={erase} height={210} />
            </div>
          </div>
        </div>
      </div>

      <ExerciseToolbar toolId={toolId} onTool={setToolId} color={color} onColor={setColor} />

      {p.extra}

      <div className="mx-4 mt-4 flex gap-3">
        <button
          onClick={() => clearCanvas(traceRef.current)}
          className="flex-1 h-[52px] rounded-xl border-[1.5px] border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#6B7280] font-bold text-[15px] active:scale-95 spring"
        >
          <RotateCcw size={18} /> Effacer
        </button>
        <button
          onClick={p.onValidate}
          className="flex-1 h-[52px] rounded-xl bg-edu-primary text-white font-extrabold text-[15px] shadow-edu-btn flex items-center justify-center gap-2 active:scale-95 spring"
        >
          <Check size={18} /> Valider
        </button>
      </div>

      <button
        onClick={() => traceRef.current && exportElementAsPdf(traceRef.current, { title: p.pdfTitle, subtitle: new Date().toLocaleDateString("fr-FR"), filename: p.pdfFile })}
        className="mx-auto mt-3 flex items-center gap-1.5 text-[#9CA3AF] font-medium text-[13px] underline"
      >
        <FileDown size={16} /> Exporter en PDF
      </button>

      <div className="hidden"><Leo size={1} /></div>
    </div>
  );
}
