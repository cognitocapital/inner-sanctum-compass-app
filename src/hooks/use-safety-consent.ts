import { useState, useCallback, useEffect } from "react";

export interface SafetyConsent {
  moduleId: string;
  timestamp: number;
  expiresAt: number;
  method: "audio" | "read" | "return";
  absScore?: number;
  selectedMethod?: string;
  acknowledged: boolean;
}

const CONSENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useSafetyConsent(moduleId: string) {
  const [consent, setConsent] = useState<SafetyConsent | null>(null);
  const storageKey = `phoenix_safety_consent_${moduleId}`;

  // Load consent from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed: SafetyConsent = JSON.parse(stored);
        // Check if expired
        if (parsed.expiresAt > Date.now()) {
          setConsent(parsed);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  const saveConsent = useCallback((data: Omit<SafetyConsent, "moduleId" | "timestamp" | "expiresAt">) => {
    const now = Date.now();
    const newConsent: SafetyConsent = {
      ...data,
      moduleId,
      timestamp: now,
      expiresAt: now + CONSENT_TTL_MS,
    };
    localStorage.setItem(storageKey, JSON.stringify(newConsent));
    setConsent(newConsent);
    return newConsent;
  }, [moduleId, storageKey]);

  const clearConsent = useCallback(() => {
    localStorage.removeItem(storageKey);
    setConsent(null);
  }, [storageKey]);

  const hasValidConsent = consent !== null && consent.expiresAt > Date.now();

  const getTimeRemaining = useCallback(() => {
    if (!consent) return null;
    const remaining = consent.expiresAt - Date.now();
    if (remaining <= 0) return null;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  }, [consent]);

  return {
    consent,
    hasValidConsent,
    saveConsent,
    clearConsent,
    getTimeRemaining,
  };
}
