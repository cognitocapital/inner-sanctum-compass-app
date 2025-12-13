import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileActionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  accentColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}

export const MobileActionCard = ({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  accentColor = "orange",
  size = "md",
  className,
  children
}: MobileActionCardProps) => {
  const getAccentClasses = () => {
    const accents: Record<string, { bg: string; border: string; hover: string }> = {
      orange: { 
        bg: "from-orange-900/30 to-red-900/30", 
        border: "border-orange-500/40", 
        hover: "hover:border-orange-400 active:bg-orange-900/40" 
      },
      cyan: { 
        bg: "from-cyan-900/30 to-blue-900/30", 
        border: "border-cyan-500/40", 
        hover: "hover:border-cyan-400 active:bg-cyan-900/40" 
      },
      blue: { 
        bg: "from-blue-900/30 to-gray-900/30", 
        border: "border-blue-500/40", 
        hover: "hover:border-blue-400 active:bg-blue-900/40" 
      },
      green: { 
        bg: "from-green-900/30 to-teal-900/30", 
        border: "border-green-500/40", 
        hover: "hover:border-green-400 active:bg-green-900/40" 
      },
      purple: { 
        bg: "from-purple-900/30 to-blue-900/30", 
        border: "border-purple-500/40", 
        hover: "hover:border-purple-400 active:bg-purple-900/40" 
      },
    };
    return accents[accentColor] || accents.orange;
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "p-3 gap-2";
      case "lg": return "p-5 md:p-6 gap-4";
      default: return "p-4 gap-3";
    }
  };

  const accent = getAccentClasses();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex flex-col items-center justify-center text-center rounded-xl",
        "bg-gradient-to-br border backdrop-blur-sm",
        "transition-all duration-200 touch-manipulation",
        !disabled && "hover:scale-[1.02] active:scale-[0.98]",
        disabled && "opacity-50 cursor-not-allowed",
        accent.bg,
        accent.border,
        !disabled && accent.hover,
        getSizeClasses(),
        className
      )}
    >
      {icon && <div className="text-2xl md:text-3xl">{icon}</div>}
      <div className="text-sm md:text-base font-semibold text-white">{title}</div>
      {description && (
        <div className="text-[10px] md:text-xs text-gray-300">{description}</div>
      )}
      {children}
    </button>
  );
};
