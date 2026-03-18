import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Heart, AlertTriangle, CheckCircle, ArrowRight, 
  Stethoscope, Activity, RotateCcw
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

const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid something awful might happen"
];

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
    phq9: [], gad7: [], moca: [], abs: []
  });
  const [completedAssessments, setCompletedAssessments] = useState<Set<AssessmentType>>(new Set());

  const assessmentInfo = {
    phq9: { 
      title: "PHQ-9 Depression Screen", icon: Heart, color: "text-pink-400",
      bgColor: "bg-pink-500/15", questions: phq9Questions, max: 3,
      labels: ["Not at all", "Several days", "More than half", "Nearly every day"]
    },
    gad7: { 
      title: "GAD-7 Anxiety Screen", icon: AlertTriangle, color: "text-amber-400",
      bgColor: "bg-amber-500/15", questions: gad7Questions, max: 3,
      labels: ["Not at all", "Several days", "More than half", "Nearly every day"]
    },
    moca: { 
      title: "MoCA 8.1 Cognitive Screen", icon: Brain, color: "text-cyan-400",
      bgColor: "bg-cyan-500/15", questions: mocaQuestions.map(q => q.q), max: 1,
      labels: ["Unable", "Partial", "Complete"]
    },
    abs: { 
      title: "ABS Agitation Scale", icon: Activity, color: "text-red-400",
      bgColor: "bg-red-500/15", questions: absQuestions.map(q => q.q), max: 4,
      labels: ["Absent", "Slight", "Moderate", "Severe", "Extreme"]
    }
  };

  const handleAnswer = (value: number) => {
    const key = currentAssessment!;
    const info = assessmentInfo[key];
    
    setAnswers(prev => ({ ...prev, [key]: [...prev[key], value] }));

    if (currentQuestion < info.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
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
      if (score <= 4) return { label: "Minimal", color: "text-emerald-400" };
      if (score <= 9) return { label: "Mild", color: "text-yellow-400" };
      if (score <= 14) return { label: "Moderate", color: "text-amber-400" };
      return { label: "Severe", color: "text-red-400" };
    }
    if (type === 'gad7') {
      if (score <= 4) return { label: "Minimal", color: "text-emerald-400" };
      if (score <= 9) return { label: "Mild", color: "text-yellow-400" };
      if (score <= 14) return { label: "Moderate", color: "text-amber-400" };
      return { label: "Severe", color: "text-red-400" };
    }
    if (type === 'moca') {
      if (score >= 26) return { label: "Normal", color: "text-emerald-400" };
      if (score >= 18) return { label: "Mild Impairment", color: "text-yellow-400" };
      return { label: "Significant Impairment", color: "text-red-400" };
    }
    if (score <= 7) return { label: "No Agitation", color: "text-emerald-400" };
    if (score <= 14) return { label: "Mild", color: "text-yellow-400" };
    if (score <= 21) return { label: "Moderate", color: "text-amber-400" };
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

  // Active assessment view
  if (currentAssessment) {
    const info = assessmentInfo[currentAssessment];
    const Icon = info.icon;
    const progress = ((currentQuestion + 1) / info.questions.length) * 100;

    return (
      <div className={cn("rounded-2xl academy-glass-strong p-6 space-y-6", className)}>
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3", info.color)}>
            <div className={cn("p-2 rounded-xl", info.bgColor)}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{info.title}</h3>
          </div>
          <Badge className="bg-white/5 text-white/50 border border-white/10">
            {currentQuestion + 1} / {info.questions.length}
          </Badge>
        </div>
        
        <Progress value={progress} className="h-1 bg-white/5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <p className="text-white/90 text-lg leading-relaxed">
              {info.questions[currentQuestion]}
            </p>

            <div className="space-y-3">
              {info.labels.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl academy-neomorphic text-left text-white/70 hover:text-amber-200 hover:border-amber-500/20 transition-all min-h-[56px]"
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-sm text-amber-400 shrink-0">
                    {idx}
                  </span>
                  <span className="text-base">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Button
          onClick={() => setCurrentAssessment(null)}
          variant="ghost"
          className="text-white/30 hover:text-amber-300"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Return to Overview
        </Button>
      </div>
    );
  }

  // Overview
  return (
    <div className={cn("rounded-2xl academy-glass-strong p-6 space-y-5", className)}>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/15">
            <Stethoscope className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="font-semibold text-amber-200">Clinical Assessments</h3>
        </div>
        <p className="text-white/35 text-sm ml-12">
          2025 validated screens: PHQ-9, GAD-7, MoCA 8.1, ABS. INCOG Level A.
        </p>
      </div>

      <div className="space-y-3">
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
                "p-4 rounded-xl transition-all min-h-[56px]",
                isComplete 
                  ? "bg-emerald-500/8 border border-emerald-500/20" 
                  : "academy-neomorphic hover:border-amber-500/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", info.bgColor)}>
                    <Icon className={cn("h-5 w-5", info.color)} />
                  </div>
                  <div>
                    <div className="font-medium text-white/80">{info.title}</div>
                    <div className="text-xs text-white/30">{info.questions.length} questions</div>
                  </div>
                </div>

                {isComplete ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={cn("font-bold", severity?.color)}>{score}</div>
                      <div className="text-xs text-white/30">{severity?.label}</div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                ) : (
                  <Button
                    onClick={() => startAssessment(type)}
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-300 hover:from-amber-500/30 min-h-[40px]"
                  >
                    Start
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 space-y-3"
        >
          <Button
            onClick={handleSubmitAll}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-semibold shadow-lg shadow-amber-500/20 min-h-[56px]"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Assessment Battery
          </Button>
          <p className="text-center text-white/25 text-sm italic">
            Ch6 "observer" — watching your patterns reveals the path
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ClinicalAssessments;
