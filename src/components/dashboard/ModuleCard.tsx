import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModuleIcon } from "./ModuleIcon";

export interface ModuleCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  iconVariant: "breath" | "ice" | "computer" | "mind" | "heart" | "incog" | "circle";
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
  iconVariant,
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
        "hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-4",
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
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* Corner accent */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 transition-all duration-500",
        "bg-gradient-to-bl from-white/10 to-transparent",
        isHovered ? "opacity-100" : "opacity-50"
      )} />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full min-h-[420px]">
        {/* Header with enhanced icon */}
        <div className="text-center mb-5">
          <div className="relative mx-auto mb-4 flex items-center justify-center">
            <ModuleIcon variant={iconVariant} isHovered={isHovered} />
          </div>

          <h3 className={cn(
            "text-2xl font-serif font-bold mb-2 tracking-tight transition-all duration-300",
            textColor,
            isHovered && "scale-105"
          )}>
            {title}
          </h3>
          
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300",
            badgeColor,
            isHovered && "scale-105"
          )}>
            {badgeText}
          </span>
        </div>

        {/* Description */}
        <p className={cn("text-sm leading-relaxed mb-4 text-center", subtextColor)}>
          {description}
        </p>

        {/* Features list */}
        <div className="flex-1 space-y-2.5 mb-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 text-sm transition-all duration-300",
                subtextColor,
                isHovered && "translate-x-1"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full bg-gradient-to-r shrink-0 transition-all duration-300",
                iconGradient,
                isHovered && "scale-150"
              )} />
              <span className="opacity-90">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          asChild
          className={cn(
            "w-full font-semibold shadow-lg transition-all duration-300 py-6",
            "hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]",
            "bg-gradient-to-r text-white border-0",
            iconGradient
          )}
        >
          <Link to={href}>{buttonText}</Link>
        </Button>
      </div>

      {/* Bottom accent line with animation */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-500",
          iconGradient
        )}
      >
        <div className={cn(
          "h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000",
          isHovered ? "translate-x-full" : "-translate-x-full"
        )} />
      </div>
    </div>
  );
};
