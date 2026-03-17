import { motion } from "framer-motion";
import { Music, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundscape } from "@/contexts/SoundscapeContext";
import { SOUNDSCAPE_TRACKS } from "@/data/soundscapesData";

const PROTOCOL_TRACK_ID = "nervous-system-reset";

export const SoundscapeStep = ({ onComplete }: { onComplete: () => void }) => {
  const { selectedTrack, isPlaying, selectTrack, togglePlay } = useSoundscape();

  const track = SOUNDSCAPE_TRACKS.find(t => t.id === PROTOCOL_TRACK_ID)!;
  const isThisTrack = selectedTrack?.id === track.id;

  const handlePlay = () => {
    if (!isThisTrack) {
      selectTrack(track);
    } else {
      togglePlay();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 py-6"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
        <Music className="w-10 h-10 text-purple-400" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.4))' }} />
      </div>

      <div>
        <h3 className="text-xl font-serif text-white mb-1">Nervous System Reset</h3>
        <p className="text-sm text-white/40 max-w-xs mx-auto">
          {track.manuscriptTieIn}
        </p>
      </div>

      <Button
        onClick={handlePlay}
        size="lg"
        className="rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 gap-2 min-h-[56px] px-8"
      >
        {isThisTrack && isPlaying ? (
          <><Pause className="w-5 h-5" /> Playing...</>
        ) : (
          <><Play className="w-5 h-5 ml-0.5" /> Start Soundscape</>
        )}
      </Button>

      <p className="text-xs text-white/20">
        Soundscape continues in background as you navigate
      </p>

      <Button
        onClick={onComplete}
        variant="ghost"
        className="text-white/40 hover:text-white/60 text-sm"
      >
        {isThisTrack && isPlaying ? "Continue with sound →" : "Skip this step →"}
      </Button>
    </motion.div>
  );
};
