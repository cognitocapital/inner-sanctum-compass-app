import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Chapter5 = () => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <Button asChild variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Table of Contents
          </Link>
        </Button>
      </div>

      {/* Phoenix image for chapter header */}
      <div className="text-center mb-8">
        <div className="relative mx-auto w-20 h-20 group">
          <div 
            className="w-full h-full rounded-full border-2 border-primary/30 shadow-lg animate-glow-pulse hover:scale-105 transition-all duration-300 phoenix-image"
            style={{
              backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 rounded-full bg-flame-gradient opacity-20 animate-flame-flicker"></div>
        </div>
      </div>

      <article className="prose prose-invert prose-lg mx-auto text-foreground">
        <h1 className="text-4xl font-serif font-bold text-center text-flame-gradient mb-2">
          Chapter 5
        </h1>
        <h2 className="text-2xl font-serif font-bold text-center text-muted-foreground mt-0 mb-12">
          Finding My Phoenix
        </h2>

        <p className="text-sm text-center text-muted-foreground/80 italic mb-8">
          May 2024
        </p>

        <p>
          Three months into recovery, I discovered something unexpected—I was not just healing, I was transforming. The person emerging from this experience wasn't just the pre-accident me with a fixed brain. I was becoming someone new, someone who had been through fire and was being reborn from the ashes.
        </p>

        <p>
          The phoenix metaphor started as a joke. Sarah bought me a small phoenix figurine from a gift shop, saying it reminded her of my journey. But as I looked at that mythical bird, wings spread wide, rising from flames, something clicked. This wasn't just about getting back to who I was—it was about discovering who I could become.
        </p>

        <p>
          My relationship with challenges began to shift. The daily cognitive exercises weren't just rehabilitation anymore; they were training. The breathing techniques weren't just anxiety management; they were meditation practices that connected me to something deeper. The cold showers weren't just inflammation therapy; they were daily rituals of courage.
        </p>

        <p>
          One morning, I walked into the garage and looked at my skateboard for the first time since the accident without feeling anger or sadness. Instead, I felt... gratitude. Not for the accident—that would be absurd—but for the journey it had forced me to take. For the depths it had shown me, and for the heights I was now discovering were possible.
        </p>

        <p>
          Recovery wasn't about returning to normal. It was about discovering that normal had been too small for me all along. I was a phoenix, and phoenixes don't return to their old nests. They build new ones, higher and stronger than before.
        </p>

        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link to="/chapter-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Chapter
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <ArrowRight className="mr-2 h-4 w-4" />
              More chapters coming soon...
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default Chapter5;