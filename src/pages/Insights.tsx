import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { InsightsDashboard } from "@/components/insights/InsightsDashboard";
import { ClinicalDashboard } from "@/components/clinical/ClinicalDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Insights = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
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
