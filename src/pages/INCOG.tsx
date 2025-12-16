import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Brain, Target, Music, Repeat, ClipboardList, Sparkles, 
  BookOpen, Zap, Users, Settings, Trophy, Eye, Volume2, MessageSquare,
  Download, ExternalLink
} from "lucide-react";
import GMTDashboard from "@/components/gmt/GMTDashboard";
import MusicTherapy from "@/components/therapy/MusicTherapy";
import ADLTraining from "@/components/adl/ADLTraining";
import SpacedRepetition from "@/components/memory/SpacedRepetition";
import ProfessionalAssessments from "@/components/assessments/ProfessionalAssessments";

import SpeechLanguageModule from "@/components/speech/SpeechLanguageModule";
import DomainExercises from "@/components/tbi/DomainExercises";
import ExternalProgramLinks from "@/components/tbi/ExternalProgramLinks";
import InteractiveBrainMap from "@/components/tbi/InteractiveBrainMap";
import { MobileBottomNav, MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileFullScreenModal } from "@/components/ui/mobile-modal";
import { AnimatedDomainWheel } from "@/components/ui/animated-domain-wheel";
import { NeuralNetworkViz, createBrainNetwork } from "@/components/ui/neural-network-viz";
import { DomainQuiz, DomainQuizResults } from "@/components/incog/DomainQuiz";
import { CaregiverView } from "@/components/incog/CaregiverView";
import { PhoenixLevelBadge, usePhoenixGamification } from "@/components/ui/phoenix-gamification";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const modules = [
  { 
    id: 'nback', 
    label: 'N-Back', 
    icon: Zap, 
    title: 'Dual N-Back Training', 
    description: 'Working memory & attention',
    evidenceLevel: 'A',
    xpReward: 75,
    domain: 'attention',
    cogLoad: 'high',
  },
  { 
    id: 'gmt', 
    label: 'GMT', 
    icon: Target, 
    title: 'Goal Management Training', 
    description: 'Executive function & self-awareness',
    evidenceLevel: 'A',
    xpReward: 75,
    domain: 'executive',
    cogLoad: 'medium',
  },
  { 
    id: 'speech', 
    label: 'Speech', 
    icon: MessageSquare, 
    title: 'Speech & Language', 
    description: 'Pragmatics, voice & communication',
    evidenceLevel: 'A',
    xpReward: 70,
    domain: 'communication',
    cogLoad: 'medium',
  },
  { 
    id: 'music', 
    label: 'Music', 
    icon: Music, 
    title: 'Music & Rhythm Therapy', 
    description: 'Attention & processing speed',
    evidenceLevel: 'A',
    xpReward: 50,
    domain: 'attention',
    cogLoad: 'low',
  },
  { 
    id: 'memory', 
    label: 'Memory', 
    icon: Repeat, 
    title: 'Spaced Repetition', 
    description: 'Memory consolidation',
    evidenceLevel: 'A',
    xpReward: 60,
    domain: 'memory',
    cogLoad: 'high',
  },
  { 
    id: 'adl', 
    label: 'ADL', 
    icon: BookOpen, 
    title: 'Errorless ADL Training', 
    description: 'Daily living activities',
    evidenceLevel: 'B',
    xpReward: 50,
    domain: 'social',
    cogLoad: 'low',
  },
  { 
    id: 'assessments', 
    label: 'Assess', 
    icon: ClipboardList, 
    title: 'Professional Assessments', 
    description: 'Clinical evaluations',
    evidenceLevel: 'A',
    xpReward: 40,
    domain: 'pta',
    cogLoad: 'medium',
  },
];

// Manuscript quanta per domain
const domainQuanta: Record<string, { quote: string; chapter: string }> = {
  executive: {
    quote: "My brain felt like it was constantly misfiring...", 
    chapter: "Ch7" 
  },
  memory: { 
    quote: "The PTA haze made everything blur together...", 
    chapter: "Ch2" 
  },
  attention: { 
    quote: "Tools for the journey ahead...", 
    chapter: "Intro" 
  },
  communication: { 
    quote: "Words sometimes escaped me... sentences jumbled in my mind.", 
    chapter: "Ch2" 
  },
  social: { 
    quote: "Community carries us forward...", 
    chapter: "Circle" 
  },
  pta: { 
    quote: "Hospital corridors blurred, days merged into one...", 
    chapter: "Ch2" 
  },
};

