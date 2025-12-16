import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Brain, Heart, Zap, ThermometerSnowflake,
  ArrowRight, ArrowLeft, ShieldCheck, X, BookOpen, Droplets,
  Baby, Pill, Utensils, Users, Snowflake, Bath, Wind
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SafetyQuizResult {
  passed: boolean;
  recommendations: string[];
  absScore: number;
  pss4Score: number;
  coldMethod: ColdMethod;
  hasSafetyBuddy: boolean;
  contraindications: string[];
}

export interface ColdMethod {
  id: string;
  name: string;
  tempRange: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  recommendedDuration: number;
}

interface SafetyQuizProps {
  onComplete: (result: SafetyQuizResult) => void;
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

// Expanded contraindications including 2025 guidelines
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
  },
  // New contraindications
  {
    id: 'raynauds',
    question: "Do you have Raynaud's syndrome or poor circulation?",
    description: 'Cold exposure can trigger severe vasoconstriction episodes.',
    icon: <Droplets className="w-5 h-5" />,
    severity: 'stop'
  },
  {
    id: 'pregnancy',
    question: 'Are you pregnant or could you be pregnant?',
    description: 'Cold exposure is contraindicated during pregnancy.',
    icon: <Baby className="w-5 h-5" />,
    severity: 'stop'
  },
  {
    id: 'hypertension',
    question: 'Do you have uncontrolled hypertension?',
    description: 'Cold triggers significant blood pressure spikes.',
    icon: <Heart className="w-5 h-5" />,
    severity: 'stop'
  },
  {
    id: 'medication',
    question: 'Are you on blood thinners or beta-blockers?',
    description: 'These medications alter cold stress response.',
    icon: <Pill className="w-5 h-5" />,
    severity: 'caution'
  },
  {
    id: 'recentMeal',
    question: 'Have you eaten a large meal in the last hour?',
    description: 'Digestion diverts blood flow - wait 1-2 hours post-meal.',
    icon: <Utensils className="w-5 h-5" />,
    severity: 'caution'
  }
];

// ABS Agitation Scale (simplified 1-4)
const ABS_SCALE = [
  { value: 1, label: "Calm", description: "Relaxed, cooperative, no agitation", color: "bg-green-500" },
  { value: 2, label: "Mild", description: "Slight restlessness, easily redirected", color: "bg-yellow-500" },
  { value: 3, label: "Moderate", description: "Restless, tense, somewhat difficult to redirect", color: "bg-orange-500" },
  { value: 4, label: "Severe", description: "Highly agitated, unable to focus", color: "bg-red-500" }
];

// PSS-4 Questions (Perceived Stress Scale - 4 item)
const PSS4_QUESTIONS = [
  { id: 'pss1', question: "In the last month, how often have you felt unable to control important things in your life?", reverse: false },
  { id: 'pss2', question: "In the last month, how often have you felt confident about your ability to handle personal problems?", reverse: true },
  { id: 'pss3', question: "In the last month, how often have you felt things were going your way?", reverse: true },
  { id: 'pss4', question: "In the last month, how often have you felt difficulties were piling up so high you could not overcome them?", reverse: false }
];

const PSS_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost Never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly Often" },
  { value: 4, label: "Very Often" }
];

// Cold Method Options
const COLD_METHODS: ColdMethod[] = [
  { id: 'shower', name: 'Cold Shower', tempRange: '10-15°C', level: 'beginner', recommendedDuration: 30 },
  { id: 'bath', name: 'Cold Bath/Plunge', tempRange: '5-10°C', level: 'intermediate', recommendedDuration: 60 },
  { id: 'ice', name: 'Ice Bath', tempRange: '<5°C', level: 'advanced', recommendedDuration: 90 },
  { id: 'nordic', name: 'Nordic Contrast (Sauna/Cold)', tempRange: 'Alternating', level: 'expert', recommendedDuration: 120 }
];

type QuizStep = 'contraindications' | 'abs' | 'pss4' | 'method' | 'buddy';

