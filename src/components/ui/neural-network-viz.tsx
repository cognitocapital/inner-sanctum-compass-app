import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  active: boolean;
  label?: string;
  region?: 'frontal' | 'temporal' | 'parietal' | 'occipital' | 'limbic';
}

interface NeuralConnection {
  from: string;
  to: string;
  strength: number;
}

interface NeuralNetworkVizProps {
  nodes: NeuralNode[];
  connections: NeuralConnection[];
  activeRegions?: string[];
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabels?: boolean;
  className?: string;
}

const regionColors = {
  frontal: '#f97316', // orange - executive function
  temporal: '#8b5cf6', // purple - memory
  parietal: '#06b6d4', // cyan - sensory
  occipital: '#10b981', // emerald - visual
  limbic: '#ec4899', // pink - emotion
};

export const NeuralNetworkViz = ({
  nodes,
  connections,
  activeRegions = [],
  size = 'md',
  animated = true,
  showLabels = false,
  className,
}: NeuralNetworkVizProps) => {
  const [pulsingNodes, setPulsingNodes] = useState<Set<string>>(new Set());

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-96 h-96',
  };

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      const activeNodes = nodes.filter(n => 
        activeRegions.includes(n.region || '') || Math.random() > 0.7
      );
      setPulsingNodes(new Set(activeNodes.map(n => n.id)));
    }, 1500);

    return () => clearInterval(interval);
  }, [nodes, activeRegions, animated]);

  const getNodeColor = (node: NeuralNode) => {
    if (!node.region) return '#64748b';
    return regionColors[node.region];
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connections */}
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const isActive = pulsingNodes.has(conn.from) || pulsingNodes.has(conn.to);

          return (
            <line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isActive ? '#f97316' : '#475569'}
              strokeWidth={isActive ? conn.strength * 1.5 : conn.strength * 0.5}
              strokeOpacity={isActive ? 0.8 : 0.3}
              className={cn(
                "transition-all duration-500",
                isActive && animated && "animate-pulse"
              )}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = pulsingNodes.has(node.id) || activeRegions.includes(node.region || '');
          const color = getNodeColor(node);

          return (
            <g key={node.id}>
              {/* Glow effect */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={6}
                  fill={color}
                  opacity={0.3}
                  className="animate-ping"
                />
              )}
              
              {/* Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 4 : 3}
                fill={color}
                className={cn(
                  "transition-all duration-300",
                  isActive && "drop-shadow-lg"
                )}
              />

              {/* Label */}
              {showLabels && node.label && (
                <text
                  x={node.x}
                  y={node.y + 8}
                  textAnchor="middle"
                  fontSize="4"
                  fill="currentColor"
                  opacity={0.7}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Region Legend */}
      {showLabels && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 text-xs">
          {Object.entries(regionColors).map(([region, color]) => (
            <div key={region} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="capitalize opacity-70">{region}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Predefined brain network for TBI visualization
export const createBrainNetwork = (): { nodes: NeuralNode[]; connections: NeuralConnection[] } => {
  const nodes: NeuralNode[] = [
    // Frontal (executive)
    { id: 'f1', x: 30, y: 20, active: false, label: 'Planning', region: 'frontal' },
    { id: 'f2', x: 50, y: 15, active: false, label: 'Decision', region: 'frontal' },
    { id: 'f3', x: 70, y: 20, active: false, label: 'Inhibition', region: 'frontal' },
    
    // Temporal (memory)
    { id: 't1', x: 20, y: 50, active: false, label: 'Verbal', region: 'temporal' },
    { id: 't2', x: 80, y: 50, active: false, label: 'Spatial', region: 'temporal' },
    
    // Parietal (sensory)
    { id: 'p1', x: 35, y: 40, active: false, label: 'Touch', region: 'parietal' },
    { id: 'p2', x: 65, y: 40, active: false, label: 'Movement', region: 'parietal' },
    
    // Occipital (visual)
    { id: 'o1', x: 50, y: 80, active: false, label: 'Vision', region: 'occipital' },
    
    // Limbic (emotion)
    { id: 'l1', x: 40, y: 60, active: false, label: 'Emotion', region: 'limbic' },
    { id: 'l2', x: 60, y: 60, active: false, label: 'Memory', region: 'limbic' },
  ];

  const connections: NeuralConnection[] = [
    { from: 'f1', to: 'f2', strength: 2 },
    { from: 'f2', to: 'f3', strength: 2 },
    { from: 'f1', to: 'p1', strength: 1.5 },
    { from: 'f3', to: 'p2', strength: 1.5 },
    { from: 't1', to: 'l1', strength: 2 },
    { from: 't2', to: 'l2', strength: 2 },
    { from: 'l1', to: 'l2', strength: 2.5 },
    { from: 'p1', to: 'l1', strength: 1 },
    { from: 'p2', to: 'l2', strength: 1 },
    { from: 'o1', to: 't1', strength: 1.5 },
    { from: 'o1', to: 't2', strength: 1.5 },
    { from: 'f2', to: 'l1', strength: 1 },
    { from: 'f2', to: 'l2', strength: 1 },
    { from: 'p1', to: 'p2', strength: 1 },
  ];

  return { nodes, connections };
};

export default NeuralNetworkViz;
