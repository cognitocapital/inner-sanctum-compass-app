import { Play, Pause, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSoundscape } from "@/contexts/SoundscapeContext";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const GlobalSoundscapePlayer = () => {
  const { selectedTrack, isPlaying, togglePlay, stopPlayback, volume, setVolume, isMuted, setIsMuted, timeRemaining } = useSoundscape();
  const location = useLocation();

  // Don't show mini player on the soundscapes page itself (it has its own full UI)
  if (!selectedTrack || !isPlaying && !selectedTrack.audioUrl || location.pathname === "/soundscapes") return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 px-4 py-3 flex items-center gap-3">
          {/* Icon */}
          <div className="text-lg w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            {selectedTrack.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{selectedTrack.title}</p>
            {timeRemaining !== null && (
              <p className="text-xs text-primary font-mono">⏱ {formatTimer(timeRemaining)}</p>
            )}
          </div>

          {/* Volume (desktop) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8 text-muted-foreground">
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
            <Slider value={[isMuted ? 0 : volume * 100]} max={100} step={1} onValueChange={(v) => setVolume(v[0] / 100)} className="w-16" />
          </div>

          {/* Play/Pause */}
          <Button size="icon" onClick={togglePlay} className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>

          {/* Close */}
          <Button variant="ghost" size="icon" onClick={stopPlayback} className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
