import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Brain,
  Heart,
  BookOpen,
  Users,
  Star,
  Music,
  ChevronDown,
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import resourcesIllustration from "@/assets/resources-illustration.jpg";

const Resources = () => {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const featuredInfluencers = [
    {
      name: "Eckhart Tolle",
      description: "Spiritual teacher and author focusing on presence and consciousness",
      website: "https://eckharttolle.com/",
      focus: "Mindfulness, presence, and spiritual awakening",
      books: ["The Power of Now", "A New Earth"],
      impact: "Referenced in 'What a Journey' for teachings on presence and mindfulness",
    },
    {
      name: "Wim Hof",
      description: "Extreme athlete known for his breathing method and cold exposure techniques",
      website: "https://www.wimhofmethod.com",
      focus: "Breathing techniques, cold therapy, and mental resilience",
      books: ["The Wim Hof Method"],
      impact: "Referenced in 'What a Journey' for revolutionary breathing and resilience techniques",
    },
    {
      name: "Steven Kotler",
      description: "Flow researcher and peak performance expert",
      website: "https://www.stevenkotler.com",
      focus: "Flow states, peak performance, and human potential",
      books: ["The Art of Impossible", "Stealing Fire", "The Rise of Superman"],
      impact: "Referenced in 'What a Journey' for insights on achieving peak performance and flow states",
    },
  ];

  const tbiExperts = [
    { name: "Dr. Daniel Amen", description: "Psychiatrist and brain imaging pioneer. Author of 'Change Your Brain, Change Your Life'", website: "https://www.amenclinics.com", focus: "Brain SPECT imaging and optimization" },
    { name: "Dr. Mark Gordon", description: "TBI specialist focusing on hormone optimization for brain injury recovery", website: "https://www.tbimedlegal.com", focus: "Hormonal approaches to TBI treatment" },
    { name: "Dr. Norman Doidge", description: "Neuroplasticity researcher and author of 'The Brain That Changes Itself'", website: "https://www.normandoidge.com", focus: "Neuroplasticity and brain recovery" },
    { name: "Dr. Joe Dispenza", description: "Neuroscientist researching meditation and brain change", website: "https://drjoedispenza.com", focus: "Meditation and neuroplasticity" },
  ];

  const tbiAdvocates = [
    { name: "Amy Zellmer", description: "TBI survivor, advocate, and author. Founder of TBI Tribe", website: "https://www.amyzellmer.com", focus: "TBI awareness and survivor support" },
    { name: "Cavin Balaster", description: "TBI survivor and motivational speaker focusing on resilience", website: "https://www.cavinbalaster.com", focus: "TBI recovery and motivation" },
    { name: "Jeff Sebell", description: "TBI survivor, author of 'Traumatic Brain Injury: A Survival Guide'", website: "https://www.jeffsebell.com", focus: "TBI survival strategies" },
  ];

  const resilienceExperts = [
    { name: "Dr. Rick Hanson", description: "Neuropsychologist and author of 'Resilient'", website: "https://www.rickhanson.net", focus: "Building inner strength and resilience" },
    { name: "Dr. Martin Seligman", description: "Pioneer of positive psychology and resilience research", website: "https://www.authentichappiness.sas.upenn.edu", focus: "Positive psychology and well-being" },
    { name: "Dr. Kristin Neff", description: "Self-compassion researcher and mindfulness expert", website: "https://self-compassion.org", focus: "Self-compassion and emotional healing" },
    { name: "Dr. Jon Kabat-Zinn", description: "Creator of Mindfulness-Based Stress Reduction (MBSR)", website: "https://www.mindfulnesscds.com", focus: "Mindfulness and stress reduction" },
  ];

  const organizations = [
    { name: "Brain Injury Association of America", description: "National organization providing education, advocacy, and support", website: "https://www.biausa.org", focus: "TBI resources and advocacy" },
    { name: "TBI Tribe", description: "Community and resources for TBI survivors", website: "https://www.tbitribe.com", focus: "Survivor community and support" },
    { name: "BrainLine", description: "Comprehensive TBI information and resources", website: "https://www.brainline.org", focus: "TBI education and support" },
    { name: "Centre for Neuro Skills", description: "Specialized brain injury rehabilitation", website: "https://www.neuroskills.com", focus: "TBI rehabilitation services" },
  ];

  const books = [
    { title: "The Ghost in My Brain", author: "Clark Elliott", description: "A scientist's journey through concussion and recovery", focus: "Personal TBI recovery story" },
    { title: "My Stroke of Insight", author: "Dr. Jill Bolte Taylor", description: "A neuroanatomist's firsthand account of stroke recovery", focus: "Brain injury and neuroplasticity" },
    { title: "The Body Keeps the Score", author: "Dr. Bessel van der Kolk", description: "Understanding trauma's impact on the brain and body", focus: "Trauma recovery and healing" },
    { title: "Peak Performance", author: "Brad Stulberg & Steve Magness", description: "Science-based strategies for optimal performance and recovery", focus: "Performance optimization and resilience" },
  ];

  // Reusable cinematic section header
  const SectionHeader = ({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: React.ComponentType<{ className?: string }> }) => (
    <div className="text-center mb-10">
      <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 flex items-center justify-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">{title}</h2>
      <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
    </div>
  );

  // Reusable glassmorphic resource card
  const ResourceCard = ({ name, description, focus, website, cta = "Visit Website" }: { name: string; description: string; focus: string; website: string; cta?: string }) => (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-orange-400/40 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-orange-400/0 via-amber-300/0 to-orange-500/0 group-hover:from-orange-400/15 group-hover:via-amber-300/8 group-hover:to-orange-500/15 transition-all duration-500 pointer-events-none" />
      <div className="relative">
        <h3 className="font-serif font-semibold text-white text-lg leading-tight">{name}</h3>
        <p className="text-sm text-white/65 mt-2 leading-relaxed">{description}</p>
        <p className="text-xs text-orange-300/80 font-medium mt-3 tracking-wide">{focus}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-orange-300 group-hover:text-orange-200 transition-colors tracking-wider uppercase">
          {cta} <ExternalLink className="h-3 w-3" />
        </div>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-orange-900 text-white relative overflow-hidden">
      <SEOHead
        title="Growth Resources - What a Journey"
        description="Resources for TBI recovery and personal growth, curated by Michael Heron."
        path="/resources"
      />

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
        <img
          src={resourcesIllustration}
          alt="A luminous library at night with a winding lantern-lit path leading to an open glowing book on a pedestal — visual metaphor for the curated TBI recovery and growth resource library of What a Journey."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[35%] right-[20%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[55%] left-[25%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[45%] right-[30%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-[float_7s_ease-in-out_infinite_3s]" />
          <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full opacity-65 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute top-[75%] left-[40%] w-1 h-1 bg-amber-300 rounded-full opacity-55 shadow-[0_0_8px_3px_rgba(252,211,77,0.4)] animate-[float_6s_ease-in-out_infinite_2.5s]" />
        </div>

        {/* Back to home */}
        <Link
          to="/"
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          title="Back to Home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Editorial title block */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4">
              The Library · What a Journey
            </p>
            <h1 className="font-serif font-bold text-white text-5xl md:text-7xl leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              Growth Resources
            </h1>
            <p className="mt-6 text-white/75 text-base md:text-lg max-w-xl font-light italic leading-relaxed mx-auto md:mx-0">
              The teachers, healers, scientists and survivors whose work shaped the journey — curated for the road ahead of yours.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-[float_2.5s_ease-in-out_infinite]">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </section>
      {/* ============ END HERO ============ */}

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl space-y-20">

        {/* Phoenix Brain Compass — Premium Hero */}
        <section className="animate-[fade-in_1s_ease-out]">
          <div className="relative rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 rounded-2xl bg-amber-500/30 blur-xl" />
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-400/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)]">
                    <Brain className="h-10 w-10 text-amber-300" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/90 font-semibold">
                      Clinical Tier
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-amber-500/10 text-amber-200/90 border border-amber-500/30">
                      Beta — Not medical advice
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-2 tracking-tight">
                    Phoenix Brain Compass
                  </h2>
                  <p className="text-amber-300/80 italic text-sm md:text-base mb-5">Clinical Edition</p>
                  <p className="text-white/70 text-base leading-relaxed mb-6 max-w-2xl">
                    A 3D, evidence-informed atlas of the brain regions most affected by TBI — and exactly how those changes show up in daily life. Each region links back to a manuscript chapter and a recovery protocol you can practice today.
                  </p>
                  <Link
                    to="/brain-compass"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-semibold shadow-[0_0_24px_-6px_rgba(251,191,36,0.6)] transition-all hover:scale-105"
                  >
                    <Brain className="h-4 w-4" />
                    Launch Brain Compass
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Influences */}
        <section>
          <SectionHeader eyebrow="Touchstones" title='Featured Influences from "What a Journey"' icon={Star} />
          <div className="grid gap-6">
            {featuredInfluencers.map((influencer) => (
              <div key={influencer.name} className="group relative rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/8 via-white/[0.03] to-transparent backdrop-blur-xl p-7 md:p-8 hover:border-orange-400/40 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-white font-semibold">{influencer.name}</h3>
                    <p className="text-white/70 mt-2 leading-relaxed">{influencer.description}</p>
                    <p className="text-sm text-orange-300/90 font-medium mt-3 tracking-wide">{influencer.focus}</p>
                    <div className="mt-4">
                      <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1">Key Works</p>
                      <p className="text-sm text-white/75 italic">{influencer.books.join(" · ")}</p>
                    </div>
                    <blockquote className="mt-5 pl-4 border-l-2 border-orange-400/40 text-sm italic text-white/80 leading-relaxed">
                      {influencer.impact}
                    </blockquote>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href={influencer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
                    >
                      Explore Work <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TBI Medical Experts */}
        <section>
          <SectionHeader eyebrow="The Science" title="TBI Medical Experts & Researchers" icon={Brain} />
          <div className="grid md:grid-cols-2 gap-5">
            {tbiExperts.map((expert) => (
              <ResourceCard key={expert.name} {...expert} />
            ))}
          </div>
        </section>

        {/* TBI Advocates */}
        <section>
          <SectionHeader eyebrow="The Survivors" title="TBI Advocates & Survivor Stories" icon={Users} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tbiAdvocates.map((advocate) => (
              <ResourceCard key={advocate.name} {...advocate} cta="Learn More" />
            ))}
          </div>
        </section>

        {/* Resilience */}
        <section>
          <SectionHeader eyebrow="The Practice" title="Resilience & Mental Health Experts" icon={Heart} />
          <div className="grid md:grid-cols-2 gap-5">
            {resilienceExperts.map((expert) => (
              <ResourceCard key={expert.name} {...expert} cta="Explore Work" />
            ))}
          </div>
        </section>

        {/* Organizations */}
        <section>
          <SectionHeader eyebrow="The Network" title="Support Organizations & Communities" icon={Users} />
          <div className="grid md:grid-cols-2 gap-5">
            {organizations.map((org) => (
              <ResourceCard key={org.name} {...org} cta="Visit Organization" />
            ))}
          </div>
        </section>

        {/* Recommended Reading */}
        <section>
          <SectionHeader eyebrow="The Shelf" title="Recommended Reading" icon={BookOpen} />
          <div className="grid md:grid-cols-2 gap-5">
            {books.map((book) => (
              <div key={book.title} className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-orange-400/40 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1">
                <BookOpen className="h-5 w-5 text-orange-300/70 mb-3" />
                <h3 className="font-serif text-xl text-white font-semibold leading-tight">"{book.title}"</h3>
                <p className="text-sm text-orange-300/80 italic mt-1">by {book.author}</p>
                <p className="text-sm text-white/65 mt-3 leading-relaxed">{book.description}</p>
                <p className="text-xs text-orange-300/70 font-medium mt-3 tracking-wide uppercase">{book.focus}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Healing Soundscapes CTA */}
        <section>
          <Link to="/soundscapes" className="group relative block rounded-3xl border border-orange-400/30 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent backdrop-blur-xl overflow-hidden hover:border-orange-400/50 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 p-8 md:p-10">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center">
                <Music className="h-8 w-8 text-orange-300" />
              </div>
              <div className="flex-1">
                <p className="text-orange-300/80 tracking-[0.3em] text-xs font-light uppercase mb-2">Healing Module</p>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">Healing Soundscapes</h3>
                <p className="text-white/70 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                  Human-recorded 432 Hz, 528 Hz, Solfeggio & Tibetan singing bowl tracks for deep healing and nervous system reset.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 group-hover:bg-orange-400 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all group-hover:scale-105">
                  Explore <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Closing Note */}
        <section className="pb-12">
          <figure className="relative max-w-3xl mx-auto rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-8 md:p-12 text-center">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-4">A Reminder</p>
            <blockquote className="font-serif text-xl md:text-2xl text-white/90 italic leading-relaxed">
              Your journey is unique. While these resources offer valuable insight, every TBI recovery is different. What works for one may not work for another — always walk this road alongside your healthcare team.
            </blockquote>
            <figcaption className="mt-6 text-xs tracking-[0.3em] uppercase text-orange-300/70">
              — Michael Heron
            </figcaption>
          </figure>
        </section>
      </div>
    </div>
  );
};

export default Resources;