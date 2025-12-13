import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Brain, ClipboardList, MapPin, Building2, Globe } from 'lucide-react';

interface AssessmentResource {
  id: string;
  name: string;
  description: string;
  type: 'assessment' | 'center' | 'organization';
  url: string;
  category: string;
  location?: string;
}

const resources: AssessmentResource[] = [
  // Clinical Assessments
  {
    id: 'phq9',
    name: 'PHQ-9 Depression Screening',
    description: 'Validated 9-item questionnaire for depression severity assessment',
    type: 'assessment',
    url: 'https://www.mdcalc.com/calc/1725/phq-9-patient-health-questionnaire-9',
    category: 'Mental Health',
  },
  {
    id: 'gad7',
    name: 'GAD-7 Anxiety Assessment',
    description: 'Standardized measure for generalized anxiety disorder',
    type: 'assessment',
    url: 'https://www.mdcalc.com/calc/1727/gad-7-general-anxiety-disorder-7',
    category: 'Mental Health',
  },
  {
    id: 'moca',
    name: 'MoCA Cognitive Assessment',
    description: 'Montreal Cognitive Assessment for mild cognitive impairment',
    type: 'assessment',
    url: 'https://mocacognition.com/',
    category: 'Cognitive',
  },
  {
    id: 'fim',
    name: 'FIM (Functional Independence Measure)',
    description: 'Gold standard for measuring disability and rehabilitation outcomes',
    type: 'assessment',
    url: 'https://www.udsmr.org/WebModules/FIM/Fim_About.aspx',
    category: 'Functional',
  },
  // Australian BIRU Centers
  {
    id: 'epworth',
    name: 'Epworth Rehabilitation',
    description: 'Specialist brain injury rehabilitation programs',
    type: 'center',
    url: 'https://www.epworth.org.au/our-services/rehabilitation',
    category: 'Rehabilitation Center',
    location: 'Victoria, Australia',
  },
  {
    id: 'brightwater',
    name: 'Brightwater Care Group',
    description: 'Acquired brain injury rehabilitation services',
    type: 'center',
    url: 'https://www.brightwatergroup.com/our-services/brain-injury/',
    category: 'Rehabilitation Center',
    location: 'Western Australia',
  },
  // Organizations
  {
    id: 'bia',
    name: 'Brain Injury Australia',
    description: 'National peak body for brain injury advocacy and support',
    type: 'organization',
    url: 'https://www.braininjuryaustralia.org.au/',
    category: 'Advocacy',
  },
  {
    id: 'ibia',
    name: 'International Brain Injury Association',
    description: 'Global organization advancing brain injury research and care',
    type: 'organization',
    url: 'https://www.internationalbrain.org/',
    category: 'International',
  },
  {
    id: 'psychaustralia',
    name: 'Psychology Australia - Find a Psychologist',
    description: 'Directory to find neuropsychologists and TBI specialists',
    type: 'organization',
    url: 'https://www.psychology.org.au/Find-a-Psychologist',
    category: 'Professional Directory',
  },
  {
    id: 'synapse',
    name: 'Synapse Australia',
    description: 'Brain injury association offering support, information, and advocacy',
    type: 'organization',
    url: 'https://synapse.org.au/',
    category: 'Support Services',
  },
];

const ProfessionalAssessments = () => {
  const assessments = resources.filter(r => r.type === 'assessment');
  const centers = resources.filter(r => r.type === 'center');
  const organizations = resources.filter(r => r.type === 'organization');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return ClipboardList;
      case 'center': return Building2;
      case 'organization': return Globe;
      default: return Brain;
    }
  };

  const renderResourceCard = (resource: AssessmentResource) => {
    const Icon = getTypeIcon(resource.type);
    return (
      <Card 
        key={resource.id} 
        className="hover:border-orange-500/50 transition-all cursor-pointer group"
        onClick={() => window.open(resource.url, '_blank')}
      >
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
              <Icon className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{resource.name}</h4>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
                {resource.location && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-2 h-2 mr-1" />
                    {resource.location}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* INCOG Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          <Brain className="w-3 h-3 mr-1" />
          Professional Resources
        </Badge>
        <span className="text-sm text-muted-foreground">Clinical Assessments & Centers</span>
      </div>

      {/* Clinical Assessments */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-orange-500" />
          Clinical Assessments
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {assessments.map(renderResourceCard)}
        </div>
      </div>

      {/* Rehabilitation Centers */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-orange-500" />
          Rehabilitation Centers
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {centers.map(renderResourceCard)}
        </div>
      </div>

      {/* Organizations */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-500" />
          Organizations & Directories
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {organizations.map(renderResourceCard)}
        </div>
      </div>

      {/* Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            These resources link to validated clinical assessments and accredited rehabilitation centers. 
            For formal diagnosis and treatment plans, always consult with qualified healthcare professionals 
            who can administer and interpret these assessments in context.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalAssessments;
