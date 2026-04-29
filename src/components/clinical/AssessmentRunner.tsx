import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Coffee, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Instrument, ScoringResult, AnswerValue, RedFlag } from "@/lib/clinical/types";
import { SafetyModal } from "./SafetyModal";

interface Props {
  instrument: Instrument;
  onComplete: (result: ScoringResult) => void;
  onCancel: () => void;
}

const STORAGE_KEY = (id: string) => `clinical:draft:${id}`;
const BREAK_EVERY = 10;

/**
 * Generic, accessibility-first instrument runner used by every validated
 * assessment. Handles save-resume drafts, auto brain-breaks, blocking red-flag
 * routing, persistence to clinical_assessments, and append-only audit logging.
 */
export const AssessmentRunner = ({ instrument, onComplete, onCancel }: Props) => {
  const { user } = useAuth();
  const [responses, setResponses] = useState<(AnswerValue | null)[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY(instrument.id));
        if (raw) return JSON.parse(raw);
      } catch { /* ignore */ }
    }
    return new Array(instrument.items.length).fill(null);
  });
  const [index, setIndex] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [pendingResult, setPendingResult] = useState<ScoringResult | null>(null);
  const [pendingFlags, setPendingFlags] = useState<RedFlag[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const item = instrument.items[index];
  const total = instrument.items.length;
  const answered = responses.filter((r) => r !== null).length;
  const progress = (answered / total) * 100;

  // Persist draft
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY(instrument.id), JSON.stringify(responses)); } catch { /* ignore */ }
  }, [responses, instrument.id]);

  const setAnswer = (v: AnswerValue) => {
    setResponses((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const goNext = () => {
    if (index === total - 1) {
      finalize();
      return;
    }
    const nextIdx = index + 1;
    if (nextIdx > 0 && nextIdx % BREAK_EVERY === 0) {
      setShowBreak(true);
    } else {
      setIndex(nextIdx);
    }
  };

  const finalize = () => {
    const filled = responses.map((r) => (r ?? 0)) as AnswerValue[];
    const result = instrument.score(filled);
    const blocking = result.redFlags.filter((f) => f.blocking);
    setPendingResult(result);
    if (blocking.length > 0) {
      setPendingFlags(blocking);
    } else {
      void persist(result);
    }
  };

  const persist = async (result: ScoringResult) => {
    if (!user) {
      toast.error("Please sign in to save your assessment.");
      return;
    }
    setSubmitting(true);
    try {
      const insertRow = {
        user_id: user.id,
        assessment_type: instrument.code,
        instrument_version: instrument.version,
        score: result.score,
        severity: result.severity.label,
        subscores: result.subscores as unknown as Record<string, unknown>,
        responses: responses as unknown as Record<string, unknown>,
        interpretation: result.interpretation,
        red_flags: result.redFlags as unknown as Record<string, unknown>,
        administered_in: "self",
        administered_by: "self",
      };
      const { data, error } = await supabase
        .from("clinical_assessments")
        .insert(insertRow)
        .select("id")
        .single();
      if (error) throw error;

      // Audit log
      await supabase.from("clinical_audit_log").insert({
        actor_id: user.id,
        action: "assessment.completed",
        target_type: "clinical_assessments",
        target_id: data?.id ?? null,
        metadata: { instrument: instrument.code, score: result.score, severity: result.severity.label, red_flags: result.redFlags.length },
      });

      // Persist red flag events for blocking flags
      if (result.redFlags.length > 0) {
        await supabase.from("clinical_red_flag_events").insert(
          result.redFlags.map((f) => ({
            user_id: user.id,
            flag_type: f.type,
            severity: f.severity,
            instrument: instrument.code,
            source_assessment_id: data?.id ?? null,
            message: f.message,
            metadata: { itemId: f.itemId ?? null },
          })),
        );
      }

      try { localStorage.removeItem(STORAGE_KEY(instrument.id)); } catch { /* ignore */ }
      toast.success(`${instrument.shortName} saved`, { description: `${result.score}/${result.maxScore} — ${result.severity.label}` });
      onComplete(result);
    } catch (e) {
      console.error(e);
      toast.error("Could not save assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const optionList = useMemo(() => item?.options ?? [], [item]);

  return (
    <>
      <Card className="bg-slate-950 border-slate-700/40">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-teal-400/40 text-teal-200">
              {instrument.shortName} · v{instrument.version}
            </Badge>
            <span className="text-white/60 text-xs tabular-nums" aria-live="polite">
              {index + 1} / {total}
            </span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/5" aria-label={`${Math.round(progress)} percent complete`} />
          <div className="flex items-center gap-2 text-[11px] text-white/50">
            <ShieldCheck className="w-3 h-3" aria-hidden="true" />
            <span>Validated instrument · responses encrypted at rest · save & resume any time</span>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <h3 className="text-white text-lg leading-snug font-medium mb-1">{item.prompt}</h3>
              {item.domain && (
                <p className="text-white/40 text-xs uppercase tracking-wide mb-4">{item.domain}</p>
              )}
              <RadioGroup
                value={responses[index]?.toString() ?? ""}
                onValueChange={(v) => setAnswer(parseInt(v, 10))}
                className="space-y-2"
              >
                {optionList.map((opt) => {
                  const id = `${instrument.id}-${index}-${opt.value}`;
                  const selected = responses[index] === opt.value;
                  return (
                    <Label
                      key={opt.value}
                      htmlFor={id}
                      className={`flex items-start gap-3 p-3 min-h-[56px] rounded-lg border cursor-pointer transition-all ${
                        selected
                          ? "bg-teal-500/15 border-teal-400/60 ring-1 ring-teal-400/30"
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      <RadioGroupItem value={opt.value.toString()} id={id} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="text-white/90 text-sm leading-snug">{opt.label}</div>
                        {opt.description && (
                          <div className="text-white/45 text-xs mt-0.5">{opt.description}</div>
                        )}
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6 gap-2">
            <Button
              variant="ghost"
              onClick={() => (index === 0 ? onCancel() : setIndex((i) => i - 1))}
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {index === 0 ? "Cancel" : "Back"}
            </Button>
            <Button
              onClick={goNext}
              disabled={responses[index] === null || submitting}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold"
            >
              {index === total - 1 ? (submitting ? "Saving…" : "Finish") : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Brain-break interstitial */}
      <Dialog open={showBreak} onClose={() => { setShowBreak(false); setIndex((i) => i + 1); }} />

      <SafetyModal
        open={pendingFlags.length > 0}
        flags={pendingFlags}
        onAcknowledge={() => {
          if (pendingResult) void persist(pendingResult);
          setPendingFlags([]);
        }}
        onCancel={() => { setPendingFlags([]); setPendingResult(null); }}
      />
    </>
  );
};

/** Lightweight inline brain-break overlay (auto-suggested every BREAK_EVERY items). */
const Dialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Brain break">
      <Card className="bg-slate-900 border-amber-500/30 max-w-md text-center">
        <CardContent className="p-6 space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-amber-300" aria-hidden="true" />
          </div>
          <h4 className="text-white text-lg font-medium">Brain break</h4>
          <p className="text-white/65 text-sm">
            You're doing well. Pause for a moment — close your eyes, breathe slowly, then continue when ready.
          </p>
          <Button onClick={onClose} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold">
            I'm ready — continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
