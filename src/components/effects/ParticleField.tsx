"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

export default function ParticleField({
  color = "200, 169, 106",
  density = 60,
  className,
}: {
  color?: string;
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const canvas = canvasRef.current!;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);

      const count = Math.round((width * height) / 18000) + Math.floor(density / 10);
      particles = Array.from({ length: Math.min(count, density) }).map(() => {
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

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
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
        let x = p.baseX;
        let y = p.baseY;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          x += (dx / (dist || 1)) * force * 40;
          y += (dy / (dist || 1)) * force * 40;
        }

        ctx!.beginPath();
        ctx!.arc(x, y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color}, ${p.a})`;
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
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
