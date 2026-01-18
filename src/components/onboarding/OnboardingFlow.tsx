import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Brain, Heart, Moon, Zap, Cloud, Activity, 
  ArrowRight, ArrowLeft, Check, Sparkles, Flame,
  Calendar, Clock, Target, Mountain, Snowflake
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const RECOVERY_GOALS = [
  { id: "memory", label: "Memory", icon: Brain, description: "Improve recall and retention" },
  { id: "focus", label: "Focus & Attention", icon: Target, description: "Enhance concentration" },
  { id: "mood", label: "Mood & Emotions", icon: Heart, description: "Emotional regulation" },
  { id: "sleep", label: "Sleep Quality", icon: Moon, description: "Better rest and recovery" },
  { id: "energy", label: "Energy & Fatigue", icon: Zap, description: "Combat tiredness" },
  { id: "anxiety", label: "Anxiety & Stress", icon: Cloud, description: "Calm the mind" },
  { id: "physical", label: "Physical Recovery", icon: Activity, description: "Strength and coordination" },
];

const INJURY_TYPES = [
  { id: "tbi", label: "Traumatic Brain Injury (TBI)" },
  { id: "abi", label: "Acquired Brain Injury (ABI)" },
  { id: "concussion", label: "Concussion" },
  { id: "stroke", label: "Stroke" },
  { id: "other", label: "Other / Prefer not to say" },
];

