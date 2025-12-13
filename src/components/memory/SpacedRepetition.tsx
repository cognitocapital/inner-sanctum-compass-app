import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw, CheckCircle, XCircle, Clock, Sparkles, Trophy } from 'lucide-react';

interface FlashCard {
  id: string;
  question: string;
  answer: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: number | null;
  nextReview: number | null;
  correctStreak: number;
  category: string;
}

// Cards tied to manuscript content
const initialCards: FlashCard[] = [
  {
    id: '1',
    question: 'What is the first step in the "Choose Your Own Adventure" approach to recovery?',
    answer: 'Taking ownership of your rehabilitation journey and making conscious choices about your path forward.',
    chapter: 'Chapter 5',
    difficulty: 'medium',
    lastReviewed: null,
    nextReview: null,
    correctStreak: 0,
    category: 'Self-Management',
  },
  {
    id: '2',
    question: 'What breathing technique helps regulate the nervous system during moments of overwhelm?',
    answer: 'Box breathing: Inhale for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts.',
    chapter: 'Prologue',
    difficulty: 'easy',
    lastReviewed: null,
    nextReview: null,
    correctStreak: 0,
    category: 'Emotional Regulation',
  },
  {
    id: '3',
    question: 'According to INCOG 2.0, what is the recommended approach for memory rehabilitation?',
    answer: 'Combine internal strategies (mnemonics, visualization) with external aids (calendars, reminders) for optimal compensation.',
    chapter: 'INCOG Guidelines',
    difficulty: 'hard',
    lastReviewed: null,
    nextReview: null,
    correctStreak: 0,
    category: 'Memory Strategies',
  },
  {
    id: '4',
    question: 'What is the Plan-Do-Check-Review cycle used for in Goal Management Training?',
    answer: 'It structures goal completion into manageable phases: defining steps (Plan), executing them (Do), monitoring progress (Check), and reflecting on outcomes (Review).',
    chapter: 'INCOG Guidelines',
    difficulty: 'medium',
    lastReviewed: null,
    nextReview: null,
    correctStreak: 0,
    category: 'Executive Function',
  },
  {
    id: '5',
    question: 'What is "errorless learning" and when should it be used?',
    answer: 'A technique where tasks are structured to minimize mistakes during learning. Best used for procedural skills and daily routines to build confidence without failure.',
    chapter: 'INCOG Guidelines',
    difficulty: 'hard',
    lastReviewed: null,
    nextReview: null,
    correctStreak: 0,
    category: 'ADL Training',
  },
  {
    id: '6',
    question: 'What role does gratitude play in TBI recovery according to the manuscript?',
    answer: 'Gratitude rewires the brain towards positive neural pathways, reducing rumination and supporting emotional regulation during recovery.',
    chapter: 'Chapter 13',
    difficulty: 'easy',
    lastReviewed: null,
    nextReview: null,
    correctStreak: 0,
    category: 'Mindset',
  },
];

const SpacedRepetition = () => {
  const [cards, setCards] = useState<FlashCard[]>(() => {
    const saved = localStorage.getItem('phoenix-spaced-repetition');
    return saved ? JSON.parse(saved) : initialCards;
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Get cards due for review
  const dueCards = cards.filter(card => {
    if (!card.nextReview) return true;
    return card.nextReview <= Date.now();
  });

  const currentCard = dueCards[currentCardIndex];
  const progress = dueCards.length > 0 
    ? ((sessionStats.correct + sessionStats.incorrect) / dueCards.length) * 100 
    : 100;

  useEffect(() => {
    localStorage.setItem('phoenix-spaced-repetition', JSON.stringify(cards));
  }, [cards]);

  const calculateNextReview = (card: FlashCard, correct: boolean): number => {
    const baseInterval = correct ? Math.pow(2, card.correctStreak + 1) : 1;
    const hours = baseInterval * 4; // 4 hours minimum, doubles with each correct answer
    return Date.now() + hours * 60 * 60 * 1000;
  };

  const handleResponse = (correct: boolean) => {
    if (!currentCard) return;

    setCards(prev => prev.map(card => {
      if (card.id === currentCard.id) {
        return {
          ...card,
          lastReviewed: Date.now(),
          nextReview: calculateNextReview(card, correct),
          correctStreak: correct ? card.correctStreak + 1 : 0,
        };
      }
      return card;
    }));

    setSessionStats(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
    }));

    if (currentCardIndex + 1 >= dueCards.length) {
      setIsSessionComplete(true);
    } else {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsSessionComplete(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return '';
    }
  };

  if (isSessionComplete) {
    const accuracy = sessionStats.correct / (sessionStats.correct + sessionStats.incorrect) * 100;
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-orange-500/20 to-purple-500/10 border-orange-500/30">
          <CardContent className="pt-8 text-center">
            <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-6">Great work on your memory training</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-500/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{sessionStats.correct}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 bg-red-500/20 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{sessionStats.incorrect}</div>
                <div className="text-xs text-muted-foreground">To Review</div>
              </div>
              <div className="p-4 bg-orange-500/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">{accuracy.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <Button onClick={resetSession} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            <Brain className="w-3 h-3 mr-1" />
            INCOG 2.0 Level A Evidence
          </Badge>
          <span className="text-sm text-muted-foreground">Spaced Repetition Memory Training</span>
        </div>

        <Card className="bg-muted/30">
          <CardContent className="pt-8 text-center">
            <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground mb-4">
              No cards due for review. Check back later for your next session.
            </p>
            <Button variant="outline" onClick={() => {
              setCards(initialCards);
              resetSession();
            }}>
              Reset All Cards
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* INCOG Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          <Brain className="w-3 h-3 mr-1" />
          INCOG 2.0 Level A Evidence
        </Badge>
        <span className="text-sm text-muted-foreground">Spaced Repetition Memory Training</span>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Session Progress</span>
          <span>{currentCardIndex + 1} of {dueCards.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Card */}
      {currentCard && (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500/30 min-h-[300px]">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">{currentCard.chapter}</Badge>
                <Badge className={`text-xs ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty}
                </Badge>
              </div>
              <Badge variant="secondary" className="text-xs">{currentCard.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-white">{currentCard.question}</p>
            </div>

            {showAnswer ? (
              <>
                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <p className="text-sm text-gray-300">{currentCard.answer}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleResponse(false)}
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Review Again
                  </Button>
                  <Button
                    onClick={() => handleResponse(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Got It!
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => setShowAnswer(true)}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Show Answer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Spaced Repetition</strong> optimizes memory retention by reviewing information at 
            increasing intervals. Cards you answer correctly appear less frequently; missed cards 
            repeat sooner—matching how your brain naturally consolidates memories.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpacedRepetition;
