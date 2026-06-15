import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("educenfant_install_dismissed")) return;

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShow(false);
  }

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem("educenfant_install_dismissed", "true");
    } catch {}
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: 16,
        right: 16,
        maxWidth: 400,
        margin: "0 auto",
        background: "white",
        borderRadius: 20,
        boxShadow: "0 8px 30px rgba(0,0,0,.15)",
        padding: 16,
        zIndex: 999,
        fontFamily: "Nunito, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "linear-gradient(135deg,#FF6B35,#FFB347)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "white",
          fontWeight: 900,
          fontSize: 22,
        }}
      >
        E
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#1A1A2E" }}>Installer EducEnfant</div>
        <div style={{ fontWeight: 500, fontSize: 12, color: "#6B7280", marginTop: 2 }}>
          {isIOS
            ? "Appuie sur Partager → Sur l'écran d'accueil"
            : "Accès rapide depuis ton écran d'accueil"}
        </div>
      </div>
      {!isIOS && (
        <button
          onClick={handleInstall}
          style={{
            background: "#FF6B35",
            border: "none",
            borderRadius: 10,
            padding: "8px 14px",
            color: "white",
            fontWeight: 800,
            fontSize: 13,
            fontFamily: "Nunito, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <Download size={14} /> Installer
        </button>
      )}
      <button
        onClick={dismiss}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
        aria-label="Fermer"
      >
        <X size={18} color="#9CA3AF" />
      </button>
    </div>
  );
}