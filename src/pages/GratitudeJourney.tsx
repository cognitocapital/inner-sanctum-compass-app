import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Star, Heart, Calendar, Brain, Shield, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GratitudeEntry {
  id: string;
  content: string;
  date: string;
  mood: 'peaceful' | 'joyful' | 'hopeful' | 'resilient' | 'grateful';
  pathMarker: string;
}

interface SelfCompassionEntry {
  id: string;
  situation: string;
  selfKindness: string;
  mindfulness: string;
  commonHumanity: string;
  date: string;
}

const GratitudeJourney = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [selfCompassionEntries, setSelfCompassionEntries] = useState<SelfCompassionEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<GratitudeEntry['mood']>('grateful');
  const [pathMarker, setPathMarker] = useState("");
  const { toast } = useToast();

  // Self-compassion form state
  const [compassionForm, setCompassionForm] = useState({
    situation: "",
    selfKindness: "",
    mindfulness: "",
    commonHumanity: ""
  });

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

  // Evidence-based therapeutic techniques
  const therapeuticTechniques = [
    {
      title: "Loving-Kindness Meditation (Metta)",
      description: "Research shows this practice increases positive emotions and reduces symptoms of PTSD and depression.",
      steps: [
        "Start with yourself: 'May I be happy, may I be healthy, may I be at peace'",
        "Extend to loved ones: 'May you be happy, may you be healthy, may you be at peace'",
        "Include neutral people, then difficult people",
        "Finally, extend to all beings everywhere"
      ],
      evidence: "Studies by Barbara Fredrickson show 7 weeks of practice increases vagal tone and life satisfaction."
    },
    {
      title: "Self-Compassion Break (Kristin Neff)",
      description: "A three-step process for responding to suffering with kindness rather than criticism.",
      steps: [
        "Mindfulness: 'This is a moment of suffering' - acknowledge the pain",
        "Common Humanity: 'Suffering is part of life' - you're not alone",
        "Self-Kindness: 'May I be kind to myself' - offer yourself compassion"
      ],
      evidence: "Research shows self-compassion reduces anxiety, depression, and increases resilience and motivation."
    },
    {
      title: "Gratitude Letter Practice",
      description: "Writing detailed letters of gratitude has profound effects on well-being and neural pathways.",
      steps: [
        "Think of someone who has been kind to you",
        "Write a detailed letter describing what they did and how it affected you",
        "Describe how their actions still impact your life today",
        "Deliver the letter in person if possible"
      ],
      evidence: "Martin Seligman's research shows this practice increases happiness for up to 3 months."
    },
    {
      title: "RAIN Technique (Tara Brach)",
      description: "A mindfulness-based approach for working with difficult emotions and trauma responses.",
      steps: [
        "Recognize: What's happening right now?",
        "Allow: Can I let this be here?",
        "Investigate: What does this feel like in my body?",
        "Natural Awareness: Not identifying with the experience"
      ],
      evidence: "Used in trauma-informed therapy, shown to reduce emotional reactivity and increase emotional regulation."
    }
  ];

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeEntries');
    const savedCompassionEntries = localStorage.getItem('selfCompassionEntries');
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedCompassionEntries) {
      setSelfCompassionEntries(JSON.parse(savedCompassionEntries));
    }
    
    // Set a random prompt
    setCurrentPrompt(journeyPrompts[Math.floor(Math.random() * journeyPrompts.length)]);
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('selfCompassionEntries', JSON.stringify(selfCompassionEntries));
  }, [selfCompassionEntries]);

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

  const addSelfCompassionEntry = () => {
    if (!compassionForm.situation.trim()) return;

    const entry: SelfCompassionEntry = {
      id: Date.now().toString(),
      situation: compassionForm.situation,
      selfKindness: compassionForm.selfKindness,
      mindfulness: compassionForm.mindfulness,
      commonHumanity: compassionForm.commonHumanity,
      date: new Date().toLocaleDateString()
    };

    setSelfCompassionEntries(prev => [entry, ...prev]);
    setCompassionForm({
      situation: "",
      selfKindness: "",
      mindfulness: "",
      commonHumanity: ""
    });
    
    toast({
      title: "Self-Compassion Practice Saved",
      description: "Your healing practice has been recorded",
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

  const pathLength = entries.length + selfCompassionEntries.length;
  const pathProgress = Math.min(pathLength * 3, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
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
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
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
            Phoenix Heart Sanctuary
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed mb-6">
            Evidence-based practices for emotional healing, self-compassion, and post-traumatic growth
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
              {pathLength} healing practices completed • {Math.round(pathProgress)}% heart sanctuary unlocked
            </p>
          </div>
        </div>

        <Tabs defaultValue="gratitude" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="gratitude" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Gratitude
            </TabsTrigger>
            <TabsTrigger value="self-compassion" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Self-Compassion
            </TabsTrigger>
            <TabsTrigger value="techniques" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Therapeutic Techniques
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gratitude">
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
                      <div className="text-2xl font-bold text-orange-600">{entries.length}</div>
                      <p className="text-sm text-gray-600">Gratitude steps taken</p>
                      <div className="text-xs text-gray-500">
                        {entries.length === 0 ? "Take your first step today" : 
                         entries.length === 1 ? "One step forward - keep going!" :
                         `${entries.length} markers on your path of gratitude`}
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
          </TabsContent>

          <TabsContent value="self-compassion">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/80 border-pink-500/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-pink-600 flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Self-Compassion Practice
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Based on Dr. Kristin Neff's research on self-compassion and emotional healing
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Difficult Situation or Self-Critical Moment
                      </label>
                      <Textarea
                        placeholder="Describe a moment when you were hard on yourself or facing difficulty..."
                        value={compassionForm.situation}
                        onChange={(e) => setCompassionForm(prev => ({...prev, situation: e.target.value}))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Self-Kindness Response
                      </label>
                      <Textarea
                        placeholder="What would you say to a dear friend in this situation? Offer yourself the same kindness..."
                        value={compassionForm.selfKindness}
                        onChange={(e) => setCompassionForm(prev => ({...prev, selfKindness: e.target.value}))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Mindful Awareness
                      </label>
                      <Textarea
                        placeholder="Acknowledge your feelings without judgment. What emotions are present? How do they feel in your body?"
                        value={compassionForm.mindfulness}
                        onChange={(e) => setCompassionForm(prev => ({...prev, mindfulness: e.target.value}))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">
                        Common Humanity
                      </label>
                      <Textarea
                        placeholder="Remember you're not alone. How is this struggle part of the shared human experience?"
                        value={compassionForm.commonHumanity}
                        onChange={(e) => setCompassionForm(prev => ({...prev, commonHumanity: e.target.value}))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <Button 
                      onClick={addSelfCompassionEntry}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      disabled={!compassionForm.situation.trim()}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Save Compassion Practice
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="backdrop-blur-sm bg-white/80 border-pink-500/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-pink-600 text-sm">
                      Three Components of Self-Compassion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong className="text-pink-600">Self-Kindness:</strong>
                      <p className="text-gray-600">Treating yourself with the same kindness you'd show a good friend.</p>
                    </div>
                    <div>
                      <strong className="text-pink-600">Mindfulness:</strong>
                      <p className="text-gray-600">Observing thoughts and feelings without getting caught up in them.</p>
                    </div>
                    <div>
                      <strong className="text-pink-600">Common Humanity:</strong>
                      <p className="text-gray-600">Recognizing that suffering is part of the shared human experience.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-pink-500/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-pink-600 text-sm">
                      Self-Compassion Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-xl font-bold text-pink-600">{selfCompassionEntries.length}</div>
                      <p className="text-xs text-gray-600">Healing practices completed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Self-Compassion Entries */}
            {selfCompassionEntries.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-serif font-bold text-white mb-6 drop-shadow-lg">Your Self-Compassion Journey</h2>
                <div className="grid grid-cols-1 gap-4">
                  {selfCompassionEntries.map((entry, index) => (
                    <Card key={entry.id} className="backdrop-blur-sm bg-white/80 border-pink-500/10 hover:border-pink-500/30 transition-all duration-300 shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                            Practice #{selfCompassionEntries.length - index}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {entry.date}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-pink-600 mb-1">Situation:</h4>
                            <p className="text-sm text-gray-700">{entry.situation}</p>
                          </div>
                          
                          {entry.selfKindness && (
                            <div>
                              <h4 className="font-medium text-pink-600 mb-1">Self-Kindness:</h4>
                              <p className="text-sm text-gray-700">{entry.selfKindness}</p>
                            </div>
                          )}
                          
                          {entry.mindfulness && (
                            <div>
                              <h4 className="font-medium text-pink-600 mb-1">Mindful Awareness:</h4>
                              <p className="text-sm text-gray-700">{entry.mindfulness}</p>
                            </div>
                          )}
                          
                          {entry.commonHumanity && (
                            <div>
                              <h4 className="font-medium text-pink-600 mb-1">Common Humanity:</h4>
                              <p className="text-sm text-gray-700">{entry.commonHumanity}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="techniques">
            <div className="grid gap-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-white mb-4">Evidence-Based Therapeutic Techniques</h2>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  Research-backed practices for emotional healing, trauma recovery, and post-traumatic growth
                </p>
              </div>

              {therapeuticTechniques.map((technique, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-orange-600 flex items-center">
                      <Brain className="mr-2 h-5 w-5" />
                      {technique.title}
                    </CardTitle>
                    <p className="text-gray-600">{technique.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Practice Steps:</h4>
                      <ol className="list-decimal list-inside space-y-2">
                        {technique.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-700">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Research Evidence:</h4>
                      <p className="text-sm text-blue-700">{technique.evidence}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid gap-6">
              <Card className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-orange-600">Recommended Books & Research</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">"Self-Compassion" by Dr. Kristin Neff</h4>
                      <p className="text-sm text-gray-600 mt-1">The definitive guide to self-compassion research and practice</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">"Radical Acceptance" by Tara Brach</h4>
                      <p className="text-sm text-gray-600 mt-1">Buddhist psychology for emotional healing and awakening</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">"The Body Keeps the Score" by Dr. Bessel van der Kolk</h4>
                      <p className="text-sm text-gray-600 mt-1">Groundbreaking research on trauma and recovery</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">"Thanks! How Gratitude Can Make You Happier" by Robert Emmons</h4>
                      <p className="text-sm text-gray-600 mt-1">Scientific research on gratitude and well-being</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 border-orange-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-orange-600">Professional Support Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Psychology Today Therapist Finder</h4>
                      <p className="text-sm text-blue-700 mb-2">Find trauma-informed therapists specializing in TBI recovery</p>
                      <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Find a Therapist →
                      </a>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Centre for Mindful Self-Compassion</h4>
                      <p className="text-sm text-green-700 mb-2">Official training programs and resources</p>
                      <a href="https://self-compassion.org" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                        Visit Website →
                      </a>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">National Suicide Prevention Lifeline</h4>
                      <p className="text-sm text-purple-700 mb-2">24/7 crisis support: 988</p>
                      <a href="https://suicidepreventionlifeline.org" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline">
                        Get Help Now →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {(entries.length === 0 && selfCompassionEntries.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Your healing journey awaits</h3>
            <p className="text-sm text-gray-400">
              Begin with gratitude practice or self-compassion exercises above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GratitudeJourney;
