import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Chapter3 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead title="Chapter 3: The Gun to My Head - What a Journey" description="Facing life-or-death moments during TBI recovery." path="/chapter-3" />
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
              Chapter 3
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              The Gun to My Head
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Leaving the hospital felt less like a release and more like stepping into a different kind of battle zone. Gone were the sterile white walls and the rhythmic beeping of monitors, replaced by the familiar chaos of home life. But "home" felt different now, altered in a way I couldn't quite grasp. I was home, but I wasn't myself.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Those first few weeks were a blur of raw emotion and overwhelming fatigue. I was in survival mode, just trying to make it through each day, each hour, each minute. It felt like I was constantly on edge, like there was an invisible gun to my head, holstered "for now." The pressure was immense, the fear that any wrong move, any lapse in concentration, could send me spiralling back to square one.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My emotions were all over the place, a chaotic rollercoaster that I couldn't seem to control. One minute I'd be fine, the next I'd be overwhelmed by a wave of anxiety or frustration. Tears would come out of nowhere, triggered by the smallest things. I remember one night, about six months in, lying next to my youngest daughter, Harper, as she drifted off to sleep. I was trying to be quiet, but the tears started rolling down my cheeks—tears of gratitude for how much I'd achieved in this seemingly impossible situation, for the personal victories I'd clawed out. I can't articulate that exact sense of gratitude; it's bloody hard to paint the picture of what it was like. Mixed with exhaustion, I didn't want to wake her, didn't want to explain why Daddy was crying. Truth is, they were happy tears.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The emotional rollercoaster was one of the hardest things to deal with. I was easily overwhelmed, and the anxiety came and went like a bad dream. When it did, it was like falling into a pit I couldn't climb out of. It was affecting everyone around me, especially my wife and kids. They were walking on eggshells, trying to navigate my unpredictable moods, my sudden bursts of frustration, my inability to cope with things that used to be simple.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My brain felt like it was constantly misfiring. Simple tasks became monumental challenges. I remember struggling to spell the word "writing" at one point. "Writing," a word I'd used countless times before. It was like my brain had short-circuited; the connections severed. I had the mental capacity of a goldfish and the energy reserves of a sloth. It was a fight just to survive, to get through each day without collapsing in a heap.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This isn't a story about sympathy, though. Not at all. I don't want it. I want this to be a story about hope, about resilience. If one person can read this and feel like they're not alone on their journey, then it's worth it. If some of the things I've implemented can help someone else navigate their own recovery, that's a victory. I know I've already said this in my story, but my recovery from TBI is by far the hardest thing I've had to navigate in my entire life. How could someone possibly understand what it's like to have a brain injury when no two brain injuries are the same, and we could argue that no two brains are the same either?
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Those early days at home were some of the darkest. It felt like I was constantly on edge, fighting an invisible battle within myself. But even then, in the midst of the struggle, I knew I had to keep going, for myself and for my family.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-4">
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

export default Chapter3;
