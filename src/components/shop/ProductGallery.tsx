"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, active: false });

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setZoom({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
            active: true,
          });
        }}
        onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
      >
        <motion.div
          key={active}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full"
          style={{
            transform: zoom.active ? "scale(1.6)" : "scale(1)",
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <Image
            src={images[active]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors",
                active === i ? "border-gold" : "border-transparent"
              )}
            >
              <Image src={img} alt={`${name} view ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
