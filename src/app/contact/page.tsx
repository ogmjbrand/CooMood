"use client";

import { useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero eyebrow="Get in Touch" title="Contact CooMood" description="Questions about an order, a custom fragrance, or a partnership? We'd love to hear from you." />
      <div className="container-fluid grid grid-cols-1 gap-14 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <InfoRow icon={Phone} label="Phone" value="+1 (773) 621-0630" />
          <InfoRow icon={Mail} label="Email" value="hello@coomood.com" />
          <InfoRow icon={MessageCircle} label="Live Chat" value="Available 9am–6pm CT, Mon–Fri" />
          <div className="rounded-[2rem] bg-ink p-8 text-cream">
            <p className="font-display text-xl">Founder</p>
            <p className="mt-1 font-sans text-sm text-cream/60">Damien Cooper</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4 rounded-[2rem] bg-white p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" required />
            <Field label="Email" type="email" required />
          </div>
          <Field label="Subject" required />
          <label className="block">
            <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">
              Message
            </span>
            <textarea
              required
              rows={6}
              className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-ink px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] text-cream transition-transform hover:scale-[1.02]"
          >
            Send Message
          </button>
          {sent && (
            <p className="font-sans text-xs text-gold-dark">
              Thank you — we&apos;ll be in touch within one business day.
            </p>
          )}
        </form>
      </div>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
        <Icon size={18} />
      </span>
      <div>
        <p className="font-sans text-xs uppercase tracking-wide text-ink/40">{label}</p>
        <p className="font-sans text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}
