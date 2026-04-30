import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import introHero from "@/assets/introduction-hero.jpg";

const Introduction = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/introduction.mp3"]} />
      <ChapterNavArrows currentPath="/introduction" />
      <SEOHead title="Introduction - What a Journey" description="Introduction to What a Journey, setting the stage for Michael Heron's TBI recovery story." path="/introduction" />
      {/* Cinematic hero — father/son journey, Manly horizon, drifting embers */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={introHero}
          alt="A man gazes out a car window at a winding coastal road toward Manly at golden hour, his reflection ghosted in the glass — the contemplative drive that opens What a Journey."
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        {/* Cinematic grading layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-[#0a0a0f]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,15,0.6)_100%)]" />

        {/* Drifting embers over the image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-[15%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[float_6s_ease-in-out_infinite] opacity-70" />
          <div className="absolute top-1/3 left-[30%] w-1 h-1 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)] animate-[float_7s_ease-in-out_infinite_1s] opacity-60" />
          <div className="absolute top-2/3 left-[22%] w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.8)] animate-[float_8s_ease-in-out_infinite_2s] opacity-65" />
          <div className="absolute top-1/2 left-[45%] w-1 h-1 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.7)] animate-[float_9s_ease-in-out_infinite_3s] opacity-55" />
          <div className="absolute bottom-1/4 right-[35%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[float_7s_ease-in-out_infinite_4s] opacity-60" />
        </div>

        {/* Hero copy */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5 animate-fade-in">
              <div className="h-px w-12 bg-amber-400/60" />
              <p className="text-amber-300/90 text-xs md:text-sm tracking-[0.4em] uppercase font-light">
                A Memoir · Michael Heron
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl animate-fade-in leading-[1.05]">
              Introduction
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-white/85 italic max-w-2xl animate-fade-in font-serif leading-relaxed">
              "What a journey." — the words I'd say to my Dad, looking out the window, contemplating life.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-200/60 animate-[float_3s_ease-in-out_infinite]">
          <span className="text-[10px] tracking-[0.3em] uppercase">Begin</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* Animated background elements inspired by phoenix flames */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {/* Primary flame particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-80 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1s] opacity-60 shadow-lg shadow-orange-500/40"></div>
        <div className="absolute bottom-60 left-1/4 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2s] opacity-70 shadow-lg shadow-orange-500/45"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_3s] opacity-50 shadow-lg shadow-orange-500/35"></div>
        <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-45 shadow-lg shadow-orange-500/30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_2.5s] opacity-35 shadow-lg shadow-orange-500/25"></div>
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.5s] opacity-55 shadow-lg shadow-orange-500/40"></div>
        
        {/* Additional ember particles */}
        <div className="absolute top-32 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_4s] opacity-40"></div>
        <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-[float_4s_ease-in-out_infinite_5s] opacity-35"></div>
        <div className="absolute bottom-72 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-[float_4s_ease-in-out_infinite_6s] opacity-30"></div>
        <div className="absolute bottom-24 right-1/6 w-1.5 h-1.5 bg-orange-500 rounded-full animate-[float_4s_ease-in-out_infinite_7s] opacity-45"></div>
        <div className="absolute top-1/4 right-1/8 w-1 h-1 bg-red-500 rounded-full animate-[float_4s_ease-in-out_infinite_8s] opacity-40"></div>
        
        {/* Subtle flame trails */}
        <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-gradient-to-t from-orange-500/60 to-transparent animate-[float_3s_ease-in-out_infinite_3.5s] opacity-30"></div>
        <div className="absolute bottom-32 right-1/2 w-0.5 h-6 bg-gradient-to-t from-orange-500/50 to-transparent animate-[float_3s_ease-in-out_infinite_4.5s] opacity-25"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in px-4 py-12 md:py-20">
        <div className="mb-10">
          <Button asChild variant="ghost" className="pl-0 text-amber-200/70 hover:text-amber-200 hover:bg-transparent transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to the Library
            </Link>
          </Button>
        </div>

        {/* Glassmorphic editorial card — matches CarerCircle / MyPhoenixChapters scope */}
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_60px_rgba(245,158,11,0.08)] p-8 md:p-14 overflow-hidden">
          {/* Soft amber glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-amber-300/70 text-xs tracking-[0.4em] uppercase mb-4 text-center">Chapter Zero</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-center text-white mb-3">
              What a Journey
            </h2>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px w-8 bg-amber-400/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <div className="h-px w-8 bg-amber-400/40" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.85] prose-p:font-light">
              <p className="first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1">
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

            <blockquote className="not-prose my-10 border-l-2 border-amber-400/60 pl-6 py-2">
              <p className="text-xl md:text-2xl font-serif italic text-amber-100/90 leading-relaxed">
                "I am lucky—lucky to be alive, to move my face, to have hearing in my right ear."
              </p>
            </blockquote>

            <p>
              I have a traumatic brain injury, but I am lucky—lucky to be alive, to move my face, to have hearing in my right ear. I am still regaining my balance as the vertigo slowly subsides. I used to be able to climb ladders and walk on roofs. I am about to finish writing my story on the 12-month anniversary of my accident. Another hard part of my injury was my loss of taste and smell. Let's just say after 12 months, they're making a slow comeback.
            </p>

            <p>
              Writing my story has been a huge challenge and a very slow process, doing it when my mind will let me—but writing it has also helped me to concentrate and focus. Sometimes when I have been struggling, it helped to put my feelings in writing. My story is not about sadness or self-pity, really. It's more gratitude than anything else. Gratitude for what I've been able to achieve with this messed-up brain. But damn, the emotional rollercoaster is still one of the hardest things to deal with. Getting overwhelmed, the anxiety that comes and goes—it's exhausting. It takes a lot more to tip me over the edge now, but it still happens.
            </p>

            <p>
              I'd thought about writing this story before, but to be honest, I haven't had the mental capacity—it's been a fight just to survive. One night after putting my youngest daughter to bed, something felt different, and I felt well enough to start writing. Maybe it's because I finally managed to take some pressure off myself at work by restructuring my business. Whatever it is, I'm grateful for this moment of clarity. I'm grateful to be able to share my story, to tell you about the things I've learned, and hopefully, to help you find your own way through the darkness.
            </p>

            <p className="text-amber-100/90 italic">
              Hopefully, I've grabbed your attention. Now let me start from the beginning and tell you my story in full. The gloves are off, so prepare yourself!
            </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
              <Button asChild variant="outline" className="border-amber-400/30 bg-transparent text-amber-100 hover:bg-amber-400/10 hover:border-amber-400/60 hover:text-amber-50 transition-all duration-300">
                <Link to="/prologue">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Prologue
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-[1.02]">
                <Link to="/chapter-1">
                  Chapter 1
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Introduction;