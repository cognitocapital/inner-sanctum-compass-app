import { motion } from "framer-motion";
import { Users, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Connection {
  id: string;
  name: string;
  injuryType: string;
  isOnline?: boolean;
}

interface NestVisualizationProps {
  connections: Connection[];
  activeConnection?: string;
  onConnectionClick?: (id: string) => void;
}

export const NestVisualization = ({ 
  connections, 
  activeConnection, 
  onConnectionClick 
}: NestVisualizationProps) => {
  const nodePositions = [
    { x: 50, y: 15 },
    { x: 85, y: 35 },
    { x: 85, y: 65 },
    { x: 50, y: 85 },
    { x: 15, y: 65 },
    { x: 15, y: 35 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      {/* Animated nest background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, 
            hsl(var(--primary) / 0.1) 0%, 
            hsl(var(--primary) / 0.05) 50%, 
            transparent 70%)`
        }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Connection web SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="web-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw connection lines from center to each node */}
        {connections.slice(0, 6).map((_, i) => (
          <motion.line
            key={`center-${i}`}
            x1="50"
            y1="50"
            x2={nodePositions[i].x}
            y2={nodePositions[i].y}
            stroke="url(#web-gradient)"
            strokeWidth="0.5"
            opacity={0.4}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Draw web connections between adjacent nodes */}
        {connections.slice(0, 6).map((_, i) => {
          const next = (i + 1) % Math.min(connections.length, 6);
          return (
            <motion.line
              key={`web-${i}`}
              x1={nodePositions[i].x}
              y1={nodePositions[i].y}
              x2={nodePositions[next].x}
              y2={nodePositions[next].y}
              stroke="url(#web-gradient)"
              strokeWidth="0.5"
              opacity={0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Central phoenix nest */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent shadow-2xl shadow-primary/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{ 
              scale: [1, 1.4, 1.4],
              opacity: [0.5, 0, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Peer nodes */}
      {connections.slice(0, 6).map((connection, i) => (
        <motion.div
          key={connection.id}
          className="absolute"
          style={{
            left: `${nodePositions[i].x}%`,
            top: `${nodePositions[i].y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
        >
          <button
            onClick={() => onConnectionClick?.(connection.id)}
            className={cn(
              "relative w-12 h-12 rounded-full transition-all duration-300",
              "bg-gradient-to-br from-secondary to-muted border-2",
              activeConnection === connection.id 
                ? "border-primary scale-110 shadow-lg shadow-primary/40"
                : "border-border hover:border-primary/50 hover:scale-105"
            )}
          >
            {/* Avatar placeholder */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-teal-400/30 to-blue-500/30 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">
                {connection.name.charAt(0)}
              </span>
            </div>
            
            {/* Online indicator */}
            {connection.isOnline && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </button>

          {/* Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
            <div className="bg-popover px-2 py-1 rounded text-xs shadow-lg">
              {connection.name}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
};

export default NestVisualization;
