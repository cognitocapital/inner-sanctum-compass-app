import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Target, Music, Repeat, ClipboardList, Sparkles, BookOpen, Zap } from "lucide-react";
import GMTDashboard from "@/components/gmt/GMTDashboard";
import MusicTherapy from "@/components/therapy/MusicTherapy";
import ADLTraining from "@/components/adl/ADLTraining";
import SpacedRepetition from "@/components/memory/SpacedRepetition";
import ProfessionalAssessments from "@/components/assessments/ProfessionalAssessments";
import { MobileBottomNav, MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileFullScreenModal } from "@/components/ui/mobile-modal";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileActionCard } from "@/components/ui/mobile-action-card";
import { DomainWheel, createINCOGDomains } from "@/components/ui/domain-wheel";
import { NeuralNetworkViz, createBrainNetwork } from "@/components/ui/neural-network-viz";
import { PhoenixLevelBadge, usePhoenixGamification } from "@/components/ui/phoenix-gamification";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const modules = [
  { 
    id: 'gmt', 
    label: 'GMT', 
    icon: Target, 
    title: 'Goal Management Training', 
    description: 'Executive function & self-awareness',
    evidenceLevel: 'A',
    xpReward: 75,
    domain: 'executive'
  },
  { 
    id: 'music', 
    label: 'Music', 
    icon: Music, 
    title: 'Music & Rhythm Therapy', 
    description: 'Attention & processing speed',
    evidenceLevel: 'A',
    xpReward: 50,
    domain: 'attention'
  },
  { 
    id: 'memory', 
    label: 'Memory', 
    icon: Repeat, 
    title: 'Spaced Repetition', 
    description: 'Memory consolidation',
    evidenceLevel: 'A',
    xpReward: 60,
    domain: 'memory'
  },
  { 
    id: 'adl', 
    label: 'ADL', 
    icon: BookOpen, 
    title: 'Errorless ADL Training', 
    description: 'Daily living activities',
    evidenceLevel: 'B',
    xpReward: 50,
    domain: 'communication'
  },
  { 
    id: 'assessments', 
    label: 'Assess', 
    icon: ClipboardList, 
    title: 'Professional Assessments', 
    description: 'Clinical evaluations',
    evidenceLevel: 'A',
    xpReward: 40,
    domain: 'social'
  },
];

// Manuscript quanta for INCOG domains
const domainQuanta = {
  executive: "Ch7: 'My brain felt like it was constantly misfiring...' - Planning rebuilds neural pathways",
  memory: "Ch2: 'The PTA haze lifted slowly...' - Memory training accelerates recovery",
  attention: "Intro: 'Tools for the journey...' - Focused attention is trainable",
  communication: "Ch4: 'Words sometimes escaped me...' - Communication skills return with practice",
  social: "Circle: 'Community carries us forward...' - Social cognition heals through connection",
  pta: "Ch2: 'Hospital corridors blurred together...' - Emerging from post-traumatic amnesia",
};

