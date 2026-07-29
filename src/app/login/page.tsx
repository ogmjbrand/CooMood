"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <>
      <PageHero eyebrow="My Account" title="Welcome Back" />
      <div className="container-fluid pb-24">
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 rounded-[2rem] bg-white p-8">
          <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
          {error && <p className="font-sans text-sm text-cherry">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream disabled:opacity-50"
          >
            {loading ? "Signing In…" : "Sign In"}
          </button>
          <p className="text-center font-sans text-sm text-ink/50">
            New to CooMood?{" "}
            <Link href="/signup" className="text-ink underline">
              Create an account
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
