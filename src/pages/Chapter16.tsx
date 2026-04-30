import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import heroImage from "@/assets/chapter16-hero.jpg";

const Chapter16 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter16.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-16" />
      <SEOHead title="Chapter 16: Looking Forward - What a Journey" description="Setting sights on the future after traumatic brain injury." path="/chapter-16" />

      {/* Cinematic hero */}
      <div className="relative h-[88vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="A mountain trail leading toward sunrise"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,10,15,0.55)_55%,_#0a0a0f_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]" />

        {/* Floating amber motes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-[15%] w-1.5 h-1.5 rounded-full bg-amber-300/70 shadow-[0_0_12px_2px_rgba(252,211,77,0.6)] animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-[20%] w-1 h-1 rounded-full bg-amber-200/60 shadow-[0_0_10px_2px_rgba(252,211,77,0.5)] animate-[float_7s_ease-in-out_infinite_1.2s]" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-amber-300/60 shadow-[0_0_10px_2px_rgba(252,211,77,0.5)] animate-[float_8s_ease-in-out_infinite_2s]" />
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-200/70 shadow-[0_0_14px_3px_rgba(252,211,77,0.5)] animate-[float_9s_ease-in-out_infinite_3s]" />
        </div>

        <div className="absolute top-6 left-6 z-10">
          <Button asChild variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5 backdrop-blur-md">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to the Library
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-20 md:pb-28 text-center">
          <p className="text-amber-300/80 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-light">Chapter Sixteen</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-6">
            Looking <span className="italic text-amber-200/90">Forward</span>
          </h1>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">Read</div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 pb-20">
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] animate-fade-in">
          <div className="prose prose-invert prose-lg max-w-none font-light text-white/85 leading-[1.85]">

            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
              Although it's been a long road to recovery, as I look ahead, I'm filled with a sense of hope and anticipation. The journey is far from over, but I'm now able to look forward to the future with a renewed sense of purpose.
            </p>

            <p>
              For my next project, I'm excited to be working on the development of the Companion app. I envision it as a resource, a guide, a companion for others who are navigating their own recovery journeys, whether from TBI or other challenges. The app will offer practical tools and techniques that have helped me so much—guided meditations, journaling prompts, and resources related to mindfulness, "the observer," and "sitting with the uncomfortable." In fact, my recent exploration of the Wim Hof Method, particularly through his app, has inspired me to incorporate a dedicated "Ice Bath Companion" feature. This will provide guided meditations and resources specifically designed to help users gradually increase their cold tolerance and learn to "sit with the uncomfortable" in a safe and structured way. My hope is that it will empower others to take control of their healing and find their own path to well-being. I have learned to think more strategically and clearly. These skills will be invaluable moving forward.
            </p>

            <p>
              I've already had the opportunity to participate in the Brain Injury Rehabilitation Unit (BIRU) program. It's a comprehensive program that offers cognitive assessments, vestibular physiotherapy, and access to neuropsychologists if needed. Initially, I saw their vestibular physio, speech pathologist, occupational therapist, and neuropsychologist. After their assessments and a couple of follow-up appointments, they gave me invaluable feedback: I had essentially already done the work myself. I had developed and implemented the tools and strategies necessary for the most effective path forward. This was incredibly validating, confirming that my self-navigated journey and the inner work I had undertaken were aligned with the best practices in TBI recovery. While I initially sought out their expertise, it turned out I was already well on my way.
            </p>

            <p>
              Of course, my commitment to my business and my family remains as strong as ever. It hasn't been easy to juggle these responsibilities while dealing with the effects of the injury, but I'm determined to keep moving forward, to keep building a fulfilling life for myself and my loved ones. I'm even kicking butt at times. This journey has changed me in profound ways. It's taught me the importance of resilience, self-compassion, and the power of the human spirit to overcome adversity. It's deepened my appreciation for the simple things in life and given me a newfound sense of purpose. I feel like I have been gifted my executive function.
            </p>

            <p>
              To anyone reading this who is facing their own challenges, I offer you this message of hope:
            </p>

            <blockquote className="my-10 pl-6 border-l-2 border-amber-400/60 italic text-white/90 font-serif text-xl md:text-2xl leading-relaxed not-prose">
              You are stronger than you think you are. Recovery is possible.
            </blockquote>

            <p>
              It may take time, it may be difficult, but you have within you the capacity to heal, to grow, and to create a life filled with meaning and joy. The future is still unwritten, and I know there will be more challenges ahead. But I face them now with a newfound sense of strength, resilience, and purpose. I'm grateful for the journey, for the lessons I've learned, and for the opportunity to help others find their own path to healing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
            <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              <Link to="/chapter-15">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-medium shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.8)] transition-all duration-500">
              <Link to="/chapter-17">
                Next Chapter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Chapter16;
