import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface DomainSegment {
  id: string;
  name: string;
  progress: number;
  color: string;
  icon?: React.ReactNode;
}

interface AnimatedDomainWheelProps {
  domains: DomainSegment[];
  size?: number;
  onDomainClick?: (domain: DomainSegment) => void;
  centerContent?: React.ReactNode;
  className?: string;
  spinning?: boolean;
  highlightedDomain?: string | null;
}

export const AnimatedDomainWheel = ({
  domains,
  size = 280,
  onDomainClick,
  centerContent,
  className,
  spinning = false,
  highlightedDomain = null,
}: AnimatedDomainWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / domains.length;
  const gapLength = 6;
  const arcLength = segmentLength - gapLength;
  const center = size / 2;

  useEffect(() => {
    if (spinning) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [spinning]);

  const activeDomain = hoveredDomain || highlightedDomain;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{
          background: `conic-gradient(${domains.map((d, i) => 
            `${d.color} ${i * (360 / domains.length)}deg ${(i + 1) * (360 / domains.length)}deg`
          ).join(', ')})`,
        }}
        animate={{
          opacity: spinning ? [0.2, 0.4, 0.2] : 0.2,
          scale: spinning ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main wheel SVG */}
      <motion.svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        animate={{ rotate: rotation }}
        transition={{ duration: 0.05, ease: "linear" }}
      >
        <defs>
          {domains.map((domain) => (
            <linearGradient
              key={`gradient-${domain.id}`}
              id={`domain-gradient-${domain.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={domain.color} stopOpacity="1" />
              <stop offset="100%" stopColor={domain.color} stopOpacity="0.6" />
            </linearGradient>
          ))}
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {domains.map((domain, index) => {
          const startOffset = index * segmentLength;
          const isActive = activeDomain === domain.id;
          const isHighPriority = domain.progress < 40;
          
          // Background track
          const bgStrokeDasharray = `${arcLength} ${circumference - arcLength}`;
          const bgStrokeDashoffset = -startOffset;
          
          // Progress arc
          const progressArc = (domain.progress / 100) * arcLength;
          const progressStrokeDasharray = `${progressArc} ${circumference - progressArc}`;

          return (
            <g key={domain.id}>
              {/* Background track */}
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={bgStrokeDasharray}
                strokeDashoffset={bgStrokeDashoffset}
                strokeLinecap="round"
                className="text-white/10"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
              
              {/* Progress arc */}
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={`url(#domain-gradient-${domain.id})`}
                strokeWidth={isActive ? strokeWidth + 8 : strokeWidth}
                strokeDasharray={progressStrokeDasharray}
                strokeDashoffset={bgStrokeDashoffset}
                strokeLinecap="round"
                filter={isActive ? "url(#glow)" : undefined}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  isHighPriority && "animate-pulse"
                )}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                onMouseEnter={() => setHoveredDomain(domain.id)}
                onMouseLeave={() => setHoveredDomain(null)}
                onClick={() => onDomainClick?.(domain)}
                animate={{
                  strokeWidth: isActive ? strokeWidth + 8 : strokeWidth,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Domain label positioned around wheel */}
              {isActive && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {(() => {
                    const angle = ((index + 0.5) * (360 / domains.length) - 90) * (Math.PI / 180);
                    const labelRadius = radius + strokeWidth + 25;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);
                    
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={domain.color}
                        fontSize="12"
                        fontWeight="600"
                        style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${x}px ${y}px` }}
                      >
                        {domain.progress}%
                      </text>
                    );
                  })()}
                </motion.g>
              )}
            </g>
          );
        })}
      </motion.svg>

      {/* Center content */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center"
        style={{ width: radius * 1.2, height: radius * 1.2 }}
        animate={{ rotate: -rotation }}
        transition={{ duration: 0.05, ease: "linear" }}
      >
        {centerContent || (
          activeDomain ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4"
            >
              <div 
                className="text-lg font-semibold"
                style={{ color: domains.find(d => d.id === activeDomain)?.color }}
              >
                {domains.find(d => d.id === activeDomain)?.name}
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {domains.find(d => d.id === activeDomain)?.progress}%
              </div>
            </motion.div>
          ) : (
            <div className="text-gray-400 text-sm">
              Hover to explore
            </div>
          )
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedDomainWheel;
