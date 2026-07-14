"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { motion } from "framer-motion";
import ParticleField, { type ParticleFieldHandle } from "@/components/effects/ParticleField";
import { cn } from "@/lib/utils";

interface Mood {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  image: string;
  particleColor: string;
  glowColor: string;
}

const MOODS: Mood[] = [
  {
    slug: "energetic",
    name: "Energetic",
    tagline: "Fresh & Bright",
    price: "$185",
    image: "/images/bottle-hero-marble.png",
    particleColor: "200, 169, 106",
    glowColor: "rgba(200,169,106,0.30)",
  },
  {
    slug: "attractive",
    name: "Attractive",
    tagline: "Warm & Magnetic",
    price: "$210",
    image: "/images/bottle-hero-smoke.png",
    particleColor: "139, 17, 32",
    glowColor: "rgba(139,17,32,0.24)",
  },
  {
    slug: "bold",
    name: "Bold",
    tagline: "Powerful & Confident",
    price: "$265",
    image: "/images/collection-bold-dark.png",
    particleColor: "17, 17, 17",
    glowColor: "rgba(17,17,17,0.28)",
  },
];

export default function MoodSwitcher() {
  const [active, setActive] = useState(0);
  const [displayedImage, setDisplayedImage] = useState(MOODS[0].image);
  const bottleRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<ParticleFieldHandle>(null);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animating = useRef(false);

  // Cursor-tilt: the bottle leans toward the pointer in real time (kept on a
  // separate element from the GSAP spin so the two transforms don't fight).
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const quickX = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      quickX(px * 20);
      quickY(-py * 20);
    }
    function onLeave() {
      quickX(0);
      quickY(0);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  function selectMood(index: number) {
    if (index === active || animating.current || !bottleRef.current) return;
    animating.current = true;
    const mood = MOODS[index];

    particleRef.current?.pulse(mood.particleColor);

    gsap.to(glowRefs.current[active], { opacity: 0, duration: 0.9, ease: "power2.out" });
    gsap.to(glowRefs.current[index], { opacity: 1, duration: 0.9, ease: "power2.out" });

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        setActive(index);
      },
    });

    tl.to(bottleRef.current, {
      rotateY: "+=360",
      filter: "blur(14px)",
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => setDisplayedImage(mood.image),
    }).to(bottleRef.current, {
      rotateY: "+=360",
      filter: "blur(0px)",
      duration: 0.45,
      ease: "power2.out",
    });
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
        {MOODS.map((mood, i) => (
          <div
            key={mood.slug}
            ref={(el) => {
              glowRefs.current[i] = el;
            }}
            className="absolute inset-0 rounded-[3rem]"
            style={{
              background: `radial-gradient(60% 60% at 50% 50%, ${mood.glowColor} 0%, transparent 70%)`,
              opacity: i === active ? 1 : 0,
            }}
          />
        ))}
        <ParticleField ref={particleRef} color={MOODS[active].particleColor} density={70} />
      </div>

      <div className="relative order-1 h-[45vh] w-full lg:order-1 lg:h-full">
        <div className="relative h-full w-full [perspective:1200px]">
          <div ref={tiltRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            <div
              ref={bottleRef}
              className="relative h-full w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={displayedImage}
                alt={`CooMood ${MOODS[active].name} fragrance bottle`}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-contain drop-shadow-[0_40px_60px_rgba(17,17,17,0.35)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative order-2 flex shrink-0 flex-row gap-3 lg:order-2 lg:flex-col lg:justify-center">
        {MOODS.map((mood, i) => (
          <button
            key={mood.slug}
            onClick={() => selectMood(i)}
            className={cn(
              "group relative flex w-32 flex-col items-center gap-1 rounded-2xl border px-3 py-4 text-center backdrop-blur transition-colors sm:w-36",
              i === active
                ? "border-gold bg-white/70"
                : "border-ink/10 bg-white/40 hover:border-ink/30"
            )}
          >
            <motion.span
              animate={i === active ? { scale: 1.08 } : { scale: 1 }}
              className="font-display text-lg text-ink"
            >
              {mood.name}
            </motion.span>
            <span className="font-sans text-[10px] uppercase tracking-wide text-ink/45">
              {mood.tagline}
            </span>
            <span className="font-sans text-xs text-gold-dark">{mood.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
