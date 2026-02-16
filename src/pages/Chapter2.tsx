import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Chapter2 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead title="Chapter 2: Hospital Daze - What a Journey" description="Navigating the early days of hospital recovery after a traumatic brain injury." path="/chapter-2" />
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
              Chapter 2
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-600 mt-0 mb-12">
              Hospital Daze
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              My world swam back into focus, not with a gentle sunrise, but with the harsh, insistent beeping of a monitor. My head throbbed, a relentless drum solo that echoed the frantic rhythm of my heart. I was in a bed, in a room that smelled of antiseptic and something else… fear? My own, I realized. Panic clawed its way up my throat. "What the hell happened?" The words were a dry rasp in my throat, barely audible even to myself.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Then I saw her, Sarah. Her eyes, usually sparkling with laughter, were wide with a fear I'd rarely seen before. Her face was pale, drawn tight with worry. She looked exhausted, like she had been crying for hours. In that instant, the carefree joy of Australia Day evaporated, replaced by a chilling certainty: something was very, very wrong.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              "Post-traumatic amnesia," the doctor called it. A clinical term for a common symptom of traumatic brain injury. It did little to explain the gaping hole in my memory. I had no recollection of the accident, no memory of how I'd ended up here. It was like my brain had hit a reset button, wiping out a crucial chunk of time. They almost sent me home that day. Can you believe it? No tests, no scans, just a pat on the head and a "You'll be right, mate." If it weren't for one doctor, and for Sarah's unwavering insistence, I might have walked out of there with three major skull fractures and multiple minor ones, none the wiser.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              One doctor, out of all the staff in that bustling emergency room, saw something that made him pause. He listened, really listened, when Sarah described what she'd been told by our friends who witnessed the accident. She hadn't seen the fall herself, but she relayed the details with a fierce urgency, painting a picture of the impact, the way I'd been flung from the board. He ordered more scans, refusing to dismiss the persistent headache and the growing confusion that clouded my thoughts. Thank God he did. Sarah, my rock, she wouldn't back down. She questioned, she pushed, she demanded answers when I was in no condition to string a coherent sentence together.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The hospital days that followed are mostly a blur. A hazy montage of hushed conversations, the rhythmic beeping of machines, and the constant, throbbing pain in my head. I drifted in and out of consciousness, catching snippets of conversations, the concerned faces of my wife and friends, the sterile smell of the hospital. It was all so disorienting, like being trapped in a fog I couldn't escape.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Those scans, the ones that almost didn't happen, revealed the truth: three major skull fractures, a spiderweb of smaller ones. It was later confirmed that I had suffered a traumatic brain injury (TBI). I was later told by my ENT specialist just how lucky I was. He explained how one of the fractures was dangerously close to a nerve that controlled facial movement. A hair's breadth either way, and my face might have been paralysed. He also confirmed that I was lucky to have retained my hearing, considering the damage to my inner ear. It was a sobering thought.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Looking back, those hazy hospital days feel like a lifetime ago. The fear, the uncertainty, the pain—it's all a blur now. But I'll never forget the one doctor who saw beyond the obvious and the unwavering strength of my wife, who fought for me when I couldn't fight for myself. They are two of the reasons I'm still here today, able to tell this story.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-orange-200">
              <Button asChild variant="outline" className="border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                <Link to="/chapter-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/chapter-3">
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

export default Chapter2;