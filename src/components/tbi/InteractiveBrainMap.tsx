import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Target, MessageCircle } from "lucide-react";

interface BrainRegion {
  id: string;
  name: string;
  domain: "attention" | "memory" | "executive" | "communication";
  x: number;
  y: number;
  description: string;
  color: string;
}

interface InteractiveBrainMapProps {
  activeDomain: string | null;
  onDomainSelect: (domain: string) => void;
  deficitScores?: Record<string, number>;
}

const brainRegions: BrainRegion[] = [
  {
    id: "prefrontal",
    name: "Prefrontal Cortex",
    domain: "executive",
    x: 25,
    y: 30,
    description: "Planning, decision-making, executive functions",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: "frontal",
    name: "Frontal Lobe",
    domain: "attention",
    x: 35,
    y: 25,
    description: "Attention, concentration, focus",
    color: "from-red-500 to-orange-600"
  },
  {
    id: "temporal",
    name: "Temporal Lobe",
    domain: "memory",
    x: 20,
    y: 55,
    description: "Memory formation and recall",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "parietal",
    name: "Parietal Lobe",
    domain: "attention",
    x: 55,
    y: 30,
    description: "Processing speed, spatial awareness",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "broca",
    name: "Broca's Area",
    domain: "communication",
    x: 30,
    y: 45,
    description: "Speech production, social cognition",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "wernicke",
    name: "Wernicke's Area",
    domain: "communication",
    x: 60,
    y: 50,
    description: "Language comprehension",
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: "hippocampus",
    name: "Hippocampus",
    domain: "memory",
    x: 50,
    y: 60,
    description: "Long-term memory consolidation",
    color: "from-teal-500 to-cyan-600"
  }
];

const getDomainIcon = (domain: string) => {
  switch (domain) {
    case "attention": return Zap;
    case "memory": return Brain;
    case "executive": return Target;
    case "communication": return MessageCircle;
    default: return Brain;
  }
};

const InteractiveBrainMap = ({ 
  activeDomain, 
  onDomainSelect, 
  deficitScores = {} 
}: InteractiveBrainMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [showPulse, setShowPulse] = useState(true);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Brain outline SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Neural connections */}
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.5)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Brain silhouette */}
        <path
          d="M50 10 C20 10, 5 35, 10 55 C12 70, 25 85, 50 90 C75 85, 88 70, 90 55 C95 35, 80 10, 50 10 Z"
          fill="url(#neuralGradient)"
          stroke="rgba(147, 51, 234, 0.5)"
          strokeWidth="1"
          className="drop-shadow-lg"
        />
        
        {/* Neural network lines */}
        {brainRegions.map((region, i) => 
          brainRegions.slice(i + 1).map((target, j) => (
            <motion.line
              key={`${region.id}-${target.id}`}
              x1={region.x}
              y1={region.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(147, 51, 234, 0.2)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                stroke: activeDomain && (region.domain === activeDomain || target.domain === activeDomain)
                  ? "rgba(147, 51, 234, 0.6)"
                  : "rgba(147, 51, 234, 0.2)"
              }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          ))
        )}
        
        {/* Signal pulses along connections */}
        {showPulse && brainRegions.slice(0, 3).map((region, i) => (
          <motion.circle
            key={`pulse-${region.id}`}
            r="1"
            fill="rgba(59, 130, 246, 0.8)"
            filter="url(#glow)"
            initial={{ cx: region.x, cy: region.y }}
            animate={{
              cx: [region.x, brainRegions[(i + 3) % brainRegions.length].x],
              cy: [region.y, brainRegions[(i + 3) % brainRegions.length].y],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Interactive brain regions */}
      {brainRegions.map((region) => {
        const Icon = getDomainIcon(region.domain);
        const isActive = activeDomain === region.domain;
        const isHovered = hoveredRegion === region.id;
        const deficitLevel = deficitScores[region.domain] || 0;
        
        return (
          <motion.button
            key={region.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 
              rounded-full p-1.5 cursor-pointer transition-all duration-300
              ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-125' : ''}
              bg-gradient-to-br ${region.color}
            `}
            style={{ left: `${region.x}%`, top: `${region.y}%` }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => onDomainSelect(region.domain)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: isActive ? 1.25 : 1,
              boxShadow: isActive 
                ? '0 0 20px rgba(147, 51, 234, 0.8)' 
                : deficitLevel > 0.5 
                  ? '0 0 15px rgba(239, 68, 68, 0.6)' 
                  : '0 0 10px rgba(59, 130, 246, 0.4)'
            }}
            transition={{ duration: 0.3, delay: brainRegions.indexOf(region) * 0.1 }}
          >
            <Icon className="w-3 h-3 text-white" />
            
            {/* Deficit indicator */}
            {deficitLevel > 0.5 && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
              bg-background/95 backdrop-blur-sm border border-border rounded-lg 
              p-3 shadow-xl max-w-xs z-10"
          >
            {(() => {
              const region = brainRegions.find(r => r.id === hoveredRegion);
              if (!region) return null;
              const Icon = getDomainIcon(region.domain);
              return (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded bg-gradient-to-br ${region.color}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{region.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{region.description}</p>
                  <div className="mt-1 text-xs text-primary capitalize">
                    Domain: {region.domain}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Domain legend */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-3 flex-wrap">
        {["attention", "memory", "executive", "communication"].map((domain) => {
          const Icon = getDomainIcon(domain);
          const isActive = activeDomain === domain;
          return (
            <button
              key={domain}
              onClick={() => onDomainSelect(domain)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs 
                transition-all duration-200 capitalize
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Icon className="w-3 h-3" />
              {domain}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveBrainMap;
