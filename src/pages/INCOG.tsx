import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Target, Music, Dumbbell, Brain, Repeat, ClipboardList } from 'lucide-react';
import GMTDashboard from '@/components/gmt/GMTDashboard';
import MusicTherapy from '@/components/therapy/MusicTherapy';
import ADLTraining from '@/components/adl/ADLTraining';
import SpacedRepetition from '@/components/memory/SpacedRepetition';
import ProfessionalAssessments from '@/components/assessments/ProfessionalAssessments';
import { MobileBottomNav, MobilePageContainer } from '@/components/ui/mobile-nav';
import { MobileFullScreenModal } from '@/components/ui/mobile-modal';
import { MobileHeader } from '@/components/ui/mobile-header';
import { MobileActionCard } from '@/components/ui/mobile-action-card';
import { cn } from '@/lib/utils';

const modules = [
  { id: 'gmt', label: 'GMT', icon: Target, title: 'Goal Management Training', description: 'Executive function training' },
  { id: 'music', label: 'Music', icon: Music, title: 'Music Therapy', description: 'Rhythm-based rehabilitation' },
  { id: 'memory', label: 'Memory', icon: Repeat, title: 'Spaced Repetition', description: 'Memory training system' },
  { id: 'adl', label: 'ADL', icon: Dumbbell, title: 'ADL Training', description: 'Daily living activities' },
  { id: 'assessments', label: 'Assess', icon: ClipboardList, title: 'Assessments', description: 'Professional evaluations' },
];

const INCOG = () => {
  const [activeModule, setActiveModule] = useState('gmt');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);

  const navItems = modules.slice(0, 4).map(m => ({
    id: m.id,
    label: m.label,
    icon: <m.icon className="h-5 w-5" />
  }));

  // Add "More" for remaining modules on mobile
  navItems.push({
    id: 'more',
    label: 'More',
    icon: <ClipboardList className="h-5 w-5" />
  });

  const handleNavSelect = (id: string) => {
    if (id === 'more') {
      // Show assessments modal
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

  return (
    <MobilePageContainer className="bg-gradient-to-b from-gray-900 via-gray-900 to-orange-900">
      {/* Header - Simplified for mobile */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-orange-500/20">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-white text-sm">INCOG 2.0</span>
          </div>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Hero - Compact on mobile */}
      <div className="text-center px-4 py-4 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
          Cognitive Rehabilitation
        </h1>
        <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto">
          Evidence-based interventions aligned with INCOG 2.0 guidelines
        </p>
      </div>

      {/* Desktop: Horizontal Tabs */}
      <div className="hidden md:block px-4 pb-4">
        <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg max-w-2xl mx-auto">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all",
                activeModule === module.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              )}
            >
              <module.icon className="w-4 h-4" />
              {module.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Module Cards Grid */}
      <div className="md:hidden px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {modules.map((module) => (
            <MobileActionCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={<module.icon className="h-6 w-6 text-orange-400" />}
              accentColor="orange"
              onClick={() => handleModuleCardClick(module)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Desktop: Module Content */}
      <div className="hidden md:block px-4 pb-8 max-w-4xl mx-auto">
        <div className="text-white">
          {renderModuleContent(activeModule)}
        </div>
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
          {selectedModule && renderModuleContent(selectedModule.id)}
        </div>
      </MobileFullScreenModal>
    </MobilePageContainer>
  );
};

export default INCOG;
