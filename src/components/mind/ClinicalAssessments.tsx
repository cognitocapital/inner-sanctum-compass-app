import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, Heart, AlertTriangle, CheckCircle, ArrowRight, 
  Stethoscope, Activity, ThermometerSun, RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentResult {
  phq9: number;
  gad7: number;
  moca: number;
  abs: number;
  timestamp: string;
}

interface ClinicalAssessmentsProps {
  onComplete: (results: AssessmentResult) => void;
  className?: string;
}

// PHQ-9 Questions
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself",
  "Trouble concentrating on things",
  "Moving or speaking slowly, or being fidgety/restless",
  "Thoughts of self-harm (if yes, please reach out for support)"
];

// GAD-7 Questions
const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid something awful might happen"
];

// MoCA 8.1 Simplified (telehealth adapted)
const mocaQuestions = [
  { q: "What is today's date?", domain: "Orientation" },
  { q: "What month is it?", domain: "Orientation" },
  { q: "What year is it?", domain: "Orientation" },
  { q: "What day of the week is it?", domain: "Orientation" },
  { q: "Can you name three objects I'll show you, then recall them later?", domain: "Memory" },
  { q: "Count backwards from 100 by 7s (100, 93, 86...)", domain: "Attention" },
  { q: "Repeat these words: FACE, VELVET, CHURCH, DAISY, RED", domain: "Language" },
  { q: "Name as many animals as you can in 60 seconds", domain: "Language" }
];

// ABS (Agitation Behavior Scale - UAMS 2025)
const absQuestions = [
  { q: "Short attention span, easily distractible", severity: "attention" },
  { q: "Impulsive, impatient, low tolerance for frustration", severity: "impulse" },
  { q: "Uncooperative, resistant to care", severity: "cooperation" },
  { q: "Violent and/or threatening toward people or property", severity: "aggression" },
  { q: "Explosive and/or unpredictable anger", severity: "anger" },
  { q: "Rocking, rubbing, or repetitive movements", severity: "motor" },
  { q: "Rapid, loud, or excessive talking", severity: "verbal" }
];

type AssessmentType = 'phq9' | 'gad7' | 'moca' | 'abs';

