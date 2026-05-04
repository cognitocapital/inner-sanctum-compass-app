import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Book,
  X,
  ChevronUp,
  ChevronDown,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSoundscape } from "@/contexts/SoundscapeContext";

interface Chapter {
  id: string;
  title: string;
  audioUrl: string | null;
}

// Single seamless file per chapter (multi-part files have been concatenated)
const chapters: Chapter[] = [
  { id: "dedication", title: "Dedication", audioUrl: "/audio/dedication.mp3" },
  { id: "prologue", title: "Prologue", audioUrl: "/audio/prologue.mp3" },
  { id: "introduction", title: "Introduction", audioUrl: "/audio/introduction.mp3" },
  { id: "chapter1", title: "Chapter 1: Australia Day", audioUrl: "/audio/chapter1.mp3" },
  { id: "chapter2", title: "Chapter 2: Hospital Daze", audioUrl: "/audio/chapter2.mp3" },
  { id: "chapter3", title: "Chapter 3: The Gun to My Head", audioUrl: "/audio/chapter3.mp3" },
  { id: "chapter4", title: "Chapter 4: Finding My Footing", audioUrl: "/audio/chapter4.mp3" },
  { id: "chapter5", title: "Chapter 5: Choose Your Own Adventure", audioUrl: "/audio/chapter5.mp3" },
  { id: "chapter6", title: "Chapter 6: The Roller Coaster", audioUrl: "/audio/chapter6.mp3" },
  { id: "chapter7", title: "Chapter 7: Mind Games", audioUrl: "/audio/chapter7.mp3" },
  { id: "chapter8", title: "Chapter 8: Nourishing the Body", audioUrl: "/audio/chapter8.mp3" },
  { id: "chapter9", title: "Chapter 9: The Business Dilemma", audioUrl: "/audio/chapter9.mp3" },
  { id: "chapter10", title: "Chapter 10: A New Chapter", audioUrl: "/audio/chapter10.mp3" },
  { id: "chapter11", title: "Chapter 11: The Inner Work", audioUrl: "/audio/chapter11.mp3" },
  { id: "chapter12", title: "Chapter 12: Reclaiming Independence", audioUrl: "/audio/chapter12.mp3" },
  { id: "chapter13", title: "Chapter 13: The Power of Gratitude", audioUrl: "/audio/chapter13.mp3" },
  { id: "chapter14", title: "Chapter 14: The Universe's Message", audioUrl: "/audio/chapter14.mp3" },
  { id: "chapter15", title: "Chapter 15: Still Standing", audioUrl: "/audio/chapter15.mp3" },
  { id: "chapter16", title: "Chapter 16: Looking Forward", audioUrl: "/audio/chapter16.mp3" },
  { id: "chapter17", title: "Chapter 17: The Torch Rekindled", audioUrl: "/audio/chapter17.mp3" },
  { id: "chapter18", title: "Chapter 18: Unwritten Chapters", audioUrl: "/audio/chapter18.mp3" },
  { id: "chapter19", title: "Chapter 19: A New Resource", audioUrl: "/audio/chapter19.mp3" },
  { id: "chapter20", title: "Chapter 20: The Next Page", audioUrl: null },
  { id: "acknowledgments", title: "Acknowledgments", audioUrl: "/audio/acknowledgments.mp3" },
];

interface GlobalAudiobookPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  startChapterId?: string;
  autoPlay?: boolean;
}

const INTER_CHAPTER_GAP_MS = 5000;

