import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Bell, Hash, Palette, Calculator, BookOpen, Zap, Check, Gift, Apple, Type } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";
import { getChild, setChild, averageProgress, type ChildState } from "@/lib/storage";
import { computeLevel, levelProgressPct, ALL_BADGES } from "@/lib/levels";
import { updateStreak, setPendingBadge } from "@/lib/streak";
import { initNotifications, unreadCount } from "@/lib/notifications";
import { trackSessionStart, trackSessionEnd } from "@/lib/screenTime";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const nav = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  useEffect(() => {
    updateStreak();
    const c = getChild();
    // Check unlocks
    for (const b of ALL_BADGES) {
      if (b.check(c) && !c.badges.includes(b.id)) {
        c.badges = [...c.badges, b.id];
        setChild({ badges: c.badges });
        setPendingBadge({ id: b.id, name: b.name, desc: b.desc, color: b.color, icon: b.icon });
        break;
      }
    }
    setC(getChild());
    initNotifications(c.name, c.streak || 0);
    trackSessionStart();
    const onVis = () => { if (document.hidden) trackSessionEnd(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); trackSessionEnd(); };
  }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  const avg = averageProgress(child);
  const unread = unreadCount();
  const lvl = computeLevel(child.stars);
  const lvlPct = levelProgressPct(child.stars);
  const today = new Date();
  const isSunday = today.getDay() === 0;
  const todayStr = today.toDateString();
  const chestAvailable = isSunday && child.lastChestOpened !== todayStr;
  const daysUntilSunday = (7 - today.getDay()) % 7 || 7;

  const c = child;
  function openChest() {
    const rewards = [
      { type: "stars", amount: 50, msg: "Tu gagnes 50 étoiles bonus !" },
      { type: "stars", amount: 30, msg: "Tu gagnes 30 étoiles bonus !" },
      { type: "badge", id: "early_bird", msg: "Badge Lève-tôt débloqué !" },
    ] as const;
    const r = rewards[Math.floor(Math.random() * rewards.length)];
    if (r.type === "stars") {
      setChild({ stars: c.stars + r.amount, lastChestOpened: todayStr });
    } else {
      const badges = c.badges.includes(r.id) ? c.badges : [...c.badges, r.id];
      setChild({ badges, lastChestOpened: todayStr });
    }
    nav({ to: "/victory", search: { moduleName: "Coffre", starsEarned: r.type === "stars" ? r.amount : 0, achievementText: r.msg } });
  }

  const moduleDots = [
    { color: "#FFB3BA", v: child.progress.alphabet, label: "A" },
    { color: "#B5EAD7", v: child.progress.numbers, label: "1" },
    { color: "#C7CEEA", v: child.progress.drawing, label: "✎" },
    { color: "#FFDAC1", v: child.progress.maths, label: "+" },
    { color: "#D4EDDA", v: child.progress.stories, label: "📖" },
    { color: "#FFEAA7", v: child.progress.fruits || 0, label: "🍎" },
    { color: "#E8CCFF", v: child.progress.syllables || 0, label: "💬" },
  ];

  return (
    <div className="min-h-screen bg-edu-bg pb-28">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 h-14 bg-white border-b border-[#F3F4F6] z-40 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-edu-primary grid place-items-center text-white font-black text-sm">E</div>
          <span className="text-edu-primary font-extrabold text-base">EducEnfant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FFFBEB] rounded-full px-3 py-1.5">
            <Star size={16} fill="#FFE14D" color="#FFE14D" />
            <span className="text-edu-dark font-extrabold text-sm">{child.stars}</span>
          </div>
          <Link to="/notifications" className="relative">
            <Bell size={22} className="text-edu-muted" />
            {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-edu-primary text-white text-[10px] font-extrabold grid place-items-center">{unread}</span>}
          </Link>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero */}
        <section className="px-4 pt-4">
          <div className="bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-edu-muted font-bold text-[20px] leading-tight">Bonjour,</p>
                <p className="text-edu-dark font-black text-[28px] leading-tight">{child.name} ! 👋</p>
              </div>
              <Leo size={90} float />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-edu-dark font-bold text-sm">Ta progression</span>
              <span className="text-edu-primary font-extrabold text-sm">{avg}%</span>
            </div>
            <div className="mt-2 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-edu-primary rounded-full"
              />
            </div>
            <div className="mt-3 flex gap-2">
              {moduleDots.map((d, i) => (
                <div key={i} className="w-8 h-8 rounded-full grid place-items-center text-edu-dark font-black text-xs" style={{ background: d.color }}>
                  {d.v > 50 ? <Check size={14} color="white" strokeWidth={3} /> : d.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Level / XP card */}
        <section className="px-4 mt-3">
          <div className="bg-white rounded-[20px] shadow-edu-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full grid place-items-center shadow-edu-btn" style={{ background: "linear-gradient(135deg,#FF6B35,#FFB347)" }}>
              <span className="text-white font-black text-[14px]">N.{lvl.current}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[14px] text-edu-dark">{lvl.name}</p>
              <div className="mt-1 h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${lvlPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full rounded-full bg-edu-primary" />
              </div>
              <p className="mt-1 font-medium text-[11px] text-edu-muted">{lvl.xp} / {lvl.nextLevelXp} XP</p>
            </div>
            <Link to="/badges" className="font-bold text-[11px] text-edu-primary shrink-0">Prochain niveau →</Link>
          </div>
        </section>

        {/* Section header */}
        <div className="px-5 mt-6 flex items-center justify-between">
          <h2 className="text-edu-dark font-extrabold text-[22px]">Mes activités</h2>
          <button className="text-edu-primary font-bold text-[13px]">Tous les modules →</button>
        </div>

        {/* Modules */}
        <div className="px-4 mt-4 space-y-3.5">
          {/* Alphabet full width */}
          <ModuleCard
            to="/module/$id" params={{ id: "alphabet" }} delay={0}
            bg="#FFB3BA" className="h-[140px]"
          >
            <div className="flex h-full">
              <div className="flex-1 p-5 flex flex-col justify-center">
                <h3 className="text-edu-dark font-extrabold text-xl">L'Alphabet</h3>
                <p className="text-edu-muted font-semibold text-[13px] mt-0.5">26 lettres à explorer</p>
                <p className="text-edu-muted font-bold text-xs mt-2">⭐ {child.completedLetters.length}/78</p>
              </div>
              <div className="w-[110px] mr-4 my-4 rounded-xl grid place-items-center" style={{ background: "#FF8FA3" }}>
                <span className="font-black text-white text-[64px] leading-none opacity-30">A</span>
              </div>
            </div>
          </ModuleCard>

          {/* 2x2 grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <HalfCard delay={1} bg="#B5EAD7" icon={Hash} title="Les Chiffres" sub="0 → 20" stars={`${child.progress.numbers}%`} to="/module/$id" params={{ id: "numbers" }} />
            <HalfCard delay={2} bg="#C7CEEA" icon={Palette} title="Dessin" sub="Colorie !" stars={`${child.progress.drawing}%`} to="/module/$id" params={{ id: "drawing" }} />
            <HalfCard delay={3} bg="#FFDAC1" icon={Calculator} title="Maths" sub="Calcule !" stars={`${child.progress.maths}%`} to="/module/$id" params={{ id: "maths" }} />
            <HalfCard delay={4} bg="#D4EDDA" icon={BookOpen} title="Histoires" sub="Lis et écoute" stars={`${child.progress.stories}%`} to="/module/$id" params={{ id: "stories" }} />
            <HalfCard delay={5} bg="#FFEAA7" icon={Apple} title="Les Fruits" sub="Découvre !" stars={`${child.progress.fruits || 0}%`} to="/module/$id" params={{ id: "fruits" }} />
            <HalfCard delay={6} bg="#E8CCFF" icon={Type} title="Syllabes" sub="PA-PA-PA !" stars={`${child.progress.syllables || 0}%`} to="/module/$id" params={{ id: "syllables" }} />
          </div>
        </div>

        {/* Daily challenge */}
        <div className="px-4 mt-5">
          <div className="relative rounded-[24px] p-5 overflow-hidden" style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#2D3748 100%)" }}>
            <div className="relative z-10 max-w-[68%]">
              <span className="inline-flex items-center gap-1 bg-edu-primary text-white text-[11px] font-extrabold rounded-full px-2.5 py-1 uppercase tracking-wider">
                <Zap size={12} fill="white" /> Défi du jour
              </span>
              <h3 className="mt-2.5 text-white font-black text-xl">Trace la lettre M</h3>
              <p className="text-edu-accent font-bold text-[13px]">Gagne +20 étoiles !</p>
              <Link to="/module/$id" params={{ id: "alphabet" }} className="inline-block mt-3.5 bg-edu-primary text-white font-bold text-[13px] rounded-[10px] px-4 py-2.5">
                Relever le défi →
              </Link>
            </div>
            <motion.div
              animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 bottom-0"
            >
              <Leo size={110} />
            </motion.div>
          </div>
        </div>

        {/* Weekly chest */}
        <div className="px-4 mt-4">
          <div className="rounded-[24px] bg-white shadow-edu-card p-5 border-2 border-dashed" style={{ borderColor: "#FFE14D" }}>
            {chestAvailable ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="inline-block bg-[#FFE14D] text-[#1A1A2E] font-extrabold text-[10px] rounded-full px-2 py-1 uppercase tracking-wider">🎁 Récompense</span>
                    <h3 className="mt-2 font-extrabold text-[16px] text-edu-dark">Coffre de la semaine !</h3>
                    <p className="font-medium text-[13px] text-[#6B7280]">Ouvre ton cadeau du dimanche</p>
                  </div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                    <Gift size={52} color="#FF6B35" />
                  </motion.div>
                </div>
                <button onClick={openChest} className="mt-3 rounded-[12px] px-5 py-2.5 font-extrabold text-[14px]" style={{ background: "#FFE14D", color: "#1A1A2E" }}>
                  Ouvrir le coffre →
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 justify-center text-center">
                <Gift size={28} color="#D1D5DB" />
                <p className="font-semibold text-[13px] text-edu-muted">Prochain coffre dans {daysUntilSunday} {daysUntilSunday > 1 ? "jours" : "jour"}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

type ModuleCardProps = {
  to: "/module/$id";
  params: { id: string };
  bg: string;
  delay: number;
  className?: string;
  children: React.ReactNode;
};
function ModuleCard({ to, params, bg, delay, className = "", children }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
    >
      <Link to={to} params={params} className={`block rounded-[24px] overflow-hidden ${className}`} style={{ background: bg }}>
        {children}
      </Link>
    </motion.div>
  );
}

function HalfCard({ delay, bg, icon: Icon, title, sub, stars, to, params }: { delay: number; bg: string; icon: any; title: string; sub: string; stars: string; to: "/module/$id"; params: { id: string } }) {
  return (
    <ModuleCard to={to} params={params} bg={bg} delay={delay} className="h-[140px]">
      <div className="h-full p-4 flex flex-col">
        <Icon size={28} className="text-edu-dark" strokeWidth={2.5} />
        <h3 className="mt-2 text-edu-dark font-extrabold text-[15px]">{title}</h3>
        <p className="text-edu-muted font-semibold text-xs">{sub}</p>
        <p className="mt-auto text-edu-muted font-bold text-xs">⭐ {stars}</p>
      </div>
    </ModuleCard>
  );
}