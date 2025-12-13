import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Shield } from 'lucide-react';

interface ClinicalDisclaimerProps {
  type: 'warning' | 'info' | 'safety';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ClinicalDisclaimer: React.FC<ClinicalDisclaimerProps> = ({
  type,
  title,
  children,
  className = '',
}) => {
  const config = {
    warning: {
      icon: AlertTriangle,
      color: 'border-yellow-500/50 bg-yellow-500/10',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: Info,
      color: 'border-blue-500/50 bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    safety: {
      icon: Shield,
      color: 'border-orange-500/50 bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
  };

  const { icon: Icon, color, iconColor } = config[type];

  return (
    <Alert className={`${color} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <AlertDescription className="text-sm">
          {title && <p className="font-medium text-white mb-1">{title}</p>}
          <div className="text-muted-foreground">{children}</div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default ClinicalDisclaimer;
