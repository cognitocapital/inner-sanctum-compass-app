import { cn } from "@/lib/utils";

interface BreathingSphereProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  showParticles?: boolean;
}

const phaseColors = {
  inhale: { primary: 'from-cyan-400 via-blue-500 to-indigo-600', glow: 'shadow-cyan-500/60' },
  hold: { primary: 'from-amber-400 via-orange-500 to-red-600', glow: 'shadow-orange-500/60' },
  exhale: { primary: 'from-emerald-400 via-teal-500 to-cyan-600', glow: 'shadow-emerald-500/60' },
  pause: { primary: 'from-violet-400 via-purple-500 to-indigo-600', glow: 'shadow-violet-500/60' },
};

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
};

export const BreathingSphere = ({ phase, isActive, size = 'lg', showParticles = true }: BreathingSphereProps) => {
  const colors = phaseColors[phase];
  const scaleClass = phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-85' : 'scale-100';
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div className={cn(
        "absolute rounded-full transition-all duration-1000 ease-in-out opacity-20 blur-xl",
        sizeClasses[size],
        `bg-gradient-to-br ${colors.primary}`,
        isActive ? 'scale-150' : 'scale-100'
      )} />
      
      <div className={cn(
        "absolute rounded-full transition-all duration-1000 ease-in-out opacity-30 blur-lg",
        sizeClasses[size],
        `bg-gradient-to-br ${colors.primary}`,
        isActive ? 'scale-130' : 'scale-100'
      )} />
      
      {/* Main sphere */}
      <div className={cn(
        "relative rounded-full transition-all duration-1000 ease-in-out",
        sizeClasses[size],
        `bg-gradient-to-br ${colors.primary}`,
        isActive ? `shadow-2xl ${colors.glow}` : 'shadow-lg',
        scaleClass
      )}>
        {/* Inner highlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Core glow */}
        <div className={cn(
          "absolute inset-8 rounded-full bg-white/20 blur-md transition-all duration-1000",
          isActive ? 'opacity-60' : 'opacity-30'
        )} />
      </div>
      
      {/* Floating particles */}
      {showParticles && isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 rounded-full animate-pulse",
                `bg-gradient-to-br ${colors.primary}`
              )}
              style={{
                left: `${50 + Math.cos(i * (Math.PI / 4)) * 60}%`,
                top: `${50 + Math.sin(i * (Math.PI / 4)) * 60}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default BreathingSphere;
