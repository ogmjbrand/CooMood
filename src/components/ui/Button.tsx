import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const variants: Record<Variant, string> = {
  primary: "bg-cherry text-cream hover:bg-cherry-light",
  secondary: "border border-ink/20 text-ink hover:bg-cherry hover:border-cherry hover:text-cream",
  ghost: "text-ink hover:bg-ink/5",
  gold: "bg-gold text-ink hover:bg-gold-dark hover:text-cream",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.02]",
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
