import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Star, Heart, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
  mood: 'peaceful' | 'joyful' | 'hopeful' | 'resilient' | 'grateful';
  pathMarker: string;
}

const GratitudeJourney = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<GratitudeEntry['mood']>('grateful');
  const [pathMarker, setPathMarker] = useState("");
  const { toast } = useToast();

  // Journey prompts for inspiration
  const journeyPrompts = [
    "What moment on your path are you thankful for today?",
    "How has gratitude carried you through a tough stretch?",
    "What strength have you discovered on your journey lately?",
    "Which step forward fills your heart with appreciation?",
    "What unexpected blessing appeared on your path recently?",
    "How has your journey taught you to find joy in small moments?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(journeyPrompts[0]);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    // Set a random prompt
    setCurrentPrompt(journeyPrompts[Math.floor(Math.random() * journeyPrompts.length)]);
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
  }, [entries]);

  const addGratitudeEntry = () => {
    if (!newEntry.trim()) return;

    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      content: newEntry,
      date: new Date().toLocaleDateString(),
      mood: selectedMood,
      pathMarker: pathMarker || "A step forward"
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry("");
    setPathMarker("");
    
    toast({
      title: "Path Marker Added",
      description: "Your gratitude step has been added to your journey",
    });
  };

  const getMoodColor = (mood: GratitudeEntry['mood']) => {
    const colors = {
      peaceful: 'bg-blue-500/20 text-blue-300',
      joyful: 'bg-yellow-500/20 text-yellow-300',
      hopeful: 'bg-green-500/20 text-green-300',
      resilient: 'bg-purple-500/20 text-purple-300',
      grateful: 'bg-primary/20 text-primary'
    };
    return colors[mood];
  };

  const pathLength = entries.length;
  const pathProgress = Math.min(pathLength * 5, 100); // Each entry adds 5% to path completion

  return (
    <div className="max-w-6xl mx-auto animate-fade-in p-4">
      <div className="mb-8">
        <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Header with Path Visual */}
      <div className="text-center mb-8">
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div 
            className="w-full h-full rounded-full border-2 border-primary/30 shadow-lg animate-glow-pulse hover:scale-105 transition-all duration-300 phoenix-image"
            style={{
              backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-center text-flame-gradient mb-4">
          Gratitude Journey
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          A mindful path to growth and resilience
        </p>

        {/* Path Progress Visualization */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-flame-gradient transition-all duration-500 ease-out"
              style={{ width: `${pathProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {pathLength} steps on your journey • {Math.round(pathProgress)}% path illuminated
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gratitude Journal Entry */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-flame-gradient">Add to Your Path</CardTitle>
              <p className="text-sm text-muted-foreground italic">
                "{currentPrompt}"
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What are you grateful for on your journey today?"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Path Marker Name</label>
                  <input
                    type="text"
                    placeholder="e.g., 'Overcoming doubt', 'Finding peace', 'New beginning'"
                    value={pathMarker}
                    onChange={(e) => setPathMarker(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Journey Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {(['peaceful', 'joyful', 'hopeful', 'resilient', 'grateful'] as const).map((mood) => (
                      <Badge
                        key={mood}
                        variant={selectedMood === mood ? "default" : "outline"}
                        className={`cursor-pointer capitalize ${selectedMood === mood ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => setSelectedMood(mood)}
                      >
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={addGratitudeEntry}
                className="w-full bg-flame-gradient hover:opacity-90"
                disabled={!newEntry.trim()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Path Marker
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Daily Challenge & Nudges */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-flame-gradient flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Daily Path Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-2xl font-bold text-primary">{pathLength}</div>
                <p className="text-sm text-muted-foreground">Steps taken this journey</p>
                <div className="text-xs text-muted-foreground">
                  {pathLength === 0 ? "Take your first step today" : 
                   pathLength === 1 ? "One step forward - keep going!" :
                   `${pathLength} markers on your path of gratitude`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-flame-gradient flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Journey Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic text-center">
                "Pause to honor where your path has led you today. Look back at a step you're proud of—what are you grateful for?"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Journey Entries */}
      {entries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-serif font-bold text-flame-gradient mb-6">Your Path of Gratitude</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry, index) => (
              <Card key={entry.id} className="bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {entry.date}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-primary mb-2">{entry.pathMarker}</h4>
                  <p className="text-sm text-foreground leading-relaxed">{entry.content}</p>
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    Step {entries.length - index} on your journey
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Your journey awaits</h3>
          <p className="text-sm text-muted-foreground">
            Take your first step by adding a gratitude entry above
          </p>
        </div>
      )}
    </div>
  );
};

export default GratitudeJourney;