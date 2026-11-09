"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CHAT_EVENT } from "./chat-bus";
import { cn } from "@/lib/cn";

const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prefill, setPrefill] = useState<string | undefined>();
  // On the home page the launcher waits until the hero is scrolled past, so it never sits on
  // top of the hero or the quick search on first view.
  const home = usePathname() === "/";
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!home) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);
  const shown = !home || pastHero || open;

  useEffect(() => {
    const onOpen = (e: Event) => {
      setPrefill((e as CustomEvent<{ prefill?: string }>).detail?.prefill);
      setLoaded(true);
      setOpen(true);
    };
    window.addEventListener(CHAT_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_EVENT, onOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen((o) => !o);
        }}
        onPointerEnter={() => setLoaded(true)}
        aria-label={open ? "Close chat" : "Ask Drivora"}
        aria-expanded={open}
        tabIndex={shown ? undefined : -1}
        className={cn(
          "group fixed right-6 bottom-6 z-40 hidden items-center gap-2.5 rounded-full bg-ink py-3 pr-5 pl-3.5 text-sm font-medium text-on-ink shadow-[0_14px_34px_-14px_rgba(14,17,22,0.7)] transition-[transform,opacity] duration-300 ease-out-soft lg:flex",
          shown ? "opacity-100 hover:-translate-y-0.5" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <span className="relative flex size-8 items-center justify-center rounded-full bg-on-ink/10">
          {!open && <span className="absolute inset-0 animate-ping-slow rounded-full bg-brand-bright/40" />}
          {open ? <X className="relative size-4" /> : <MessageCircle className="relative size-4" strokeWidth={1.75} />}
        </span>
        {open ? "Close" : "Ask Drivora"}
      </button>

      <div
        className={cn(
          "fixed inset-x-3 bottom-3 z-60 origin-bottom-right transition-[opacity,transform,visibility] duration-300 ease-out-soft sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-97.5",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-3 scale-[0.98] opacity-0",
        )}
        role="dialog"
        aria-label="Chat with Drivora assistant"
        aria-hidden={!open}
        inert={!open}
      >
        {loaded && <ChatPanel onClose={() => setOpen(false)} prefill={prefill} open={open} />}
      </div>
    </>
  );
}
