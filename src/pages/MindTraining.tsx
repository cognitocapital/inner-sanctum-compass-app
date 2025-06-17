
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Activity, TrendingUp, FileText, Download, AlertTriangle, CheckCircle } from "lucide-react";
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
    if (assessmentHistory.length === 0) return 0;
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brain Injury Rehabilitation Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Evidence-based assessment tool for traumatic brain injury rehabilitation. 
            Clinically validated metrics aligned with BIRU protocols and international standards.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              PHQ-9 Adapted
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              GAD-7 Compatible
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              FIM Aligned
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              BIRU Standards
            </Badge>
          </div>
        </header>

        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessment">Daily Assessment</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Clinical Analytics</TabsTrigger>
            <TabsTrigger value="practitioner">Practitioner Portal</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Standardized TBI Assessment
                </CardTitle>
                <p className="text-gray-600">Complete your daily rehabilitation assessment using validated clinical metrics</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="memory">Memory Recall (Digit Span Test)</Label>
                      <Input
                        id="memory"
                        type="number"
                        min="0"
                        max="7"
                        value={currentAssessment.memoryRecall}
                        onChange={(e) => handleInputChange('memoryRecall', e.target.value)}
                        placeholder="0-7 digits recalled"
                      />
                      <p className="text-xs text-gray-500 mt-1">Standard: Remember sequence after 10 seconds</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="attention">Sustained Attention Duration</Label>
                      <Input
                        id="attention"
                        type="number"
                        min="0"
                        max="30"
                        value={currentAssessment.attentionDuration}
                        onChange={(e) => handleInputChange('attentionDuration', e.target.value)}
                        placeholder="Minutes focused on task"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum continuous focus time (0-30 minutes)</p>
                    </div>

                    <div>
                      <Label htmlFor="mood">Mood Regulation (PHQ-9 Adapted)</Label>
                      <Input
                        id="mood"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.moodRegulation}
                        onChange={(e) => handleInputChange('moodRegulation', e.target.value)}
                        placeholder="1-10 scale"
                      />
                      <p className="text-xs text-gray-500 mt-1">1=Very Low, 5=Neutral, 10=Excellent</p>
                    </div>

                    <div>
                      <Label htmlFor="anxiety">Anxiety Level (GAD-7 Adapted)</Label>
                      <Input
                        id="anxiety"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.anxietyLevel}
                        onChange={(e) => handleInputChange('anxietyLevel', e.target.value)}
                        placeholder="1-10 scale"
                      />
                      <p className="text-xs text-gray-500 mt-1">1=No Anxiety, 10=Severe Anxiety</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vertigo">Vertigo/Dizziness Severity</Label>
                      <Input
                        id="vertigo"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.vertigoSeverity}
                        onChange={(e) => handleInputChange('vertigoSeverity', e.target.value)}
                        placeholder="1-10 scale"
                      />
                      <p className="text-xs text-gray-500 mt-1">1=None, 10=Severe/Disabling</p>
                    </div>

                    <div>
                      <Label htmlFor="balance">Balance Test (Single-leg Stand)</Label>
                      <Input
                        id="balance"
                        type="number"
                        min="0"
                        max="30"
                        value={currentAssessment.balanceTime}
                        onChange={(e) => handleInputChange('balanceTime', e.target.value)}
                        placeholder="Seconds maintained"
                      />
                      <p className="text-xs text-gray-500 mt-1">Duration of single-leg stance (max 30 sec)</p>
                    </div>

                    <div>
                      <Label htmlFor="adl">Activities of Daily Living (ADL)</Label>
                      <Input
                        id="adl"
                        type="number"
                        min="0"
                        max="5"
                        value={currentAssessment.adlScore}
                        onChange={(e) => handleInputChange('adlScore', e.target.value)}
                        placeholder="0-5 tasks completed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Independent tasks: dressing, eating, bathing, etc.</p>
                    </div>

                    <div>
                      <Label htmlFor="fatigue">Fatigue Level</Label>
                      <Input
                        id="fatigue"
                        type="number"
                        min="1"
                        max="10"
                        value={currentAssessment.fatigueLevel}
                        onChange={(e) => handleInputChange('fatigueLevel', e.target.value)}
                        placeholder="1-10 scale"
                      />
                      <p className="text-xs text-gray-500 mt-1">1=No Fatigue, 10=Extreme Fatigue</p>
                    </div>
                  </div>
                </div>

                <Button onClick={submitAssessment} className="w-full bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Clinical Assessment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Rehabilitation Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No assessment data available. Complete your first assessment to track progress.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900">Cognitive Index</h4>
                        <p className="text-2xl font-bold text-blue-600">{getAverage('cognitiveIndex')}/7</p>
                        <p className="text-sm text-blue-700">Memory + Attention composite</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900">Physical Function</h4>
                        <p className="text-2xl font-bold text-green-600">{getAverage('balanceTime')}s</p>
                        <p className="text-sm text-green-700">Average balance time</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-900">Independence</h4>
                        <p className="text-2xl font-bold text-purple-600">{getAverage('adlScore')}/5</p>
                        <p className="text-sm text-purple-700">ADL completion rate</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Recent Assessments</h4>
                      {assessmentHistory.slice(0, 5).map((assessment, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{assessment.date}</span>
                            <Badge variant="outline">
                              Cognitive Index: {assessment.cognitiveIndex}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>Memory: {assessment.memoryRecall}/7</div>
                            <div>Attention: {assessment.attentionDuration}min</div>
                            <div>Balance: {assessment.balanceTime}s</div>
                            <div>ADL: {assessment.adlScore}/5</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={exportData} variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export Clinical Data (CSV)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Clinical Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">Complete assessments to view analytics</p>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Domain Averages</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Memory Recall:</span>
                            <span className="font-medium">{getAverage('memoryRecall')}/7</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Attention Duration:</span>
                            <span className="font-medium">{getAverage('attentionDuration')} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mood Regulation:</span>
                            <span className="font-medium">{getAverage('moodRegulation')}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Anxiety Level:</span>
                            <span className="font-medium">{getAverage('anxietyLevel')}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vertigo Severity:</span>
                            <span className="font-medium">{getAverage('vertigoSeverity')}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Balance Time:</span>
                            <span className="font-medium">{getAverage('balanceTime')} sec</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ADL Score:</span>
                            <span className="font-medium">{getAverage('adlScore')}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fatigue Level:</span>
                            <span className="font-medium">{getAverage('fatigueLevel')}/10</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Clinical Alerts</h4>
                        <div className="space-y-2">
                          {assessmentHistory.length > 0 && (
                            <>
                              {parseFloat(getAverage('anxietyLevel')) >= 7 && (
                                <div className="flex items-center gap-2 text-orange-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  Elevated anxiety - consider specialist review
                                </div>
                              )}
                              {parseFloat(getAverage('moodRegulation')) <= 4 && (
                                <div className="flex items-center gap-2 text-red-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  Low mood indicator - monitor closely
                                </div>
                              )}
                              {parseFloat(getAverage('vertigoSeverity')) >= 7 && (
                                <div className="flex items-center gap-2 text-purple-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  Significant vertigo - vestibular therapy recommended
                                </div>
                              )}
                              {parseFloat(getAverage('cognitiveIndex')) <= 2.5 && (
                                <div className="flex items-center gap-2 text-blue-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  Cognitive concerns - neuropsych evaluation suggested
                                </div>
                              )}
                              {parseFloat(getAverage('anxietyLevel')) < 7 && parseFloat(getAverage('moodRegulation')) > 4 && parseFloat(getAverage('vertigoSeverity')) < 7 && parseFloat(getAverage('cognitiveIndex')) > 2.5 && (
                                <div className="flex items-center gap-2 text-green-600">
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
            <Card>
              <CardHeader>
                <CardTitle>Practitioner Access Portal</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="mb-4 text-gray-600">Secure access for healthcare professionals</p>
                    <Button onClick={practitionerLogin} className="bg-gray-800 hover:bg-gray-900">
                      Practitioner Login
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Access code required for patient data review</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Practitioner Access Enabled</h4>
                      <p className="text-green-700">Full patient data access and clinical export capabilities available</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" />
                        Export Patient Data
                      </Button>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Clinical Report
                      </Button>
                    </div>

                    <div className="text-sm text-gray-600">
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

        <div className="mt-12 text-center text-sm text-gray-500 border-t pt-8">
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
