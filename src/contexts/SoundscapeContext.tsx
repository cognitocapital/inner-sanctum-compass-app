import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { type SoundscapeTrack } from "@/data/soundscapesData";

interface SoundscapeState {
  selectedTrack: SoundscapeTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  timerMinutes: number;
  timeRemaining: number | null;
  selectTrack: (track: SoundscapeTrack) => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  setIsMuted: (m: boolean) => void;
  setIsLooping: (l: boolean) => void;
  startTimer: (minutes: number) => void;
  stopPlayback: () => void;
}

const SoundscapeContext = createContext<SoundscapeState | null>(null);

export const useSoundscape = () => {
  const ctx = useContext(SoundscapeContext);
  if (!ctx) throw new Error("useSoundscape must be used within SoundscapeProvider");
  return ctx;
};

export const SoundscapeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTrack, setSelectedTrack] = useState<SoundscapeTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create persistent audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Loop sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeRemaining === 0) {
        audioRef.current?.pause();
        setIsPlaying(false);
        setTimeRemaining(null);
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining]);

  const selectTrack = useCallback(
    (track: SoundscapeTrack) => {
      if (!track.audioUrl) {
        setSelectedTrack(track);
        return;
      }
      const isSameTrack = selectedTrack?.id === track.id;
      setSelectedTrack(track);

      if (isSameTrack && isPlaying) return;

      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    },
    [isPlaying, selectedTrack]
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !selectedTrack?.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [isPlaying, selectedTrack]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setSelectedTrack(null);
    setTimeRemaining(null);
  }, []);

  const startTimer = useCallback((minutes: number) => {
    setTimerMinutes(minutes);
    setTimeRemaining(minutes === 0 ? null : minutes * 60);
  }, []);

  return (
    <SoundscapeContext.Provider
      value={{
        selectedTrack,
        isPlaying,
        volume,
        isMuted,
        isLooping,
        timerMinutes,
        timeRemaining,
        selectTrack,
        togglePlay,
        setVolume,
        setIsMuted,
        setIsLooping,
        startTimer,
        stopPlayback,
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};
