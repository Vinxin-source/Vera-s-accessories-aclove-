"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("vera_install_dismissed") === "1") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    if (standalone) return;

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/i.test(ua);
    const isSafari = isIos && /Safari/i.test(ua) && !/CriOS|FxiOS/i.test(ua);
    if (isSafari) setIos(true);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // Always show tip after short delay (Chrome + Safari + admin pages)
    const t = window.setTimeout(() => setShow(true), 1800);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.clearTimeout(t);
    };
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem("vera_install_dismissed", "1");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 z-[200] mx-auto max-w-md">
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xl">
        <div className="flex justify-between gap-2">
          <div>
            <p className="font-semibold text-[var(--ink)]">Install this app</p>
            {ios ? (
              <p className="mt-1 text-sm text-[var(--muted)]">
                Tap <strong>Share</strong> then <strong>Add to Home Screen</strong>
              </p>
            ) : deferred ? (
              <p className="mt-1 text-sm text-[var(--muted)]">
                Add to your home screen for quick access
              </p>
            ) : (
              <p className="mt-1 text-sm text-[var(--muted)]">
                Menu ⋮ → <strong>Install app</strong> or <strong>Add to Home screen</strong>
              </p>
            )}
          </div>
          <button type="button" onClick={dismiss} className="text-[var(--muted)] text-lg leading-none px-1">
            ×
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {deferred ? (
            <button type="button" className="btn btn-primary flex-1 !py-2.5" onClick={install}>
              Install
            </button>
          ) : null}
          <button type="button" className="btn btn-secondary flex-1 !py-2.5" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