const PROTOCOL_PATHS = [
  {
    id: 'tbi_survivor',
    protocol: 'phoenix_rising',
    title: 'Phoenix Rising',
    subtitle: 'For TBI/ABI Survivors',
    description: 'A 20-week healing journey with gentle pacing, self-compassion, and science-backed neuroplasticity.',
    icon: Flame,
    gradient: 'from-orange-500 to-red-500',
    weeks: 20
  },
  {
    id: 'peak_performance',
    protocol: 'one_percent',
    title: 'The 1% Protocol',
    subtitle: 'For Peak Performers',
    description: 'A 16-week elite optimization program. Flow states, deliberate discomfort, and high hard goals.',
    icon: Mountain,
    gradient: 'from-cyan-500 to-blue-500',
    weeks: 16
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedProtocol, setSelectedProtocol] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [injuryType, setInjuryType] = useState<string>("");
  const [injuryDate, setInjuryDate] = useState<string>("");
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [cognitiveLevel, setCognitiveLevel] = useState(3);
  const [painLevel, setPainLevel] = useState(3);
  const [dailyCommitment, setDailyCommitment] = useState(10);

  const selectedPath = PROTOCOL_PATHS.find(p => p.id === selectedProtocol);
  const isTBIPath = selectedProtocol === 'tbi_survivor';

  const steps = isTBIPath ? [
    { title: "Welcome", subtitle: "Let's begin your journey" },
    { title: "Choose Path", subtitle: "Select your protocol" },
    { title: "Your Goals", subtitle: "What matters most to you?" },
    { title: "Your Story", subtitle: "Help us understand your journey" },
    { title: "Current State", subtitle: "How are you feeling today?" },
    { title: "Daily Practice", subtitle: "Set your commitment" },
  ] : [
    { title: "Welcome", subtitle: "Let's begin your journey" },
    { title: "Choose Path", subtitle: "Select your protocol" },
    { title: "Your Goals", subtitle: "What matters most to you?" },
    { title: "Current State", subtitle: "How are you feeling today?" },
    { title: "Daily Practice", subtitle: "Set your commitment" },
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in to save your profile");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update the profile with onboarding data including protocol selection
      const { error } = await supabase
        .from("profiles")
        .update({
          protocol_type: selectedProtocol || null,
          protocol_name: selectedPath?.protocol || null,
          primary_goals: selectedGoals,
          injury_type: isTBIPath ? (injuryType || null) : null,
          injury_date: isTBIPath ? (injuryDate || null) : null,
          current_symptoms: currentSymptoms,
          daily_goal_minutes: dailyCommitment,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      const protocolName = selectedPath?.title || "The Phoenix Protocol";
      toast.success(`Welcome to ${protocolName}!`, { 
        description: `Your ${selectedPath?.weeks || 20}-week transformation begins now.` 
      });
      onComplete();
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return selectedProtocol !== "";
      case 2: return selectedGoals.length > 0;
      case 3: return true; // Injury info or current state - both optional
      case 4: return true;
      case 5: return dailyCommitment >= 5;
      default: return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-gray-900 to-orange-900 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
        {/* Progress indicator */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < currentStep 
                      ? "bg-orange-500 text-white" 
                      : index === currentStep 
                        ? "bg-orange-500/20 border-2 border-orange-500 text-orange-400"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-16 h-0.5 mx-1 transition-all duration-300 ${
                    index < currentStep ? "bg-orange-500" : "bg-white/10"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center pb-2">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-xl animate-pulse" />
                    <div 
                      className="relative w-full h-full rounded-full border-2 border-orange-500/50 shadow-2xl animate-bounce"
                      style={{
                        backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    {/* Hatching cracks effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">Your Phoenix Awakens</CardTitle>
                  <CardDescription className="text-white/60 text-base">
                    Like a phoenix rising from the ashes, your recovery journey begins here. 
                    Let's personalize your path to help you soar again.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <h4 className="text-orange-300 font-medium mb-2">What to expect:</h4>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-orange-400" />
                        Personalized recovery modules
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-orange-400" />
                        AI-guided daily recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-orange-400" />
                        Science-backed rehabilitation tools
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-orange-400" />
                        Progress tracking and insights
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Path Selection */}
            {currentStep === 1 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-white">Choose Your Path</CardTitle>
                  <CardDescription className="text-white/60">
                    Two journeys, one destination: becoming your best self.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {PROTOCOL_PATHS.map((path) => {
                    const Icon = path.icon;
                    const isSelected = selectedProtocol === path.id;
                    return (
                      <button
                        key={path.id}
                        onClick={() => setSelectedProtocol(path.id)}
                        className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                          isSelected 
                            ? `bg-gradient-to-r ${path.gradient} bg-opacity-20 border-white/40 shadow-lg` 
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${path.gradient} ${isSelected ? 'shadow-lg' : 'opacity-70'}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-white">{path.title}</span>
                              <Badge className={`text-xs ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                                {path.weeks} weeks
                              </Badge>
                            </div>
                            <div className="text-sm text-white/60 mb-2">{path.subtitle}</div>
                            <p className="text-sm text-white/70">{path.description}</p>
                          </div>
                          {isSelected && <Check className="w-6 h-6 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-white">What are your recovery goals?</CardTitle>
                  <CardDescription className="text-white/60">
                    Select all that apply. We'll prioritize these in your journey.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 gap-3">
                    {RECOVERY_GOALS.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`w-full p-4 rounded-lg border transition-all duration-200 text-left flex items-center gap-4 ${
                            isSelected 
                              ? "bg-orange-500/20 border-orange-500 text-white" 
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-orange-500/30" : "bg-white/10"}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? "text-orange-400" : "text-white/50"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{goal.label}</div>
                            <div className="text-sm text-white/50">{goal.description}</div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-orange-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {selectedGoals.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedGoals.map(goalId => {
                        const goal = RECOVERY_GOALS.find(g => g.id === goalId);
                        return (
                          <Badge key={goalId} variant="secondary" className="bg-orange-500/20 text-orange-300">
                            {goal?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Injury Profile */}
            {currentStep === 2 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-white">Your Recovery Story</CardTitle>
                  <CardDescription className="text-white/60">
                    This helps us tailor recommendations. All fields are optional.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-white/80">Type of injury</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {INJURY_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setInjuryType(type.id)}
                          className={`w-full p-3 rounded-lg border transition-all text-left ${
                            injuryType === type.id 
                              ? "bg-orange-500/20 border-orange-500 text-white" 
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="injury-date" className="text-white/80 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      When did your injury occur? (optional)
                    </Label>
                    <Input
                      id="injury-date"
                      type="month"
                      value={injuryDate}
                      onChange={(e) => setInjuryDate(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Current State Assessment */}
            {currentStep === 3 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-white">How are you feeling today?</CardTitle>
                  <CardDescription className="text-white/60">
                    This helps us establish your baseline.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/80 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Energy Level
                      </Label>
                      <span className="text-orange-400 font-medium">{energyLevel}/5</span>
                    </div>
                    <Slider
                      value={[energyLevel]}
                      onValueChange={([v]) => setEnergyLevel(v)}
                      min={1}
                      max={5}
                      step={1}
                      className="[&>span]:bg-orange-500"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Very Low</span>
                      <span>Very High</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/80 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        Mental Clarity
                      </Label>
                      <span className="text-orange-400 font-medium">{cognitiveLevel}/5</span>
                    </div>
                    <Slider
                      value={[cognitiveLevel]}
                      onValueChange={([v]) => setCognitiveLevel(v)}
                      min={1}
                      max={5}
                      step={1}
                      className="[&>span]:bg-orange-500"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Very Foggy</span>
                      <span>Crystal Clear</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/80 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-400" />
                        Pain/Discomfort
                      </Label>
                      <span className="text-orange-400 font-medium">{painLevel}/5</span>
                    </div>
                    <Slider
                      value={[painLevel]}
                      onValueChange={([v]) => setPainLevel(v)}
                      min={1}
                      max={5}
                      step={1}
                      className="[&>span]:bg-orange-500"
                    />
                    <div className="flex justify-between text-xs text-white/40">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Daily Commitment */}
            {currentStep === 4 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-white">Set Your Daily Practice</CardTitle>
                  <CardDescription className="text-white/60">
                    Consistency is key. How much time can you commit each day?
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-5xl font-bold text-orange-400">
                      <Clock className="w-10 h-10" />
                      {dailyCommitment}
                    </div>
                    <div className="text-white/60 mt-2">minutes per day</div>
                  </div>

                  <Slider
                    value={[dailyCommitment]}
                    onValueChange={([v]) => setDailyCommitment(v)}
                    min={5}
                    max={60}
                    step={5}
                    className="[&>span]:bg-orange-500"
                  />
                  
                  <div className="flex justify-between text-sm text-white/40">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-4">
                    {[5, 10, 15, 20].map((mins) => (
                      <Button
                        key={mins}
                        variant="outline"
                        size="sm"
                        onClick={() => setDailyCommitment(mins)}
                        className={`${
                          dailyCommitment === mins 
                            ? "bg-orange-500/20 border-orange-500 text-orange-300" 
                            : "bg-white/5 border-white/10 text-white/60"
                        }`}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20 mt-6">
                    <div className="flex items-start gap-3">
                      <Flame className="w-6 h-6 text-orange-400 mt-0.5" />
                      <div>
                        <h4 className="text-orange-300 font-medium">Your Phoenix Promise</h4>
                        <p className="text-white/60 text-sm mt-1">
                          By committing to {dailyCommitment} minutes daily, you're taking a powerful step 
                          toward recovery. Every minute counts in rebuilding your strength.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="w-full max-w-md mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Begin My Journey
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
