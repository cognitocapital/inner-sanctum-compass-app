import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import prologueIllustration from "@/assets/prologue-phoenix-illustration.jpg";

const Prologue = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [showIntro, setShowIntro] = useState(true);

  // Video Intro - auto-plays seamlessly, then transitions to prologue
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <video
          src="/video/start-reading-intro.mp4"
          className="w-full h-screen object-contain"
          onEnded={() => setShowIntro(false)}
          onError={() => setShowIntro(false)}
          autoPlay
          playsInline
        />
        <button
          onClick={() => setShowIntro(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 transition-colors flex items-center gap-2"
          aria-label="Skip intro video"
        >
          Skip Intro
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/prologue.mp3"]} />
      <ChapterNavArrows currentPath="/prologue" />
      <SEOHead title="Prologue - What a Journey" description="The prologue to What a Journey, Michael Heron's memoir of traumatic brain injury recovery and resilience." path="/prologue" />

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        {/* Illustration backdrop */}
        <img
          src={prologueIllustration}
          alt="A man kneels among burnt papers and ashes as a fiery phoenix with wings of flame, photographs and medical notes rises behind him — visual metaphor for traumatic brain injury recovery and rebirth."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
        />

        {/* Atmospheric overlays — vignette + bottom fade into page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers tied to the artwork */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[35%] right-[20%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[55%] left-[25%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[45%] right-[30%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-[float_7s_ease-in-out_infinite_3s]" />
          <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
        </div>

        {/* Back link, top-left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <Button asChild variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* Title block — bottom-left, editorial */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-16 pb-20 md:pb-28 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
              What a Journey · Michael Heron
            </p>
            <h1 className="font-serif font-bold text-white text-6xl md:text-8xl leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              Prologue
            </h1>
            <p className="mt-6 text-white/70 text-base md:text-lg max-w-xl font-light italic leading-relaxed">
              From the ashes of who I was, a roadmap for who I'm becoming.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      {/* Animated background elements inspired by phoenix flames */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
      
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in px-4 py-8">
        <div className="backdrop-blur-sm bg-white/90 border-orange-500/20 shadow-2xl rounded-lg p-8 md:p-12">
          <article className="prose prose-lg mx-auto text-gray-900 max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              The main purpose for writing this book is to help others navigate the foreign landscape of traumatic brain injury (TBI). When I was first injured, it felt like the resources available outside of specialized units, like the Brain Injury Rehabilitation Unit, had huge voids in patient care and guidance on what to expect. Simply being told "don't do this" and "don't do that" wasn't very helpful. I needed to know how to live with this injury, how to adapt, how to rebuild, and how to find my way back to myself. This book is my attempt to fill that void, to share what I've learned, and to offer a roadmap for those who may be struggling to find their own way.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              But this book is about more than just surviving a brain injury. It's about the power of the human spirit to overcome adversity, to adapt to change, and to find meaning in the face of suffering. While my story is rooted in the specific challenges of TBI, the underlying message is universal: we all have the capacity to heal, to grow, and to create a life filled with purpose, even in the face of seemingly insurmountable obstacles. These tools—mindfulness, gratitude, self-care—are not just for TBI survivors. They're for anyone seeking to navigate stress, loss, or change. If my story can help you feel less alone, if it can spark one moment of hope, it's worth it. We're all navigating our own wildernesses. This book is a roadmap, a companion, a reminder that you're not alone.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Throughout these pages, I'll share the tools and strategies that have helped me on my journey: the importance of self-care, the power of mindfulness, the practice of "being the observer," and the resilience that comes from "sitting with the uncomfortable." These are not just abstract concepts; they are practical tools that I've used every single day to manage my symptoms, regulate my emotions, and rebuild my life. And while I discovered them through the crucible of TBI, they are tools that can benefit anyone seeking to improve their mental, emotional, and physical well-being.
            </p>

            {/* Mid-chapter visual echo — pull-quote framed by the illustration */}
            <figure className="not-prose my-12 -mx-8 md:-mx-12 relative overflow-hidden rounded-lg">
              <img
                src={prologueIllustration}
                alt=""
                aria-hidden="true"
                className="w-full h-72 md:h-96 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/90" />
              <blockquote className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
                <p className="text-xl md:text-3xl font-serif italic text-white text-center leading-snug max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  &ldquo;It's been messy, it's been painful, and it's been profoundly humbling.
                  <span className="block mt-2 text-orange-300">But it's also been transformative.&rdquo;</span>
                </p>
              </blockquote>
            </figure>

            <p className="text-lg leading-relaxed mb-6">
              I won't sugarcoat things. This journey has been the hardest thing I've ever had to navigate. It's been messy, it's been painful, and it's been profoundly humbling. But it's also been transformative. It's forced me to confront my own limitations, to question my assumptions about life, and to ultimately discover a deeper sense of self and purpose. My personal growth was born out of necessity.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              I'm not here to preach or to offer easy answers. I'm simply sharing my story, honestly and authentically, in the hope that it might offer some guidance, some solace, some inspiration to those who are also on their own journeys of healing and self-discovery. The tools are all there in front of you. This book offers hope, practical tools, and a sense of community. This is my journey. Perhaps it can help you navigate yours.
            </p>

            <div className="bg-orange-500/10 rounded-lg p-6 border border-orange-500/20 mb-8">
              <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                <span>🌱</span> Continue Your Journey
              </h3>
              <p className="text-gray-700 mb-4">
                Ready to explore additional resources from leading experts in TBI recovery, brain resilience, and neuroplasticity? 
                Discover tools and wisdom from influential voices who can support your path to personal growth.
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link to="/resources">
                  Explore Growth Resources
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/introduction">
                  Introduction
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Prologue;