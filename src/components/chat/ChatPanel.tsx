"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { reply, QUICK, type BotReply } from "./engine";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LogoMark } from "@/components/ui/Logo";
import { whatsappLink } from "@/config/site";
import { rsM, vehicleTitle } from "@/lib/format";
import { cn } from "@/lib/cn";

type Msg = { from: "bot" | "me"; body: BotReply | string };

export default function ChatPanel({ onClose, prefill, open }: { onClose: () => void; prefill?: string; open: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      body: {
        text: "Hi, I'm the Drivora assistant. Tell me your budget and the kind of car you need and I'll check our stock.",
        quick: QUICK,
      },
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handled = useRef<string | undefined>(undefined);

  const send = (value: string) => {
    const v = value.trim();
    if (!v || typing) return;
    setMsgs((m) => [...m, { from: "me", body: v }]);
    setText("");
    setTyping(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", body: reply(v) }]);
      setTyping(false);
    }, 650);
  };

  useEffect(() => {
    if (open && prefill && handled.current !== prefill) {
      handled.current = prefill;
      send(prefill);
    }
    if (open) window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const transcript = msgs
    .filter((m) => m.from === "me")
    .map((m) => `• ${m.body as string}`)
    .join("\n");

  return (
    <div className="flex h-[min(620px,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_30px_80px_-30px_rgba(14,17,22,0.5)] sm:h-140">
      <div className="flex items-center gap-3 bg-night px-4 py-3.5 text-white">
        <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
          <LogoMark className="size-5" />
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-sm font-semibold">Drivora assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Answers from our live stock · demo
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="flex size-9 items-center justify-center rounded-full hover:bg-white/10">
          <X className="size-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-surface/60 px-4 py-4" aria-live="polite">
        {msgs.map((m, i) =>
          m.from === "me" ? (
            <div key={i} className="ml-10 rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[0.92rem] text-on-ink wrap-anywhere">
              {m.body as string}
            </div>
          ) : (
            <BotBubble key={i} r={m.body as BotReply} onQuick={send} transcript={transcript} />
          ),
        )}
        {typing && (
          <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-md bg-paper py-3">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 120}ms` }} />
            ))}
          </div>
        )}
      </div>

      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. hybrid SUV under 20m"
          aria-label="Message"
          className="h-11 min-w-0 flex-1 rounded-full bg-surface px-4 text-[16px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/10"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!text.trim()}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink transition-opacity disabled:opacity-30"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>
    </div>
  );
}

function BotBubble({ r, onQuick, transcript }: { r: BotReply; onQuick: (q: string) => void; transcript: string }) {
  return (
    <div className="mr-6 space-y-2.5">
      <div className="rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 text-[0.92rem] leading-relaxed text-ink">{r.text}</div>
      {r.cars && (
        <div className="space-y-2">
          {r.cars.map((v) => (
            <Link
              key={v.id}
              href={`/cars/${v.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-paper p-2 pr-3 transition-colors hover:bg-paper/70"
            >
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                <Photo id={v.images[0]} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-sm font-semibold">{vehicleTitle(v)}</span>
                <span className="text-xs text-muted">
                  {v.grade} · {Math.round(v.mileageKm / 1000)}k km
                </span>
              </span>
              <span className="font-display text-sm font-semibold" data-num>
                {rsM(v.priceLkr)}
              </span>
            </Link>
          ))}
        </div>
      )}
      {r.link && (
        <Link href={r.link.href} className="inline-flex text-sm font-semibold text-brand underline-offset-4 hover:underline">
          {r.link.label} →
        </Link>
      )}
      {r.handover && (
        <a
          href={whatsappLink(`Hi Drivora, I was chatting on your website:\n${transcript}`)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#075E54] px-4 py-2.5 text-sm font-medium text-white"
        >
          <WhatsAppIcon className="size-4" /> Continue on WhatsApp
        </a>
      )}
      {r.quick && (
        <div className="flex flex-wrap gap-1.5">
          {r.quick.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQuick(q)}
              className={cn("rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink")}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
