import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Lock,
  Stethoscope,
  Sparkles,
  Download,
  Trash2,
  Mail,
  Heart,
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const CONTACT_EMAIL = "privacy@whatajourney.app";

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-orange-300" />
      </div>
      <h2 className="font-serif text-xl sm:text-2xl text-white leading-snug pt-1">
        {title}
      </h2>
    </div>
    <div className="space-y-3 text-[14.5px] leading-relaxed text-white/70 [&_strong]:text-white/90 [&_a]:text-amber-200 [&_a]:underline [&_a]:underline-offset-2">
      {children}
    </div>
  </section>
);

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <SEOHead
        title="Your Privacy — What a Journey"
        description="Plain-English privacy notes for the What a Journey TBI recovery app: what we store, who can see it, how AI is used, and how to export or delete your data."
        path="/privacy"
      />

      <Link
        to="/dashboard"
        className="fixed top-5 left-5 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-24 pb-20 space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-[10px] tracking-[0.45em] uppercase text-orange-300/70">
            Privacy & Your Data
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight">
            Your story belongs to you
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed">
            Recovery is personal. Below is a plain-English explanation of what
            we store, where it lives, who can see it, and how to take it back
            at any time. No jargon. No surprises.
          </p>
        </header>

        <Section icon={Database} title="What we store">
          <p>When you use the app, we keep the following on your behalf:</p>
          <ul className="list-disc list-outside pl-5 space-y-1.5 marker:text-orange-400/60">
            <li>
              <strong>Your profile</strong> — display name, recovery goals,
              injury type/date (if you shared it), symptoms, and preferences.
            </li>
            <li>
              <strong>Daily check-ins</strong> — mood, energy, sleep, pain,
              and any short notes you add.
            </li>
            <li>
              <strong>Journal &amp; "My Phoenix Chapters" entries</strong> —
              your written reflections.
            </li>
            <li>
              <strong>Assessment results</strong> — PHQ-9, GAD-7, GOSE, RPQ,
              NSI, PCL-5 and similar instruments you complete.
            </li>
            <li>
              <strong>Protocol progress</strong> — quests completed, sessions
              logged, streaks, and XP.
            </li>
            <li>
              <strong>AI companion conversations</strong> — your messages and
              Phoenix's replies (table: <code className="text-amber-200/90 text-[12.5px] bg-white/5 px-1.5 py-0.5 rounded">ai_companion_logs</code>),
              so the conversation can continue across sessions.
            </li>
          </ul>
          <p className="text-white/55 text-[13px]">
            Some progress data (audio position, last-read chapter, soundscape
            settings) is also kept locally on your device for offline use.
          </p>
        </Section>

        <Section icon={Lock} title="Where your data lives">
          <p>
            Everything above is stored in our managed database (Supabase),
            currently hosted in the <strong>ap-southeast-2 (Sydney)</strong>{" "}
            region.
          </p>
          <p>
            Every personal table is protected by{" "}
            <strong>row-level security</strong>. In plain English: the database
            itself enforces that <em>only you</em> — and clinicians you have
            explicitly invited — can read your records. Other users on the
            platform cannot see your check-ins, journal, assessments, or
            companion chats. Ever.
          </p>
        </Section>

        <Section icon={Stethoscope} title="Sharing with a clinician">
          <p>
            Clinician access is <strong>opt-in and revocable</strong>. To share
            your progress with a treating neurologist, OT, speech pathologist
            or care coordinator:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1.5 marker:text-orange-400/60">
            <li>
              You generate a one-time <strong>invite code</strong> from your
              account, and give it to them directly.
            </li>
            <li>
              When they accept, a link is created in{" "}
              <code className="text-amber-200/90 text-[12.5px] bg-white/5 px-1.5 py-0.5 rounded">patient_clinician_links</code>{" "}
              with the scope <em>you</em> chose.
            </li>
            <li>
              You can <strong>revoke access at any time</strong> from
              Settings — the link is closed immediately and they lose the
              ability to view future data.
            </li>
          </ul>
          <p>
            <strong>What a linked clinician can see:</strong> check-ins,
            assessment results, protocol progress, and crisis-related red
            flags (see below).
          </p>
          <p>
            <strong>What they cannot see by default:</strong> your private
            journal entries. Journals stay yours unless you explicitly opt
            them in.
          </p>
        </Section>

        <Section icon={Sparkles} title="How the AI companion uses your data">
          <p>
            The Phoenix companion is built to walk beside you. When you send a
            message:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1.5 marker:text-orange-400/60">
            <li>
              Your message — and a short context summary (recent check-ins,
              streak, goals) — is sent to a third-party AI model to generate a
              reply.
            </li>
            <li>
              The full conversation is saved to your account so Phoenix can
              remember context next time you open it.
            </li>
            <li>
              Your messages are <strong>not used to train AI models</strong>.
              They are processed to generate <em>your</em> reply and then
              stored only against your account.
            </li>
            <li>
              If a message contains content suggesting a crisis — for example
              suicidal thoughts, self-harm, or a medical emergency — a{" "}
              <strong>red-flag event</strong> is recorded, and if you have an
              active clinician link an alert may be sent to them so they can
              follow up. This is a safety feature, not a surveillance one. The
              companion will also gently share Australian crisis contacts
              (Lifeline 13 11 14, Suicide Call Back Service 1300 659 467, 000
              for immediate danger).
            </li>
          </ul>
        </Section>

        <Section icon={Download} title="Your controls">
          <p>You're in charge of your data. From{" "}
            <Link to="/settings">Settings</Link> you can:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-1.5 marker:text-orange-400/60">
            <li>
              <strong>Export a clinical report</strong> (HTML you can
              print/save as PDF) or the raw JSON of your records — useful for
              your medical team or for your own records.
            </li>
            <li>
              <strong>Revoke any clinician link</strong> — instant, no
              questions asked.
            </li>
            <li>
              <strong>Delete your account</strong> — this runs the{" "}
              <code className="text-amber-200/90 text-[12.5px] bg-white/5 px-1.5 py-0.5 rounded">delete-account</code>{" "}
              function and permanently erases your profile, check-ins,
              journal, quests, assessments, AI companion history, brain scans
              and progress. There is no recovery after deletion.
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-200 text-[13px] px-3 py-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export my data
            </Link>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white/75 text-[13px] px-3 py-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete my account
            </Link>
          </div>
        </Section>

        <Section icon={ShieldCheck} title="A few honest notes">
          <p>
            <strong>This is general information, not legal advice.</strong>{" "}
            It's written to be understandable, not exhaustive. If you need a
            formal data-protection determination — for example for an
            insurer, employer, or regulator — please speak to a qualified
            adviser.
          </p>
          <p>
            What a Journey is a <strong>beta prototype</strong> in live
            testing. We try hard to keep your data safe, but no online system
            is risk-free. Please don't store anything here that you would not
            be willing to share with a treating clinician.
          </p>
          <p>
            Phoenix is a companion, not a clinician. It does not diagnose, and
            it is not a substitute for emergency care. If you or someone with
            you is in immediate danger, please call 000.
          </p>
        </Section>

        <Section icon={Mail} title="Questions?">
          <p>
            For privacy questions, data requests, or to report a concern,
            email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We'll get
            back to you as soon as we can.
          </p>
        </Section>

        <p className="text-center text-white/40 text-[12px] pt-4 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-orange-400/70" aria-hidden="true" />
          Written with care, in plain English. Last updated June 2026.
        </p>
      </div>
    </div>
  );
};

export default Privacy;