import { useState, useRef } from "react";

interface VideoIntroProps {
  videoSrc: string;
  onComplete: () => void;
  children: React.ReactNode;
}

const VideoIntro = ({ videoSrc, onComplete, children }: VideoIntroProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setShowIntro(false);
    onComplete();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowIntro(false);
    onComplete();
  };

  const handleStartVideo = () => {
    setVideoStarted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  if (!showIntro) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {!videoStarted ? (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-serif text-orange-400 mb-8 drop-shadow-lg">
            Welcome to the Yellow Brick Road
          </h2>
          <button
            onClick={handleStartVideo}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
          >
            Begin Your Journey
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            playsInline
            autoPlay
          />
          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-300"
          >
            Skip Intro
          </button>
        </>
      )}
    </div>
  );
};

export default VideoIntro;
