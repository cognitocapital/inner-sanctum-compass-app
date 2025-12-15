import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Brain, Heart, Zap, ThermometerSnowflake,
  ArrowRight, ArrowLeft, ShieldCheck, X, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyQuizProps {
  onComplete: (passed: boolean, recommendations: string[]) => void;
  onCancel: () => void;
}

interface Question {
  id: string;
  question: string;
  description: string;
  icon: React.ReactNode;
  severity: 'stop' | 'caution' | 'safe';
  quantaRef?: string;
}

const SAFETY_QUESTIONS: Question[] = [
  {
    id: 'vertigo',
    question: 'Are you experiencing vertigo or dizziness today?',
    description: 'Cold exposure may worsen vestibular symptoms.',
    icon: <Brain className="w-5 h-5" />,
    severity: 'stop',
    quantaRef: 'Ch4: "The vertigo slowly subsides... learning to trust the process."'
  },
  {
    id: 'fatigue',
    question: 'Are you experiencing severe fatigue right now?',
    description: 'Consider a shorter session if fatigue is present.',
    icon: <Zap className="w-5 h-5" />,
    severity: 'caution',
    quantaRef: 'Ch3: "The overwhelming chaos that eventually gives way to peace..."'
  },
  {
    id: 'cardiac',
    question: 'Do you have heart conditions or high blood pressure?',
    description: 'Cold affects cardiovascular function significantly.',
    icon: <Heart className="w-5 h-5" />,
    severity: 'stop'
  },
  {
    id: 'pta',
    question: 'Have you had a recent TBI episode or PTA symptoms?',
    description: '2025 Guidelines: Skip cold exposure during active recovery.',
    icon: <AlertTriangle className="w-5 h-5" />,
    severity: 'stop',
    quantaRef: 'Ch2: "The hospital haze... waiting for clarity to return."'
  },
  {
    id: 'temp',
    question: 'Is your current body temperature normal (36-37.5°C)?',
    description: 'Normothermia is essential before cold exposure.',
    icon: <ThermometerSnowflake className="w-5 h-5" />,
    severity: 'caution'
  }
];

export const FrostSafetyQuiz = ({ onComplete, onCancel }: SafetyQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showQuanta, setShowQuanta] = useState(false);

  const currentQuestion = SAFETY_QUESTIONS[currentStep];
  const isLastStep = currentStep === SAFETY_QUESTIONS.length - 1;

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (isLastStep) {
      // Evaluate all answers
      const hasStopCondition = SAFETY_QUESTIONS.some(
        q => q.severity === 'stop' && newAnswers[q.id] === true && q.id !== 'temp'
      ) || (newAnswers['temp'] === false);

      const recommendations: string[] = [];
      
      if (newAnswers['fatigue']) {
        recommendations.push('Consider a shorter 30s session');
      }
      if (newAnswers['vertigo']) {
        recommendations.push('Skip this session - vestibular risk');
      }
      if (newAnswers['pta']) {
        recommendations.push('Rest is recommended during PTA');
      }

      onComplete(!hasStopCondition, recommendations);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-md bg-slate-900/95 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-cyan-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Safety Check
            </CardTitle>
            <button onClick={onCancel} className="text-cyan-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex gap-1 mt-4">
            {SAFETY_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
                  i === currentStep ? "bg-cyan-400" :
                  i < currentStep ? "bg-cyan-600" : "bg-slate-700"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-cyan-300 mt-2">
            Step {currentStep + 1} of {SAFETY_QUESTIONS.length}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Question */}
              <div className="text-center space-y-3">
                <div className={cn(
                  "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
                  currentQuestion.severity === 'stop' 
                    ? "bg-red-500/20 text-red-400" 
                    : currentQuestion.severity === 'caution'
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-green-500/20 text-green-400"
                )}>
                  {currentQuestion.icon}
                </div>
                
                <h3 className="text-lg font-semibold text-white">
                  {currentQuestion.question}
                </h3>
                
                <p className="text-sm text-cyan-300">
                  {currentQuestion.description}
                </p>

                {/* Severity Badge */}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    currentQuestion.severity === 'stop' 
                      ? "border-red-500/50 text-red-400" 
                      : currentQuestion.severity === 'caution'
                      ? "border-amber-500/50 text-amber-400"
                      : "border-green-500/50 text-green-400"
                  )}
                >
                  {currentQuestion.severity === 'stop' ? 'Critical Check' : 
                   currentQuestion.severity === 'caution' ? 'Safety Note' : 'Verification'}
                </Badge>
              </div>

              {/* Quanta Reference */}
              {currentQuestion.quantaRef && (
                <button
                  onClick={() => setShowQuanta(!showQuanta)}
                  className="w-full p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-left transition-all hover:bg-amber-500/20"
                >
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-400 font-medium mb-1">Manuscript Reflection</p>
                      <p className="text-sm text-amber-200 italic">{currentQuestion.quantaRef}</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => handleAnswer(currentQuestion.id === 'temp' ? true : false)}
                  variant="outline"
                  className="h-14 border-green-500/50 hover:bg-green-500/20 hover:border-green-400"
                >
                  {currentQuestion.id === 'temp' ? 'Yes' : 'No'}
                  {currentQuestion.id !== 'temp' && (
                    <ShieldCheck className="ml-2 w-4 h-4 text-green-400" />
                  )}
                </Button>
                <Button
                  onClick={() => handleAnswer(currentQuestion.id === 'temp' ? false : true)}
                  variant="outline"
                  className={cn(
                    "h-14",
                    currentQuestion.severity === 'stop'
                      ? "border-red-500/50 hover:bg-red-500/20 hover:border-red-400"
                      : "border-amber-500/50 hover:bg-amber-500/20 hover:border-amber-400"
                  )}
                >
                  {currentQuestion.id === 'temp' ? 'No / Unsure' : 'Yes'}
                  {currentQuestion.severity === 'stop' && currentQuestion.id !== 'temp' && (
                    <AlertTriangle className="ml-2 w-4 h-4 text-red-400" />
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-cyan-500/20">
            <Button
              variant="ghost"
              onClick={currentStep > 0 ? goBack : onCancel}
              className="text-cyan-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep > 0 ? 'Back' : 'Cancel'}
            </Button>
            <span className="text-xs text-cyan-400 self-center">
              2025 TBI Safety Protocol
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrostSafetyQuiz;
