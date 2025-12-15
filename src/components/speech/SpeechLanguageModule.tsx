import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic, MicOff, Volume2, MessageSquare, Users, Brain, Smile, Frown,
  Meh, ThumbsUp, RefreshCw, CheckCircle2, PlayCircle, PauseCircle
} from "lucide-react";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { useToast } from "@/hooks/use-toast";

// Prosody Exercise - Functional stub (tested)
export const prosodyExercise = (targetPitch: number = 200, userInput: number) => {
  const delta = Math.abs(userInput - targetPitch);
  if (delta < 20) return { result: 'match', feedback: 'Perfect pitch match!', score: 100 };
  if (delta < 40) return { result: 'close', feedback: 'Very close - adjust slightly', score: 75 };
  if (delta < 60) return { result: 'retry', feedback: 'Try adjusting your pitch', score: 50 };
  return { result: 'retry', feedback: 'Significant adjustment needed', score: 25 };
};

// Pragmatics scenarios for social communication
const pragmaticsScenarios = [
  {
    id: 'greeting',
    title: 'Workplace Greeting',
    context: 'You see your colleague in the morning at work.',
    options: [
      { text: "Good morning! How was your weekend?", score: 100, feedback: "Excellent! Friendly and appropriate." },
      { text: "Hey.", score: 50, feedback: "Brief but acceptable. Adding more shows engagement." },
      { text: "Why are you here so early?", score: 30, feedback: "This might seem confrontational. Try a warmer opener." },
      { text: "I need you to help me with something.", score: 40, feedback: "Jumping straight to requests can seem abrupt." },
    ],
    difficulty: 'beginner'
  },
  {
    id: 'disagreement',
    title: 'Respectful Disagreement',
    context: 'Your friend suggests a restaurant, but you have dietary restrictions.',
    options: [
      { text: "That place has nothing I can eat.", score: 40, feedback: "Direct but might seem dismissive." },
      { text: "I appreciate the suggestion! Could we check if they have vegetarian options?", score: 100, feedback: "Perfect - acknowledges their input while expressing your needs." },
      { text: "I hate that restaurant.", score: 20, feedback: "Too blunt. Try to be more diplomatic." },
      { text: "Sure, whatever you want.", score: 30, feedback: "Being passive might leave your needs unmet." },
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'sympathy',
    title: 'Expressing Sympathy',
    context: 'A coworker tells you their pet passed away.',
    options: [
      { text: "That's life, pets don't live long anyway.", score: 10, feedback: "This minimizes their feelings. Show empathy instead." },
      { text: "I'm so sorry to hear that. Losing a pet is really hard.", score: 100, feedback: "Compassionate and validating response." },
      { text: "When are you getting a new one?", score: 20, feedback: "Too soon - focus on their current feelings first." },
      { text: "At least it wasn't a person.", score: 15, feedback: "Never compare grief. All losses matter." },
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'phone',
    title: 'Phone Conversation',
    context: "You're calling to make a doctor's appointment.",
    options: [
      { text: "I need an appointment. When's the next one?", score: 70, feedback: "Functional but could be more polite." },
      { text: "Hello, I'd like to schedule an appointment please. What times are available?", score: 100, feedback: "Clear, polite, and well-structured." },
      { text: "Give me an appointment.", score: 30, feedback: "Too demanding. Add 'please' and soften your tone." },
      { text: "Um, hi, so I was wondering if maybe possibly...", score: 50, feedback: "Filler words reduce clarity. Be more direct." },
    ],
    difficulty: 'beginner'
  },
];

// Emotion recognition faces
const emotionFaces = [
  { emotion: 'happy', emoji: '😊', intensity: 'high' },
  { emotion: 'sad', emoji: '😢', intensity: 'high' },
  { emotion: 'angry', emoji: '😠', intensity: 'high' },
  { emotion: 'surprised', emoji: '😲', intensity: 'high' },
  { emotion: 'fearful', emoji: '😨', intensity: 'medium' },
  { emotion: 'disgusted', emoji: '🤢', intensity: 'medium' },
  { emotion: 'neutral', emoji: '😐', intensity: 'low' },
  { emotion: 'content', emoji: '🙂', intensity: 'low' },
];

// Voice exercises for dysarthria/prosody
const voiceExercises = [
  { id: 'sustain', name: 'Sustained Vowel', instruction: 'Say "AHHH" for as long as you can', duration: 15 },
  { id: 'pitch', name: 'Pitch Glide', instruction: 'Start low and slide your voice up like a siren', duration: 10 },
  { id: 'volume', name: 'Volume Control', instruction: 'Count 1-5, getting louder with each number', duration: 15 },
  { id: 'rate', name: 'Rate Control', instruction: 'Read: "The quick brown fox" - slowly, then normally', duration: 20 },
  { id: 'articulation', name: 'Tongue Twisters', instruction: 'Say: "Peter Piper picked a peck" clearly 3 times', duration: 20 },
];

interface SpeechLanguageModuleProps {
  onComplete?: (exerciseType: string, score: number) => void;
}

const SpeechLanguageModule = ({ onComplete }: SpeechLanguageModuleProps) => {
  const [activeTab, setActiveTab] = useState('pragmatics');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pragmaticsScores, setPragmaticsScores] = useState<number[]>([]);
  
  // Emotion recognition state
  const [emotionQuiz, setEmotionQuiz] = useState<typeof emotionFaces>([]);
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [emotionGuess, setEmotionGuess] = useState<string | null>(null);
  const [emotionScores, setEmotionScores] = useState<boolean[]>([]);
  
  // Voice exercise state
  const [isRecording, setIsRecording] = useState(false);
  const [currentVoiceExercise, setCurrentVoiceExercise] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [voiceSessionComplete, setVoiceSessionComplete] = useState(false);
  
  const { toast } = useToast();

  // Initialize emotion quiz with shuffled faces
  useEffect(() => {
    const shuffled = [...emotionFaces].sort(() => Math.random() - 0.5).slice(0, 6);
    setEmotionQuiz(shuffled);
  }, []);

  // Voice exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => {
          if (prev <= 1) {
            setIsRecording(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, exerciseTimer]);

  const handlePragmaticsResponse = (optionIndex: number) => {
    setSelectedResponse(optionIndex);
    setShowFeedback(true);
    
    const scenario = pragmaticsScenarios[currentScenario];
    const score = scenario.options[optionIndex].score;
    setPragmaticsScores(prev => [...prev, score]);
  };

  const nextScenario = () => {
    setShowFeedback(false);
    setSelectedResponse(null);
    
    if (currentScenario < pragmaticsScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      const avgScore = Math.round(pragmaticsScores.reduce((a, b) => a + b, 0) / pragmaticsScores.length);
      onComplete?.('pragmatics', avgScore);
      toast({
        title: "Pragmatics Training Complete!",
        description: `Average score: ${avgScore}%`,
      });
    }
  };

  const handleEmotionGuess = (emotion: string) => {
    const correct = emotionQuiz[currentEmotionIndex]?.emotion === emotion;
    setEmotionGuess(emotion);
    setEmotionScores(prev => [...prev, correct]);
    
    setTimeout(() => {
      setEmotionGuess(null);
      if (currentEmotionIndex < emotionQuiz.length - 1) {
        setCurrentEmotionIndex(prev => prev + 1);
      } else {
        const correctCount = emotionScores.filter(Boolean).length + (correct ? 1 : 0);
        const score = Math.round((correctCount / emotionQuiz.length) * 100);
        onComplete?.('emotion_recognition', score);
        toast({
          title: "Emotion Reading Complete!",
          description: `Accuracy: ${score}%`,
        });
      }
    }, 1000);
  };

  const startVoiceExercise = () => {
    const exercise = voiceExercises[currentVoiceExercise];
    setExerciseTimer(exercise.duration);
    setIsRecording(true);
    toast({
      title: exercise.name,
      description: exercise.instruction,
    });
  };

  const nextVoiceExercise = () => {
    if (currentVoiceExercise < voiceExercises.length - 1) {
      setCurrentVoiceExercise(prev => prev + 1);
    } else {
      setVoiceSessionComplete(true);
      onComplete?.('voice', 100);
      toast({
        title: "Voice Training Complete!",
        description: "Great work on your vocal exercises!",
      });
    }
  };

  const scenario = pragmaticsScenarios[currentScenario];
  const emotionProgress = emotionQuiz.length > 0 
    ? Math.round((currentEmotionIndex / emotionQuiz.length) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-white">Speech & Language Therapy</span>
        </div>
        <EvidenceBadge 
          level="A" 
          domain="Cognitive-Communication"
          description="INCOG 2.0 Level A/B for cognitive-communication interventions. ASHA TBI guidelines align with evidence-based practices."
        />
      </div>

      {/* Manuscript Quanta - Ch2 Communication */}
      <Card className="bg-emerald-500/10 border-emerald-500/20">
        <CardContent className="p-3">
          <p className="text-xs text-emerald-200/80 italic">
            "Words sometimes escaped me... sentences jumbled in my mind before they reached my lips."
          </p>
          <p className="text-xs text-emerald-400/60 mt-1">— Ch2: Could Not Talk Properly</p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="pragmatics" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Pragmatics
          </TabsTrigger>
          <TabsTrigger value="emotion" className="text-xs">
            <Smile className="w-3 h-3 mr-1" />
            Emotion
          </TabsTrigger>
          <TabsTrigger value="voice" className="text-xs">
            <Mic className="w-3 h-3 mr-1" />
            Voice
          </TabsTrigger>
        </TabsList>

        {/* Pragmatics Tab */}
        <TabsContent value="pragmatics" className="space-y-4">
          <Card className="bg-slate-900/60 border-emerald-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-emerald-300">{scenario?.title}</CardTitle>
                <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-300">
                  {currentScenario + 1}/{pragmaticsScenarios.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-300">{scenario?.context}</p>
              </div>

              <div className="space-y-2">
                {scenario?.options.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-3 px-4 ${
                      showFeedback
                        ? option.score >= 80
                          ? 'border-green-500/50 bg-green-500/10'
                          : selectedResponse === idx
                            ? 'border-red-500/50 bg-red-500/10'
                            : 'border-gray-500/30'
                        : selectedResponse === idx
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-gray-500/30 hover:border-emerald-500/50'
                    }`}
                    onClick={() => !showFeedback && handlePragmaticsResponse(idx)}
                    disabled={showFeedback}
                  >
                    <span className="text-sm text-gray-200">{option.text}</span>
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {showFeedback && selectedResponse !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-lg ${
                      scenario.options[selectedResponse].score >= 80
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-amber-500/10 border border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {scenario.options[selectedResponse].score >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <RefreshCw className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm text-gray-200">
                          {scenario.options[selectedResponse].feedback}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Score: {scenario.options[selectedResponse].score}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {showFeedback && (
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={nextScenario}
                >
                  {currentScenario < pragmaticsScenarios.length - 1 ? 'Next Scenario' : 'Complete'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emotion Recognition Tab */}
        <TabsContent value="emotion" className="space-y-4">
          <Card className="bg-slate-900/60 border-emerald-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-emerald-300">Emotion Recognition</CardTitle>
                <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-300">
                  {currentEmotionIndex + 1}/{emotionQuiz.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={emotionProgress} className="h-2" />
              
              {emotionQuiz[currentEmotionIndex] && (
                <div className="text-center py-6">
                  <motion.div
                    key={currentEmotionIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl mb-4"
                  >
                    {emotionQuiz[currentEmotionIndex].emoji}
                  </motion.div>
                  <p className="text-sm text-gray-400">What emotion is this person feeling?</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral', 'content'].map((emotion) => (
                  <Button
                    key={emotion}
                    size="sm"
                    variant="outline"
                    className={`text-xs capitalize ${
                      emotionGuess === emotion
                        ? emotion === emotionQuiz[currentEmotionIndex]?.emotion
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-red-500/20 border-red-500'
                        : 'border-gray-500/30 hover:border-emerald-500/50'
                    }`}
                    onClick={() => !emotionGuess && handleEmotionGuess(emotion)}
                    disabled={!!emotionGuess}
                  >
                    {emotion}
                  </Button>
                ))}
              </div>

              {/* Score display */}
              <div className="flex justify-center gap-1 mt-4">
                {emotionScores.map((correct, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full ${correct ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Exercises Tab */}
        <TabsContent value="voice" className="space-y-4">
          <Card className="bg-slate-900/60 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-emerald-300">Voice & Prosody Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!voiceSessionComplete ? (
                <>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {voiceExercises[currentVoiceExercise]?.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {voiceExercises[currentVoiceExercise]?.instruction}
                    </p>
                  </div>

                  {/* Recording indicator */}
                  {isRecording && (
                    <motion.div
                      className="flex flex-col items-center py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Mic className="w-8 h-8 text-red-400" />
                      </motion.div>
                      <div className="text-3xl font-mono text-red-400">{exerciseTimer}s</div>
                      <p className="text-xs text-gray-400 mt-2">Recording in progress...</p>
                    </motion.div>
                  )}

                  <div className="flex gap-2 justify-center">
                    {!isRecording ? (
                      <Button
                        className="bg-emerald-500 hover:bg-emerald-600"
                        onClick={startVoiceExercise}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Exercise
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-red-500/50 text-red-400"
                        onClick={() => setIsRecording(false)}
                      >
                        <PauseCircle className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    )}
                    
                    {!isRecording && exerciseTimer === 0 && (
                      <Button
                        variant="outline"
                        className="border-emerald-500/50"
                        onClick={nextVoiceExercise}
                      >
                        Next Exercise
                      </Button>
                    )}
                  </div>

                  {/* Progress indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {voiceExercises.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${
                          idx < currentVoiceExercise
                            ? 'bg-emerald-500'
                            : idx === currentVoiceExercise
                              ? 'bg-emerald-500/50'
                              : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Voice Training Complete!</h3>
                  <p className="text-sm text-gray-400">
                    You've completed all {voiceExercises.length} voice exercises.
                  </p>
                  <Button
                    className="mt-4 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => {
                      setCurrentVoiceExercise(0);
                      setVoiceSessionComplete(false);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restart Training
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-white/5 border-gray-500/20">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Voice Therapy Tips</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Practice in a quiet environment</li>
                <li>• Stay hydrated - drink water before exercises</li>
                <li>• Don't strain your voice - stop if uncomfortable</li>
                <li>• Practice 2-3 times daily for best results</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpeechLanguageModule;
