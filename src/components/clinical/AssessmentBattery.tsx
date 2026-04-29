import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, ClipboardCheck, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { INSTRUMENTS, BATTERY_ORDER } from "@/lib/clinical/instruments";
import { AssessmentRunner } from "./AssessmentRunner";
import { AssessmentCard } from "./AssessmentCard";
import { ScoreTrendChart } from "./ScoreTrendChart";
import type { AssessmentRecord, Instrument } from "@/lib/clinical/types";
import { buildTrend } from "@/lib/clinical/trend";
import { format } from "date-fns";

export const AssessmentBattery = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<Record<string, AssessmentRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeRunner, setActiveRunner] = useState<Instrument | null>(null);
  const [historyFor, setHistoryFor] = useState<Instrument | null>(null);
  const [redFlagCount, setRedFlagCount] = useState(0);

  const fetchAll = async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("clinical_assessments")
      .select("*")
      .eq("user_id", user.id)
      .in("assessment_type", BATTERY_ORDER as unknown as string[])
      .order("created_at", { ascending: false });
    const grouped: Record<string, AssessmentRecord[]> = {};
    (data ?? []).forEach((row) => {
      const code = row.assessment_type;
      if (!grouped[code]) grouped[code] = [];
      grouped[code].push(row as unknown as AssessmentRecord);
    });
    setHistory(grouped);

    const { count } = await supabase
      .from("clinical_red_flag_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("resolved_at", null);
    setRedFlagCount(count ?? 0);
    setLoading(false);
  };

  useEffect(() => { void fetchAll(); }, [user]);

  const completedCount = useMemo(() => Object.values(history).filter((h) => h.length > 0).length, [history]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-teal-500/[0.06] to-slate-500/[0.04] border-teal-400/20">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-300" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Validated assessment battery</h3>
              <p className="text-white/55 text-xs leading-relaxed">
                Each instrument is published, peer-reviewed, and scored to internationally accepted standards. Your responses are encrypted at rest and visible only to you.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <div className="text-right">
              <div className="text-white text-lg font-semibold tabular-nums">{completedCount}/{BATTERY_ORDER.length}</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wide">Baselines complete</div>
            </div>
            {redFlagCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-300" aria-hidden="true" />
                <span className="text-rose-200 text-xs font-medium">{redFlagCount} active flag{redFlagCount === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BATTERY_ORDER.map((code) => {
          const instrument = INSTRUMENTS[code];
          return (
            <AssessmentCard
              key={code}
              instrument={instrument}
              history={history[code] ?? []}
              onStart={() => setActiveRunner(instrument)}
              onView={() => setHistoryFor(instrument)}
            />
          );
        })}
      </div>

      {/* Runner dialog */}
      <Dialog open={!!activeRunner} onOpenChange={(o) => !o && setActiveRunner(null)}>
        <DialogContent className="bg-transparent border-none shadow-none max-w-2xl p-0">
          {activeRunner && (
            <AssessmentRunner
              instrument={activeRunner}
              onComplete={() => { setActiveRunner(null); void fetchAll(); }}
              onCancel={() => setActiveRunner(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* History dialog */}
      <Dialog open={!!historyFor} onOpenChange={(o) => !o && setHistoryFor(null)}>
        <DialogContent className="bg-slate-950 border-slate-700/40 max-w-2xl">
          {historyFor && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-300" aria-hidden="true" />
                  {historyFor.shortName} trend
                </h3>
                <p className="text-white/55 text-xs mt-1">{historyFor.name}</p>
              </div>
              <ScoreTrendChart instrument={historyFor} trend={buildTrend(history[historyFor.code] ?? [], historyFor)} />
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(history[historyFor.code] ?? []).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm">
                    <div className="text-white/70">{format(new Date(r.created_at), "d MMM yyyy · HH:mm")}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-white tabular-nums">{r.score}/{historyFor.maxScore}</span>
                      <span className="text-white/50 text-xs">{r.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-white/45 pt-2 border-t border-white/10">
                <strong className="text-white/70">Citation:</strong> {historyFor.citation}
              </div>
              <div className="text-[11px] text-white/45">
                <strong className="text-white/70">Use:</strong> {historyFor.copyrightNote}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
