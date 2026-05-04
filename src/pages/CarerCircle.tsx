import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Users,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ExternalLink,
  Flame,
  HandHeart,
  AlertTriangle,
  MessageCircle,
  Compass,
  Clock,
  Eye,
  Phone,
  CloudFog,
  Volume2,
  Moon,
  Coffee,
  MessageSquare,
  Ban,
  CheckCircle2,
  Battery,
  Hand,
  Lightbulb,
  Activity,
  Utensils,
  Bed,
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import carerCircleHero from "@/assets/carer-circle-hero.jpg";

const X_URL = "https://x.com/WhatajourneyTBI";
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const CarerCircle = () => {
  const navigate = useNavigate();
  const [openGuide, setOpenGuide] = useState<string | null>("first-30-days");
  useEffect(() => { window.scrollTo(0, 0); }, []);

  type Guide = {
    id: string;
    icon: typeof Compass;
    title: string;
    tag: string;
    subtitle: string;
    intro: string;
    sections: {
      heading: string;
      icon: typeof Compass;
      body: string;
      bullets?: { label: string; detail: string }[];
    }[];
    redFlags?: string[];
    closing: string;
  };

  const guides: Guide[] = [
    {
      id: "first-30-days",
      icon: Compass,
      title: "The First 30 Days After TBI",
      tag: "Field Guide · Acute Phase",
      subtitle: "A map for the month no one prepared you for.",
      intro:
        "The first thirty days after a brain injury are a blur of corridors, consent forms and quiet shock. Your loved one is still here — but the person you knew is somewhere underneath, finding their way back through fog. This guide is what we wish someone had handed us on day one.",
      sections: [
        {
          heading: "Week 1 — Survival & stabilisation",
          icon: ShieldCheck,
          body: "The medical team's job right now is to keep the brain safe from secondary injury (swelling, bleeding, oxygen drops). Your job is smaller than it feels — and more important than you'll know.",
          bullets: [
            { label: "Be a calm presence", detail: "Speak softly, identify yourself every time you enter the room. They may not respond — assume they hear you anyway." },
            { label: "Keep a single notebook", detail: "Names of doctors, medication times, questions you think of at 3am. Memory is the first thing to go for carers too." },
            { label: "Ask for the GCS score daily", detail: "Glasgow Coma Scale (3–15). It's the team's shorthand for how the brain is doing. Trends matter more than single numbers." },
            { label: "Protect the room", detail: "Dim lights, low voices, no TV. The injured brain treats every input as a threat." },
          ],
        },
        {
          heading: "Week 2 — Waking up is not what you think",
          icon: Eye,
          body: "Hollywood lied. People don't open their eyes and ask what year it is. Emergence from reduced consciousness is messy, agitated, and often distressing for families to witness.",
          bullets: [
            { label: "Post-Traumatic Amnesia (PTA) is normal", detail: "They may ask the same question every 90 seconds. They are not 'being difficult' — the hippocampus is offline. Answer kindly. Every time." },
            { label: "Agitation is a stage, not a personality change", detail: "Rancho Los Amigos Level IV is a recognised, temporary phase. It passes. Document it; don't take it personally." },
            { label: "Limit visitors to two at a time", detail: "Their brain is using 90% of its glucose just to be conscious. A crowded room is a neurological assault." },
          ],
        },
        {
          heading: "Weeks 3–4 — The first plateau",
          icon: Activity,
          body: "By now there's usually a transfer conversation: home, rehab unit, or step-down ward. This is when the system starts to thin out and you start to feel alone. Plan for it before it happens.",
          bullets: [
            { label: "Demand a written rehab plan", detail: "Ask for goals in plain language. 'Walk to the bathroom unaided by week 6' is a goal. 'Improve mobility' is not." },
            { label: "Get the discharge summary in your hand", detail: "GPs often don't receive it for weeks. You are the courier of your loved one's medical history now." },
            { label: "Start the benefits paperwork early", detail: "In the UK: PIP, ESA, Blue Badge. In the US: SSDI, FMLA for yourself. These take months. Start on day 21." },
          ],
        },
      ],
      redFlags: [
        "Sudden severe headache, vomiting, or one pupil larger than the other — call the team immediately.",
        "New seizure activity, even brief twitching of one limb.",
        "Dramatic personality shift in the days after discharge — fatigue or rebound bleed, not 'them being moody'.",
        "You haven't slept more than 4 hours in 48 — you are now also a patient. Tell someone.",
      ],
      closing:
        "Thirty days in, you will not recognise your own life. That is the correct response to what has happened. The person you love is still in there. So are you.",
    },
    {
      id: "fog-day",
      icon: CloudFog,
      title: "Spotting a Fog Day",
      tag: "Daily Practice · Recognition",
      subtitle: "The kindest thing you can do is notice early.",
      intro:
        "A 'Fog Day' is what survivors call the days when the brain's energy budget is already overdrawn by 9am. Reading them early — before the meltdown, before the silent shutdown — is the single highest-leverage skill a carer can develop.",
      sections: [
        {
          heading: "The early tells (before they know themselves)",
          icon: Eye,
          body: "Fog rarely announces itself. It leaks out sideways, in micro-behaviours that often look like rudeness or laziness if you don't know what you're seeing.",
          bullets: [
            { label: "Word-finding pauses", detail: "They reach for a familiar word and grab the one next to it. 'Pass me the… the… cold thing.' That's not vocabulary — that's bandwidth." },
            { label: "Flat affect", detail: "The face goes still. Not sad — empty. The brain has rerouted resources away from facial muscles." },
            { label: "Sensory irritability", detail: "The fridge hum is suddenly unbearable. Your jumper is 'too loud'. The world has gained volume they can't turn down." },
            { label: "Repetition loops", detail: "They re-tell you something you discussed an hour ago, with the same energy. Working memory has dropped a frame." },
          ],
        },
        {
          heading: "What to do in the next 10 minutes",
          icon: Hand,
          body: "Fog is reversible if you intervene early. Once it tips into a full crash, recovery takes 24–72 hours. Acting fast is not over-protective; it's good neuro-care.",
          bullets: [
            { label: "Lower the inputs", detail: "Lights down 50%. TV off. Phone face-down. One person speaking, not three." },
            { label: "Offer a horizontal 20", detail: "Twenty minutes flat on a bed (eyes closed, no scrolling) outperforms two hours of 'pushing through'. This is documented in TBI fatigue research." },
            { label: "Hand them water and one piece of fruit", detail: "Dehydration and low blood sugar amplify cognitive fatigue 3–4x. Don't ask. Place it in their hand." },
            { label: "Take over the next decision", detail: "'I've sorted dinner — pasta in 30, I'll bring it to you.' Removing one decision can buy back an hour of function." },
          ],
        },
        {
          heading: "What NOT to do",
          icon: Ban,
          body: "Most family responses to a Fog Day are well-meaning and neurologically harmful. These are the ones to unlearn.",
          bullets: [
            { label: "Don't ask 'are you okay?'", detail: "Answering that question itself takes energy they don't have. Instead: 'I'm dimming the lights, I'll be in the next room.'" },
            { label: "Don't suggest fresh air", detail: "Sunlight, traffic, and uneven pavements are an obstacle course for a fogged brain. Movement comes after rest, not instead of it." },
            { label: "Don't take silence personally", detail: "Withdrawal during fog is conservation, not rejection. Sit nearby. Don't require conversation." },
            { label: "Don't reschedule on their behalf without telling them", detail: "Loss of agency is its own neurological wound. Offer the option, then act." },
          ],
        },
      ],
      redFlags: [
        "Slurred speech that wasn't there an hour ago.",
        "Sudden severe headache different from their usual fatigue headache.",
        "Confusion about where they are or what year it is.",
        "Any new seizure, twitching, or loss of awareness — call the medical team.",
      ],
      closing:
        "You are not their nurse, their therapist, or their fixer. You are the person who notices the lights are too bright before they have to ask. That is enough. That is everything.",
    },
    {
      id: "show-up-well",
      icon: HandHeart,
      title: "How to Show Up Well",
      tag: "Communication · Scripts & Boundaries",
      subtitle: "Practical language for the conversations no one teaches you.",
      intro:
        "Showing up well isn't about saying the perfect thing. It's about saying fewer, smaller, truer things — and learning the difference between rescuing and supporting. Below are the scripts we wish we'd had.",
      sections: [
        {
          heading: "What to say (and what to retire forever)",
          icon: MessageSquare,
          body: "TBI survivors hear the same handful of phrases on loop. Some are quietly devastating. Try the alternates.",
          bullets: [
            { label: "Instead of: 'You look great!'", detail: "Try: 'It's good to see you.' (Looking 'fine' is the curse of invisible injury — it invalidates everything they're managing internally.)" },
            { label: "Instead of: 'Have you tried…?'", detail: "Try: 'What's been helping lately?' (They've tried it. Whatever it is. Twice.)" },
            { label: "Instead of: 'At least you survived.'", detail: "Try: 'I can't imagine. I'm here.' (Survival is not a consolation prize for the life they had.)" },
            { label: "Instead of: 'When will you be back to normal?'", detail: "Try: 'What does a good day look like for you now?' (Normal is gone. New is being built.)" },
          ],
        },
        {
          heading: "Rescuing vs supporting — the line",
          icon: Lightbulb,
          body: "Rescuing feels like love and slowly erodes their recovery. Supporting feels like restraint and rebuilds their agency. The difference is who holds the wheel.",
          bullets: [
            { label: "Rescuing", detail: "'I'll just do it, it's faster.' / Finishing their sentences. / Speaking for them at appointments. / Hiding bills, news, decisions 'to protect them'." },
            { label: "Supporting", detail: "'Take your time.' / 'Want me to come to the appointment as your second pair of ears, or wait outside?' / 'Here's the letter — read it when you have spoons. I'm not going anywhere.'" },
            { label: "The test", detail: "After your help, do they feel more capable or more dependent? The honest answer is the diagnostic." },
          ],
        },
        {
          heading: "Energy boundaries — yours and theirs",
          icon: Battery,
          body: "TBI runs on a finite daily energy envelope (the 'spoon theory' is genuinely useful here). Your job is not to refill it for them — it's to help them spend it on what matters.",
          bullets: [
            { label: "The morning question", detail: "'What's the one thing today, if it happens, will be a good day?' Then protect that one thing." },
            { label: "The 'no' on their behalf", detail: "Pre-agree a phrase: 'They'd love to but they're resting today.' You become their bouncer, not their warden." },
            { label: "The repair conversation", detail: "When you snap (you will): 'That came out sharp. I'm tired. It wasn't about you.' Repair beats restraint." },
          ],
        },
      ],
      closing:
        "You will get this wrong. Often. The people who show up well are not the ones who say perfect things — they're the ones who keep showing up after they get it wrong.",
    },
    {
      id: "looking-after-yourself",
      icon: ShieldCheck,
      title: "Looking After Yourself",
      tag: "Self-care · Carer Survival",
      subtitle: "Your wellbeing is not separate from their recovery. It IS their recovery.",
      intro:
        "Carer fatigue is not a soft concept — it's a measurable physiological state with documented immune, cardiovascular and cognitive consequences. If you collapse, two people need rescuing. This is the maintenance manual for the person holding the lantern.",
      sections: [
        {
          heading: "The non-negotiable four",
          icon: CheckCircle2,
          body: "Everything else is optional. These four are the floor — drop below any of them for more than a week and your nervous system starts making decisions for you.",
          bullets: [
            { label: "Sleep — 6 hours minimum, ideally 7", detail: "Not 'in the same bed in case they need me'. Actual sleep. Recruit a night-relief person, even if it's twice a week. Sleep deprivation makes you a worse carer than you'd be at 70% rested." },
            { label: "One hot meal a day, sitting down", detail: "Carers chronically under-eat or graze on what's left on the patient's plate. Set a 6pm timer. Sit. Chew." },
            { label: "20 minutes outside, daylight on your face", detail: "Cortisol regulation, vitamin D, mood — three for the price of one walk to the corner shop without your phone." },
            { label: "One human a week who isn't talking about the injury", detail: "A friend, a colleague, a sibling. Twenty minutes of conversation about anything else. This is not selfish. This is identity maintenance." },
          ],
        },
        {
          heading: "The warning signs you've gone too far",
          icon: AlertTriangle,
          body: "Carer burnout has a recognisable progression. Catching it at stage two is the difference between a tough month and a six-month collapse.",
          bullets: [
            { label: "Stage 1 — Hyper-vigilance", detail: "Checking on them constantly. Sleeping in clothes. Phone always in hand. Feels like devotion. Is actually adrenal." },
            { label: "Stage 2 — Resentment leaks", detail: "Snapping at the kids, the dog, the kettle. Crying in the car park. This is the warning shot. Listen to it." },
            { label: "Stage 3 — Numbness", detail: "You stop feeling much of anything. You go through motions. This is the body protecting itself. It is not virtue — it is a medical sign." },
            { label: "Stage 4 — Physical collapse", detail: "Shingles, persistent infections, chest pain, panic attacks. The body sends the bill. Get to a GP. Today." },
          ],
        },
        {
          heading: "Building your own circle",
          icon: Users,
          body: "You need three categories of human in your life right now. Most carers have one. Audit honestly.",
          bullets: [
            { label: "A practical lieutenant", detail: "Someone who picks up prescriptions, sits with your loved one for 2 hours, drives to appointments. Doesn't need to be emotionally close — needs to be reliable." },
            { label: "A safe witness", detail: "One person you can say the unsayable thing to. ('I love them and I am exhausted and sometimes I imagine running away.') A friend, a counsellor, a peer carer. Not your kids. Not them." },
            { label: "A professional", detail: "GP, therapist, or carer-support worker (Headway, Family Caregiver Alliance, BIAA all offer this free). Booked in your diary, not 'when I have time'." },
          ],
        },
        {
          heading: "The grief no one warned you about",
          icon: Heart,
          body: "You are grieving someone who is still alive. This is called 'ambiguous loss' and it is one of the hardest forms of grief there is. It is real. Name it.",
          bullets: [
            { label: "It's not disloyal to mourn", detail: "Missing the person they were before doesn't betray the person they are now. Both can be true. Both usually are." },
            { label: "It comes in waves, not stages", detail: "A song, a smell, a photo will knock you sideways months in. This is not regression — this is grief doing its work." },
            { label: "It changes shape", detail: "What you grieve at 3 months is different from 3 years. Recovery includes learning to love a new version of the same person." },
          ],
        },
      ],
      redFlags: [
        "Thoughts of harming yourself — call your local crisis line immediately. UK: 116 123 (Samaritans). US: 988.",
        "Drinking more than usual to 'cope' for more than two weeks running.",
        "Chest pain, persistent palpitations, or breathlessness — A&E, not 'I'll see if it passes'.",
        "You haven't been touched, hugged, or held in over a month — this is a clinical issue, not a weakness.",
      ],
      closing:
        "There is a reason flight attendants tell you to fit your own oxygen mask first. It isn't selfish. It is the only way the person beside you survives.",
    },
  ];

  const supportPaths = [
    {
      icon: Users,
      title: "Peer Carer Circle",
      description: "Connect with other carers walking this same road. You don't have to figure this out alone.",
      cta: "Join the circle",
      href: X_URL,
      external: true,
    },
    {
      icon: BookOpen,
      title: "Read Their Story",
      description: "Michael's manuscript was written so the people who love survivors could finally understand what's happening inside.",
      cta: "Open the book",
      href: "/dedication",
      external: false,
    },
    {
      icon: MessageCircle,
      title: "Ask Phoenix",
      description: "A judgement-free AI companion trained on the manuscript. Ask anything — at 3am if you have to.",
      cta: "Start a conversation",
      href: "/ai-companion",
      external: false,
    },
  ];

  const lifelines = [
    { name: "Brain Injury Association of America", website: "https://www.biausa.org", focus: "National helpline & carer resources" },
    { name: "Headway UK", website: "https://www.headway.org.uk", focus: "Carer support, helpline 0808 800 2244" },
    { name: "BrainLine — For Caregivers", website: "https://www.brainline.org/caregivers", focus: "Curated TBI carer education" },
    { name: "Family Caregiver Alliance", website: "https://www.caregiver.org", focus: "Burnout, respite & wellbeing tools" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-orange-950/30 text-white relative overflow-hidden">
      <SEOHead
        title="The Carer Circle — What a Journey"
        description="A field guide and community for the people who carry TBI survivors — partners, parents, friends and quiet allies."
        path="/circle"
      />

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col">
        <img
          src={carerCircleHero}
          alt="Two silhouetted figures sitting close on a hillside under a starlit sky, sharing a glowing lantern between them — a phoenix constellation faintly traced in the stars above."
          className="absolute inset-0 w-full h-full object-cover object-center animate-[fade-in_1.6s_ease-out]"
          loading="eager"
          width={1920}
          height={1080}
        />

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Drifting embers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] left-[18%] w-1.5 h-1.5 bg-orange-400 rounded-full opacity-80 shadow-[0_0_12px_4px_rgba(251,146,60,0.6)] animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[40%] right-[22%] w-1 h-1 bg-amber-300 rounded-full opacity-70 shadow-[0_0_10px_3px_rgba(252,211,77,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[58%] left-[30%] w-2 h-2 bg-orange-500 rounded-full opacity-60 shadow-[0_0_14px_5px_rgba(249,115,22,0.5)] animate-[float_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[68%] right-[28%] w-1 h-1 bg-amber-400 rounded-full opacity-55 shadow-[0_0_10px_3px_rgba(245,158,11,0.5)] animate-[float_7s_ease-in-out_infinite_0.5s]" />
        </div>

        {/* Back button */}
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/resources"))}
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Editorial title block */}
        <div className="relative z-10 mt-auto px-6 md:px-16 pb-16 md:pb-24 animate-[fade-in_2s_ease-out_0.4s_both]">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs md:text-sm font-light uppercase mb-4 inline-flex items-center gap-2">
              <Flame className="h-3.5 w-3.5" style={{ filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8))" }} />
              For the people who carry us
            </p>
            <h1 className="font-serif font-bold text-white text-5xl md:text-7xl leading-[1.02] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              The Carer Circle
            </h1>
            <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl font-light italic leading-relaxed mx-auto md:mx-0">
              You hold the lantern when they can't. This space is for partners, parents, children, friends and quiet allies — the unseen scaffolding of every recovery.
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
        {/* Manifesto */}
        <section className="animate-[fade-in_1s_ease-out]">
          <figure className="relative max-w-3xl mx-auto rounded-3xl border border-orange-400/25 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <Heart className="w-7 h-7 text-orange-300 mx-auto mb-5" />
              <blockquote className="font-serif text-xl md:text-2xl text-white/90 italic leading-relaxed">
                "Brain injury doesn't only happen to one person — it happens to everyone who loves them. If you're reading this, you are part of the recovery. You always have been."
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-[0.3em] uppercase text-orange-300/70">
                — Michael Heron
              </figcaption>
            </div>
          </figure>
        </section>

        {/* Field Guides */}
        <section>
          <div className="text-center mb-10">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 inline-flex items-center gap-2">
              <Compass className="h-3.5 w-3.5" />
              The Field Guide
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">What no one tells you</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
            <p className="mt-4 text-white/60 max-w-2xl mx-auto leading-relaxed">
              Honest, practical guidance written by survivors and the people who walked beside them.
            </p>
          </div>

          {/* Guide selector tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {guides.map((g) => {
              const active = openGuide === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setOpenGuide(g.id);
                    setTimeout(() => {
                      document.getElementById(`guide-${g.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm tracking-wide transition-all duration-300 border ${
                    active
                      ? "bg-orange-500/20 border-orange-400/60 text-white shadow-lg shadow-orange-500/10"
                      : "bg-white/[0.03] border-white/10 text-white/70 hover:border-orange-400/30 hover:text-white"
                  }`}
                >
                  <g.icon className="w-3.5 h-3.5" />
                  {g.title.replace("The ", "")}
                </button>
              );
            })}
          </div>

          {/* Full guides */}
          <div className="space-y-6">
            {guides.map((g) => {
              const open = openGuide === g.id;
              return (
                <article
                  key={g.id}
                  id={`guide-${g.id}`}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden hover:border-orange-400/30 transition-all duration-500"
                >
                  {/* Atmospheric glow */}
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header (always visible — collapsible trigger) */}
                  <button
                    onClick={() => setOpenGuide(open ? null : g.id)}
                    className="relative w-full text-left p-6 md:p-8 flex items-start gap-5"
                    aria-expanded={open}
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center">
                      <g.icon className="w-6 h-6 text-orange-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-orange-300/70 font-medium mb-1.5">{g.tag}</p>
                      <h3 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">{g.title}</h3>
                      <p className="text-sm md:text-base text-white/65 mt-2 italic font-light">{g.subtitle}</p>
                    </div>
                    <ChevronDown
                      className={`flex-shrink-0 w-5 h-5 text-white/50 mt-2 transition-transform duration-500 ${open ? "rotate-180 text-orange-300" : ""}`}
                    />
                  </button>

                  {/* Expanded body */}
                  {open && (
                    <div className="relative px-6 md:px-8 pb-8 md:pb-10 animate-[fade-in_0.5s_ease-out]">
                      <div className="md:ml-[76px] max-w-3xl">
                        {/* Intro */}
                        <div className="border-l-2 border-orange-400/40 pl-5 mb-8">
                          <p className="text-white/80 leading-relaxed text-base md:text-lg font-light">{g.intro}</p>
                        </div>

                        {/* Sections */}
                        <div className="space-y-8">
                          {g.sections.map((sec, i) => (
                            <div key={sec.heading}>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-white/5 border border-orange-400/20 flex items-center justify-center">
                                  <sec.icon className="w-4 h-4 text-orange-300" />
                                </div>
                                <span className="text-[10px] tracking-[0.3em] uppercase text-orange-300/60 font-medium">
                                  Chapter {String(i + 1).padStart(2, "0")}
                                </span>
                              </div>
                              <h4 className="font-serif text-xl md:text-2xl text-white font-semibold mb-3 leading-snug">
                                {sec.heading}
                              </h4>
                              <p className="text-white/70 leading-relaxed mb-5">{sec.body}</p>
                              {sec.bullets && (
                                <ul className="space-y-3">
                                  {sec.bullets.map((b) => (
                                    <li
                                      key={b.label}
                                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-orange-400/20 transition-colors"
                                    >
                                      <p className="text-sm font-semibold text-orange-200 mb-1">{b.label}</p>
                                      <p className="text-sm text-white/65 leading-relaxed">{b.detail}</p>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Red flags */}
                        {g.redFlags && (
                          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <p className="text-[10px] tracking-[0.3em] uppercase text-red-300 font-semibold">
                                Call for help if you see this
                              </p>
                            </div>
                            <ul className="space-y-2">
                              {g.redFlags.map((rf) => (
                                <li key={rf} className="flex gap-2 text-sm text-white/75 leading-relaxed">
                                  <span className="text-red-400 mt-1.5 flex-shrink-0">•</span>
                                  <span>{rf}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Closing */}
                        <figure className="mt-10 border-t border-white/10 pt-6">
                          <blockquote className="font-serif text-lg md:text-xl text-white/85 italic leading-relaxed">
                            "{g.closing}"
                          </blockquote>
                        </figure>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Support Paths */}
        <section>
          <div className="text-center mb-10">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 inline-flex items-center gap-2">
              <HandHeart className="h-3.5 w-3.5" />
              Stand Under the Torch
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">You don't carry this alone</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {supportPaths.map((s) => {
              const inner = (
                <div className="relative h-full">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/30 transition-colors duration-700" />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-orange-400/30 flex items-center justify-center mb-4">
                      <s.icon className="w-5 h-5 text-orange-300" />
                    </div>
                    <h3 className="font-serif text-xl text-white font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-white/65 leading-relaxed">{s.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-orange-200 group-hover:text-orange-100 tracking-wider uppercase">
                      {s.cta} {s.external ? <ExternalLink className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
              const className = "group relative rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/10 to-amber-500/5 backdrop-blur-xl p-6 md:p-7 hover:border-orange-300/50 hover:-translate-y-1 transition-all duration-500 overflow-hidden";

              return s.external ? (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {inner}
                </a>
              ) : (
                <Link key={s.title} to={s.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Lifelines (external orgs) */}
        <section>
          <div className="text-center mb-10">
            <p className="text-orange-300/80 tracking-[0.4em] text-xs font-light uppercase mb-3 inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Lifelines
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">Trusted carer organisations</h2>
            <div className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {lifelines.map((l) => (
              <a
                key={l.name}
                href={l.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-orange-400/40 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-white font-semibold">{l.name}</h3>
                    <p className="text-xs text-orange-300/80 mt-1 tracking-wide">{l.focus}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-orange-300 transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* X Community CTA */}
        <section>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-3xl border border-orange-400/30 bg-gradient-to-br from-orange-600/15 via-amber-500/10 to-rose-600/10 backdrop-blur-xl overflow-hidden hover:border-orange-300/60 transition-all duration-500"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 p-8 md:p-10">
              <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-white/10 border border-orange-400/40 flex items-center justify-center">
                <XIcon className="h-6 w-6 text-orange-300" />
              </div>
              <div className="flex-1">
                <p className="text-orange-300/80 tracking-[0.3em] text-xs font-light uppercase mb-2">The Torch Circle on X</p>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">@WhatajourneyTBI</h3>
                <p className="text-white/70 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                  Carers, survivors, clinicians and quiet allies — sharing the daily reality, the wins, and the small protocols that actually work.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 group-hover:bg-orange-400 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all group-hover:scale-105">
                  Follow & Join <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>
        </section>

        {/* Beta disclaimer */}
        <section className="pb-12">
          <div className="max-w-3xl mx-auto rounded-2xl border border-amber-400/20 bg-amber-500/[0.04] backdrop-blur-xl p-6 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-amber-300/80 mb-3 font-medium">Beta Prototype</p>
            <p className="text-sm text-white/60 leading-relaxed">
              The Carer Circle is in active beta with intentionally public demonstration content. It is a peer-support and educational resource — not a substitute for medical advice or professional caregiver counselling. If you or your loved one are in crisis, please contact a local emergency line or your healthcare team.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CarerCircle;
