import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, BookHeart, Share2, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PHASES } from "@/data/phoenixQuests";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  phase: number;
  title: string;
  content: string;
  mood_tag: string | null;
  is_shared: boolean;
  created_at: string;
}

const MOOD_TAGS = ["hopeful", "struggling", "grateful", "reflective", "determined", "peaceful", "anxious", "proud"];

const MyPhoenixChapters = () => {
  const { user, isGuest } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodTag, setMoodTag] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      toast.success("Phoenix Chapter saved! 🔥");
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
      toast.success(entry.is_shared ? "Entry made private" : "Shared as an Echo 🌟");
      fetchEntries();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950/20 text-white">
      <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <Link to="/phoenix-path"><ArrowLeft className="w-4 h-4 mr-2" />Path</Link>
          </Button>
          <h1 className="text-lg font-serif text-white flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-orange-400" />
            My Phoenix Chapters
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setShowNew(true)} className="text-orange-400">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Intro */}
        <p className="text-white/50 text-sm text-center">
          Write your own story chapters alongside Michael's. Your journey is worth telling.
        </p>

        {/* New entry form */}
        {showNew && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-5 border border-orange-500/20 space-y-4"
          >
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Chapter title..."
              className="w-full bg-transparent border-b border-white/10 pb-2 text-lg font-serif text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
            />
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tell your story..."
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setMoodTag(moodTag === tag ? null : tag)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    moodTag === tag
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || !title.trim()}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white">
                {saving ? "Saving..." : "Save Chapter"}
              </Button>
              <Button variant="ghost" onClick={() => setShowNew(false)} className="text-white/40">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Entries list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Flame className="w-12 h-12 text-orange-500/30 mx-auto" />
            <p className="text-white/40">Your story awaits. Write your first Phoenix Chapter.</p>
            <Button onClick={() => setShowNew(true)} className="bg-orange-600 hover:bg-orange-500 text-white">
              <Plus className="w-4 h-4 mr-2" /> Write First Chapter
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-white">{entry.title}</h3>
                  <button onClick={() => toggleShare(entry)} className={`p-1.5 rounded-full ${entry.is_shared ? 'text-orange-400 bg-orange-500/20' : 'text-white/30 hover:text-white/50'}`}>
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                {entry.mood_tag && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 capitalize">{entry.mood_tag}</span>
                )}
                <p className="text-sm text-white/60 line-clamp-3">{entry.content}</p>
                <p className="text-xs text-white/30">{new Date(entry.created_at).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPhoenixChapters;
