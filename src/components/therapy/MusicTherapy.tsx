import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Music, Brain, Heart, Waves, Sun, Moon } from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  description: string;
  purpose: string;
  icon: React.ElementType;
  frequency?: string;
  duration: string;
  // In production, these would be real URLs to therapeutic audio
  placeholder: boolean;
}

const tracks: AudioTrack[] = [
  {
    id: 'binaural-calm',
    title: 'Binaural Calm',
    description: 'Alpha waves (8-12 Hz) for relaxation',
    purpose: 'Emotional Regulation',
    icon: Waves,
    frequency: '10 Hz Alpha',
    duration: '10 min',
    placeholder: true,
  },
  {
    id: 'focus-rhythm',
    title: 'Focus Rhythm',
    description: 'Beta waves for attention enhancement',
    purpose: 'Attention Training',
    icon: Brain,
    frequency: '15 Hz Beta',
    duration: '15 min',
    placeholder: true,
  },
  {
    id: 'morning-energy',
    title: 'Morning Energy',
    description: 'Uplifting rhythms for activation',
    purpose: 'Energy & Motivation',
    icon: Sun,
    duration: '8 min',
    placeholder: true,
  },
  {
    id: 'evening-wind-down',
    title: 'Evening Wind Down',
    description: 'Theta waves for deep relaxation',
    purpose: 'Sleep Preparation',
    icon: Moon,
    frequency: '6 Hz Theta',
    duration: '20 min',
    placeholder: true,
  },
  {
    id: 'heart-coherence',
    title: 'Heart Coherence',
    description: 'Rhythmic breathing synchronization',
    purpose: 'Stress Reduction',
    icon: Heart,
    duration: '5 min',
    placeholder: true,
  },
];

const MusicTherapy = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulated playback for demo (in production, use real audio files)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const playTrack = (trackId: string) => {
    if (currentTrack === trackId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const activeTrack = tracks.find(t => t.id === currentTrack);

  return (
    <div className="space-y-6">
      {/* INCOG Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          <Music className="w-3 h-3 mr-1" />
          INCOG 2.0 Level A Evidence
        </Badge>
        <span className="text-sm text-muted-foreground">Music & Rhythm Therapy</span>
      </div>

      {/* Now Playing */}
      {activeTrack && (
        <Card className="bg-gradient-to-br from-purple-500/20 to-orange-500/10 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full bg-orange-500/20 ${isPlaying ? 'animate-pulse' : ''}`}>
                <activeTrack.icon className="w-8 h-8 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{activeTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{activeTrack.purpose}</p>
                {activeTrack.frequency && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {activeTrack.frequency}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track List */}
      <div className="grid gap-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          const isActive = currentTrack === track.id;
          const isCurrentlyPlaying = isActive && isPlaying;

          return (
            <Card
              key={track.id}
              className={`cursor-pointer transition-all hover:border-orange-500/50 ${
                isActive ? 'border-orange-500 bg-orange-500/5' : ''
              }`}
              onClick={() => playTrack(track.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    isActive ? 'bg-orange-500 text-white' : 'bg-muted'
                  }`}>
                    {isCurrentlyPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{track.title}</h4>
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {track.purpose}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Music & Rhythm Therapy</strong> uses structured auditory stimulation to support 
            cognitive recovery. Binaural beats and rhythmic entrainment can help with attention, 
            emotional regulation, and relaxation—key components of TBI rehabilitation per INCOG 2.0 guidelines.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Note: For full therapeutic benefit, real audio assets would be integrated with licensed 
            therapeutic compositions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
