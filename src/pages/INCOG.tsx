import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, Target, CheckCircle2, Circle, Sparkles, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/ui/glass-card";
import { PhoenixBackground } from "@/components/ui/phoenix-background";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";

interface Goal {
  id: string;
  title: string;
  steps: { id: string; text: string; completed: boolean }[];
  phase: 'plan' | 'do' | 'check' | 'review';
  createdAt: string;
}

const phases = [
  { id: 'plan', label: 'Plan', icon: Target, description: 'Define your goal and break it into steps' },
  { id: 'do', label: 'Do', icon: Circle, description: 'Execute your steps one at a time' },
  { id: 'check', label: 'Check', icon: CheckCircle2, description: 'Review progress and adjust' },
  { id: 'review', label: 'Review', icon: Trophy, description: 'Celebrate and learn from the process' }
];

const INCOG = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newStep, setNewStep] = useState("");
  const { toast } = useToast();

  // Load goals
  useEffect(() => {
    const saved = localStorage.getItem('gmtGoals');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGoals(parsed);
      if (parsed.length > 0) setActiveGoalId(parsed[0].id);
    }
  }, []);

  // Save goals
  useEffect(() => {
    localStorage.setItem('gmtGoals', JSON.stringify(goals));
  }, [goals]);

  const activeGoal = goals.find(g => g.id === activeGoalId);
  const currentPhaseIndex = activeGoal ? phases.findIndex(p => p.id === activeGoal.phase) : 0;
  const completedSteps = activeGoal?.steps.filter(s => s.completed).length || 0;
  const totalSteps = activeGoal?.steps.length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const createGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      steps: [],
      phase: 'plan',
      createdAt: new Date().toLocaleDateString()
    };
    
    setGoals(prev => [goal, ...prev]);
    setActiveGoalId(goal.id);
    setNewGoalTitle("");
    
    toast({ title: "Goal Created", description: "Now break it down into manageable steps." });
  };

  const addStep = () => {
    if (!newStep.trim() || !activeGoalId) return;
    
    setGoals(prev => prev.map(g => 
      g.id === activeGoalId 
        ? { ...g, steps: [...g.steps, { id: Date.now().toString(), text: newStep, completed: false }] }
        : g
    ));
    setNewStep("");
  };

  const toggleStep = (stepId: string) => {
    setGoals(prev => prev.map(g => 
      g.id === activeGoalId 
        ? { ...g, steps: g.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s) }
        : g
    ));
  };

  const advancePhase = () => {
    if (!activeGoal) return;
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex >= phases.length) {
      toast({ title: "🎉 Goal Complete!", description: "Amazing work completing your goal!" });
      setGoals(prev => prev.filter(g => g.id !== activeGoalId));
      setActiveGoalId(goals.length > 1 ? goals[1].id : null);
      return;
    }
    
    setGoals(prev => prev.map(g => 
      g.id === activeGoalId ? { ...g, phase: phases[nextIndex].id as Goal['phase'] } : g
    ));
    
    toast({ title: `Phase: ${phases[nextIndex].label}`, description: phases[nextIndex].description });
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <PhoenixBackground module="mind" />
      
      <div className="relative z-10 max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            <span className="font-medium">Neurotech Arsenal</span>
          </div>
          <EvidenceBadge level="A" domain="INCOG 2.0" />
        </div>

        {/* Quanta Prompt */}
        <GlassCard className="p-4 mb-6 border-l-4 border-l-cyan-400">
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-white/80 italic">"The PTA haze made everything blur together... but breaking tasks into steps brought clarity."</p>
              <p className="text-xs text-cyan-400/60 mt-1">— Ch2: Emerging from the fog</p>
            </div>
          </div>
        </GlassCard>

        {/* Phase Tracker */}
        {activeGoal && (
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Plan → Do → Check → Review</span>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {phases[currentPhaseIndex]?.label}
              </Badge>
            </div>
            <div className="flex gap-1 mb-3">
              {phases.map((phase, i) => (
                <div 
                  key={phase.id}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i <= currentPhaseIndex ? 'bg-cyan-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/50">{phases[currentPhaseIndex]?.description}</p>
          </GlassCard>
        )}

        {/* Active Goal */}
        {activeGoal ? (
          <GlassCard className="p-4 mb-6">
            <h3 className="font-medium mb-3">{activeGoal.title}</h3>
            
            {/* Steps */}
            <div className="space-y-2 mb-4">
              {activeGoal.steps.map(step => (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                    step.completed ? 'bg-cyan-500/20 line-through text-white/50' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-white/40 shrink-0" />
                  )}
                  <span className="text-sm">{step.text}</span>
                </button>
              ))}
            </div>

            {/* Add Step */}
            {activeGoal.phase === 'plan' && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Add a step..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
                  onKeyDown={(e) => e.key === 'Enter' && addStep()}
                />
                <Button onClick={addStep} size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                  Add
                </Button>
              </div>
            )}

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                <span>Progress</span>
                <span>{completedSteps}/{totalSteps} steps</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Advance Button */}
            <Button 
              onClick={advancePhase}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              disabled={activeGoal.phase === 'plan' && activeGoal.steps.length === 0}
            >
              {currentPhaseIndex >= phases.length - 1 ? '🎉 Complete Goal' : `Move to ${phases[currentPhaseIndex + 1]?.label}`}
            </Button>
          </GlassCard>
        ) : (
          /* Create Goal */
          <GlassCard className="p-4 mb-6">
            <h3 className="font-medium mb-3">Create a New Goal</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40"
                onKeyDown={(e) => e.key === 'Enter' && createGoal()}
              />
              <Button onClick={createGoal} className="bg-cyan-500 hover:bg-cyan-600">
                Create
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Other Goals */}
        {goals.length > 1 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/60">Other Goals</h3>
            {goals.filter(g => g.id !== activeGoalId).slice(0, 3).map(goal => (
              <button
                key={goal.id}
                onClick={() => setActiveGoalId(goal.id)}
                className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{goal.title}</span>
                  <Badge variant="outline" className="text-xs border-white/30">
                    {goal.phase}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default INCOG;
