import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HatchingGameProps {
  gameLevel: number;
  onComplete: (points: number) => void;
}

export const HatchingGame = ({ gameLevel, onComplete }: HatchingGameProps) => {
  const [cards, setCards] = useState<Array<{id: number, symbol: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phoenixSymbols = ['🥚', '🪶', '🔥', '✨', '🌟', '🦅', '👑', '💎'];
  
  const initializeGame = () => {
    const gridSize = Math.min(4 + gameLevel, 8); // 4x4 to 8x8 max
    const pairCount = (gridSize * gridSize) / 2;
    const selectedSymbols = phoenixSymbols.slice(0, pairCount);
    
    const gameCards = [];
    selectedSymbols.forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gameLevel]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (matches === totalPairs && totalPairs > 0) {
      setIsComplete(true);
      const points = 50 + (gameLevel * 10) + (matches * 5);
      setTimeout(() => onComplete(points), 1000);
    }
  }, [matches, cards.length, gameLevel, onComplete]);

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId)) return;
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const gridSize = Math.ceil(Math.sqrt(cards.length));

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
      <CardHeader>
        <CardTitle className="text-center text-orange-300">
          🥚 Hatching - Memory Match
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Help your phoenix hatch by matching the pairs! Current matches: {matches}
        </p>
      </CardHeader>
      <CardContent>
        <div 
          className="grid gap-2 mx-auto max-w-md"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            aspectRatio: '1'
          }}
        >
          {cards.map((card) => (
            <Button
              key={card.id}
              variant="outline"
              className={`aspect-square text-2xl transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-orange-500/20 border-orange-400 scale-105'
                  : 'bg-muted border-muted-foreground/20 hover:bg-orange-500/10'
              } ${card.isMatched ? 'animate-pulse' : ''}`}
              onClick={() => flipCard(card.id)}
              disabled={card.isFlipped || card.isMatched || isComplete}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </Button>
          ))}
        </div>
        
        {isComplete && (
          <div className="text-center mt-4 space-y-2">
            <div className="text-2xl animate-bounce">🐣</div>
            <p className="text-orange-300 font-semibold">
              Congratulations! Your phoenix is hatching!
            </p>
            <Button onClick={initializeGame} className="mt-2">
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};