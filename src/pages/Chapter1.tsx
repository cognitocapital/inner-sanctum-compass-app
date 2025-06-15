import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Chapter1 = () => {
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
          <img 
            src="/lovable-uploads/2a13c600-36ec-41bb-bc52-a980190f1d22.png" 
            alt="Phoenix rising with wings spread" 
            className="w-full h-full rounded-full object-cover border-2 border-primary/30 shadow-lg animate-glow-pulse hover:scale-105 transition-all duration-300 phoenix-image" 
          />
          <div className="absolute inset-0 rounded-full bg-flame-gradient opacity-20 animate-flame-flicker"></div>
        </div>
      </div>

      <article className="prose prose-invert prose-lg mx-auto text-foreground">
        <h1 className="text-4xl font-serif font-bold text-center text-flame-gradient mb-2">
          Chapter 1
        </h1>
        <h2 className="text-2xl font-serif font-bold text-center text-muted-foreground mt-0 mb-12">
          The Day Everything Changed
        </h2>

        <p className="text-sm text-center text-muted-foreground/80 italic mb-8">
          Australia Day, January 26, 2024
        </p>

        <p>
          Australia Day 2024. A date I'll never forget, though I wish I could. It was supposed to be a celebration, a day of joy and national pride. Instead, it became the day my world turned upside down, literally and figuratively.
        </p>

        <p>
          I remember the morning clearly—too clearly, given what was to come. The sun was shining, the air was warm, and there was that unmistakable buzz of a public holiday. My wife Sarah and I had been looking forward to a relaxing day. We'd planned to spend it with friends, maybe have a barbecue, enjoy the simple pleasures of an Australian summer.
        </p>

        <p>
          But life, as I've learned, has a way of derailing our best-laid plans.
        </p>

        <p>
          The accident happened so quickly, yet the memory plays in slow motion. One moment I was upright, walking, thinking, being—the next, I was on the ground, my head having made violent contact with concrete. The world went dark, not just literally, but metaphorically too. Everything I thought I knew about myself, about my capabilities, about my future, changed in that instant.
        </p>

        <p>
          They say that traumatic brain injuries are invisible disabilities, and they're right. From the outside, I looked fine. No broken bones, no visible wounds that would make people understand the magnitude of what had happened. But inside my skull, a storm was brewing that would rage for months to come.
        </p>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">More chapters coming soon...</p>
          <Button asChild>
            <Link to="/">Back to Table of Contents</Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default Chapter1;