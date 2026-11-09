import { cn } from "@/lib/cn";

/** Monogram: a "D" drawn as a curve of road with a centre lane. */
export function LogoMark({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <path
        className={cn(draw && "splash-draw")}
        pathLength={1}
        d="M9 6h11c8.3 0 14 5.9 14 14s-5.7 14-14 14H9V6Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className={cn(draw && "splash-draw splash-draw-late")}
        pathLength={1}
        d="M15.5 13.5h4.2c4 0 6.8 2.8 6.8 6.5s-2.8 6.5-6.8 6.5h-4.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={draw ? undefined : "2.6 2.6"}
      />
    </svg>
  );
}

export function Logo({
  className,
  dark = false,
  word = "DRIVORA",
  sub = "MOTORS",
  ...rest
}: { className?: string; dark?: boolean; word?: React.ReactNode; sub?: React.ReactNode } & Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "className"
>) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", dark ? "text-white" : "text-ink", className)} {...rest}>
      <LogoMark className="size-8 shrink-0" />
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-bold tracking-[0.18em]">{word}</span>
        <span className={cn("mt-0.5 block text-[0.6rem] font-medium tracking-[0.42em]", dark ? "text-white/60" : "text-muted")}>
          {sub}
        </span>
      </span>
    </span>
  );
}
