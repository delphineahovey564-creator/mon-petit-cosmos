import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Target, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, Legend, Area, AreaChart } from "recharts";
import { BottomNav } from "@/components/educ/BottomNav";
import { getChild, averageProgress, type ChildState } from "@/lib/storage";

export const Route = createFileRoute("/parent/progression")({ component: ParentProgression });

function ParentProgression() {
  const nav = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  const [period, setPeriod] = useState<"semaine" | "mois" | "total">("semaine");
  const [count, setCount] = useState(0);
  useEffect(() => { setC(getChild()); }, []);
  useEffect(() => {
    if (!child) return;
    const target = averageProgress(child);
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      if (i >= target) { setCount(target); clearInterval(id); } else setCount(i);
    }, 30);
    return () => clearInterval(id);
  }, [child]);

  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  const moduleData = [
    { name: "Alpha", value: child.progress.alphabet, fill: "#FFB3BA" },
    { name: "Chiffres", value: child.progress.numbers, fill: "#B5EAD7" },
    { name: "Dessin", value: child.progress.drawing, fill: "#C7CEEA" },
    { name: "Maths", value: child.progress.maths, fill: "#FFDAC1" },
    { name: "Histoires", value: child.progress.stories, fill: "#D4EDDA" },
    { name: "Fruits", value: child.progress.fruits || 0, fill: "#FFEAA7" },
    { name: "Syllabes", value: child.progress.syllables || 0, fill: "#E8CCFF" },
  ];
  const weekData = [
    { day: "Lun", stars: 12 },{ day: "Mar", stars: 28 },{ day: "Mer", stars: 8 },
    { day: "Jeu", stars: 45 },{ day: "Ven", stars: 33 },{ day: "Sam", stars: 52 },{ day: "Dim", stars: 70 },
  ];

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/parent" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Progression de {child.name}</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 bg-[#F3F4F6] rounded-xl p-1 flex">
        {(["semaine", "mois", "total"] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={`flex-1 h-10 rounded-lg font-bold text-[13px] ${period === p ? "bg-white shadow-edu-card text-[#1A1A2E]" : "text-[#9CA3AF]"}`}>
            {p === "semaine" ? "Cette semaine" : p === "mois" ? "Ce mois" : "Total"}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-4 rounded-[24px] p-6 text-white text-center" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
        <p className="font-semibold text-[13px] opacity-85">Score global</p>
        <p className="font-black text-[52px] leading-none my-1">{count}%</p>
        <p className="font-medium text-[13px] opacity-75">sur les 5 modules</p>
        <div className="mt-4 grid grid-cols-3 gap-2 bg-white/15 rounded-[14px] p-3">
          <div className="font-bold text-[13px]">⭐ {child.stars}</div>
          <div className="font-bold text-[13px]">🔥 {child.streak} j</div>
          <div className="font-bold text-[13px]">🏆 {child.badges.length}</div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-extrabold text-[18px] text-edu-dark mb-2">Par module</h2>
        <div className="bg-white rounded-[20px] p-3 shadow-edu-card" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip formatter={(v: any) => [`${v}% complété`, ""]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-extrabold text-[18px] text-edu-dark mb-2">Étoiles cette semaine</h2>
        <div className="bg-white rounded-[20px] p-3 shadow-edu-card" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Area type="monotone" dataKey="stars" stroke="#FF6B35" strokeWidth={3} fill="url(#orangeGrad)" />
              <Line type="monotone" dataKey="stars" stroke="#FF6B35" strokeWidth={3} dot={{ fill: "#FF6B35", r: 5 }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-extrabold text-[18px] text-edu-dark mb-2">Vue d'ensemble</h2>
        <div className="bg-white rounded-[20px] p-3 shadow-edu-card" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart data={moduleData} innerRadius={20} outerRadius={80} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#F3F4F6" }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, fontWeight: 500 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-3">
        <Insight icon={<TrendingUp size={20} color="#4CAF50" />} title="Module le plus fort" text="Dessin & Coloriage — 90%" border="#4CAF50" />
        <Insight icon={<Target size={20} color="#FF6B35" />} title="À améliorer" text="Mathématiques — 26%" border="#FF6B35" />
        <Insight icon={<Clock size={20} color="#2EC4B6" />} title="Temps moyen par session" text="14 minutes" border="#2EC4B6" />
      </div>

      <BottomNav context="parent" />
    </div>
  );
}

function Insight({ icon, title, text, border }: { icon: React.ReactNode; title: string; text: string; border: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-edu-card flex gap-3" style={{ borderLeft: `4px solid ${border}` }}>
      <div>{icon}</div>
      <div>
        <p className="font-bold text-[14px] text-edu-dark">{title}</p>
        <p className="font-semibold text-[13px] text-[#6B7280]">{text}</p>
      </div>
    </div>
  );
}