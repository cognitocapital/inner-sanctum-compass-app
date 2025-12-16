import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Wind, Zap, Moon, ArrowRight, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface FatigueQuizProps {
  onComplete: (results: QuizResults) => void;
  className?: string;
}

export interface QuizResults {
  fatigue: number;
  anxiety: number;
  focus: number;
  agitation: number; // ABS scale 1-4
  recommendedPattern: {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
    description: string;
  };
  quantaMessage: string;
  safeForRetention: boolean; // Based on ABS and other factors
}

// ABS Agitation Scale descriptions (simplified for self-report per 2025 Canadian Guidelines)
const absDescriptions: Record<number, { label: string; description: string }> = {
  1: { label: 'Calm', description: 'Relaxed, cooperative, no agitation' },
  2: { label: 'Mild', description: 'Slight restlessness, easily redirected' },
  3: { label: 'Moderate', description: 'Restless, some difficulty focusing' },
  4: { label: 'Severe', description: 'Very agitated, difficulty staying still' },
};

const questions = [
  {
    id: 'agitation',
    question: 'How agitated or restless do you feel?',
    icon: Activity,
    lowLabel: 'Calm (1)',
    highLabel: 'Very Agitated (4)',
    quanta: 'ABS Scale: Agitation impacts breath safety',
    isABS: true,
    min: 1,
    max: 4,
  },
  {
    id: 'fatigue',
    question: 'How fatigued do you feel right now?',
    icon: Moon,
    lowLabel: 'Energized',
    highLabel: 'Exhausted',
    quanta: 'Ch3: "Some days the fatigue was crushing..."',
    isABS: false,
    min: 1,
    max: 10,
  },
  {
    id: 'anxiety',
    question: 'What\'s your anxiety level?',
    icon: Wind,
    lowLabel: 'Calm',
    highLabel: 'Overwhelmed',
    quanta: 'Ch3: "The emotional rollercoaster was relentless..."',
    isABS: false,
    min: 1,
    max: 10,
  },
  {
    id: 'focus',
    question: 'How is your focus/concentration?',
    icon: Brain,
    lowLabel: 'Scattered',
    highLabel: 'Sharp',
    quanta: 'Ch7: "My brain felt like it was constantly misfiring..."',
    isABS: false,
    min: 1,
    max: 10,
  },
];

// Breathing patterns mapped to symptom profiles
const patterns = {
  calm: {
    name: 'Calming Breath',
    inhale: 4,
    hold: 4,
    exhale: 8,
    pause: 2,
    description: 'Extended exhale activates parasympathetic response',
  },
  energize: {
    name: 'Energizing Breath',
    inhale: 4,
    hold: 0,
    exhale: 2,
    pause: 0,
    description: 'Quick rhythmic breathing to increase alertness',
  },
  balance: {
    name: 'Balanced Breath',
    inhale: 4,
    hold: 4,
    exhale: 6,
    pause: 2,
    description: 'Equal ratio breathing for homeostasis',
  },
  focus: {
    name: 'Focus Breath',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    description: '4-7-8 pattern for improved concentration',
  },
};

const determinePattern = (fatigue: number, anxiety: number, focus: number, agitation: number) => {
  // Check if safe for retention breathing (ABS ≤ 2 recommended)
  const safeForRetention = agitation <= 2;
  
  // High agitation (ABS 3-4) → always calming, no retention
  if (agitation >= 3) {
    return {
      pattern: patterns.calm,
      message: 'Your agitation level suggests focusing on calming techniques first. Extended exhales will activate your parasympathetic response.',
      safeForRetention: false,
    };
  }
  
  // High fatigue + low focus → energizing (but only if ABS allows)
  if (fatigue >= 7 && focus <= 4 && safeForRetention) {
    return {
      pattern: patterns.energize,
      message: 'Rising from the ashes requires energy. This quick breath will awaken your phoenix spirit.',
      safeForRetention,
    };
  }
  
  // High anxiety → calming
  if (anxiety >= 6) {
    return {
      pattern: patterns.calm,
      message: 'Sitting with uncomfortable feelings... This extended exhale will calm your nervous system.',
      safeForRetention,
    };
  }
  
  // Low focus → focus pattern
  if (focus <= 4) {
    return {
      pattern: patterns.focus,
      message: 'The brain rebuilds through intentional practice. This pattern enhances concentration.',
      safeForRetention,
    };
  }
  
  // Default → balance
  return {
    pattern: patterns.balance,
    message: 'Balance is the foundation of recovery. This harmonious pattern supports neuroplasticity.',
    safeForRetention,
  };
};

export const FatigueQuiz = ({ onComplete, className }: FatigueQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    agitation: 1,
    fatigue: 5,
    anxiety: 5,
    focus: 5,
  });

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      const { pattern, message, safeForRetention } = determinePattern(
        answers.fatigue,
        answers.anxiety,
        answers.focus,
        answers.agitation
      );
      
      onComplete({
        fatigue: answers.fatigue,
        anxiety: answers.anxiety,
        focus: answers.focus,
        agitation: answers.agitation,
        recommendedPattern: pattern,
        quantaMessage: message,
        safeForRetention,
      });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value[0],
    }));
  };

  const Icon = currentQuestion.icon;
  const isABSQuestion = currentQuestion.isABS;

  return (
    <Card className={cn("bg-slate-900/80 border-orange-500/20 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-orange-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Personalized Breath
          </CardTitle>
          <Badge variant="outline" className="text-orange-300 border-orange-500/30">
            {currentStep + 1} / {questions.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Question */}
            <div className="text-center space-y-3">
              <motion.div
                className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-7 h-7 text-orange-400" />
              </motion.div>
              
              <h3 className="text-xl font-semibold text-white">
                {currentQuestion.question}
              </h3>
              
              <p className="text-sm text-orange-300/60 italic">
                {currentQuestion.quanta}
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-4 px-2">
              <Slider
                value={[answers[currentQuestion.id]]}
                onValueChange={handleSliderChange}
                max={currentQuestion.max}
                min={currentQuestion.min}
                step={1}
                className="py-4"
              />
              
              <div className="flex justify-between text-sm text-white/60">
                <span>{currentQuestion.lowLabel}</span>
                <span className="text-2xl font-bold text-orange-400">
                  {answers[currentQuestion.id]}
                </span>
                <span>{currentQuestion.highLabel}</span>
              </div>
              
              {/* ABS Description */}
              {isABSQuestion && absDescriptions[answers[currentQuestion.id]] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-3 rounded-lg border text-center",
                    answers.agitation >= 3 
                      ? "bg-yellow-500/10 border-yellow-500/30" 
                      : "bg-green-500/10 border-green-500/30"
                  )}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {answers.agitation >= 3 && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                    <span className={cn(
                      "font-semibold",
                      answers.agitation >= 3 ? "text-yellow-300" : "text-green-300"
                    )}>
                      {absDescriptions[answers[currentQuestion.id]].label}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    {absDescriptions[answers[currentQuestion.id]].description}
                  </p>
                  {answers.agitation >= 3 && (
                    <p className="text-xs text-yellow-400/80 mt-2">
                      Retention breathing not recommended at this level
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentStep
                      ? "bg-orange-500 w-6"
                      : index < currentStep
                        ? "bg-orange-500/60"
                        : "bg-white/20"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
        >
          {isLastStep ? (
            <>
              <Zap className="mr-2 w-4 h-4" />
              Get Personalized Breath
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FatigueQuiz;
