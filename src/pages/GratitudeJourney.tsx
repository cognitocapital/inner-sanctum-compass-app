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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Animated background elements inspired by phoenix flames */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary flame particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
        <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-45 shadow-lg shadow-orange-500/30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-35 shadow-lg shadow-orange-500/25"></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s] opacity-55 shadow-lg shadow-orange-500/40"></div>
        
        {/* Additional ember particles */}
        <div className="absolute top-32 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_4s] opacity-40"></div>
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_5s] opacity-35"></div>
        <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_6s] opacity-30"></div>
        <div className="absolute bottom-24 right-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite_7s] opacity-45"></div>
        <div className="absolute top-1/4 right-1/8 w-1 h-1 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_8s] opacity-40"></div>
        
        {/* Subtle flame trails */}
        <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-[float_3s_ease-in-out_infinite_3.5s] opacity-30"></div>
        <div className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-[float_3s_ease-in-out_infinite_4.5s] opacity-25"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto animate-fade-in p-4">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-gray-300 hover:text-white transition-colors">
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
              className="w-full h-full rounded-full border-4 border-orange-500/40 shadow-2xl hover:scale-110 transition-all duration-700 cursor-pointer phoenix-image"
              style={{
                backgroundImage: `url('/lovable-uploads/5d3e9ae0-c18d-4e9a-9d2b-95582494f6bd.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Flame particles around phoenix */}
            <div className="absolute -top-4 -left-4 w-4 h-4 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-90"></div>
            <div className="absolute -top-6 right-12 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.8s] opacity-75"></div>
            <div className="absolute top-6 -right-5 w-3.5 h-3.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.2s] opacity-85"></div>
            <div className="absolute bottom-12 -left-6 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.3s] opacity-65"></div>
            <div className="absolute -bottom-5 right-8 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-80"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-center text-white mb-4 drop-shadow-lg">
            Gratitude Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed mb-6">
            A mindful path to growth and resilience
          </p>

          {/* Path Progress Visualization */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${pathProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {pathLength} steps on your journey • {Math.round(pathProgress)}% path illuminated
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gratitude Journal Entry */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-orange-600">Add to Your Path</CardTitle>
                <p className="text-sm text-gray-600 italic">
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
                    <label className="text-sm font-medium mb-2 block text-gray-700">Path Marker Name</label>
                    <input
                      type="text"
                      placeholder="e.g., 'Overcoming doubt', 'Finding peace', 'New beginning'"
                      value={pathMarker}
                      onChange={(e) => setPathMarker(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">Journey Mood</label>
                    <div className="flex flex-wrap gap-2">
                      {(['peaceful', 'joyful', 'hopeful', 'resilient', 'grateful'] as const).map((mood) => (
                        <Badge
                          key={mood}
                          variant={selectedMood === mood ? "default" : "outline"}
                          className={`cursor-pointer capitalize ${selectedMood === mood ? 'bg-orange-500 text-white' : 'border-orange-300 text-gray-700'}`}
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
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
            <Card className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Daily Path Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-2xl font-bold text-orange-600">{pathLength}</div>
                  <p className="text-sm text-gray-600">Steps taken this journey</p>
                  <div className="text-xs text-gray-500">
                    {pathLength === 0 ? "Take your first step today" : 
                     pathLength === 1 ? "One step forward - keep going!" :
                     `${pathLength} markers on your path of gratitude`}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Journey Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 italic text-center">
                  "Pause to honor where your path has led you today. Look back at a step you're proud of—what are you grateful for?"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Journey Entries */}
        {entries.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 drop-shadow-lg">Your Path of Gratitude</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries.map((entry, index) => (
                <Card key={entry.id} className="backdrop-blur-sm bg-white/80 border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${getMoodColor(entry.mood)} bg-orange-100 text-orange-700 border-orange-200`}>
                        {entry.mood}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        {entry.date}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-orange-600 mb-2">{entry.pathMarker}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{entry.content}</p>
                    
                    <div className="mt-3 text-xs text-gray-500">
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
            <h3 className="text-lg font-medium text-gray-300 mb-2">Your journey awaits</h3>
            <p className="text-sm text-gray-400">
              Take your first step by adding a gratitude entry above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GratitudeJourney;