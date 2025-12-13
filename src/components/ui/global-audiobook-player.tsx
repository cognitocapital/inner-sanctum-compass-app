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
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/contexts/AudioContext";

interface Chapter {
  id: string;
  title: string;
  audioUrl: string | null;
}

// Audio chapters - all properly sequenced
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
  { id: "chapter14", title: "Chapter 14: The Universe's Message", audioUrl: null },
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
}

export const GlobalAudiobookPlayer = ({ 
  isVisible, 
  onClose,
  startChapterId = "dedication" 
}: GlobalAudiobookPlayerProps) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    const index = chapters.findIndex(c => c.id === startChapterId);
    return index >= 0 ? index : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { setAudiobookPlaying } = useAudio();
  const currentChapter = chapters[currentChapterIndex];

  // Notify audio context when playing state changes
  useEffect(() => {
    setAudiobookPlaying(isPlaying);
  }, [isPlaying, setAudiobookPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle chapter changes - ensure seamless transition
  useEffect(() => {
    if (audioRef.current && currentChapter.audioUrl) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentChapter.audioUrl;
      audioRef.current.load();
      setCurrentTime(0);
      
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentChapterIndex]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !currentChapter.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, [isPlaying, currentChapter.audioUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handlePreviousChapter = () => {
    // Find previous chapter with audio
    for (let i = currentChapterIndex - 1; i >= 0; i--) {
      if (chapters[i].audioUrl) {
        setCurrentChapterIndex(i);
        return;
      }
    }
  };

  const handleNextChapter = () => {
    // Find next chapter with audio
    for (let i = currentChapterIndex + 1; i < chapters.length; i++) {
      if (chapters[i].audioUrl) {
        setCurrentChapterIndex(i);
        return;
      }
    }
  };

  const handleEnded = () => {
    // Auto-advance to next available chapter
    handleNextChapter();
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentChapter.audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Chapter List Modal */}
      {showChapterList && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-orange-500/30 max-w-md w-full max-h-[70vh] overflow-hidden">
            <div className="p-4 border-b border-orange-500/20 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-orange-100">Chapters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChapterList(false)}
                className="text-orange-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-2 overflow-y-auto max-h-[50vh]">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if (chapter.audioUrl) {
                      setCurrentChapterIndex(index);
                      setShowChapterList(false);
                    }
                  }}
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
                  <div className="flex items-center gap-3">
                    <span className="text-xs">
                      {chapter.audioUrl ? "🔊" : "⏳"}
                    </span>
                    <span className="text-sm truncate">{chapter.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mini Player (Fixed at bottom) */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-900/95 border-t border-orange-500/30 backdrop-blur-xl transition-all duration-300",
        isExpanded ? "pb-4" : "pb-2"
      )}>
        {/* Expand Handle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-full p-1 transition-colors"
        >
          <ChevronUp className={cn("h-4 w-4 text-orange-300 transition-transform", isExpanded && "rotate-180")} />
        </button>

        <div className="max-w-4xl mx-auto px-4 pt-4">
          {/* Progress Bar (Always Visible) */}
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={!currentChapter.audioUrl}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-orange-300/70 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-4">
            {/* Chapter Info */}
            <button 
              onClick={() => setShowChapterList(true)}
              className="flex-1 min-w-0 text-left group"
            >
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-orange-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-orange-100 truncate group-hover:text-orange-50">
                    {currentChapter.title}
                  </p>
                  <p className="text-xs text-orange-300/60">
                    What a Journey
                  </p>
                </div>
                <List className="h-4 w-4 text-orange-400/50 group-hover:text-orange-400 ml-2 shrink-0" />
              </div>
            </button>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousChapter}
                disabled={currentChapterIndex === 0}
                className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 disabled:opacity-30 h-10 w-10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                size="icon"
                onClick={handlePlayPause}
                disabled={!currentChapter.audioUrl}
                className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-30"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
                className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 disabled:opacity-30 h-10 w-10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume & Close */}
            <div className="flex items-center gap-2">
              {isExpanded && (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="w-24"
                  />
                </div>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-orange-300/60 hover:text-orange-100 hover:bg-orange-500/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
