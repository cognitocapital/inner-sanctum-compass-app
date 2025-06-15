import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearningToFlyGameProps {
  gameLevel: number;
  onComplete: (points: number) => void;
}

export const LearningToFlyGame = ({ gameLevel, onComplete }: LearningToFlyGameProps) => {
  const [phoenixPosition, setPhoenixPosition] = useState({ x: 50, y: 50 });
  const [rings, setRings] = useState<Array<{id: number, x: number, y: number, collected: boolean}>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const initializeGame = () => {
    const ringCount = Math.min(5 + gameLevel, 15);
    const newRings = Array.from({ length: ringCount }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // Keep rings away from edges
      y: Math.random() * 80 + 10,
      collected: false
    }));
    
    setRings(newRings);
    setPhoenixPosition({ x: 50, y: 50 });
    setScore(0);
    setTimeLeft(30);
    setGameActive(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gameLevel]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setGameActive(true);
  };

  const endGame = () => {
    setGameActive(false);
    const points = score * 10 + (gameLevel * 20);
    setTimeout(() => onComplete(points), 1000);
  };

  const movePhoenix = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameActive) return;
    
    setPhoenixPosition(prev => {
      const moveDistance = 8;
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case 'up':
          newY = Math.max(5, prev.y - moveDistance);
          break;
        case 'down':
          newY = Math.min(95, prev.y + moveDistance);
          break;
        case 'left':
          newX = Math.max(5, prev.x - moveDistance);
          break;
        case 'right':
          newX = Math.min(95, prev.x + moveDistance);
          break;
      }
      
      // Check for ring collisions
      setRings(prevRings => {
        const updatedRings = prevRings.map(ring => {
          if (!ring.collected) {
            const distance = Math.sqrt(
              Math.pow(newX - ring.x, 2) + Math.pow(newY - ring.y, 2)
            );
            if (distance < 8) {
              setScore(prevScore => prevScore + 1);
              return { ...ring, collected: true };
            }
          }
          return ring;
        });
        
        // Check if all rings collected
        if (updatedRings.every(ring => ring.collected)) {
          setTimeout(() => endGame(), 500);
        }
        
        return updatedRings;
      });
      
      return { x: newX, y: newY };
    });
  };

  const collectedRings = rings.filter(ring => ring.collected).length;
  const totalRings = rings.length;

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-center text-blue-300">
          🕊️ Learning to Fly - Coordination
        </CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Rings: {collectedRings}/{totalRings}</span>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={gameAreaRef}
          className="relative w-full h-64 bg-gradient-to-b from-sky-500/20 to-blue-500/20 rounded-lg border border-blue-500/30 overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #7dd3fc20, #3b82f620)' }}
        >
          {/* Phoenix */}
          <div
            className="absolute w-8 h-8 text-2xl transition-all duration-200 flex items-center justify-center"
            style={{
              left: `${phoenixPosition.x}%`,
              top: `${phoenixPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            🦅
          </div>
          
          {/* Rings */}
          {rings.map(ring => (
            <div
              key={ring.id}
              className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                ring.collected 
                  ? 'border-green-400 bg-green-400/20 scale-150 opacity-50' 
                  : 'border-yellow-400 bg-yellow-400/20 animate-pulse'
              }`}
              style={{
                left: `${ring.x}%`,
                top: `${ring.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {!ring.collected && (
                <div className="w-full h-full rounded-full border border-yellow-300 animate-ping"></div>
              )}
            </div>
          ))}
          
          {/* Clouds for atmosphere */}
          <div className="absolute top-4 left-8 text-white opacity-30">☁️</div>
          <div className="absolute top-12 right-12 text-white opacity-20">☁️</div>
          <div className="absolute bottom-8 left-1/3 text-white opacity-25">☁️</div>
        </div>
        
        <div className="mt-4 space-y-4">
          {!gameActive && timeLeft === 30 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Guide your phoenix through all the rings! Use the arrow buttons to fly.
              </p>
              <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                Start Flying! 🚀
              </Button>
            </div>
          )}
          
          {gameActive && (
            <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
              <div></div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => movePhoenix('up')}
                className="aspect-square"
              >
                ⬆️
              </Button>
              <div></div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => movePhoenix('left')}
                className="aspect-square"
              >
                ⬅️
              </Button>
              <div className="flex items-center justify-center text-2xl">🦅</div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => movePhoenix('right')}
                className="aspect-square"
              >
                ➡️
              </Button>
              <div></div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => movePhoenix('down')}
                className="aspect-square"
              >
                ⬇️
              </Button>
              <div></div>
            </div>
          )}
          
          {!gameActive && timeLeft < 30 && (
            <div className="text-center space-y-2">
              <div className="text-2xl">
                {collectedRings === totalRings ? '🎉' : '🦅'}
              </div>
              <p className="text-blue-300 font-semibold">
                {collectedRings === totalRings 
                  ? 'Perfect flight! Your phoenix is learning to soar!' 
                  : `Great effort! Collected ${collectedRings}/${totalRings} rings!`
                }
              </p>
              <Button onClick={initializeGame} className="mt-2">
                Fly Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};