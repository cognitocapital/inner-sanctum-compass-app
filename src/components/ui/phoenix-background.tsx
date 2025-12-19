import { cn } from "@/lib/utils";
import { type ModuleKey, moduleConfig } from "@/lib/design-tokens";

interface PhoenixBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  module?: ModuleKey;
  showEmbers?: boolean;
  showGrid?: boolean;
  intensity?: "subtle" | "normal" | "intense";
}

export const PhoenixBackground = ({ 
  children, 
  className = "",
  module,
  showEmbers = true,
  showGrid = false,
  intensity = "normal",
}: PhoenixBackgroundProps) => {
  // Get accent color based on module
  const getAccentGradient = () => {
    if (!module) return "from-gray-900 via-gray-900 to-orange-950/50";
    
    const gradients: Record<ModuleKey, string> = {
      breath: "from-gray-900 via-gray-900 to-orange-950/50",
      ice: "from-gray-900 via-slate-900 to-cyan-950/50",
      mind: "from-gray-900 via-gray-900 to-purple-950/50",
      heart: "from-gray-900 via-gray-900 to-rose-950/50",
      arsenal: "from-gray-900 via-slate-900 to-blue-950/50",
      circle: "from-gray-900 via-gray-900 to-amber-950/50",
    };
    
    return gradients[module];
  };

  const getEmberColor = () => {
    if (!module) return "bg-orange-500";
    
    const colors: Record<ModuleKey, string> = {
      breath: "bg-orange-500",
      ice: "bg-cyan-400",
      mind: "bg-purple-400",
      heart: "bg-rose-400",
      arsenal: "bg-blue-400",
      circle: "bg-amber-400",
    };
    
    return colors[module];
  };

  const opacityMultiplier = intensity === "subtle" ? 0.5 : intensity === "intense" ? 1.5 : 1;

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b text-foreground relative overflow-hidden",
      getAccentGradient(),
      className
    )}>
      {/* Subtle grid overlay */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {/* Animated ember particles */}
      {showEmbers && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Primary embers */}
          <div 
            className={cn(
              "absolute top-20 left-10 w-3 h-3 rounded-full animate-[float_3s_ease-in-out_infinite]",
              getEmberColor()
            )} 
            style={{ opacity: 0.8 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute top-40 right-20 w-2 h-2 rounded-full animate-[float_3s_ease-in-out_infinite_1s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.6 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute bottom-60 left-1/4 w-2.5 h-2.5 rounded-full animate-[float_3s_ease-in-out_infinite_2s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.7 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute bottom-40 right-1/3 w-2 h-2 rounded-full animate-[float_3s_ease-in-out_infinite_3s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.5 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute top-1/3 left-[15%] w-1.5 h-1.5 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.45 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute bottom-1/3 right-[15%] w-1 h-1 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.35 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute top-2/3 right-[20%] w-2 h-2 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.55 * opacityMultiplier }}
          />
          
          {/* Secondary smaller embers */}
          <div 
            className={cn(
              "absolute top-32 left-[20%] w-1 h-1 rounded-full animate-[float_4s_ease-in-out_infinite_4s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.4 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute top-56 right-1/4 w-1.5 h-1.5 rounded-full animate-[float_4s_ease-in-out_infinite_5s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.35 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute bottom-72 left-1/3 w-1 h-1 rounded-full animate-[float_4s_ease-in-out_infinite_6s]",
              getEmberColor()
            )} 
            style={{ opacity: 0.3 * opacityMultiplier }}
          />
          
          {/* Subtle glow orbs */}
          <div 
            className={cn(
              "absolute top-1/4 left-1/2 w-32 h-32 rounded-full blur-3xl",
              getEmberColor()
            )} 
            style={{ opacity: 0.05 * opacityMultiplier }}
          />
          <div 
            className={cn(
              "absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full blur-2xl",
              getEmberColor()
            )} 
            style={{ opacity: 0.04 * opacityMultiplier }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
