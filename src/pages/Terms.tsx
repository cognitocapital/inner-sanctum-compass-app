import { Link } from "react-router-dom";
import { ArrowLeft, ScrollText, AlertTriangle, Ban, Scale, RefreshCw, Mail } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const CONTACT_EMAIL = "hello@whatajourney.app";
const EFFECTIVE = "26 June 2026";

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
      <h2 className="font-serif text-xl sm:text-2xl text-white leading-snug pt-1">{title}</h2>
    </div>
    <div className="space-y-3 text-[14.5px] leading-relaxed text-white/70 [&_strong]:text-white/90 [&_a]:text-amber-200 [&_a]:underline">
      {children}
    </div>
  </section>
);

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <SEOHead
        title="Terms of Service — What a Journey"
        description="Terms of service for What a Journey, the Phoenix Journey TBI recovery platform."
        path="/terms"
      />
      <header className="border-b border-white/10 px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">Terms of Service</h1>
          <p className="text-white/50 text-sm">Effective {EFFECTIVE}</p>
          <p className="mt-4 text-white/70 leading-relaxed">
            Welcome. These terms cover your use of <strong>What a Journey</strong> (the
            "Phoenix Journey" app) — a beta prototype supporting people recovering from
            traumatic brain injury. By using the app, you agree to what's below.
          </p>
        </div>

        <Section icon={ScrollText} title="What this app is">
          <p>
            What a Journey is an <strong>educational and self-help companion</strong>. It
            includes audio narration of a personal recovery memoir, guided exercises,
            check-ins, soundscapes, and an AI companion for conversational support.
          </p>
          <p>
            This is a <strong>beta prototype in live testing</strong>. Features may
            change, data may be reset, and outages may occur without notice.
          </p>
        </Section>

        <Section icon={AlertTriangle} title="Not medical advice">
          <p>
            Nothing in the app is medical, psychological, or clinical advice, diagnosis,
            or treatment. It does <strong>not replace</strong> your treating team. Always
            consult a qualified clinician before starting protocols — especially{" "}
            <strong>cold exposure</strong> (cardiovascular and vestibular risks) and
            <strong> physical exercises after a brain injury</strong>.
          </p>
          <p>
            If you are in crisis, contact <strong>Lifeline 13 11 14</strong> (Australia,
            24/7) or your local emergency number. In immediate danger, call{" "}
            <strong>000</strong>.
          </p>
          <p>
            See our <Link to="/disclaimer">full disclaimer</Link> for protocol-specific
            safety information.
          </p>
        </Section>

        <Section icon={Ban} title="Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the app to harm yourself or others, or to bypass clinical care.</li>
            <li>Attempt to access another user's data, reverse-engineer the app, or interfere with security controls.</li>
            <li>Upload unlawful, abusive, or infringing content.</li>
            <li>Submit content you don't have the right to share, or that identifies a third party without their consent.</li>
            <li>Use the AI companion to obtain instructions for self-harm or illegal activity.</li>
          </ul>
          <p>
            We may suspend or remove access at any time if these rules are broken or if
            we need to protect users.
          </p>
        </Section>

        <Section icon={Scale} title="Your account & content">
          <p>
            You are responsible for keeping your sign-in credentials safe. You own the
            content you enter (journal entries, check-ins, assessment responses). You
            grant us a limited licence to store and process that content solely to
            operate the app for you and any clinicians you explicitly invite.
          </p>
          <p>
            You can export your data or delete your account at any time from{" "}
            <Link to="/settings">Settings</Link>. Deletion is irreversible.
          </p>
        </Section>

        <Section icon={ScrollText} title="AI companion">
          <p>
            Messages with the AI companion are processed by a third-party AI model to
            generate replies and are logged for your continuity. Replies are
            machine-generated and may be inaccurate, incomplete, or out of date. They are
            not professional advice. We do not use your conversations to train AI
            models. If you mention crisis-level distress, your linked clinician (if any)
            may receive an alert.
          </p>
        </Section>

        <Section icon={Scale} title="Liability">
          <p>
            To the maximum extent permitted by law, the app is provided{" "}
            <strong>"as is"</strong> without warranties of any kind. We are not liable
            for indirect, incidental, or consequential loss, or for any decision you make
            based on app content. Nothing in these terms limits rights you have under the
            Australian Consumer Law that can't be excluded.
          </p>
        </Section>

        <Section icon={Scale} title="Governing law">
          <p>
            These terms are governed by the laws of New South Wales, Australia. Disputes
            will be handled in Australian courts of competent jurisdiction.
          </p>
        </Section>

        <Section icon={RefreshCw} title="Changes">
          <p>
            We may update these terms as the app evolves. We'll update the effective date
            above. If changes are material, we'll surface a notice in the app.
          </p>
        </Section>

        <Section icon={Mail} title="Contact">
          <p>
            Questions, feedback, or legal notices:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
          <p className="text-xs text-white/40 mt-4">
            This is general information, not legal advice.
          </p>
        </Section>
      </main>
    </div>
  );
};

export default Terms;