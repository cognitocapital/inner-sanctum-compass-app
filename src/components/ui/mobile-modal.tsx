import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "./button";

interface MobileFullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  accentColor?: string;
  className?: string;
}

export const MobileFullScreenModal = ({
  isOpen,
  onClose,
  title,
  children,
  accentColor = "orange",
  className
}: MobileFullScreenModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getAccentClasses = () => {
    const accents: Record<string, string> = {
      orange: "border-orange-500/30 bg-gradient-to-b from-gray-900 via-gray-900 to-orange-900",
      cyan: "border-cyan-500/30 bg-gradient-to-b from-slate-900 via-blue-900 to-cyan-900",
      blue: "border-blue-500/30 bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900",
      green: "border-green-500/30 bg-gradient-to-b from-gray-900 via-gray-900 to-green-900",
      purple: "border-purple-500/30 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900",
    };
    return accents[accentColor] || accents.orange;
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] animate-fade-in",
      getAccentClasses(),
      className
    )}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-lg border-b border-white/10">
        <h2 className="text-lg font-semibold text-white truncate pr-4">{title}</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </header>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-64px)] overscroll-contain">
        {children}
      </div>
    </div>
  );
};
