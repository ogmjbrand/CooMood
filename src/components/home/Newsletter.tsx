"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { subscribeToNewsletter } from "@/lib/newsletter";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  return (
    <section className="relative overflow-hidden bg-cherry py-24 text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(50% 60% at 20% 30%, rgba(200,169,106,0.35) 0%, transparent 70%)",
        }}
      />
      <div className="container-fluid relative flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl sm:text-5xl"
        >
          Join the CooMood Circle.
        </motion.h2>
        <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-cream/75">
          Early access to new collections, custom builder drops, and 15% off your first order.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await subscribeToNewsletter(email);
              setStatus("done");
            } catch {
              setStatus("error");
            }
          }}
          className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full border border-cream/30 bg-cream/10 p-1.5 pl-6 backdrop-blur"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-transparent font-sans text-sm placeholder:text-cream/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-gold px-6 py-3 font-sans text-xs uppercase tracking-wide text-ink transition-transform hover:scale-105"
          >
            Subscribe
          </button>
        </form>
        {status === "done" && (
          <p className="mt-4 font-sans text-xs text-gold-light">Welcome to the circle.</p>
        )}
        {status === "error" && (
          <p className="mt-4 font-sans text-xs text-cream/70">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