export const FrostSafetyQuiz = ({ onComplete, onCancel }: SafetyQuizProps) => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('contraindications');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [absScore, setAbsScore] = useState(1);
  const [pss4Answers, setPss4Answers] = useState<Record<string, number>>({});
  const [pss4Index, setPss4Index] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<ColdMethod>(COLD_METHODS[0]);
  const [hasSafetyBuddy, setHasSafetyBuddy] = useState<boolean | null>(null);
  const [showQuanta, setShowQuanta] = useState(false);

  const currentQuestion = SAFETY_QUESTIONS[questionIndex];
  const currentPss4Question = PSS4_QUESTIONS[pss4Index];
  const isLastContraindication = questionIndex === SAFETY_QUESTIONS.length - 1;
  const isLastPss4 = pss4Index === PSS4_QUESTIONS.length - 1;

  // Calculate total steps for progress
  const getTotalSteps = () => SAFETY_QUESTIONS.length + 1 + PSS4_QUESTIONS.length + 1 + 1; // contraindications + abs + pss4 + method + buddy
  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case 'contraindications': return questionIndex + 1;
      case 'abs': return SAFETY_QUESTIONS.length + 1;
      case 'pss4': return SAFETY_QUESTIONS.length + 2 + pss4Index;
      case 'method': return SAFETY_QUESTIONS.length + 2 + PSS4_QUESTIONS.length;
      case 'buddy': return getTotalSteps();
      default: return 1;
    }
  };

  const handleContraindicationAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (isLastContraindication) {
      setCurrentStep('abs');
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handleAbsSelect = (value: number) => {
    setAbsScore(value);
    setCurrentStep('pss4');
  };

  const handlePss4Answer = (value: number) => {
    const newAnswers = { ...pss4Answers, [currentPss4Question.id]: value };
    setPss4Answers(newAnswers);

    if (isLastPss4) {
      setCurrentStep('method');
    } else {
      setPss4Index(pss4Index + 1);
    }
  };

  const handleMethodSelect = (method: ColdMethod) => {
    setSelectedMethod(method);
    setCurrentStep('buddy');
  };

  const handleBuddyAnswer = (hasBuddy: boolean) => {
    setHasSafetyBuddy(hasBuddy);
    completeQuiz(hasBuddy);
  };

  const completeQuiz = (hasBuddy: boolean) => {
    // Evaluate contraindications
    const hasStopCondition = SAFETY_QUESTIONS.some(
      q => q.severity === 'stop' && answers[q.id] === true && q.id !== 'temp'
    ) || (answers['temp'] === false);

    const recommendations: string[] = [];
    const triggeredContraindications: string[] = [];
    
    // Check each answer
    if (answers['fatigue']) {
      recommendations.push('Consider a shorter 30s session due to fatigue');
    }
    if (answers['vertigo']) {
      recommendations.push('Skip this session - vestibular risk');
      triggeredContraindications.push('Vertigo/dizziness');
    }
    if (answers['pta']) {
      recommendations.push('Rest is recommended during PTA');
      triggeredContraindications.push('Recent TBI/PTA');
    }
    if (answers['raynauds']) {
      recommendations.push("Raynaud's syndrome - cold exposure not recommended");
      triggeredContraindications.push("Raynaud's syndrome");
    }
    if (answers['pregnancy']) {
      recommendations.push('Pregnancy - cold exposure contraindicated');
      triggeredContraindications.push('Pregnancy');
    }
    if (answers['hypertension']) {
      recommendations.push('Uncontrolled hypertension - consult physician first');
      triggeredContraindications.push('Hypertension');
    }
    if (answers['cardiac']) {
      recommendations.push('Cardiac condition - cold exposure not recommended');
      triggeredContraindications.push('Cardiac condition');
    }
    if (answers['medication']) {
      recommendations.push('Medication interaction - proceed with caution, shorter duration');
    }
    if (answers['recentMeal']) {
      recommendations.push('Wait 1-2 hours after eating before cold exposure');
    }

    // ABS score recommendations
    if (absScore >= 3) {
      recommendations.push(`Agitation level ${absScore}/4 - consider calming breathwork first`);
    }

    // PSS-4 score calculation
    const pss4Score = PSS4_QUESTIONS.reduce((total, q) => {
      const answer = pss4Answers[q.id] || 0;
      return total + (q.reverse ? (4 - answer) : answer);
    }, 0);

    if (pss4Score >= 10) {
      recommendations.push(`High stress score (${pss4Score}/16) - consider shorter, gentler session`);
    }

    // Safety buddy recommendation
    if (!hasBuddy && (selectedMethod.level === 'advanced' || selectedMethod.level === 'expert')) {
      recommendations.push('Advanced cold exposure without safety buddy - not recommended');
    }

    const result: SafetyQuizResult = {
      passed: !hasStopCondition && absScore < 4,
      recommendations,
      absScore,
      pss4Score,
      coldMethod: selectedMethod,
      hasSafetyBuddy: hasBuddy,
      contraindications: triggeredContraindications
    };

    onComplete(result);
  };

  const goBack = () => {
    switch (currentStep) {
      case 'contraindications':
        if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
        break;
      case 'abs':
        setCurrentStep('contraindications');
        setQuestionIndex(SAFETY_QUESTIONS.length - 1);
        break;
      case 'pss4':
        if (pss4Index > 0) {
          setPss4Index(pss4Index - 1);
        } else {
          setCurrentStep('abs');
        }
        break;
      case 'method':
        setCurrentStep('pss4');
        setPss4Index(PSS4_QUESTIONS.length - 1);
        break;
      case 'buddy':
        setCurrentStep('method');
        break;
    }
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'shower': return <Droplets className="w-6 h-6" />;
      case 'bath': return <Bath className="w-6 h-6" />;
      case 'ice': return <Snowflake className="w-6 h-6" />;
      case 'nordic': return <Wind className="w-6 h-6" />;
      default: return <Snowflake className="w-6 h-6" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'border-green-500/50 text-green-400';
      case 'intermediate': return 'border-yellow-500/50 text-yellow-400';
      case 'advanced': return 'border-orange-500/50 text-orange-400';
      case 'expert': return 'border-red-500/50 text-red-400';
      default: return 'border-cyan-500/50 text-cyan-400';
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
              Clinical Safety Check
            </CardTitle>
            <button onClick={onCancel} className="text-cyan-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex gap-0.5 mt-4">
            {Array.from({ length: getTotalSteps() }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
                  i + 1 === getCurrentStepNumber() ? "bg-cyan-400" :
                  i + 1 < getCurrentStepNumber() ? "bg-cyan-600" : "bg-slate-700"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-cyan-300 mt-2">
            Step {getCurrentStepNumber()} of {getTotalSteps()} • {
              currentStep === 'contraindications' ? 'Safety Screening' :
              currentStep === 'abs' ? 'Agitation Scale (ABS)' :
              currentStep === 'pss4' ? 'Stress Assessment (PSS-4)' :
              currentStep === 'method' ? 'Cold Method Selection' :
              'Safety Buddy Check'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Contraindications Questions */}
            {currentStep === 'contraindications' && (
              <motion.div
                key={`contra-${questionIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
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

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={() => handleContraindicationAnswer(currentQuestion.id === 'temp' ? true : false)}
                    variant="outline"
                    className="h-14 border-green-500/50 hover:bg-green-500/20 hover:border-green-400"
                  >
                    {currentQuestion.id === 'temp' ? 'Yes' : 'No'}
                    {currentQuestion.id !== 'temp' && (
                      <ShieldCheck className="ml-2 w-4 h-4 text-green-400" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleContraindicationAnswer(currentQuestion.id === 'temp' ? false : true)}
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
            )}

            {/* ABS Agitation Scale */}
            {currentStep === 'abs' && (
              <motion.div
                key="abs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-cyan-500/20 text-cyan-400">
                    <Brain className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white">
                    Current Agitation Level
                  </h3>
                  
                  <p className="text-sm text-cyan-300">
                    Rate your current agitation level (ABS Scale - 2025 Canadian Guidelines)
                  </p>

                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-300 text-xs">
                    Agitation Behavior Scale
                  </Badge>
                </div>

                <div className="space-y-2">
                  {ABS_SCALE.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAbsSelect(option.value)}
                      className={cn(
                        "w-full p-4 rounded-lg border text-left transition-all",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        option.value === 1 ? "border-green-500/50 hover:bg-green-500/10" :
                        option.value === 2 ? "border-yellow-500/50 hover:bg-yellow-500/10" :
                        option.value === 3 ? "border-orange-500/50 hover:bg-orange-500/10" :
                        "border-red-500/50 hover:bg-red-500/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold", option.color)}>
                          {option.value}
                        </div>
                        <div>
                          <p className="font-medium text-white">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-300">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Score ≥3: Shorter session recommended. Score 4: Skip session.
                  </p>
                </div>
              </motion.div>
            )}

            {/* PSS-4 Questions */}
            {currentStep === 'pss4' && (
              <motion.div
                key={`pss4-${pss4Index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-purple-500/20 text-purple-400">
                    <Zap className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white">
                    Stress Assessment
                  </h3>
                  
                  <p className="text-sm text-cyan-300">
                    {currentPss4Question.question}
                  </p>

                  <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                    PSS-4 • Question {pss4Index + 1} of {PSS4_QUESTIONS.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {PSS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePss4Answer(option.value)}
                      className={cn(
                        "w-full p-3 rounded-lg border border-slate-600 text-left transition-all",
                        "hover:border-purple-500/50 hover:bg-purple-500/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.value}/4</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground">
                    PSS-4 measures perceived stress. Higher scores indicate greater stress levels which may affect cold tolerance.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Cold Method Selection */}
            {currentStep === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-cyan-500/20 text-cyan-400">
                    <Snowflake className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white">
                    Select Cold Method
                  </h3>
                  
                  <p className="text-sm text-cyan-300">
                    Choose your cold exposure method for today's session
                  </p>
                </div>

                <div className="space-y-2">
                  {COLD_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method)}
                      className={cn(
                        "w-full p-4 rounded-lg border text-left transition-all",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        getLevelColor(method.level)
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                          {getMethodIcon(method.id)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">{method.name}</p>
                            <Badge variant="outline" className={cn("text-xs capitalize", getLevelColor(method.level))}>
                              {method.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {method.tempRange} • Recommended: {method.recommendedDuration}s
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <p className="text-xs text-cyan-300">
                    <ThermometerSnowflake className="w-3 h-3 inline mr-1" />
                    Start with beginner methods. Progress gradually over weeks.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Safety Buddy Check */}
            {currentStep === 'buddy' && (
              <motion.div
                key="buddy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-green-500/20 text-green-400">
                    <Users className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white">
                    Safety Buddy Check
                  </h3>
                  
                  <p className="text-sm text-cyan-300">
                    Is someone nearby who can assist if needed?
                  </p>

                  <Badge variant="outline" className="border-green-500/50 text-green-300 text-xs">
                    2025 Safety Protocol
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                  <p className="text-sm text-amber-200">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    For {selectedMethod.level === 'advanced' || selectedMethod.level === 'expert' ? 'advanced' : 'any'} cold exposure, having someone nearby is strongly recommended for TBI recovery.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleBuddyAnswer(true)}
                    variant="outline"
                    className="h-16 border-green-500/50 hover:bg-green-500/20 hover:border-green-400 flex flex-col gap-1"
                  >
                    <Users className="w-5 h-5 text-green-400" />
                    <span>Yes, Someone's Near</span>
                  </Button>
                  <Button
                    onClick={() => handleBuddyAnswer(false)}
                    variant="outline"
                    className={cn(
                      "h-16 flex flex-col gap-1",
                      selectedMethod.level === 'advanced' || selectedMethod.level === 'expert'
                        ? "border-red-500/50 hover:bg-red-500/20 hover:border-red-400"
                        : "border-amber-500/50 hover:bg-amber-500/20 hover:border-amber-400"
                    )}
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>No, I'm Alone</span>
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Proceeding alone is acceptable for beginner/intermediate methods with caution.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-cyan-500/20">
            <Button
              variant="ghost"
              onClick={currentStep === 'contraindications' && questionIndex === 0 ? onCancel : goBack}
              className="text-cyan-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 'contraindications' && questionIndex === 0 ? 'Cancel' : 'Back'}
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
