import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold-dark">Error 404</span>
      <h1 className="mt-4 font-display text-7xl sm:text-8xl">Lost Your Scent Trail?</h1>
      <p className="mt-6 max-w-md font-sans text-sm text-ink/60">
        The page you&apos;re looking for has drifted away. Let&apos;s get you back to something
        beautiful.
      </p>
      <div className="mt-10 flex gap-4">
        <LinkButton href="/">Return Home</LinkButton>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:border-cherry hover:bg-cherry hover:text-cream"
        >
          Shop Collection
        </Link>
      </div>
    </div>
  );
}
