import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Activity, ExternalLink, Sparkles, Loader2, X } from "lucide-react";
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

  // Reset AI panel when region changes
  useEffect(() => {
    setAiOpen(false);
    setAiText("");
    abortRef.current?.abort();
  }, [region?.id]);

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
          },
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
      <div className="rounded-2xl border border-blue-500/20 bg-slate-950/60 backdrop-blur-xl p-6 text-blue-100/80">
        <Brain className="h-8 w-8 text-blue-400 mb-3" />
        <h3 className="text-lg font-semibold text-blue-100 mb-2">
          Select a brain region
        </h3>
        <p className="text-base leading-relaxed text-blue-200/70">
          Tap any glowing region on the 3D model — or use the chips below — to see
          the function, common TBI sequelae, and the manuscript chapter and
          protocol that target it.
        </p>
        <p className="text-xs text-blue-300/50 mt-4 italic">
          Tip: enable "Deep View" to reveal subcortical structures (amygdala,
          hippocampus, thalamus, brainstem).
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-blue-500/30 bg-slate-950/70 backdrop-blur-xl p-6 shadow-2xl"
      style={{ boxShadow: `0 0 40px -12px ${region.color}55` }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="h-3 w-3 rounded-full mt-2 flex-shrink-0"
          style={{ backgroundColor: region.color, boxShadow: `0 0 12px ${region.color}` }}
        />
        <div>
          <h2
            className="text-xl font-semibold leading-tight"
            style={{ color: region.color }}
          >
            {region.label}
          </h2>
          <p className="text-base text-blue-100/90 mt-1">{region.function}</p>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="text-sm uppercase tracking-wider text-amber-400/80 font-semibold mb-1">
            Common TBI Sequelae
          </h3>
          <p className="text-base leading-relaxed text-blue-50">
            {region.tbiSequelae}
          </p>
        </section>

        <section className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <h3 className="text-sm uppercase tracking-wider text-amber-400 font-semibold mb-1 flex items-center gap-2">
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
            className="border-blue-500/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 hover:text-white justify-start h-auto py-2.5"
          >
            <Link to={region.manuscriptLink}>
              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-left text-sm">{region.manuscriptLabel}</span>
            </Link>
          </Button>
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 justify-start h-auto py-2.5 font-semibold"
          >
            <Link to={region.protocolLink}>
              <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-left text-sm">{region.protocolLabel}</span>
            </Link>
          </Button>
        </div>

        {/* Ask Phoenix CTA */}
        <Button
          onClick={askPhoenix}
          disabled={aiLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold h-auto py-3 mt-1"
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
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 mt-2 relative">
            <button
              onClick={() => { setAiOpen(false); abortRef.current?.abort(); }}
              className="absolute top-2 right-2 p-1 rounded-md text-blue-300/70 hover:text-white hover:bg-blue-500/20"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs uppercase tracking-wider text-blue-300/80 font-semibold">
                Phoenix
              </span>
            </div>
            <div className="text-[15px] leading-relaxed text-blue-50 whitespace-pre-wrap min-h-[3em]">
              {aiText || (aiLoading ? "Reading your recent week…" : "")}
              {aiLoading && aiText && <span className="inline-block w-2 h-4 bg-blue-400/70 ml-1 animate-pulse" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
