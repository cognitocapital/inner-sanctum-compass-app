import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, PenTool, Heart, Share2, BookOpen, Users, 
  Sparkles, MessageCircle, Calendar, Award, Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePhoenixGamification, StreakDisplay, FeatherCount } from "@/components/ui/phoenix-gamification";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import NestVisualization from "@/components/circle/NestVisualization";
import ProfileQuiz from "@/components/circle/ProfileQuiz";
import PeerChat from "@/components/circle/PeerChat";
import ConnectionCard from "@/components/circle/ConnectionCard";

interface UserStory {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  category: string;
}

interface UserProfile {
  nickname: string;
  injuryType: string;
  timeSinceInjury: string;
  primaryChallenges: string[];
  interests: string[];
  lookingFor: string[];
  bio: string;
}

interface Connection {
  id: string;
  name: string;
  injuryType: string;
  timeSinceInjury: string;
  challenges: string[];
  interests: string[];
  bio?: string;
  isOnline?: boolean;
  matchScore?: number;
}

// Simulated peer connections for demo
const DEMO_CONNECTIONS: Connection[] = [
  {
    id: "1",
    name: "PhoenixRising",
    injuryType: "tbi",
    timeSinceInjury: "2-5 years",
    challenges: ["Memory", "Fatigue", "Executive function"],
    interests: ["Breathing exercises", "Meditation", "Peer support"],
    bio: "Finding strength in the journey. Every small step counts.",
    isOnline: true,
    matchScore: 92
  },
  {
    id: "2",
    name: "HealingWarrior",
    injuryType: "concussion",
    timeSinceInjury: "1-2 years",
    challenges: ["Attention", "Balance/Vestibular", "Fatigue"],
    interests: ["Cold exposure", "Physical therapy", "Writing/Journaling"],
    bio: "Learning to embrace the new me while honoring who I was.",
    isOnline: true,
    matchScore: 85
  },
  {
    id: "3",
    name: "BrainReboot",
    injuryType: "tbi",
    timeSinceInjury: "5+ years",
    challenges: ["Memory", "Communication", "Emotional regulation"],
    interests: ["Music therapy", "Cognitive games", "Peer support"],
    bio: "5 years post-injury and still discovering new possibilities.",
    isOnline: false,
    matchScore: 78
  },
  {
    id: "4",
    name: "StrokeOfHope",
    injuryType: "stroke",
    timeSinceInjury: "6 months - 1 year",
    challenges: ["Communication", "Memory", "Fatigue"],
    interests: ["Breathing exercises", "Meditation", "Story sharing"],
    isOnline: true,
    matchScore: 71
  },
];

const categories = [
  { value: "all", label: "All Stories" },
  { value: "recovery", label: "Recovery Journey" },
  { value: "hope", label: "Finding Hope" },
  { value: "strength", label: "Inner Strength" },
  { value: "breakthrough", label: "Breakthrough Moments" },
  { value: "community", label: "Community Support" }
];

