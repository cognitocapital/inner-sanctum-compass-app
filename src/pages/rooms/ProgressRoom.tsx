import { Link } from "react-router-dom";
import { LineChart, Compass, Stethoscope } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";

type Item = { to: string; label: string; desc: string; Icon: typeof LineChart };

// NOTE: /clinician (clinician portal) intentionally omitted from this survivor-facing
// room. A proper "share with my clinician" surface (ClinicianLinkManager) will be
// added in a later slice once sharing UX is designed.
// TODO (open call A): /incog rehab hub is provisional here — may move to Practice→Train.
const ITEMS: Item[] = [
  { to: "/insights",      label: "Insights",      desc: "Trends from your check-ins and sessions", Icon: LineChart },
  { to: "/brain-compass", label: "Brain Compass", desc: "Affected regions, personal scan",          Icon: Compass },
  { to: "/incog",         label: "Neuro-Rehab",   desc: "Evidence-based rehab modules (INCOG)",     Icon: Stethoscope },
];

const ProgressRoom = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pb-24 px-4 pt-8">
      <SEOHead
        title="Progress — What a Journey"
        description="Your clinical view: assessments, trends, brain compass, and rehab."
        path="/progress"
      />
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Progress</h1>
          <p className="text-sm text-gray-400">Where you've been. Where to focus next.</p>
        </header>
        <div className="grid gap-3">
          {ITEMS.map(({ to, label, desc, Icon }) => (
            <Link key={to} to={to}>
              <Card className="p-4 bg-gray-900/60 border-orange-500/20 hover:border-orange-400/50 transition-colors flex items-center gap-4">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-300">
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressRoom;