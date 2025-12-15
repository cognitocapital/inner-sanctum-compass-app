import { cn } from "@/lib/utils";
import { Heart, Star, Flower2 } from "lucide-react";
import { useEffect, useState } from "react";

interface GardenPlant {
  id: string;
  type: 'flower' | 'star' | 'heart';
  x: number;
  y: number;
  size: number;
  color: string;
  growthStage: number; // 0-1
  label?: string;
}

interface HeartGardenProps {
  entries: number;
  streakDays: number;
  className?: string;
  maxPlants?: number;
}

const plantColors = [
  '#f97316', // orange
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#eab308', // yellow
  '#ef4444', // red
];

const generatePlants = (count: number, maxPlants: number): GardenPlant[] => {
  const plants: GardenPlant[] = [];
  const displayCount = Math.min(count, maxPlants);
  
  for (let i = 0; i < displayCount; i++) {
    const angle = (i / displayCount) * Math.PI * 2;
    const radiusVariation = 0.3 + Math.random() * 0.5;
    const baseRadius = 35;
    
    plants.push({
      id: `plant-${i}`,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'star' : 'flower',
      x: 50 + Math.cos(angle) * baseRadius * radiusVariation,
      y: 50 + Math.sin(angle) * baseRadius * radiusVariation,
      size: 0.6 + Math.random() * 0.6,
      color: plantColors[i % plantColors.length],
      growthStage: Math.min(1, 0.5 + (i / displayCount) * 0.5),
    });
  }
  
  return plants;
};

export const HeartGarden = ({ entries, streakDays, className, maxPlants = 30 }: HeartGardenProps) => {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    setPlants(generatePlants(entries, maxPlants));
  }, [entries, maxPlants]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        id: Date.now(),
      };
      setSparkles(prev => [...prev.slice(-5), newSparkle]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getPlantIcon = (plant: GardenPlant) => {
    const props = {
      className: cn("transition-all duration-500"),
      style: { 
        color: plant.color,
        transform: `scale(${plant.growthStage})`,
        opacity: 0.4 + plant.growthStage * 0.6,
      },
      size: 20 * plant.size,
    };

    switch (plant.type) {
      case 'heart':
        return <Heart {...props} fill={plant.color} />;
      case 'star':
        return <Star {...props} fill={plant.color} />;
      case 'flower':
        return <Flower2 {...props} />;
    }
  };

  return (
    <div className={cn("relative aspect-square bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl overflow-hidden", className)}>
      {/* Ground gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/40 to-transparent" />
      
      {/* Central heart tree */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Tree glow */}
          <div className="absolute inset-0 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
          
          {/* Central heart */}
          <Heart 
            className="w-20 h-20 text-pink-500 animate-pulse" 
            fill="currentColor"
            style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))' }}
          />
          
          {/* Streak indicator */}
          {streakDays > 0 && (
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {streakDays}
            </div>
          )}
        </div>
      </div>

      {/* Plants */}
      {plants.map((plant) => (
        <div
          key={plant.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-scale-in"
          style={{ 
            left: `${plant.x}%`, 
            top: `${plant.y}%`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          {getPlantIcon(plant)}
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-ping"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
        />
      ))}

      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white/80 text-sm">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-pink-400" />
          <span>{entries} entries</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400" />
          <span>{streakDays} day streak</span>
        </div>
      </div>
    </div>
  );
};

export default HeartGarden;
