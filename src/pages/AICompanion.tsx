import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Send, Flame, Loader2, Mic, MicOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const COMPANION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/phoenix-companion`;

const AICompanion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast({ title: "Microphone blocked", description: "Please allow microphone access in your browser settings.", variant: "destructive" });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [toast]);

  // Load conversation history
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("ai_companion_logs")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(40);
      if (data && data.length > 0) {
        setMessages(data.map((d: any) => ({ role: d.role as "user" | "assistant", content: d.content })));
      }
      setHistoryLoaded(true);
    };
    load();
  }, [user]);

  // Auto-send context message
  useEffect(() => {
    if (!historyLoaded) return;
    const ctx = searchParams.get("context");
    if (ctx && messages.length === 0) {
      setInput(ctx);
      // Auto-send after a beat
      setTimeout(() => sendMessage(ctx), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLoaded]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({ title: "Not supported", description: "Voice input isn't available in this browser. Try Chrome or Safari.", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = overrideText || input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const resp = await fetch(COMPANION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        if (resp.status === 429) {
          toast({ title: "Slow down", description: "Too many requests — try again in a moment.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Credits needed", description: "AI credits exhausted. Please add credits.", variant: "destructive" });
        } else {
          toast({ title: "Error", description: errBody.error || "Something went wrong.", variant: "destructive" });
        }
        setIsLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              const snapshot = assistantSoFar;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: snapshot } : m));
                }
                return [...prev, { role: "assistant", content: snapshot }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Companion error:", e);
      toast({ title: "Connection error", description: "Couldn't reach Phoenix. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-white/[0.04]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="text-white/50 hover:text-white">
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-serif text-white/60">Phoenix Companion</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-white/50 hover:text-white">
            <Link to="/"><Home className="w-4 h-4" /></Link>
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-lg mx-auto w-full">
        {messages.length === 0 && historyLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
              <Flame className="w-8 h-8 text-orange-400" style={{ filter: "drop-shadow(0 0 8px hsl(25, 90%, 55%))" }} />
            </div>
            <h2 className="text-xl font-serif text-white">Hey, I'm Phoenix</h2>
            <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
              Built from Michael's lived experience. I'm here to walk beside you — not ahead of you. Ask me anything about your recovery journey.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["How am I doing this week?", "I'm having a fog day", "What should I try today?"].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full px-3 py-1.5 text-white/50 hover:text-white/80 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-orange-500/20 text-white/90 rounded-br-md"
                  : "bg-white/[0.04] text-white/80 border border-white/[0.06] rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-gray-950/95 backdrop-blur-md border-t border-white/[0.04] p-4">
        <div className="max-w-lg mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Talk to Phoenix…"
            rows={1}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-[15px] resize-none focus:outline-none focus:border-orange-500/30 min-h-[48px] max-h-[120px]"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/20 min-h-[48px] px-4 disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          Not medical advice — a companion built from lived experience. Beta prototype.
        </p>
      </div>
    </div>
  );
};

export default AICompanion;
