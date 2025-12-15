import { cn } from "@/lib/utils";

interface BinauralVisualizerProps {
  frequency: "theta" | "alpha" | "beta" | "nature";
  isActive: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const frequencyColors = {
  theta: "from-violet-500 to-purple-700",
  alpha: "from-blue-400 to-indigo-600",
  beta: "from-amber-400 to-orange-600",
  nature: "from-teal-400 to-green-600"
};

const frequencyLabels = {
  theta: "4-7 Hz",
  alpha: "8-12 Hz",
  beta: "15-20 Hz",
  nature: "Natural"
};

export const BinauralVisualizer = ({
  frequency,
  isActive,
  size = "md",
  className
}: BinauralVisualizerProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };

  const waveClass = frequency === "theta" 
    ? "wave-theta" 
    : frequency === "alpha" 
      ? "wave-alpha" 
      : frequency === "beta"
        ? "wave-beta"
        : "wave-alpha";

  return (
    <div 
      className={cn(
        "relative rounded-full flex items-center justify-center",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={`${frequency} wave visualization at ${frequencyLabels[frequency]}, ${isActive ? 'playing' : 'paused'}`}
    >
      {/* Outer pulsing aura */}
      {isActive && (
        <>
          <div 
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br opacity-30 binaural-aura",
              frequencyColors[frequency]
            )} 
            style={{ animationDelay: "0s" }}
          />
          <div 
            className={cn(
              "absolute inset-2 rounded-full bg-gradient-to-br opacity-40 binaural-aura",
              frequencyColors[frequency]
            )} 
            style={{ animationDelay: "0.5s" }}
          />
          <div 
            className={cn(
              "absolute inset-4 rounded-full bg-gradient-to-br opacity-50 binaural-aura",
              frequencyColors[frequency]
            )} 
            style={{ animationDelay: "1s" }}
          />
        </>
      )}

      {/* Center core */}
      <div 
        className={cn(
          "relative z-10 rounded-full bg-gradient-to-br flex items-center justify-center",
          frequencyColors[frequency],
          size === "sm" ? "w-6 h-6" : size === "md" ? "w-10 h-10" : "w-16 h-16",
          isActive && "shadow-lg"
        )}
      >
        {/* Wave bars visualization */}
        <div className="flex items-end gap-0.5" style={{ height: size === "sm" ? 8 : size === "md" ? 14 : 24 }}>
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className={cn(
                "bg-white rounded-full",
                size === "sm" ? "w-0.5" : size === "md" ? "w-1" : "w-1.5",
                isActive ? waveClass : "opacity-50"
              )}
              style={{ 
                height: "100%",
                animationDelay: `${bar * 0.1}s`,
                transformOrigin: "bottom"
              }}
            />
          ))}
        </div>
      </div>

      {/* Frequency label */}
      {size !== "sm" && (
        <span 
          className={cn(
            "absolute -bottom-5 text-[10px] font-medium opacity-70",
            isActive ? "text-white" : "text-muted-foreground"
          )}
        >
          {frequencyLabels[frequency]}
        </span>
      )}
    </div>
  );
};

export default BinauralVisualizer;
