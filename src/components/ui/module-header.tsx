import { ArrowLeft, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { type ModuleKey, moduleConfig } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/contexts/AudioContext";

interface ModuleHeaderProps {
  module: ModuleKey;
  title?: string;
  subtitle?: string;
  backHref?: string;
  showSoundscape?: boolean;
  evidenceLevel?: "A" | "B" | "C" | "Research";
  xp?: number;
  streak?: number;
  className?: string;
}

export const ModuleHeader = ({
  module,
  title,
  subtitle,
  backHref = "/dashboard",
  showSoundscape = true,
  evidenceLevel,
  xp,
  streak,
  className,
}: ModuleHeaderProps) => {
  const config = moduleConfig[module];
  const displayTitle = title || config.name;
  const { activeSound, isPlaying, stopAll } = useAudio();
  
  const isAmbientPlaying = activeSound !== null && isPlaying;
  
  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      stopAll();
    }
    // To resume, user can use the floating control
  };

  const getAccentColor = () => {
    const colors: Record<ModuleKey, string> = {
      breath: "text-orange-400",
      ice: "text-cyan-400",
      mind: "text-purple-400",
      heart: "text-rose-400",
      arsenal: "text-blue-400",
      circle: "text-amber-400",
    };
    return colors[module];
  };

  const getEvidenceBadgeColor = () => {
    if (!evidenceLevel) return "";
    const colors = {
      A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      C: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      Research: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return colors[evidenceLevel];
  };

  return (
    <header className={cn("px-4 py-4 sm:px-6", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Top row: Back + Soundscape */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={backHref}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Gamification badges */}
            {(xp !== undefined || streak !== undefined) && (
              <div className="flex items-center gap-2 text-sm">
                {xp !== undefined && (
                  <span className={cn("font-semibold", getAccentColor())}>
                    {xp} XP
                  </span>
                )}
                {streak !== undefined && streak > 0 && (
                  <span className="text-amber-400 font-semibold">
                    🔥 {streak}
                  </span>
                )}
              </div>
            )}

            {/* Soundscape toggle */}
            {showSoundscape && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleAmbient}
                className={cn(
                  "w-9 h-9 rounded-full transition-all",
                  isAmbientPlaying 
                    ? cn("bg-white/10", getAccentColor())
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Volume2 className={cn(
                  "w-4 h-4",
                  isAmbientPlaying && "animate-pulse"
                )} />
              </Button>
            )}
          </div>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight",
                getAccentColor()
              )}>
                {displayTitle}
              </h1>
              
              {/* Evidence badge */}
              {evidenceLevel && (
                <span className={cn(
                  "px-2 py-0.5 text-xs font-semibold rounded-full border",
                  getEvidenceBadgeColor()
                )}>
                  {evidenceLevel === "Research" ? "Research-Backed" : `INCOG ${evidenceLevel}`}
                </span>
              )}
            </div>
            
            {subtitle && (
              <p className="text-muted-foreground text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
