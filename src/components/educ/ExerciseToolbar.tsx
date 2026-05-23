import { Pencil, Pen, Brush, Eraser } from "lucide-react";
import { TOOLS, PALETTE_COLORS } from "@/lib/eduData";

const ICONS: Record<string, any> = { crayon: Pencil, stylo: Pen, pinceau: Brush, gomme: Eraser };

export function ExerciseToolbar({
  toolId, onTool, color, onColor,
}: { toolId: string; onTool: (id: string) => void; color: string; onColor: (c: string) => void }) {
  return (
    <>
      <div className="mx-4 mt-3 flex gap-2">
        {TOOLS.map((t) => {
          const Icon = ICONS[t.id];
          const active = t.id === toolId;
          return (
            <button
              key={t.id}
              onClick={() => onTool(t.id)}
              className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center gap-1 spring active:scale-95 ${active ? "bg-edu-primary text-white" : "bg-white border-[1.5px] border-[#E5E7EB] text-[#6B7280]"}`}
            >
              <Icon size={20} />
              <span className="font-bold text-[11px]">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mx-4 mt-2 flex gap-2 overflow-x-auto pb-1">
        {PALETTE_COLORS.map((c) => {
          const sel = c === color;
          return (
            <button
              key={c}
              onClick={() => onColor(c)}
              aria-label={c}
              className="rounded-full shrink-0 spring"
              style={{
                width: 32, height: 32, background: c,
                transform: sel ? "scale(1.2)" : "scale(1)",
                boxShadow: sel ? "0 0 0 2px #fff, 0 0 0 4px " + c : "none",
              }}
            />
          );
        })}
      </div>
    </>
  );
}
