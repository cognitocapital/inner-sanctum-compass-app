import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileDown, Loader2, Printer } from "lucide-react";
import { InsightsDashboard } from "@/components/insights/InsightsDashboard";
import { ClinicalDashboard } from "@/components/clinical/ClinicalDashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Insights = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        toast.error("Please sign in to export your report.");
        setExporting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("export-clinical-report", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      const html = (data as { html?: string })?.html;
      if (!html) throw new Error("No report returned");

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (!win) {
        // Fallback: download
        const a = document.createElement("a");
        a.href = url;
        a.download = `phoenix-recovery-report-${new Date().toISOString().split("T")[0]}.html`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      toast.success("Report ready", {
        description: "Use your browser's Print → Save as PDF to share with your clinician.",
      });
    } catch (e) {
      console.error(e);
      toast.error("Could not generate report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Phoenix Journey
            </Link>
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-semibold gap-2 shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)]"
          >
            {exporting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
            ) : (
              <><FileDown className="w-4 h-4" /> Export for Care Provider</>
            )}
          </Button>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/[0.04] to-orange-500/[0.04] backdrop-blur-sm p-4 flex items-start gap-3">
          <Printer className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
          <p className="text-white/65 text-xs leading-relaxed">
            <span className="text-amber-200">Care Provider Dashboard.</span> All metrics below are tracked from your daily check-ins, clinical assessments and brain training sessions. Use <span className="text-white/85">Export</span> to generate a print-ready report for your neurologist, GP, therapist, or carer. Beta prototype — not a substitute for professional medical evaluation.
          </p>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="bg-white/5 p-1">
            <TabsTrigger value="insights" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">
              Recovery Insights
            </TabsTrigger>
            <TabsTrigger value="clinical" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Clinical Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <InsightsDashboard />
          </TabsContent>

          <TabsContent value="clinical">
            <ClinicalDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;
