import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Field } from "@/components/educ/Field";
import { PrimaryButton } from "@/components/educ/PrimaryButton";
import { Leo } from "@/components/educ/Leo";
import { getChild, setParent } from "@/lib/storage";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const childName = typeof window !== "undefined" ? getChild().name : "Toni";

  const submit = () => {
    setParent({ email, isLoggedIn: true });
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Gradient top */}
      <div
        className="absolute inset-x-0 top-0 h-[45vh] rounded-b-[40px]"
        style={{ background: "linear-gradient(180deg,#FF6B35 0%,#FFB347 100%)" }}
      >
        <div className="h-full flex items-center justify-center relative">
          {/* sparkles */}
          {[
            { x: "12%", y: "20%", r: -12 },
            { x: "82%", y: "18%", r: 8 },
            { x: "18%", y: "70%", r: 20 },
            { x: "80%", y: "68%", r: -15 },
          ].map((s, i) => (
            <span key={i} className="absolute text-edu-accent text-xl" style={{ left: s.x, top: s.y, transform: `rotate(${s.r}deg)` }}>★</span>
          ))}
          <div className="rounded-2xl bg-white/15 p-2">
            <Leo size={140} />
          </div>
        </div>
      </div>

      {/* White card */}
      <div className="relative z-10 pt-[42vh]">
        <div className="bg-white rounded-t-[32px] -mt-10 px-6 pt-8 pb-10 min-h-[60vh] shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
          <h1 className="text-[26px] font-black text-edu-dark text-center">Content de te revoir !</h1>
          <p className="text-center text-sm text-edu-muted font-semibold mt-1">
            Connecte-toi pour retrouver <span className="text-edu-primary font-extrabold">{childName}</span>
          </p>

          <div className="mt-7 space-y-4">
            <Field label="E-mail" icon={Mail} type="email" placeholder="papa.maman@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
              <Field
                label="Mot de passe" icon={Lock} type={showPw ? "text" : "password"} placeholder="••••••••"
                value={pw} onChange={(e) => setPw(e.target.value)}
                rightSlot={
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="p-1">
                    {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                }
              />
              <div className="mt-2 text-right">
                <button className="text-edu-primary font-semibold text-[13px]">Mot de passe oublié ?</button>
              </div>
            </div>

            <PrimaryButton onClick={submit}>Se connecter</PrimaryButton>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-edu-subtle text-xs">ou continuer avec</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={submit} className="h-[52px] rounded-xl bg-white border-[1.5px] border-[#E5E7EB] flex items-center justify-center gap-2 font-bold text-[14px] text-edu-dark">
                <span className="text-lg">G</span> Google
              </button>
              <button onClick={submit} className="h-[52px] rounded-xl bg-edu-dark text-white flex items-center justify-center gap-2 font-bold text-[14px]">
                <span className="text-lg"></span> Apple
              </button>
            </div>

            <p className="text-center text-sm text-edu-muted font-semibold pt-3">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-edu-primary font-bold">S'inscrire gratuitement</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}