import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Feather, Flame, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meditation {
  id: string;
  title: string;
  theme: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  script: string[];
  icon: string;
  storyConnection?: string;
}

interface GuidedMeditationsProps {
  onComplete?: (duration: number, theme: string) => void;
}

export const GuidedMeditations = ({ onComplete }: GuidedMeditationsProps) => {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedMeditations, setCompletedMeditations] = useState<string[]>([]);
  const { toast } = useToast();

  const meditations: Meditation[] = [
    {
      id: 'phoenix-rising',
      title: 'Phoenix Rising',
      theme: 'Transformation',
      duration: 300, // 5 minutes
      level: 'beginner',
      description: 'A visualization meditation inspired by the phoenix\'s journey of renewal and rebirth.',
      icon: '🔥',
      storyConnection: 'Connect with the transformative power of the phoenix within you.',
      script: [
        'Find a comfortable position and close your eyes gently.',
        'Take three deep breaths, feeling your body settle with each exhale.',
        'Imagine yourself in a peaceful forest clearing at dawn.',
        'In the center, you see the ashes of what once was.',
        'Feel the warmth of the rising sun on your face.',
        'From the ashes, a small spark begins to glow.',
        'This spark represents your inner strength and resilience.',
        'Watch as the spark grows into a gentle flame.',
        'The flame dances with grace and purpose.',
        'Feel this same fire kindling within your heart.',
        'You are the phoenix, ready to rise anew.',
        'Breathe in strength, breathe out what no longer serves you.',
        'When you\'re ready, slowly open your eyes.'
      ]
    },
    {
      id: 'letting-go',
      title: 'Letting Go',
      theme: 'Release',
      duration: 240, // 4 minutes
      level: 'beginner',
      description: 'A gentle practice for releasing what weighs you down.',
      icon: '🕊️',
      storyConnection: 'Like leaves falling from a tree, learn to release with grace.',
      script: [
        'Sit comfortably and breathe naturally.',
        'Notice any tension in your body without trying to change it.',
        'Imagine yourself standing by a gentle stream.',
        'In your hands, you hold leaves - each one represents something you\'re ready to release.',
        'Look at each leaf with compassion, not judgment.',
        'One by one, place them on the water.',
        'Watch them float away, carried by the current.',
        'Feel the lightness in your hands as you let go.',
        'Your heart becomes spacious and free.',
        'Take a moment to appreciate this feeling of release.',
        'Carry this lightness with you as you return.'
      ]
    },
    {
      id: 'inner-strength',
      title: 'Inner Strength',
      theme: 'Resilience',
      duration: 360, // 6 minutes
      level: 'intermediate',
      description: 'Discover the unshakeable strength that lives within you.',
      icon: '💪',
      storyConnection: 'Channel the courage of heroes who face their challenges.',
      script: [
        'Settle into your breath and close your eyes.',
        'Feel your feet connected to the earth beneath you.',
        'Imagine roots growing from your feet, deep into the ground.',
        'These roots anchor you, making you stable and strong.',
        'Feel the strength of the earth flowing up through your roots.',
        'This strength fills your legs, your core, your entire being.',
        'You are like a mighty tree, flexible yet unbreakable.',
        'Remember a time when you overcame a challenge.',
        'Feel that same strength available to you now.',
        'This strength is always within you, waiting to be called upon.',
        'Breathe in confidence, breathe out doubt.',
        'You are stronger than you know.',
        'Slowly return to the present moment.'
      ]
    },
    {
      id: 'present-moment',
      title: 'Present Moment Awareness',
      theme: 'Mindfulness',
      duration: 180, // 3 minutes
      level: 'beginner',
      description: 'A simple practice to anchor yourself in the here and now.',
      icon: '🌸',
      storyConnection: 'Find peace in the present, like a character finding clarity in stillness.',
      script: [
        'Close your eyes and take a comfortable breath.',
        'Notice five things you can hear right now.',
        'Feel four things touching your body - perhaps your clothes, the chair.',
        'Notice three things you can smell, even very faintly.',
        'Become aware of two tastes in your mouth.',
        'Feel one thing with your hands - perhaps their texture or temperature.',
        'Now simply rest in this moment, exactly as it is.',
        'You are here, you are present, you are enough.',
        'Let this awareness fill you completely.',
        'When you\'re ready, gently open your eyes.'
      ]
    }
  ];

  // Load completed meditations
  useEffect(() => {
    const completed = localStorage.getItem('completedMeditations');
    if (completed) {
      setCompletedMeditations(JSON.parse(completed));
    }
  }, []);

  // Save completed meditations
  useEffect(() => {
    localStorage.setItem('completedMeditations', JSON.stringify(completedMeditations));
  }, [completedMeditations]);

  // Meditation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0 && selectedMeditation) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeMeditation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, selectedMeditation]);

  // Auto-advance meditation steps
  useEffect(() => {
    if (selectedMeditation && isPlaying && timeLeft > 0) {
      const stepDuration = selectedMeditation.duration / selectedMeditation.script.length;
      const expectedStep = Math.floor((selectedMeditation.duration - timeLeft) / stepDuration);
      setCurrentStep(Math.min(expectedStep, selectedMeditation.script.length - 1));
    }
  }, [timeLeft, selectedMeditation, isPlaying]);

  const startMeditation = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
    setTimeLeft(meditation.duration);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetMeditation = () => {
    if (selectedMeditation) {
      setTimeLeft(selectedMeditation.duration);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const completeMeditation = () => {
    if (selectedMeditation) {
      setIsPlaying(false);
      
      if (!completedMeditations.includes(selectedMeditation.id)) {
        setCompletedMeditations(prev => [...prev, selectedMeditation.id]);
      }
      
      onComplete?.(selectedMeditation.duration, selectedMeditation.theme);
      
      toast({
        title: "Meditation Complete! 🧘‍♀️",
        description: `You've completed "${selectedMeditation.title}". Well done!`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMeditationsByLevel = (level: string) => {
    return meditations.filter(m => m.level === level);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case '🔥': return <Flame className="h-5 w-5" />;
      case '🕊️': return <Feather className="h-5 w-5" />;
      case '💪': return <Heart className="h-5 w-5" />;
      case '🌸': return <Sparkles className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {!selectedMeditation ? (
        // Meditation Selection
        <Tabs defaultValue="beginner" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <TabsContent key={level} value={level} className="space-y-4">
              <div className="grid gap-4">
                {getMeditationsByLevel(level).map((meditation) => (
                  <Card 
                    key={meditation.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => startMeditation(meditation)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getIcon(meditation.icon)}
                          {meditation.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{formatTime(meditation.duration)}</Badge>
                          {completedMeditations.includes(meditation.id) && (
                            <Badge className="bg-green-500/20 text-green-400">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{meditation.description}</p>
                      {meditation.storyConnection && (
                        <p className="text-sm text-primary/80 italic">
                          {meditation.storyConnection}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Active Meditation
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getIcon(selectedMeditation.icon)}
                {selectedMeditation.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMeditation(null)}
              >
                Choose Different
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">
                {formatTime(timeLeft)}
              </div>
              <Progress 
                value={((selectedMeditation.duration - timeLeft) / selectedMeditation.duration) * 100} 
                className="w-full h-2"
              />
            </div>

            {/* Current Meditation Step */}
            <div className="p-6 bg-muted/30 rounded-lg text-center">
              <p className="text-lg leading-relaxed">
                {selectedMeditation.script[currentStep]}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4">
              <Button onClick={togglePlayPause} size="lg">
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    {timeLeft === selectedMeditation.duration ? 'Start' : 'Resume'}
                  </>
                )}
              </Button>
              
              <Button onClick={resetMeditation} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
              
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                size="lg"
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Step Indicator */}
            <div className="text-center text-sm text-muted-foreground">
              Step {currentStep + 1} of {selectedMeditation.script.length}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};