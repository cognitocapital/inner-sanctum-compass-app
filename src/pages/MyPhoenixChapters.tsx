import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  BookHeart,
  Share2,
  Flame,
  ChevronDown,
  Sparkles,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";
import myChaptersHero from "@/assets/my-chapters-hero.jpg";

interface JournalEntry {
  id: string;
  phase: number;
  title: string;
  content: string;
  mood_tag: string | null;
  is_shared: boolean;
  created_at: string;
}

const MOOD_TAGS = [
  "hopeful",
  "struggling",
  "grateful",
  "reflective",
  "determined",
  "peaceful",
  "anxious",
  "proud",
];

const MyPhoenixChapters = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodTag, setMoodTag] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fetchEntries = async () => {
    if (!user || isGuest) { setIsLoading(false); return; }
    const { data } = await supabase
      .from("user_journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setEntries((data as JournalEntry[]) || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [user, isGuest]);

  const handleSave = async () => {
    if (!user || isGuest || !title.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("user_journal_entries").insert({
      user_id: user.id,
      phase: 1,
      title: title.trim(),
      content: content.trim(),
      mood_tag: moodTag,
    });
    if (error) {
      toast.error("Couldn't save entry");
    } else {
      toast.success("Phoenix Chapter saved");
      setTitle(""); setContent(""); setMoodTag(null); setShowNew(false);
      fetchEntries();
    }
    setSaving(false);
  };

  const toggleShare = async (entry: JournalEntry) => {
    const { error } = await supabase.from("user_journal_entries")
      .update({ is_shared: !entry.is_shared })
      .eq("id", entry.id);
    if (!error) {
      toast.success(entry.is_shared ? "Entry made private" : "Shared as an Echo");
      fetchEntries();
    }
  };

  const sharedCount = entries.filter(e => e.is_shared).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950/30 text-white relative overflow-hidden">
      <SEOHead
        title="My Phoenix Chapters — What a Journey"
        description="A private journal for survivors to write their own chapters of recovery alongside Michael Heron's manuscript."
        path="/my-chapters"
      />

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[92svh] w-full overflow-hidden flex flex-col">
        <img
          src={myChaptersHero}
          alt="An open leather-bound journal under a starlit sky, warm flame rising from its pages with drifting embers — a feathered quill resting beside it and a phoenix taking flight on the horizon."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
          width={1920}
          height={1080}
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-300/70"
              style={{
                left: `${(i * 89) % 100}%`,
                bottom: `-${10 + (i % 4) * 5}%`,
                filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8))",
              }}
              animate={{
                y: ["0vh", "-110vh"],
                opacity: [0, 1, 0],
                x: [0, (i % 2 ? 25 : -25)],
              }}
              transition={{
                duration: 14 + (i % 5) * 3,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/phoenix-path"))}
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Title block */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4 inline-flex items-center gap-2">
              <BookHeart className="h-3.5 w-3.5" style={{ filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8))" }} />
              Your private journal
            </p>
            <h1 className="font-serif font-bold text-white text-5xl md:text-7xl leading-[1.02] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              My Phoenix Chapters
            </h1>
            <p className="mt-6 text-white/80 text-base md:text-lg max-w-xl font-light italic leading-relaxed mx-auto md:mx-0">
              Write your own chapters of recovery alongside Michael's. Every survivor's story matters — even the ones written in fog.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 max-w-3xl space-y-10">
        {/* Stats medallion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 text-center">
            <p className="text-[10px] tracking-[0.35em] uppercase text-orange-300/70 mb-1">Chapters written</p>
            <p className="font-serif text-3xl text-white">{entries.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 text-center">
            <p className="text-[10px] tracking-[0.35em] uppercase text-orange-300/70 mb-1">Echoes shared</p>
            <p className="font-serif text-3xl text-white">{sharedCount}</p>
          </div>
        </motion.div>

        {/* Write CTA */}
        {!showNew && (
          <motion.button
            onClick={() => setShowNew(true)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative w-full rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/15 via-amber-500/8 to-rose-500/5 backdrop-blur-xl p-6 hover:border-orange-300/60 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/30 transition-colors duration-700" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Plus className="w-5 h-5 text-orange-200" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] tracking-[0.35em] uppercase text-orange-300/80 font-medium">New chapter</p>
                <h3 className="font-serif text-xl text-white mt-1">Write your story today</h3>
                <p className="text-sm text-white/50 italic mt-1">Even a single sentence is a chapter.</p>
              </div>
            </div>
          </motion.button>
        )}

        {/* Composer */}
        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-orange-400/30 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl p-6 md:p-7 space-y-5 shadow-[0_30px_80px_-30px_rgba(249,115,22,0.35)]">
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase text-orange-300/80 mb-3">A new chapter</p>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Chapter title..."
                    className="w-full bg-transparent border-b border-white/15 pb-2 text-2xl font-serif text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/60 transition-colors"
                  />
                </div>
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tell your story... fog, wins, the moment everything changed, the small thing that helped today."
                  className="min-h-[180px] bg-white/5 border-white/10 text-white placeholder:text-white/30 font-serif text-base leading-relaxed"
                />
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Mood</p>
                  <div className="flex flex-wrap gap-2">
                    {MOOD_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setMoodTag(moodTag === tag ? null : tag)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                          moodTag === tag
                            ? 'bg-orange-500/25 border-orange-400/60 text-orange-200'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-medium shadow-lg shadow-orange-500/30"
                  >
                    {saving ? "Saving..." : "Save Chapter"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowNew(false)} className="text-white/50 hover:text-white">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries / Empty / Loading */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-10 h-10 text-orange-400" />
            </motion.div>
          </div>
        ) : !user || isGuest ? (
          <div className="text-center py-16 space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <Lock className="w-10 h-10 text-orange-400/50 mx-auto" />
            <p className="text-white/60 max-w-sm mx-auto leading-relaxed">
              Sign in to write and save your private Phoenix Chapters.
            </p>
            <Button onClick={() => navigate("/auth")} className="bg-orange-500 hover:bg-orange-400 text-white">
              Sign in to begin
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <Sparkles className="w-10 h-10 text-orange-400/40 mx-auto" />
            <p className="font-serif italic text-white/60 text-lg">Your story awaits.</p>
            <p className="text-sm text-white/40 max-w-sm mx-auto">Write the first chapter — it doesn't need to be polished. It just needs to be true.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-cyan-300/70 px-1">Your chapters</p>
            {entries.map((entry, idx) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 md:p-6 hover:border-orange-400/30 hover:bg-white/[0.05] transition-all duration-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                      {new Date(entry.created_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h3 className="font-serif text-xl text-white mt-1 leading-tight">{entry.title}</h3>
                  </div>
                  <button
                    onClick={() => toggleShare(entry)}
                    aria-label={entry.is_shared ? "Make private" : "Share as Echo"}
                    className={`flex-shrink-0 p-2 rounded-full transition-all ${
                      entry.is_shared
                        ? 'text-orange-300 bg-orange-500/20 border border-orange-400/40'
                        : 'text-white/30 hover:text-white/60 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                {entry.mood_tag && (
                  <span className="inline-block mt-3 text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-400/20">
                    {entry.mood_tag}
                  </span>
                )}
                {entry.content && (
                  <p className="text-sm text-white/65 mt-3 leading-relaxed font-serif italic line-clamp-4">{entry.content}</p>
                )}
                {entry.is_shared && (
                  <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-orange-300/60 inline-flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Shared as Echo
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        )}

        {/* Closing */}
        <section className="pb-12 pt-4">
          <figure className="relative max-w-2xl mx-auto rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-7 md:p-9 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-orange-300/70 mb-3">A reminder</p>
            <blockquote className="font-serif text-lg md:text-xl text-white/85 italic leading-relaxed">
              Your chapters are private by default. Share an entry as an Echo only when you're ready — to help another survivor know they're not alone.
            </blockquote>
          </figure>
        </section>
      </div>
    </div>
  );
};

export default MyPhoenixChapters;
