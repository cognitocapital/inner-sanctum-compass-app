import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, MessageSquare, Users, Clock, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainQuizProps {
  onComplete: (results: DomainQuizResults) => void;
  className?: string;
}

export interface DomainQuizResults {
  scores: Record<string, number>;
  prioritizedDomains: string[];
  recommendedModules: string[];
  quantaMessage: string;
}

// INCOG 2.0 domains with manuscript quanta
const domains = [
  {
    id: 'attention',
    name: 'Attention & Processing',
    icon: Target,
    question: 'How is your ability to focus and concentrate?',
    lowLabel: 'Very difficult',
    highLabel: 'No issues',
    quanta: 'Ch7: "My brain felt like it was constantly misfiring..."',
    modules: ['music', 'gmt'],
  },
  {
    id: 'memory',
    name: 'Memory & Learning',
    icon: Brain,
    question: 'How well can you remember new information?',
    lowLabel: 'Major struggles',
    highLabel: 'No problems',
    quanta: 'Ch2: "The PTA haze made everything blur together..."',
    modules: ['memory'],
  },
  {
    id: 'executive',
    name: 'Executive Function',
    icon: Target,
    question: 'How is your planning and decision-making?',
    lowLabel: 'Very impaired',
    highLabel: 'Fully capable',
    quanta: 'Prologue: "The roadmap was unclear, but I knew I had to plan..."',
    modules: ['gmt'],
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: MessageSquare,
    question: 'How easily can you express yourself and understand others?',
    lowLabel: 'Very difficult',
    highLabel: 'No issues',
    quanta: 'Ch4: "Words sometimes escaped me, floating just out of reach..."',
    modules: ['adl', 'music'],
  },
  {
    id: 'social',
    name: 'Social Cognition',
    icon: Users,
    question: 'How well do you read social cues and interact with others?',
    lowLabel: 'Very challenging',
    highLabel: 'No problems',
    quanta: 'Circle: "Community carries us when we cannot walk alone..."',
    modules: ['assessments'],
  },
  {
    id: 'pta',
    name: 'Post-Traumatic Amnesia',
    icon: Clock,
    question: 'Are you experiencing confusion about recent events or time?',
    lowLabel: 'Severe confusion',
    highLabel: 'Clear memory',
    quanta: 'Ch2: "Hospital corridors blurred, days merged into one..."',
    modules: ['memory', 'adl'],
  },
];

export const DomainQuiz = ({ onComplete, className }: DomainQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(domains.map(d => [d.id, 5]))
  );

  const currentDomain = domains[currentStep];
  const isLastStep = currentStep === domains.length - 1;
  const Icon = currentDomain.icon;

  const handleNext = () => {
    if (isLastStep) {
      // Calculate prioritized domains (lower scores = higher priority)
      const sortedDomains = [...domains].sort((a, b) => scores[a.id] - scores[b.id]);
      const prioritized = sortedDomains.slice(0, 3).map(d => d.id);
      
      // Get recommended modules based on prioritized domains
      const moduleSet = new Set<string>();
      prioritized.forEach(domainId => {
        const domain = domains.find(d => d.id === domainId);
        domain?.modules.forEach(m => moduleSet.add(m));
      });

      // Generate quanta message
      const lowestDomain = sortedDomains[0];
      const quantaMessage = lowestDomain.quanta;

      onComplete({
        scores,
        prioritizedDomains: prioritized,
        recommendedModules: Array.from(moduleSet),
        quantaMessage,
      });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setScores(prev => ({
      ...prev,
      [currentDomain.id]: value[0],
    }));
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-400';
    if (score <= 6) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <Card className={cn("bg-slate-900/80 border-orange-500/20 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-orange-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-400" />
            INCOG 2.0 Domain Assessment
          </CardTitle>
          <Badge variant="outline" className="text-orange-300 border-orange-500/30">
            {currentStep + 1} / {domains.length}
          </Badge>
        </div>
        <p className="text-xs text-orange-300/60">
          Rate your current abilities to prioritize your rehabilitation
        </p>
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
            {/* Domain Header */}
            <div className="text-center space-y-3">
              <motion.div
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-8 h-8 text-orange-400" />
              </motion.div>
              
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {currentDomain.name}
                </h3>
                <p className="text-sm text-orange-200/80 mt-1">
                  {currentDomain.question}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-white/5 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-orange-300/70 italic">
                  {currentDomain.quanta}
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-4 px-2">
              <Slider
                value={[scores[currentDomain.id]]}
                onValueChange={handleSliderChange}
                max={10}
                min={1}
                step={1}
                className="py-4"
              />
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-400">{currentDomain.lowLabel}</span>
                <span className={cn("text-3xl font-bold", getScoreColor(scores[currentDomain.id]))}>
                  {scores[currentDomain.id]}
                </span>
                <span className="text-emerald-400">{currentDomain.highLabel}</span>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2">
              {domains.map((_, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentStep
                      ? "bg-orange-500 w-8"
                      : index < currentStep
                        ? "bg-emerald-500 w-2"
                        : "bg-white/20 w-2"
                  )}
                  animate={index < currentStep ? { scale: [1, 1.2, 1] } : {}}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Completed domains summary */}
        {currentStep > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {domains.slice(0, currentStep).map((domain) => (
              <Badge 
                key={domain.id} 
                variant="secondary" 
                className="text-xs flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                {domain.name}: {scores[domain.id]}/10
              </Badge>
            ))}
          </div>
        )}

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500"
        >
          {isLastStep ? (
            <>
              <Target className="mr-2 w-4 h-4" />
              Get Personalized Protocol
            </>
          ) : (
            <>
              Next Domain
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DomainQuiz;
