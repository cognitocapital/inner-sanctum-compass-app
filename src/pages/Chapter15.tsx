import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Chapter15 = () => {
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-orange-600 mb-2 drop-shadow-sm">
              Chapter 15
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              Still Standing
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              The road to recovery is rarely a straight line. There are twists and turns, uphill climbs, and unexpected detours. Even now, twelve months after the accident, I still have days when my brain feels like scrambled eggs. It's a frustrating, disorienting sensation, like my thoughts are all jumbled up, my concentration is shot, and the simplest tasks feel overwhelming.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              When my brain is in "scrambled eggs" mode, it's a clear sign that I've pushed myself too hard, even if I hadn't realized it at the time. It's a reminder that pacing is crucial, even when I'm feeling good, even when I think I'm "back to normal." Because the truth is, "normal" has been redefined.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Self-compassion is essential on those difficult days. It's so easy to get frustrated, to beat myself up for not being able to do what I used to do. But I've learned that self-criticism only makes things worse. It adds another layer of stress and negativity to an already challenging situation. So, I try to be kind to myself, to remember that recovery takes time, and that setbacks are a normal part of the process. Some days, getting out of bed and putting on a load of washing is a monumental achievement.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              On those days, I would sometimes experience a kind of adrenal exhaustion. I'd catch a glimpse of myself in the mirror and see a scared, depleted shadow of a man staring back. It was a stark reminder of the physical and emotional toll this injury has taken. In those moments, I would tell myself, "Everything is okay. You're okay. This will pass." It wasn't about denying the reality of the situation, but about reinforcing a sense of inner safety and stability amidst the turmoil.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              On days when the world feels overwhelming, I know what I need. I need to slow down, to simplify, to give myself permission to rest. Sometimes, that means cancelling plans, saying no to requests, or simply retreating to a quiet space where I can be alone with my thoughts. It's not always easy, but it's necessary. I have found having a day to myself with no distractions to be priceless.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Those days, when my brain feels like scrambled eggs, it's like I've been transported to an alien world. Everything feels foreign, overwhelming, and just… off. I remember one time, I was at a busy butcher shop, and the noise, the crowds, the smells—it all became too much. I felt a panic attack rising, and I nearly had to bolt out of there. It's moments like those that remind me how far I've come, but also how far I still have to go. When I'm free of stress and I don't have to directly respond to anything work-related, I feel much closer to how I did pre-TBI. When things go off track and need important decisions made, it is so difficult if I'm not in the right headspace.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              The self-care practices that I adopted early on—exercise, nutritious food, good sleep, mindfulness, meditation—are still just as important now as they were in the beginning. They're not just temporary measures; they're lifelong tools for well-being. They're the foundation upon which I continue to build my recovery. Recovery is a marathon, not a sprint. There are still days when my brain feels like scrambled eggs, when the world feels overwhelming, when all I want to do is retreat. But I've learned to be patient with myself, to listen to my body, and to keep practicing the things that I know help me heal. I'm still standing, and that's what matters.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-14">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-16">
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

export default Chapter15;
