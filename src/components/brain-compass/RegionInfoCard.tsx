import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Activity, ExternalLink, Sparkles, Loader2, X, Music } from "lucide-react";
import type { BrainRegion } from "@/data/brainRegions";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface RegionInfoCardProps {
  region: BrainRegion | null;
}

export const RegionInfoCard = ({ region }: RegionInfoCardProps) => {
  const { user } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Reset AI panel when region changes + log a region view (signed-in only).
  useEffect(() => {
    setAiOpen(false);
    setAiText("");
    abortRef.current?.abort();
    if (region && user) {
      // Fire-and-forget — never blocks UI
      supabase
        .from("brain_region_views")
        .insert({ user_id: user.id, region_id: region.id })
        .then(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region?.id, user?.id]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const askPhoenix = async () => {
    if (!region) return;
    if (!user) {
      toast({
        title: "Sign in to ask Phoenix",
        description: "Personalised region insights use your check-ins and sessions.",
      });
      return;
    }
    setAiOpen(true);
    setAiText("");
    setAiLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("No session token");

      // Pull last 3 check-ins + last session log to enrich the prompt.
      const [checkinsRes, lastSessionRes] = await Promise.all([
        supabase
          .from("daily_checkins")
          .select("check_date, mood, energy_level, sleep_quality, pain_level, symptoms_today")
          .eq("user_id", user.id)
          .order("check_date", { ascending: false })
          .limit(3),
        supabase
          .from("session_logs")
          .select("module_type, duration_seconds, mood_before, mood_after, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phoenix-companion`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: region.aiSeedPrompt }],
          regionContext: {
            label: region.label,
            shortLabel: region.shortLabel,
            function: region.function,
            tbiSequelae: region.tbiSequelae,
            evidenceNote: region.evidenceNote,
            manuscriptLabel: region.manuscriptLabel,
            protocolLabel: region.protocolLabel,
            soundscapeId: region.soundscapeId,
            dailyProtocolStep: region.dailyProtocolStep,
          },
          recentCheckins: checkinsRes.data ?? [],
          lastSession: lastSessionRes.data ?? null,
        }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Phoenix is rate-limited", description: "Try again in a moment.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "AI credits exhausted", description: "Add credits in Settings.", variant: "destructive" });
        } else {
          toast({ title: "Phoenix is resting", description: "Couldn't reach the companion. Try again shortly.", variant: "destructive" });
        }
        setAiLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) { acc += c; setAiText(acc); }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("askPhoenix error", err);
        toast({ title: "Couldn't reach Phoenix", variant: "destructive" });
      }
    } finally {
      setAiLoading(false);
    }
  };

  if (!region) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-[#0b0a14]/70 backdrop-blur-xl p-6 text-amber-100/80 shadow-[0_0_30px_-12px_rgba(251,191,36,0.25)]">
        <Brain className="h-8 w-8 text-amber-300" strokeWidth={1.5} />
        <h3 className="font-serif text-lg font-semibold text-amber-50 mb-2 mt-3">
          Select a brain region
        </h3>
        <p className="text-base leading-relaxed text-amber-100/70">
          Tap any glowing region on the 3D model — or use the chips below — to see
          the function, common TBI sequelae, and the manuscript chapter and
          protocol that target it.
        </p>
        <p className="text-xs text-amber-300/50 mt-4 italic">
          Tip: enable "Deep View" to reveal subcortical structures (amygdala,
          hippocampus, thalamus, brainstem).
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-amber-500/25 bg-[#0b0a14]/75 backdrop-blur-xl p-6 shadow-2xl"
      style={{ boxShadow: `0 0 40px -12px ${region.color}55` }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="h-3 w-3 rounded-full mt-2 flex-shrink-0"
          style={{ backgroundColor: region.color, boxShadow: `0 0 12px ${region.color}` }}
        />
        <div>
          <h2
            className="font-serif text-xl font-semibold leading-tight"
            style={{ color: region.color }}
          >
            {region.label}
          </h2>
          <p className="text-base text-amber-50/90 mt-1">{region.function}</p>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="text-sm uppercase tracking-wider text-amber-300/80 font-semibold mb-1">
            Common TBI Sequelae
          </h3>
          <p className="text-base leading-relaxed text-amber-50/95">
            {region.tbiSequelae}
          </p>
        </section>

        <section className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] backdrop-blur-sm p-3">
          <h3 className="text-sm uppercase tracking-wider text-amber-300 font-semibold mb-1 flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" />
            2025–2026 Evidence
          </h3>
          <p className="text-[15px] leading-relaxed text-amber-100/90 italic">
            {region.evidenceNote}
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <Button
            asChild
            variant="outline"
            className="border-amber-500/30 bg-amber-500/[0.06] text-amber-100 hover:bg-amber-500/15 hover:text-amber-50 justify-start h-auto py-2.5 backdrop-blur-sm"
          >
            <Link to={region.manuscriptLink}>
              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-left text-sm">{region.manuscriptLabel}</span>
            </Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-[#1a1208] justify-start h-auto py-2.5 font-semibold min-h-[56px] shadow-[0_0_20px_-6px_rgba(251,191,36,0.5)]"
          >
            <Link to={region.protocolLink}>
              <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-left text-sm">{region.protocolLabel}</span>
            </Link>
          </Button>
        </div>

        {region.soundscapeId && (
          <Button
            asChild
            variant="outline"
            className="w-full border-amber-400/30 bg-amber-500/[0.04] text-amber-100/90 hover:bg-amber-500/10 justify-start h-auto py-2.5 min-h-[56px] backdrop-blur-sm"
          >
            <Link to={`/soundscapes?track=${region.soundscapeId}`}>
              <Music className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-left text-sm">
                Play matched soundscape
                {region.dailyProtocolStep ? ` · ${region.dailyProtocolStep}` : ""}
              </span>
            </Link>
          </Button>
        )}

        {/* Ask Phoenix CTA */}
        <Button
          onClick={askPhoenix}
          disabled={aiLoading}
          className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:via-amber-400 hover:to-orange-400 text-[#1a1208] font-semibold h-auto py-3 mt-1 min-h-[56px] shadow-[0_0_24px_-6px_rgba(251,146,60,0.6)]"
        >
          {aiLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Ask Phoenix how this shows up in my logs
        </Button>

        {/* Streaming AI panel */}
        {aiOpen && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] backdrop-blur-sm p-4 mt-2 relative">
            <button
              onClick={() => { setAiOpen(false); abortRef.current?.abort(); }}
              className="absolute top-2 right-2 p-1 rounded-md text-amber-300/70 hover:text-amber-100 hover:bg-amber-500/15"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold">
                Phoenix
              </span>
            </div>
            <div className="text-[15px] leading-relaxed text-amber-50 whitespace-pre-wrap min-h-[3em]">
              {aiText || (aiLoading ? "Reading your recent week…" : "")}
              {aiLoading && aiText && <span className="inline-block w-2 h-4 bg-amber-400/70 ml-1 animate-pulse" />}
            </div>
          </div>
        )}

        <div className="text-[10px] text-amber-300/80 leading-relaxed border-t border-amber-500/15 pt-2 mt-1">
          <strong className="text-amber-200">Not diagnostic.</strong> Educational visualisation only — consult your neurologist.
        </div>
      </div>
    </div>
  );
};
