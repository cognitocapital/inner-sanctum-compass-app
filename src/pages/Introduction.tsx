import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Introduction = () => {
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
          Introduction
        </h1>
        <h2 className="text-2xl font-serif font-bold text-center text-muted-foreground mt-0 mb-12">
          What a Journey
        </h2>

        <p>
          "What a journey." It's a term I would often say to my Dad on one of our "work days" as he would drive me to look at work sites, because I could not drive after my brain injury. We were trying to keep my business going and work progressing for my team of roofing tradesmen. Often while looking out the window of the car, I would be contemplating life. Always after we had one of our Friday morning "meetings." I use the term meeting loosely, as what we discussed varied massively, as there were so many factors that I had asked my Dad for guidance on. Those Friday brekkie chats at Manly weren't just about work. They were about life—sorting out fears, dreams, failures. If you've ever felt humbled by life's twists, you'll find yourself here. In fact, my exact words to get him to the cafe at Manly that morning were, "Dad, I want you to help me sort my life out." That is a very humbling experience for a 38-year-old man who has a wonderful family and his own business as a roof plumber.
        </p>

        <p>
          This isn't where this particular journey began. This journey began on Australia Day 2024. It turned out to be a fateful day that will stick with me for the rest of my life. Come with me as I guide you through the world through my lens. In this chapter, I want to give you a summary of my journey from there.
        </p>

        <p>
          To celebrate Australia Day, we were having a typical get-together with family and friends. We often enjoyed time together like this. My wife Sarah and our three daughters, Harper (4), Matilda (6), and Bailey (8), were all there, soaking up the easy-going atmosphere. Our friends are more like family, especially this group. I especially want to mention my best mates, Tyson and my twin brother, Matthew—we have been the three musketeers since grade 4. We all grew up together, a tight-knit crew. When we were growing up, we were passionate about skateboarding and fishing. We were just enjoying each other's company, having a good time. None of us knew how drastically things were about to change, or how close I'd come to losing it all that day when a simple skateboard accident changed everything.
        </p>

        <p>
          The next thing I remember is being in a hospital bed, my head pounding, and I was dazed and dizzy and could not comprehend or talk properly. I found out I was knocked unconscious when my head crashed into the ground during the skateboard accident, and I had a very bad concussion, but it turned out to be much more serious. That's when it really sunk in—I'd cheated death, having no idea what lay ahead. I couldn't see the road in front of me. Ignorance was bliss at this stage, but ignorance was only going to get me so far; the journey back to myself was going to be a long one.
        </p>

        <p>
          I have a traumatic brain injury, but I am lucky—lucky to be alive, to move my face, to have hearing in my right ear. I am still regaining my balance as the vertigo slowly subsides. I used to be able to climb ladders and walk on roofs. I am about to finish writing my story on the 12-month anniversary of my accident. Another hard part of my injury was my loss of taste and smell. Let's just say after 12 months, they're making a slow comeback.
        </p>

        <p>
          Writing my story has been a huge challenge and a very slow process, doing it when my mind will let me—but writing it has also helped me to concentrate and focus. Sometimes when I have been struggling, it helped to put my feelings in writing. My story is not about sadness or self-pity, really. It's more gratitude than anything else. Gratitude for what I've been able to achieve with this messed-up brain. But damn, the emotional rollercoaster is still one of the hardest things to deal with. Getting overwhelmed, the anxiety that comes and goes—it's exhausting. It takes a lot more to tip me over the edge now, but it still happens.
        </p>

        <p>
          I'd thought about writing this story before, but to be honest, I haven't had the mental capacity—it's been a fight just to survive. One night after putting my youngest daughter to bed, something felt different, and I felt well enough to start writing. Maybe it's because I finally managed to take some pressure off myself at work by restructuring my business. Whatever it is, I'm grateful for this moment of clarity. I'm grateful to be able to share my story, to tell you about the things I've learned, and hopefully, to help you find your own way through the darkness.
        </p>

        <p>
          Hopefully, I've grabbed your attention. Now let me start from the beginning and tell you my story in full. The gloves are off, so prepare yourself!
        </p>

        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link to="/prologue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Prologue
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

export default Introduction;