import { useState } from "react";
import { 
  Brain, Heart, Eye, Ear, Wind, Zap, 
  ChevronRight, CheckCircle2, AlertCircle,
  Sparkles, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAudio, AMBIENT_SOUNDS } from "@/contexts/AudioContext";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";

interface SymptomOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  recommendedSounds: string[];
  manuscriptRef?: string;
}

const symptoms: SymptomOption[] = [
  {
    id: "vertigo",
    label: "Vertigo / Balance Issues",
    icon: Eye,
    description: "Dizziness, unsteadiness, or spinning sensations",
    recommendedSounds: ["tibetanBowl", "crystalBowl"],
    manuscriptRef: "Ch4: 'The vertigo slowly subsides...'"
  },
  {
    id: "anxiety",
    label: "Anxiety / Overwhelm",
    icon: Heart,
    description: "Racing thoughts, tension, or emotional flooding",
    recommendedSounds: ["forestStream", "oceanWaves"],
    manuscriptRef: "Ch3: The roller coaster of anxiety"
  },
  {
    id: "fatigue",
    label: "Cognitive Fatigue",
    icon: Brain,
    description: "Mental exhaustion, brain fog, or difficulty thinking",
    recommendedSounds: ["kalimba", "chimes"],
    manuscriptRef: "The journey of rebuilding mental stamina"
  },
  {
    id: "focus",
    label: "Attention / Focus Issues",
    icon: Zap,
    description: "Difficulty concentrating or staying on task",
    recommendedSounds: ["hangDrum", "bambooFlute"],
    manuscriptRef: "Training the mind to focus again"
  },
  {
    id: "sensory",
    label: "Sensory Sensitivity",
    icon: Ear,
    description: "Overwhelmed by sounds, lights, or stimulation",
    recommendedSounds: ["forestStream", "oceanWaves"],
    manuscriptRef: "Ch4: Loss of taste and smell... slow comeback"
  },
  {
    id: "emotional",
    label: "Emotional Dysregulation",
    icon: Wind,
    description: "Mood swings or difficulty managing emotions",
    recommendedSounds: ["crystalBowl", "kalimba"],
    manuscriptRef: "Heart-centered healing and gratitude"
  }
];

export const SensoryForge = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { toggleSound, activeSound, isPlaying } = useAudio();

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(symptomId)) {
        next.delete(symptomId);
      } else {
        next.add(symptomId);
      }
      return next;
    });
    setShowRecommendations(false);
  };

  const getRecommendedSounds = (): string[] => {
    const soundScores: Record<string, number> = {};
    
    selectedSymptoms.forEach(symptomId => {
      const symptom = symptoms.find(s => s.id === symptomId);
      symptom?.recommendedSounds.forEach((soundId, index) => {
        // Higher score for first recommendations
        soundScores[soundId] = (soundScores[soundId] || 0) + (3 - index);
      });
    });
    
    // Sort by score and return top 3
    return Object.entries(soundScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
  };

  const recommendedSoundIds = getRecommendedSounds();
  const recommendedSounds = recommendedSoundIds
    .map(id => AMBIENT_SOUNDS.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <EvidenceBadge
        level="A"
        domain="Sensory Modulation"
        description="Targeted sound therapy for TBI symptoms"
        pubmedId="32180108"
      />

      {/* Symptom Selection */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">
          Select your current symptoms:
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {symptoms.map((symptom) => {
            const Icon = symptom.icon;
            const isSelected = selectedSymptoms.has(symptom.id);
            
            return (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn(
                    "h-4 w-4",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-sm font-medium">{symptom.label}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {symptom.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Get Recommendations Button */}
      {selectedSymptoms.size > 0 && !showRecommendations && (
        <Button 
          onClick={() => setShowRecommendations(true)}
          className="w-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get Sound Recommendations
        </Button>
      )}

      {/* Recommendations */}
      {showRecommendations && recommendedSounds.length > 0 && (
        <Card className="border-primary/30">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Recommended for You
            </h3>
            <div className="space-y-2">
              {recommendedSounds.map((sound) => {
                if (!sound) return null;
                const isSoundPlaying = activeSound === sound.id && isPlaying;
                
                return (
                  <button
                    key={sound.id}
                    onClick={() => toggleSound(sound.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border flex items-center gap-3 transition-all text-left",
                      isSoundPlaying
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">{sound.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{sound.name}</p>
                      <p className="text-xs text-muted-foreground">{sound.description}</p>
                    </div>
                    {isSoundPlaying && (
                      <Badge variant="secondary" className="animate-pulse">
                        Playing
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
