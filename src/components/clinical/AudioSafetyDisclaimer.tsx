import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Brain, Zap, Users, AlertTriangle, Check, 
  ChevronDown, Clock, Headphones, BookOpen, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import SafetyAudioPlayer from "./SafetyAudioPlayer";
import QuickAbsScale from "./QuickAbsScale";
import { useSafetyConsent, SafetyConsent } from "@/hooks/use-safety-consent";

export interface SafetyPoint {
  id: string;
  icon: React.ReactNode;
  text: string;
  severity: "stop" | "caution" | "info";
}

export interface MethodOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedDuration?: number;
}

export interface AudioSafetyDisclaimerProps {
  moduleId: string;
  moduleName: string;
  accentColor?: "cyan" | "orange" | "purple" | "pink";
  phoenixEmoji?: string;
  audioUrl?: string;
  safetyScript: string;
  criticalPoints: SafetyPoint[];
  showAbsScale?: boolean;
  showMethodSelector?: boolean;
  methodOptions?: MethodOption[];
  onProceed: (consent: Omit<SafetyConsent, "moduleId" | "timestamp" | "expiresAt">) => void;
  onSkip?: () => void;
}

const AudioSafetyDisclaimer: React.FC<AudioSafetyDisclaimerProps> = ({
  moduleId,
  moduleName,
  accentColor = "cyan",
  phoenixEmoji = "🔥",
  audioUrl,
  safetyScript,
  criticalPoints,
  showAbsScale = true,
  showMethodSelector = false,
  methodOptions = [],
  onProceed,
  onSkip,
}) => {
  const { hasValidConsent, consent, saveConsent, getTimeRemaining } = useSafetyConsent(moduleId);
  const [checkedPoints, setCheckedPoints] = useState<Set<string>>(new Set());
  const [absScore, setAbsScore] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showReadVersion, setShowReadVersion] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);

  const accentClasses: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    cyan: { 
      bg: "bg-cyan-500/10", 
      border: "border-cyan-500/30", 
      text: "text-cyan-300",
      gradient: "from-cyan-400 to-blue-600"
    },
    orange: { 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/30", 
      text: "text-orange-300",
      gradient: "from-orange-400 to-red-600"
    },
    purple: { 
      bg: "bg-purple-500/10", 
      border: "border-purple-500/30", 
      text: "text-purple-300",
      gradient: "from-purple-400 to-pink-600"
    },
    pink: { 
      bg: "bg-pink-500/10", 
      border: "border-pink-500/30", 
      text: "text-pink-300",
      gradient: "from-pink-400 to-rose-600"
    },
  };

  const accent = accentClasses[accentColor];
  const timeRemaining = getTimeRemaining();

  // Check if all critical points are acknowledged
  const stopPoints = criticalPoints.filter(p => p.severity === "stop");
  const allCriticalChecked = stopPoints.every(p => checkedPoints.has(p.id));
  
  // Determine if user can proceed
  const canProceed = (audioCompleted || allCriticalChecked) && 
    (!showAbsScale || absScore !== null) &&
    (!showMethodSelector || selectedMethod !== null);

  const handleQuickProceed = () => {
    if (consent) {
      onProceed({
        method: "return",
        absScore: consent.absScore,
        selectedMethod: consent.selectedMethod,
        acknowledged: true,
      });
    }
  };

  const handleProceed = () => {
    const consentData = saveConsent({
      method: audioCompleted ? "audio" : "read",
      absScore: absScore ?? undefined,
      selectedMethod: selectedMethod ?? undefined,
      acknowledged: true,
    });
    onProceed(consentData);
  };

  const togglePoint = (id: string) => {
    const next = new Set(checkedPoints);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedPoints(next);
  };

  const getSeverityColor = (severity: SafetyPoint["severity"]) => {
    switch (severity) {
      case "stop": return "text-red-400";
      case "caution": return "text-amber-400";
      case "info": return "text-blue-400";
    }
  };

  // Quick proceed for returning users
  if (hasValidConsent && timeRemaining) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "max-w-md mx-auto p-6 rounded-2xl border backdrop-blur-sm",
          accent.bg, accent.border
        )}
      >
        <div className="text-center space-y-4">
          <motion.div
            className="text-5xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {phoenixEmoji}
          </motion.div>
          
          <h2 className="text-xl font-bold text-foreground">Welcome Back, Warrior</h2>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Safety reviewed {timeRemaining.hours}h {timeRemaining.minutes}m ago
            </span>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleQuickProceed}
              className={cn("w-full", `bg-gradient-to-r ${accent.gradient}`)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue to {moduleName}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                setCheckedPoints(new Set());
                setAbsScore(null);
                setSelectedMethod(null);
              }}
              className="w-full text-muted-foreground"
            >
              Review Safety Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "max-w-md mx-auto p-6 rounded-2xl border backdrop-blur-sm",
        accent.bg, accent.border
      )}
    >
      {/* Phoenix Companion Header */}
      <div className="text-center mb-6">
        <motion.div
          className="text-5xl mb-3"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {phoenixEmoji}
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          Phoenix Safety Guide
        </h2>
        <p className="text-sm text-muted-foreground">
          I'm here to guide you safely through {moduleName}
        </p>
      </div>

      {/* Audio Player or Read Option */}
      <div className="mb-6 space-y-3">
        <SafetyAudioPlayer
          audioUrl={audioUrl}
          fallbackScript={safetyScript}
          accentColor={accentColor}
          onComplete={() => setAudioCompleted(true)}
        />

        <Collapsible open={showReadVersion} onOpenChange={setShowReadVersion}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 mr-2" />
              {showReadVersion ? "Hide" : "Read"} key points instead
              <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", showReadVersion && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 space-y-2">
              {criticalPoints.map((point) => (
                <label
                  key={point.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    "bg-background/50 hover:bg-background/80",
                    checkedPoints.has(point.id) && "bg-background/80"
                  )}
                >
                  <Checkbox
                    checked={checkedPoints.has(point.id)}
                    onCheckedChange={() => togglePoint(point.id)}
                    className="mt-0.5"
                  />
                  <div className="flex items-start gap-2 flex-1">
                    <span className={getSeverityColor(point.severity)}>
                      {point.icon}
                    </span>
                    <span className="text-sm text-foreground/90">{point.text}</span>
                  </div>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Quick ABS Scale */}
      {showAbsScale && (
        <div className="mb-6">
          <QuickAbsScale
            value={absScore}
            onChange={setAbsScore}
            accentColor={accentColor}
          />
        </div>
      )}

      {/* Method Selector */}
      {showMethodSelector && methodOptions.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Choose your method
          </p>
          <div className="grid grid-cols-2 gap-2">
            {methodOptions.map((method) => (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all",
                  selectedMethod === method.id
                    ? `${accent.border} ${accent.bg}`
                    : "border-border/50 bg-background/30 hover:bg-background/50"
                )}
              >
                <span className="text-2xl block mb-1">{method.icon}</span>
                <span className="text-sm font-medium text-foreground">{method.name}</span>
                {method.recommendedDuration && (
                  <span className="text-xs text-muted-foreground block">
                    ~{method.recommendedDuration}s
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Warning for high agitation */}
      <AnimatePresence>
        {absScore !== null && absScore >= 3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">
                High agitation detected. Consider calming breathwork first, or proceed with a shorter session.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleProceed}
          disabled={!canProceed}
          className={cn("w-full", `bg-gradient-to-r ${accent.gradient}`)}
        >
          <Check className="w-4 h-4 mr-2" />
          I Understand — Begin {moduleName}
        </Button>

        {onSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="w-full text-muted-foreground"
          >
            Skip for Now
          </Button>
        )}
      </div>

      {/* Consent Note */}
      <p className="mt-4 text-xs text-center text-muted-foreground">
        Your acknowledgment will be remembered for 24 hours
      </p>
    </motion.div>
  );
};

export default AudioSafetyDisclaimer;
