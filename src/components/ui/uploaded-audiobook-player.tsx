import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Book
} from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  audioUrl: string | string[] | null; // Supports single URL or array for multi-part chapters
  route: string;
}

// Audio chapters - based on manuscript version 6.0
const chapters: Chapter[] = [
  { id: "dedication", title: "Dedication", audioUrl: "/audio/dedication.mp3", route: "/dedication" },
  { id: "prologue", title: "Prologue", audioUrl: ["/audio/prologue.mp3", "/audio/prologue-part2.mp3"], route: "/prologue" }, // Combined seamless playback
  { id: "introduction", title: "Introduction", audioUrl: ["/audio/introduction.mp3", "/audio/introduction-part2.mp3", "/audio/introduction-part3.mp3", "/audio/introduction-part4.mp3"], route: "/introduction" }, // Combined seamless playback
  { id: "chapter1", title: "Chapter 1: Australia Day", audioUrl: "/audio/chapter1.mp3", route: "/chapter1" },
  { id: "chapter2", title: "Chapter 2: Hospital Daze", audioUrl: "/audio/chapter2.mp3", route: "/chapter2" },
  { id: "chapter3", title: "Chapter 3: The Gun to My Head", audioUrl: "/audio/chapter3.mp3", route: "/chapter3" },
  { id: "chapter4", title: "Chapter 4: Finding My Footing", audioUrl: ["/audio/chapter4.mp3", "/audio/chapter4-part2.mp3"], route: "/chapter4" }, // Combined seamless playback
  { id: "chapter5", title: "Chapter 5: Choose Your Own Adventure", audioUrl: "/audio/chapter5.mp3", route: "/chapter5" },
  { id: "chapter6", title: "Chapter 6: The Roller Coaster", audioUrl: "/audio/chapter6.mp3", route: "/chapter6" },
  { id: "chapter7", title: "Chapter 7: Mind Games", audioUrl: "/audio/chapter7.mp3", route: "/chapter7" },
  { id: "chapter8", title: "Chapter 8: Nourishing the Body", audioUrl: ["/audio/chapter8.mp3", "/audio/chapter8-part2.mp3"], route: "/chapter8" }, // Combined seamless playback
  { id: "chapter9", title: "Chapter 9: The Business Dilemma", audioUrl: ["/audio/chapter9.mp3", "/audio/chapter9-part2.mp3", "/audio/chapter9-part3.mp3"], route: "/chapter9" }, // Combined seamless playback
  { id: "chapter10", title: "Chapter 10: A New Chapter", audioUrl: ["/audio/chapter10.mp3", "/audio/chapter10-part2.mp3"], route: "/chapter10" }, // Combined seamless playback
  { id: "chapter11", title: "Chapter 11: The Inner Work", audioUrl: ["/audio/chapter11.mp3", "/audio/chapter11-part2.mp3", "/audio/chapter11-part3.mp3", "/audio/chapter11-part4.mp3"], route: "/chapter11" }, // Combined seamless playback
  { id: "chapter12", title: "Chapter 12: Reclaiming Independence", audioUrl: ["/audio/chapter12.mp3", "/audio/chapter12-part2.mp3"], route: "/chapter12" }, // Combined seamless playback
  { id: "chapter13", title: "Chapter 13: The Power of Gratitude", audioUrl: ["/audio/chapter13.mp3", "/audio/chapter13-part2.mp3"], route: "/chapter13" }, // Combined seamless playback
  { id: "chapter14", title: "Chapter 14: The Universe's Message", audioUrl: ["/audio/chapter14.mp3", "/audio/chapter14-part2.mp3"], route: "/chapter14" }, // Combined seamless playback
  { id: "chapter15", title: "Chapter 15: Still Standing", audioUrl: "/audio/chapter15.mp3", route: "/chapter15" },
  { id: "chapter16", title: "Chapter 16: Looking Forward", audioUrl: "/audio/chapter16.mp3", route: "/chapter16" },
  { id: "chapter17", title: "Chapter 17: The Torch Rekindled", audioUrl: "/audio/chapter17.mp3", route: "/chapter17" },
  { id: "chapter18", title: "Chapter 18: Unwritten Chapters", audioUrl: "/audio/chapter18.mp3", route: "/chapter18" },
  { id: "chapter19", title: "Chapter 19: A New Resource", audioUrl: "/audio/chapter19.mp3", route: "/chapter19" },
  { id: "chapter20", title: "Chapter 20: The Next Page", audioUrl: null, route: "/chapter20" },
  { id: "acknowledgments", title: "Acknowledgments", audioUrl: "/audio/acknowledgments.mp3", route: "/acknowledgments" },
];

