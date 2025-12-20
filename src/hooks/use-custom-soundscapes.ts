import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteCustomSound,
  listCustomSounds,
  setCustomSound as persistCustomSound,
  type CustomSoundAsset,
} from "@/lib/custom-soundscape-store";

export type CustomSoundInfo = {
  soundId: string;
  fileName: string;
  mimeType: string;
  url: string;
  updatedAt: number;
};

export function useCustomSoundscapes() {
  const [sounds, setSounds] = useState<Record<string, CustomSoundInfo>>({});
  const urlsRef = useRef<Map<string, string>>(new Map());

  // Load all saved assets on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const assets = await listCustomSounds();
      if (cancelled) return;

      const next: Record<string, CustomSoundInfo> = {};
      for (const a of assets) {
        const url = URL.createObjectURL(a.blob);
        urlsRef.current.set(a.soundId, url);
        next[a.soundId] = {
          soundId: a.soundId,
          fileName: a.fileName,
          mimeType: a.mimeType,
          url,
          updatedAt: a.updatedAt,
        };
      }
      setSounds(next);
    })();

    return () => {
      cancelled = true;
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current.clear();
    };
  }, []);

  const hasCustom = useCallback((soundId: string) => !!sounds[soundId], [sounds]);

  const setCustomSound = useCallback(async (soundId: string, file: File) => {
    await persistCustomSound({
      soundId,
      fileName: file.name,
      mimeType: file.type || "audio/mpeg",
      blob: file,
    });

    // Replace URL
    const prevUrl = urlsRef.current.get(soundId);
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const url = URL.createObjectURL(file);
    urlsRef.current.set(soundId, url);

    setSounds((prev) => ({
      ...prev,
      [soundId]: {
        soundId,
        fileName: file.name,
        mimeType: file.type || "audio/mpeg",
        url,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const clearCustomSound = useCallback(async (soundId: string) => {
    await deleteCustomSound(soundId);

    const prevUrl = urlsRef.current.get(soundId);
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    urlsRef.current.delete(soundId);

    setSounds((prev) => {
      const next = { ...prev };
      delete next[soundId];
      return next;
    });
  }, []);

  const customUrlFor = useCallback((soundId: string) => sounds[soundId]?.url, [sounds]);

  const customMetaFor = useCallback(
    (soundId: string) => {
      const s = sounds[soundId];
      if (!s) return null;
      return { fileName: s.fileName, updatedAt: s.updatedAt };
    },
    [sounds]
  );

  return useMemo(
    () => ({
      sounds,
      hasCustom,
      setCustomSound,
      clearCustomSound,
      customUrlFor,
      customMetaFor,
    }),
    [sounds, hasCustom, setCustomSound, clearCustomSound, customUrlFor, customMetaFor]
  );
}
