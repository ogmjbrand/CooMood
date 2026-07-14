"use client";

import { motion } from "framer-motion";

const BODY_PATHS: Record<string, string> = {
  dome: "M70 40 Q70 20 100 20 Q130 20 130 40 L138 260 Q138 300 100 300 Q62 300 62 260 Z",
  angular: "M74 34 L126 34 L140 260 Q140 300 100 300 Q60 300 60 260 Z",
  flask: "M84 30 L116 30 L124 120 Q150 160 150 220 Q150 300 100 300 Q50 300 50 220 Q50 160 76 120 Z",
};

export default function BottlePreview({
  bottle,
  capColor,
  glassColor,
  label,
}: {
  bottle: string;
  capColor: string;
  glassColor: string;
  label: string;
}) {
  const body = BODY_PATHS[bottle] ?? BODY_PATHS.dome;

  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[280px]">
      <motion.svg
        viewBox="0 0 200 320"
        className="h-full w-full drop-shadow-[0_35px_45px_rgba(17,17,17,0.25)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="35%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <motion.path
          d={body}
          fill={glassColor}
          stroke="rgba(17,17,17,0.15)"
          strokeWidth={1.5}
          animate={{ d: body }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <path d={body} fill="url(#glassShine)" />

        <rect x="83" y="35" width="34" height="46" rx="6" fill={capColor} stroke="rgba(17,17,17,0.2)" />
        <rect x="86" y="14" width="28" height="24" rx="10" fill={capColor} />

        <rect x="72" y="150" width="56" height="60" rx="4" fill="#F8F5EF" stroke="rgba(17,17,17,0.1)" />
        <text
          x="100"
          y="178"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="13"
          fill="#111111"
        >
          CooMood
        </text>
        <text
          x="100"
          y="196"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="8"
          letterSpacing="1"
          fill="#8B1120"
        >
          {label.toUpperCase() || "YOUR SIGNATURE"}
        </text>
      </motion.svg>
    </div>
  );
}
