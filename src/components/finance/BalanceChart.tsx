import { rsM } from "@/lib/format";

/** Hand-drawn SVG area chart (no chart library) of the outstanding balance. */
export function BalanceChart({ principal, balances }: { principal: number; balances: number[] }) {
  const W = 320;
  const H = 120;
  const pad = 4;
  const n = balances.length;
  if (!n || principal <= 0) return null;
  const pts = [principal, ...balances].map((b, i) => [pad + (i / n) * (W - pad * 2), pad + (1 - b / principal) * (H - pad * 2)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W - pad} ${H - pad} L${pad} ${H - pad} Z`;
  const years = Math.floor(n / 12);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" role="img" aria-label="Outstanding balance falling to zero over the term">
        <defs>
          <linearGradient id="bal" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="1" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: years - 1 }).map((_, i) => {
          const x = pad + (((i + 1) * 12) / n) * (W - pad * 2);
          return <line key={i} x1={x} x2={x} y1={pad} y2={H - pad} stroke="rgba(255,255,255,0.08)" />;
        })}
        <path d={area} fill="url(#bal)" />
        <path d={line} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <figcaption className="mt-1 flex justify-between text-[0.7rem] text-white/45" data-num>
        <span>Owed today {rsM(principal)}</span>
        <span>Paid off in {n} months</span>
      </figcaption>
    </figure>
  );
}
