import { Link } from "react-router-dom";
import { Wind, Music, Snowflake, Brain } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";

type Item = { to: string; label: string; desc: string; Icon: typeof Wind };

const CALM: Item[] = [
  { to: "/breathing",     label: "Breathing",     desc: "Guided breath protocols",    Icon: Wind },
  { to: "/soundscapes",   label: "Soundscapes",   desc: "Healing frequencies",        Icon: Music },
  { to: "/cold-exposure", label: "Cold Exposure", desc: "Safety-gated cold protocol", Icon: Snowflake },
];

// TODO (open call A): rehab placement is provisional — Mind here under Train,
// formal rehab modules (ADL / GMT / Spaced Repetition / Speech) may move between
// Practice→Train and Progress→Rehab in a later slice.
const TRAIN: Item[] = [
  { to: "/mind", label: "Mind Training", desc: "Cognitive exercises", Icon: Brain },
];

const Section = ({ title, items }: { title: string; items: Item[] }) => (
  <section className="space-y-3">
    <h2 className="text-sm uppercase tracking-wider text-orange-400/80 font-semibold">{title}</h2>
    <div className="grid gap-3">
      {items.map(({ to, label, desc, Icon }) => (
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
  </section>
);

const PracticeRoom = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pb-24 px-4 pt-8">
      <SEOHead
        title="Practice — What a Journey"
        description="Self-directed practice: breathing, soundscapes, cold exposure, and cognitive training."
        path="/practice"
      />
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Practice</h1>
          <p className="text-sm text-gray-400">Calm the system. Train the system.</p>
        </header>
        <Section title="Calm" items={CALM} />
        <Section title="Train" items={TRAIN} />
      </div>
    </div>
  );
};

export default PracticeRoom;