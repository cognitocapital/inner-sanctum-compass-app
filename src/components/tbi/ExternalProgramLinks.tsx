import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, DollarSign, Clock, Brain, Zap, Target, MessageCircle } from "lucide-react";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";

interface ExternalProgram {
  id: string;
  name: string;
  description: string;
  domains: ("attention" | "memory" | "executive" | "communication")[];
  price: string;
  url: string;
  incogLevel: "A" | "B" | "C";
  features: string[];
  rating?: number;
}

interface ExternalProgramLinksProps {
  activeDomain?: string | null;
  className?: string;
}

const externalPrograms: ExternalProgram[] = [
  {
    id: "brainhq",
    name: "BrainHQ",
    description: "Attention sharpening and processing speed training",
    domains: ["attention"],
    price: "$96/year",
    url: "https://www.brainhq.com/",
    incogLevel: "A",
    features: ["29 exercises", "Personalized training", "Progress tracking"],
    rating: 4.5
  },
  {
    id: "cogmed",
    name: "Cogmed QM",
    description: "Clinician-guided working memory intensive program",
    domains: ["attention", "memory"],
    price: "$1,500 (clinician-guided)",
    url: "https://www.cogmed.com/",
    incogLevel: "A",
    features: ["25 sessions/5 weeks", "Coach support", "120+ peer-reviewed studies"],
    rating: 4.8
  },
  {
    id: "rehacom",
    name: "RehaCom",
    description: "Comprehensive cognitive rehabilitation modules",
    domains: ["attention", "memory", "executive"],
    price: "$500+ (clinical license)",
    url: "https://www.hasomed.de/en/rehacom.html",
    incogLevel: "A",
    features: ["30+ modules", "Adaptive difficulty", "Clinical reports"],
    rating: 4.6
  },
  {
    id: "constant",
    name: "Constant Therapy",
    description: "Speech-language and cognitive tasks app",
    domains: ["memory", "communication"],
    price: "$25/month",
    url: "https://constanttherapy.com/",
    incogLevel: "B",
    features: ["100,000+ tasks", "Clinician dashboard", "Home practice"],
    rating: 4.3
  },
  {
    id: "lumosity",
    name: "Lumosity",
    description: "General brain training with varied games",
    domains: ["attention", "memory", "executive"],
    price: "$60/year",
    url: "https://www.lumosity.com/",
    incogLevel: "C",
    features: ["50+ games", "Progress insights", "Mobile app"],
    rating: 4.0
  },
  {
    id: "proloquo",
    name: "Proloquo2Go",
    description: "AAC tool for communication support",
    domains: ["communication"],
    price: "$250 (one-time)",
    url: "https://www.assistiveware.com/products/proloquo2go",
    incogLevel: "B",
    features: ["Symbol-based", "Customizable vocabulary", "Text-to-speech"],
    rating: 4.7
  }
];

const domainIcons = {
  attention: Zap,
  memory: Brain,
  executive: Target,
  communication: MessageCircle
};

const domainColors = {
  attention: "bg-red-500/20 text-red-400 border-red-500/30",
  memory: "bg-green-500/20 text-green-400 border-green-500/30",
  executive: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  communication: "bg-pink-500/20 text-pink-400 border-pink-500/30"
};

const ExternalProgramLinks = ({ activeDomain, className }: ExternalProgramLinksProps) => {
  const filteredPrograms = activeDomain
    ? externalPrograms.filter(p => p.domains.includes(activeDomain as any))
    : externalPrograms;

  return (
    <Card className={`bg-gradient-to-br from-background/95 to-muted/30 border-border/50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-primary" />
          Evidence-Based Programs
          <Badge variant="outline" className="ml-auto text-xs">
            INCOG Approved
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Clinical and consumer programs with strong TBI evidence
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {filteredPrograms.map((program, idx) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded-lg border border-border/50 hover:border-primary/30 
              hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{program.name}</span>
                  <EvidenceBadge level={program.incogLevel} domain="INCOG" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {program.description}
                </p>
              </div>
              {program.rating && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs">{program.rating}</span>
                </div>
              )}
            </div>

            {/* Domain tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {program.domains.map(domain => {
                const Icon = domainIcons[domain];
                return (
                  <Badge 
                    key={domain} 
                    variant="outline" 
                    className={`text-xs capitalize ${domainColors[domain]}`}
                  >
                    <Icon className="w-2.5 h-2.5 mr-1" />
                    {domain}
                  </Badge>
                );
              })}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-2">
              {program.features.map((feature, i) => (
                <span key={i} className="text-xs text-muted-foreground">
                  • {feature}
                </span>
              ))}
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="w-3 h-3" />
                {program.price}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs gap-1"
                asChild
              >
                <a href={program.url} target="_blank" rel="noopener noreferrer">
                  Visit Site
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </motion.div>
        ))}

        {/* Research note */}
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-4">
          <p className="text-xs text-blue-300">
            <strong>Research Citations:</strong> PMID 36594858 (INCOG 2.0), 
            Canadian TBI Guidelines 2025, NINDS Biomarker Classification
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalProgramLinks;
