"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthPanel({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    router.replace(mode === "login" ? "/login" : "/signup", { scroll: false });
  }, [mode, router]);

  return (
    <>
      {/* Mobile: full-bleed photo banner + bottom-sheet tabbed forms */}
      <div className="md:hidden">
        <div className="relative h-[54vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src="/images/bottle-hero-smoke.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cherry/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-cherry via-cherry/80 via-60% to-transparent" />

          <div className="absolute inset-x-0 bottom-14 px-8 text-center text-cream">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-light">
                  {mode === "login" ? "Welcome Back" : "New Here?"}
                </p>
                <h1 className="mt-2 font-display text-3xl leading-tight">
                  {mode === "login" ? "Sign In to CooMood" : "Start Your Scent Story"}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative z-10 -mt-8 rounded-t-[2.5rem] bg-cream px-6 pb-16 pt-8">
          <div className="relative mx-auto mb-6 flex max-w-sm rounded-full bg-ink/5 p-1">
            <motion.div
              className="absolute inset-y-1 rounded-full bg-cherry"
              style={{ width: "calc(50% - 4px)" }}
              animate={{ left: mode === "login" ? "4px" : "50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setMode("login")}
              className={cn(
                "relative z-10 flex-1 whitespace-nowrap px-1 py-2.5 text-center font-sans text-[11px] uppercase tracking-normal transition-colors",
                mode === "login" ? "text-cream" : "text-ink/50"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "relative z-10 flex-1 whitespace-nowrap px-1 py-2.5 text-center font-sans text-[11px] uppercase tracking-normal transition-colors",
                mode === "signup" ? "text-cream" : "text-ink/50"
              )}
            >
              Create Account
            </button>
          </div>

          <div className="mx-auto max-w-sm rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.08)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 16 : -16 }}
                transition={{ duration: 0.25 }}
              >
                {mode === "login" ? <LoginForm /> : <SignupForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop: sliding split panel */}
      <div className="container-fluid hidden min-h-[85vh] items-center justify-center py-16 pt-32 md:flex">
        <div className="relative h-[600px] w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_80px_rgba(17,17,17,0.15)] md:grid md:grid-cols-2">
        <div
          className={cn(
            "flex items-center justify-center p-12 transition-opacity duration-300",
            mode !== "login" && "pointer-events-none opacity-0"
          )}
          aria-hidden={mode !== "login"}
        >
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-center p-12 transition-opacity duration-300",
            mode !== "signup" && "pointer-events-none opacity-0"
          )}
          aria-hidden={mode !== "signup"}
        >
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>

        <motion.div
          animate={{ left: mode === "login" ? "50%" : "0%" }}
          transition={{ type: "spring", stiffness: 210, damping: 26 }}
          className={cn(
            "absolute inset-y-0 z-10 w-1/2 overflow-hidden text-cream transition-[border-radius] duration-500 ease-in-out",
            mode === "login" ? "rounded-l-[160px]" : "rounded-r-[160px]"
          )}
        >
          <Image
            src="/images/bottle-hero-smoke.png"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cherry from-10% via-cherry/85 via-45% to-cherry/25 to-100%" />

          <div className="relative z-10 flex h-full flex-col items-center justify-end gap-4 px-12 pb-14 pt-12 text-center">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="to-signup"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-light">New Here?</p>
                  <h2 className="font-display text-3xl leading-tight">Start Your Scent Story</h2>
                  <p className="font-sans text-sm text-cream/60">
                    Create an account to save your custom blends, track orders, and earn rewards.
                  </p>
                  <button
                    onClick={() => setMode("signup")}
                    className="rounded-full border border-cream/40 px-8 py-3 font-sans text-xs uppercase tracking-wide transition-colors hover:bg-cream hover:text-cherry"
                  >
                    Create Account
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="to-login"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-light">Welcome Back</p>
                  <h2 className="font-display text-3xl leading-tight">Already One of Us?</h2>
                  <p className="font-sans text-sm text-cream/60">
                    Sign in to pick up right where you left off.
                  </p>
                  <button
                    onClick={() => setMode("login")}
                    className="rounded-full border border-cream/40 px-8 py-3 font-sans text-xs uppercase tracking-wide transition-colors hover:bg-cream hover:text-cherry"
                  >
                    Sign In
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        </div>
      </div>
    </>
  );
}

function LoginForm() {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <h1 className="font-display text-3xl">Sign In</h1>
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
        className="w-full rounded-full bg-cherry px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream transition-colors hover:bg-cherry-light disabled:opacity-50"
      >
        {loading ? "Signing In…" : "Sign In"}
      </button>
    </form>
  );
}

function SignupForm() {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <h1 className="font-display text-3xl">Create Account</h1>
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
        className="w-full rounded-full bg-cherry px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream transition-colors hover:bg-cherry-light disabled:opacity-50"
      >
        {loading ? "Creating Account…" : "Create Account"}
      </button>
    </form>
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
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">{label}</span>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}