interface UploadedAudiobookPlayerProps {
  startChapterId?: string;
}

export const UploadedAudiobookPlayer = ({ startChapterId = "prologue" }: UploadedAudiobookPlayerProps) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    const index = chapters.findIndex(c => c.id === startChapterId);
    return index >= 0 ? index : 0;
  });
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0); // Track which audio segment in multi-part chapters
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioningRef = useRef(false);

  const currentChapter = chapters[currentChapterIndex];

  // Get the current audio URL (handles both single and array formats)
  const getCurrentAudioUrl = useCallback(() => {
    const urls = currentChapter.audioUrl;
    if (!urls) return null;
    if (Array.isArray(urls)) {
      return urls[currentAudioIndex] || null;
    }
    return urls;
  }, [currentChapter.audioUrl, currentAudioIndex]);

  // Check if chapter has audio
  const hasAudio = useCallback(() => {
    const urls = currentChapter.audioUrl;
    if (!urls) return false;
    if (Array.isArray(urls)) return urls.length > 0;
    return true;
  }, [currentChapter.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playIntentRef = useRef(false);

  // Handle chapter or audio segment changes - wait for canplaythrough before playing
  useEffect(() => {
    if (isTransitioningRef.current) return;
    const audioUrl = getCurrentAudioUrl();
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current;
      
      const onReady = () => {
        audio.playbackRate = 0.93;
        if (playIntentRef.current) {
          audio.play().catch(console.error);
          setIsPlaying(true);
        }
      };
      
      audio.removeEventListener('canplaythrough', onReady);
      audio.src = audioUrl;
      audio.load();
      setCurrentTime(0);
      
      audio.addEventListener('canplaythrough', onReady, { once: true });
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentChapterIndex, currentAudioIndex]);

  const handlePlayPause = () => {
    if (!audioRef.current || !hasAudio()) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      playIntentRef.current = false;
    } else {
      playIntentRef.current = true;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.playbackRate = 0.93;
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handlePreviousChapter = () => {
    setCurrentAudioIndex(0);
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    setCurrentAudioIndex(0);
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handleEnded = () => {
    const urls = currentChapter.audioUrl;
    
    if (Array.isArray(urls) && currentAudioIndex < urls.length - 1) {
      playIntentRef.current = true;
      setCurrentAudioIndex(prev => prev + 1);
    } else {
      isTransitioningRef.current = true;
      setCurrentAudioIndex(0);
      setIsPlaying(false);
      playIntentRef.current = true;
      if (currentChapterIndex < chapters.length - 1) {
        setTimeout(() => {
          isTransitioningRef.current = false;
          setCurrentAudioIndex(0);
          setCurrentChapterIndex(currentChapterIndex + 1);
        }, 4000);
      } else {
        isTransitioningRef.current = false;
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChapterSelect = (index: number) => {
    setCurrentAudioIndex(0);
    setCurrentChapterIndex(index);
  };

  const currentAudioUrl = getCurrentAudioUrl();

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-orange-950 border-orange-500/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Book className="h-5 w-5 text-orange-400" />
          <span className="text-orange-100 font-medium">What a Journey - Audiobook</span>
        </div>

        {/* Chapter Display */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-orange-100 mb-1">
            {currentChapter.title}
          </h3>
          <p className="text-sm text-orange-300/70">
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </p>
          {!hasAudio() && (
            <p className="text-sm text-orange-400/60 mt-2 italic">
              Audio coming soon...
            </p>
          )}
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="auto"
        />

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            disabled={!hasAudio()}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-orange-300/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousChapter}
            disabled={currentChapterIndex === 0}
            className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={handlePlayPause}
            disabled={!hasAudio()}
            className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-30"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20 disabled:opacity-30"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/20"
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
            className="flex-1 max-w-32"
          />
        </div>

        {/* Chapter List */}
        <div className="mt-6 pt-4 border-t border-orange-500/20">
          <p className="text-sm text-orange-300/70 mb-3">Available Chapters:</p>
          <div className="flex flex-wrap gap-2">
            {chapters.map((chapter, index) => (
              <Button
                key={chapter.id}
                variant="ghost"
                size="sm"
                onClick={() => handleChapterSelect(index)}
                disabled={!chapter.audioUrl}
                className={`text-xs ${
                  index === currentChapterIndex 
                    ? 'bg-orange-500/30 text-orange-100' 
                    : chapter.audioUrl 
                      ? 'text-orange-300/70 hover:text-orange-100 hover:bg-orange-500/20'
                      : 'text-orange-500/30'
                }`}
              >
                {chapter.audioUrl ? '🔊' : '⏳'} {chapter.title.replace(/Chapter \d+: /, '')}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};