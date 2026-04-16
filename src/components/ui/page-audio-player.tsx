import { useState, useRef, useEffect } from "react";
import { Volume2, Pause, Play, X } from "lucide-react";

interface PageAudioPlayerProps {
  audioSrc: string | string[];
  isVideo?: boolean;
}

const PageAudioPlayer = ({ audioSrc, isVideo = false }: PageAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sources = Array.isArray(audioSrc) ? audioSrc : [audioSrc];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isVideo) return;

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
  }, [currentPart, sources.length, isVideo]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isVideo) return;
    audio.src = sources[currentPart];
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentPart, isVideo]);

  const toggle = () => {
    if (isVideo) {
      setShowVideo(true);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const closeVideo = () => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      {!isVideo && <audio ref={audioRef} src={sources[0]} preload="none" />}
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

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeVideo}>
          <div className="relative w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeVideo}
              className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              ref={videoRef}
              src={sources[0]}
              controls
              autoPlay
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PageAudioPlayer;
