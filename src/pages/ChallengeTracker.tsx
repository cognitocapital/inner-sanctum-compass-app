import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, CheckCircle, Award, BarChart3, Brain, Heart, Zap, Dumbbell, Activity } from "lucide-react";
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
  const [showDumbbellTemplates, setShowDumbbellTemplates] = useState(false);
  const [showBodyweightTemplates, setShowBodyweightTemplates] = useState(false);
  const { toast } = useToast();

  // Enhanced dumbbell workout templates
  const dumbbellWorkouts = [
    // Upper Body
    { title: "Dumbbell Chest Press", description: "3 sets of 8-12 reps. Lie flat, press dumbbells up from chest level. Targets chest, shoulders, triceps.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Dumbbell Flyes", description: "3 sets of 10-15 reps. Wide arc motion to isolate chest muscles. Control the weight on both up and down phases.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Dumbbell Shoulder Press", description: "3 sets of 8-12 reps. Press dumbbells overhead from shoulder height. Keep core engaged throughout.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Lateral Raises", description: "3 sets of 12-15 reps. Lift dumbbells to shoulder height with arms slightly bent. Targets side deltoids.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Dumbbell Rows", description: "3 sets of 8-12 reps. Pull dumbbells to your ribs, squeeze shoulder blades. Targets back and biceps.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Bicep Curls", description: "3 sets of 10-15 reps. Controlled curling motion, don't swing. Focus on the squeeze at the top.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Tricep Extensions", description: "3 sets of 10-15 reps. Overhead or lying position. Keep elbows stationary, extend forearms only.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    
    // Lower Body
    { title: "Dumbbell Squats", description: "3 sets of 12-15 reps. Hold dumbbells at shoulders or sides. Go down until thighs parallel to floor.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Dumbbell Lunges", description: "3 sets of 10 per leg. Step forward into lunge, keep front knee over ankle. Great for balance and strength.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Romanian Deadlifts", description: "3 sets of 10-12 reps. Hinge at hips, keep dumbbells close to legs. Targets hamstrings and glutes.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Goblet Squats", description: "3 sets of 12-15 reps. Hold one dumbbell at chest level. Perfect for squat form and depth.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Calf Raises", description: "3 sets of 15-20 reps. Hold dumbbells, rise up on toes. Pause at top for maximum contraction.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    
    // Full Body Compound
    { title: "Dumbbell Thrusters", description: "3 sets of 8-10 reps. Squat to overhead press in one fluid motion. Ultimate full-body exercise.", difficulty: 5 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    { title: "Dumbbell Burpees", description: "3 sets of 5-8 reps. Burpee with dumbbell chest press at top. High intensity, full-body movement.", difficulty: 5 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    { title: "Dumbbell Clean & Press", description: "3 sets of 6-8 reps. Floor to overhead in one motion. Power, coordination, and strength combined.", difficulty: 5 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    { title: "Dumbbell Renegade Rows", description: "3 sets of 6-8 per arm. Plank position, row each arm alternately. Core stability and back strength.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    
    // Complete Workouts
    { title: "Upper Body Dumbbell Circuit", description: "Complete upper body workout: chest press, rows, shoulder press, curls, tricep extensions. 45-60 minutes.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Complete Workout" },
    { title: "Lower Body Dumbbell Circuit", description: "Complete lower body workout: squats, lunges, deadlifts, calf raises. 45-60 minutes.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Complete Workout" },
    { title: "Full Body Dumbbell Workout", description: "Complete full-body session with compound movements. Warm-up, workout, cool-down. 60-75 minutes.", difficulty: 5 as const, category: 'physical' as const, muscleGroup: "Complete Workout" }
  ];

  // Bodyweight workout templates
  const bodyweightWorkouts = [
    // Upper Body
    { title: "Push-ups", description: "3 sets of 8-15 reps. Classic chest, shoulder, and tricep builder. Modify on knees if needed.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Diamond Push-ups", description: "3 sets of 5-10 reps. Hands form diamond shape. Advanced tricep and chest variation.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Pike Push-ups", description: "3 sets of 8-12 reps. Downward dog position, press up. Targets shoulders and upper chest.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    { title: "Tricep Dips", description: "3 sets of 8-15 reps. Use chair or bench. Lower body until 90-degree angle, push back up.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Upper Body" },
    
    // Core
    { title: "Plank Hold", description: "3 sets of 30-60 seconds. Maintain straight line from head to heels. Core stability foundation.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Core" },
    { title: "Mountain Climbers", description: "3 sets of 20-30 reps. Plank position, alternate bringing knees to chest. Cardio and core combined.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Core" },
    { title: "Russian Twists", description: "3 sets of 20-30 reps. Seated, lean back, twist side to side. Can add weight or keep bodyweight.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Core" },
    { title: "Bicycle Crunches", description: "3 sets of 20-30 reps. Alternate elbow to opposite knee. Targets entire core region.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Core" },
    { title: "Dead Bug", description: "3 sets of 10 per side. Lie on back, extend opposite arm and leg. Excellent for core stability.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Core" },
    
    // Lower Body
    { title: "Bodyweight Squats", description: "3 sets of 15-25 reps. Fundamental lower body movement. Focus on depth and form.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Jump Squats", description: "3 sets of 10-15 reps. Explosive squat with jump. High intensity, power development.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Lunges", description: "3 sets of 10-15 per leg. Step forward or backward. Unilateral strength and balance.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Single-Leg Glute Bridges", description: "3 sets of 10-15 per leg. Lie on back, lift hips with one leg. Glute activation and stability.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Wall Sits", description: "3 sets of 30-60 seconds. Back against wall, slide down to 90 degrees. Isometric quad strength.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    { title: "Calf Raises", description: "3 sets of 15-25 reps. Rise up on toes, slow controlled descent. Can do single-leg for more challenge.", difficulty: 1 as const, category: 'physical' as const, muscleGroup: "Lower Body" },
    
    // Full Body/Cardio
    { title: "Burpees", description: "3 sets of 5-10 reps. Squat, plank, push-up, jump. Ultimate full-body cardio exercise.", difficulty: 5 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    { title: "Bear Crawl", description: "3 sets of 30-60 seconds. Crawl forward/backward on hands and feet. Full-body coordination.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    { title: "High Knees", description: "3 sets of 30-60 seconds. Run in place, bring knees to chest level. Cardio and leg strength.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    { title: "Jumping Jacks", description: "3 sets of 20-30 reps. Classic cardio movement. Great for warm-up or cardio intervals.", difficulty: 1 as const, category: 'physical' as const, muscleGroup: "Full Body" },
    
    // Complete Workouts
    { title: "Bodyweight HIIT Circuit", description: "20-minute high-intensity circuit: burpees, mountain climbers, jump squats, push-ups. 4 rounds.", difficulty: 5 as const, category: 'physical' as const, muscleGroup: "Complete Workout" },
    { title: "Core Focused Workout", description: "25-minute core session: planks, mountain climbers, Russian twists, bicycle crunches, dead bugs.", difficulty: 3 as const, category: 'physical' as const, muscleGroup: "Complete Workout" },
    { title: "Bodyweight Strength Circuit", description: "35-minute strength circuit covering all major muscle groups. No equipment needed.", difficulty: 4 as const, category: 'physical' as const, muscleGroup: "Complete Workout" },
    { title: "Beginner Bodyweight Routine", description: "20-minute beginner-friendly routine: squats, push-ups, lunges, plank. Perfect for starting out.", difficulty: 2 as const, category: 'physical' as const, muscleGroup: "Complete Workout" }
  ];

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

  const addTemplateChallenge = (template: typeof dumbbellWorkouts[0] | typeof bodyweightWorkouts[0]) => {
    const phoenixPoints = template.difficulty * 10;
    const challenge: Challenge = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      difficulty: template.difficulty,
      category: template.category,
      phoenixPoints
    };

    setChallenges(prev => [challenge, ...prev]);
    
    toast({
      title: "Workout Challenge Added! 💪",
      description: `${template.title} added (${phoenixPoints} phoenix points)`,
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

  const getMuscleGroupColor = (muscleGroup: string) => {
    switch (muscleGroup) {
      case 'Upper Body': return 'bg-blue-500/10 text-blue-600';
      case 'Lower Body': return 'bg-green-500/10 text-green-600';
      case 'Core': return 'bg-purple-500/10 text-purple-600';
      case 'Full Body': return 'bg-red-500/10 text-red-600';
      case 'Complete Workout': return 'bg-orange-500/10 text-orange-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const completedToday = challenges.filter(c => 
    c.completed && c.date === new Date().toISOString().split('T')[0]
  ).length;

  const renderWorkoutTemplates = (workouts: any[], title: string, icon: React.ReactNode, description: string) => (
    <Card className="mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title}
          <Badge variant="secondary" className="text-xs">
            {workouts.length} exercises
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Group by muscle group */}
          {['Upper Body', 'Lower Body', 'Core', 'Full Body', 'Complete Workout'].map(group => {
            const groupWorkouts = workouts.filter(w => w.muscleGroup === group);
            if (groupWorkouts.length === 0) return null;
            
            return (
              <div key={group} className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  {group}
                  <Badge className={getMuscleGroupColor(group)} variant="secondary">
                    {groupWorkouts.length} exercises
                  </Badge>
                </h4>
                <div className="grid gap-3">
                  {groupWorkouts.map((workout, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-sm">{workout.title}</h5>
                          <div className={`w-2 h-2 rounded-full ${getDifficultyColor(workout.difficulty)}`} />
                          <span className="text-xs text-muted-foreground">
                            {workout.difficulty * 10} pts
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{workout.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTemplateChallenge(workout)}
                        className="ml-4 shrink-0"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" onClick={() => {
            setShowDumbbellTemplates(false);
            setShowBodyweightTemplates(false);
          }}>
            Close Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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

              {/* Add Challenge Buttons */}
              <div className="mb-8 animate-fade-in flex gap-4 flex-wrap" style={{animationDelay: '200ms'}}>
                <Button 
                  onClick={() => setShowForm(!showForm)}
                  className="flex-1 md:flex-none"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Challenge
                </Button>
                <Button 
                  onClick={() => setShowDumbbellTemplates(!showDumbbellTemplates)}
                  variant="outline"
                  className="flex-1 md:flex-none"
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Dumbbell Workouts
                </Button>
                <Button 
                  onClick={() => setShowBodyweightTemplates(!showBodyweightTemplates)}
                  variant="outline"
                  className="flex-1 md:flex-none"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Bodyweight Workouts
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

              {/* Dumbbell Workout Templates */}
              {showDumbbellTemplates && renderWorkoutTemplates(
                dumbbellWorkouts,
                "Professional Dumbbell Workouts",
                <Dumbbell className="h-5 w-5" />,
                "Comprehensive dumbbell exercises organized by muscle group. Start with 2-4kg weights and progress as you get stronger. Each exercise includes proper form cues and rep ranges."
              )}

              {/* Bodyweight Workout Templates */}
              {showBodyweightTemplates && renderWorkoutTemplates(
                bodyweightWorkouts,
                "Bodyweight Training Programs",
                <Activity className="h-5 w-5" />,
                "No equipment needed! Professional bodyweight exercises for all fitness levels. Perfect for home workouts, travel, or when you want to focus on functional movement patterns."
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
