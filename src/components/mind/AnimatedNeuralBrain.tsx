import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrainRegion {
  id: string;
  name: string;
  path: string;
  color: string;
  activeColor: string;
  description: string;
  domain: 'attention' | 'memory' | 'executive' | 'language' | 'emotional' | 'sensory';
}

interface AnimatedNeuralBrainProps {
  activeRegions: string[];
  scores?: Record<string, number>;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const brainRegions: BrainRegion[] = [
  {
    id: 'frontal',
    name: 'Frontal Lobe',
    path: 'M 50 15 Q 80 10 95 30 Q 100 50 90 60 L 60 55 Q 40 50 50 15',
    color: '#1e3a5f',
    activeColor: '#f97316',
    description: 'Executive function, planning, decision-making',
    domain: 'executive'
  },
  {
    id: 'temporal_left',
    name: 'Left Temporal',
    path: 'M 10 50 Q 5 60 10 75 Q 20 85 35 80 L 40 60 Q 30 50 10 50',
    color: '#1e3a5f',
    activeColor: '#8b5cf6',
    description: 'Language, verbal memory',
    domain: 'memory'
  },
  {
    id: 'temporal_right',
    name: 'Right Temporal',
    path: 'M 90 50 Q 95 60 90 75 Q 80 85 65 80 L 60 60 Q 70 50 90 50',
    color: '#1e3a5f',
    activeColor: '#8b5cf6',
    description: 'Music, spatial memory',
    domain: 'memory'
  },
  {
    id: 'parietal',
    name: 'Parietal Lobe',
    path: 'M 50 15 Q 40 20 35 35 L 40 55 L 60 55 L 65 35 Q 60 20 50 15',
    color: '#1e3a5f',
    activeColor: '#06b6d4',
    description: 'Sensory processing, attention',
    domain: 'attention'
  },
  {
    id: 'occipital',
    name: 'Occipital Lobe',
    path: 'M 35 80 Q 40 95 50 98 Q 60 95 65 80 L 60 70 Q 50 65 40 70 L 35 80',
    color: '#1e3a5f',
    activeColor: '#10b981',
    description: 'Visual processing',
    domain: 'sensory'
  },
  {
    id: 'limbic',
    name: 'Limbic System',
    path: 'M 40 55 Q 45 65 50 68 Q 55 65 60 55 L 55 50 Q 50 48 45 50 L 40 55',
    color: '#1e3a5f',
    activeColor: '#ec4899',
    description: 'Emotion, motivation',
    domain: 'emotional'
  }
];

// Neural connections
const connections = [
  { from: 'frontal', to: 'parietal', x1: 70, y1: 35, x2: 50, y2: 40 },
  { from: 'frontal', to: 'temporal_left', x1: 60, y1: 55, x2: 35, y2: 65 },
  { from: 'frontal', to: 'temporal_right', x1: 75, y1: 55, x2: 65, y2: 65 },
  { from: 'parietal', to: 'occipital', x1: 50, y1: 50, x2: 50, y2: 75 },
  { from: 'temporal_left', to: 'limbic', x1: 35, y1: 70, x2: 45, y2: 58 },
  { from: 'temporal_right', to: 'limbic', x1: 65, y1: 70, x2: 55, y2: 58 },
  { from: 'limbic', to: 'frontal', x1: 50, y1: 52, x2: 70, y2: 40 },
  { from: 'parietal', to: 'limbic', x1: 50, y1: 45, x2: 50, y2: 55 }
];

export const AnimatedNeuralBrain = ({
  activeRegions,
  scores = {},
  size = 'md',
  showLabels = false,
  className
}: AnimatedNeuralBrainProps) => {
  const [pulsingConnections, setPulsingConnections] = useState<Set<number>>(new Set());
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-96 h-96'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const activeConnectionIndices = connections
        .map((conn, i) => ({ conn, i }))
        .filter(({ conn }) => 
          activeRegions.includes(conn.from) || activeRegions.includes(conn.to)
        )
        .map(({ i }) => i);
      
      setPulsingConnections(new Set(activeConnectionIndices));
    }, 1500);

    return () => clearInterval(interval);
  }, [activeRegions]);

  const getRegionOpacity = (regionId: string) => {
    if (scores[regionId] !== undefined) {
      return 0.3 + (scores[regionId] / 100) * 0.7;
    }
    return activeRegions.includes(regionId) ? 1 : 0.4;
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg viewBox="0 0 100 110" className="w-full h-full">
        {/* Background glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="brainGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Background */}
        <ellipse cx="50" cy="55" rx="45" ry="45" fill="url(#brainGradient)" />

        {/* Neural connections */}
        {connections.map((conn, i) => (
          <motion.line
            key={i}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke={pulsingConnections.has(i) ? "#f97316" : "#374151"}
            strokeWidth={pulsingConnections.has(i) ? 1.5 : 0.5}
            strokeOpacity={pulsingConnections.has(i) ? 0.8 : 0.3}
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              strokeOpacity: pulsingConnections.has(i) ? [0.3, 0.8, 0.3] : 0.3
            }}
            transition={{ 
              pathLength: { duration: 2, ease: "easeInOut" },
              strokeOpacity: { duration: 1.5, repeat: Infinity }
            }}
          />
        ))}

        {/* Brain regions */}
        {brainRegions.map((region) => {
          const isActive = activeRegions.includes(region.domain) || activeRegions.includes(region.id);
          const isHovered = hoveredRegion === region.id;

          return (
            <motion.path
              key={region.id}
              d={region.path}
              fill={isActive || isHovered ? region.activeColor : region.color}
              fillOpacity={getRegionOpacity(region.id)}
              stroke={isActive || isHovered ? region.activeColor : "#4b5563"}
              strokeWidth={isActive || isHovered ? 1.5 : 0.5}
              filter={isActive ? "url(#glow)" : undefined}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              initial={{ scale: 1 }}
              animate={{ 
                scale: isActive ? [1, 1.02, 1] : 1,
                fillOpacity: getRegionOpacity(region.id)
              }}
              transition={{ 
                scale: { duration: 2, repeat: isActive ? Infinity : 0 },
                fillOpacity: { duration: 0.3 }
              }}
              className="cursor-pointer"
            />
          );
        })}

        {/* Neural nodes */}
        {brainRegions.map((region, i) => {
          const isActive = activeRegions.includes(region.domain) || activeRegions.includes(region.id);
          const cx = 50 + Math.cos((i * Math.PI * 2) / 6) * 25;
          const cy = 55 + Math.sin((i * Math.PI * 2) / 6) * 20;

          return (
            <motion.circle
              key={`node-${region.id}`}
              cx={cx}
              cy={cy}
              r={isActive ? 3 : 2}
              fill={isActive ? region.activeColor : "#6b7280"}
              animate={{
                r: isActive ? [2, 4, 2] : 2,
                opacity: isActive ? [0.5, 1, 0.5] : 0.4
              }}
              transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            />
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-orange-600/50 rounded-lg px-3 py-2 text-xs max-w-[200px] text-center"
        >
          <div className="font-semibold text-orange-200">
            {brainRegions.find(r => r.id === hoveredRegion)?.name}
          </div>
          <div className="text-orange-300/70">
            {brainRegions.find(r => r.id === hoveredRegion)?.description}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      {showLabels && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-orange-300/70">Executive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-orange-300/70">Memory</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span className="text-orange-300/70">Attention</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <span className="text-orange-300/70">Emotion</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedNeuralBrain;
