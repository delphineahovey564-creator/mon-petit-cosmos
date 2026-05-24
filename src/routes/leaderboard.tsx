import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Crown } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";
import { getChild, type ChildState } from "@/lib/storage";

export const Route = createFileRoute("/leaderboard")({ component: LeaderboardPage });

function LeaderboardPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"famille" | "global">("famille");
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => { setC(getChild()); }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  const globalLeaders = [
    { rank: 1, name: "Petit Lion", stars: 1240, avatar: "🦁", isCurrentUser: false },
    { rank: 2, name: "Super Étoile", stars: 1180, avatar: "⭐", isCurrentUser: false },
    { rank: 3, name: "Petit Génie", stars: 1050, avatar: "🦊", isCurrentUser: false },
    { rank: 4, name: "Mini Champion", stars: 890, avatar: "🐼", isCurrentUser: false },
    { rank: 5, name: child.name, stars: child.stars, avatar: "🦁", isCurrentUser: true },
    { rank: 6, name: "Étoile Filante", stars: 220, avatar: "🐯", isCurrentUser: false },
    { rank: 7, name: "Petite Souris", stars: 180, avatar: "🐭", isCurrentUser: false },
    { rank: 8, name: "Mini Hibou", stars: 145, avatar: "🦉", isCurrentUser: false },
    { rank: 9, name: "Petit Ours", stars: 120, avatar: "🐻", isCurrentUser: false },
    { rank: 10, name: "Mini Lapin", stars: 95, avatar: "🐰", isCurrentUser: false },
  ];

  return (
    <div className="min-h-screen bg-edu-bg pb-28">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/home" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Classement</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 bg-[#F3F4F6] rounded-xl p-1 flex">
        {(["famille", "global"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 h-10 rounded-lg font-bold text-[14px] ${tab === t ? "bg-white shadow-edu-card text-[#1A1A2E]" : "text-[#9CA3AF]"}`}>
            {t === "famille" ? "Ma famille" : "Global (anonyme)"}
          </button>
        ))}
      </div>

      {tab === "famille" ? (
        <>
          <div className="mx-4 mt-4 rounded-[24px] p-6 text-center" style={{ background: "#FFF0E8" }}>
            <div className="flex justify-center"><Leo size={80} /></div>
            <h2 className="mt-2 font-extrabold text-[18px] text-edu-dark">Joue en famille !</h2>
            <p className="mt-1 font-medium text-[14px] text-[#6B7280]">Ajoute un profil pour un frère ou une sœur et compare vos progrès !</p>
            <button onClick={() => nav({ to: "/create-profile" })} className="mt-4 h-[52px] px-6 rounded-2xl bg-edu-primary text-white font-extrabold text-[15px]">
              Ajouter un profil
            </button>
          </div>
          <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-5 flex items-center gap-4">
            <span className="font-black text-[28px] text-edu-primary">#1</span>
            <div className="text-3xl">🦁</div>
            <div className="flex-1">
              <p className="font-bold text-edu-dark">{child.name}</p>
              <p className="font-bold text-[14px] text-edu-dark">{child.stars} ⭐</p>
              <p className="font-semibold text-[13px] text-[#4CAF50] mt-0.5">Tu es en tête ! Continue comme ça 🎉</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mx-4 mt-6 flex items-end justify-center gap-3">
            <Podium {...globalLeaders[1]} h={100} bg="#E5E7EB" avatarSize={56} />
            <Podium {...globalLeaders[0]} h={130} bg="#FFE14D" avatarSize={72} crown />
            <Podium {...globalLeaders[2]} h={80} bg="#FFDAC1" avatarSize={48} />
          </div>
          <div className="mx-4 mt-6 space-y-2">
            {globalLeaders.slice(3).map((l) => (
              <div key={l.rank} className="flex items-center gap-3 rounded-[14px] px-4 py-3 shadow-edu-card" style={{ background: l.isCurrentUser ? "#FFF0E8" : "#fff" }}>
                <span className="font-extrabold text-[16px] text-edu-muted w-6">{l.rank}.</span>
                <div className="w-8 h-8 rounded-full bg-[#F3F4F6] grid place-items-center text-lg">{l.avatar}</div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-bold text-[14px] text-edu-dark">{l.name}</span>
                  {l.isCurrentUser && <span className="font-medium text-[12px] text-edu-primary">(Toi)</span>}
                </div>
                <span className="font-extrabold text-[14px] text-edu-dark">{l.stars} ⭐</span>
              </div>
            ))}
          </div>
          <p className="text-center font-medium text-[11px] text-edu-muted mx-4 mt-4">
            Les pseudos sont anonymisés et aucune donnée personnelle n'est partagée.
          </p>
        </>
      )}

      <BottomNav context="child" />
    </div>
  );
}

function Podium({ rank, name, stars, avatar, h, bg, avatarSize, crown }: { rank: number; name: string; stars: number; avatar: string; h: number; bg: string; avatarSize: number; crown?: boolean }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 90 }}>
      {crown && <Crown size={24} color="#FFE14D" fill="#FFE14D" />}
      <div className="rounded-full grid place-items-center" style={{ width: avatarSize, height: avatarSize, background: "#F3F4F6", fontSize: avatarSize * 0.55 }}>{avatar}</div>
      <p className="font-bold text-[11px] mt-1 text-edu-dark text-center">{name}</p>
      <p className="font-extrabold text-[12px] text-edu-dark">{stars} ⭐</p>
      <div className="w-full mt-2 grid place-items-center text-[#1A1A2E] font-black text-[24px]" style={{ height: h, background: bg, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        {rank === 1 ? <Trophy size={26} /> : rank}
      </div>
    </div>
  );
}