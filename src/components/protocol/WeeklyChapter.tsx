import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Pause, BookOpen, Check, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeekData } from '@/data/protocolWeeks';

interface WeeklyChapterProps {
  weekData: WeekData;
  isCompleted: boolean;
  onComplete: () => void;
}

export const WeeklyChapter = ({ weekData, isCompleted, onComplete }: WeeklyChapterProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(pct);
    
    // Auto-complete when audio finishes
    if (pct >= 95 && !isCompleted) {
      onComplete();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Chapter Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 backdrop-blur-xl">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-6 sm:p-8">
          {/* Week indicator */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Week {weekData.week}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10">
              {weekData.theme}
            </span>
            {isCompleted && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Complete
              </span>
            )}
          </div>
          
          {/* Chapter Title */}
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-3">
            "{weekData.chapter}"
          </h2>
          
          {/* Quote */}
          <p className="text-white/60 italic mb-6 max-w-lg">
            "{weekData.quote}"
          </p>
          
          {/* Audio Player */}
          <div className="mb-6">
            <audio 
              ref={audioRef}
              src={weekData.audioPath}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
            
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Headphones className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-white/80">Listen to Chapter</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to={weekData.chapterPath}>
                <BookOpen className="w-4 h-4 mr-2" />
                Read Chapter
              </Link>
            </Button>
            
            {!isCompleted && (
              <Button
                onClick={onComplete}
                variant="ghost"
                className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};