import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PenTool, Heart, Share2, BookOpen, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStory {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  category: string;
}

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
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All Stories" },
    { value: "recovery", label: "Recovery Journey" },
    { value: "hope", label: "Finding Hope" },
    { value: "strength", label: "Inner Strength" },
    { value: "breakthrough", label: "Breakthrough Moments" },
    { value: "community", label: "Community Support" }
  ];

  // Load stories from localStorage
  useEffect(() => {
    const savedStories = localStorage.getItem('unwrittenChapters');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    } else {
      // Add some example stories to get started
      const exampleStories: UserStory[] = [
        {
          id: "1",
          title: "Finding My Voice Again",
          author: "Alex M.",
          content: "After my accident, I thought I'd lost the ability to express myself clearly. Writing became my therapy, my way back to who I was and who I'm becoming. Each word is a step forward in my recovery journey.",
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          likes: 12,
          category: "recovery"
        },
        {
          id: "2",
          title: "The Day Everything Changed",
          author: "Sarah K.",
          content: "It wasn't the moment of impact that defined me, but the moment I decided to fight back. This is my story of reclaiming my life, one small victory at a time.",
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          likes: 8,
          category: "strength"
        }
      ];
      setStories(exampleStories);
      localStorage.setItem('unwrittenChapters', JSON.stringify(exampleStories));
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
        description: "Both title and content are required to share your chapter.",
        variant: "destructive"
      });
      return;
    }

    const story: UserStory = {
      id: Date.now().toString(),
      title: newStory.title,
      author: newStory.author || "Anonymous",
      content: newStory.content,
      date: new Date().toISOString(),
      likes: 0,
      category: newStory.category
    };

    setStories([story, ...stories]);
    setNewStory({ title: "", author: "", content: "", category: "recovery" });
    setIsWriting(false);

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

    toast({
      title: "💝 Story appreciated",
      description: "Your support means everything to fellow travelers."
    });
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

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-10 w-1.5 h-1.5 bg-primary rounded-full animate-flame-flicker opacity-50"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-primary rounded-full animate-flame-flicker opacity-40" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground transition-colors">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Header */}
        <header className="text-center mb-12 animate-phoenix-rise">
          <div className="relative mb-6 group mx-auto w-20 h-20">
            <div className="w-full h-full rounded-full bg-flame-gradient flex items-center justify-center shadow-xl animate-glow-pulse hover:scale-110 transition-all duration-500">
              <PenTool className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-flame-gradient opacity-25 animate-flame-flicker"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-flame-gradient mb-4 drop-shadow-lg">
            Unwritten Chapters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Your journey continues beyond these pages. Share your story, inspire others, and find strength in our community of resilient souls.
          </p>
          
          {!isWriting && (
            <Button 
              onClick={() => setIsWriting(true)}
              size="lg"
              className="bg-flame-gradient hover:bg-ember-gradient text-white"
            >
              <PenTool className="mr-2 h-5 w-5" />
              Write Your Chapter
            </Button>
          )}
        </header>

        {/* Writing Section */}
        {isWriting && (
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-primary" />
                Share Your Story
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your words have power. Share your journey to inspire and connect with others walking similar paths.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Chapter title..."
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                />
                <Input
                  placeholder="Your name (optional)"
                  value={newStory.author}
                  onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                />
              </div>
              
              <select
                value={newStory.category}
                onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                className="w-full p-2 rounded-md border border-input bg-background"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <Textarea
                placeholder="Write your story here... Share your experiences, insights, struggles, victories, or words of encouragement. Every story matters."
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                className="min-h-[200px] resize-none"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newStory.content.length} characters
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWriting(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitStory}
                    className="bg-flame-gradient hover:bg-ember-gradient text-white"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Chapter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "bg-flame-gradient text-white" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center bg-gradient-to-br from-card to-primary/5">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-flame-gradient">{stories.length}</div>
              <p className="text-sm text-muted-foreground">Shared Stories</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-card to-primary/5">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-flame-gradient">
                {stories.reduce((sum, story) => sum + story.likes, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Community Support</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-card to-primary/5">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-flame-gradient">∞</div>
              <p className="text-sm text-muted-foreground">Stories of Hope</p>
            </CardContent>
          </Card>
        </div>

        {/* Stories Grid */}
        <div className="space-y-6">
          {filteredStories.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No stories yet in this category</h3>
                <p className="text-muted-foreground">Be the first to share your chapter!</p>
              </CardContent>
            </Card>
          ) : (
            filteredStories.map((story, index) => (
              <Card 
                key={story.id} 
                className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-primary/10 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      Inspiring others
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Encouragement Footer */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-3">Your Story Matters</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every journey through recovery is unique and valuable. By sharing your experience, you're not just healing yourself—you're lighting the way for others who need to know they're not alone. Your courage to put pen to paper could be exactly what someone else needs to hear today.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnwrittenChapters;