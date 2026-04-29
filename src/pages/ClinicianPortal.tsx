import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Stethoscope, Users, Bell, Shield, ChevronRight, Loader2, ShieldOff } from "lucide-react";
import { useUserRoles, useClinicianCaseload, useClinicianAlerts } from "@/hooks/use-clinician";
import { PatientDetailView } from "@/components/clinical/PatientDetailView";
import ClinicalDisclaimer from "@/components/clinical/ClinicalDisclaimer";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function ClinicianPortal() {
  const { user } = useAuth();
  const { isClinician, loading: rolesLoading } = useUserRoles();
  const { patients, loading: caseloadLoading, acceptInvite, refresh } = useClinicianCaseload();
  const { alerts, acknowledge } = useClinicianAlerts();
  const [selected, setSelected] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const enrollSelf = async () => {
    if (!user) return;
    setEnrolling(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "clinician" });
    setEnrolling(false);
    if (error) toast.error("Could not enroll", { description: error.message });
    else { toast.success("Clinician role enabled (beta)"); window.location.reload(); }
  };

  const handleAccept = async () => {
    setAccepting(true);
    const { error } = await acceptInvite(code);
    setAccepting(false);
    if (error) toast.error("Could not accept invite", { description: error.message });
    else { toast.success("Patient linked to your caseload"); setCode(""); }
  };

  const selectedPatient = patients.find((p) => p.patient_id === selected);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Helmet>
        <title>Clinician Portal | What a Journey</title>
        <meta name="description" content="Hospital-grade clinician portal: patient roster, alerts, validated assessment trends, FHIR exports." />
      </Helmet>

      <div className="container mx-auto max-w-5xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
          </Button>
          <div className="flex items-center gap-2 text-amber-400">
            <Stethoscope className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Clinician Portal</h1>
          </div>
        </div>

        <ClinicalDisclaimer />

        {rolesLoading ? (
          <div className="text-sm text-muted-foreground py-12 text-center">Loading…</div>
        ) : !isClinician ? (
          <Card className="bg-card/40 border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ShieldOff className="h-4 w-4" />Clinician access required</CardTitle>
              <CardDescription>This portal is for licensed clinicians, OTs, SLPs, neuropsychologists and rehab professionals. During beta, you can self-enroll for evaluation. Hospitals will be onboarded via verified org accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={enrollSelf} disabled={enrolling} className="w-full">
                {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable clinician role (beta self-enroll)"}
              </Button>
              <p className="text-[11px] text-muted-foreground mt-2">Beta prototype — not for clinical decision-making. Audit-logged.</p>
            </CardContent>
          </Card>
        ) : selected && selectedPatient ? (
          <PatientDetailView
            patientId={selectedPatient.patient_id}
            displayName={selectedPatient.display_name}
            consentScope={selectedPatient.consent_scope}
            onBack={() => { setSelected(null); refresh(); }}
          />
        ) : (
          <Tabs defaultValue="caseload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="caseload"><Users className="h-3 w-3 mr-1" />Caseload</TabsTrigger>
              <TabsTrigger value="alerts"><Bell className="h-3 w-3 mr-1" />Alerts {alerts.filter((a) => !a.acknowledged_at).length > 0 && <Badge variant="destructive" className="ml-2">{alerts.filter((a) => !a.acknowledged_at).length}</Badge>}</TabsTrigger>
              <TabsTrigger value="invite"><Shield className="h-3 w-3 mr-1" />Accept invite</TabsTrigger>
            </TabsList>

            <TabsContent value="caseload" className="space-y-2 mt-4">
              {caseloadLoading ? (
                <div className="text-xs text-muted-foreground">Loading…</div>
              ) : patients.length === 0 ? (
                <Card className="bg-card/40 border-border/40">
                  <CardContent className="py-6 text-center text-sm text-muted-foreground">
                    No patients yet. Ask a patient to share their invite code from Settings → Share with clinician.
                  </CardContent>
                </Card>
              ) : (
                patients.map((p) => (
                  <button key={p.link_id} onClick={() => setSelected(p.patient_id)} className="w-full text-left">
                    <Card className="bg-card/40 backdrop-blur border-border/40 hover:border-amber-400/50 transition">
                      <CardContent className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{p.display_name || "Anonymous patient"}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">#{p.patient_id.slice(0, 8)} · linked {p.accepted_at ? format(new Date(p.accepted_at), "MMM d, yyyy") : "—"}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </button>
                ))
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-2 mt-4">
              {alerts.length === 0 ? (
                <Card className="bg-card/40 border-border/40">
                  <CardContent className="py-6 text-center text-sm text-muted-foreground">No alerts.</CardContent>
                </Card>
              ) : (
                alerts.map((a) => (
                  <Card key={a.id} className={`border-border/40 ${a.acknowledged_at ? "bg-card/20 opacity-70" : "bg-card/40"}`}>
                    <CardContent className="py-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={a.severity === "critical" ? "destructive" : "outline"} className="text-[10px]">{a.severity}</Badge>
                          <span className="text-sm font-medium">{a.title}</span>
                        </div>
                        {a.message && <p className="text-xs text-muted-foreground mt-1">{a.message}</p>}
                        <div className="text-[11px] text-muted-foreground mt-1">{format(new Date(a.created_at), "MMM d, yyyy HH:mm")}</div>
                      </div>
                      {!a.acknowledged_at && (
                        <Button variant="ghost" size="sm" onClick={() => acknowledge(a.id)}>Ack</Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="invite" className="mt-4">
              <Card className="bg-card/40 border-border/40">
                <CardHeader>
                  <CardTitle className="text-base">Accept patient invite</CardTitle>
                  <CardDescription>Enter the 8-character code your patient shared.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABCD-EFGH" className="font-mono uppercase tracking-wider" />
                  <Button onClick={handleAccept} disabled={accepting || code.length < 8} className="w-full">
                    {accepting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link patient to caseload"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}