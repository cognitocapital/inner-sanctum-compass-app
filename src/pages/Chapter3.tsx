import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Chapter3 = () => {
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
          Chapter 3
        </h1>
        <h2 className="text-2xl font-serif font-bold text-center text-muted-foreground mt-0 mb-12">
          Coming Home
        </h2>

        <p className="text-sm text-center text-muted-foreground/80 italic mb-8">
          February 2024
        </p>

        <p>
          Going home from the hospital should have felt like a victory, but instead it felt like stepping into an alien world. Everything looked the same—our house, our street, our neighborhood—but I felt fundamentally different. It was as if I was seeing my life through someone else's eyes.
        </p>

        <p>
          The simplest tasks became monumental challenges. Making a cup of coffee required intense concentration. Following a conversation on TV was exhausting. Reading more than a paragraph made my head throb. Sarah tried to create a gentle routine, but even that felt overwhelming.
        </p>

        <p>
          The emotional toll was perhaps harder than the cognitive challenges. I found myself getting frustrated over things that should have been easy, crying at unexpected moments, and feeling like a stranger in my own body. The person I had been before the accident felt like a distant memory.
        </p>

        <p>
          My skateboard sat in the garage, collecting dust. Looking at it brought a mixture of emotions—anger at what it had cost me, but also a strange longing for the freedom it once represented. Sarah suggested we move it out of sight, but something made me want to keep it there, a reminder of both what I'd lost and what I was determined to reclaim.
        </p>

        <p>
          The doctors had given us a rough timeline for recovery, but everyone was careful to mention that traumatic brain injury recovery isn't linear. Some days would be better than others. Some progress might be permanent, others temporary. The uncertainty was almost harder to bear than the symptoms themselves.
        </p>

        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link to="/chapter-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Chapter
            </Link>
          </Button>
          <Button asChild>
            <Link to="/chapter-4">
              Next Chapter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default Chapter3;