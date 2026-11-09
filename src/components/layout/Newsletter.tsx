"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <form
      className="mt-8 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label htmlFor="nl-email" className="text-sm font-medium text-white">
        New arrivals, every Friday
      </label>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5 focus-within:bg-white/15">
        <input
          id="nl-email"
          type="email"
          required
          placeholder="you@example.com"
          disabled={done}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-night transition-transform hover:scale-105"
        >
          {done ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      <p className="mt-2 text-xs text-white/45" aria-live="polite">
        {done ? "Thanks! You're on the list (demo, nothing was sent)." : "One email a week. Unsubscribe any time."}
      </p>
    </form>
  );
}
