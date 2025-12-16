import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  soundId: string; // Maps to AMBIENT_SOUNDS
}

const tracks: AudioTrack[] = [
  {
    id: 'binaural-calm',
    title: 'Alpha Serenity',
    description: 'Alpha waves (8-12 Hz) for relaxation',
    purpose: 'Emotional Regulation',
    icon: Waves,
    frequency: '10 Hz Alpha',
    soundId: 'alphaCalm',
  },
  {
    id: 'focus-rhythm',
    title: 'Beta Focus',
    description: 'Beta waves for attention enhancement',
    purpose: 'Attention Training',
    icon: Brain,
    frequency: '18 Hz Beta',
    soundId: 'betaFocus',
  },
  {
    id: 'theta-balance',
    title: 'Theta Balance',
    description: 'Theta waves for vestibular calm',
    purpose: 'Balance & Grounding',
    icon: Sparkles,
    frequency: '7 Hz Theta',
    soundId: 'thetaVertigo',
  },
  {
    id: 'tibetan-resonance',
    title: 'Tibetan Resonance',
    description: '432Hz bowls for mental clarity',
    purpose: 'Meditation & Clarity',
    icon: Moon,
    frequency: '432 Hz',
    soundId: 'mind',
  },
  {
    id: 'heart-coherence',
    title: 'Heart Coherence',
    description: 'Soft melodies for emotional healing',
    purpose: 'Stress Reduction',
    icon: Heart,
    soundId: 'heart',
  },
  {
    id: 'neural-flow',
    title: 'Neural Flow',
    description: 'Ambient tones for cognitive training',
    purpose: 'Neuroplasticity',
    icon: Sun,
    soundId: 'computer',
  },
];

const MusicTherapy = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const { activeSounds, globalVolume, toggleSound, setGlobalVolume, isAudiobookPlaying } = useAudio();

  const playTrack = async (track: AudioTrack) => {
    // If this track is playing, pause it
    if (activeSounds.has(track.soundId)) {
      await toggleSound(track.soundId);
      setCurrentTrack(null);
    } else {
      // Stop any other playing tracks from this list first
      for (const t of tracks) {
        if (activeSounds.has(t.soundId) && t.soundId !== track.soundId) {
          await toggleSound(t.soundId);
        }
      }
      // Play the new track
      await toggleSound(track.soundId);
      setCurrentTrack(track.id);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setGlobalVolume(value[0] / 100);
  };

  const activeTrack = tracks.find(t => t.id === currentTrack);
  const isPlaying = activeTrack ? activeSounds.has(activeTrack.soundId) : false;

  return (
    <div className="space-y-6">
      {/* INCOG Evidence Badge */}
      <EvidenceBadge
        level="A"
        domain="Music & Rhythm Therapy"
        description="Rhythmic auditory stimulation and music therapy improve motor, cognitive, and emotional outcomes after TBI."
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
            {/* Playing indicator */}
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
                style={{ width: isPlaying ? '100%' : '0%' }}
              />
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

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Music & Rhythm Therapy</strong> uses structured auditory stimulation to support 
            cognitive recovery. Binaural beats and rhythmic entrainment can help with attention, 
            emotional regulation, and relaxation—key components of TBI rehabilitation per INCOG 2.0 guidelines.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;