const UnwrittenChapters = () => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    author: "",
    content: "",
    category: "recovery"
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("circle");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileQuiz, setShowProfileQuiz] = useState(false);
  const [connections, setConnections] = useState<string[]>([]);
  const [activeChatPeer, setActiveChatPeer] = useState<Connection | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { state: gamification, addXp, incrementStreak } = usePhoenixGamification();

  // Load data from localStorage
  useEffect(() => {
    const savedStories = localStorage.getItem('unwrittenChapters');
    const savedProfile = localStorage.getItem('circleProfile');
    const savedConnections = localStorage.getItem('circleConnections');

    if (savedStories) {
      setStories(JSON.parse(savedStories));
    } else {
      const exampleStories: UserStory[] = [
        {
          id: "1",
          title: "Finding My Voice Again",
          author: "PhoenixRising",
          content: "After my accident, I thought I'd lost the ability to express myself clearly. Writing became my therapy, my way back to who I was and who I'm becoming.",
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          likes: 12,
          category: "recovery"
        },
        {
          id: "2",
          title: "The Day Everything Changed",
          author: "HealingWarrior",
          content: "It wasn't the moment of impact that defined me, but the moment I decided to fight back. This is my story of reclaiming my life.",
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          likes: 8,
          category: "strength"
        }
      ];
      setStories(exampleStories);
    }

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  // Save stories to localStorage
  useEffect(() => {
    localStorage.setItem('unwrittenChapters', JSON.stringify(stories));
  }, [stories]);

  const handleSubmitStory = () => {
    if (!newStory.title.trim() || !newStory.content.trim()) {
      toast({
        title: "Please complete your story",
        description: "Both title and content are required.",
        variant: "destructive"
      });
      return;
    }

    const story: UserStory = {
      id: Date.now().toString(),
      title: newStory.title,
      author: userProfile?.nickname || newStory.author || "Anonymous",
      content: newStory.content,
      date: new Date().toISOString(),
      likes: 0,
      category: newStory.category
    };

    setStories([story, ...stories]);
    setNewStory({ title: "", author: "", content: "", category: "recovery" });
    setIsWriting(false);
    addXp(30, "Shared story");
    incrementStreak();

    toast({
      title: "Your chapter has been shared! 📖",
      description: "Thank you for inspiring others with your story."
    });
  };

  const handleLikeStory = (storyId: string) => {
    setStories(stories.map(story => 
      story.id === storyId 
        ? { ...story, likes: story.likes + 1 }
        : story
    ));
    addXp(5, "Supported peer");
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('circleProfile', JSON.stringify(profile));
    setShowProfileQuiz(false);
    addXp(50, "Created Circle profile");
    toast({
      title: "Welcome to the Phoenix Circle! 🔥",
      description: "You can now connect with fellow survivors."
    });
  };

  const handleConnect = (peerId: string) => {
    const newConnections = [...connections, peerId];
    setConnections(newConnections);
    localStorage.setItem('circleConnections', JSON.stringify(newConnections));
    addXp(20, "Made connection");
    toast({
      title: "Connection made! 🤝",
      description: "You can now chat with your new peer."
    });
  };

  const handleOpenChat = (peerId: string) => {
    const peer = DEMO_CONNECTIONS.find(c => c.id === peerId);
    if (peer) {
      setActiveChatPeer(peer);
    }
  };

  const filteredStories = selectedCategory === "all" 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Chat view
  if (activeChatPeer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <PeerChat
            peerName={activeChatPeer.name}
            peerInjuryType={activeChatPeer.injuryType}
            onBack={() => setActiveChatPeer(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <StreakDisplay days={gamification.streakDays} />
            <FeatherCount count={gamification.feathers} />
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <motion.div 
            className="relative mb-6 mx-auto w-20 h-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Users className="h-10 w-10 text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/50"
              animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
            Phoenix Circle
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Connect with fellow phoenix warriors, share your journey, and build lasting supportive relationships.
          </p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            <EvidenceBadge 
              level="A" 
              domain="Group Interventions"
              description="INCOG 2.0 + 2025 Canadian TBI guidelines support group therapy for social cognition"
              pubmedId="36594858"
            />
            <Badge variant="outline" className="bg-teal-500/10 border-teal-500/30 text-teal-400">
              <Sparkles className="w-3 h-3 mr-1" />
              20% isolation reduction
            </Badge>
          </div>
        </header>

        {/* Profile Quiz Modal */}
        <AnimatePresence>
          {showProfileQuiz && (
            <motion.div
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-lg">
                <ProfileQuiz
                  onComplete={handleProfileComplete}
                  onCancel={() => setShowProfileQuiz(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="circle" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Circle
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="meetups" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Meetups
            </TabsTrigger>
          </TabsList>

          {/* Circle Tab - Peer Connections */}
          <TabsContent value="circle" className="space-y-6">
            {!userProfile ? (
              <Card className="text-center py-12 bg-gradient-to-br from-card to-primary/5 border-primary/20">
                <CardContent>
                  <Users className="w-16 h-16 mx-auto mb-4 text-primary/60" />
                  <h3 className="text-2xl font-semibold mb-3">Join the Phoenix Circle</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create your anonymous profile to connect with peers who understand your journey.
                  </p>
                  <Button 
                    onClick={() => setShowProfileQuiz(true)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Flame className="w-5 h-5 mr-2" />
                    Create Your Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Nest Visualization */}
                <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Your Phoenix Nest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NestVisualization
                      connections={DEMO_CONNECTIONS.filter(c => connections.includes(c.id))}
                      activeConnection={selectedConnection || undefined}
                      onConnectionClick={setSelectedConnection}
                    />
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {connections.length} connections in your circle
                    </p>
                  </CardContent>
                </Card>

                {/* Suggested Connections */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Suggested Connections
                  </h3>
                  <div className="space-y-4">
                    {DEMO_CONNECTIONS.map((connection) => (
                      <ConnectionCard
                        key={connection.id}
                        connection={connection}
                        onConnect={handleConnect}
                        onChat={handleOpenChat}
                        isConnected={connections.includes(connection.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Members", value: "127", icon: Users },
                { label: "Stories Shared", value: stories.length.toString(), icon: BookOpen },
                { label: "Support Given", value: stories.reduce((sum, s) => sum + s.likes, 0).toString(), icon: Heart },
                { label: "Connections", value: connections.length.toString(), icon: Sparkles }
              ].map((stat, i) => (
                <Card key={i} className="text-center bg-card/50 border-primary/10">
                  <CardContent className="pt-6">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            {/* Write Story Button */}
            {!isWriting && (
              <div className="text-center">
                <Button 
                  onClick={() => setIsWriting(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <PenTool className="mr-2 h-5 w-5" />
                  Write Your Chapter
                </Button>
              </div>
            )}

            {/* Writing Section */}
            <AnimatePresence>
              {isWriting && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="backdrop-blur-md bg-card/95 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PenTool className="h-5 w-5 text-primary" />
                        Share Your Story
                      </CardTitle>
                      <p className="text-sm text-muted-foreground italic">
                        "Your story is still being written..." — Unwritten Chapters
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Chapter title..."
                          value={newStory.title}
                          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        />
                        <select
                          value={newStory.category}
                          onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                          className="w-full p-2 rounded-md border border-input bg-background"
                        >
                          {categories.slice(1).map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      <Textarea
                        placeholder="Share your experiences, insights, struggles, victories, or words of encouragement..."
                        value={newStory.content}
                        onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                        className="min-h-[150px]"
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {newStory.content.length} characters
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsWriting(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitStory} className="bg-primary hover:bg-primary/90">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share +30 XP
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? "bg-primary" : "border-primary/30"}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Stories Grid */}
            <div className="space-y-4">
              {filteredStories.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
                    <p className="text-muted-foreground">Be the first to share your chapter!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/10 hover:border-primary/30 transition-all">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>by {story.author}</span>
                              <span>•</span>
                              <span>{formatDate(story.date)}</span>
                              <Badge variant="outline" className="text-xs">
                                {categories.find(cat => cat.value === story.category)?.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {story.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeStory(story.id)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {story.likes} {story.likes === 1 ? 'like' : 'likes'}
                          </Button>
                          <Badge variant="outline" className="text-xs">
                            +5 XP
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Meetups Tab */}
          <TabsContent value="meetups" className="space-y-6">
            <Card className="text-center py-12 bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <CardContent>
                <Calendar className="w-16 h-16 mx-auto mb-4 text-primary/60" />
                <h3 className="text-2xl font-semibold mb-3">Weekly Phoenix Circles</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Join virtual meetups with fellow survivors. Share experiences, learn strategies, and build connections.
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Card className="bg-card/50 border-primary/20">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Morning Circle</h4>
                      <p className="text-sm text-muted-foreground mb-3">Tuesdays 10am AEDT</p>
                      <Button variant="outline" size="sm" className="w-full border-primary/30">
                        Set Reminder
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 border-primary/20">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Evening Circle</h4>
                      <p className="text-sm text-muted-foreground mb-3">Thursdays 7pm AEDT</p>
                      <Button variant="outline" size="sm" className="w-full border-primary/30">
                        Set Reminder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="text-center py-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Circle Sage Achievement</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Attend 4 weekly circles to unlock this achievement and earn 100 Phoenix Feathers.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnwrittenChapters;
