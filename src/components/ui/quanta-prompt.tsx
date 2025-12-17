import { useState } from "react";
import { Quote, ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ModuleKey } from "@/lib/design-tokens";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

interface QuantaPromptProps {
  quote: string;
  chapter?: string;
  reflection?: string;
  module?: ModuleKey;
  audioUrl?: string;
  expandable?: boolean;
  className?: string;
}

// Curated manuscript quanta for each module
export const moduleQuanta: Record<ModuleKey, { quote: string; chapter: string; reflection?: string }[]> = {
  breath: [
    { 
      quote: "Each breath became a conscious act of survival, a reminder that I was still here.",
      chapter: "Chapter 4",
      reflection: "What does your breath tell you about this moment?"
    },
    { 
      quote: "In the silence between breaths, I found a peace I never knew existed.",
      chapter: "Prologue",
      reflection: "Notice the pause. What lives there?"
    },
  ],
  ice: [
    { 
      quote: "The cold stripped away everything except the present moment.",
      chapter: "Chapter 7",
      reflection: "What do you need to release today?"
    },
    { 
      quote: "Like the phoenix, sometimes we must feel the burn to rise again.",
      chapter: "Introduction",
      reflection: "What transformation awaits you?"
    },
  ],
  mind: [
    { 
      quote: "My brain, once my greatest asset, had become a puzzle I needed to solve.",
      chapter: "Chapter 2",
      reflection: "What pattern are you noticing today?"
    },
    { 
      quote: "Every small victory in cognition was a step back to myself.",
      chapter: "Chapter 5",
      reflection: "Celebrate the small wins."
    },
  ],
  heart: [
    { 
      quote: "The tears of gratitude that flowed were different—they healed rather than hurt.",
      chapter: "Chapter 3",
      reflection: "What unexpected gift appeared today?"
    },
    { 
      quote: "The human spirit, I discovered, is far more resilient than we ever imagine.",
      chapter: "Prologue",
      reflection: "What strength surprised you recently?"
    },
  ],
  arsenal: [
    { 
      quote: "Recovery isn't linear—it's a spiral, always moving, sometimes returning.",
      chapter: "Chapter 8",
      reflection: "Trust the process, even when it circles back."
    },
    { 
      quote: "The tools I gathered became my arsenal against the darkness.",
      chapter: "Chapter 6",
      reflection: "Which tool serves you best today?"
    },
  ],
  circle: [
    { 
      quote: "In sharing our stories, we discovered we were never alone.",
      chapter: "Introduction",
      reflection: "Whose story resonates with yours?"
    },
    { 
      quote: "The community became my lifeline, each connection a thread of hope.",
      chapter: "Chapter 10",
      reflection: "Who can you reach out to today?"
    },
  ],
};

export const QuantaPrompt = ({
  quote,
  chapter,
  reflection,
  module,
  audioUrl,
  expandable = true,
  className,
}: QuantaPromptProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAccentColor = () => {
    if (!module) return "text-orange-400 border-orange-500/20";
    
    const colors: Record<ModuleKey, string> = {
      breath: "text-orange-400 border-orange-500/20",
      ice: "text-cyan-400 border-cyan-500/20",
      mind: "text-purple-400 border-purple-500/20",
      heart: "text-rose-400 border-rose-500/20",
      arsenal: "text-blue-400 border-blue-500/20",
      circle: "text-amber-400 border-amber-500/20",
    };
    
    return colors[module];
  };

  const handleAudioPlay = () => {
    if (audioUrl) {
      // Toggle audio playback
      setIsPlaying(!isPlaying);
      // Audio playback logic would go here
    }
  };

  return (
    <GlassCard
      variant="subtle"
      module={module}
      className={cn("overflow-hidden", className)}
    >
      <div className="p-4 sm:p-5">
        {/* Quote icon + text */}
        <div className="flex gap-3">
          <Quote className={cn("w-5 h-5 flex-shrink-0 mt-0.5", getAccentColor().split(" ")[0])} />
          <div className="flex-1 min-w-0">
            <blockquote className="text-foreground/90 text-sm sm:text-base italic leading-relaxed">
              "{quote}"
            </blockquote>
            
            {chapter && (
              <p className={cn("mt-2 text-xs font-medium", getAccentColor().split(" ")[0])}>
                — {chapter}
              </p>
            )}
          </div>
        </div>

        {/* Expandable reflection */}
        {reflection && expandable && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              <span>Reflection prompt</span>
            </button>
            
            {isExpanded && (
              <p className="mt-2 text-sm text-muted-foreground pl-5 animate-fade-in">
                {reflection}
              </p>
            )}
          </div>
        )}

        {/* Non-expandable reflection */}
        {reflection && !expandable && (
          <p className="mt-3 pt-3 border-t border-white/5 text-sm text-muted-foreground">
            💭 {reflection}
          </p>
        )}

        {/* Audio option */}
        {audioUrl && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAudioPlay}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Volume2 className={cn("w-3 h-3 mr-1", isPlaying && "animate-pulse")} />
              {isPlaying ? "Playing..." : "Listen"}
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// Helper to get a random quanta for a module
export const getRandomQuanta = (module: ModuleKey) => {
  const quanta = moduleQuanta[module];
  return quanta[Math.floor(Math.random() * quanta.length)];
};
