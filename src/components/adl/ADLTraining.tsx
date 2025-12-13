import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, Pill, ShowerHead, MapPin, 
  CheckCircle2, ChevronRight, ChevronLeft, Trophy, RotateCcw 
} from 'lucide-react';
import EvidenceBadge from '@/components/clinical/EvidenceBadge';

interface ADLStep {
  id: string;
  instruction: string;
  tip?: string;
  completed: boolean;
}

interface ADLModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  steps: ADLStep[];
  completedCount: number;
}

const initialModules: ADLModule[] = [
  {
    id: 'kitchen-safety',
    title: 'Kitchen Safety & Meal Prep',
    description: 'Errorless learning for safe cooking practices',
    icon: ChefHat,
    category: 'Daily Living',
    completedCount: 0,
    steps: [
      { id: 'k1', instruction: 'Clear workspace before starting - remove clutter from counters', tip: 'A clear workspace reduces cognitive load', completed: false },
      { id: 'k2', instruction: 'Gather ALL ingredients and tools before cooking', tip: 'This prevents forgetting mid-task', completed: false },
      { id: 'k3', instruction: 'Set timers for each cooking step', tip: 'Use phone timers with clear labels', completed: false },
      { id: 'k4', instruction: 'Turn pot handles inward to prevent spills', completed: false },
      { id: 'k5', instruction: 'Check stove is OFF before leaving kitchen', tip: 'Make this a ritual - touch each knob', completed: false },
      { id: 'k6', instruction: 'Clean as you go - reduces overwhelm at end', completed: false },
    ],
  },
  {
    id: 'medication-management',
    title: 'Medication Management',
    description: 'Systematic approach to medication safety',
    icon: Pill,
    category: 'Health',
    completedCount: 0,
    steps: [
      { id: 'm1', instruction: 'Use a weekly pill organizer - fill at same time each week', tip: 'Sunday evening works well for many', completed: false },
      { id: 'm2', instruction: 'Set phone alarms for each medication time', tip: 'Use different sounds for different meds', completed: false },
      { id: 'm3', instruction: 'Keep medications in a visible, consistent location', completed: false },
      { id: 'm4', instruction: 'Maintain a written medication list with doses', tip: 'Keep copy in wallet and at home', completed: false },
      { id: 'm5', instruction: 'Check expiration dates monthly', completed: false },
      { id: 'm6', instruction: 'Confirm medication before taking - right pill, right time', completed: false },
    ],
  },
  {
    id: 'personal-hygiene',
    title: 'Personal Hygiene Routine',
    description: 'Structured morning self-care sequence',
    icon: ShowerHead,
    category: 'Self-Care',
    completedCount: 0,
    steps: [
      { id: 'h1', instruction: 'Wake up - sit on bed edge for 1 minute before standing', tip: 'Prevents dizziness from position change', completed: false },
      { id: 'h2', instruction: 'Use the bathroom', completed: false },
      { id: 'h3', instruction: 'Brush teeth for 2 minutes (use timer or electric brush)', completed: false },
      { id: 'h4', instruction: 'Shower - use non-slip mat and grab bar if needed', tip: 'Consider shower chair for fatigue', completed: false },
      { id: 'h5', instruction: 'Dress in prepared outfit (laid out night before)', tip: 'Reduces decision fatigue', completed: false },
      { id: 'h6', instruction: 'Take morning medications with breakfast', completed: false },
    ],
  },
  {
    id: 'community-navigation',
    title: 'Community Navigation',
    description: 'Safe strategies for outings and appointments',
    icon: MapPin,
    category: 'Independence',
    completedCount: 0,
    steps: [
      { id: 'c1', instruction: 'Plan route before leaving - check maps app', tip: 'Screenshot directions in case of signal loss', completed: false },
      { id: 'c2', instruction: 'Write appointment details: address, time, contact', completed: false },
      { id: 'c3', instruction: 'Pack bag night before - ID, phone, keys, wallet', tip: 'Use same bag always', completed: false },
      { id: 'c4', instruction: 'Set departure alarm with buffer time (15+ min early)', completed: false },
      { id: 'c5', instruction: 'Identify rest spots along route if walking', tip: 'Fatigue planning is self-care', completed: false },
      { id: 'c6', instruction: 'Have backup plan - taxi number, emergency contact', completed: false },
    ],
  },
];

