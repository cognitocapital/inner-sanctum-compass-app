import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Play, Pause, Volume2, Sparkles, Waves, Brain, Music } from 'lucide-react';
import EvidenceBadge from '@/components/clinical/EvidenceBadge';
import { useAudio, AMBIENT_SOUNDS, SoundCategory } from '@/contexts/AudioContext';

const categoryInfo: Record<SoundCategory, { icon: React.ElementType; description: string }> = {
  sacred: { 
    icon: Sparkles, 
    description: "Ancient healing instruments: Tibetan bowls, crystal bowls, gongs & bells" 
  },
  nature: { 
    icon: Waves, 
    description: "Authentic nature recordings & traditional wind instruments" 
  },
  binaural: { 
    icon: Brain, 
    description: "Precision brainwave entrainment with warm undertones (use headphones)" 
  },
};

const MusicTherapy = () => {
  const [activeCategory, setActiveCategory] = useState<SoundCategory>("sacred");
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
    if (sound.category === "sacred") return Sparkles;
    if (sound.category === "nature") return Waves;
    if (sound.beatFrequency) return Brain;
    return Music;
  };

  return (
    <div className="space-y-6">
      <EvidenceBadge
        level="A"
        domain="Sound Healing Therapy"
        description="Ancient healing instruments and nature soundscapes support cognitive and emotional recovery after TBI. Real acoustic recordings provide authentic therapeutic benefit."
        pubmedId="32180108"
      />

      {isAudiobookPlaying && (
        <Card className="bg-orange-500/20 border-orange-500/30">
          <CardContent className="py-3">
            <p className="text-sm text-orange-200 flex items-center gap-2">
              <Volume2 className="h-4 w-4 animate-pulse" />
              Sound therapy paused while audiobook plays
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
            const label = cat === "sacred" ? "Sacred" : cat === "nature" ? "Nature" : "Binaural";
            return (
              <TabsTrigger key={cat} value={cat} className="flex-1 gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
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
                          {sound.instrument && (
                            <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
                              {sound.instrument}
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
            <strong>Authentic Sound Healing</strong> uses real recordings of ancient healing instruments 
            and nature soundscapes. Tibetan singing bowls, crystal bowls, temple gongs, and native flutes—
            all recorded from genuine instruments. Binaural beats remain synthesized for mathematical precision. 
            Aligned with INCOG 2.0 guidelines for cognitive rehabilitation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
