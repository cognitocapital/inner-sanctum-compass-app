import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ScoreTrendChart } from "./ScoreTrendChart";
import { AlertTriangle, ArrowLeft, FileDown } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { INSTRUMENTS } from "@/lib/clinical/instruments";
import { buildTrend } from "@/lib/clinical/trend";

interface Props {
  patientId: string;
  displayName: string | null;
  consentScope: Record<string, boolean>;
  onBack: () => void;
}

export function PatientDetailView({ patientId, displayName, consentScope, onBack }: Props) {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [redFlags, setRedFlags] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const aPromise: Promise<{ data: any[] | null }> = consentScope.assessments
        ? (supabase.from("clinical_assessments").select("*").eq("user_id", patientId).order("created_at", { ascending: true }) as any)
        : Promise.resolve({ data: [] });
      const rPromise: Promise<{ data: any[] | null }> = consentScope.red_flags
        ? (supabase.from("clinical_red_flag_events").select("*").eq("user_id", patientId).order("created_at", { ascending: false }) as any)
        : Promise.resolve({ data: [] });
      const cPromise: Promise<{ data: any[] | null }> = consentScope.checkins
        ? (supabase.from("daily_checkins").select("*").eq("user_id", patientId).order("check_date", { ascending: false }).limit(30) as any)
        : Promise.resolve({ data: [] });
      const [a, r, c] = await Promise.all([aPromise, rPromise, cPromise]);
      setAssessments(a.data ?? []);
      setRedFlags(r.data ?? []);
      setCheckins(c.data ?? []);
      setLoading(false);
    })();
  }, [patientId, consentScope]);

  const byInstrument = assessments.reduce((acc: Record<string, any[]>, a) => {
    const key = a.assessment_type;
    (acc[key] ??= []).push(a);
    return acc;
  }, {});

  const exportFhir = () => {
    const fhir = {
      resourceType: "Bundle",
      type: "collection",
      patient: patientId,
      generated: new Date().toISOString(),
      entry: assessments.map((a) => ({
        resource: {
          resourceType: "Observation",
          status: "final",
          code: { text: a.assessment_type, version: a.instrument_version },
          subject: { reference: `Patient/${patientId}` },
          effectiveDateTime: a.created_at,
          valueInteger: a.score,
          interpretation: [{ text: a.severity }],
          component: a.subscores ? Object.entries(a.subscores).map(([k, v]) => ({ code: { text: k }, valueQuantity: { value: v } })) : [],
          note: a.interpretation ? [{ text: a.interpretation }] : [],
        },
      })),
    };
    const blob = new Blob([JSON.stringify(fhir, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-${patientId.slice(0, 8)}-fhir-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("FHIR bundle exported");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to caseload
        </Button>
        <Button variant="outline" size="sm" onClick={exportFhir} disabled={!assessments.length}>
          <FileDown className="h-4 w-4 mr-2" /> Export FHIR
        </Button>
      </div>

      <Card className="bg-card/40 backdrop-blur border-border/40">
        <CardHeader>
          <CardTitle className="text-base">{displayName || "Patient"} <span className="text-xs text-muted-foreground font-mono">#{patientId.slice(0, 8)}</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-muted-foreground">
          <div>Consent: {Object.entries(consentScope).filter(([, v]) => v).map(([k]) => k).join(", ") || "none"}</div>
        </CardContent>
      </Card>

      {redFlags.length > 0 && (
        <Card className="bg-destructive/10 border-destructive/40">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Active red flags ({redFlags.filter((f) => !f.resolved_at).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {redFlags.slice(0, 5).map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-semibold">{f.flag_type} <Badge variant="outline" className="ml-1 text-[10px]">{f.severity}</Badge></div>
                  <div className="text-muted-foreground">{f.message}</div>
                  <div className="text-muted-foreground">{format(new Date(f.created_at), "MMM d, yyyy HH:mm")}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-xs text-muted-foreground">Loading patient data…</div>
      ) : Object.keys(byInstrument).length === 0 ? (
        <Card className="bg-card/40 border-border/40"><CardContent className="py-6 text-center text-sm text-muted-foreground">No assessments yet.</CardContent></Card>
      ) : (
        Object.entries(byInstrument).map(([instrumentKey, rowsAny]) => {
          const rows = rowsAny as any[];
          const inst = INSTRUMENTS[instrumentKey];
          return (
            <Card key={instrumentKey} className="bg-card/40 backdrop-blur border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{instrumentKey}</span>
                  <Badge variant="outline">{rows.length} entries</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inst ? (
                  <ScoreTrendChart instrument={inst} trend={buildTrend(rows as any, inst)} />
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Latest score: {rows[rows.length - 1]?.score ?? "—"} ({rows[rows.length - 1]?.severity ?? "n/a"})
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      {consentScope.checkins && checkins.length > 0 && (
        <Card className="bg-card/40 backdrop-blur border-border/40">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Recent daily check-ins</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {checkins.slice(0, 14).map((c) => (
                <div key={c.id} className="flex justify-between border-b border-border/20 py-1">
                  <span className="text-muted-foreground">{c.check_date}</span>
                  <span>Mood {c.mood ?? "—"} · Energy {c.energy_level ?? "—"} · Pain {c.pain_level ?? "—"} · Sleep {c.sleep_quality ?? "—"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}