import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { ReactNode } from "react";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  backHref?: string;
  backLabel?: string;
  accentColor?: string;
  className?: string;
  children?: ReactNode;
}

export const MobileHeader = ({
  title,
  subtitle,
  icon,
  backHref = "/dashboard",
  backLabel = "Back",
  accentColor = "orange",
  className,
  children
}: MobileHeaderProps) => {
  const getTextColor = () => {
    const colors: Record<string, { title: string; subtitle: string; back: string }> = {
      orange: { title: "text-orange-100", subtitle: "text-orange-200", back: "text-orange-300 hover:text-white" },
      cyan: { title: "text-cyan-100", subtitle: "text-cyan-200", back: "text-cyan-300 hover:text-white" },
      blue: { title: "text-blue-100", subtitle: "text-blue-200", back: "text-blue-300 hover:text-white" },
      green: { title: "text-green-100", subtitle: "text-green-200", back: "text-green-300 hover:text-white" },
      purple: { title: "text-purple-100", subtitle: "text-purple-200", back: "text-purple-300 hover:text-white" },
    };
    return colors[accentColor] || colors.orange;
  };

  const colors = getTextColor();

  return (
    <header className={cn("px-4 pt-4 pb-6 md:px-8 md:pt-8 md:pb-10", className)}>
      {/* Back button */}
      <Button asChild variant="ghost" className={cn("pl-0 mb-4 md:mb-6", colors.back)}>
        <Link to={backHref}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
      </Button>

      <div className="text-center">
        {/* Icon */}
        {icon && (
          <div className="mx-auto mb-4 md:mb-6 w-20 h-20 md:w-28 md:h-28">
            {icon}
          </div>
        )}

        {/* Title */}
        <h1 className={cn(
          "text-2xl sm:text-3xl md:text-5xl font-serif font-bold mb-2 md:mb-4 drop-shadow-lg",
          colors.title
        )}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className={cn(
            "text-sm sm:text-base md:text-xl max-w-3xl mx-auto leading-relaxed px-4",
            colors.subtitle
          )}>
            {subtitle}
          </p>
        )}

        {/* Extra content (badges, etc.) */}
        {children}
      </div>
    </header>
  );
};
