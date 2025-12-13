import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Heart } from 'lucide-react';

interface ContraindicationItem {
  id: string;
  question: string;
  severity: 'stop' | 'caution' | 'info';
  advice: string;
}

interface SafetyPreScreenProps {
  title: string;
  description: string;
  contraindications: ContraindicationItem[];
  onProceed: () => void;
  onSkip?: () => void;
  accentColor?: string;
}

const SafetyPreScreen: React.FC<SafetyPreScreenProps> = ({
  title,
  description,
  contraindications,
  onProceed,
  onSkip,
  accentColor = 'orange',
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showWarnings, setShowWarnings] = useState(false);

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }));
  };

  const hasStopCondition = contraindications
    .filter(c => c.severity === 'stop')
    .some(c => checkedItems[c.id]);

  const hasCautionCondition = contraindications
    .filter(c => c.severity === 'caution')
    .some(c => checkedItems[c.id]);

  const activeWarnings = contraindications.filter(c => checkedItems[c.id]);

  const handleContinue = () => {
    if (hasStopCondition || hasCautionCondition) {
      setShowWarnings(true);
    } else {
      onProceed();
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'stop': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Heart className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'stop': return 'border-red-500/50 bg-red-500/10';
      case 'caution': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  if (showWarnings && activeWarnings.length > 0) {
    return (
      <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border-${accentColor}-500/30`}>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
          <CardTitle className="text-xl text-white">Safety Considerations</CardTitle>
          <CardDescription>
            Based on your responses, please review the following recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeWarnings.map((warning) => (
            <Alert key={warning.id} className={getSeverityColor(warning.severity)}>
              <div className="flex items-start gap-3">
                {getSeverityIcon(warning.severity)}
                <AlertDescription className="text-sm">
                  <p className="font-medium text-white mb-1">{warning.question}</p>
                  <p className="text-muted-foreground">{warning.advice}</p>
                </AlertDescription>
              </div>
            </Alert>
          ))}

          <div className="flex gap-3 pt-4">
            {hasStopCondition ? (
              <>
                <Button
                  onClick={onSkip}
                  variant="outline"
                  className="flex-1"
                >
                  Skip This Session
                </Button>
                <Button
                  onClick={() => setShowWarnings(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Review Again
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onSkip}
                  variant="outline"
                  className="flex-1"
                >
                  Skip for Now
                </Button>
                <Button
                  onClick={onProceed}
                  className={`flex-1 bg-${accentColor}-500 hover:bg-${accentColor}-600`}
                >
                  Proceed with Caution
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            When in doubt, always consult your healthcare provider before proceeding.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border-${accentColor}-500/30`}>
      <CardHeader className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full bg-${accentColor}-500/20 flex items-center justify-center mb-4`}>
          <Shield className={`w-8 h-8 text-${accentColor}-500`} />
        </div>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-4">
          Please check any that apply to you today:
        </p>

        <div className="space-y-3">
          {contraindications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                checkedItems[item.id] 
                  ? getSeverityColor(item.severity)
                  : 'border-border bg-muted/20'
              }`}
            >
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                className="mt-0.5"
              />
              <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                <span className="text-white">{item.question}</span>
              </label>
              {getSeverityIcon(item.severity)}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          {onSkip && (
            <Button onClick={onSkip} variant="ghost" className="flex-1">
              Skip Check
            </Button>
          )}
          <Button
            onClick={handleContinue}
            className={`flex-1 bg-${accentColor}-500 hover:bg-${accentColor}-600`}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Continue to Session
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          This quick check helps ensure your safety. Your wellness is our priority.
        </p>
      </CardContent>
    </Card>
  );
};

export default SafetyPreScreen;
