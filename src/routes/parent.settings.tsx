import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import { setParent, setOnboardingDone } from "@/lib/storage";

export const Route = createFileRoute("/parent/settings")({ component: ParentSettings });

function ParentSettings() {
  const navigate = useNavigate();
  const logout = () => {
    setParent({ isLoggedIn: false });
    setOnboardingDone(false);
    navigate({ to: "/splash" });
  };

  return (
    <div className="min-h-screen bg-edu-bg pb-10">
      <div className="px-5 pt-5 flex items-center gap-3">
        <button onClick={() => navigate({ to: "/parent" })} className="p-1.5">
          <ArrowLeft size={24} className="text-edu-primary" />
        </button>
        <p className="text-edu-dark font-bold">Réglages</p>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {["Notifications", "Confidentialité", "Aide", "À propos"].map((t) => (
          <button key={t} className="w-full bg-white rounded-2xl px-5 py-4 text-left font-bold text-edu-dark shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            {t}
          </button>
        ))}

        <button onClick={logout} className="w-full mt-6 bg-[#FFF0F0] rounded-2xl px-5 py-4 text-left font-extrabold text-edu-error flex items-center gap-2">
          <LogOut size={18} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}