import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Thermometer, Snowflake, Timer, Trophy, TrendingUp, Flame, BookOpen, Zap, ShieldCheck, AlertTriangle, FileDown } from "lucide-react";
import { SessionExport } from "@/components/ui/session-export";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import SafetyPreScreen from "@/components/clinical/SafetyPreScreen";
import ClinicalDisclaimer from "@/components/clinical/ClinicalDisclaimer";
import { MobileBottomNav, MobilePageContainer } from "@/components/ui/mobile-nav";
import { MobileFullScreenModal } from "@/components/ui/mobile-modal";
import { MobileStatsGrid } from "@/components/ui/mobile-stats-grid";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileActionCard } from "@/components/ui/mobile-action-card";
import { cn } from "@/lib/utils";

const coldContraindications = [
  { id: 'vertigo', question: 'Are you experiencing vertigo or dizziness today?', severity: 'stop' as const, advice: 'Cold exposure may worsen vestibular symptoms. Please skip this session.' },
  { id: 'fatigue', question: 'Are you experiencing severe fatigue or exhaustion?', severity: 'caution' as const, advice: 'Consider a shorter session or skip if fatigue is significant.' },
  { id: 'cardiac', question: 'Do you have any heart conditions or high blood pressure?', severity: 'stop' as const, advice: 'Cold exposure affects cardiovascular function. Please consult your physician.' },
  { id: 'raynauds', question: 'Do you have Raynaud\'s syndrome or circulation issues?', severity: 'stop' as const, advice: 'Cold exposure is contraindicated for circulation disorders.' },
  { id: 'headache', question: 'Are you experiencing a headache or migraine today?', severity: 'caution' as const, advice: 'Cold exposure may trigger or worsen headaches.' },
  { id: 'recent_injury', question: 'Have you had a recent TBI episode or symptoms flare-up?', severity: 'caution' as const, advice: 'During active symptom phases, gentle rest may be more appropriate.' },
];

// Progressive protocols with 2025 TBI safety caps
const coldProtocols = [
  { name: "Gentle", duration: 30, tempF: "55-65°F", tempC: "13-18°C", description: "Recommended for TBI recovery", level: 1, tbiSafe: true },
  { name: "Beginner", duration: 45, tempF: "50-60°F", tempC: "10-15°C", description: "Build tolerance slowly", level: 2, tbiSafe: true },
  { name: "Warrior", duration: 60, tempF: "45-55°F", tempC: "7-13°C", description: "Max recommended for TBI", level: 3, tbiSafe: true },
  { name: "Arctic", duration: 90, tempF: "40-50°F", tempC: "4-10°C", description: "Advanced - consult doctor", level: 4, tbiSafe: false },
];

// Manuscript quanta reflections for different phases
const quantaReflections = {
  prepare: [
    "Ch3: \"The overwhelming chaos that eventually gives way to peace...\"",
    "Remember: Every cold plunge is a metaphor for facing the unknown.",
  ],
  endure: [
    "Ch4: \"The vertigo slowly subsides... learning to trust the process.\"",
    "Ch6: \"The roller coaster of emotions, finding stillness in the storm.\"",
  ],
  exit: [
    "You emerged stronger. Like the phoenix, you transform through challenge.",
    "Ch4: \"Finding my footing again, one brave step at a time.\"",
  ],
};

// Post-session dopamine/mood self-report options
const moodOptions = [
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😐", label: "Neutral", value: 2 },
  { emoji: "🙂", label: "Good", value: 3 },
  { emoji: "😊", label: "Great", value: 4 },
  { emoji: "🔥", label: "Euphoric", value: 5 },
];

