import { cn } from "@/lib/utils";
import { type ModuleKey } from "@/lib/design-tokens";
import { GlassCard } from "@/components/ui/glass-card";
import { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  change?: string;
}

interface SessionStatsProps {
  stats: Stat[];
  module?: ModuleKey;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const SessionStats = ({
  stats,
  module,
  columns = 3,
  className,
}: SessionStatsProps) => {
  const getAccentColor = () => {
    if (!module) return "text-orange-400";
    
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

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up": return "text-emerald-400";
      case "down": return "text-rose-400";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up": return "↑";
      case "down": return "↓";
      default: return "";
    }
  };

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <GlassCard
          key={index}
          variant="subtle"
          module={module}
          className="p-3 sm:p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate mb-1">
                {stat.label}
              </p>
              <p className={cn(
                "text-xl sm:text-2xl font-bold tracking-tight",
                getAccentColor()
              )}>
                {stat.value}
              </p>
              {stat.change && (
                <p className={cn(
                  "text-xs mt-1 font-medium",
                  getTrendColor(stat.trend)
                )}>
                  {getTrendIcon(stat.trend)} {stat.change}
                </p>
              )}
            </div>
            {stat.icon && (
              <stat.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                getAccentColor(),
                "opacity-60"
              )} />
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

// Pre-configured stats for each module
export const defaultModuleStats: Record<ModuleKey, Stat[]> = {
  breath: [
    { label: "Sessions", value: 0 },
    { label: "Total Minutes", value: 0 },
    { label: "Current Streak", value: 0 },
  ],
  ice: [
    { label: "Sessions", value: 0 },
    { label: "Cold Minutes", value: 0 },
    { label: "Best Streak", value: 0 },
  ],
  mind: [
    { label: "Games Played", value: 0 },
    { label: "Best Score", value: 0 },
    { label: "Avg Accuracy", value: "0%" },
  ],
  heart: [
    { label: "Entries", value: 0 },
    { label: "This Week", value: 0 },
    { label: "Streak", value: 0 },
  ],
  arsenal: [
    { label: "Goals Set", value: 0 },
    { label: "Completed", value: 0 },
    { label: "Progress", value: "0%" },
  ],
  circle: [
    { label: "Stories Shared", value: 0 },
    { label: "Connections", value: 0 },
    { label: "Flames Given", value: 0 },
  ],
};
