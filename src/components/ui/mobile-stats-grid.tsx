import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatItem {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconColor?: string;
}

interface MobileStatsGridProps {
  stats: StatItem[];
  accentColor?: string;
  className?: string;
}

export const MobileStatsGrid = ({
  stats,
  accentColor = "orange",
  className
}: MobileStatsGridProps) => {
  const getCardClasses = () => {
    const accents: Record<string, string> = {
      orange: "from-orange-900/50 to-gray-900/50 border-orange-500/30",
      cyan: "from-cyan-900/50 to-slate-900/50 border-cyan-500/30",
      blue: "from-blue-900/50 to-gray-900/50 border-blue-500/30",
      green: "from-green-900/50 to-gray-900/50 border-green-500/30",
      purple: "from-purple-900/50 to-gray-900/50 border-purple-500/30",
    };
    return accents[accentColor] || accents.orange;
  };

  return (
    <div className={cn(
      "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
      className
    )}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "rounded-xl p-3 md:p-4 text-center bg-gradient-to-br backdrop-blur-sm border",
            getCardClasses()
          )}
        >
          <div className={cn("mx-auto mb-1.5 md:mb-2", stat.iconColor)}>
            {stat.icon}
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            {stat.value}
          </div>
          <div className="text-[10px] md:text-xs text-gray-300 truncate">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
