import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Plus, Sparkles, Flower2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { HeartGarden } from "@/components/ui/heart-garden";
import { cn } from "@/lib/utils";

interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
  mood: string;
}

const moodOptions = [
  { emoji: "🌱", label: "Growing", color: "text-green-400" },
  { emoji: "🌸", label: "Peaceful", color: "text-pink-400" },
  { emoji: "☀️", label: "Joyful", color: "text-yellow-400" },
  { emoji: "🔥", label: "Grateful", color: "text-orange-400" },
];

const journeyPrompts = [
  "What moment brought you peace today?",
  "What strength did you discover on your journey?",
  "What unexpected blessing appeared recently?",
  "What small victory are you celebrating?",
];

const GratitudeJourney = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState(moodOptions[3]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(journeyPrompts[0]);
  const [streak, setStreak] = useState(0);
  
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeEntries');
    const savedStreak = localStorage.getItem('gratitudeStreak');
    
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedStreak) setStreak(parseInt(savedStreak));
    
    setCurrentPrompt(journeyPrompts[Math.floor(Math.random() * journeyPrompts.length)]);
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
      mood: selectedMood.emoji,
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry("");
    setIsWriting(false);
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('gratitudeStreak', newStreak.toString());
    
    toast({
      title: "Heart bloomed! 🌸",
      description: "Your gratitude grows the garden.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/30 to-slate-900 text-white relative overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-500/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-pink-400" />
              <h1 className="text-xl font-bold text-pink-100">Phoenix Heart</h1>
            </div>
            <EvidenceBadge level="B" domain="Gratitude" pubmedId="36594858" />
          </div>
          <div className="w-10" />
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{entries.length}</div>
            <div className="text-pink-300/60">Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{streak}</div>
            <div className="text-amber-300/60">Streak</div>
          </div>
        </div>

        {/* Heart Garden Visualization */}
        <div className="mb-6">
          <HeartGarden entries={entries.length} streakDays={streak} maxPlants={12} />
        </div>

        {/* Journal entry area */}
        <AnimatePresence mode="wait">
          {isWriting ? (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-900/80 border-pink-500/30 mb-4">
                <CardContent className="p-4 space-y-4">
                  <p className="text-pink-300/80 italic text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {currentPrompt}
                  </p>
                  
                  <Textarea
                    placeholder="What fills your heart with gratitude?"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    className="min-h-[120px] bg-slate-800/50 border-pink-500/20 text-white placeholder:text-pink-300/40"
                  />
                  
                  {/* Mood selection */}
                  <div className="flex justify-center gap-3">
                    {moodOptions.map((mood) => (
                      <Button
                        key={mood.label}
                        variant={selectedMood.label === mood.label ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "text-xl",
                          selectedMood.label === mood.label 
                            ? "bg-pink-500/30 border-pink-400" 
                            : "border-pink-500/20"
                        )}
                        onClick={() => setSelectedMood(mood)}
                      >
                        {mood.emoji}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={addEntry}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400"
                      disabled={!newEntry.trim()}
                    >
                      <Flower2 className="w-4 h-4 mr-2" />
                      Plant Gratitude
                    </Button>
                    <Button
                      variant="outline"
                      className="border-pink-500/30 text-pink-300"
                      onClick={() => setIsWriting(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <Button
                onClick={() => setIsWriting(true)}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Gratitude
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent entries */}
        <div className="space-y-3">
          <h3 className="text-sm text-pink-300/60 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Recent Blooms
          </h3>
          {entries.slice(0, 5).map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/60 border-pink-500/20">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{entry.mood}</span>
                    <div className="flex-1">
                      <p className="text-pink-100/90 text-sm">{entry.content}</p>
                      <p className="text-pink-300/50 text-xs mt-1">{entry.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center py-8 text-pink-300/50">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Your garden awaits its first bloom</p>
            </div>
          )}
        </div>

        {/* Quanta */}
        <div className="text-center mt-8">
          <p className="text-pink-200/60 italic text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            "Tears of gratitude... healing in every drop."
          </p>
        </div>
      </div>
    </div>
  );
};

export default GratitudeJourney;