export const GlobalAudiobookPlayer = ({
  isVisible,
  onClose,
  startChapterId = "dedication",
  autoPlay = false,
}: GlobalAudiobookPlayerProps) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    const idx = chapters.findIndex((c) => c.id === startChapterId);
    return idx >= 0 ? idx : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimised, setIsMinimised] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playIntentRef = useRef(false);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soundscape = useSoundscape();

  const currentChapter = chapters[currentChapterIndex];
  const hasAudio = !!currentChapter.audioUrl;

  // Sync volume/mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Respond to startChapterId changes from parent (e.g. user taps Listen on a chapter page)
  useEffect(() => {
    const idx = chapters.findIndex((c) => c.id === startChapterId);
    if (idx >= 0 && idx !== currentChapterIndex) {
      setCurrentChapterIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startChapterId]);

  // Set autoPlay intent when player opens with that flag
  useEffect(() => {
    if (isVisible && autoPlay) {
      playIntentRef.current = true;
    }
    if (!isVisible) {
      // pause if hidden via close — handled in handleClose
      playIntentRef.current = false;
    }
  }, [isVisible, autoPlay]);

  // Load + (optionally) play whenever chapter changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = currentChapter.audioUrl;
    if (!url) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (gapTimerRef.current) {
      clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }

    audio.pause();
    audio.src = url;
    audio.load();
    setCurrentTime(0);

    const onCanPlay = () => {
      audio.playbackRate = 0.92;
      if (playIntentRef.current) {
        // Pause soundscape if it's playing — only one narrative source at a time
        if (soundscape.isPlaying) {
          soundscape.togglePlay();
        }
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    return () => audio.removeEventListener("canplaythrough", onCanPlay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapterIndex]);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      playIntentRef.current = false;
    } else {
      // Pause soundscape on resume
      if (soundscape.isPlaying) soundscape.togglePlay();
      playIntentRef.current = true;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [hasAudio, isPlaying, soundscape]);

  const goToChapter = useCallback((delta: number) => {
    setCurrentChapterIndex((i) => {
      let next = i + delta;
      while (next >= 0 && next < chapters.length && !chapters[next].audioUrl) {
        next += delta;
      }
      if (next < 0 || next >= chapters.length) return i;
      return next;
    });
  }, []);

  const handleEnded = () => {
    setIsPlaying(false);
    playIntentRef.current = true; // intent persists into next chapter
    gapTimerRef.current = setTimeout(() => {
      setCurrentChapterIndex((i) => {
        let next = i + 1;
        while (next < chapters.length && !chapters[next].audioUrl) next += 1;
        return next < chapters.length ? next : i;
      });
    }, INTER_CHAPTER_GAP_MS);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleClose = () => {
    if (audioRef.current) audioRef.current.pause();
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    setIsPlaying(false);
    playIntentRef.current = false;
    onClose();
  };

  const handleChapterSelect = (idx: number) => {
    if (!chapters[idx].audioUrl) return;
    playIntentRef.current = true;
    setCurrentChapterIndex(idx);
    setShowChapterList(false);
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Pause audiobook when soundscape starts playing externally
  useEffect(() => {
    if (soundscape.isPlaying && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      playIntentRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundscape.isPlaying]);

  if (!isVisible) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.playbackRate = 0.92;
          }
        }}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Chapter list */}
      {showChapterList && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowChapterList(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl border border-orange-500/30 max-w-md w-full max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-orange-500/20 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-orange-100">Chapters</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowChapterList(false)} className="text-orange-300">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-2 overflow-y-auto max-h-[55vh]">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(index)}
                  disabled={!chapter.audioUrl}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all mb-1",
                    index === currentChapterIndex
                      ? "bg-orange-500/30 text-orange-100"
                      : chapter.audioUrl
                        ? "text-orange-300/70 hover:bg-orange-500/10 hover:text-orange-100"
                        : "text-orange-500/30 cursor-not-allowed"
                  )}
                >
                  <span className="text-sm">{chapter.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MINIMISED: slim bar (~44px) */}
      {isMinimised ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-950 to-gray-900/95 border-t border-orange-500/30 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-3 h-11 flex items-center gap-2">
            <Button
              size="icon"
              onClick={handlePlayPause}
              disabled={!hasAudio}
              className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-30 shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </Button>
            <button
              onClick={() => setIsMinimised(false)}
              className="flex-1 min-w-0 text-left flex items-center gap-2"
            >
              <Book className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <span className="text-xs font-medium text-orange-100 truncate">{currentChapter.title}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimised(false)}
              className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 h-8 w-8"
              aria-label="Expand player"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-orange-300/60 hover:text-orange-100 hover:bg-orange-500/20 h-8 w-8"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* FULL mini player */
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-900/95 border-t border-orange-500/30 backdrop-blur-xl transition-all duration-300",
            isExpanded ? "pb-4" : "pb-2"
          )}
        >
          {/* Top action row: minimise + expand */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
            <button
              onClick={() => setIsMinimised(true)}
              className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-full p-1 transition-colors"
              aria-label="Minimise player"
              title="Minimise"
            >
              <ChevronDown className="h-4 w-4 text-orange-300" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-full p-1 transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <ChevronUp className={cn("h-4 w-4 text-orange-300 transition-transform", isExpanded && "rotate-180")} />
            </button>
          </div>

          <div className="max-w-4xl mx-auto px-4 pt-4">
            {/* Progress */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                disabled={!hasAudio}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-orange-300/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowChapterList(true)} className="flex-1 min-w-0 text-left group">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-orange-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-orange-100 truncate group-hover:text-orange-50">
                      {currentChapter.title}
                    </p>
                    <p className="text-xs text-orange-300/60">What a Journey</p>
                  </div>
                  <List className="h-4 w-4 text-orange-400/50 group-hover:text-orange-400 ml-2 shrink-0" />
                </div>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goToChapter(-1)}
                  disabled={currentChapterIndex === 0}
                  className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 disabled:opacity-30 h-10 w-10"
                  aria-label="Previous chapter"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={handlePlayPause}
                  disabled={!hasAudio}
                  className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-30"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => goToChapter(1)}
                  disabled={currentChapterIndex === chapters.length - 1}
                  className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 disabled:opacity-30 h-10 w-10"
                  aria-label="Next chapter"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {isExpanded && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 h-8 w-8"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(v) => setVolume(v[0] / 100)}
                      className="w-24"
                    />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-orange-300/60 hover:text-orange-100 hover:bg-orange-500/20 h-8 w-8"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
