import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PhoenixNestProps {
  phoenixScore: number;
  totalMeditations: number;
  completedGames: number;
  gameLevel: number;
}

export const PhoenixNest = ({ phoenixScore, totalMeditations, completedGames, gameLevel }: PhoenixNestProps) => {
  const getNestDecorations = () => {
    const decorations = [];
    
    // Flowers for meditation sessions
    const flowerCount = Math.min(Math.floor(totalMeditations / 2), 5);
    for (let i = 0; i < flowerCount; i++) {
      decorations.push({ type: 'flower', emoji: '🌸', name: 'Meditation Flowers' });
    }
    
    // Glowing embers for completed games
    const emberCount = Math.min(Math.floor(completedGames / 3), 4);
    for (let i = 0; i < emberCount; i++) {
      decorations.push({ type: 'ember', emoji: '✨', name: 'Game Embers' });
    }
    
    // Crystals for high scores
    if (phoenixScore >= 200) decorations.push({ type: 'crystal', emoji: '💎', name: 'Achievement Crystal' });
    if (phoenixScore >= 500) decorations.push({ type: 'crystal', emoji: '🔮', name: 'Mastery Orb' });
    if (phoenixScore >= 1000) decorations.push({ type: 'crystal', emoji: '👑', name: 'Phoenix Crown' });
    
    return decorations;
  };

  const decorations = getNestDecorations();

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          🏠 Phoenix Nest
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
            Level {gameLevel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🪺</div>
            <p className="text-sm text-muted-foreground">
              Your nest grows more beautiful with each achievement
            </p>
          </div>
          
          {decorations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-orange-300 mb-2">Decorations Earned:</h4>
              <div className="grid grid-cols-3 gap-2">
                {decorations.map((decoration, index) => (
                  <div 
                    key={index}
                    className="bg-orange-500/10 p-2 rounded text-center border border-orange-500/20"
                  >
                    <div className="text-lg">{decoration.emoji}</div>
                    <div className="text-xs text-orange-200">{decoration.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {decorations.length === 0 && (
            <div className="text-center text-muted-foreground text-sm">
              Complete games and meditations to earn nest decorations!
            </div>
          )}
          
          <div className="text-xs text-center text-muted-foreground mt-4">
            🌸 Flowers: {Math.floor(totalMeditations / 2)}/5 • 
            ✨ Embers: {Math.floor(completedGames / 3)}/4 • 
            💎 Crystals: {phoenixScore >= 1000 ? 3 : phoenixScore >= 500 ? 2 : phoenixScore >= 200 ? 1 : 0}/3
          </div>
        </div>
      </CardContent>
    </Card>
  );
};