import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/ui/glass-card";
import { PhoenixBackground } from "@/components/ui/phoenix-background";

interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
  mood: 'peaceful' | 'joyful' | 'hopeful' | 'resilient' | 'grateful';
}

const journeyPrompts = [
  "What moment on your path are you thankful for today?",
  "How has gratitude carried you through a tough stretch?",
  "What strength have you discovered on your journey lately?",
  "Which step forward fills your heart with appreciation?",
  "What unexpected blessing appeared on your path recently?"
];

const GratitudeJourney = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<GratitudeEntry['mood']>('grateful');
  const [currentPrompt] = useState(() => journeyPrompts[Math.floor(Math.random() * journeyPrompts.length)]);
  const { toast } = useToast();

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gratitudeEntries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  // Save entries
  useEffect(() => {
    localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!newEntry.trim()) return;

    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      content: newEntry,
      date: new Date().toLocaleDateString(),
      mood: selectedMood
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry("");
    
    toast({
      title: "Gratitude Added",
      description: "Your heart grows stronger with each grateful moment.",
    });
  };

  const getMoodEmoji = (mood: GratitudeEntry['mood']) => {
    const emojis = { peaceful: '☮️', joyful: '✨', hopeful: '🌅', resilient: '💪', grateful: '🙏' };
    return emojis[mood];
  };

  // Growing garden visualization based on entries
  const gardenSize = Math.min(entries.length, 12);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <PhoenixBackground module="heart" />
      
      <div className="relative z-10 max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-400" />
            <span className="font-medium">Phoenix Heart</span>
          </div>
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">
            {entries.length} entries
          </Badge>
        </div>

        {/* Growing Heart Garden */}
        <GlassCard className="p-6 mb-6 text-center">
          <div className="flex justify-center gap-1 mb-3 flex-wrap">
            {Array.from({ length: gardenSize }).map((_, i) => (
              <span 
                key={i} 
                className="text-2xl animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                🌸
              </span>
            ))}
            {gardenSize === 0 && (
              <span className="text-white/40 text-sm">Plant your first gratitude seed</span>
            )}
          </div>
          <p className="text-xs text-white/50">Your gratitude garden grows with each entry</p>
        </GlassCard>

        {/* Quanta Prompt */}
        <GlassCard className="p-4 mb-6 border-l-4 border-l-rose-400">
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-white/80 italic">"{currentPrompt}"</p>
              <p className="text-xs text-rose-400/60 mt-1">— Ch3: The power of gratitude</p>
            </div>
          </div>
        </GlassCard>

        {/* Journal Entry */}
        <GlassCard className="p-4 mb-6">
          <Textarea
            placeholder="What fills your heart with gratitude today?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="min-h-[100px] bg-transparent border-white/20 text-white placeholder:text-white/40 resize-none mb-4"
          />
          
          {/* Mood Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['peaceful', 'joyful', 'hopeful', 'resilient', 'grateful'] as const).map((mood) => (
              <Badge
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                className={`cursor-pointer capitalize ${
                  selectedMood === mood 
                    ? 'bg-rose-500 text-white border-rose-500' 
                    : 'border-white/30 text-white/70 hover:bg-white/10'
                }`}
                onClick={() => setSelectedMood(mood)}
              >
                {getMoodEmoji(mood)} {mood}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={addEntry}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            disabled={!newEntry.trim()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Gratitude
          </Button>
        </GlassCard>

        {/* Past Entries */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60">Recent Gratitude</h3>
          {entries.slice(0, 5).map((entry) => (
            <GlassCard key={entry.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-white/90">{entry.content}</p>
                  <p className="text-xs text-white/40 mt-2">{entry.date}</p>
                </div>
                <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
              </div>
            </GlassCard>
          ))}
          {entries.length === 0 && (
            <p className="text-center text-white/40 text-sm py-8">
              Your gratitude journey begins with a single step
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GratitudeJourney;
