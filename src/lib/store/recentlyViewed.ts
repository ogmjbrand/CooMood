"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  slugs: string[];
  add: (slug: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      slugs: [],
      add: (slug) => {
        const rest = get().slugs.filter((s) => s !== slug);
        set({ slugs: [slug, ...rest].slice(0, 8) });
      },
    }),
    { name: "coomood-recently-viewed" }
  )
);
