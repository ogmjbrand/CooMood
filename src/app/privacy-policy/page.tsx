import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <div className="container-fluid max-w-3xl space-y-6 pb-24 font-sans text-sm leading-relaxed text-ink/70">
        <p>Last updated: July 2026</p>
        <p>
          CooMood (&quot;we&quot;, &quot;us&quot;) collects the information you provide when you
          create an account, place an order, build a custom fragrance, or contact us — including
          your name, email, shipping address, and payment details processed securely through Stripe.
        </p>
        <h2 className="font-display text-2xl text-ink">How We Use Your Information</h2>
        <p>
          We use your data to fulfill orders, provide customer support, personalize product
          recommendations, and — with your consent — send marketing communications. We never sell
          your personal information to third parties.
        </p>
        <h2 className="font-display text-2xl text-ink">Cookies & Analytics</h2>
        <p>
          We use cookies and tools such as Google Analytics and the Meta Pixel to understand site
          usage and improve your experience. You can disable cookies in your browser settings.
        </p>
        <h2 className="font-display text-2xl text-ink">Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any time by
          contacting hello@coomood.com.
        </p>
      </div>
    </>
  );
}
