"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold-dark">
        Something Went Wrong
      </span>
      <h1 className="mt-4 font-display text-5xl sm:text-6xl">The Scent Trail Went Cold.</h1>
      <p className="mt-6 max-w-md font-sans text-sm text-ink/60">
        We couldn&apos;t load this page. It may be a temporary connection issue.
      </p>
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cherry px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] text-cream transition-all hover:scale-[1.02] hover:bg-cherry-light"
        >
          Try Again
        </button>
        <LinkButton href="/" variant="secondary">
          Return Home
        </LinkButton>
      </div>
    </div>
  );
}
