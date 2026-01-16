import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  X, Smile, Meh, Frown, Zap, Moon, Activity,
  Check, Sparkles, Heart
} from "lucide-react";

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MOOD_OPTIONS = [
  { value: 1, icon: Frown, label: "Struggling", color: "text-red-400" },
  { value: 2, icon: Frown, label: "Low", color: "text-orange-400" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-400" },
  { value: 4, icon: Smile, label: "Good", color: "text-lime-400" },
  { value: 5, icon: Smile, label: "Great", color: "text-green-400" },
];

const SYMPTOM_OPTIONS = [
  { id: "headache", label: "Headache" },
  { id: "fatigue", label: "Fatigue" },
  { id: "brain_fog", label: "Brain Fog" },
  { id: "dizziness", label: "Dizziness" },
  { id: "anxiety", label: "Anxiety" },
  { id: "pain", label: "Pain" },
  { id: "nausea", label: "Nausea" },
  { id: "sensitivity", label: "Light/Sound Sensitivity" },
];

export const DailyCheckInModal = ({ isOpen, onClose, onComplete }: DailyCheckInModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [gratitude, setGratitude] = useState("");

  const steps = [
    { title: "How are you feeling?", key: "mood" },
    { title: "Energy level?", key: "energy" },
    { title: "Sleep quality?", key: "sleep" },
    { title: "Any symptoms?", key: "symptoms" },
    { title: "Gratitude moment", key: "gratitude" },
  ];

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const { error } = await supabase
        .from("daily_checkins")
        .upsert({
          user_id: user.id,
          check_date: today,
          mood,
          energy_level: energy,
          sleep_quality: sleep,
          symptoms_today: symptoms,
          gratitude_note: gratitude || null,
        }, {
          onConflict: "user_id,check_date"
        });

      if (error) throw error;

      toast.success("Check-in complete! 🔥", {
        description: "Your phoenix is grateful for showing up today."
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Error saving check-in:", error);
      toast.error("Failed to save check-in", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return mood !== null;
      case 1: return energy !== null;
      case 2: return sleep !== null;
      case 3: return true; // Symptoms are optional
      case 4: return true; // Gratitude is optional
      default: return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-orange-500/20 shadow-2xl">
          {/* Header */}
          <CardHeader className="relative pb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-medium text-sm uppercase tracking-wider">
                Daily Check-In
              </span>
            </div>
            
            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    index < step 
                      ? "bg-orange-500" 
                      : index === step 
                        ? "bg-orange-500/50" 
                        : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 0: Mood */}
                {step === 0 && (
                  <div className="space-y-4">
                    <CardTitle className="text-white text-xl">{steps[0].title}</CardTitle>
                    <div className="flex justify-between gap-2">
                      {MOOD_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setMood(option.value)}
                            className={`flex-1 p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                              mood === option.value
                                ? "bg-orange-500/20 border-orange-500"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${option.color}`} />
                            <span className="text-xs text-white/70">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1: Energy */}
                {step === 1 && (
                  <div className="space-y-4">
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      {steps[1].title}
                    </CardTitle>
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setEnergy(value)}
                          className={`flex-1 p-4 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                            energy === value
                              ? "bg-yellow-500/20 border-yellow-500"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-lg font-bold text-white">{value}</span>
                          <span className="text-xs text-white/50">
                            {value === 1 ? "Empty" : value === 5 ? "Full" : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Sleep */}
                {step === 2 && (
                  <div className="space-y-4">
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      {steps[2].title}
                    </CardTitle>
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setSleep(value)}
                          className={`flex-1 p-4 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                            sleep === value
                              ? "bg-indigo-500/20 border-indigo-500"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-lg font-bold text-white">{value}</span>
                          <span className="text-xs text-white/50">
                            {value === 1 ? "Poor" : value === 5 ? "Great" : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Symptoms */}
                {step === 3 && (
                  <div className="space-y-4">
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-400" />
                      {steps[3].title}
                    </CardTitle>
                    <p className="text-white/60 text-sm">Select any that apply (optional)</p>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOM_OPTIONS.map((symptom) => (
                        <button
                          key={symptom.id}
                          onClick={() => toggleSymptom(symptom.id)}
                          className={`px-3 py-2 rounded-full border text-sm transition-all ${
                            symptoms.includes(symptom.id)
                              ? "bg-red-500/20 border-red-500 text-red-300"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {symptom.label}
                          {symptoms.includes(symptom.id) && (
                            <Check className="w-3 h-3 inline ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                    {symptoms.length === 0 && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        No symptoms today ✨
                      </Badge>
                    )}
                  </div>
                )}

                {/* Step 4: Gratitude */}
                {step === 4 && (
                  <div className="space-y-4">
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-400" />
                      {steps[4].title}
                    </CardTitle>
                    <p className="text-white/60 text-sm">What's one thing you're grateful for today? (optional)</p>
                    <Textarea
                      value={gratitude}
                      onChange={(e) => setGratitude(e.target.value)}
                      placeholder="I'm grateful for..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep(prev => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="text-white/60 hover:text-white"
              >
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className={step === steps.length - 1 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
                }
              >
                {isSubmitting ? (
                  "Saving..."
                ) : step === steps.length - 1 ? (
                  <>
                    Complete Check-In
                    <Sparkles className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
