import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Volume2, RotateCcw, Check, FileDown } from "lucide-react";
import { ANIMAL_OUTLINES } from "@/data/animals";
import { ExerciseToolbar } from "@/components/educ/ExerciseToolbar";
import { TOOLS } from "@/lib/eduData";
import { speak } from "@/lib/audio";
import { exportDrawingPDF } from "@/lib/pdfExport";
import { getChild } from "@/lib/storage";

export const Route = createFileRoute("/module/drawing/animal/$animalId")({
  component: AnimalTracingPage,
});

type Line = { points: number[]; color: string; width: number; erase?: boolean };

function AnimalTracingPage() {
  const nav = useNavigate();
  const { animalId } = Route.useParams();
  const animal = ANIMAL_OUTLINES[animalId];

  const [toolId, setToolId] = useState("crayon");
  const [color, setColor] = useState("#FF6B35");
  const tool = TOOLS.find((t) => t.id === toolId)!;
  const erase = toolId === "gomme";

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const drawingRef = useRef(false);
  const [size, setSize] = useState({ w: 320, h: 320 });

  useEffect(() => {
    if (!wrapRef.current) return;
    const w = wrapRef.current.clientWidth || 320;
    setSize({ w, h: w });
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size.w, size.h);
    lines.forEach((ln) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = ln.width;
      ctx.strokeStyle = ln.color;
      if (ln.erase) ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      for (let i = 0; i < ln.points.length; i += 2) {
        const x = ln.points[i],
          y = ln.points[i + 1];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [lines, size]);

  if (!animal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F0] gap-3 p-6">
        <p className="font-bold text-[#1A1A2E]">Animal introuvable</p>
        <button onClick={() => nav({ to: "/module/drawing" })} className="px-4 py-2 rounded-xl bg-edu-primary text-white font-bold">
          Retour
        </button>
      </div>
    );
  }

  function getPos(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * size.w,
      y: ((e.clientY - r.top) / r.height) * size.h,
    };
  }
  function down(e: React.PointerEvent) {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    const p = getPos(e);
    setLines((ls) => [...ls, { points: [p.x, p.y], color, width: tool.strokeWidth, erase }]);
  }
  function move(e: React.PointerEvent) {
    if (!drawingRef.current) return;
    const p = getPos(e);
    setLines((ls) => {
      const last = ls[ls.length - 1];
      if (!last) return ls;
      return [...ls.slice(0, -1), { ...last, points: [...last.points, p.x, p.y] }];
    });
  }
  function up() {
    drawingRef.current = false;
  }

  function handleValidate() {
    nav({
      to: "/victory",
      search: {
        moduleName: "Dessin",
        starsEarned: 12,
        achievementText: `Tu as dessiné ${animal.emoji} ${animal.name} !`,
        nextRoute: "/module/drawing",
      } as any,
    });
  }

  const scale = size.w / 200;

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-10">
      <header className="h-14 px-4 flex items-center justify-between bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/module/drawing" })} className="p-1">
          <ArrowLeft size={24} color="#FF6B35" />
        </button>
        <h1 className="font-bold text-[18px] text-[#1A1A2E]">
          {animal.emoji} {animal.name}
        </h1>
        <div className="flex items-center gap-1 bg-[#FFFBEB] rounded-full px-3 py-1.5">
          <span className="font-extrabold text-[13px]">+12 ⭐</span>
        </div>
      </header>

      <div className="mx-4 mt-4 p-4 bg-white rounded-2xl border border-[#F3F4F6] flex items-center gap-3">
        <div className="flex-1">
          <p className="font-bold text-[14px] text-[#1A1A2E]">
            Trace le {animal.name.toLowerCase()} en suivant les pointillés !
          </p>
        </div>
        <button
          onClick={() => speak(animal.name)}
          className="shrink-0 h-10 px-3 rounded-xl bg-[#FFF0E8] text-[#FF6B35] font-bold text-[13px] flex items-center gap-1.5"
        >
          <Volume2 size={16} /> Écouter
        </button>
      </div>

      <div id="drawing-canvas-area" className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2">
          <p className="text-center font-bold text-[12px] text-[#6B7280] mb-1">Modèle</p>
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", display: "block" }}>
            <path d={animal.path} fill={animal.color} stroke="#1A1A2E" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2">
          <p className="text-center font-bold text-[12px] text-[#6B7280] mb-1">À toi !</p>
          <div ref={wrapRef} className="relative" style={{ width: "100%", aspectRatio: "1 / 1", touchAction: "none" }}>
            <svg
              viewBox="0 0 200 200"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            >
              <path d={animal.path} fill="transparent" stroke="#D1D5DB" strokeWidth={3} strokeDasharray="6,6" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <canvas
              ref={canvasRef}
              width={size.w}
              height={size.h}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair" }}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerLeave={up}
            />
          </div>
        </div>
      </div>

      <ExerciseToolbar toolId={toolId} onTool={setToolId} color={color} onColor={setColor} />

      <div className="mx-4 mt-4 flex gap-3">
        <button
          onClick={() => setLines([])}
          className="flex-1 h-[52px] rounded-xl border-[1.5px] border-[#E5E7EB] bg-white flex items-center justify-center gap-2 text-[#6B7280] font-bold text-[15px] active:scale-95"
        >
          <RotateCcw size={18} /> Effacer
        </button>
        <button
          onClick={handleValidate}
          className="flex-1 h-[52px] rounded-xl bg-edu-primary text-white font-extrabold text-[15px] shadow-edu-btn flex items-center justify-center gap-2 active:scale-95"
        >
          <Check size={18} /> Valider
        </button>
      </div>
      <button
        id="pdf-btn"
        onClick={() => exportDrawingPDF(getChild().name)}
        className="mx-auto mt-3 flex items-center gap-1.5 text-[#9CA3AF] font-medium text-[13px] underline"
      >
        <FileDown size={16} /> Exporter en PDF
      </button>
    </div>
  );
}