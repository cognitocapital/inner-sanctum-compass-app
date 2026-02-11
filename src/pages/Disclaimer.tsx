import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Disclaimer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Auto-play when loaded
    audio.play().then(() => setIsPlaying(true)).catch(() => {});

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/audio/disclaimer.mp3" preload="auto" />

      {/* Animated background elements - matching landing page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-float opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60 shadow-lg shadow-orange-500/40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-float opacity-70 shadow-lg shadow-orange-500/45" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-50 shadow-lg shadow-orange-500/35" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 left-[16%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-float opacity-45 shadow-lg shadow-orange-500/30" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 right-[16%] w-1 h-1 bg-orange-500 rounded-full animate-float opacity-35 shadow-lg shadow-orange-500/25" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Additional ember particles */}
        <div className="absolute top-32 left-[20%] w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-float opacity-35" style={{ animationDelay: '5s' }}></div>
        <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-30" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Back navigation */}
        <div className="absolute top-6 left-6">
          <Button asChild variant="ghost" className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/20">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          {/* Phoenix icon */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div 
              className="w-full h-full rounded-full border-2 border-orange-500/40 shadow-xl"
              style={{
                backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Subtle glow */}
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl -z-10"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            Disclaimer
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Before we begin this journey together, please take a moment to listen to this important message.
          </p>

          {/* Audio Player */}
          <div className="mb-10 p-6 rounded-2xl backdrop-blur-sm bg-orange-500/10 border border-orange-500/30 shadow-xl">
            {/* Progress bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <Button
                onClick={togglePlay}
                className="bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-orange-500/20"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Continue button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <Link to="/prologue">
                Continue to Prologue <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-6 text-center text-sm text-gray-400">
          <p>© 2024 Michael Heron. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Disclaimer;
