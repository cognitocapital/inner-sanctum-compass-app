import { useCallback } from "react";

export const useOpenAudiobook = () => {
  const openAudiobook = useCallback((chapterId?: string) => {
    if (typeof window !== "undefined" && (window as any).openAudiobook) {
      (window as any).openAudiobook(chapterId);
    }
  }, []);

  return openAudiobook;
};