// INCOG 2.0 Quest definitions
const incogQuests = [
  { id: 'complete_quiz', name: 'Domain Explorer', description: 'Complete the domain assessment', xp: 50, icon: 'target' },
  { id: 'gmt_session', name: 'Goal Setter', description: 'Complete a GMT session', xp: 75, icon: 'target' },
  { id: 'music_session', name: 'Rhythm Master', description: 'Complete music therapy', xp: 50, icon: 'zap' },
  { id: 'memory_streak', name: 'Memory Champion', description: '3-day spaced repetition streak', xp: 100, icon: 'brain' },
  { id: 'all_domains', name: 'Complete Recovery', description: 'Practice all 5 domains', xp: 200, icon: 'trophy' },
];

const INCOG = () => {
  const [activeTab, setActiveTab] = useState("modules");
  const [activeModule, setActiveModule] = useState('gmt');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCaregiverView, setShowCaregiverView] = useState(false);
  const [domainProgress, setDomainProgress] = useState<Record<string, number>>({
    attention: 45,
    memory: 30,
    executive: 55,
    communication: 40,
    social: 25,
    pta: 60,
  });
  const [prioritizedDomains, setPrioritizedDomains] = useState<string[]>([]);
  const [sessionLogs, setSessionLogs] = useState<Array<{
    id: string;
    date: string;
    module: string;
    duration: number;
    score?: number;
    domain: string;
  }>>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const { state: gamification, addXp, unlockAchievement } = usePhoenixGamification();
  const { toast } = useToast();
  const brainNetwork = createBrainNetwork();

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('incogDomainProgress');
    const savedLogs = localStorage.getItem('incogSessionLogs');
    const savedPriorities = localStorage.getItem('incogPrioritizedDomains');
    
    if (saved) setDomainProgress(JSON.parse(saved));
    if (savedLogs) setSessionLogs(JSON.parse(savedLogs));
    if (savedPriorities) setPrioritizedDomains(JSON.parse(savedPriorities));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('incogDomainProgress', JSON.stringify(domainProgress));
    localStorage.setItem('incogSessionLogs', JSON.stringify(sessionLogs));
    localStorage.setItem('incogPrioritizedDomains', JSON.stringify(prioritizedDomains));
  }, [domainProgress, sessionLogs, prioritizedDomains]);

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleQuizComplete = (results: DomainQuizResults) => {
    setShowQuiz(false);
    setPrioritizedDomains(results.prioritizedDomains);
    
    // Award XP for completing assessment
    addXp(50, 'Completed INCOG Domain Assessment');
    unlockAchievement({
      id: 'incog_quiz',
      name: 'Domain Explorer',
      description: 'Complete the INCOG 2.0 domain assessment',
      icon: 'target',
      xpReward: 50,
      category: 'incog',
    });

    toast({
      title: "Assessment Complete!",
      description: `Focus areas: ${results.prioritizedDomains.map(d => 
        d.charAt(0).toUpperCase() + d.slice(1)
      ).join(', ')}`,
    });

    speak(`Your priority domains are: ${results.prioritizedDomains.join(', ')}`);
  };

  const handleModuleComplete = (moduleId: string, duration: number, score?: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    // Log session
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      module: module.title,
      duration,
      score,
      domain: module.domain,
    };
    setSessionLogs(prev => [newLog, ...prev]);

    // Update domain progress
    setDomainProgress(prev => ({
      ...prev,
      [module.domain]: Math.min(100, (prev[module.domain] || 0) + 5),
    }));

    // Award XP
    addXp(module.xpReward, `Completed ${module.title}`);
  };

  // Create domain segments for wheel
  const domainSegments = [
    { id: 'attention', name: 'Attention', progress: domainProgress.attention, color: '#f97316' },
    { id: 'memory', name: 'Memory', progress: domainProgress.memory, color: '#8b5cf6' },
    { id: 'executive', name: 'Executive', progress: domainProgress.executive, color: '#06b6d4' },
    { id: 'communication', name: 'Communication', progress: domainProgress.communication, color: '#10b981' },
    { id: 'social', name: 'Social', progress: domainProgress.social, color: '#ec4899' },
    { id: 'pta', name: 'PTA', progress: domainProgress.pta, color: '#eab308' },
  ];

  const getActiveRegions = () => {
    const module = modules.find(m => m.id === activeModule);
    const regionMap: Record<string, string[]> = {
      executive: ['frontal'],
      memory: ['temporal', 'limbic'],
      attention: ['frontal', 'parietal'],
      communication: ['temporal', 'frontal'],
      social: ['limbic', 'frontal'],
    };
    return regionMap[module?.domain || ''] || [];
  };

  const currentModule = modules.find(m => m.id === activeModule);

  const getCogLoadColor = (load: string) => {
    switch (load) {
      case 'low': return 'text-emerald-400 border-emerald-500/30';
      case 'medium': return 'text-amber-400 border-amber-500/30';
      case 'high': return 'text-red-400 border-red-500/30';
      default: return 'text-gray-400';
    }
  };

  const navItems = [
    { id: "modules", label: "Modules", icon: <Brain className="h-5 w-5" /> },
    { id: "exercises", label: "Exercises", icon: <Zap className="h-5 w-5" /> },
    { id: "programs", label: "Programs", icon: <ExternalLink className="h-5 w-5" /> },
    { id: "progress", label: "Progress", icon: <Target className="h-5 w-5" /> },
  ];

  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const renderModuleContent = (moduleId: string) => {
    switch (moduleId) {
      case 'nback': return <DomainExercises domain="attention" onComplete={(score, xp) => handleModuleComplete('nback', 10, score)} />;
      case 'gmt': return <GMTDashboard />;
      case 'speech': return <SpeechLanguageModule onComplete={(type, score) => handleModuleComplete('speech', 10, score)} />;
      case 'music': return <MusicTherapy />;
      case 'memory': return <SpacedRepetition />;
      case 'adl': return <ADLTraining />;
      case 'assessments': return <ProfessionalAssessments />;
      default: return null;
    }
  };

  return (
    <MobilePageContainer className="bg-gradient-to-b from-slate-900 via-blue-950 to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-blue-500/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-orange-400 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white text-sm">Neurotech Arsenal</span>
              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                INCOG 2.0
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("p-2", voiceEnabled && "bg-blue-500/20")}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                <Volume2 className="w-4 h-4 text-blue-300" />
              </Button>
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
      </div>

      <AnimatePresence mode="wait">
        {showQuiz ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <DomainQuiz onComplete={handleQuizComplete} />
            <Button
              variant="ghost"
              className="w-full mt-3 text-blue-300"
              onClick={() => setShowQuiz(false)}
            >
              Skip Assessment
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Hero Section */}
            <div className="px-4 py-4">
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-white mb-1">
                  Neurotech Arsenal
                </h1>
                <p className="text-xs text-gray-400">
                  Evidence-based interventions • INCOG 2.0 Guidelines
                </p>
                <div className="mt-2">
                  <EvidenceBadge
                    level="A"
                    domain="INCOG 2.0"
                    description="International guidelines for TBI cognitive rehabilitation (2023)"
                    pubmedId="36594858"
                  />
                </div>
              </div>

              {/* Personalize Button */}
              {prioritizedDomains.length === 0 && (
                <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 mb-4">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Personalize Your Protocol</p>
                        <p className="text-xs text-blue-300/70">Take the domain assessment</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => setShowQuiz(true)}
                    >
                      Start
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Domain Wheel & Brain Viz */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="bg-slate-900/60 border-blue-500/20">
                  <CardContent className="p-3 flex flex-col items-center">
                    <p className="text-xs text-blue-300 mb-2">Domain Progress</p>
                    <AnimatedDomainWheel
                      domains={domainSegments}
                      size={140}
                      highlightedDomain={prioritizedDomains[0] || null}
                      onDomainClick={(d) => {
                        const module = modules.find(m => m.domain === d.id);
                        if (module) setActiveModule(module.id);
                      }}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/60 border-blue-500/20">
                  <CardContent className="p-3 flex flex-col items-center">
                    <p className="text-xs text-blue-300 mb-2">Active Regions</p>
                    <NeuralNetworkViz
                      nodes={brainNetwork.nodes}
                      connections={brainNetwork.connections}
                      activeRegions={getActiveRegions()}
                      size="sm"
                      animated
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Current Quanta */}
              {currentModule && domainQuanta[currentModule.domain] && (
                <Card className="bg-white/5 border-blue-500/10 mb-4">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-200/80 italic">
                          "{domainQuanta[currentModule.domain].quote}"
                        </p>
                        <p className="text-xs text-purple-400/60 mt-1">
                          — {domainQuanta[currentModule.domain].chapter}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 pb-24">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 mb-4">
                <TabsTrigger value="modules" className="text-xs">Modules</TabsTrigger>
                <TabsTrigger value="exercises" className="text-xs">Exercises</TabsTrigger>
                <TabsTrigger value="programs" className="text-xs">Programs</TabsTrigger>
                <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="space-y-3">
                {/* Priority Modules */}
                {prioritizedDomains.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-amber-400 mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Priority Focus
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {prioritizedDomains.map(domainId => {
                        const module = modules.find(m => m.domain === domainId);
                        if (!module) return null;
                        return (
                          <Badge 
                            key={domainId} 
                            className="bg-amber-500/20 text-amber-300 border-amber-500/30 whitespace-nowrap"
                          >
                            {module.title}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Module Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {modules.map((module) => {
                    const isPriority = prioritizedDomains.includes(module.domain);
                    return (
                      <motion.div
                        key={module.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card 
                          className={cn(
                            "cursor-pointer border-blue-500/20 bg-slate-900/80 transition-all",
                            activeModule === module.id && "ring-2 ring-blue-500",
                            isPriority && "border-purple-500/40"
                          )}
                          onClick={() => {
                            setSelectedModule(module);
                            setShowModuleModal(true);
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                isPriority ? "bg-purple-500/20" : "bg-blue-500/20"
                              )}>
                                <module.icon className={cn(
                                  "w-6 h-6",
                                  isPriority ? "text-purple-400" : "text-blue-400"
                                )} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">{module.title}</span>
                                  {isPriority && (
                                    <Badge className="text-[10px] bg-purple-500/20 text-purple-300">
                                      Priority
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">{module.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-400">
                                    Level {module.evidenceLevel}
                                  </Badge>
                                  <Badge variant="secondary" className="text-[10px]">
                                    +{module.xpReward} XP
                                  </Badge>
                                  <Badge variant="outline" className={cn("text-[10px]", getCogLoadColor(module.cogLoad))}>
                                    {module.cogLoad} load
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="exercises" className="space-y-4">
                {/* Interactive Brain Map */}
                <Card className="bg-slate-900/60 border-blue-500/20">
                  <CardContent className="p-4">
                    <InteractiveBrainMap
                      activeDomain={activeDomain}
                      onDomainSelect={setActiveDomain}
                      deficitScores={prioritizedDomains.reduce(
                        (acc, domain) => ({ ...acc, [domain]: 0.7 }), {}
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Domain Exercises */}
                {activeDomain ? (
                  <DomainExercises
                    domain={activeDomain as any}
                    onComplete={(score, xp) => {
                      handleModuleComplete('exercises', 10, score);
                      addXp(xp, `Completed ${activeDomain} exercise`);
                    }}
                  />
                ) : (
                  <div className="grid gap-4">
                    {(["attention", "memory", "executive", "communication"] as const).map(domain => (
                      <DomainExercises
                        key={domain}
                        domain={domain}
                        onComplete={(score, xp) => {
                          handleModuleComplete('exercises', 10, score);
                          addXp(xp, `Completed ${domain} exercise`);
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="programs" className="space-y-4">
                <ExternalProgramLinks activeDomain={activeDomain} />
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <CaregiverView
                  domainProgress={domainProgress}
                  sessionLogs={sessionLogs}
                  onExport={() => toast({ title: "Report Exported", description: "Clinical report downloaded" })}
                />

                {/* Quests Section */}
                <Card className="bg-slate-900/60 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Quests & Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {incogQuests.slice(0, 3).map((quest) => (
                      <div key={quest.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="font-medium text-white text-xs">{quest.name}</p>
                            <p className="text-[10px] text-gray-400">{quest.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">+{quest.xp} XP</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <MobileBottomNav
        items={navItems}
        activeId={activeTab}
        onSelect={setActiveTab}
        accentColor="blue"
      />

      {/* Module Modal */}
      <MobileFullScreenModal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        title={selectedModule?.title || 'Module'}
        accentColor="blue"
      >
        <div className="p-4 text-white">
          {selectedModule && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  INCOG Level {selectedModule.evidenceLevel}
                </Badge>
                <Badge variant="secondary">+{selectedModule.xpReward} XP</Badge>
                <Badge variant="outline" className={getCogLoadColor(selectedModule.cogLoad)}>
                  {selectedModule.cogLoad} cognitive load
                </Badge>
              </div>
              {domainQuanta[selectedModule.domain] && (
                <Card className="bg-white/5 border-blue-500/10 mb-4">
                  <CardContent className="p-3">
                    <p className="text-xs text-blue-200/80 italic">
                      "{domainQuanta[selectedModule.domain].quote}"
                    </p>
                  </CardContent>
                </Card>
              )}
              {renderModuleContent(selectedModule.id)}
            </>
          )}
        </div>
      </MobileFullScreenModal>
    </MobilePageContainer>
  );
};

export default INCOG;
