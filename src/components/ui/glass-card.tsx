import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { type ModuleKey } from "@/lib/design-tokens";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle" | "solid";
  module?: ModuleKey;
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ 
  children, 
  className, 
  variant = "default",
  module,
  hover = false,
  glow = false,
  ...props 
}, ref) => {
  const variants = {
    default: "backdrop-blur-md bg-white/5 border-white/10",
    strong: "backdrop-blur-lg bg-white/10 border-white/15",
    subtle: "backdrop-blur-sm bg-white/[0.03] border-white/5",
    solid: "bg-card border-border",
  };

  const getGlowClass = () => {
    if (!glow || !module) return "";
    
    const glows: Record<ModuleKey, string> = {
      breath: "shadow-[0_0_30px_hsl(24.6_95%_53.1%/0.2)]",
      ice: "shadow-[0_0_30px_hsl(195_85%_50%/0.2)]",
      mind: "shadow-[0_0_30px_hsl(270_70%_55%/0.2)]",
      heart: "shadow-[0_0_30px_hsl(340_75%_55%/0.2)]",
      arsenal: "shadow-[0_0_30px_hsl(210_80%_55%/0.2)]",
      circle: "shadow-[0_0_30px_hsl(45_90%_55%/0.2)]",
    };
    
    return glows[module];
  };

  const getAccentBorder = () => {
    if (!module) return "";
    
    const borders: Record<ModuleKey, string> = {
      breath: "border-orange-500/20",
      ice: "border-cyan-400/20",
      mind: "border-purple-400/20",
      heart: "border-rose-400/20",
      arsenal: "border-blue-400/20",
      circle: "border-amber-400/20",
    };
    
    return borders[module];
  };

  return (
    <Card 
      ref={ref}
      className={cn(
        "border rounded-xl transition-all duration-300",
        variants[variant],
        module && getAccentBorder(),
        glow && getGlowClass(),
        hover && "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
});

GlassCard.displayName = "GlassCard";