const INCOG = () => {
  const [activeModule, setActiveModule] = useState('gmt');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);
  const [showBrainViz, setShowBrainViz] = useState(false);
  const [domainProgress, setDomainProgress] = useState<Record<string, number>>({});
  
  const { state: gamification, addXp, unlockAchievement } = usePhoenixGamification();
  const brainNetwork = createBrainNetwork();
  const domains = createINCOGDomains(domainProgress);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('incogDomainProgress');
    if (saved) {
      setDomainProgress(JSON.parse(saved));
    }
  }, []);

  // Get active regions based on current module
  const getActiveRegions = () => {
    const module = modules.find(m => m.id === activeModule);
    if (!module) return [];
    
    const regionMap: Record<string, string[]> = {
      executive: ['frontal'],
      memory: ['temporal', 'limbic'],
      attention: ['frontal', 'parietal'],
      communication: ['temporal'],
      social: ['limbic', 'frontal'],
    };
    
    return regionMap[module.domain] || [];
  };

  const navItems = modules.slice(0, 4).map(m => ({
    id: m.id,
    label: m.label,
    icon: <m.icon className="h-5 w-5" />
  }));

  navItems.push({
    id: 'more',
    label: 'More',
    icon: <ClipboardList className="h-5 w-5" />
  });

  const handleNavSelect = (id: string) => {
    if (id === 'more') {
      setSelectedModule(modules.find(m => m.id === 'assessments') || null);
      setShowModuleModal(true);
    } else {
      setActiveModule(id);
    }
  };

  const handleModuleCardClick = (module: typeof modules[0]) => {
    setSelectedModule(module);
    setShowModuleModal(true);
  };

  const handleDomainClick = (domain: { id: string }) => {
    const module = modules.find(m => m.domain === domain.id);
    if (module) {
      setActiveModule(module.id);
    }
  };

  const renderModuleContent = (moduleId: string) => {
    switch (moduleId) {
      case 'gmt': return <GMTDashboard />;
      case 'music': return <MusicTherapy />;
      case 'memory': return <SpacedRepetition />;
      case 'adl': return <ADLTraining />;
      case 'assessments': return <ProfessionalAssessments />;
      default: return null;
    }
  };

  const currentModule = modules.find(m => m.id === activeModule);

  return (
    <MobilePageContainer className="bg-gradient-to-b from-gray-900 via-slate-900 to-orange-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-orange-500/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-white text-sm">INCOG 2.0</span>
            </div>
            <PhoenixLevelBadge 
              level={gamification.level} 
              xp={gamification.xp} 
              xpToNextLevel={gamification.xpToNextLevel}
              size="sm"
              showProgress={false}
            />
          </div>
        </div>
      </div>

      {/* Hero with Domain Wheel & Brain Visualization */}
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
            Cognitive Rehabilitation
          </h1>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            Evidence-based interventions aligned with INCOG 2.0 international guidelines
          </p>
          <div className="mt-3">
            <EvidenceBadge
              level="A"
              domain="INCOG 2.0 Cognitive Rehab"
              description="International guidelines for cognitive rehabilitation post-TBI"
              pubmedId="37673101"
            />
          </div>
        </div>

        {/* Interactive Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Domain Progress Wheel */}
          <Card className="bg-slate-900/60 border-orange-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-200 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Domain Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <DomainWheel 
                domains={domains} 
                size="md" 
                onDomainClick={handleDomainClick}
                centerContent={
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs text-gray-400">Tap to explore</div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Neural Network Visualization */}
          <Card className="bg-slate-900/60 border-orange-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-200 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Active Brain Regions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <NeuralNetworkViz
                nodes={brainNetwork.nodes}
                connections={brainNetwork.connections}
                activeRegions={getActiveRegions()}
                size="md"
                animated
              />
            </CardContent>
          </Card>
        </div>

        {/* Current Module Quanta */}
        {currentModule && (
          <Card className="bg-white/5 border-orange-500/10 mb-4">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-orange-200/80 italic">
                  {domainQuanta[currentModule.domain as keyof typeof domainQuanta]}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Horizontal Tabs */}
      <div className="hidden md:block px-4 pb-4">
        <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg max-w-3xl mx-auto">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-all",
                activeModule === module.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              )}
            >
              <module.icon className="w-4 h-4" />
              <span>{module.label}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Level {module.evidenceLevel}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Module Cards Grid */}
      <div className="md:hidden px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className={cn(
                "cursor-pointer transition-all hover:scale-[1.02] border-orange-500/30 bg-slate-900/80",
                activeModule === module.id && "ring-2 ring-orange-500"
              )}
              onClick={() => handleModuleCardClick(module)}
            >
              <CardContent className="p-3 text-center">
                <module.icon className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                <div className="text-sm font-semibold text-white">{module.title}</div>
                <div className="text-xs text-gray-400 mt-1">{module.description}</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-400">
                    INCOG {module.evidenceLevel}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    +{module.xpReward} XP
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop: Module Content */}
      <div className="hidden md:block px-4 pb-8 max-w-4xl mx-auto">
        <Card className="bg-slate-900/60 border-orange-500/20">
          <CardHeader className="border-b border-orange-500/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {currentModule && <currentModule.icon className="w-5 h-5 text-orange-400" />}
                {currentModule?.title}
              </CardTitle>
              {currentModule && (
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  INCOG Level {currentModule.evidenceLevel}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 text-white">
            {renderModuleContent(activeModule)}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        items={navItems}
        activeId={activeModule}
        onSelect={handleNavSelect}
        accentColor="orange"
      />

      {/* Module Modal (Mobile) */}
      <MobileFullScreenModal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        title={selectedModule?.title || 'Module'}
        accentColor="orange"
      >
        <div className="p-4 text-white">
          {selectedModule && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  INCOG Level {selectedModule.evidenceLevel}
                </Badge>
                <Badge variant="secondary">
                  +{selectedModule.xpReward} XP
                </Badge>
              </div>
              {renderModuleContent(selectedModule.id)}
            </>
          )}
        </div>
      </MobileFullScreenModal>
    </MobilePageContainer>
  );
};

export default INCOG;
