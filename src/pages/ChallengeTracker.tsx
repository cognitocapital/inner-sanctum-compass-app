import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, CheckCircle, Award, BarChart3, Brain, Heart, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: 'physical' | 'cognitive' | 'emotional' | 'social';
  phoenixPoints: number;
}

const ChallengeTracker = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalPhoenixPoints, setTotalPhoenixPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    difficulty: 3 as 1 | 2 | 3 | 4 | 5,
    category: 'physical' as 'physical' | 'cognitive' | 'emotional' | 'social'
  });
  
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedChallenges = localStorage.getItem('phoenixChallenges');
    const savedPoints = localStorage.getItem('phoenixPoints');
    const savedStreak = localStorage.getItem('phoenixStreak');
    const savedBadges = localStorage.getItem('phoenixBadges');
    
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
    if (savedPoints) setTotalPhoenixPoints(parseInt(savedPoints));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('phoenixChallenges', JSON.stringify(challenges));
    localStorage.setItem('phoenixPoints', totalPhoenixPoints.toString());
    localStorage.setItem('phoenixStreak', streak.toString());
    localStorage.setItem('phoenixBadges', JSON.stringify(badges));
  }, [challenges, totalPhoenixPoints, streak, badges]);

  const addChallenge = () => {
    if (!newChallenge.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a challenge title",
        variant: "destructive",
      });
      return;
    }

    const phoenixPoints = newChallenge.difficulty * 10;
    const challenge: Challenge = {
      id: Date.now().toString(),
      title: newChallenge.title,
      description: newChallenge.description,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      difficulty: newChallenge.difficulty,
      category: newChallenge.category,
      phoenixPoints
    };

    setChallenges(prev => [challenge, ...prev]);
    setNewChallenge({ title: '', description: '', difficulty: 3, category: 'physical' });
    setShowForm(false);
    
    toast({
      title: "Phoenix Challenge Added! 🔥",
      description: `Your new challenge is worth ${phoenixPoints} phoenix points when completed.`,
    });
  };

  const toggleComplete = (id: string) => {
    setChallenges(prev => {
      const updated = prev.map(challenge => {
        if (challenge.id === id) {
          const wasCompleted = challenge.completed;
          const newCompleted = !challenge.completed;
          
          // Update phoenix points
          if (newCompleted && !wasCompleted) {
            setTotalPhoenixPoints(current => current + challenge.phoenixPoints);
            checkForNewBadges(totalPhoenixPoints + challenge.phoenixPoints, challenges.filter(c => c.completed).length + 1);
          } else if (!newCompleted && wasCompleted) {
            setTotalPhoenixPoints(current => current - challenge.phoenixPoints);
          }
          
          return { ...challenge, completed: newCompleted };
        }
        return challenge;
      });
      
      // Update streak
      updateStreak(updated);
      return updated;
    });
  };

  const checkForNewBadges = (points: number, completedCount: number) => {
    const newBadges: string[] = [];
    
    if (points >= 100 && !badges.includes('first-flame')) newBadges.push('first-flame');
    if (points >= 500 && !badges.includes('rising-phoenix')) newBadges.push('rising-phoenix');
    if (points >= 1000 && !badges.includes('phoenix-master')) newBadges.push('phoenix-master');
    if (completedCount >= 10 && !badges.includes('persistent-spirit')) newBadges.push('persistent-spirit');
    if (completedCount >= 50 && !badges.includes('unstoppable-force')) newBadges.push('unstoppable-force');
    
    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
      toast({
        title: "New Phoenix Badge Earned! 🏆",
        description: `You've unlocked: ${newBadges.map(b => getBadgeName(b)).join(', ')}`,
      });
    }
  };

  const updateStreak = (challengeList: Challenge[]) => {
    // Calculate current streak based on consecutive days with completed challenges
    const today = new Date().toISOString().split('T')[0];
    let currentStreak = 0;
    let checkDate = new Date();
    
    while (currentStreak < 365) { // Max 365 day check
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompletedChallenge = challengeList.some(c => 
        c.date === dateStr && c.completed
      );
      
      if (hasCompletedChallenge) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const getBadgeName = (badgeId: string) => {
    const badgeNames = {
      'first-flame': 'First Flame (100 pts)',
      'rising-phoenix': 'Rising Phoenix (500 pts)',
      'phoenix-master': 'Phoenix Master (1000 pts)',
      'persistent-spirit': 'Persistent Spirit (10 challenges)',
      'unstoppable-force': 'Unstoppable Force (50 challenges)'
    };
    return badgeNames[badgeId as keyof typeof badgeNames] || badgeId;
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-blue-500', 
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Zap className="h-4 w-4" />;
      case 'cognitive': return <Brain className="h-4 w-4" />;
      case 'emotional': return <Heart className="h-4 w-4" />;
      case 'social': return <Award className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'bg-green-500/20 text-green-300';
      case 'cognitive': return 'bg-blue-500/20 text-blue-300';
      case 'emotional': return 'bg-pink-500/20 text-pink-300';
      case 'social': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const completedToday = challenges.filter(c => 
    c.completed && c.date === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12 animate-fade-in">
            <div className="relative mb-6 mx-auto w-24 h-24">
              <div 
                className="w-full h-full rounded-full border-2 border-primary/40 shadow-xl animate-glow-pulse phoenix-image"
                style={{
                  backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Phoenix Challenge Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Build resilience through daily challenges • Rise stronger with each step
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              {totalPhoenixPoints} Phoenix Points 🔥 • {streak} Day Streak
            </div>
          </header>

          <Tabs defaultValue="challenges" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-8 animate-fade-in">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{completedToday}</div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{challenges.filter(c => c.completed).length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{totalPhoenixPoints}</div>
                    <div className="text-sm text-muted-foreground">Phoenix Points</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </CardContent>
                </Card>
              </div>

          {/* Add Challenge Button */}
          <div className="mb-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Challenge
            </Button>
          </div>

          {/* Add Challenge Form */}
          {showForm && (
            <Card className="mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle>New Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Have a phone conversation"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about this challenge..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Challenge Category</Label>
                    <select 
                      id="category"
                      value={newChallenge.category}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, category: e.target.value as 'physical' | 'cognitive' | 'emotional' | 'social' }))}
                      className="w-full p-2 border border-input bg-background rounded-md"
                    >
                      <option value="physical">🏃‍♂️ Physical</option>
                      <option value="cognitive">🧠 Cognitive</option>
                      <option value="emotional">❤️ Emotional</option>
                      <option value="social">👥 Social</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <select 
                      id="difficulty"
                      value={newChallenge.difficulty}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, difficulty: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
                      className="w-full p-2 border border-input bg-background rounded-md"
                    >
                      <option value={1}>1 - Very Easy (10 pts)</option>
                      <option value={2}>2 - Easy (20 pts)</option>
                      <option value={3}>3 - Moderate (30 pts)</option>
                      <option value={4}>4 - Hard (40 pts)</option>
                      <option value={5}>5 - Very Hard (50 pts)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addChallenge}>Add Challenge</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Challenges List */}
          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <Card 
                key={challenge.id} 
                className={`transition-all duration-200 animate-fade-in ${challenge.completed ? 'bg-muted/50' : ''}`}
                style={{animationDelay: `${300 + index * 50}ms`}}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComplete(challenge.id)}
                      className={`mt-1 ${challenge.completed ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold ${challenge.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {challenge.title}
                        </h3>
                        <Badge className={getCategoryColor(challenge.category)}>
                          {getCategoryIcon(challenge.category)}
                          <span className="ml-1 capitalize">{challenge.category}</span>
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(challenge.difficulty)}`} />
                      </div>
                      
                      {challenge.description && (
                        <p className="text-muted-foreground text-sm mb-2">
                          {challenge.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(challenge.date).toLocaleDateString()} • Difficulty: {challenge.difficulty}/5</span>
                        <span className="font-medium text-primary">{challenge.phoenixPoints} pts 🔥</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

              {challenges.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🔥</div>
                    <p className="text-muted-foreground">
                      No challenges yet. Add your first challenge to start your phoenix journey!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Phoenix Points Progress</span>
                        <span>{totalPhoenixPoints} / 1000</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalPhoenixPoints / 1000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(['physical', 'cognitive', 'emotional', 'social'] as const).map(category => {
                        const categoryCount = challenges.filter(c => c.category === category && c.completed).length;
                        return (
                          <div key={category} className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
                            <div className="font-bold text-lg">{categoryCount}</div>
                            <div className="text-xs text-muted-foreground capitalize">{category}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Phoenix Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map(badge => (
                      <div key={badge} className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <div className="font-semibold text-orange-300">{getBadgeName(badge)}</div>
                          <div className="text-xs text-muted-foreground">Badge earned!</div>
                        </div>
                      </div>
                    ))}
                    
                    {badges.length === 0 && (
                      <div className="text-center py-8 col-span-2">
                        <div className="text-4xl mb-4">🏆</div>
                        <p className="text-muted-foreground">Complete challenges to earn phoenix badges!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ChallengeTracker;