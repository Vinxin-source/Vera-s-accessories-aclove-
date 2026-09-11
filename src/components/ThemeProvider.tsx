"use client";

import { useEffect } from "react";
import { getSettings } from "@/lib/store";

function applyTheme() {
  const s = getSettings();
  const root = document.documentElement;
  const primary = s.primaryColor || "#6D28D9";
  const accent = s.accentColor || "#A78BFA";
  const bg = s.backgroundColor || "#F5F3FF";
  root.style.setProperty("--rose", primary);
  root.style.setProperty("--rose-deep", primary);
  root.style.setProperty("--gold", accent);
  root.style.setProperty("--gold-soft", accent + "33");
  root.style.setProperty("--bg", bg);
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--accent", accent);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme();
    const onSettings = () => applyTheme();
    window.addEventListener("vera-settings", onSettings);
    window.addEventListener("storage", onSettings);
    return () => {
      window.removeEventListener("vera-settings", onSettings);
      window.removeEventListener("storage", onSettings);
    };
  }, []);

  return <>{children}</>;
}
