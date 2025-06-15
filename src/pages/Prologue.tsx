import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Prologue = () => {
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
        <h1 className="text-4xl font-serif font-bold text-center text-flame-gradient mb-12">
          Prologue
        </h1>

        <p>
          The main purpose for writing this book is to help others navigate the foreign landscape of traumatic brain injury (TBI). When I was first injured, it felt like the resources available outside of specialized units, like the Brain Injury Rehabilitation Unit, had huge voids in patient care and guidance on what to expect. Simply being told "don't do this" and "don't do that" wasn't very helpful. I needed to know how to live with this injury, how to adapt, how to rebuild, and how to find my way back to myself. This book is my attempt to fill that void, to share what I've learned, and to offer a roadmap for those who may be struggling to find their own way.
        </p>

        <p>
          But this book is about more than just surviving a brain injury. It's about the power of the human spirit to overcome adversity, to adapt to change, and to find meaning in the face of suffering. While my story is rooted in the specific challenges of TBI, the underlying message is universal: we all have the capacity to heal, to grow, and to create a life filled with purpose, even in the face of seemingly insurmountable obstacles. These tools—mindfulness, gratitude, self-care—are not just for TBI survivors. They're for anyone seeking to navigate stress, loss, or change. If my story can help you feel less alone, if it can spark one moment of hope, it's worth it. We're all navigating our own wildernesses. This book is a roadmap, a companion, a reminder that you're not alone.
        </p>

        <p>
          Throughout these pages, I'll share the tools and strategies that have helped me on my journey: the importance of self-care, the power of mindfulness, the practice of "being the observer," and the resilience that comes from "sitting with the uncomfortable." These are not just abstract concepts; they are practical tools that I've used every single day to manage my symptoms, regulate my emotions, and rebuild my life. And while I discovered them through the crucible of TBI, they are tools that can benefit anyone seeking to improve their mental, emotional, and physical well-being.
        </p>

        <p>
          I won't sugarcoat things. This journey has been the hardest thing I've ever had to navigate. It's been messy, it's been painful, and it's been profoundly humbling. But it's also been transformative. It's forced me to confront my own limitations, to question my assumptions about life, and to ultimately discover a deeper sense of self and purpose. My personal growth was born out of necessity.
        </p>

        <p>
          I'm not here to preach or to offer easy answers. I'm simply sharing my story, honestly and authentically, in the hope that it might offer some guidance, some solace, some inspiration to those who are also on their own journeys of healing and self-discovery. The tools are all there in front of you. This book offers hope, practical tools, and a sense of community. This is my journey. Perhaps it can help you navigate yours.
        </p>

        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Table of Contents
            </Link>
          </Button>
          <Button asChild>
            <Link to="/chapter-1">
              Chapter 1
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default Prologue;