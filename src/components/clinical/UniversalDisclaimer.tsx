import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, CheckCircle2, FileText, Flame, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UniversalDisclaimerProps {
  onAcknowledge: () => void;
  onSkip?: () => void;
  videoSrc?: string;
  audioSrc?: string;
}

const CONSENT_KEY = 'phoenix_legal_disclaimer_acknowledged';

interface StoredConsent {
  acknowledged: boolean;
  timestamp: number;
  method: 'video' | 'audio' | 'read';
  version: string;
}

export const hasValidConsent = (): boolean => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    const consent: StoredConsent = JSON.parse(stored);
    return consent.acknowledged === true;
  } catch {
    return false;
  }
};

export const clearConsent = (): void => {
  localStorage.removeItem(CONSENT_KEY);
};

const UniversalDisclaimer: React.FC<UniversalDisclaimerProps> = ({
  onAcknowledge,
  onSkip,
  videoSrc,
  audioSrc = '/audio/disclaimer.mp3',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasListened, setHasListened] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const useVideo = !!videoSrc;
  const mediaRef = useVideo ? videoRef : audioRef;

  useEffect(() => {
    const media = useVideo 
      ? new Audio() // Video handled differently
      : new Audio(audioSrc);
    
    if (!useVideo) {
      audioRef.current = media;
      
      media.addEventListener('loadedmetadata', () => {
        setDuration(media.duration);
        setMediaReady(true);
      });
      
      media.addEventListener('timeupdate', () => {
        setProgress((media.currentTime / media.duration) * 100);
        if (media.currentTime / media.duration > 0.9) {
          setHasListened(true);
        }
      });
      
      media.addEventListener('ended', () => {
        setIsPlaying(false);
        setHasListened(true);
      });

      media.addEventListener('error', () => {
        setMediaReady(false);
        setShowTranscript(true);
      });
    }

    return () => {
      media.pause();
      media.src = '';
    };
  }, [audioSrc, useVideo]);

  const togglePlay = () => {
    const media = audioRef.current;
    if (!media) return;
    
    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    const media = audioRef.current;
    if (!media) return;
    media.currentTime = 0;
    setProgress(0);
    media.play();
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcknowledge = () => {
    const consent: StoredConsent = {
      acknowledged: true,
      timestamp: Date.now(),
      method: hasListened ? 'audio' : 'read',
      version: '1.0',
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    onAcknowledge();
  };

  const handleReadOnly = () => {
    setShowTranscript(true);
    setHasListened(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-900/90 border-orange-500/30 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Phoenix Header */}
            <div className="text-center mb-6">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Flame className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                Important Information
              </h2>
              <p className="text-orange-300/70 text-sm">
                Please listen to this brief disclaimer before beginning your journey
              </p>
            </div>

            {/* Audio Player */}
            {!useVideo && mediaReady && (
              <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-orange-500/20">
                <div className="flex items-center gap-4 mb-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                  
                  <div className="flex-1">
                    <Progress value={progress} className="h-2 bg-slate-700" />
                    <div className="flex justify-between text-xs text-orange-300/60 mt-1">
                      <span>{formatTime((progress / 100) * duration)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-orange-400 hover:text-orange-300"
                    onClick={restart}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
                
                {hasListened && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-green-400 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Listened</span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Read Option */}
            {!showTranscript && (
              <button
                onClick={handleReadOnly}
                className="w-full mb-4 text-center text-orange-400/70 hover:text-orange-300 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Prefer to read instead
              </button>
            )}

            {/* Transcript */}
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 max-h-60 overflow-y-auto"
              >
                <p className="text-sm text-slate-300 leading-relaxed">
                  Welcome to Phoenix TBI. This app is for informational and educational purposes only and should not be considered medical advice. 
                  Always consult qualified medical professionals before beginning any health-related activities. 
                  Phoenix TBI is not responsible for any adverse outcomes from using this app. 
                  By continuing, you acknowledge that you understand these terms and accept full responsibility for your health decisions.
                  This app contains therapeutic exercises that may not be suitable for everyone. 
                  If you experience any discomfort, dizziness, or concerning symptoms, please stop immediately and consult a healthcare provider.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAcknowledge}
                disabled={!hasListened && !showTranscript}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                I Acknowledge & Agree
              </Button>
              
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="w-full text-center text-slate-500 hover:text-slate-400 text-sm transition-colors"
                >
                  Return Home
                </button>
              )}
            </div>

            {/* Legal Note */}
            <p className="text-center text-slate-500 text-xs mt-4">
              Your acknowledgment will be remembered on this device
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UniversalDisclaimer;