const ADLTraining = () => {
  const [modules, setModules] = useState<ADLModule[]>(() => {
    const saved = localStorage.getItem('phoenix-adl-training');
    return saved ? JSON.parse(saved) : initialModules;
  });
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeModule = modules.find(m => m.id === activeModuleId);
  const currentStep = activeModule?.steps[currentStepIndex];

  useEffect(() => {
    localStorage.setItem('phoenix-adl-training', JSON.stringify(modules));
  }, [modules]);

  const toggleStepComplete = (stepId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === activeModuleId) {
        const updatedSteps = module.steps.map(step =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        return {
          ...module,
          steps: updatedSteps,
          completedCount: updatedSteps.filter(s => s.completed).length,
        };
      }
      return module;
    }));
  };

  const nextStep = () => {
    if (activeModule && currentStepIndex < activeModule.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const resetModule = (moduleId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          steps: module.steps.map(step => ({ ...step, completed: false })),
          completedCount: 0,
        };
      }
      return module;
    }));
    setCurrentStepIndex(0);
  };

  const getModuleProgress = (module: ADLModule) => {
    return (module.completedCount / module.steps.length) * 100;
  };

  // Module Selection View
  if (!activeModuleId) {
    return (
      <div className="space-y-6">
        {/* INCOG Evidence Badge */}
        <EvidenceBadge
          level="B"
          domain="Errorless Learning ADL Training"
          description="Errorless learning reduces frustration and builds procedural skills. Moderate evidence for daily living activities."
          pubmedId="32855596"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const progress = getModuleProgress(module);
            const isComplete = progress === 100;

            return (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:border-orange-500/50 ${
                  isComplete ? 'border-green-500/50 bg-green-500/5' : ''
                }`}
                onClick={() => {
                  setActiveModuleId(module.id);
                  setCurrentStepIndex(0);
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      isComplete ? 'bg-green-500/20' : 'bg-orange-500/20'
                    }`}>
                      {isComplete ? (
                        <Trophy className="w-6 h-6 text-green-500" />
                      ) : (
                        <Icon className="w-6 h-6 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{module.title}</h3>
                        <Badge variant="secondary" className="text-xs">{module.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{module.completedCount}/{module.steps.length} steps</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Errorless Learning</strong> structures tasks to minimize mistakes during learning. 
              By providing step-by-step guidance with helpful tips, you build confidence and competence 
              without the frustration of failure—a key principle in cognitive rehabilitation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Module View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setActiveModuleId(null)}
          className="text-orange-400"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Modules
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => resetModule(activeModuleId)}
          className="text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {activeModule && (
        <>
          {/* Module Header */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <activeModule.icon className="w-6 h-6 text-orange-500" />
                <div>
                  <CardTitle>{activeModule.title}</CardTitle>
                  <CardDescription>{activeModule.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Step {currentStepIndex + 1} of {activeModule.steps.length}</span>
                  <span>{activeModule.completedCount} completed</span>
                </div>
                <Progress value={getModuleProgress(activeModule)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Current Step */}
          {currentStep && (
            <Card className="min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={currentStep.completed}
                    onCheckedChange={() => toggleStepComplete(currentStep.id)}
                    className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <div className="flex-1">
                    <p className={`text-lg ${currentStep.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                      {currentStep.instruction}
                    </p>
                    {currentStep.tip && (
                      <p className="text-sm text-orange-400 mt-2 italic">
                        💡 {currentStep.tip}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStepIndex === activeModule.steps.length - 1}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* All Steps Overview */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">All Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeModule.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 text-sm p-2 rounded cursor-pointer transition-all ${
                      index === currentStepIndex ? 'bg-orange-500/20 border border-orange-500/30' : ''
                    } ${step.completed ? 'text-muted-foreground' : ''}`}
                    onClick={() => setCurrentStepIndex(index)}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-muted-foreground flex-shrink-0" />
                    )}
                    <span className={step.completed ? 'line-through' : ''}>{step.instruction}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ADLTraining;
