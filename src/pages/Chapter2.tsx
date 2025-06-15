import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Chapter2 = () => {
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
          Chapter 2
        </h1>
        <h2 className="text-2xl font-serif font-bold text-center text-muted-foreground mt-0 mb-12">
          The Hospital Stay
        </h2>

        <p className="text-sm text-center text-muted-foreground/80 italic mb-8">
          January 26 - February 2, 2024
        </p>

        <p>
          The next few days exist in a haze of sterile hospital corridors, the constant beeping of machines, and the worried faces of family members. The medical team was thorough but cautious—traumatic brain injuries are unpredictable beasts, and no two cases are exactly alike.
        </p>

        <p>
          Sarah barely left my side. I could see the fear in her eyes, though she tried to hide it behind forced smiles and optimistic updates about my progress. The doctors spoke in careful, measured tones about swelling, monitoring, and "wait and see" approaches that did nothing to ease anyone's anxiety.
        </p>

        <p>
          The hardest part wasn't the physical pain—though the headaches were brutal—it was the fog that had settled over my mind. Simple tasks that I'd done thousands of times before suddenly felt impossible. Remembering names, following conversations, even basic problem-solving seemed beyond my reach.
        </p>

        <p>
          It was during one of these foggy moments that I first understood the true impact of what had happened. A neurologist explained that my brain was essentially bruised, and like any bruise, it would take time to heal. But unlike a bruised arm or leg, this injury affected everything—my thoughts, my emotions, my very sense of self.
        </p>

        <p>
          The skateboard accident that caused all this seemed so random, so preventable. One moment of distraction, one patch of uneven pavement, and everything changed. The irony wasn't lost on me—the very activity that had always been my escape, my way of staying active and free, had become the source of my greatest challenge.
        </p>

        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link to="/chapter-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Chapter
            </Link>
          </Button>
          <Button asChild>
            <Link to="/chapter-3">
              Next Chapter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default Chapter2;