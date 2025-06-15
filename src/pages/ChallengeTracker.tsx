import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const ChallengeTracker = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Morning walk outside',
      description: 'Took a 15-minute walk around the block despite feeling overwhelmed',
      date: '2024-01-26',
      completed: true,
      difficulty: 3
    },
    {
      id: '2', 
      title: 'Social interaction',
      description: 'Had coffee with a friend for 30 minutes',
      date: '2024-01-27',
      completed: true,
      difficulty: 4
    }
  ]);
  
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    difficulty: 3 as 1 | 2 | 3 | 4 | 5
  });
  
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const addChallenge = () => {
    if (!newChallenge.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a challenge title",
        variant: "destructive",
      });
      return;
    }

    const challenge: Challenge = {
      id: Date.now().toString(),
      title: newChallenge.title,
      description: newChallenge.description,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      difficulty: newChallenge.difficulty
    };

    setChallenges(prev => [challenge, ...prev]);
    setNewChallenge({ title: '', description: '', difficulty: 3 });
    setShowForm(false);
    
    toast({
      title: "Challenge Added!",
      description: "Your new challenge has been added to the tracker.",
    });
  };

  const toggleComplete = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
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
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Challenge Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Track daily challenges and exposure activities that push your comfort zone
            </p>
          </header>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{animationDelay: '100ms'}}>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{completedToday}</div>
                <div className="text-sm text-muted-foreground">Completed Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{challenges.filter(c => c.completed).length}</div>
                <div className="text-sm text-muted-foreground">Total Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {challenges.length > 0 ? Math.round((challenges.filter(c => c.completed).length / challenges.length) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
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
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select 
                    id="difficulty"
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, difficulty: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
                    className="w-full p-2 border border-input bg-background rounded-md"
                  >
                    <option value={1}>1 - Very Easy</option>
                    <option value={2}>2 - Easy</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - Hard</option>
                    <option value={5}>5 - Very Hard</option>
                  </select>
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
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(challenge.difficulty)}`} />
                      </div>
                      
                      {challenge.description && (
                        <p className="text-muted-foreground text-sm mb-2">
                          {challenge.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(challenge.date).toLocaleDateString()} • Difficulty: {challenge.difficulty}/5
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
                <p className="text-muted-foreground">
                  No challenges yet. Add your first challenge to start tracking your progress!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeTracker;