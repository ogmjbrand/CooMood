"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-cream"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-52 w-52 overflow-hidden rounded-full shadow-[0_20px_50px_rgba(139,17,32,0.22)] sm:h-64 sm:w-64"
          >
            <Image
              src="/images/logo-medallion.png"
              alt="CooMood"
              fill
              priority
              sizes="256px"
              className="scale-[1.06] object-cover"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, letterSpacing: "0.05em" }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl text-ink"
          >
            Coo<span className="text-cherry">M</span>ood
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
