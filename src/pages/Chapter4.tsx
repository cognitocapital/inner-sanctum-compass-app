import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Chapter4 = () => {
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
          Chapter 4
        </h1>
        <h2 className="text-2xl font-serif font-bold text-center text-muted-foreground mt-0 mb-12">
          The Long Road to Recovery
        </h2>

        <p className="text-sm text-center text-muted-foreground/80 italic mb-8">
          March - April 2024
        </p>

        <p>
          Recovery, I learned, is not a straight line. It's more like a winding mountain path—sometimes you're climbing steadily upward, other times you're sliding backwards, and occasionally you find yourself on a plateau wondering if you'll ever move forward again.
        </p>

        <p>
          The rehabilitation program became my new reality. Cognitive therapy sessions where I relearned skills I'd taken for granted. Physical therapy to address the balance issues and coordination problems. Occupational therapy to help me navigate daily tasks that had become foreign territory.
        </p>

        <p>
          But it was the breathing exercises that surprised me the most. My therapist introduced them as a way to manage the anxiety and overwhelm that came with my new limitations. What started as simple breathing techniques gradually became something more—a way to reconnect with my body, to find moments of calm in the storm of recovery.
        </p>

        <p>
          Sarah and I also discovered the power of cold exposure therapy. What began as cold showers recommended for inflammation gradually became a shared ritual of resilience. There was something profound about voluntarily stepping into discomfort, about proving to myself that I could still choose to face difficult things.
        </p>

        <p>
          These weren't just therapeutic exercises—they were acts of rebellion against the helplessness I often felt. Each cold shower, each focused breath, each small cognitive victory was a declaration that I was still fighting, still growing, still becoming.
        </p>

        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link to="/chapter-3">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Chapter
            </Link>
          </Button>
          <Button asChild>
            <Link to="/chapter-5">
              Next Chapter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default Chapter4;