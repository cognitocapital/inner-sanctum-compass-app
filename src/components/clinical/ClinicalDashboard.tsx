import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GOSEAssessment } from "./GOSEAssessment";
import { 
  ClipboardCheck, TrendingUp, Calendar, ChevronRight,
  Brain, Activity, Heart, AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface Assessment {
  id: string;
  assessment_type: string;
  score: number;
  severity: string;
  created_at: string;
}

const ASSESSMENT_INFO = {
  GOSE: {
    name: "Glasgow Outcome Scale - Extended",
    description: "Measures overall recovery after brain injury",
    icon: Brain,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    maxScore: 8,
  },
  RPQ: {
    name: "Rivermead Post-Concussion Symptoms",
    description: "Tracks 16 common post-concussion symptoms",
    icon: Activity,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    maxScore: 64,
  },
  PHQ9: {
    name: "Patient Health Questionnaire-9",
    description: "Screens for depression severity",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    maxScore: 27,
  },
};

export const ClinicalDashboard = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGOSE, setShowGOSE] = useState(false);

  const fetchAssessments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("clinical_assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAssessments(data || []);
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  const getLatestByType = (type: string) => {
    return assessments.find(a => a.assessment_type === type);
  };

  const handleGOSEComplete = () => {
    setShowGOSE(false);
    fetchAssessments();
  };

  const latestGOSE = getLatestByType("GOSE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-purple-400" />
            Clinical Tracking
          </h2>
          <p className="text-white/60 mt-1">
            Gold-standard assessments for measuring your recovery
          </p>
        </div>
      </div>

      {/* GOSE Card - Primary */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">GOSE Assessment</CardTitle>
                <CardDescription className="text-white/60">
                  Glasgow Outcome Scale - Extended
                </CardDescription>
              </div>
            </div>
            {latestGOSE && (
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">{latestGOSE.score}/8</div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {latestGOSE.severity}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {latestGOSE ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Calendar className="w-4 h-4" />
                Last assessed: {format(new Date(latestGOSE.created_at), "MMM d, yyyy")}
              </div>
              <Dialog open={showGOSE} onOpenChange={setShowGOSE}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    Retake Assessment
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-transparent border-none shadow-none max-w-lg">
                  <GOSEAssessment 
                    onComplete={handleGOSEComplete}
                    onCancel={() => setShowGOSE(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                <p className="text-white/70 text-sm">
                  Take your first GOSE assessment to establish a baseline for tracking your recovery progress over time.
                </p>
              </div>
              <Dialog open={showGOSE} onOpenChange={setShowGOSE}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    Start GOSE Assessment
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-transparent border-none shadow-none max-w-lg">
                  <GOSEAssessment 
                    onComplete={handleGOSEComplete}
                    onCancel={() => setShowGOSE(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment History */}
      {assessments.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Assessment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessments.slice(0, 5).map((assessment) => {
                const info = ASSESSMENT_INFO[assessment.assessment_type as keyof typeof ASSESSMENT_INFO];
                const Icon = info?.icon || ClipboardCheck;
                
                return (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${info?.bgColor || "bg-white/10"}`}>
                        <Icon className={`w-4 h-4 ${info?.color || "text-white/60"}`} />
                      </div>
                      <div>
                        <div className="text-white font-medium">{assessment.assessment_type}</div>
                        <div className="text-white/50 text-sm">
                          {format(new Date(assessment.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${info?.color || "text-white"}`}>
                        {assessment.score}/{info?.maxScore || "?"}
                      </div>
                      <div className="text-white/50 text-xs">{assessment.severity}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
