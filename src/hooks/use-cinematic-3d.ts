import { useEffect, useState } from "react";

const STORAGE_KEY = "cinematic-3d-enabled";
const EVENT = "cinematic-3d-changed";

function readPref(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== null) return stored === "true";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduced;
}

export function setCinematic3DEnabled(value: boolean) {
  window.localStorage.setItem(STORAGE_KEY, String(value));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCinematic3D(): boolean {
  const [enabled, setEnabled] = useState<boolean>(() => readPref());

  useEffect(() => {
    const sync = () => setEnabled(readPref());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
      mq.removeEventListener?.("change", sync);
    };
  }, []);

  if (typeof window !== "undefined") {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return false;
  }
  return enabled;
}