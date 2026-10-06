"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/lib/admin/actions-auth";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdminAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow-xl"
      >
        <div>
          <h1 className="font-display text-2xl text-ink">CooMood Admin</h1>
          <p className="mt-1 font-sans text-sm text-ink/50">Enter the admin password to continue.</p>
        </div>
        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="Password"
          className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
        />
        {state?.error && (
          <p className="rounded-xl bg-cherry/10 px-4 py-3 font-sans text-xs text-cherry">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-cherry py-3 font-sans text-xs uppercase tracking-[0.15em] text-cream transition-colors hover:bg-cherry-light disabled:opacity-50"
        >
          {pending ? "Checking..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
