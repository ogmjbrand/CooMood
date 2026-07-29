"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (!data.session) {
      setNotice("Check your email to confirm your account, then sign in.");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <>
      <PageHero eyebrow="My Account" title="Create Your Account" />
      <div className="container-fluid pb-24">
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 rounded-[2rem] bg-white p-8">
          <Field label="Full Name" value={fullName} onChange={setFullName} required autoComplete="name" />
          <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
            autoComplete="new-password"
          />
          {error && <p className="font-sans text-sm text-cherry">{error}</p>}
          {notice && <p className="font-sans text-sm text-gold-dark">{notice}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream disabled:opacity-50"
          >
            {loading ? "Creating Account…" : "Create Account"}
          </button>
          <p className="text-center font-sans text-sm text-ink/50">
            Already have an account?{" "}
            <Link href="/login" className="text-ink underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">
        {label}
      </span>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}
