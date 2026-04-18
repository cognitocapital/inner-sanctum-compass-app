import { Link } from "react-router-dom";
import { Brain, BookOpen, Activity, ExternalLink } from "lucide-react";
import type { BrainRegion } from "@/data/brainRegions";
import { Button } from "@/components/ui/button";

interface RegionInfoCardProps {
  region: BrainRegion | null;
}

export const RegionInfoCard = ({ region }: RegionInfoCardProps) => {
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
            Evidence Note
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
      </div>
    </div>
  );
};
