import { useEffect, useRef, useState } from "react";

type Line = { points: number[]; color: string; width: number; erase?: boolean };

type Props = {
  guide?: string; // letter or number to show as faded background
  color: string;
  strokeWidth: number;
  erase?: boolean;
  width?: number;
  height?: number;
  bg?: string;
};

export type TracingCanvasHandle = {
  clear: () => void;
  el: HTMLDivElement | null;
};

export function TracingCanvas({ guide, color, strokeWidth, erase, width = 240, height = 240, bg = "#FAFAFA" }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ width: "100%", height, borderRadius: 16, background: bg }} />;
  }
  return <ClientCanvas guide={guide} color={color} strokeWidth={strokeWidth} erase={erase} width={width} height={height} bg={bg} />;
}

function ClientCanvas({ guide, color, strokeWidth, erase, width, height, bg }: Required<Omit<Props, "guide" | "erase">> & { guide?: string; erase?: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const drawingRef = useRef(false);
  const [size, setSize] = useState({ w: width, h: height });

  useEffect(() => {
    if (!wrapRef.current) return;
    const w = wrapRef.current.clientWidth || width;
    setSize({ w, h: height });
  }, [width, height]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size.w, size.h);
    // background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size.w, size.h);
    // guide letter/number
    if (guide) {
      ctx.save();
      ctx.font = `900 ${Math.floor(size.h * 0.7)}px Nunito, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.strokeText(guide, size.w / 2, size.h / 2);
      ctx.restore();
    }
    // strokes
    lines.forEach((ln) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = ln.width;
      ctx.strokeStyle = ln.color;
      if (ln.erase) ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      for (let i = 0; i < ln.points.length; i += 2) {
        const x = ln.points[i], y = ln.points[i + 1];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [lines, guide, size, bg]);

  function getPos(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * size.w, y: ((e.clientY - r.top) / r.height) * size.h };
  }

  function down(e: React.PointerEvent) {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawingRef.current = true;
    const p = getPos(e);
    setLines((ls) => [...ls, { points: [p.x, p.y], color, width: strokeWidth, erase }]);
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
  function up() { drawingRef.current = false; }

  // expose clear via window event
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = () => setLines([]);
    el.addEventListener("trace:clear", handler);
    return () => el.removeEventListener("trace:clear", handler);
  }, []);

  return (
    <div ref={wrapRef} className="trace-wrap" style={{ width: "100%", height, borderRadius: 16, overflow: "hidden", touchAction: "none" }}>
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        style={{ width: "100%", height: "100%", display: "block", background: bg, borderRadius: 16, cursor: "crosshair" }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      />
    </div>
  );
}

export function clearCanvas(container: HTMLElement | null) {
  const el = container?.querySelector(".trace-wrap");
  el?.dispatchEvent(new Event("trace:clear"));
}
