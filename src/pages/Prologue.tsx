import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Prologue = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [showIntro, setShowIntro] = useState(true);

  // Video Intro - auto-plays immediately
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black">
        <video
          src="/video/start-reading-intro.mp4"
          className="w-full h-screen object-cover"
          onEnded={() => setShowIntro(false)}
          autoPlay
          playsInline
          muted
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
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
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0 text-gray-300 hover:text-white transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>

        {/* Phoenix image for chapter header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-24 h-24 group">
            <div 
              className="w-full h-full rounded-full border-4 border-orange-500/40 shadow-2xl hover:scale-110 transition-all duration-700 cursor-pointer phoenix-image"
              style={{
                backgroundImage: `url('/lovable-uploads/87893c50-952e-48f8-9649-a7083c6cffd3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Flame particles around phoenix */}
            <div className="absolute -top-4 -left-4 w-4 h-4 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite] opacity-90"></div>
            <div className="absolute -top-6 right-12 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.8s] opacity-75"></div>
            <div className="absolute top-6 -right-5 w-3.5 h-3.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.2s] opacity-85"></div>
            <div className="absolute bottom-12 -left-6 w-2.5 h-2.5 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_0.3s] opacity-65"></div>
            <div className="absolute -bottom-5 right-8 w-3 h-3 bg-orange-500 rounded-full animate-[float_3s_ease-in-out_infinite_1.5s] opacity-80"></div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/90 border-orange-500/20 shadow-2xl rounded-lg p-8 md:p-12">
          <article className="prose prose-lg mx-auto text-gray-900 max-w-none">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-center text-orange-600 mb-12 drop-shadow-sm">
              Prologue
            </h1>


            <p className="text-lg leading-relaxed mb-6">
              The main purpose for writing this book is to help others navigate the foreign landscape of traumatic brain injury (TBI). When I was first injured, it felt like the resources available outside of specialized units, like the Brain Injury Rehabilitation Unit, had huge voids in patient care and guidance on what to expect. Simply being told "don't do this" and "don't do that" wasn't very helpful. I needed to know how to live with this injury, how to adapt, how to rebuild, and how to find my way back to myself. This book is my attempt to fill that void, to share what I've learned, and to offer a roadmap for those who may be struggling to find their own way.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              But this book is about more than just surviving a brain injury. It's about the power of the human spirit to overcome adversity, to adapt to change, and to find meaning in the face of suffering. While my story is rooted in the specific challenges of TBI, the underlying message is universal: we all have the capacity to heal, to grow, and to create a life filled with purpose, even in the face of seemingly insurmountable obstacles. These tools—mindfulness, gratitude, self-care—are not just for TBI survivors. They're for anyone seeking to navigate stress, loss, or change. If my story can help you feel less alone, if it can spark one moment of hope, it's worth it. We're all navigating our own wildernesses. This book is a roadmap, a companion, a reminder that you're not alone.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Throughout these pages, I'll share the tools and strategies that have helped me on my journey: the importance of self-care, the power of mindfulness, the practice of "being the observer," and the resilience that comes from "sitting with the uncomfortable." These are not just abstract concepts; they are practical tools that I've used every single day to manage my symptoms, regulate my emotions, and rebuild my life. And while I discovered them through the crucible of TBI, they are tools that can benefit anyone seeking to improve their mental, emotional, and physical well-being.
            </p>

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