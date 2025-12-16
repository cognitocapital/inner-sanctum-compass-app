import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SafetyAudioPlayerProps {
  audioUrl?: string;
  fallbackScript: string;
  accentColor?: string;
  onComplete?: () => void;
}

const SafetyAudioPlayer: React.FC<SafetyAudioPlayerProps> = ({
  audioUrl,
  fallbackScript,
  accentColor = "cyan",
  onComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAudio, setHasAudio] = useState(!!audioUrl);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const accentClasses: Record<string, string> = {
    cyan: "bg-cyan-500 hover:bg-cyan-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    pink: "bg-pink-500 hover:bg-pink-600",
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
        setHasAudio(true);
      });

      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(pct);
        }
      });

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(100);
        onComplete?.();
      });

      audioRef.current.addEventListener("error", () => {
        setHasAudio(false);
      });

      return () => {
        audioRef.current?.pause();
        audioRef.current = null;
      };
    }
  }, [audioUrl, onComplete]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // If no audio, show the fallback text
  if (!hasAudio) {
    return (
      <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <Volume2 className="w-4 h-4" />
          <span className="text-sm">Audio guidance</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {fallbackScript}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Volume2 className="w-4 h-4" />
          <span className="text-sm">Listen to safety guidance</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatTime((progress / 100) * duration)} / {formatTime(duration)}
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={restart}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={togglePlay}
            className={cn(
              "w-12 h-12 rounded-full",
              accentClasses[accentColor] || accentClasses.cyan
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </Button>
        </motion.div>

        <div className="w-8" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};

export default SafetyAudioPlayer;
