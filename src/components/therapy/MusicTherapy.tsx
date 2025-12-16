import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Play, Pause, Volume2, VolumeX, Heart, Waves, Moon, Brain, Sparkles, TreePine } from 'lucide-react';
import EvidenceBadge from '@/components/clinical/EvidenceBadge';
import { useAudio, AMBIENT_SOUNDS, SoundCategory } from '@/contexts/AudioContext';

const categoryInfo: Record<SoundCategory, { icon: React.ElementType; description: string }> = {
  nature: { 
    icon: Waves, 
    description: "Nature sounds for grounding and relaxation" 
  },
  binaural: { 
    icon: Brain, 
    description: "Brainwave entrainment (use headphones)" 
  },
  therapeutic: { 
    icon: Heart, 
    description: "Solfeggio frequencies for healing" 
  },
};

const MusicTherapy = () => {
  const [activeCategory, setActiveCategory] = useState<SoundCategory>("nature");
  const { activeSounds, globalVolume, toggleSound, setGlobalVolume, isAudiobookPlaying } = useAudio();

  const soundsByCategory = Object.entries(AMBIENT_SOUNDS).reduce((acc, [id, sound]) => {
    if (!acc[sound.category]) acc[sound.category] = [];
    acc[sound.category].push({ id, ...sound });
    return acc;
  }, {} as Record<SoundCategory, (typeof AMBIENT_SOUNDS[string] & { id: string })[]>);

  const playTrack = async (soundId: string) => {
    await toggleSound(soundId);
  };

  const handleVolumeChange = (value: number[]) => {
    setGlobalVolume(value[0] / 100);
  };

  const getIcon = (sound: typeof AMBIENT_SOUNDS[string]) => {
    if (sound.noiseType === "pink" && sound.id === "ocean") return Waves;
    if (sound.noiseType === "brown") return TreePine;
    if (sound.beatFrequency) return Brain;
    if (sound.toneFrequency) return Sparkles;
    return Waves;
  };

  return (
    <div className="space-y-6">
      <EvidenceBadge
        level="A"
        domain="Music & Rhythm Therapy"
        description="Binaural beats, nature sounds, and therapeutic frequencies support cognitive and emotional recovery after TBI."
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
              value={[globalVolume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">{Math.round(globalVolume * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as SoundCategory)}>
        <TabsList className="w-full">
          {(Object.keys(categoryInfo) as SoundCategory[]).map(cat => {
            const Icon = categoryInfo[cat].icon;
            return (
              <TabsTrigger key={cat} value={cat} className="flex-1 gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(categoryInfo) as SoundCategory[]).map(category => (
          <TabsContent key={category} value={category} className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              {categoryInfo[category].description}
            </p>

            {soundsByCategory[category]?.map((sound) => {
              const Icon = getIcon(sound);
              const isActive = activeSounds.has(sound.id);
              const isPlaying = isActive && !isAudiobookPlaying;

              return (
                <Card
                  key={sound.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    isActive ? 'border-primary bg-primary/5' : ''
                  } ${isAudiobookPlaying ? 'opacity-50' : ''}`}
                  onClick={() => !isAudiobookPlaying && playTrack(sound.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${sound.color} ${
                        isPlaying ? 'animate-pulse' : ''
                      }`}>
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{sound.name}</h4>
                          {sound.incogLevel && (
                            <Badge variant="outline" className="text-xs">
                              Level {sound.incogLevel}
                            </Badge>
                          )}
                          {sound.beatFrequency && (
                            <Badge variant="secondary" className="text-xs">
                              {sound.beatFrequency}Hz beat
                            </Badge>
                          )}
                          {sound.toneFrequency && (
                            <Badge variant="secondary" className="text-xs">
                              {sound.toneFrequency}Hz
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{sound.description}</p>
                        {sound.therapeuticUse && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {sound.therapeuticUse.slice(0, 3).map(use => (
                              <span key={use} className="text-xs text-primary/70">#{use}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Sound Therapy</strong> uses auditory stimulation for cognitive and emotional recovery. 
            Nature sounds provide grounding, binaural beats entrain brainwaves for focus/calm, 
            and Solfeggio frequencies support holistic healing—all aligned with INCOG 2.0 guidelines.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
