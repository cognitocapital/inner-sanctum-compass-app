import { Link } from "react-router-dom";
import { Headphones, BookOpen } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Entry = { to: string; label: string; chapterId: string };

// TODO (open call B): the unified Journal ("My Phoenix Chapters") will be wired
// into this room and/or Today in Slice 3.
const FRONT_MATTER: Entry[] = [
  { to: "/dedication",   label: "Dedication",   chapterId: "dedication" },
  { to: "/disclaimer",   label: "Disclaimer",   chapterId: "disclaimer" },
  { to: "/prologue",     label: "Prologue",     chapterId: "prologue" },
  { to: "/introduction", label: "Introduction", chapterId: "introduction" },
];

const CHAPTERS: Entry[] = Array.from({ length: 21 }, (_, i) => ({
  to: `/chapter-${i + 1}`,
  label: `Chapter ${i + 1}`,
  chapterId: `chapter-${i + 1}`,
}));

const openAudiobook = (chapterId?: string) => {
  if (typeof window !== "undefined" && (window as any).openAudiobook) {
    (window as any).openAudiobook(chapterId);
  }
};

const Row = ({ entry }: { entry: Entry }) => (
  <Card className="p-3 bg-gray-900/60 border-orange-500/20 hover:border-orange-400/50 transition-colors flex items-center justify-between gap-3">
    <Link to={entry.to} className="flex-1 text-white font-medium">
      {entry.label}
    </Link>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openAudiobook(entry.chapterId)}
      className="text-orange-300 hover:text-orange-200"
      aria-label={`Listen to ${entry.label}`}
    >
      <Headphones size={16} />
    </Button>
  </Card>
);

const BookRoom = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pb-24 px-4 pt-8">
      <SEOHead
        title="Book — What a Journey"
        description="Read or listen to the memoir: prologue, introduction, and chapters 1–21."
        path="/book"
      />
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <BookOpen size={22} className="text-orange-400" />
            Book
          </h1>
          <p className="text-sm text-gray-400">The memoir behind the platform.</p>
          <Button
            onClick={() => openAudiobook("dedication")}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Headphones size={16} className="mr-2" /> Listen to Audiobook
          </Button>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-orange-400/80 font-semibold">Front Matter</h2>
          <div className="grid gap-2">
            {FRONT_MATTER.map((e) => <Row key={e.to} entry={e} />)}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-orange-400/80 font-semibold">Chapters</h2>
          <div className="grid gap-2">
            {CHAPTERS.map((e) => <Row key={e.to} entry={e} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookRoom;