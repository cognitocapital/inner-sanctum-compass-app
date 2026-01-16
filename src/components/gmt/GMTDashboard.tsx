import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, CheckCircle2, RefreshCw, Eye, Sparkles, Trophy } from 'lucide-react';
import EvidenceBadge from '@/components/clinical/EvidenceBadge';

interface Goal {
  id: string;
  title: string;
  description: string;
  steps: { id: string; text: string; completed: boolean }[];
  phase: 'plan' | 'do' | 'check' | 'review';
}

interface GMTDashboardProps {
  onComplete?: (duration: number, score: number) => void;
}

const GMTDashboard = ({ onComplete }: GMTDashboardProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Morning Routine',
      description: 'Complete morning self-care routine independently',
      steps: [
        { id: '1a', text: 'Wake up and sit on bed edge for 1 minute', completed: false },
        { id: '1b', text: 'Brush teeth', completed: false },
        { id: '1c', text: 'Shower and dress', completed: false },
        { id: '1d', text: 'Prepare breakfast', completed: false },
      ],
      phase: 'plan',
    },
  ]);

  const [activeGoalId, setActiveGoalId] = useState<string | null>('1');
  const [startTime] = useState<number>(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    { key: 'plan', label: 'PLAN', icon: Target, description: 'Define your goal and break it into steps' },
    { key: 'do', label: 'DO', icon: CheckCircle2, description: 'Execute each step mindfully' },
    { key: 'check', label: 'CHECK', icon: Eye, description: 'Monitor progress and adjust' },
    { key: 'review', label: 'REVIEW', icon: RefreshCw, description: 'Reflect on what worked' },
  ];

  const activeGoal = goals.find(g => g.id === activeGoalId);
  const completedSteps = activeGoal?.steps.filter(s => s.completed).length || 0;
  const totalSteps = activeGoal?.steps.length || 1;
  const progress = (completedSteps / totalSteps) * 100;

  const toggleStep = (stepId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === activeGoalId) {
        return {
          ...goal,
          steps: goal.steps.map(step =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          ),
        };
      }
      return goal;
    }));
  };

  const advancePhase = () => {
    const phaseOrder: Goal['phase'][] = ['plan', 'do', 'check', 'review'];
    const currentIndex = phaseOrder.indexOf(activeGoal?.phase || 'plan');
    
    if (currentIndex === phaseOrder.length - 1) {
      // Complete the session
      const duration = Math.round((Date.now() - startTime) / 1000);
      const score = Math.round(progress);
      setIsComplete(true);
      onComplete?.(duration, score);
    } else {
      setGoals(prev => prev.map(goal => {
        if (goal.id === activeGoalId) {
          const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
          return { ...goal, phase: nextPhase };
        }
        return goal;
      }));
    }
  };

  if (isComplete) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30">
          <CardContent className="pt-8 text-center">
            <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">GMT Session Complete!</h2>
            <p className="text-muted-foreground mb-4">
              You completed {completedSteps}/{totalSteps} steps through the Plan-Do-Check-Review cycle.
            </p>
            <div className="p-4 bg-green-500/20 rounded-lg inline-block">
              <div className="text-2xl font-bold text-green-400">{Math.round(progress)}%</div>
              <div className="text-xs text-muted-foreground">Goal Progress</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* INCOG Evidence Badge */}
      <EvidenceBadge
        level="A"
        domain="Goal Management Training"
        description="GMT improves executive function through structured goal-setting and self-monitoring. Strong evidence from multiple RCTs."
        pubmedId="32855596"
      />

      {/* Phase Tracker */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-orange-500" />
            GMT Cycle
          </CardTitle>
          <CardDescription>Navigate through the Plan-Do-Check-Review cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center gap-2">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = activeGoal?.phase === phase.key;
              return (
                <div key={phase.key} className="flex items-center">
                  <div
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{phase.label}</span>
                  </div>
                  {index < phases.length - 1 && (
                    <div className="w-8 h-0.5 bg-muted mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Goal */}
      {activeGoal && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{activeGoal.title}</CardTitle>
                <CardDescription>{activeGoal.description}</CardDescription>
              </div>
              <Badge className="bg-orange-500">{activeGoal.phase.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedSteps}/{totalSteps} steps</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {activeGoal.steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    step.completed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <Checkbox
                    checked={step.completed}
                    onCheckedChange={() => toggleStep(step.id)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className={step.completed ? 'line-through text-muted-foreground' : ''}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Phase Navigation */}
            <Button onClick={advancePhase} className="w-full bg-orange-500 hover:bg-orange-600">
              {activeGoal.phase === 'review' ? 'Complete Session' : 'Advance to Next Phase'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* GMT Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Goal Management Training (GMT)</strong> is an evidence-based cognitive rehabilitation 
            technique that helps improve executive function after brain injury. The Plan-Do-Check-Review 
            cycle promotes self-monitoring and goal completion through structured steps.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GMTDashboard;
