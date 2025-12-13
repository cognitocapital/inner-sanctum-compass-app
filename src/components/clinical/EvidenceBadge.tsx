import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Brain, ExternalLink, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export type EvidenceLevel = 'A' | 'B' | 'C' | 'research' | 'emerging';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  domain: string;
  description?: string;
  pubmedId?: string;
  className?: string;
}

const evidenceConfig: Record<EvidenceLevel, {
  label: string;
  color: string;
  icon: React.ElementType;
  tooltip: string;
}> = {
  A: {
    label: 'INCOG 2.0 Level A',
    color: 'border-green-500 text-green-500 bg-green-500/10',
    icon: CheckCircle2,
    tooltip: 'Strong evidence from RCTs and meta-analyses supporting efficacy in TBI rehabilitation',
  },
  B: {
    label: 'INCOG 2.0 Level B',
    color: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
    icon: Brain,
    tooltip: 'Moderate evidence from cohort studies and clinical consensus for TBI rehabilitation',
  },
  C: {
    label: 'INCOG 2.0 Level C',
    color: 'border-orange-500 text-orange-500 bg-orange-500/10',
    icon: Info,
    tooltip: 'Expert opinion and clinical practice recommendations for TBI rehabilitation',
  },
  research: {
    label: 'Research-Backed',
    color: 'border-blue-500 text-blue-500 bg-blue-500/10',
    icon: Brain,
    tooltip: 'Supported by peer-reviewed research, though not specifically validated in INCOG 2.0 TBI guidelines',
  },
  emerging: {
    label: 'Emerging Evidence',
    color: 'border-purple-500 text-purple-500 bg-purple-500/10',
    icon: AlertTriangle,
    tooltip: 'Preliminary research shows promise; more TBI-specific studies needed. Consult healthcare provider.',
  },
};

const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  level,
  domain,
  description,
  pubmedId,
  className = '',
}) => {
  const config = evidenceConfig[level];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-2 ${className}`}>
            <Badge variant="outline" className={`${config.color} cursor-help`}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
            <span className="text-sm text-muted-foreground">{domain}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-4 bg-popover border border-border">
          <div className="space-y-2">
            <p className="text-sm font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.tooltip}</p>
            {description && (
              <p className="text-xs text-muted-foreground italic">{description}</p>
            )}
            {pubmedId && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                View PubMed: PMID {pubmedId}
              </a>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EvidenceBadge;
