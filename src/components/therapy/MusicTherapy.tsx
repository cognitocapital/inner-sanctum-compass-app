import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Heart, Waves, Sun, Moon, Brain, Sparkles } from 'lucide-react';
import EvidenceBadge from '@/components/clinical/EvidenceBadge';
import { useAudio, AMBIENT_SOUNDS } from '@/contexts/AudioContext';

interface AudioTrack {
  id: string;
  title: string;
  description: string;
  purpose: string;
  icon: React.ElementType;
  frequency?: string;
  soundId: string;
}

const tracks: AudioTrack[] = [
  {
    id: 'alpha-calm',
    title: 'Alpha Serenity',
    description: 'Alpha waves (10Hz) for relaxation',
    purpose: 'Emotional Regulation',
    icon: Waves,
    frequency: '10 Hz Alpha',
    soundId: 'alphaCalm',
  },
  {
    id: 'beta-focus',
    title: 'Beta Focus',
    description: 'Beta waves (18Hz) for attention',
    purpose: 'Attention Training',
    icon: Brain,
    frequency: '18 Hz Beta',
    soundId: 'betaFocus',
  },
  {
    id: 'theta-balance',
    title: 'Theta Balance',
    description: 'Theta waves (7Hz) for vestibular calm',
    purpose: 'Balance & Grounding',
    icon: Sparkles,
    frequency: '7 Hz Theta',
    soundId: 'thetaVertigo',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'Low alpha (8Hz) for mental clarity',
    purpose: 'Meditation & Clarity',
    icon: Moon,
    frequency: '8 Hz',
    soundId: 'mind',
  },
  {
    id: 'heart-coherence',
    title: 'Heart Coherence',
    description: 'Delta-theta (5Hz) for emotional healing',
    purpose: 'Stress Reduction',
    icon: Heart,
    frequency: '5 Hz',
    soundId: 'heart',
  },
  {
    id: 'neural-flow',
    title: 'Neural Flow',
    description: 'High alpha (12Hz) for cognitive training',
    purpose: 'Neuroplasticity',
    icon: Sun,
    frequency: '12 Hz',
    soundId: 'computer',
  },
];

const MusicTherapy = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const { activeSounds, globalVolume, toggleSound, setGlobalVolume, isAudiobookPlaying } = useAudio();

  const playTrack = async (track: AudioTrack) => {
    // Stop any other playing tracks first
    for (const t of tracks) {
      if (activeSounds.has(t.soundId) && t.soundId !== track.soundId) {
        await toggleSound(t.soundId);
      }
    }
    
    // Toggle the selected track
    await toggleSound(track.soundId);
    setCurrentTrack(activeSounds.has(track.soundId) ? null : track.id);
  };

  const handleVolumeChange = (value: number[]) => {
    setGlobalVolume(value[0] / 100);
  };

  const activeTrack = tracks.find(t => activeSounds.has(t.soundId));
  const isPlaying = !!activeTrack;

  return (
    <div className="space-y-6">
      <EvidenceBadge
        level="A"
        domain="Music & Rhythm Therapy"
        description="Binaural beats and rhythmic stimulation improve cognitive and emotional outcomes after TBI."
        pubmedId="32180108"
      />

      {isAudiobookPlaying && (
        <Card className="bg-orange-500/20 border-orange-500/30">
          <CardContent className="py-3">
            <p className="text-sm text-orange-200 flex items-center gap-2">
              <Volume2 className="h-4 w-4 animate-pulse" />
              Music paused while audiobook plays
            </p>
          </CardContent>
        </Card>
      )}

      {/* Now Playing */}
      {activeTrack && !isAudiobookPlaying && (
        <Card className="bg-gradient-to-br from-purple-500/20 to-orange-500/10 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-orange-500/20 animate-pulse">
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
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={[globalVolume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-orange-500 animate-pulse w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track List */}
      <div className="grid gap-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          const isActive = activeSounds.has(track.soundId);
          const isCurrentlyPlaying = isActive && !isAudiobookPlaying;

          return (
            <Card
              key={track.id}
              className={`cursor-pointer transition-all hover:border-orange-500/50 ${
                isActive ? 'border-orange-500 bg-orange-500/5' : ''
              } ${isAudiobookPlaying ? 'opacity-50' : ''}`}
              onClick={() => !isAudiobookPlaying && playTrack(track)}
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
                      {track.frequency && (
                        <span className="text-xs text-muted-foreground">{track.frequency}</span>
                      )}
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

      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Binaural Beat Therapy</strong> uses precise frequency differences between ears 
            to create brainwave entrainment. Use headphones for best effect. These tones support 
            attention, emotional regulation, and relaxation—key INCOG 2.0 therapeutic goals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;