const ColdExposure = () => {
  const [showSafetyScreen, setShowSafetyScreen] = useState(true);
  const [activeTab, setActiveTab] = useState("session");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [phase, setPhase] = useState<'prepare' | 'enter' | 'endure' | 'exit'>('prepare');
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showScienceModal, setShowScienceModal] = useState(false);
  const [showMoodReport, setShowMoodReport] = useState(false);
  const [currentReflection, setCurrentReflection] = useState("");
  const [moodHistory, setMoodHistory] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('coldExposureStreak');
    const savedBest = localStorage.getItem('coldExposureBest');
    const savedSessions = localStorage.getItem('coldExposureSessions');
    const savedTotal = localStorage.getItem('coldExposureTotal');
    const savedMoodHistory = localStorage.getItem('coldExposureMoodHistory');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setPersonalBest(parseInt(savedBest));
    if (savedSessions) setCompletedSessions(parseInt(savedSessions));
    if (savedTotal) setTotalTime(parseInt(savedTotal));
    if (savedMoodHistory) setMoodHistory(JSON.parse(savedMoodHistory));
  }, []);

  const phaseInstructions = {
    prepare: "Take deep breaths and prepare mentally 🧊",
    enter: "Slowly enter the cold water ❄️",
    endure: "Focus on your breath! 💪",
    exit: "Well done, ice warrior! 🏆"
  };

  // Update reflection when phase changes
  useEffect(() => {
    const reflections = quantaReflections[phase as keyof typeof quantaReflections];
    if (reflections) {
      const randomIndex = Math.floor(Math.random() * reflections.length);
      setCurrentReflection(reflections[randomIndex]);
    }
  }, [phase]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        if (selectedDuration > 60) {
          if (timeLeft === selectedDuration - 10 && phase === 'prepare') setPhase('enter');
          if (timeLeft === selectedDuration - 20 && phase === 'enter') setPhase('endure');
          if (timeLeft === 10 && phase === 'endure') setPhase('exit');
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, selectedDuration]);

  const completeSession = () => {
    setIsActive(false);
    setPhase('exit');
    setShowMoodReport(true); // Trigger mood report
    
    const newSessions = completedSessions + 1;
    const newTotal = totalTime + selectedDuration;
    const newStreak = streak + 1;
    
    setCompletedSessions(newSessions);
    setTotalTime(newTotal);
    setStreak(newStreak);
    
    if (selectedDuration > personalBest) {
      setPersonalBest(selectedDuration);
      localStorage.setItem('coldExposureBest', selectedDuration.toString());
    }
    
    localStorage.setItem('coldExposureStreak', newStreak.toString());
    localStorage.setItem('coldExposureSessions', newSessions.toString());
    localStorage.setItem('coldExposureTotal', newTotal.toString());
  };

  const handleMoodReport = (mood: number) => {
    const newHistory = [...moodHistory, mood];
    setMoodHistory(newHistory);
    localStorage.setItem('coldExposureMoodHistory', JSON.stringify(newHistory));
    setShowMoodReport(false);
    
    if (selectedDuration > (personalBest || 0)) {
      toast({ title: "New Personal Best! 🏆", description: `${selectedDuration}s of pure ice warrior spirit!` });
    } else {
      toast({ title: "Session Complete! ❄️", description: `${selectedDuration}s of cold mastery! Mood: ${moodOptions[mood - 1]?.emoji}` });
    }
  };

  const startSession = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
    setPhase('prepare');
    setIsActive(true);
    setShowProtocolModal(false);
    setActiveTab("session");
  };

  const toggleSession = () => setIsActive(!isActive);
  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setPhase('prepare');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'prepare': return 'text-blue-400';
      case 'enter': return 'text-cyan-400';
      case 'endure': return 'text-teal-300';
      case 'exit': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const navItems = [
    { id: "session", label: "Session", icon: <Snowflake className="h-5 w-5" /> },
    { id: "protocols", label: "Protocols", icon: <Thermometer className="h-5 w-5" /> },
    { id: "science", label: "Science", icon: <BookOpen className="h-5 w-5" /> },
  ];

  // Safety pre-screen
  if (showSafetyScreen) {
    return (
      <MobilePageContainer hasBottomNav={false} className="bg-gradient-to-b from-slate-900 via-blue-900 to-cyan-900 text-white">
        <div className="p-4 md:p-8 max-w-xl mx-auto">
          <Button asChild variant="ghost" className="pl-0 text-cyan-300 hover:text-white mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </Button>
          
          <div className="text-center mb-6">
            <Snowflake className="h-10 w-10 text-cyan-400 mx-auto mb-3 animate-pulse" />
            <h1 className="text-xl font-bold text-cyan-100 mb-2">Ice Warrior Academy</h1>
          </div>

          <div className="mb-4">
            <EvidenceBadge
              level="emerging"
              domain="Cold Exposure"
              description="Emerging evidence for stress resilience. Limited TBI research."
              pubmedId="37138494"
            />
          </div>

          <SafetyPreScreen
            title="Safety Check"
            description="Let's ensure cold exposure is safe for you today."
            contraindications={coldContraindications}
            onProceed={() => setShowSafetyScreen(false)}
            onSkip={() => window.history.back()}
            accentColor="cyan"
          />

          <ClinicalDisclaimer type="warning" title="Notice" className="mt-4">
            Cold exposure has <strong>emerging evidence</strong> for wellness but limited TBI-specific research.
          </ClinicalDisclaimer>
        </div>
      </MobilePageContainer>
    );
  }

  return (
    <MobilePageContainer className="bg-gradient-to-b from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/60 rounded-full animate-[float_4s_ease-in-out_infinite]"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <MobileHeader
          title="Ice Warrior Academy"
          subtitle="Build resilience through cold exposure"
          backHref="/dashboard"
          backLabel="Dashboard"
          accentColor="cyan"
          icon={
            <div className="w-full h-full rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl animate-pulse">
              <Snowflake className="h-10 w-10 md:h-14 md:w-14 text-white" />
            </div>
          }
        >
          <div className="mt-4">
            <EvidenceBadge
              level="emerging"
              domain="Cold Exposure"
              description="Emerging evidence for stress resilience"
              pubmedId="37138494"
            />
          </div>
        </MobileHeader>

        {/* Stats */}
        <div className="px-4 mb-6">
          <MobileStatsGrid
            accentColor="cyan"
            stats={[
              { icon: <Trophy className="h-6 w-6" />, value: streak, label: "Day Streak", iconColor: "text-yellow-400" },
              { icon: <Timer className="h-6 w-6" />, value: `${personalBest}s`, label: "Best Time", iconColor: "text-cyan-400" },
              { icon: <Snowflake className="h-6 w-6" />, value: completedSessions, label: "Sessions", iconColor: "text-teal-400" },
              { icon: <TrendingUp className="h-6 w-6" />, value: `${Math.floor(totalTime / 60)}m`, label: "Total", iconColor: "text-blue-400" },
            ]}
          />
        </div>

        {/* Main Content Area */}
        <div className="px-4 pb-6">
          {activeTab === "session" && (
            <div className="space-y-4">
              {/* Protocol Selection (if no active session) */}
              {!isActive && timeLeft === 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {coldProtocols.map((protocol) => (
                      <button
                        key={protocol.name}
                        onClick={() => startSession(protocol.duration)}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all",
                          protocol.tbiSafe 
                            ? "bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30 hover:border-cyan-400"
                            : "bg-gradient-to-br from-slate-900/80 to-amber-900/30 border-amber-500/30 hover:border-amber-400"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Snowflake className={cn("h-5 w-5", protocol.tbiSafe ? "text-cyan-400" : "text-amber-400")} />
                          <span className="font-semibold text-white">{protocol.name}</span>
                        </div>
                        <div className="text-sm text-cyan-300 mb-2">
                          {protocol.duration}s • {protocol.tempC}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {protocol.tbiSafe ? (
                            <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-400 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" /> TBI Safe
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Consult MD
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/60 mt-2">{protocol.description}</p>
                      </button>
                    ))}
                  </div>
                  
                  {/* 2025 TBI Safety Note */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span><strong>2025 TBI Guidelines:</strong> Start with 30s max. Progress only after 2+ weeks of consistent practice without symptom flares.</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Active Session Timer */}
              {(isActive || timeLeft > 0) && (
                <Card className="bg-gradient-to-br from-slate-900/80 to-cyan-900/80 border-cyan-500/30 backdrop-blur-sm">
                  <CardContent className="p-4 md:p-6 space-y-6">
                    {/* Timer Display */}
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-48 h-48 md:w-64 md:h-64">
                        <div 
                          className="w-full h-full rounded-full border-4 border-cyan-400/50 flex items-center justify-center transition-all duration-1000"
                          style={{
                            background: `conic-gradient(from 0deg, rgba(6, 182, 212, 0.8) ${(1 - timeLeft / selectedDuration) * 100}%, rgba(30, 41, 59, 0.3) ${(1 - timeLeft / selectedDuration) * 100}%)`,
                            boxShadow: isActive ? '0 0 40px rgba(6, 182, 212, 0.6)' : '0 0 20px rgba(6, 182, 212, 0.3)'
                          }}
                        >
                          <div className="bg-slate-900/80 rounded-full p-6 md:p-8 backdrop-blur-sm">
                            <div className="text-center">
                              <div className="text-4xl md:text-5xl font-bold text-cyan-100 mb-1">
                                {formatTime(timeLeft)}
                              </div>
                              <div className={cn("text-sm md:text-lg uppercase tracking-wide font-medium", getPhaseColor())}>
                                {phase}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phase Instructions */}
                    <div className="text-center space-y-2">
                      <p className="text-lg md:text-xl text-cyan-100">{phaseInstructions[phase]}</p>
                      {/* Manuscript Quanta Reflection */}
                      {currentReflection && (phase === 'endure' || phase === 'exit') && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 max-w-sm mx-auto">
                          <div className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-200 italic">{currentReflection}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-3">
                      <Button 
                        onClick={toggleSession}
                        size="lg"
                        className="flex-1 max-w-[140px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                      >
                        {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                        {isActive ? 'Pause' : timeLeft === selectedDuration ? 'Start' : 'Resume'}
                      </Button>
                      <Button 
                        onClick={resetSession}
                        variant="outline"
                        size="lg"
                        className="border-cyan-500/50 hover:border-cyan-400"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Desktop Tabs Content */}
          <div className="hidden md:block">
            {activeTab === "protocols" && (
              <div className="grid md:grid-cols-2 gap-4">
                {coldProtocols.map((protocol, index) => (
                  <Card key={protocol.name} className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3 text-cyan-100 text-lg">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                          index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : index === 2 ? 'bg-orange-500' : 'bg-red-500'
                        )}>
                          {index + 1}
                        </div>
                        {protocol.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-cyan-200 text-sm">{protocol.description}</p>
                      <div className="flex justify-between text-xs text-cyan-300">
                        <span>{protocol.duration}s</span>
                        <span>{protocol.tempC}</span>
                      </div>
                      <Button onClick={() => startSession(protocol.duration)} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600">
                        Start
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "science" && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-cyan-100">The Science of Cold Exposure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-cyan-200 text-sm">
                    <div>
                      <h3 className="font-semibold text-cyan-100 mb-1">🧠 Neurological Benefits</h3>
                      <p>Cold activates the sympathetic nervous system, increasing norepinephrine by up to 530%.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cyan-100 mb-1">🔥 Metabolic Enhancement</h3>
                      <p>Regular cold exposure activates brown adipose tissue, increasing metabolic rate up to 15%.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cyan-100 mb-1">🛡️ Immune System</h3>
                      <p>Cold therapy increases white blood cell count. Regular practitioners show 29% fewer sick days.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cyan-100 mb-1">💪 Recovery</h3>
                      <p>Reduces inflammation and accelerates recovery. Athletes reduce muscle soreness by up to 20%.</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Session Export for Clinicians */}
                <SessionExport />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        items={navItems}
        activeId={activeTab}
        onSelect={(id) => {
          if (id === "protocols") {
            setShowProtocolModal(true);
          } else if (id === "science") {
            setShowScienceModal(true);
          } else {
            setActiveTab(id);
          }
        }}
        accentColor="cyan"
      />

      {/* Protocols Modal (Mobile) */}
      <MobileFullScreenModal
        isOpen={showProtocolModal}
        onClose={() => setShowProtocolModal(false)}
        title="Cold Protocols"
        accentColor="cyan"
      >
        <div className="p-4 space-y-4">
          {coldProtocols.map((protocol, index) => (
            <Card key={protocol.name} className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white",
                    index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : index === 2 ? 'bg-orange-500' : 'bg-red-500'
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-100">{protocol.name}</h3>
                    <p className="text-xs text-cyan-300">{protocol.description}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-cyan-300 mb-3">
                  <span>⏱️ {protocol.duration}s</span>
                  <span>🌡️ {protocol.tempC}</span>
                </div>
                <Button 
                  onClick={() => startSession(protocol.duration)} 
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Protocol
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </MobileFullScreenModal>

      {/* Science Modal (Mobile) */}
      <MobileFullScreenModal
        isOpen={showScienceModal}
        onClose={() => setShowScienceModal(false)}
        title="The Science"
        accentColor="cyan"
      >
        <div className="p-4 space-y-4">
          <Card className="bg-gradient-to-br from-slate-900/80 to-cyan-900/50 border-cyan-500/30">
            <CardContent className="p-4 space-y-4 text-cyan-200">
              <div>
                <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Neurological Benefits
                </h3>
                <p className="text-sm">Cold activates the sympathetic nervous system, increasing norepinephrine by up to 530%. This enhances focus, alertness, and mood.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  Metabolic Enhancement
                </h3>
                <p className="text-sm">Regular cold exposure activates brown adipose tissue, increasing metabolic rate up to 15% and improving insulin sensitivity.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-400" />
                  Immune System
                </h3>
                <p className="text-sm">Cold therapy increases white blood cell count. Regular practitioners show 29% fewer sick days.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Recovery & Inflammation
                </h3>
                <p className="text-sm">Reduces inflammation and accelerates recovery. Athletes reduce muscle soreness by up to 20%.</p>
              </div>
            </CardContent>
          </Card>
          
          <ClinicalDisclaimer type="info" title="Research Note">
            While cold exposure shows promising benefits, always consult your healthcare provider, especially for TBI recovery.
          </ClinicalDisclaimer>
        </div>
      </MobileFullScreenModal>

      {/* Post-Session Mood Report Modal */}
      <MobileFullScreenModal
        isOpen={showMoodReport}
        onClose={() => setShowMoodReport(false)}
        title="How Do You Feel?"
        accentColor="cyan"
      >
        <div className="p-6 space-y-6">
          <div className="text-center">
            <Snowflake className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-cyan-100 mb-2">Session Complete!</h3>
            <p className="text-cyan-300 text-sm">Track your dopamine response to optimize your practice</p>
          </div>

          {/* Quanta Reflection */}
          {currentReflection && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-400 font-medium mb-1">Reflection</p>
                  <p className="text-sm text-amber-200 italic">{currentReflection}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mood Selection */}
          <div className="space-y-3">
            <p className="text-center text-cyan-200 text-sm">How is your mood right now?</p>
            <div className="flex justify-center gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMoodReport(option.value)}
                  className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs text-cyan-300">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Average Mood Display */}
          {moodHistory.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-400">Average Post-Session Mood</span>
                <span className="text-lg font-bold text-cyan-100">
                  {moodOptions[Math.round(moodHistory.reduce((a, b) => a + b, 0) / moodHistory.length) - 1]?.emoji || "🙂"}
                </span>
              </div>
              <div className="mt-2 flex gap-1">
                {moodHistory.slice(-10).map((mood, i) => (
                  <div 
                    key={i} 
                    className="flex-1 h-2 rounded-full transition-all"
                    style={{ 
                      background: `linear-gradient(to right, 
                        ${mood <= 2 ? '#6366f1' : mood === 3 ? '#06b6d4' : mood === 4 ? '#22c55e' : '#f97316'}
                        , transparent)`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <ClinicalDisclaimer type="info" title="2025 TBI Safety Note" className="text-xs">
            Cold exposure duration is capped for TBI safety. Progress gradually and always listen to your body.
          </ClinicalDisclaimer>
        </div>
      </MobileFullScreenModal>
    </MobilePageContainer>
  );
};

export default ColdExposure;
