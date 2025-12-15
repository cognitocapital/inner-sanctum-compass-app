import { useState } from "react";
import { Volume2, VolumeX, Music, ChevronDown, Sparkles, Waves, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAudio, AMBIENT_SOUNDS, SoundCategory } from "@/contexts/AudioContext";

const categoryIcons: Record<SoundCategory, React.ElementType> = {
  nature: Waves,
  binaural: Brain,
  therapeutic: Heart
};

const categoryLabels: Record<SoundCategory, string> = {
  nature: "Nature",
  binaural: "Binaural",
  therapeutic: "Therapy"
};

export const GlobalAmbientControl = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<SoundCategory>("binaural");
  const { 
    activeSounds, 
    globalVolume, 
    toggleSound, 
    setGlobalVolume,
    isAudiobookPlaying 
  } = useAudio();

  const soundsByCategory = Object.entries(AMBIENT_SOUNDS).reduce((acc, [id, sound]) => {
    if (!acc[sound.category]) acc[sound.category] = [];
    acc[sound.category].push({ id, ...sound });
    return acc;
  }, {} as Record<SoundCategory, (typeof AMBIENT_SOUNDS[string] & { id: string })[]>);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-3 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl animate-fade-in w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Phoenix Soundscapes
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 text-white/60 hover:text-white"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          {isAudiobookPlaying && (
            <div className="mb-4 p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <p className="text-xs text-orange-200 flex items-center gap-2">
                <Volume2 className="h-3 w-3 animate-pulse" />
                Paused while audiobook plays
              </p>
            </div>
          )}

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SoundCategory)} className="mb-3">
            <TabsList className="w-full bg-white/5 p-1">
              {(Object.keys(categoryLabels) as SoundCategory[]).map(cat => {
                const Icon = categoryIcons[cat];
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="flex-1 text-xs data-[state=active]:bg-primary/30"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {categoryLabels[cat]}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          
          <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
            {soundsByCategory[activeTab]?.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                disabled={isAudiobookPlaying}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                  activeSounds.has(sound.id)
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-white/5 hover:bg-white/10 border border-transparent",
                  isAudiobookPlaying && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br shrink-0",
                    sound.color,
                    activeSounds.has(sound.id) && "animate-pulse shadow-lg"
                  )}
                >
                  {activeSounds.has(sound.id) ? (
                    <Volume2 className="h-5 w-5 text-white" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-white/70" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{sound.name}</p>
                    {sound.incogLevel && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-primary/50 text-primary">
                        {sound.incogLevel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/50 truncate">{sound.description}</p>
                  {sound.frequency && (
                    <span className="text-[10px] text-primary/80">{sound.frequency}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Master Volume */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-white/60 shrink-0" />
              <Slider
                value={[globalVolume]}
                onValueChange={(v) => setGlobalVolume(v[0])}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-white/60 w-8 text-right">
                {Math.round(globalVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "rounded-full w-14 h-14 shadow-2xl transition-all hover:scale-110",
          activeSounds.size > 0
            ? "bg-gradient-to-br from-primary to-orange-600 ring-2 ring-primary/50 ring-offset-2 ring-offset-black"
            : "bg-gradient-to-br from-gray-700 to-gray-900 hover:from-primary hover:to-orange-600",
          isAudiobookPlaying && activeSounds.size === 0 && "opacity-60"
        )}
      >
        {isExpanded ? (
          <ChevronDown className="h-6 w-6" />
        ) : activeSounds.size > 0 ? (
          <Volume2 className="h-6 w-6 animate-pulse" />
        ) : (
          <Music className="h-6 w-6" />
        )}
      </Button>
      
      {/* Active sound indicator */}
      {activeSounds.size > 0 && !isExpanded && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
          {activeSounds.size}
        </div>
      )}
    </div>
  );
};
