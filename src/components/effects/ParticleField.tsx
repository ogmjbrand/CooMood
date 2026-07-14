"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  burstFromX: number;
  burstFromY: number;
  burstToX: number;
  burstToY: number;
}

export interface ParticleFieldHandle {
  /** Implodes every particle toward center, swaps color at the peak, then bursts them
   * back out to new random positions. Mirrors a choreographed "flavor swap" transition. */
  pulse: (newColor?: string) => void;
}

const IMPLODE_MS = 420;
const EXPLODE_MS = 560;

const ParticleField = forwardRef<
  ParticleFieldHandle,
  { color?: string; density?: number; className?: string }
>(function ParticleField({ color = "200, 169, 106", density = 60, className }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const colorRef = useRef(color);
  const burstStartRef = useRef<number | null>(null);
  const pendingColorRef = useRef<string | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });

  useImperativeHandle(ref, () => ({
    pulse(newColor) {
      const { width, height } = sizeRef.current;
      for (const p of particlesRef.current) {
        p.burstFromX = p.baseX;
        p.burstFromY = p.baseY;
        p.burstToX = Math.random() * width;
        p.burstToY = Math.random() * height;
      }
      pendingColorRef.current = newColor ?? null;
      burstStartRef.current = performance.now();
    },
  }));

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const canvas = canvasRef.current!;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      sizeRef.current = { width, height };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);

      const count = Math.round((width * height) / 18000) + Math.floor(density / 10);
      particlesRef.current = Array.from({ length: Math.min(count, density) }).map(() => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -Math.random() * 0.25 - 0.05,
          r: Math.random() * 2 + 0.6,
          a: Math.random() * 0.5 + 0.15,
          burstFromX: x,
          burstFromY: y,
          burstToX: x,
          burstToY: y,
        };
      });
    }

    function onMove(e: MouseEvent) {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    }

    function onLeave() {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    }

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function tick() {
      const { width, height } = sizeRef.current;
      ctx!.clearRect(0, 0, width, height);

      const burstStart = burstStartRef.current;
      let burstPhase: "implode" | "explode" | null = null;
      let burstT = 0;
      if (burstStart !== null) {
        const elapsed = performance.now() - burstStart;
        if (elapsed < IMPLODE_MS) {
          burstPhase = "implode";
          burstT = easeInOut(elapsed / IMPLODE_MS);
        } else if (elapsed < IMPLODE_MS + EXPLODE_MS) {
          if (pendingColorRef.current) {
            colorRef.current = pendingColorRef.current;
            pendingColorRef.current = null;
          }
          burstPhase = "explode";
          burstT = easeInOut((elapsed - IMPLODE_MS) / EXPLODE_MS);
        } else {
          for (const p of particlesRef.current) {
            p.baseX = p.burstToX;
            p.baseY = p.burstToY;
          }
          burstStartRef.current = null;
        }
      }

      for (const p of particlesRef.current) {
        let x: number;
        let y: number;

        if (burstPhase === "implode") {
          x = p.burstFromX + (width / 2 - p.burstFromX) * burstT;
          y = p.burstFromY + (height / 2 - p.burstFromY) * burstT;
        } else if (burstPhase === "explode") {
          x = width / 2 + (p.burstToX - width / 2) * burstT;
          y = height / 2 + (p.burstToY - height / 2) * burstT;
        } else {
          p.baseY += p.vy;
          p.baseX += p.vx;
          if (p.baseY < -10) {
            p.baseY = height + 10;
            p.baseX = Math.random() * width;
          }
          if (p.baseX < -10) p.baseX = width + 10;
          if (p.baseX > width + 10) p.baseX = -10;

          const dx = p.baseX - mouse.current.x;
          const dy = p.baseY - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 110;
          x = p.baseX;
          y = p.baseY;
          if (dist < radius) {
            const force = (radius - dist) / radius;
            x += (dx / (dist || 1)) * force * 40;
            y += (dy / (dist || 1)) * force * 40;
          }
        }

        ctx!.beginPath();
        ctx!.arc(x, y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colorRef.current}, ${p.a})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    if (!reduceMotion) {
      raf = requestAnimationFrame(tick);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
});

export default ParticleField;
