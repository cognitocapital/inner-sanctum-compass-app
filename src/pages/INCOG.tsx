import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Target, CheckCircle2, Circle, Plus, Sparkles, Brain, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { cn } from "@/lib/utils";

// GMT Dashboard - the ONE thing this module does exceptionally well
interface Goal {
  id: string;
  title: string;
  steps: { id: string; text: string; done: boolean }[];
  phase: 'plan' | 'do' | 'check' | 'review';
  createdAt: string;
}

const phaseInfo = {
  plan: { label: "Plan", color: "text-blue-400", bg: "bg-blue-500/20" },
  do: { label: "Do", color: "text-green-400", bg: "bg-green-500/20" },
  check: { label: "Check", color: "text-amber-400", bg: "bg-amber-500/20" },
  review: { label: "Review", color: "text-purple-400", bg: "bg-purple-500/20" },
};

const INCOG = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newStep, setNewStep] = useState("");
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [completedGoals, setCompletedGoals] = useState(0);
  
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const savedGoals = localStorage.getItem('gmtGoals');
    const savedCompleted = localStorage.getItem('gmtCompleted');
    
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedCompleted) setCompletedGoals(parseInt(savedCompleted));
  }, []);

  // Save goals
  useEffect(() => {
    localStorage.setItem('gmtGoals', JSON.stringify(goals));
  }, [goals]);

  const createGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      steps: [],
      phase: 'plan',
      createdAt: new Date().toISOString(),
    };
    
    setGoals(prev => [goal, ...prev]);
    setActiveGoal(goal);
    setNewGoalTitle("");
    toast({ title: "Goal created!", description: "Now break it into steps." });
  };

  const addStep = () => {
    if (!activeGoal || !newStep.trim()) return;
    
    const updatedGoals = goals.map(g => {
      if (g.id === activeGoal.id) {
        return {
          ...g,
          steps: [...g.steps, { id: Date.now().toString(), text: newStep, done: false }]
        };
      }
      return g;
    });
    
    setGoals(updatedGoals);
    setActiveGoal(updatedGoals.find(g => g.id === activeGoal.id) || null);
    setNewStep("");
  };

  const toggleStep = (stepId: string) => {
    if (!activeGoal) return;
    
    const updatedGoals = goals.map(g => {
      if (g.id === activeGoal.id) {
        return {
          ...g,
          steps: g.steps.map(s => 
            s.id === stepId ? { ...s, done: !s.done } : s
          )
        };
      }
      return g;
    });
    
    setGoals(updatedGoals);
    setActiveGoal(updatedGoals.find(g => g.id === activeGoal.id) || null);
  };

  const advancePhase = () => {
    if (!activeGoal) return;
    
    const phases: Goal['phase'][] = ['plan', 'do', 'check', 'review'];
    const currentIndex = phases.indexOf(activeGoal.phase);
    
    if (currentIndex === phases.length - 1) {
      // Complete the goal
      const newCompleted = completedGoals + 1;
      setCompletedGoals(newCompleted);
      localStorage.setItem('gmtCompleted', newCompleted.toString());
      setGoals(prev => prev.filter(g => g.id !== activeGoal.id));
      setActiveGoal(null);
      toast({ title: "Goal Complete! 🎉", description: "Executive function strengthened." });
      return;
    }
    
    const nextPhase = phases[currentIndex + 1];
    const updatedGoals = goals.map(g => 
      g.id === activeGoal.id ? { ...g, phase: nextPhase } : g
    );
    
    setGoals(updatedGoals);
    setActiveGoal(updatedGoals.find(g => g.id === activeGoal.id) || null);
    toast({ title: `Phase: ${phaseInfo[nextPhase].label}`, description: "Keep going!" });
  };

  const activePhase = activeGoal ? phaseInfo[activeGoal.phase] : null;
  const completedSteps = activeGoal?.steps.filter(s => s.done).length || 0;
  const totalSteps = activeGoal?.steps.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-900 text-white relative overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Brain className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold text-blue-100">Neurotech Arsenal</h1>
            </div>
            <EvidenceBadge level="A" domain="GMT" pubmedId="36594858" />
          </div>
          <div className="w-10" />
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{goals.length}</div>
            <div className="text-blue-300/60">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedGoals}</div>
            <div className="text-green-300/60">Completed</div>
          </div>
        </div>

        {/* GMT Dashboard */}
        {!activeGoal ? (
          <div className="space-y-4">
            {/* Create new goal */}
            <Card className="bg-slate-900/80 border-blue-500/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-300">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Goal Management Training</span>
                </div>
                <p className="text-blue-300/60 text-sm">
                  Break complex tasks into manageable steps using Plan → Do → Check → Review
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="What's your goal?"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="bg-slate-800/50 border-blue-500/20 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && createGoal()}
                  />
                  <Button
                    onClick={createGoal}
                    className="bg-blue-500 hover:bg-blue-400"
                    disabled={!newGoalTitle.trim()}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing goals */}
            {goals.map((goal) => (
              <Card
                key={goal.id}
                className="bg-slate-900/60 border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-colors"
                onClick={() => setActiveGoal(goal)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-blue-100 font-medium">{goal.title}</h3>
                      <p className="text-blue-300/50 text-sm">
                        {goal.steps.filter(s => s.done).length}/{goal.steps.length} steps
                      </p>
                    </div>
                    <span className={cn("px-2 py-1 rounded text-xs", phaseInfo[goal.phase].bg, phaseInfo[goal.phase].color)}>
                      {phaseInfo[goal.phase].label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {goals.length === 0 && (
              <div className="text-center py-12 text-blue-300/50">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Create your first goal to begin</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active goal view */}
            <Card className="bg-slate-900/80 border-blue-500/30">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400"
                    onClick={() => setActiveGoal(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-medium", activePhase?.bg, activePhase?.color)}>
                    {activePhase?.label}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-blue-100">{activeGoal.title}</h2>

                {/* Progress */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  {activeGoal.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-800/70"
                      onClick={() => toggleStep(step.id)}
                    >
                      {step.done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-blue-400/50" />
                      )}
                      <span className={cn("text-sm", step.done && "text-blue-300/50 line-through")}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add step */}
                {activeGoal.phase === 'plan' && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a step..."
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      className="bg-slate-800/50 border-blue-500/20 text-white"
                      onKeyDown={(e) => e.key === 'Enter' && addStep()}
                    />
                    <Button onClick={addStep} size="sm" className="bg-blue-500 hover:bg-blue-400">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Advance phase */}
                <Button
                  onClick={advancePhase}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400"
                  disabled={activeGoal.phase === 'plan' && activeGoal.steps.length === 0}
                >
                  {activeGoal.phase === 'review' ? (
                    <>
                      <Trophy className="w-5 h-5 mr-2" />
                      Complete Goal
                    </>
                  ) : (
                    <>
                      Next: {phaseInfo[['do', 'check', 'review'][['plan', 'do', 'check'].indexOf(activeGoal.phase)] as Goal['phase']].label}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quanta */}
        <div className="text-center mt-8">
          <p className="text-blue-200/60 italic text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            "My brain felt like it was constantly misfiring... GMT brought order."
          </p>
        </div>
      </div>
    </div>
  );
};

export default INCOG;
