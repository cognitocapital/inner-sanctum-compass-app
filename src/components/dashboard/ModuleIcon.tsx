import { useState } from "react";
import { cn } from "@/lib/utils";
import { Wind, Thermometer, Brain, Heart, Users, Target, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ModuleIconProps {
  variant: "breath" | "ice" | "computer" | "mind" | "heart" | "incog" | "circle";
  isHovered?: boolean;
  className?: string;
}

// Breath Icon - Swirling wind with flame essence
const BreathIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Outer breathing ring */}
    <div className={cn(
      "absolute inset-0 rounded-full border-2 border-orange-400/30 transition-all duration-1000",
      isHovered ? "scale-150 opacity-0" : "scale-100 opacity-100"
    )} />
    <div className={cn(
      "absolute inset-1 rounded-full border border-orange-300/20 transition-all duration-700",
      isHovered ? "scale-130 opacity-0" : "scale-100 opacity-100"
    )} style={{ animationDelay: "200ms" }} />
    
    {/* Core container */}
    <div className={cn(
      "absolute inset-2 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 shadow-2xl",
      "flex items-center justify-center transition-all duration-500",
      isHovered && "scale-110 rotate-6 shadow-orange-500/50"
    )}>
      <Wind className="h-9 w-9 text-white drop-shadow-lg" strokeWidth={1.5} />
      
      {/* Breath waves */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full",
            "animate-pulse"
          )}
          style={{
            top: `${35 + i * 15}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: isHovered ? 0.6 : 0.3
          }}
        />
      ))}
    </div>
    
    {/* Floating breath particles */}
    {isHovered && [...Array(4)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 bg-orange-300 rounded-full animate-float"
        style={{
          top: `${20 + i * 15}%`,
          left: `${-10 + i * 30}%`,
          animationDelay: `${i * 0.2}s`
        }}
      />
    ))}
  </div>
);

// Ice Icon - Crystalline cold with frost effects
const IceIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Frost crystals */}
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "absolute w-0.5 bg-gradient-to-t from-cyan-400 to-transparent transition-all duration-500",
          isHovered ? "opacity-80 h-6" : "opacity-40 h-4"
        )}
        style={{
          top: "50%",
          left: "50%",
          transformOrigin: "bottom center",
          transform: `rotate(${i * 60}deg) translateY(-140%)`,
        }}
      />
    ))}
    
    {/* Ice hexagon container */}
    <div className={cn(
      "absolute inset-2 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 shadow-2xl",
      "flex items-center justify-center transition-all duration-500 overflow-hidden",
      isHovered ? "scale-110 shadow-cyan-500/60" : "shadow-cyan-500/30"
    )} style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
      <Thermometer className="h-9 w-9 text-white drop-shadow-lg" strokeWidth={1.5} />
      
      {/* Ice shimmer effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent",
        "transition-transform duration-1000",
        isHovered ? "translate-x-full" : "-translate-x-full"
      )} />
    </div>
    
    {/* Snowflake particles */}
    {isHovered && [...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full animate-float opacity-70"
        style={{
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
          animationDelay: `${i * 0.15}s`
        }}
      />
    ))}
  </div>
);

// Computer/TBI Icon - Neural network with digital pulses
const ComputerIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Neural connections */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      {[
        { x1: 40, y1: 40, x2: 15, y2: 15 },
        { x1: 40, y1: 40, x2: 65, y2: 15 },
        { x1: 40, y1: 40, x2: 15, y2: 65 },
        { x1: 40, y1: 40, x2: 65, y2: 65 },
        { x1: 40, y1: 40, x2: 10, y2: 40 },
        { x1: 40, y1: 40, x2: 70, y2: 40 },
      ].map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#neural-gradient)"
          strokeWidth={isHovered ? 2 : 1}
          className="transition-all duration-500"
          opacity={isHovered ? 0.8 : 0.3}
        />
      ))}
      <defs>
        <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
    
    {/* Neural nodes */}
    {[[15, 15], [65, 15], [15, 65], [65, 65], [10, 40], [70, 40]].map(([x, y], i) => (
      <div
        key={i}
        className={cn(
          "absolute w-2 h-2 rounded-full bg-indigo-400 transition-all duration-300",
          isHovered && "animate-pulse scale-125"
        )}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
    
    {/* Core brain */}
    <div className={cn(
      "absolute inset-3 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-600 shadow-2xl",
      "flex items-center justify-center transition-all duration-500",
      isHovered && "scale-105 shadow-indigo-500/60"
    )}>
      <Brain className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={1.5} />
      
      {/* Digital pulse */}
      <div className={cn(
        "absolute inset-0 rounded-xl border-2 border-indigo-300/50 transition-all duration-700",
        isHovered ? "scale-150 opacity-0" : "scale-100 opacity-50"
      )} />
    </div>
  </div>
);

// Mind Icon - Meditative glow with third eye essence  
const MindIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Aura rings */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "absolute rounded-full border transition-all duration-700",
          i === 0 ? "inset-0 border-purple-400/20" : 
          i === 1 ? "inset-[-4px] border-purple-300/15" : 
          "inset-[-8px] border-purple-200/10",
          isHovered && "animate-pulse"
        )}
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
    
    {/* Core container with eye symbol */}
    <div className={cn(
      "absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-600 to-red-600 shadow-2xl",
      "flex items-center justify-center transition-all duration-500 overflow-hidden",
      isHovered && "scale-110 shadow-purple-500/60"
    )}>
      <Brain className="h-8 w-8 text-white drop-shadow-lg relative z-10" strokeWidth={1.5} />
      
      {/* Third eye glow */}
      <div className={cn(
        "absolute top-2 w-3 h-3 rounded-full bg-yellow-300 transition-all duration-500 blur-sm",
        isHovered ? "opacity-80 scale-110" : "opacity-40"
      )} />
      
      {/* Meditation rays */}
      {isHovered && [...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-12 bg-gradient-to-t from-purple-300/60 to-transparent"
          style={{
            transformOrigin: "center bottom",
            transform: `rotate(${i * 45}deg)`,
            bottom: "50%"
          }}
        />
      ))}
    </div>
    
    {/* Floating consciousness particles */}
    {isHovered && [...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-purple-300 rounded-full animate-float"
        style={{
          top: `${10 + i * 18}%`,
          left: `${5 + i * 22}%`,
          animationDelay: `${i * 0.25}s`
        }}
      />
    ))}
  </div>
);

// Heart Icon - Pulsing love with healing waves
const HeartIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Heartbeat waves */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "absolute inset-0 rounded-full border-2 border-pink-400/30 transition-all duration-1000",
          isHovered ? "scale-[2] opacity-0" : "scale-100 opacity-0"
        )}
        style={{ 
          animationDelay: `${i * 0.4}s`,
          animation: isHovered ? `pulse 1.5s ease-out ${i * 0.4}s infinite` : "none"
        }}
      />
    ))}
    
    {/* Main heart container */}
    <div className={cn(
      "absolute inset-2 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 shadow-2xl",
      "flex items-center justify-center transition-all duration-300",
      isHovered ? "scale-110 shadow-pink-500/60" : "scale-100",
      isHovered && "animate-[pulse_0.8s_ease-in-out_infinite]"
    )}>
      <Heart className="h-9 w-9 text-white drop-shadow-lg" strokeWidth={1.5} fill="currentColor" />
      
      {/* Inner glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/20 transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-50"
      )} />
    </div>
    
    {/* Love sparkles */}
    {isHovered && (
      <>
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-pink-300 animate-pulse" />
        <Sparkles className="absolute -bottom-1 -left-1 h-3 w-3 text-rose-300 animate-pulse" style={{ animationDelay: "0.3s" }} />
      </>
    )}
  </div>
);

// INCOG Icon - Precision target with data orbits
const IncogIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Orbiting data points */}
    <div className={cn(
      "absolute inset-0 transition-transform duration-1000",
      isHovered && "animate-[spin_8s_linear_infinite]"
    )}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-2 h-2 rounded-full transition-all duration-500",
            i % 2 === 0 ? "bg-emerald-400" : "bg-teal-400"
          )}
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${i * 90}deg) translateX(36px) translateY(-50%)`
          }}
        />
      ))}
    </div>
    
    {/* Orbit ring */}
    <div className={cn(
      "absolute inset-1 rounded-full border border-dashed transition-all duration-500",
      isHovered ? "border-emerald-400/60 rotate-45" : "border-emerald-400/30"
    )} />
    
    {/* Core target */}
    <div className={cn(
      "absolute inset-3 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 shadow-2xl",
      "flex items-center justify-center transition-all duration-500",
      isHovered && "scale-110 shadow-emerald-500/60"
    )}>
      <Target className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={1.5} />
      
      {/* Crosshair overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={cn(
          "absolute w-full h-px bg-white/20 transition-all duration-300",
          isHovered && "bg-white/40"
        )} />
        <div className={cn(
          "absolute w-px h-full bg-white/20 transition-all duration-300",
          isHovered && "bg-white/40"
        )} />
      </div>
    </div>
    
    {/* Achievement glow */}
    {isHovered && (
      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />
    )}
  </div>
);