export const ClinicalAssessments = ({ onComplete, className }: ClinicalAssessmentsProps) => {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({
    phq9: [],
    gad7: [],
    moca: [],
    abs: []
  });
  const [completedAssessments, setCompletedAssessments] = useState<Set<AssessmentType>>(new Set());

  const assessmentInfo = {
    phq9: { 
      title: "PHQ-9 Depression Screen", 
      icon: Heart, 
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      questions: phq9Questions,
      max: 3,
      labels: ["Not at all", "Several days", "More than half", "Nearly every day"]
    },
    gad7: { 
      title: "GAD-7 Anxiety Screen", 
      icon: AlertTriangle, 
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      questions: gad7Questions,
      max: 3,
      labels: ["Not at all", "Several days", "More than half", "Nearly every day"]
    },
    moca: { 
      title: "MoCA 8.1 Cognitive Screen", 
      icon: Brain, 
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      questions: mocaQuestions.map(q => q.q),
      max: 1,
      labels: ["Unable", "Partial", "Complete"]
    },
    abs: { 
      title: "ABS Agitation Scale", 
      icon: Activity, 
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      questions: absQuestions.map(q => q.q),
      max: 4,
      labels: ["Absent", "Slight", "Moderate", "Severe", "Extreme"]
    }
  };

  const handleAnswer = (value: number) => {
    const key = currentAssessment!;
    const info = assessmentInfo[key];
    
    setAnswers(prev => ({
      ...prev,
      [key]: [...prev[key], value]
    }));

    if (currentQuestion < info.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Assessment complete
      setCompletedAssessments(prev => new Set([...prev, key]));
      setCurrentAssessment(null);
      setCurrentQuestion(0);
    }
  };

  const startAssessment = (type: AssessmentType) => {
    setCurrentAssessment(type);
    setCurrentQuestion(0);
    setAnswers(prev => ({ ...prev, [type]: [] }));
  };

  const calculateScore = (type: AssessmentType): number => {
    return answers[type].reduce((sum, val) => sum + val, 0);
  };

  const getSeverity = (type: AssessmentType, score: number): { label: string; color: string } => {
    if (type === 'phq9') {
      if (score <= 4) return { label: "Minimal", color: "text-green-400" };
      if (score <= 9) return { label: "Mild", color: "text-yellow-400" };
      if (score <= 14) return { label: "Moderate", color: "text-orange-400" };
      return { label: "Severe", color: "text-red-400" };
    }
    if (type === 'gad7') {
      if (score <= 4) return { label: "Minimal", color: "text-green-400" };
      if (score <= 9) return { label: "Mild", color: "text-yellow-400" };
      if (score <= 14) return { label: "Moderate", color: "text-orange-400" };
      return { label: "Severe", color: "text-red-400" };
    }
    if (type === 'moca') {
      if (score >= 26) return { label: "Normal", color: "text-green-400" };
      if (score >= 18) return { label: "Mild Impairment", color: "text-yellow-400" };
      return { label: "Significant Impairment", color: "text-red-400" };
    }
    // ABS
    if (score <= 7) return { label: "No Agitation", color: "text-green-400" };
    if (score <= 14) return { label: "Mild", color: "text-yellow-400" };
    if (score <= 21) return { label: "Moderate", color: "text-orange-400" };
    return { label: "Severe", color: "text-red-400" };
  };

  const allComplete = completedAssessments.size === 4;

  const handleSubmitAll = () => {
    onComplete({
      phq9: calculateScore('phq9'),
      gad7: calculateScore('gad7'),
      moca: calculateScore('moca'),
      abs: calculateScore('abs'),
      timestamp: new Date().toISOString()
    });
  };

  if (currentAssessment) {
    const info = assessmentInfo[currentAssessment];
    const Icon = info.icon;
    const progress = ((currentQuestion + 1) / info.questions.length) * 100;

    return (
      <Card className={cn("bg-black/40 border-orange-600/50", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={cn("flex items-center gap-2", info.color)}>
              <Icon className="h-5 w-5" />
              {info.title}
            </CardTitle>
            <Badge variant="outline" className="border-orange-600 text-orange-200">
              {currentQuestion + 1} / {info.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 bg-orange-900/50" />
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <p className="text-orange-100 text-lg">
                {info.questions[currentQuestion]}
              </p>

              <div className="space-y-3">
                {info.labels.map((label, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    variant="outline"
                    className="w-full justify-start text-left border-orange-600/50 text-orange-200 hover:bg-orange-600/20"
                  >
                    <span className="w-6 h-6 rounded-full bg-orange-600/30 flex items-center justify-center mr-3 text-sm">
                      {idx}
                    </span>
                    {label}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <Button
            onClick={() => setCurrentAssessment(null)}
            variant="ghost"
            className="text-orange-300/70"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Return to Overview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-black/40 border-orange-600/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-100">
          <Stethoscope className="h-5 w-5 text-orange-400" />
          Clinical Assessments
        </CardTitle>
        <p className="text-orange-200/70 text-sm">
          2025 validated screens: PHQ-9, GAD-7, MoCA 8.1, ABS. INCOG Level A.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {(Object.keys(assessmentInfo) as AssessmentType[]).map((type) => {
          const info = assessmentInfo[type];
          const Icon = info.icon;
          const isComplete = completedAssessments.has(type);
          const score = isComplete ? calculateScore(type) : null;
          const severity = score !== null ? getSeverity(type, score) : null;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-lg border transition-all",
                isComplete 
                  ? "bg-green-900/20 border-green-600/50" 
                  : "bg-orange-900/20 border-orange-700/50 hover:border-orange-600"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", info.bgColor)}>
                    <Icon className={cn("h-5 w-5", info.color)} />
                  </div>
                  <div>
                    <div className="font-medium text-orange-100">{info.title}</div>
                    <div className="text-sm text-orange-300/70">
                      {info.questions.length} questions
                    </div>
                  </div>
                </div>

                {isComplete ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={cn("font-bold", severity?.color)}>
                        {score}
                      </div>
                      <div className="text-xs text-orange-300/70">
                        {severity?.label}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                ) : (
                  <Button
                    onClick={() => startAssessment(type)}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-500"
                  >
                    Start
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}

        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <Button
              onClick={handleSubmitAll}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Assessment Battery
            </Button>
            <p className="text-center text-orange-300/70 text-sm mt-2 italic">
              Ch6 "observer" - watching your patterns reveals the path
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicalAssessments;
