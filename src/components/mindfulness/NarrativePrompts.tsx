import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Heart, Sparkles, Brain, Compass, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MindfulMoment {
  id: string;
  title: string;
  prompt: string;
  duration: number;
  type: 'reflection' | 'breathing' | 'visualization' | 'body-scan';
  chapterContext?: string;
  icon: string;
}

interface NarrativePromptsProps {
  currentChapter?: string;
  storyContext?: string;
  onComplete?: (type: string, duration: number) => void;
}

export const NarrativePrompts = ({ currentChapter, storyContext, onComplete }: NarrativePromptsProps) => {
  const [activeMoment, setActiveMoment] = useState<MindfulMoment | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedMoments, setCompletedMoments] = useState<string[]>([]);
  const { toast } = useToast();

  // Story-integrated mindful moments
  const mindfulMoments: MindfulMoment[] = [
    {
      id: 'character-reflection',
      title: 'Character Connection',
      prompt: 'Pause for a moment. How did this scene make you feel? Notice your thoughts without judgment. What emotions are arising as you connect with this character\'s journey?',
      duration: 120,
      type: 'reflection',
      chapterContext: 'After emotional story moments',
      icon: '💭'
    },
    {
      id: 'centering-breath',
      title: 'Centering Breath',
      prompt: 'Take three slow breaths—inhale for 4, hold for 4, exhale for 6—to center yourself as the story unfolds. Feel yourself becoming present with the narrative.',
      duration: 60,
      type: 'breathing',
      chapterContext: 'Before major plot points',
      icon: '🌬️'
    },
    {
      id: 'story-visualization',
      title: 'Story Immersion',
      prompt: 'Picture yourself standing beside the character in this moment. What do you see, hear, or feel? Let yourself become fully present in their world.',
      duration: 180,
      type: 'visualization',
      chapterContext: 'During vivid scene descriptions',
      icon: '👁️'
    },
    {
      id: 'emotional-processing',
      title: 'Emotional Processing',
      prompt: 'Notice what this part of the story has stirred within you. What memories or feelings are awakening? Observe them with kindness and curiosity.',
      duration: 150,
      type: 'reflection',
      chapterContext: 'After challenging scenes',
      icon: '❤️'
    },
    {
      id: 'wisdom-integration',
      title: 'Wisdom Integration',
      prompt: 'What wisdom is this character\'s experience offering you? How might their journey illuminate something in your own life? Rest in this insight.',
      duration: 200,
      type: 'reflection',
      chapterContext: 'After character growth moments',
      icon: '💡'
    },
    {
      id: 'body-awareness',
      title: 'Body Awareness',
      prompt: 'Scan your body from head to toe. How has this story affected you physically? Notice any tension, warmth, or sensations without trying to change them.',
      duration: 240,
      type: 'body-scan',
      chapterContext: 'After intense scenes',
      icon: '🧘'
    },
    {
      id: 'gratitude-pause',
      title: 'Gratitude Pause',
      prompt: 'Take a moment to appreciate this story, this time you\'ve carved out for yourself, and any insights that have emerged. What are you grateful for right now?',
      duration: 90,
      type: 'reflection',
      chapterContext: 'Chapter endings',
      icon: '🙏'
    },
    {
      id: 'phoenix-rising',
      title: 'Phoenix Rising',
      prompt: 'Like the phoenix in the story, what within you is ready to rise? What old patterns or beliefs are you ready to release? Breathe in renewal, breathe out what no longer serves.',
      duration: 300,
      type: 'visualization',
      chapterContext: 'Transformation moments',
      icon: '🔥'
    }
  ];

  // Load completed moments
  useEffect(() => {
    const completed = localStorage.getItem('completedMindfulMoments');
    if (completed) {
      setCompletedMoments(JSON.parse(completed));
    }
  }, []);

  // Save completed moments
  useEffect(() => {
    localStorage.setItem('completedMindfulMoments', JSON.stringify(completedMoments));
  }, [completedMoments]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeMoment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startMoment = (moment: MindfulMoment) => {
    setActiveMoment(moment);
    setTimeLeft(moment.duration);
    setIsActive(true);
  };

  const pauseMoment = () => {
    setIsActive(false);
  };

  const resumeMoment = () => {
    setIsActive(true);
  };

  const resetMoment = () => {
    if (activeMoment) {
      setTimeLeft(activeMoment.duration);
      setIsActive(false);
    }
  };

  const completeMoment = () => {
    if (activeMoment) {
      setIsActive(false);
      
      if (!completedMoments.includes(activeMoment.id)) {
        setCompletedMoments(prev => [...prev, activeMoment.id]);
      }
      
      onComplete?.(activeMoment.type, activeMoment.duration);
      
      toast({
        title: "Mindful Moment Complete! ✨",
        description: `You've taken a beautiful pause with "${activeMoment.title}".`,
      });
      
      // Auto-close after completion
      setTimeout(() => {
        setActiveMoment(null);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reflection': return <Heart className="h-5 w-5" />;
      case 'breathing': return <Sparkles className="h-5 w-5" />;
      case 'visualization': return <Compass className="h-5 w-5" />;
      case 'body-scan': return <Brain className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  // Get contextual moments based on current chapter or story context
  const getContextualMoments = () => {
    // In a real app, this would filter based on story state
    return mindfulMoments;
  };

  return (
    <div className="space-y-6">
      {!activeMoment ? (
        // Moment Selection
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Mindful Story Moments</h3>
            <p className="text-muted-foreground text-sm">
              Deepen your connection to the story through mindful pauses
            </p>
            {currentChapter && (
              <Badge variant="outline" className="mt-2">
                Chapter: {currentChapter}
              </Badge>
            )}
          </div>

          <div className="grid gap-3">
            {getContextualMoments().map((moment) => (
              <Card
                key={moment.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer border-l-4 border-l-primary/40"
                onClick={() => startMoment(moment)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getIcon(moment.type)}
                      <h4 className="font-medium">{moment.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formatTime(moment.duration)}
                      </Badge>
                      {completedMoments.includes(moment.id) && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {moment.prompt.length > 120 
                      ? `${moment.prompt.substring(0, 120)}...` 
                      : moment.prompt
                    }
                  </p>
                  {moment.chapterContext && (
                    <p className="text-xs text-primary/70 italic mt-2">
                      Perfect for: {moment.chapterContext}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Active Moment
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getIcon(activeMoment.type)}
                {activeMoment.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveMoment(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-primary">
                {formatTime(timeLeft)}
              </div>
              <Progress 
                value={((activeMoment.duration - timeLeft) / activeMoment.duration) * 100} 
                className="w-full h-2"
              />
            </div>

            {/* Prompt Display */}
            <div className="p-6 bg-muted/30 rounded-lg">
              <p className="text-center leading-relaxed text-foreground">
                {activeMoment.prompt}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {isActive ? (
                <Button onClick={pauseMoment} size="lg">
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeMoment} size="lg">
                  {timeLeft === activeMoment.duration ? 'Begin' : 'Resume'}
                </Button>
              )}
              
              <Button onClick={resetMoment} variant="outline" size="lg">
                Reset
              </Button>
            </div>

            {/* Gentle reminder */}
            <div className="text-center text-sm text-muted-foreground">
              Take your time. There's no rush in mindfulness.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};