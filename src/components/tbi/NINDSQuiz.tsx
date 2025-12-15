import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Target, 
  MessageCircle, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from "lucide-react";

interface QuizQuestion {
  id: string;
  domain: "attention" | "memory" | "executive" | "communication";
  question: string;
  options: { label: string; value: number; description?: string }[];
  manuscriptQuanta?: string;
}

interface NINDSQuizProps {
  onComplete: (results: DomainResults) => void;
  onSkip?: () => void;
}

export interface DomainResults {
  attention: number;
  memory: number;
  executive: number;
  communication: number;
  recommendations: string[];
  priorityDomains: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "att1",
    domain: "attention",
    question: "How often do you lose track of conversations or tasks?",
    options: [
      { label: "Rarely", value: 0, description: "Almost never happens" },
      { label: "Sometimes", value: 1, description: "Once or twice a week" },
      { label: "Often", value: 2, description: "Daily occurrence" },
      { label: "Very Often", value: 3, description: "Multiple times per day" }
    ],
    manuscriptQuanta: "Ch7 \"misfiring neurons\": The goldfish capacity, when thoughts slip away like water..."
  },
  {
    id: "att2",
    domain: "attention",
    question: "Do you find it difficult to focus in environments with background noise?",
    options: [
      { label: "No difficulty", value: 0 },
      { label: "Mild difficulty", value: 1 },
      { label: "Moderate difficulty", value: 2 },
      { label: "Severe difficulty", value: 3 }
    ]
  },
  {
    id: "mem1",
    domain: "memory",
    question: "How often do you forget recent conversations or appointments?",
    options: [
      { label: "Rarely", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Very Often", value: 3 }
    ],
    manuscriptQuanta: "Ch2 \"PTA gaps\": Those hospital days, fragments floating in fog..."
  },
  {
    id: "mem2",
    domain: "memory",
    question: "Do you struggle to learn new information or routines?",
    options: [
      { label: "No difficulty", value: 0 },
      { label: "Mild difficulty", value: 1 },
      { label: "Moderate difficulty", value: 2 },
      { label: "Severe difficulty", value: 3 }
    ]
  },
  {
    id: "exec1",
    domain: "executive",
    question: "How challenging is it to plan and organize daily tasks?",
    options: [
      { label: "Not challenging", value: 0 },
      { label: "Somewhat challenging", value: 1 },
      { label: "Very challenging", value: 2 },
      { label: "Extremely challenging", value: 3 }
    ],
    manuscriptQuanta: "Ch3 \"rollercoaster\": The emotional planning, when the simplest decisions feel like mountains..."
  },
  {
    id: "exec2",
    domain: "executive",
    question: "Do you have trouble controlling impulses or managing emotions?",
    options: [
      { label: "Rarely", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Very Often", value: 3 }
    ]
  },
  {
    id: "comm1",
    domain: "communication",
    question: "How difficult is it to find the right words during conversation?",
    options: [
      { label: "Not difficult", value: 0 },
      { label: "Mildly difficult", value: 1 },
      { label: "Moderately difficult", value: 2 },
      { label: "Very difficult", value: 3 }
    ],
    manuscriptQuanta: "Intro \"community\": Words that once flowed freely, now requiring patience..."
  },
  {
    id: "comm2",
    domain: "communication",
    question: "Do you have trouble understanding social cues or others' emotions?",
    options: [
      { label: "No trouble", value: 0 },
      { label: "Some trouble", value: 1 },
      { label: "Significant trouble", value: 2 },
      { label: "Severe trouble", value: 3 }
    ]
  }
];

const domainIcons = {
  attention: Zap,
  memory: Brain,
  executive: Target,
  communication: MessageCircle
};

const domainColors = {
  attention: "from-red-500 to-orange-500",
  memory: "from-green-500 to-emerald-500",
  executive: "from-purple-500 to-violet-500",
  communication: "from-pink-500 to-rose-500"
};

const NINDSQuiz = ({ onComplete, onSkip }: NINDSQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showQuanta, setShowQuanta] = useState(false);

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const Icon = domainIcons[currentQ.domain];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    
    // Show quanta if available
    if (currentQ.manuscriptQuanta) {
      setShowQuanta(true);
      setTimeout(() => setShowQuanta(false), 3000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const domainScores: Record<string, { total: number; count: number }> = {
      attention: { total: 0, count: 0 },
      memory: { total: 0, count: 0 },
      executive: { total: 0, count: 0 },
      communication: { total: 0, count: 0 }
    };

    quizQuestions.forEach(q => {
      const answer = answers[q.id] || 0;
      domainScores[q.domain].total += answer;
      domainScores[q.domain].count += 1;
    });

    const normalizedScores = {
      attention: domainScores.attention.total / (domainScores.attention.count * 3),
      memory: domainScores.memory.total / (domainScores.memory.count * 3),
      executive: domainScores.executive.total / (domainScores.executive.count * 3),
      communication: domainScores.communication.total / (domainScores.communication.count * 3)
    };

    const priorityDomains = Object.entries(normalizedScores)
      .filter(([_, score]) => score >= 0.5)
      .sort(([_, a], [__, b]) => b - a)
      .map(([domain]) => domain);

    const recommendations = generateRecommendations(normalizedScores, priorityDomains);

    onComplete({
      ...normalizedScores,
      recommendations,
      priorityDomains
    });
  };

  const generateRecommendations = (
    scores: Record<string, number>, 
    priorities: string[]
  ): string[] => {
    const recs: string[] = [];
    
    if (scores.attention >= 0.5) {
      recs.push("Start with Dual N-Back training (Level A) for sustained attention");
      recs.push("Consider BrainHQ attention modules for selective focus");
    }
    if (scores.memory >= 0.5) {
      recs.push("Implement spaced repetition with errorless learning techniques");
      recs.push("External aids: Digital reminders and memory notebooks");
    }
    if (scores.executive >= 0.5) {
      recs.push("Begin Goal Management Training (GMT) dashboard exercises");
      recs.push("Daily self-monitoring checklists for metacognitive awareness");
    }
    if (scores.communication >= 0.5) {
      recs.push("Practice pragmatics simulations for social cognition");
      recs.push("Consider speech therapy evaluation (Constant Therapy)");
    }
    
    if (priorities.length === 0) {
      recs.push("Maintain cognitive health with varied brain training");
    }

    return recs;
  };

  return (
    <Card className="bg-gradient-to-br from-background/95 to-muted/50 border-primary/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${domainColors[currentQ.domain]}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            NINDS Assessment
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {currentQ.domain}
          </Badge>
        </div>
        <div className="space-y-2 mt-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question */}
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-foreground font-medium"
        >
          {currentQ.question}
        </motion.div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((option, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleAnswer(option.value)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200
                ${answers[currentQ.id] === option.value
                  ? `border-primary bg-primary/10 shadow-md`
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{option.label}</span>
                {answers[currentQ.id] === option.value && (
                  <CheckCircle className="w-4 h-4 text-primary" />
                )}
              </div>
              {option.description && (
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              )}
            </motion.button>
          ))}
        </div>

        {/* Manuscript Quanta Display */}
        <AnimatePresence>
          {showQuanta && currentQ.manuscriptQuanta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
            >
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 italic">
                  {currentQ.manuscriptQuanta}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          {onSkip && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSkip}
              className="text-muted-foreground"
            >
              Skip Assessment
            </Button>
          )}
          <Button
            onClick={nextQuestion}
            disabled={answers[currentQ.id] === undefined}
            className="ml-auto gap-2"
            size="sm"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Get Results' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Clinical Note */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300">
            Based on NINDS biomarker classification & Canadian 2025 mental health guidelines. 
            Discuss results with your healthcare provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NINDSQuiz;
