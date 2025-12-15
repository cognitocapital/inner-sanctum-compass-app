import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, Mic, MicOff, Heart, Sparkles, 
  ArrowLeft, Circle, User 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  liked?: boolean;
}

interface PeerChatProps {
  peerName: string;
  peerInjuryType?: string;
  onBack: () => void;
}

// Manuscript quanta prompts for conversation starters
const QUANTA_PROMPTS = [
  "What's one small victory you celebrated this week?",
  "How has your support network helped you lately?",
  "What recovery tool has surprised you most?",
  "What would you tell someone just starting their journey?",
  "How do you practice self-compassion on hard days?",
];

export const PeerChat = ({ peerName, peerInjuryType, onBack }: PeerChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: peerName,
      content: `Hi! I'm ${peerName}. Looking forward to connecting on our recovery journeys. 💫`,
      timestamp: new Date(Date.now() - 60000),
      isOwn: false
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate peer response after delay (for demo)
    setTimeout(() => {
      const responses = [
        "That resonates with me so much. Thank you for sharing.",
        "I've had similar experiences. It's comforting to know we're not alone.",
        "That's such a powerful insight. How did you come to that realization?",
        "I'm sending you strength. We're in this together. 🔥",
      ];
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: peerName,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000 + Math.random() * 2000);
  };

  const likeMessage = (id: string) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, liked: !m.liked } : m
    ));
  };

  const usePrompt = (prompt: string) => {
    setNewMessage(prompt);
    setShowPrompts(false);
  };

  return (
    <Card className="h-[600px] flex flex-col backdrop-blur-md bg-card/95 border-primary/20">
      {/* Header */}
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <CardTitle className="text-lg">{peerName}</CardTitle>
              {peerInjuryType && (
                <Badge variant="outline" className="text-xs">
                  {peerInjuryType}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPrompts(!showPrompts)}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>

        {/* Conversation prompts */}
        <AnimatePresence>
          {showPrompts && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <p className="text-xs text-muted-foreground mb-2">
                Conversation starters (from manuscript quanta):
              </p>
              <div className="flex flex-wrap gap-2">
                {QUANTA_PROMPTS.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => usePrompt(prompt)}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {prompt.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  message.isOwn ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 relative group",
                    message.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <span className={cn(
                      "text-xs",
                      message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {!message.isOwn && (
                      <button
                        onClick={() => likeMessage(message.id)}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 transition-opacity",
                          message.liked && "opacity-100"
                        )}
                      >
                        <Heart 
                          className={cn(
                            "w-3 h-3",
                            message.liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          )} 
                        />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={cn(isVoiceEnabled && "text-primary")}
          >
            {isVoiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          <Input
            placeholder="Share your thoughts..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          All conversations are private and supportive
        </p>
      </div>
    </Card>
  );
};

export default PeerChat;
