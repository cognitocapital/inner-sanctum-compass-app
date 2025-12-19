import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';
import EvidenceBadge from '@/components/clinical/EvidenceBadge';
import { useAudio, AMBIENT_SOUNDS } from '@/contexts/AudioContext';

const MusicTherapy = () => {
  const { activeSound, volume, isPlaying, toggleSound, setVolume, isAudiobookPlaying } = useAudio();

  const playTrack = (soundId: string) => {
    toggleSound(soundId);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="space-y-6">
      <EvidenceBadge
        level="A"
        domain="Music & Sound Therapy"
        description="Ancient healing instruments support cognitive and emotional recovery after TBI per INCOG 2.0."
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

      {/* Volume Control */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">{Math.round(volume * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Sound Grid */}
      <div className="grid grid-cols-2 gap-3">
        {AMBIENT_SOUNDS.map((sound) => {
          const isActive = activeSound === sound.id && isPlaying;

          return (
            <Card
              key={sound.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                isActive ? 'border-primary bg-primary/5' : ''
              } ${isAudiobookPlaying ? 'opacity-50' : ''}`}
              onClick={() => !isAudiobookPlaying && playTrack(sound.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 ${
                    isActive ? 'animate-pulse' : ''
                  }`}>
                    {isActive ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{sound.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{sound.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Therapeutic Sound</strong> — Curated healing instruments aligned with INCOG 2.0 guidelines for cognitive and emotional recovery.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
