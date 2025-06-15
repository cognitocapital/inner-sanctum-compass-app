import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Heart, Lightbulb, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  chapter?: string;
  mood?: string;
}

interface MindfulnessJournalProps {
  currentChapter?: string;
  storyContext?: string;
}

export const MindfulnessJournal = ({ currentChapter, storyContext }: MindfulnessJournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Story-integrated prompts that change based on narrative context
  const mindfulnessPrompts = [
    {
      category: "Self-Awareness",
      prompts: [
        "What emotions did this part of the journey stir in you?",
        "How does this character's choice resonate with your own life?",
        "What thoughts arose as you experienced this moment?",
        "How are you feeling right now, without judgment?"
      ]
    },
    {
      category: "Growth & Resilience",
      prompts: [
        "What strength did you discover in yourself today?",
        "How has this story changed your perspective?",
        "What would you tell the character if you could speak to them?",
        "What lesson from this journey applies to your life?"
      ]
    },
    {
      category: "Present Moment",
      prompts: [
        "What are you grateful for in this moment?",
        "How does your body feel as you reflect on this story?",
        "What sounds, sights, or sensations do you notice right now?",
        "If you were the character, what would you do differently?"
      ]
    },
    {
      category: "Transformation",
      prompts: [
        "How are you different from when you started this journey?",
        "What old patterns are you ready to release?",
        "What new understanding has emerged from this experience?",
        "How can you carry this wisdom into your daily life?"
      ]
    }
  ];

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('mindfulnessJournalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mindfulnessJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    if (!currentEntry.trim() || !selectedPrompt) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      prompt: selectedPrompt,
      content: currentEntry,
      chapter: currentChapter,
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry("");
    setSelectedPrompt("");

    toast({
      title: "Reflection Saved 📝",
      description: "Your mindful moment has been captured.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRandomPrompt = (category?: string) => {
    const categoryPrompts = category 
      ? mindfulnessPrompts.find(p => p.category === category)?.prompts || []
      : mindfulnessPrompts.flatMap(p => p.prompts);
    
    const randomPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
    setSelectedPrompt(randomPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Writing Section */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            Mindfulness Journal
          </CardTitle>
          {currentChapter && (
            <Badge variant="outline" className="w-fit">
              Chapter: {currentChapter}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt Selection */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {mindfulnessPrompts.map((category) => (
                <Button
                  key={category.category}
                  variant="outline"
                  size="sm"
                  onClick={() => getRandomPrompt(category.category)}
                  className="text-xs"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {category.category}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => getRandomPrompt()}
                className="text-xs"
              >
                <Heart className="h-3 w-3 mr-1" />
                Surprise Me
              </Button>
            </div>

            {selectedPrompt && (
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-muted-foreground mb-1">Reflection Prompt:</p>
                <p className="text-foreground">{selectedPrompt}</p>
              </div>
            )}
          </div>

          {/* Writing Area */}
          <div className="space-y-3">
            <Textarea
              placeholder="Let your thoughts flow... Remember, there's no right or wrong way to reflect."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {currentEntry.length} characters
              </span>
              <Button 
                onClick={saveEntry}
                disabled={!currentEntry.trim() || !selectedPrompt}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Reflection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Past Reflections
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} History
            </Button>
          </div>
        </CardHeader>
        
        {showHistory && (
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Your mindfulness journey begins here.</p>
                <p className="text-sm">Start by selecting a prompt above.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.date)}
                      </span>
                      {entry.chapter && (
                        <Badge variant="outline" className="text-xs">
                          {entry.chapter}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">
                      {entry.prompt}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};