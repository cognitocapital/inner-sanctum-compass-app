import { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ModulePreview {
  id: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  gradient: string;
  videoPrompt: string; // For future video generation
  audioDescription: string;
}

export const MODULE_PREVIEWS: ModulePreview[] = [
  {
    id: "breath",
    title: "Phoenix Breath",
    tagline: "Harness breath for neuroplasticity—inhale calm, exhale fog.",
    icon: null,
    gradient: "from-orange-500 to-red-500",
    videoPrompt: "Soft glow animation of lungs expanding with golden light particles. Peaceful breathing figure surrounded by gentle waves. Transition from foggy darkness to crystal clarity.",
    audioDescription: "Soothing ocean waves with gentle whooshing breath sounds"
  },
  {
    id: "ice",
    title: "Ice Warrior Academy",
    tagline: "Build resilience through cold—adapt, endure, thrive.",
    icon: null,
    gradient: "from-cyan-500 to-blue-600",
    videoPrompt: "Chilling crystalline water visuals, ice forming patterns. Figure transitioning from shivering to powerful stance. Blue energy radiating outward with determination.",
    audioDescription: "Arctic wind with crisp crackling ice sounds"
  },
  {
    id: "computer",
    title: "TBI Computer Programs",
    tagline: "Cognitive games to rewire your mind per INCOG.",
    icon: null,
    gradient: "from-indigo-500 to-blue-600",
    videoPrompt: "Brain circuits lighting up in sequence, neural pathways forming. Digital interface overlays showing cognitive metrics improving. Puzzle pieces assembling into complete mind.",
    audioDescription: "Subtle electronic ambience with neural connection sounds"
  },
  {
    id: "mind",
    title: "Phoenix Mind Academy",
    tagline: "Train attention and executive functions for clarity.",
    icon: null,
    gradient: "from-purple-500 to-red-600",
    videoPrompt: "Meditation scenes with third eye awakening. Scattered thoughts organizing into focused beam. Phoenix feathers forming patterns of concentration.",
    audioDescription: "Tibetan singing bowls with peaceful meditation tones"
  },
  {
    id: "heart",
    title: "Phoenix Heart Sanctuary",
    tagline: "Gratitude heals emotions—journal your wins.",
    icon: null,
    gradient: "from-pink-500 to-red-500",
    videoPrompt: "Heart blooming with golden light, petals of gratitude unfolding. Warm embrace visuals with journal pages floating. Emotional healing represented by colors shifting warm.",
    audioDescription: "Gentle wind chimes with heartbeat rhythm undertones"
  },
  {
    id: "incog",
    title: "INCOG 2.0 Modules",
    tagline: "Evidence-based tools: GMT, memory, ADL mastery.",
    icon: null,
    gradient: "from-emerald-500 to-teal-600",
    videoPrompt: "Puzzle pieces assembling into complete cognitive framework. Goal checkmarks appearing in sequence. Memory cards flipping and matching with celebration effects.",
    audioDescription: "Focus-enhancing binaural beats with achievement sounds"
  }
];

interface ModulePreviewCardProps {
  preview: ModulePreview;
  className?: string;
}

export const ModulePreviewCard = ({ preview, className }: ModulePreviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 transition-all duration-500",
        "bg-gradient-to-br",
        preview.gradient,
        "hover:scale-105 hover:shadow-2xl cursor-pointer group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <div
        className={cn(
          "absolute inset-0 bg-white/10 transition-opacity duration-500",
          isHovered ? "opacity-20" : "opacity-0"
        )}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-white font-bold text-lg mb-1">{preview.title}</h4>
        <p className="text-white/80 text-sm italic">{preview.tagline}</p>
        
        {/* Preview action hint */}
        <div
          className={cn(
            "flex items-center gap-2 mt-3 text-white/60 text-xs transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <Play className="h-3 w-3" />
          <span>Preview coming soon</span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div
        className={cn(
          "absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full transition-all duration-500",
          isHovered ? "scale-150 opacity-30" : "scale-100 opacity-10"
        )}
      />
    </div>
  );
};

// Micro-video prompt generator for AI video generation
export const generateVideoPrompt = (moduleId: string): string => {
  const preview = MODULE_PREVIEWS.find(p => p.id === moduleId);
  if (!preview) return "";
  
  return `Create a 15-30 second cinematic micro-video for "${preview.title}":

VISUAL CONCEPT: ${preview.videoPrompt}

AUDIO: ${preview.audioDescription}

STYLE: Phoenix Rising brand aesthetic - warm oranges, healing golds, transformative imagery. Smooth transitions, gentle animations, inspiring tone.

TAGLINE TO DISPLAY: "${preview.tagline}"

OUTPUT: Vertical format (9:16) for mobile, with optional 16:9 version. No text overlays except tagline at end.`;
};
