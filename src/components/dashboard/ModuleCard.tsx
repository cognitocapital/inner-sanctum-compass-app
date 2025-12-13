import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ModuleCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  href: string;
  buttonText: string;
  gradient: string;
  iconGradient: string;
  textColor: string;
  subtextColor: string;
  badgeColor: string;
  badgeText: string;
  delay?: number;
  ambientSound?: string;
}

export const ModuleCard = ({
  title,
  subtitle,
  description,
  features,
  icon: Icon,
  href,
  buttonText,
  gradient,
  iconGradient,
  textColor,
  subtextColor,
  badgeColor,
  badgeText,
  delay = 0,
}: ModuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-700",
        "hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-3",
        "animate-fade-in backdrop-blur-xl",
        gradient
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          "bg-gradient-to-t from-white/10 via-transparent to-transparent",
          isHovered && "opacity-100"
        )}
      />
      
      {/* Floating particles on hover */}
      <div className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header with icon */}
        <div className="text-center mb-5">
          <div className="relative mx-auto mb-4">
            {/* Icon glow ring */}
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-xl transition-all duration-500",
                iconGradient,
                isHovered ? "opacity-60 scale-150" : "opacity-30 scale-100"
              )}
            />
            
            {/* Icon container */}
            <div
              className={cn(
                "relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br shadow-2xl",
                "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                iconGradient
              )}
            >
              <Icon className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={1.5} />
              
              {/* Sparkle effect */}
              <Sparkles 
                className={cn(
                  "absolute -top-1 -right-1 h-4 w-4 text-yellow-300 transition-all duration-300",
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )} 
              />
            </div>
          </div>

          <h3 className={cn("text-2xl font-serif font-bold mb-1 tracking-tight", textColor)}>
            {title}
          </h3>
          
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            badgeColor
          )}>
            {badgeText}
          </span>
        </div>

        {/* Description */}
        <p className={cn("text-sm leading-relaxed mb-4 text-center", subtextColor)}>
          {description}
        </p>

        {/* Features list */}
        <div className="flex-1 space-y-2 mb-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm transition-all duration-300",
                subtextColor,
                isHovered && "translate-x-1"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full bg-gradient-to-r shrink-0",
                iconGradient
              )} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          asChild
          className={cn(
            "w-full font-semibold shadow-lg transition-all duration-300",
            "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
            "bg-gradient-to-r text-white border-0",
            iconGradient
          )}
        >
          <Link to={href}>{buttonText}</Link>
        </Button>
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-500",
          iconGradient,
          isHovered ? "opacity-100" : "opacity-50"
        )}
      />
    </div>
  );
};
