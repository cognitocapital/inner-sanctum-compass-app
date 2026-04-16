import { useState, useRef, useEffect } from "react";
import { Volume2, Pause, Play } from "lucide-react";

interface PageAudioPlayerProps {
  audioSrc: string | string[];
  isVideo?: boolean;
}

const PageAudioPlayer = ({ audioSrc, isVideo = false }: PageAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sources = Array.isArray(audioSrc) ? audioSrc : [audioSrc];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentPart < sources.length - 1) {
        setCurrentPart((p) => p + 1);
      } else {
        setIsPlaying(false);
        setCurrentPart(0);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentPart, sources.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = sources[currentPart];
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentPart]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={sources[0]} preload="none" />
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2.5 rounded-full bg-black/50 border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/60 backdrop-blur-sm transition-all duration-200 group"
        aria-label={isPlaying ? "Pause audio" : "Listen to this chapter"}
        title={isPlaying ? "Pause" : "Listen to this chapter"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
        <span className="text-xs font-medium hidden sm:inline">
          {isPlaying ? "Pause" : "Listen"}
        </span>
      </button>
    </>
  );
};

export default PageAudioPlayer;
