import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Heart, PenTool, Sparkles, Send, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EvidenceBadge from "@/components/clinical/EvidenceBadge";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

const UnwrittenChapters = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newStory, setNewStory] = useState({ author: "", content: "" });
  const [totalLikes, setTotalLikes] = useState(0);
  
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const savedStories = localStorage.getItem('phoenixCircleStories');
    
    if (savedStories) {
      const parsed = JSON.parse(savedStories);
      setStories(parsed);
      setTotalLikes(parsed.reduce((sum: number, s: Story) => sum + s.likes, 0));
    } else {
      // Sample stories
      const sampleStories: Story[] = [
        {
          id: "1",
          author: "PhoenixRising",
          content: "After my accident, I thought I'd lost the ability to express myself clearly. Writing became my therapy, my way back to who I was and who I'm becoming.",
          date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
          likes: 12,
        },
        {
          id: "2",
          author: "HealingWarrior",
          content: "It wasn't the moment of impact that defined me, but the moment I decided to fight back. This is my story of reclaiming my life.",
          date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
          likes: 8,
        },
      ];
      setStories(sampleStories);
      setTotalLikes(20);
    }
  }, []);

  // Save stories
  useEffect(() => {
    localStorage.setItem('phoenixCircleStories', JSON.stringify(stories));
  }, [stories]);

  const submitStory = () => {
    if (!newStory.content.trim()) return;
    
    const story: Story = {
      id: Date.now().toString(),
      author: newStory.author.trim() || "Anonymous Phoenix",
      content: newStory.content,
      date: new Date().toLocaleDateString(),
      likes: 0,
    };
    
    setStories(prev => [story, ...prev]);
    setNewStory({ author: "", content: "" });
    setIsWriting(false);
    toast({ title: "Story shared! 📖", description: "Thank you for inspiring others." });
  };

  const likeStory = (storyId: string) => {
    setStories(prev => prev.map(s => 
      s.id === storyId ? { ...s, likes: s.likes + 1 } : s
    ));
    setTotalLikes(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-teal-950/30 to-slate-900 text-white relative overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-500/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-teal-400" />
              <h1 className="text-xl font-bold text-teal-100">Phoenix Circle</h1>
            </div>
            <EvidenceBadge level="A" domain="Peer Support" pubmedId="36594858" />
          </div>
          <div className="w-10" />
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">{stories.length}</div>
            <div className="text-teal-300/60">Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{totalLikes}</div>
            <div className="text-pink-300/60">Support</div>
          </div>
        </div>

        {/* Write button or form */}
        <AnimatePresence mode="wait">
          {isWriting ? (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="bg-slate-900/80 border-teal-500/30">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-teal-300">
                    <PenTool className="w-5 h-5" />
                    <span className="font-medium">Share Your Chapter</span>
                  </div>
                  
                  <Input
                    placeholder="Your name (or stay anonymous)"
                    value={newStory.author}
                    onChange={(e) => setNewStory(prev => ({ ...prev, author: e.target.value }))}
                    className="bg-slate-800/50 border-teal-500/20 text-white"
                  />
                  
                  <Textarea
                    placeholder="Share a moment from your journey..."
                    value={newStory.content}
                    onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[120px] bg-slate-800/50 border-teal-500/20 text-white"
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={submitStory}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
                      disabled={!newStory.content.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                    <Button
                      variant="outline"
                      className="border-teal-500/30 text-teal-300"
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
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Write Your Chapter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stories feed */}
        <div className="space-y-4">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/60 border-teal-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-teal-100 font-medium">{story.author}</p>
                      <p className="text-teal-300/50 text-xs">{story.date}</p>
                    </div>
                  </div>
                  
                  <p className="text-teal-100/90 text-sm mb-4">{story.content}</p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                    onClick={() => likeStory(story.id)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {story.likes}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quanta */}
        <div className="text-center mt-8">
          <p className="text-teal-200/60 italic text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            "Community carries us forward..."
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnwrittenChapters;
