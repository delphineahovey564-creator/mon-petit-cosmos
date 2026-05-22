import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { Field } from "@/components/educ/Field";
import { PrimaryButton } from "@/components/educ/PrimaryButton";
import { Leo } from "@/components/educ/Leo";
import { setParent } from "@/lib/storage";

export const Route = createFileRoute("/signup")({ component: SignUp });

function passwordStrength(pw: string) {
  if (pw.length === 0) return { seg: 0, label: "", color: "#E5E7EB" };
  if (pw.length < 5) return { seg: 1, label: "Faible", color: "#FF5252" };
  if (pw.length < 8) return { seg: 2, label: "Moyen", color: "#FFB347" };
  const strong = /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  if (strong) return { seg: 4, label: "Fort", color: "#4CAF50" };
  return { seg: 3, label: "Bon", color: "#FF6B35" };
}

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [terms, setTerms] = useState(false);

  const strength = useMemo(() => passwordStrength(pw), [pw]);
  const match = pw.length > 0 && pw === pw2;
  const valid = firstName.trim() && email.includes("@") && pw.length >= 8 && match && terms;

  const submit = () => {
    setParent({ firstName, email, isLoggedIn: true });
    navigate({ to: "/create-profile" });
  };

  return (
    <div className="min-h-screen bg-edu-bg">
      {/* Top */}
      <div className="bg-white px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-edu-primary grid place-items-center text-white font-black">E</div>
            <span className="text-edu-primary font-black text-lg">EducEnfant</span>
          </div>
          <button onClick={() => navigate({ to: "/onboarding" })} className="p-1.5">
            <X size={22} className="text-edu-dark" />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-end gap-2">
          <div className="bg-white border-[1.5px] border-edu-primary-pale rounded-xl rounded-bl-none px-3.5 py-2.5 max-w-[180px]">
            <p className="font-bold text-[13px] text-edu-dark">Prêt à commencer l'aventure ?</p>
          </div>
          <div className="rounded-2xl overflow-hidden bg-edu-primary-pale p-1">
            <Leo size={100} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-5 py-6">
        <h1 className="text-[28px] font-black text-edu-dark leading-tight">Créer un compte</h1>
        <p className="mt-1 text-edu-muted font-semibold text-sm">Pour suivre la progression de votre enfant</p>

        <div className="mt-6 space-y-4">
          <Field label="Votre prénom" icon={User} placeholder="Jean-Pierre" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Field label="Adresse e-mail" icon={Mail} placeholder="email@exemple.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div>
            <Field
              label="Mot de passe" icon={Lock}
              placeholder="Minimum 8 caractères"
              type={showPw ? "text" : "password"}
              value={pw} onChange={(e) => setPw(e.target.value)}
              rightSlot={
                <button type="button" onClick={() => setShowPw((s) => !s)} className="p-1">
                  {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                </button>
              }
            />
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex-1 h-1 rounded-full" style={{ background: n <= strength.seg ? strength.color : "#E5E7EB" }} />
                ))}
              </div>
              {strength.label && (
                <span className="text-[11px] font-bold" style={{ color: strength.color }}>{strength.label}</span>
              )}
            </div>
          </div>

          <Field
            label="Confirmer le mot de passe" icon={Lock}
            type={showPw ? "text" : "password"}
            value={pw2} onChange={(e) => setPw2(e.target.value)}
            rightSlot={match ? <Check size={20} color="#4CAF50" /> : null}
          />

          <button
            type="button"
            onClick={() => setTerms((t) => !t)}
            className="flex items-start gap-2.5 text-left pt-2"
          >
            <span
              className="w-5 h-5 rounded-[6px] border-[1.5px] grid place-items-center mt-0.5"
              style={{ background: terms ? "#FF6B35" : "white", borderColor: terms ? "#FF6B35" : "#E5E7EB" }}
            >
              {terms && <Check size={14} color="white" strokeWidth={3} />}
            </span>
            <span className="text-[13px] text-edu-muted font-semibold">
              J'accepte les <span className="text-edu-primary underline">conditions d'utilisation</span>
            </span>
          </button>

          <PrimaryButton disabled={!valid} onClick={submit} className="mt-2">
            Créer mon compte
          </PrimaryButton>

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

          <p className="text-center text-sm text-edu-muted font-semibold pt-2">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-edu-primary font-bold">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}