// Circle Icon - Community connection with linked nodes
const CircleIcon = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative w-20 h-20">
    {/* Connection lines */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
      {[
        { x1: 25, y1: 20, x2: 55, y2: 20 },
        { x1: 55, y1: 20, x2: 65, y2: 45 },
        { x1: 65, y1: 45, x2: 55, y2: 70 },
        { x1: 55, y1: 70, x2: 25, y2: 70 },
        { x1: 25, y1: 70, x2: 15, y2: 45 },
        { x1: 15, y1: 45, x2: 25, y2: 20 },
      ].map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#circle-gradient)"
          strokeWidth={isHovered ? 2 : 1}
          className="transition-all duration-500"
          opacity={isHovered ? 0.8 : 0.4}
        />
      ))}
      <defs>
        <linearGradient id="circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
    
    {/* Community nodes */}
    {[[25, 20], [55, 20], [65, 45], [55, 70], [25, 70], [15, 45]].map(([x, y], i) => (
      <div
        key={i}
        className={cn(
          "absolute w-3 h-3 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 transition-all duration-300 shadow-lg",
          isHovered && "scale-125"
        )}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
          transitionDelay: `${i * 50}ms`
        }}
      />
    ))}
    
    {/* Central hub */}
    <div className={cn(
      "absolute inset-4 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600 shadow-2xl",
      "flex items-center justify-center transition-all duration-500",
      isHovered && "scale-105 shadow-teal-500/60"
    )}>
      <Users className="h-7 w-7 text-white drop-shadow-lg" strokeWidth={1.5} />
    </div>
    
    {/* Connection pulse */}
    {isHovered && (
      <div className="absolute inset-0 rounded-full border-2 border-teal-400/50 animate-ping" />
    )}
  </div>
);

export const ModuleIcon = ({ variant, isHovered = false, className }: ModuleIconProps) => {
  const icons = {
    breath: BreathIcon,
    ice: IceIcon,
    computer: ComputerIcon,
    mind: MindIcon,
    heart: HeartIcon,
    incog: IncogIcon,
    circle: CircleIcon,
  };
  
  const IconComponent = icons[variant];
  
  return (
    <div className={cn("relative", className)}>
      <IconComponent isHovered={isHovered} />
    </div>
  );
};
