import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, Brain, Heart, Shield, Zap, Users, 
  Clock, MapPin, ArrowRight, ArrowLeft, Check 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileData {
  nickname: string;
  injuryType: string;
  timeSinceInjury: string;
  primaryChallenges: string[];
  interests: string[];
  lookingFor: string[];
  bio: string;
}

interface ProfileQuizProps {
  onComplete: (profile: ProfileData) => void;
  onCancel: () => void;
}

const INJURY_TYPES = [
  { id: "tbi", label: "Traumatic Brain Injury", icon: Brain },
  { id: "stroke", label: "Stroke", icon: Zap },
  { id: "concussion", label: "Concussion/mTBI", icon: Shield },
  { id: "anoxic", label: "Anoxic Brain Injury", icon: Heart },
  { id: "other", label: "Other", icon: User },
];

const TIME_RANGES = [
  "Less than 6 months",
  "6 months - 1 year",
  "1-2 years",
  "2-5 years",
  "5+ years",
];

const CHALLENGES = [
  "Memory", "Fatigue", "Attention", "Emotional regulation",
  "Communication", "Balance/Vestibular", "Sensory processing", "Executive function"
];

const INTERESTS = [
  "Breathing exercises", "Cold exposure", "Meditation", 
  "Physical therapy", "Cognitive games", "Music therapy",
  "Writing/Journaling", "Peer support"
];

const LOOKING_FOR = [
  "Peer support", "Shared experiences", "Recovery tips",
  "Accountability partner", "Weekly check-ins", "Story sharing"
];

export const ProfileQuiz = ({ onComplete, onCancel }: ProfileQuizProps) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData>({
    nickname: "",
    injuryType: "",
    timeSinceInjury: "",
    primaryChallenges: [],
    interests: [],
    lookingFor: [],
    bio: ""
  });

  const steps = [
    { title: "Identity", subtitle: "Create your anonymous identity" },
    { title: "Journey", subtitle: "Share your recovery context" },
    { title: "Challenges", subtitle: "What are you working on?" },
    { title: "Interests", subtitle: "What recovery activities resonate?" },
    { title: "Connection", subtitle: "What are you seeking?" },
    { title: "Story", subtitle: "A brief intro (optional)" }
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return profile.nickname.length >= 2;
      case 1: return profile.injuryType && profile.timeSinceInjury;
      case 2: return profile.primaryChallenges.length > 0;
      case 3: return profile.interests.length > 0;
      case 4: return profile.lookingFor.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="backdrop-blur-md bg-card/95 border-primary/20 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    i === step ? "bg-primary scale-110" : 
                    i < step ? "bg-primary/50" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <Badge variant="outline" className="bg-primary/10 border-primary/30">
              {step + 1} of {steps.length}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{steps[step].title}</CardTitle>
          <p className="text-muted-foreground">{steps[step].subtitle}</p>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 0: Nickname */}
              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">
                    "Community carries us when we cannot walk alone..." — Introduction
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Choose your phoenix name</label>
                    <Input
                      placeholder="e.g., PhoenixRising, HealingJourney..."
                      value={profile.nickname}
                      onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                      className="text-lg"
                      maxLength={20}
                    />
                    <p className="text-xs text-muted-foreground">
                      This keeps your identity private while connecting with others
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Injury Type & Timeline */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Type of injury</label>
                    <div className="grid grid-cols-2 gap-2">
                      {INJURY_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setProfile({ ...profile, injuryType: type.id })}
                            className={cn(
                              "p-3 rounded-lg border transition-all duration-200",
                              "flex items-center gap-2 text-left",
                              profile.injuryType === type.id
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border hover:border-primary/50 text-muted-foreground"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time since injury
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TIME_RANGES.map((time) => (
                        <button
                          key={time}
                          onClick={() => setProfile({ ...profile, timeSinceInjury: time })}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-sm transition-all",
                            profile.timeSinceInjury === time
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Challenges */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select the areas you're currently focusing on:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CHALLENGES.map((challenge) => (
                      <button
                        key={challenge}
                        onClick={() => toggleArrayItem(
                          profile.primaryChallenges, 
                          challenge, 
                          (arr) => setProfile({ ...profile, primaryChallenges: arr })
                        )}
                        className={cn(
                          "px-4 py-2 rounded-full border transition-all duration-200",
                          profile.primaryChallenges.includes(challenge)
                            ? "border-primary bg-primary/20 text-foreground"
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        {challenge}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Interests */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    What recovery activities are you exploring?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleArrayItem(
                          profile.interests, 
                          interest, 
                          (arr) => setProfile({ ...profile, interests: arr })
                        )}
                        className={cn(
                          "px-4 py-2 rounded-full border transition-all duration-200",
                          profile.interests.includes(interest)
                            ? "border-primary bg-primary/20 text-foreground"
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Looking For */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    What kind of connections are you seeking?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleArrayItem(
                          profile.lookingFor, 
                          item, 
                          (arr) => setProfile({ ...profile, lookingFor: arr })
                        )}
                        className={cn(
                          "px-4 py-2 rounded-full border transition-all duration-200",
                          profile.lookingFor.includes(item)
                            ? "border-primary bg-primary/20 text-foreground"
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Bio */}
              {step === 5 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">
                    "Your story is still being written..." — Unwritten Chapters
                  </p>
                  <Textarea
                    placeholder="Share a brief intro about yourself and your recovery journey (optional)..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="min-h-[120px]"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {profile.bio.length}/300 characters
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={step > 0 ? () => setStep(step - 1) : onCancel}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step > 0 ? "Back" : "Cancel"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90"
            >
              {step === steps.length - 1 ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileQuiz;
