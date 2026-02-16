import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Chapter6 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead title="Chapter 6: The Roller Coaster - What a Journey" description="The emotional ups and downs of traumatic brain injury recovery." path="/chapter-6" />
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
              Chapter 6
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              The Roller Coaster
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              My recovery happened in phases. If the early days were like being in a fog, the next phase, from about three or four months after the accident, felt like riding a relentless rollercoaster. Not the fun kind, but the kind that makes you sick to your stomach and leaves you wanting to get off. My emotions were all over the place, swinging from extreme highs to crushing lows, often without warning. One minute I'd be feeling relatively normal, the next I'd be fighting back tears or struggling to contain a surge of anger.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              One particular incident stands out. I was in a shopping centre at Kmart, trying to pick out a Mother's Day present for my wife and my mum. I'd had a terrible night's sleep the night before and was feeling particularly vulnerable. I remember standing in the aisle, staring at a display of picture frames and candles, feeling utterly overwhelmed. It wasn't just the choice, though that was part of it; it was the noise, the crowds, the fluorescent lights buzzing above—it all felt like too much. I just wanted something nice for my mum, to show her how much I appreciated everything she had done for me during this time. But nothing felt good enough, and with the prospect of not having anything special for her, I started to lose it. The lights seemed to pulse, the chatter around me turned into a roar, and before I knew it, I was hiding in the pillow section, sobbing uncontrollably. Not just a few tears, but full-on, heaving sobs. A 38-year-old man, hiding amongst the throw pillows, having a meltdown in Kmart.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              That moment was a stark lesson in pacing and self-compassion. I'd pushed too hard, ignored the signs, and paid the price. It wasn't just about the gift; it was about learning when to step back, when to say, "Enough for today." Social situations, in general, became a minefield. I used to enjoy being around people, but now it often felt like an endurance test. At first, it was fine, even enjoyable. But then, fatigue would set in, and my ability to cope would rapidly diminish. I'd start to feel overwhelmed, anxious, and the tears would be right there, threatening to spill over. I'd go from hoping to get Mother's Day presents sorted to trying not to cry in the pillow section of Kmart.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              From my experience, my advice for anyone caring for someone with a brain injury is that empathy becomes your superpower. Try to gain a basic understanding of the area of the brain that has been affected and what those areas control. This will help you understand where the person you're caring for is likely to struggle. If you're not an empathetic person, try to be patient and understanding. Don't shout, don't try to force them to "snap out of it." They can't. Trust me. When I was on that emotional rollercoaster, the last thing I needed was someone yelling at me to get it together. What I needed was space, understanding, and the knowledge that it was okay to not be okay. If the person you are caring for is having a difficult day, give them the space they need. If they seem frustrated, they probably are. When they calm down and can get back to baseline, it's likely they'll no longer be frustrated, especially if it was something that wouldn't normally bother them. This is where your empathy will be priceless.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              The emotional rollercoaster was one of the most difficult aspects of the injury to manage. It was unpredictable, exhausting, and often embarrassing. But it taught me a lot about myself and about the importance of having a support system that understands and accepts the ups and downs.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-5">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-7">
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

export default Chapter6;
