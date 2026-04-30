import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ChapterNavArrows from "@/components/ui/chapter-nav-arrows";
import PageAudioPlayer from "@/components/ui/page-audio-player";
import chapter2Hero from "@/assets/chapter2-hero.jpg";

const Chapter2 = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <PageAudioPlayer audioSrc={["/audio/chapter2.mp3"]} />
      <ChapterNavArrows currentPath="/chapter-2" />
      <SEOHead title="Chapter 2: Hospital Daze - What a Journey" description="Navigating the early days of hospital recovery after a traumatic brain injury." path="/chapter-2" />

      {/* Cinematic hero — hospital room, Sarah at the bedside, the disorienting fog */}
      <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={chapter2Hero}
          alt="A dimly lit hospital room at night with a heart monitor glowing beside an empty bed, the silhouette of Michael's wife Sarah keeping vigil — the disorienting haze of post-traumatic amnesia."
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[fade-in_1.6s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,15,0.55)_100%)]" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-[18%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[float_6s_ease-in-out_infinite] opacity-60" />
          <div className="absolute top-1/3 left-[32%] w-1 h-1 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)] animate-[float_7s_ease-in-out_infinite_1s] opacity-50" />
          <div className="absolute top-2/3 left-[24%] w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.8)] animate-[float_8s_ease-in-out_infinite_2s] opacity-55" />
          <div className="absolute top-1/2 left-[48%] w-1 h-1 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.7)] animate-[float_9s_ease-in-out_infinite_3s] opacity-45" />
          <div className="absolute bottom-1/4 right-[32%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[float_7s_ease-in-out_infinite_4s] opacity-50" />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5 animate-fade-in">
              <div className="h-px w-12 bg-amber-400/60" />
              <p className="text-amber-300/90 text-xs md:text-sm tracking-[0.4em] uppercase font-light">
                Chapter Two · The First Hours
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl animate-fade-in leading-[1.05]">
              Hospital Daze
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-white/85 italic max-w-2xl animate-fade-in font-serif leading-relaxed">
              "What the hell happened?" — A dry rasp, barely audible, even to myself.
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-200/60 animate-[float_3s_ease-in-out_infinite]">
          <span className="text-[10px] tracking-[0.3em] uppercase">Read</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* Ambient ember field */}
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

        {/* Glassmorphic editorial card */}
        <article className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_60px_rgba(245,158,11,0.08)] p-8 md:p-14 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-amber-300/70 text-xs tracking-[0.4em] uppercase mb-4 text-center">Chapter Two</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-center text-white mb-3">
              Hospital Daze
            </h2>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px w-8 bg-amber-400/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <div className="h-px w-8 bg-amber-400/40" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.85] prose-p:font-light">
              <p className="first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1">
              My world swam back into focus, not with a gentle sunrise, but with the harsh, insistent beeping of a monitor. My head throbbed, a relentless drum solo that echoed the frantic rhythm of my heart. I was in a bed, in a room that smelled of antiseptic and something else… fear? My own, I realized. Panic clawed its way up my throat. "What the hell happened?" The words were a dry rasp in my throat, barely audible even to myself.
            </p>

            <p>
              Then I saw her, Sarah. Her eyes, usually sparkling with laughter, were wide with a fear I'd rarely seen before. Her face was pale, drawn tight with worry. She looked exhausted, like she had been crying for hours. In that instant, the carefree joy of Australia Day evaporated, replaced by a chilling certainty: something was very, very wrong.
            </p>

            <p>
              "Post-traumatic amnesia," the doctor called it. A clinical term for a common symptom of traumatic brain injury. It did little to explain the gaping hole in my memory. I had no recollection of the accident, no memory of how I'd ended up here. It was like my brain had hit a reset button, wiping out a crucial chunk of time. They almost sent me home that day. Can you believe it? No tests, no scans, just a pat on the head and a "You'll be right, mate." If it weren't for one doctor, and for Sarah's unwavering insistence, I might have walked out of there with three major skull fractures and multiple minor ones, none the wiser.
            </p>

            <blockquote className="not-prose my-10 border-l-2 border-amber-400/60 pl-6 py-2">
              <p className="text-xl md:text-2xl font-serif italic text-amber-100/90 leading-relaxed">
                "Sarah, my rock, she wouldn't back down. She questioned, she pushed, she demanded answers when I was in no condition to string a coherent sentence together."
              </p>
            </blockquote>

            <p>
              One doctor, out of all the staff in that bustling emergency room, saw something that made him pause. He listened, really listened, when Sarah described what she'd been told by our friends who witnessed the accident. She hadn't seen the fall herself, but she relayed the details with a fierce urgency, painting a picture of the impact, the way I'd been flung from the board. He ordered more scans, refusing to dismiss the persistent headache and the growing confusion that clouded my thoughts. Thank God he did. Sarah, my rock, she wouldn't back down. She questioned, she pushed, she demanded answers when I was in no condition to string a coherent sentence together.
            </p>

            <p>
              The hospital days that followed are mostly a blur. A hazy montage of hushed conversations, the rhythmic beeping of machines, and the constant, throbbing pain in my head. I drifted in and out of consciousness, catching snippets of conversations, the concerned faces of my wife and friends, the sterile smell of the hospital. It was all so disorienting, like being trapped in a fog I couldn't escape.
            </p>

            <p>
              Those scans, the ones that almost didn't happen, revealed the truth: three major skull fractures, a spiderweb of smaller ones. It was later confirmed that I had suffered a traumatic brain injury (TBI). I was later told by my ENT specialist just how lucky I was. He explained how one of the fractures was dangerously close to a nerve that controlled facial movement. A hair's breadth either way, and my face might have been paralysed. He also confirmed that I was lucky to have retained my hearing, considering the damage to my inner ear. It was a sobering thought.
            </p>

            <p className="text-amber-100/90 italic">
              Looking back, those hazy hospital days feel like a lifetime ago. The fear, the uncertainty, the pain—it's all a blur now. But I'll never forget the one doctor who saw beyond the obvious and the unwavering strength of my wife, who fought for me when I couldn't fight for myself. They are two of the reasons I'm still here today, able to tell this story.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-white/10">
              <Button asChild variant="outline" className="border-amber-400/30 bg-transparent text-amber-100 hover:bg-amber-400/10 hover:border-amber-400/60 hover:text-amber-50 transition-all duration-300">
                <Link to="/chapter-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Chapter
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-[1.02]">
                <Link to="/chapter-3">
                  Next Chapter
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

export default Chapter2;