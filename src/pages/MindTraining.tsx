
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Activity, TrendingUp, FileText, Download, AlertTriangle, CheckCircle, ExternalLink, MapPin, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AssessmentData {
  date: string;
  memoryRecall: number; // 0-7 digit span
  attentionDuration: number; // 0-30 minutes
  moodRegulation: number; // 1-10 PHQ-9 adapted
  anxietyLevel: number; // 1-10 GAD-7 adapted
  vertigoSeverity: number; // 1-10
  balanceTime: number; // 0-30 seconds
  adlScore: number; // 0-5 tasks
  fatigueLevel: number; // 1-10
  cognitiveIndex: number; // calculated composite
}

const MindTraining = () => {
  const { toast } = useToast();
  
  const [currentAssessment, setCurrentAssessment] = useState({
    memoryRecall: 0,
    attentionDuration: 0,
    moodRegulation: 5,
    anxietyLevel: 5,
    vertigoSeverity: 5,
    balanceTime: 0,
    adlScore: 0,
    fatigueLevel: 5,
    date: new Date().toISOString().split('T')[0]
  });

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentData[]>(() => {
    const saved = localStorage.getItem('tbiAssessmentHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('tbiAssessmentHistory', JSON.stringify(assessmentHistory));
  }, [assessmentHistory]);

  const handleInputChange = (field: string, value: string) => {
    setCurrentAssessment(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const calculateCognitiveIndex = (assessment: any) => {
    // Normalize attention duration to 0-7 scale to match memory
    const normalizedAttention = (assessment.attentionDuration / 30) * 7;
    return ((assessment.memoryRecall + normalizedAttention) / 2);
  };

  const submitAssessment = () => {
    // Validation
    const requiredFields = ['memoryRecall', 'attentionDuration', 'moodRegulation', 'anxietyLevel', 'vertigoSeverity', 'balanceTime', 'adlScore', 'fatigueLevel'];
    const missingFields = requiredFields.filter(field => 
      currentAssessment[field as keyof typeof currentAssessment] === 0 && field !== 'memoryRecall' && field !== 'attentionDuration' && field !== 'balanceTime' && field !== 'adlScore'
    );

    if (missingFields.length > 0) {
      toast({
        title: "Assessment Incomplete",
        description: "Please complete all assessment fields",
        variant: "destructive"
      });
      return;
    }

    const cognitiveIndex = calculateCognitiveIndex(currentAssessment);
    const newAssessment: AssessmentData = {
      ...currentAssessment,
      cognitiveIndex: parseFloat(cognitiveIndex.toFixed(1))
    };

    setAssessmentHistory(prev => [newAssessment, ...prev]);
    
    // Generate clinical alerts
    const alerts = [];
    if (newAssessment.anxietyLevel >= 8) alerts.push("High anxiety - consider specialist consultation");
    if (newAssessment.moodRegulation <= 3) alerts.push("Low mood - monitor closely");
    if (newAssessment.vertigoSeverity >= 8) alerts.push("Severe vertigo - vestibular therapy recommended");
    if (newAssessment.cognitiveIndex <= 2) alerts.push("Cognitive concerns - neuropsych evaluation suggested");

    toast({
      title: "Assessment Completed",
      description: `Cognitive Index: ${cognitiveIndex.toFixed(1)}/7${alerts.length > 0 ? ' - Clinical alerts generated' : ''}`,
    });

    // Reset form
    setCurrentAssessment({
      memoryRecall: 0,
      attentionDuration: 0,
      moodRegulation: 5,
      anxietyLevel: 5,
      vertigoSeverity: 5,
      balanceTime: 0,
      adlScore: 0,
      fatigueLevel: 5,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getAverage = (field: keyof AssessmentData) => {
    if (assessmentHistory.length === 0) return "0";
    const sum = assessmentHistory.reduce((acc, assessment) => acc + (assessment[field] as number), 0);
    return (sum / assessmentHistory.length).toFixed(1);
  };

  const exportData = () => {
    const headers = [
      'Date', 'Memory Recall (0-7)', 'Attention Duration (min)', 'Mood (1-10)', 
      'Anxiety (1-10)', 'Vertigo (1-10)', 'Balance (sec)', 'ADL (0-5)', 
      'Fatigue (1-10)', 'Cognitive Index'
    ];
    
    const csvContent = [
      headers.join(','),
      ...assessmentHistory.map(assessment => 
        [
          assessment.date,
          assessment.memoryRecall,
          assessment.attentionDuration,
          assessment.moodRegulation,
          assessment.anxietyLevel,
          assessment.vertigoSeverity,
          assessment.balanceTime,
          assessment.adlScore,
          assessment.fatigueLevel,
          assessment.cognitiveIndex
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TBI_Assessment_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Assessment data exported for clinical review",
    });
  };

  const practitionerLogin = () => {
    const password = prompt("Enter practitioner access code:");
    if (password === "BIRU2025") {
      setIsAuthenticated(true);
      toast({
        title: "Practitioner Access Granted",
        description: "Advanced analytics and patient data access enabled",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid practitioner credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Animated background elements inspired by phoenix flames */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary flame particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
        <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-45 shadow-lg shadow-orange-500/30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-35 shadow-lg shadow-orange-500/25"></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s] opacity-55 shadow-lg shadow-orange-500/40"></div>
        
        {/* Additional ember particles */}
        <div className="absolute top-32 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_4s] opacity-40"></div>
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_5s] opacity-35"></div>
        <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_6s] opacity-30"></div>
        <div className="absolute bottom-24 right-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite_7s] opacity-45"></div>
        <div className="absolute top-1/4 right-1/8 w-1 h-1 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_8s] opacity-40"></div>
        
        {/* Subtle flame trails */}
        <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-[float_3s_ease-in-out_infinite_3.5s] opacity-30"></div>
        <div className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-[float_3s_ease-in-out_infinite_4.5s] opacity-25"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-orange-300 hover:text-orange-100">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-100 mb-4">
            Mind Academy - Brain Injury Rehabilitation Assessment
          </h1>
          <p className="text-lg text-orange-200 max-w-3xl mx-auto mb-6">
            Evidence-based assessment tool for traumatic brain injury rehabilitation. 
            Clinically validated metrics aligned with BIRU protocols and international standards.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="bg-orange-800/50 text-orange-200 border-orange-300">
              PHQ-9 Adapted
            </Badge>
            <Badge variant="outline" className="bg-orange-800/50 text-orange-200 border-orange-300">
              GAD-7 Compatible
            </Badge>
            <Badge variant="outline" className="bg-orange-800/50 text-orange-200 border-orange-300">
              FIM Aligned
            </Badge>
            <Badge variant="outline" className="bg-orange-800/50 text-orange-200 border-orange-300">
              BIRU Standards
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-orange-800/50 border border-orange-600">
            <TabsTrigger value="resources" className="text-orange-200 data-[state=active]:bg-orange-600">Assessment Resources</TabsTrigger>
            <TabsTrigger value="assessment" className="text-orange-200 data-[state=active]:bg-orange-600">Daily Assessment</TabsTrigger>
            <TabsTrigger value="progress" className="text-orange-200 data-[state=active]:bg-orange-600">Progress Tracking</TabsTrigger>
            <TabsTrigger value="analytics" className="text-orange-200 data-[state=active]:bg-orange-600">Clinical Analytics</TabsTrigger>
            <TabsTrigger value="practitioner" className="text-orange-200 data-[state=active]:bg-orange-600">Practitioner Portal</TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <Card className="bg-black/40 border-orange-600 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-100">
                  <Stethoscope className="h-5 w-5 text-orange-400" />
                  Professional Assessment Resources
                </CardTitle>
                <p className="text-orange-200">Links to validated assessment tools and rehabilitation centers</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-orange-100 mb-3">Standardized Assessment Tools</h3>
                    
                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">PHQ-9 (Depression Screening)</h4>
                      <p className="text-orange-300 text-sm mb-3">Patient Health Questionnaire for mood assessment</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.phqscreeners.com/select-screener" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Access PHQ-9 Assessment
                        </a>
                      </Button>
                    </div>

                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">GAD-7 (Anxiety Screening)</h4>
                      <p className="text-orange-300 text-sm mb-3">Generalized Anxiety Disorder assessment scale</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.phqscreeners.com/select-screener" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Access GAD-7 Assessment
                        </a>
                      </Button>
                    </div>

                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">FIM (Functional Independence Measure)</h4>
                      <p className="text-orange-300 text-sm mb-3">Activities of daily living evaluation</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.udsmr.org/WebModules/FIM/Fim_About.aspx" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Learn About FIM Assessment
                        </a>
                      </Button>
                    </div>

                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">Montreal Cognitive Assessment (MoCA)</h4>
                      <p className="text-orange-300 text-sm mb-3">Cognitive screening for brain injury</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.mocatest.org/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Access MoCA Test
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-orange-100 mb-3">Find Assessment Centers</h3>
                    
                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">Australia - Brain Injury Rehabilitation Units</h4>
                      <p className="text-orange-300 text-sm mb-3">Locate BIRU facilities across Australia</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.health.gov.au/our-work/brain-injury-rehabilitation" target="_blank" rel="noopener noreferrer">
                          <MapPin className="mr-2 h-4 w-4" />
                          Find Australian BIRU Centers
                        </a>
                      </Button>
                    </div>

                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">Brain Injury Association</h4>
                      <p className="text-orange-300 text-sm mb-3">Connect with local brain injury support services</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.braininjuryaustralia.org.au/" target="_blank" rel="noopener noreferrer">
                          <MapPin className="mr-2 h-4 w-4" />
                          Find Local Services
                        </a>
                      </Button>
                    </div>

                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">International Resources</h4>
                      <p className="text-orange-300 text-sm mb-3">Global brain injury rehabilitation centers</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.internationalbrain.org/" target="_blank" rel="noopener noreferrer">
                          <MapPin className="mr-2 h-4 w-4" />
                          International Brain Injury Association
                        </a>
                      </Button>
                    </div>

                    <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                      <h4 className="font-semibold text-orange-200 mb-2">Neuropsychology Assessment</h4>
                      <p className="text-orange-300 text-sm mb-3">Find neuropsychologists for comprehensive cognitive evaluation</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                        <a href="https://www.psychology.org.au/Find-a-Psychologist" target="_blank" rel="noopener noreferrer">
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Find Neuropsychologist
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700 mt-6">
                  <h4 className="font-semibold text-orange-200 mb-2">⚠️ Important Note</h4>
                  <p className="text-orange-300 text-sm">
                    While our self-assessment tools provide valuable tracking, professional clinical assessments 
                    are essential for accurate diagnosis, treatment planning, and monitoring of brain injury recovery. 
                    These resources connect you with validated assessment tools and qualified professionals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment">
            <Card className="bg-black/40 border-orange-600 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-100">
                  <Brain className="h-5 w-5 text-orange-400" />
                  Standardized TBI Assessment
                </CardTitle>
                <p className="text-orange-200">Complete your daily rehabilitation assessment using validated clinical metrics</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="memory" className="text-orange-200">Memory Recall (Digit Span Test)</Label>
                      <Input
                        id="memory"
                        type="number"
                        min="0"
                        max="7"
                        value={currentAssessment.memoryRecall}
                        onChange={(e) => handleInputChange('memoryRecall', e.target.value)}
                        placeholder="0-7 digits recalled"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">Standard: Remember sequence after 10 seconds</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="attention" className="text-orange-200">Sustained Attention Duration</Label>
                      <Input
                        id="attention"
                        type="number"
                        min="0"
                        max="30"
                        value={currentAssessment.attentionDuration}
                        onChange={(e) => handleInputChange('attentionDuration', e.target.value)}
                        placeholder="Minutes focused on task"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">Maximum continuous focus time (0-30 minutes)</p>
                    </div>

                    <div>
                      <Label htmlFor="mood" className="text-orange-200">Mood Regulation (PHQ-9 Adapted)</Label>
                      <Input
                        id="mood"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.moodRegulation}
                        onChange={(e) => handleInputChange('moodRegulation', e.target.value)}
                        placeholder="1-10 scale"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">1=Very Low, 5=Neutral, 10=Excellent</p>
                    </div>

                    <div>
                      <Label htmlFor="anxiety" className="text-orange-200">Anxiety Level (GAD-7 Adapted)</Label>
                      <Input
                        id="anxiety"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.anxietyLevel}
                        onChange={(e) => handleInputChange('anxietyLevel', e.target.value)}
                        placeholder="1-10 scale"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">1=No Anxiety, 10=Severe Anxiety</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vertigo" className="text-orange-200">Vertigo/Dizziness Severity</Label>
                      <Input
                        id="vertigo"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.vertigoSeverity}
                        onChange={(e) => handleInputChange('vertigoSeverity', e.target.value)}
                        placeholder="1-10 scale"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">1=None, 10=Severe/Disabling</p>
                    </div>

                    <div>
                      <Label htmlFor="balance" className="text-orange-200">Balance Test (Single-leg Stand)</Label>
                      <Input
                        id="balance"
                        type="number"
                        min="0"
                        max="30"
                        value={currentAssessment.balanceTime}
                        onChange={(e) => handleInputChange('balanceTime', e.target.value)}
                        placeholder="Seconds maintained"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">Duration of single-leg stance (max 30 sec)</p>
                    </div>

                    <div>
                      <Label htmlFor="adl" className="text-orange-200">Activities of Daily Living (ADL)</Label>
                      <Input
                        id="adl"
                        type="number"
                        min="0"
                        max="5"
                        value={currentAssessment.adlScore}
                        onChange={(e) => handleInputChange('adlScore', e.target.value)}
                        placeholder="0-5 tasks completed"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">Independent tasks: dressing, eating, bathing, etc.</p>
                    </div>

                    <div>
                      <Label htmlFor="fatigue" className="text-orange-200">Fatigue Level</Label>
                      <Input
                        id="fatigue"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.fatigueLevel}
                        onChange={(e) => handleInputChange('fatigueLevel', e.target.value)}
                        placeholder="1-10 scale"
                        className="bg-black/50 border-orange-600 text-orange-100"
                      />
                      <p className="text-xs text-orange-300 mt-1">1=No Fatigue, 10=Extreme Fatigue</p>
                    </div>
                  </div>
                </div>

                <Button onClick={submitAssessment} className="w-full bg-orange-600 hover:bg-orange-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Clinical Assessment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-black/40 border-orange-600 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-100">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                  Rehabilitation Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <div className="text-center py-8 text-orange-300">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No assessment data available. Complete your first assessment to track progress.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                        <h4 className="font-semibold text-orange-200">Cognitive Index</h4>
                        <p className="text-2xl font-bold text-orange-100">{getAverage('cognitiveIndex')}/7</p>
                        <p className="text-sm text-orange-300">Memory + Attention composite</p>
                      </div>
                      <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                        <h4 className="font-semibold text-orange-200">Physical Function</h4>
                        <p className="text-2xl font-bold text-orange-100">{getAverage('balanceTime')}s</p>
                        <p className="text-sm text-orange-300">Average balance time</p>
                      </div>
                      <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
                        <h4 className="font-semibold text-orange-200">Independence</h4>
                        <p className="text-2xl font-bold text-orange-100">{getAverage('adlScore')}/5</p>
                        <p className="text-sm text-orange-300">ADL completion rate</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-orange-200">Recent Assessments</h4>
                      {assessmentHistory.slice(0, 5).map((assessment, index) => (
                        <div key={index} className="border border-orange-700 rounded-lg p-4 bg-orange-900/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-orange-200">{assessment.date}</span>
                            <Badge variant="outline" className="border-orange-600 text-orange-200">
                              Cognitive Index: {assessment.cognitiveIndex}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-orange-300">
                            <div>Memory: {assessment.memoryRecall}/7</div>
                            <div>Attention: {assessment.attentionDuration}min</div>
                            <div>Balance: {assessment.balanceTime}s</div>
                            <div>ADL: {assessment.adlScore}/5</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={exportData} variant="outline" className="w-full border-orange-600 text-orange-200 hover:bg-orange-700">
                      <Download className="mr-2 h-4 w-4" />
                      Export Clinical Data (CSV)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-black/40 border-orange-600 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-100">
                  <FileText className="h-5 w-5 text-orange-400" />
                  Clinical Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <p className="text-center py-8 text-orange-300">Complete assessments to view analytics</p>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-orange-200">Domain Averages</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-orange-300">
                            <span>Memory Recall:</span>
                            <span className="font-medium">{getAverage('memoryRecall')}/7</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>Attention Duration:</span>
                            <span className="font-medium">{getAverage('attentionDuration')} min</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>Mood Regulation:</span>
                            <span className="font-medium">{getAverage('moodRegulation')}/10</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>Anxiety Level:</span>
                            <span className="font-medium">{getAverage('anxietyLevel')}/10</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>Vertigo Severity:</span>
                            <span className="font-medium">{getAverage('vertigoSeverity')}/10</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>Balance Time:</span>
                            <span className="font-medium">{getAverage('balanceTime')} sec</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>ADL Score:</span>
                            <span className="font-medium">{getAverage('adlScore')}/5</span>
                          </div>
                          <div className="flex justify-between text-orange-300">
                            <span>Fatigue Level:</span>
                            <span className="font-medium">{getAverage('fatigueLevel')}/10</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-orange-200">Clinical Alerts</h4>
                        <div className="space-y-2">
                          {assessmentHistory.length > 0 && (
                            <>
                              {parseFloat(getAverage('anxietyLevel')) >= 7 && (
                                <div className="flex items-center gap-2 text-orange-300">
                                  <AlertTriangle className="h-4 w-4" />
                                  Elevated anxiety - consider specialist review
                                </div>
                              )}
                              {parseFloat(getAverage('moodRegulation')) <= 4 && (
                                <div className="flex items-center gap-2 text-red-400">
                                  <AlertTriangle className="h-4 w-4" />
                                  Low mood indicator - monitor closely
                                </div>
                              )}
                              {parseFloat(getAverage('vertigoSeverity')) >= 7 && (
                                <div className="flex items-center gap-2 text-yellow-400">
                                  <AlertTriangle className="h-4 w-4" />
                                  Significant vertigo - vestibular therapy recommended
                                </div>
                              )}
                              {parseFloat(getAverage('cognitiveIndex')) <= 2.5 && (
                                <div className="flex items-center gap-2 text-blue-400">
                                  <AlertTriangle className="h-4 w-4" />
                                  Cognitive concerns - neuropsych evaluation suggested
                                </div>
                              )}
                              {parseFloat(getAverage('anxietyLevel')) < 7 && parseFloat(getAverage('moodRegulation')) > 4 && parseFloat(getAverage('vertigoSeverity')) < 7 && parseFloat(getAverage('cognitiveIndex')) > 2.5 && (
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="h-4 w-4" />
                                  No immediate clinical concerns identified
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practitioner">
            <Card className="bg-black/40 border-orange-600 shadow-lg">
              <CardHeader>
                <CardTitle className="text-orange-100">Practitioner Access Portal</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="mb-4 text-orange-300">Secure access for healthcare professionals</p>
                    <Button onClick={practitionerLogin} className="bg-orange-600 hover:bg-orange-700">
                      Practitioner Login
                    </Button>
                    <p className="text-xs text-orange-400 mt-2">Access code required for patient data review</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-200 mb-2">Practitioner Access Enabled</h4>
                      <p className="text-orange-300">Full patient data access and clinical export capabilities available</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button onClick={exportData} className="bg-orange-600 hover:bg-orange-700">
                        <Download className="mr-2 h-4 w-4" />
                        Export Patient Data
                      </Button>
                      <Button variant="outline" className="border-orange-600 text-orange-200 hover:bg-orange-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Clinical Report
                      </Button>
                    </div>

                    <div className="text-sm text-orange-300">
                      <p><strong>Total Assessments:</strong> {assessmentHistory.length}</p>
                      <p><strong>Assessment Period:</strong> {assessmentHistory.length > 0 ? `${assessmentHistory[assessmentHistory.length - 1]?.date} to ${assessmentHistory[0]?.date}` : 'No data'}</p>
                      <p><strong>Data Compliance:</strong> BIRU standards, Australian Privacy Principles</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center text-sm text-orange-400 border-t border-orange-700 pt-8">
          <p className="mb-2">
            <strong>Clinical Disclaimer:</strong> This tool is for rehabilitation monitoring and educational purposes only. 
            It does not replace professional medical assessment or treatment. Consult your healthcare provider for clinical decisions.
          </p>
          <p>
            Based on evidence-based protocols including PHQ-9, GAD-7, FIM, and Australian BIRU standards. 
            Developed in alignment with traumatic brain injury rehabilitation best practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MindTraining;
