import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Moon, Volume2, Bell, User, Lock, Download, LogOut, Trash2, Info, Shield, FileText, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/educ/BottomNav";
import { Leo } from "@/components/educ/Leo";
import { getChild, type ChildState, MODULE_META, setParent } from "@/lib/storage";
import { exportParentReportPDF } from "@/lib/pdfExport";
import { applyTheme, isDarkMode } from "@/lib/darkMode";

export const Route = createFileRoute("/parent/reglages")({ component: ParentReglages });

function ParentReglages() {
  const nav = useNavigate();
  const [child, setC] = useState<ChildState | null>(null);
  const [screenTime, setScreenTime] = useState("1h");
  const [darkMode, setDark] = useState(false);
  const [sound, setSound] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState("17:00");
  const [modules, setModules] = useState<Record<string, boolean>>({ alphabet: true, numbers: true, drawing: true, maths: true, stories: true, fruits: true, syllables: true });

  useEffect(() => { setC(getChild()); setDark(isDarkMode()); }, []);
  if (!child) return <div className="min-h-screen bg-edu-bg" />;

  function logout() {
    setParent({ isLoggedIn: false });
    nav({ to: "/login" });
  }
  function deleteAccount() {
    if (!confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.")) return;
    localStorage.clear();
    nav({ to: "/onboarding" });
  }

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <header className="h-14 px-4 flex items-center bg-white border-b border-[#F3F4F6]">
        <button onClick={() => nav({ to: "/parent" })}><ArrowLeft size={24} color="#FF6B35" /></button>
        <h1 className="flex-1 text-center font-bold text-[18px] text-[#1A1A2E]">Réglages</h1>
        <div className="w-6" />
      </header>

      <div className="mx-4 mt-4 bg-white rounded-[20px] shadow-edu-card p-5">
        <p className="font-bold text-[16px] text-edu-dark mb-4">Profil enfant</p>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full grid place-items-center" style={{ background: "#FFB3BA" }}><Leo size={48} /></div>
          <div className="flex-1">
            <p className="font-bold text-[16px] text-edu-dark">{child.name}</p>
            <p className="font-medium text-[13px] text-[#6B7280]">{child.age} ans</p>
          </div>
          <button onClick={() => nav({ to: "/create-profile" })} className="rounded-full border border-edu-primary text-edu-primary font-bold text-[13px] px-4 py-1.5">Modifier</button>
        </div>
      </div>

      <Section title="Apprentissage">
        <Row icon={<Clock size={20} color="#6B7280" />} label="Temps d'écran quotidien">
          <select value={screenTime} onChange={(e) => setScreenTime(e.target.value)} className="bg-[#F3F4F6] rounded-lg px-3 py-1.5 font-bold text-[13px]">
            {["30 min", "1h", "1h30", "2h", "Illimité"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Row>
        <Row icon={<Moon size={20} color="#6B7280" />} label="Mode nuit"><Toggle on={darkMode} onChange={(v) => { setDark(v); applyTheme(v); }} /></Row>
        <Row icon={<Volume2 size={20} color="#6B7280" />} label="Sons & Audio"><Toggle on={sound} onChange={setSound} /></Row>
        <Row icon={<Bell size={20} color="#6B7280" />} label="Rappels quotidiens"><Toggle on={reminders} onChange={setReminders} /></Row>
        {reminders && (
          <Row icon={<span className="w-5" />} label="Heure du rappel">
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="bg-[#F3F4F6] rounded-lg px-3 py-1.5 font-bold text-[14px]" />
          </Row>
        )}
      </Section>

      <Section title="Modules actifs" subtitle="Désactivez les modules non souhaités">
        {(Object.keys(MODULE_META) as Array<keyof typeof MODULE_META>).map((k) => (
          <Row key={k} icon={<div className="w-8 h-8 rounded-full" style={{ background: MODULE_META[k].color }} />} label={MODULE_META[k].name}>
            <Toggle on={modules[k]} onChange={(v) => setModules({ ...modules, [k]: v })} />
          </Row>
        ))}
      </Section>

      <Section title="Compte parent">
        <Row icon={<User size={20} color="#6B7280" />} label="Modifier mon profil"><ChevronRight size={20} color="#D1D5DB" /></Row>
        <Row icon={<Lock size={20} color="#6B7280" />} label="Changer le mot de passe"><ChevronRight size={20} color="#D1D5DB" /></Row>
        <Row icon={<Download size={20} color="#6B7280" />} label="Exporter les données" onClick={() => exportParentReportPDF(child.name)}>
          <ChevronRight size={20} color="#D1D5DB" />
        </Row>
        <Row icon={<LogOut size={20} color="#FF5252" />} label="Se déconnecter" labelColor="#FF5252" onClick={logout}><ChevronRight size={20} color="#D1D5DB" /></Row>
        <Row icon={<Trash2 size={20} color="#FF5252" />} label="Supprimer le compte" labelColor="#FF5252" onClick={deleteAccount}><ChevronRight size={20} color="#D1D5DB" /></Row>
      </Section>

      <Section title="À propos">
        <Row icon={<Info size={20} color="#6B7280" />} label="Version de l'app"><span className="text-edu-muted font-medium text-[13px]">1.0.0</span></Row>
        <Row icon={<Shield size={20} color="#6B7280" />} label="Confidentialité"><ChevronRight size={20} color="#D1D5DB" /></Row>
        <Row icon={<FileText size={20} color="#6B7280" />} label="Conditions d'utilisation"><ChevronRight size={20} color="#D1D5DB" /></Row>
      </Section>

      <BottomNav context="parent" />
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mx-4 mt-3 bg-white rounded-[20px] shadow-edu-card overflow-hidden">
      <p className="px-5 pt-4 pb-2 font-bold text-[13px] text-edu-muted uppercase tracking-[1px]">{title}</p>
      {subtitle && <p className="px-5 pb-2 font-medium text-[12px] text-edu-muted">{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
}

function Row({ icon, label, labelColor, children, onClick }: { icon: React.ReactNode; label: string; labelColor?: string; children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-[#F9FAFB] last:border-0 text-left">
      <div className="w-5">{icon}</div>
      <span className="flex-1 font-semibold text-[14px]" style={{ color: labelColor ?? "#1A1A2E" }}>{label}</span>
      {children}
    </button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange(!on); }} className="w-11 h-6 rounded-full relative" style={{ background: on ? "#FF6B35" : "#E5E7EB" }}>
      <motion.span animate={{ x: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" />
    </button>
  );
}