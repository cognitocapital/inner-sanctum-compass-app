import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface MobileBottomNavProps {
  items: MobileNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  accentColor?: string;
  className?: string;
}

export const MobileBottomNav = ({
  items,
  activeId,
  onSelect,
  accentColor = "orange",
  className
}: MobileBottomNavProps) => {
  const getAccentClasses = () => {
    const accents: Record<string, { active: string; bg: string }> = {
      orange: { active: "text-orange-400 bg-orange-500/20", bg: "border-orange-500/30" },
      cyan: { active: "text-cyan-400 bg-cyan-500/20", bg: "border-cyan-500/30" },
      blue: { active: "text-blue-400 bg-blue-500/20", bg: "border-blue-500/30" },
      green: { active: "text-green-400 bg-green-500/20", bg: "border-green-500/30" },
      purple: { active: "text-purple-400 bg-purple-500/20", bg: "border-purple-500/30" },
    };
    return accents[accentColor] || accents.orange;
  };

  const accent = getAccentClasses();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 md:hidden",
      "bg-gray-900/95 backdrop-blur-lg border-t",
      accent.bg,
      className
    )}>
      <div className="flex items-center justify-around py-2 px-1 safe-area-pb">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
              activeId === item.id
                ? accent.active
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium truncate max-w-[60px]">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

interface MobilePageContainerProps {
  children: ReactNode;
  hasBottomNav?: boolean;
  className?: string;
}

export const MobilePageContainer = ({ 
  children, 
  hasBottomNav = true,
  className 
}: MobilePageContainerProps) => {
  return (
    <div className={cn(
      "min-h-screen",
      hasBottomNav && "pb-20 md:pb-0",
      className
    )}>
      {children}
    </div>
  );
};
