import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  ArrowLeft, ArrowRight, Check, Brain, ClipboardCheck,
  AlertTriangle, Info
} from "lucide-react";

interface GOSEAssessmentProps {
  onComplete: (score: number, severity: string) => void;
  onCancel: () => void;
}

// GOSE Extended Questions based on official structured interview
const GOSE_QUESTIONS = [
  {
    id: "consciousness",
    question: "Is the patient able to obey simple commands or say any words?",
    options: [
      { value: "1", label: "No (Vegetative State)", score: 1 },
      { value: "2", label: "Yes", score: 0 },
    ],
  },
  {
    id: "independence_home",
    question: "Is the patient independent at home?",
    description: "Can they look after themselves at home for 8 hours without supervision?",
    options: [
      { value: "1", label: "No - needs someone at home most of the time", score: 2 },
      { value: "2", label: "Needs someone part of the time (not daily)", score: 3 },
      { value: "3", label: "Independent at home", score: 0 },
    ],
  },
  {
    id: "shopping",
    question: "Can the patient shop without assistance?",
    options: [
      { value: "1", label: "Unable to shop", score: 0 },
      { value: "2", label: "Able to shop with assistance", score: 1 },
      { value: "3", label: "Able to shop independently", score: 2 },
    ],
  },
  {
    id: "travel",
    question: "Can the patient travel locally without assistance?",
    options: [
      { value: "1", label: "Unable to travel", score: 0 },
      { value: "2", label: "Can travel with assistance", score: 1 },
      { value: "3", label: "Can travel independently", score: 2 },
    ],
  },
  {
    id: "work",
    question: "Is the patient able to work (or study/homemaking if applicable)?",
    options: [
      { value: "1", label: "Unable to work", score: 0 },
      { value: "2", label: "Reduced capacity to work", score: 1 },
      { value: "3", label: "Working at pre-injury capacity", score: 2 },
    ],
  },
  {
    id: "social_leisure",
    question: "Has there been a reduction in social and leisure activities?",
    options: [
      { value: "1", label: "No longer participates in any", score: 0 },
      { value: "2", label: "Participates less frequently", score: 1 },
      { value: "3", label: "Resumes all activities normally", score: 2 },
    ],
  },
  {
    id: "relationships",
    question: "Have there been problems in family or friendships causing disruption?",
    options: [
      { value: "1", label: "Constant ongoing disruption", score: 0 },
      { value: "2", label: "Occasional disruption or strain", score: 1 },
      { value: "3", label: "No significant problems", score: 2 },
    ],
  },
  {
    id: "current_problems",
    question: "Are there any other current problems relating to the injury?",
    description: "Such as headaches, dizziness, tiredness, sensitivity to noise/light, slowness, memory, concentration",
    options: [
      { value: "1", label: "Yes, significantly affecting daily life", score: 0 },
      { value: "2", label: "Yes, but minor impact", score: 1 },
      { value: "3", label: "No current problems", score: 2 },
    ],
  },
];

const getGOSEScore = (answers: Record<string, string>): { score: number; severity: string; color: string } => {
  // Simplified GOSE scoring logic
  const scores = Object.values(answers).map(v => parseInt(v));
  
  // Check for vegetative state
  if (answers.consciousness === "1") {
    return { score: 2, severity: "Vegetative State", color: "text-red-500" };
  }
  
  // Calculate based on independence and other factors
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  if (avgScore < 1.5) return { score: 3, severity: "Lower Severe Disability", color: "text-red-400" };
  if (avgScore < 2) return { score: 4, severity: "Upper Severe Disability", color: "text-orange-500" };
  if (avgScore < 2.3) return { score: 5, severity: "Lower Moderate Disability", color: "text-orange-400" };
  if (avgScore < 2.6) return { score: 6, severity: "Upper Moderate Disability", color: "text-yellow-500" };
  if (avgScore < 2.85) return { score: 7, severity: "Lower Good Recovery", color: "text-lime-500" };
  return { score: 8, severity: "Upper Good Recovery", color: "text-green-500" };
};

export const GOSEAssessment = ({ onComplete, onCancel }: GOSEAssessmentProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{ score: number; severity: string; color: string } | null>(null);

  const currentQ = GOSE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / GOSE_QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < GOSE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate and show results
      const goseResult = getGOSEScore(answers);
      setResult(goseResult);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !result) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("clinical_assessments").insert({
        user_id: user.id,
        assessment_type: "GOSE",
        score: result.score,
        severity: result.severity,
        subscores: answers,
        administered_by: "self",
      });

      if (error) throw error;

      toast.success("GOSE Assessment saved!", {
        description: `Your score: ${result.score}/8 - ${result.severity}`
      });
      
      onComplete(result.score, result.severity);
    } catch (error: any) {
      console.error("Error saving assessment:", error);
      toast.error("Failed to save assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && result) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <ClipboardCheck className="w-8 h-8 text-purple-400" />
          </div>
          <CardTitle className="text-white text-2xl">GOSE Assessment Complete</CardTitle>
          <CardDescription className="text-white/60">
            Glasgow Outcome Scale - Extended
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${result.color}`}>{result.score}</div>
            <div className="text-white/50 text-sm">out of 8</div>
            <Badge className={`mt-2 ${result.color} bg-white/10`}>
              {result.severity}
            </Badge>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-sm text-white/70">
                <p className="mb-2">The GOSE measures overall recovery after brain injury on an 8-point scale:</p>
                <ul className="space-y-1 text-xs">
                  <li>1 = Dead</li>
                  <li>2 = Vegetative State</li>
                  <li>3-4 = Severe Disability</li>
                  <li>5-6 = Moderate Disability</li>
                  <li>7-8 = Good Recovery</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-white/20 text-white/70 hover:text-white"
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Result"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="border-purple-500/50 text-purple-400">
            GOSE Assessment
          </Badge>
          <span className="text-white/50 text-sm">
            {currentQuestion + 1} / {GOSE_QUESTIONS.length}
          </span>
        </div>
        <Progress value={progress} className="h-1.5 bg-white/10" />
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-white text-lg font-medium mb-2">{currentQ.question}</h3>
              {currentQ.description && (
                <p className="text-white/50 text-sm">{currentQ.description}</p>
              )}
            </div>

            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    answers[currentQ.id] === option.value
                      ? "bg-purple-500/20 border-purple-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-white/80 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={currentQuestion === 0 ? onCancel : handleBack}
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentQuestion === 0 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {currentQuestion === GOSE_QUESTIONS.length - 1 ? "See Results" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
