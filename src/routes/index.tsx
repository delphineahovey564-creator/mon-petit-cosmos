import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getOnboardingDone, getParent } from "@/lib/storage";

export const Route = createFileRoute("/")({ component: RedirectIndex });

function RedirectIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getOnboardingDone()) {
      navigate({ to: "/splash" });
      return;
    }
    if (!getParent().isLoggedIn) {
      navigate({ to: "/login" });
      return;
    }
    navigate({ to: "/home" });
  }, [navigate]);
  return (
    <div className="min-h-screen grid place-items-center bg-edu-bg">
      <div className="text-edu-muted font-bold">Chargement…</div>
    </div>
  );
}
