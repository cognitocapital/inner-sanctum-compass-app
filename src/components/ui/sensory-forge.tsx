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
    recommendedSounds: ["thetaVertigo", "circle"],
    manuscriptRef: "Ch4: 'The vertigo slowly subsides...'"
  },
  {
    id: "anxiety",
    label: "Anxiety / Overwhelm",
    icon: Heart,
    description: "Racing thoughts, tension, or emotional flooding",
    recommendedSounds: ["alphaCalm", "breath", "heart"],
    manuscriptRef: "Ch3: The roller coaster of anxiety"
  },
  {
    id: "fatigue",
    label: "Cognitive Fatigue",
    icon: Brain,
    description: "Mental exhaustion, brain fog, or difficulty thinking",
    recommendedSounds: ["mind", "circle", "alphaCalm"],
    manuscriptRef: "The journey of rebuilding mental stamina"
  },
  {
    id: "focus",
    label: "Attention / Focus Issues",
    icon: Zap,
    description: "Difficulty concentrating or staying on task",
    recommendedSounds: ["betaFocus", "computer"],
    manuscriptRef: "Training the mind to focus again"
  },
  {
    id: "sensory",
    label: "Sensory Sensitivity",
    icon: Ear,
    description: "Overwhelmed by sounds, lights, or stimulation",
    recommendedSounds: ["thetaVertigo", "breath"],
    manuscriptRef: "Ch4: Loss of taste and smell... slow comeback"
  },
  {
    id: "emotional",
    label: "Emotional Dysregulation",
    icon: Wind,
    description: "Mood swings or difficulty managing emotions",
    recommendedSounds: ["heart", "alphaCalm", "mind"],
    manuscriptRef: "Heart-centered healing and gratitude"
  }
];

export const SensoryForge = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { toggleSound, activeSounds } = useAudio();

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
    
    return Object.entries(soundScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id);
  };

  const recommendedSounds = getRecommendedSounds();
  const selectedSymptomsList = symptoms.filter(s => selectedSymptoms.has(s.id));

  return (
    <div className="space-y-6">
      {/* Header with Evidence Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Phoenix Sensory Forge</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Personalized Soundscape Therapy
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Select your current symptoms to receive evidence-based sound recommendations 
          tailored to your recovery needs.
        </p>
      </div>

      <EvidenceBadge
        level="A"
        domain="Music & Rhythm Therapy"
        description="Binaural beats and rhythmic auditory stimulation improve attention, executive function, and emotional regulation after TBI."
        pubmedId="32180108"
      />

      {/* Symptom Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {symptoms.map(symptom => {
          const Icon = symptom.icon;
          const isSelected = selectedSymptoms.has(symptom.id);
          
          return (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                isSelected
                  ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                  : "bg-card hover:bg-accent/50 border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {symptom.label}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {symptom.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <CheckCircle2 className="h-4 w-4 text-primary absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Get Recommendations Button */}
      {selectedSymptoms.size > 0 && !showRecommendations && (
        <Button
          onClick={() => setShowRecommendations(true)}
          className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get Personalized Soundscape ({selectedSymptoms.size} symptom{selectedSymptoms.size > 1 ? 's' : ''})
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}

      {/* Recommendations */}
      {showRecommendations && recommendedSounds.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-orange-500/5">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Your Personalized Soundscape</h4>
            </div>
            
            {/* Manuscript Quanta Prompt */}
            {selectedSymptomsList[0]?.manuscriptRef && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Reflection from "What a Journey"
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 italic mt-1">
                      "{selectedSymptomsList[0].manuscriptRef}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Sounds */}
            <div className="space-y-2">
              {recommendedSounds.map((soundId, index) => {
                const sound = AMBIENT_SOUNDS[soundId];
                if (!sound) return null;
                
                const isActive = activeSounds.has(soundId);
                
                return (
                  <button
                    key={soundId}
                    onClick={() => toggleSound(soundId)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      isActive
                        ? "bg-primary/20 border border-primary/50 ring-2 ring-primary/30"
                        : "bg-background/50 hover:bg-background border border-border"
                    )}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br text-white font-bold text-sm shrink-0"
                      style={{ 
                        background: index === 0 
                          ? 'linear-gradient(135deg, #f97316, #ea580c)' 
                          : index === 1 
                            ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                            : 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{sound.name}</p>
                        {sound.incogLevel && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            INCOG {sound.incogLevel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {sound.description}
                      </p>
                      {sound.frequency && (
                        <span className="text-xs text-primary/80">{sound.frequency}</span>
                      )}
                    </div>
                    <Badge 
                      variant={isActive ? "default" : "secondary"}
                      className={cn(isActive && "bg-primary")}
                    >
                      {isActive ? "Playing" : "Play"}
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Play multiple sounds together to create your personalized healing soundscape. 
                Sounds will automatically pause when the audiobook is playing.
              </p>
            </div>

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSymptoms(new Set());
                setShowRecommendations(false);
              }}
              className="w-full"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SensoryForge;
