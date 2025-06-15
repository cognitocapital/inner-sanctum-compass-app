import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: GlassCardProps) => {
  const variants = {
    default: "backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl",
    strong: "backdrop-blur-md bg-white/90 border-orange-500/30 shadow-2xl",
    subtle: "backdrop-blur-sm bg-white/60 border-orange-500/10 shadow-xl"
  };

  return (
    <Card 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </Card>
  );
};