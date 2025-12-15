import { cn } from "@/lib/utils";
import { useState } from "react";

interface DomainSegment {
  id: string;
  name: string;
  progress: number; // 0-100
  color: string;
  icon?: React.ReactNode;
  description?: string;
}

interface DomainWheelProps {
  domains: DomainSegment[];
  size?: 'sm' | 'md' | 'lg';
  onDomainClick?: (domain: DomainSegment) => void;
  centerContent?: React.ReactNode;
  className?: string;
}

const sizeConfigs = {
  sm: { size: 160, strokeWidth: 12, centerSize: 60 },
  md: { size: 240, strokeWidth: 16, centerSize: 90 },
  lg: { size: 320, strokeWidth: 20, centerSize: 120 },
};

export const DomainWheel = ({
  domains,
  size = 'md',
  onDomainClick,
  centerContent,
  className,
}: DomainWheelProps) => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const config = sizeConfigs[size];
  
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / domains.length;
  const gapLength = 4; // Gap between segments
  const arcLength = segmentLength - gapLength;

  return (
    <div className={cn("relative", className)} style={{ width: config.size, height: config.size }}>
      <svg
        viewBox={`0 0 ${config.size} ${config.size}`}
        className="w-full h-full transform -rotate-90"
      >
        {domains.map((domain, index) => {
          const startOffset = index * segmentLength;
          const isHovered = hoveredDomain === domain.id;
          
          // Background track
          const bgStrokeDasharray = `${arcLength} ${circumference - arcLength}`;
          const bgStrokeDashoffset = -startOffset;
          
          // Progress arc
          const progressArc = (domain.progress / 100) * arcLength;
          const progressStrokeDasharray = `${progressArc} ${circumference - progressArc}`;

          return (
            <g key={domain.id}>
              {/* Background track */}
              <circle
                cx={config.size / 2}
                cy={config.size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth}
                strokeDasharray={bgStrokeDasharray}
                strokeDashoffset={bgStrokeDashoffset}
                strokeLinecap="round"
                className="text-muted/30"
              />
              
              {/* Progress arc */}
              <circle
                cx={config.size / 2}
                cy={config.size / 2}
                r={radius}
                fill="none"
                stroke={domain.color}
                strokeWidth={isHovered ? config.strokeWidth + 4 : config.strokeWidth}
                strokeDasharray={progressStrokeDasharray}
                strokeDashoffset={bgStrokeDashoffset}
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-300 cursor-pointer",
                  isHovered && "drop-shadow-lg"
                )}
                onMouseEnter={() => setHoveredDomain(domain.id)}
                onMouseLeave={() => setHoveredDomain(null)}
                onClick={() => onDomainClick?.(domain)}
              />
            </g>
          );
        })}
      </svg>

      {/* Center content */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center"
        style={{ width: config.centerSize, height: config.centerSize }}
      >
        {centerContent || (
          hoveredDomain ? (
            <div className="animate-fade-in">
              <div className="text-lg font-semibold">
                {domains.find(d => d.id === hoveredDomain)?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {domains.find(d => d.id === hoveredDomain)?.progress}%
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Hover to explore
            </div>
          )
        )}
      </div>

      {/* Domain labels (positioned around the wheel) */}
      {size === 'lg' && domains.map((domain, index) => {
        const angle = (index * (360 / domains.length)) - 90;
        const labelRadius = radius + config.strokeWidth + 20;
        const x = config.size / 2 + labelRadius * Math.cos((angle * Math.PI) / 180);
        const y = config.size / 2 + labelRadius * Math.sin((angle * Math.PI) / 180);

        return (
          <div
            key={`label-${domain.id}`}
            className="absolute text-xs font-medium whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
          >
            {domain.icon}
          </div>
        );
      })}
    </div>
  );
};

// INCOG 2.0 domain configuration
export const createINCOGDomains = (progress: Record<string, number>): DomainSegment[] => [
  {
    id: 'attention',
    name: 'Attention',
    progress: progress.attention || 0,
    color: '#f97316',
    description: 'Attention & Processing Speed',
  },
  {
    id: 'memory',
    name: 'Memory',
    progress: progress.memory || 0,
    color: '#8b5cf6',
    description: 'Memory & Learning',
  },
  {
    id: 'executive',
    name: 'Executive',
    progress: progress.executive || 0,
    color: '#06b6d4',
    description: 'Executive Function & Self-Awareness',
  },
  {
    id: 'communication',
    name: 'Communication',
    progress: progress.communication || 0,
    color: '#10b981',
    description: 'Cognitive-Communication',
  },
  {
    id: 'social',
    name: 'Social',
    progress: progress.social || 0,
    color: '#ec4899',
    description: 'Social Cognition',
  },
  {
    id: 'pta',
    name: 'PTA',
    progress: progress.pta || 0,
    color: '#eab308',
    description: 'Post-Traumatic Amnesia',
  },
];

export default DomainWheel;
