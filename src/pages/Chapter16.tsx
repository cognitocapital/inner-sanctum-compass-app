import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Chapter16 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead title="Chapter 16: Looking Forward - What a Journey" description="Setting sights on the future after traumatic brain injury." path="/chapter-16" />
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-orange-600 mb-2 drop-shadow-sm">
              Chapter 16
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              Looking Forward
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Although it's been a long road to recovery, as I look ahead, I'm filled with a sense of hope and anticipation. The journey is far from over, but I'm now able to look forward to the future with a renewed sense of purpose.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              For my next project, I'm excited to be working on the development of the Companion app. I envision it as a resource, a guide, a companion for others who are navigating their own recovery journeys, whether from TBI or other challenges. The app will offer practical tools and techniques that have helped me so much—guided meditations, journaling prompts, and resources related to mindfulness, "the observer," and "sitting with the uncomfortable." In fact, my recent exploration of the Wim Hof Method, particularly through his app, has inspired me to incorporate a dedicated "Ice Bath Companion" feature. This will provide guided meditations and resources specifically designed to help users gradually increase their cold tolerance and learn to "sit with the uncomfortable" in a safe and structured way. My hope is that it will empower others to take control of their healing and find their own path to well-being. I have learned to think more strategically and clearly. These skills will be invaluable moving forward.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              I've already had the opportunity to participate in the Brain Injury Rehabilitation Unit (BIRU) program. It's a comprehensive program that offers cognitive assessments, vestibular physiotherapy, and access to neuropsychologists if needed. Initially, I saw their vestibular physio, speech pathologist, occupational therapist, and neuropsychologist. After their assessments and a couple of follow-up appointments, they gave me invaluable feedback: I had essentially already done the work myself. I had developed and implemented the tools and strategies necessary for the most effective path forward. This was incredibly validating, confirming that my self-navigated journey and the inner work I had undertaken were aligned with the best practices in TBI recovery. While I initially sought out their expertise, it turned out I was already well on my way.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Of course, my commitment to my business and my family remains as strong as ever. It hasn't been easy to juggle these responsibilities while dealing with the effects of the injury, but I'm determined to keep moving forward, to keep building a fulfilling life for myself and my loved ones. I'm even kicking butt at times. This journey has changed me in profound ways. It's taught me the importance of resilience, self-compassion, and the power of the human spirit to overcome adversity. It's deepened my appreciation for the simple things in life and given me a newfound sense of purpose. I feel like I have been gifted my executive function.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              To anyone reading this who is facing their own challenges, I offer you this message of hope: You are stronger than you think you are. Recovery is possible. It may take time, it may be difficult, but you have within you the capacity to heal, to grow, and to create a life filled with meaning and joy. The future is still unwritten, and I know there will be more challenges ahead. But I face them now with a newfound sense of strength, resilience, and purpose. I'm grateful for the journey, for the lessons I've learned, and for the opportunity to help others find their own path to healing.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-15">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-17">
                  Next Chapter
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

export default Chapter16;
