import Link from "next/link";
import { ArrowUpRight, Fuel, Gauge, Settings2 } from "lucide-react";
import type { Vehicle } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { ConditionBadge, HighlightBadge, StatusBadge, VerifiedTick } from "./Badges";
import { SaveButton } from "./SaveButton";
import { CompareToggle } from "./CompareToggle";
import { fuelLabel, num, rs } from "@/lib/format";
import { monthlyFrom } from "@/lib/estimate";
import { cn } from "@/lib/cn";

export function VehicleCard({
  v,
  priority = false,
  sizes = "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  className,
  index = 0,
}: {
  v: Vehicle;
  priority?: boolean;
  sizes?: string;
  className?: string;
  index?: number;
}) {
  const sold = v.status === "sold";
  return (
    <article
      data-reveal
      style={{ ["--reveal-i" as string]: index % 4 }}
      className={cn("group relative flex flex-col rounded-[1.25rem] bg-surface p-2 card-lift", className)}
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-[0.9rem] bg-media">
        <Photo
          id={v.images[0]}
          alt={`${v.colour} ${v.make} ${v.model}`}
          crop="4:3"
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]",
            sold && "grayscale-60",
          )}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <ConditionBadge condition={v.condition} on="photo" />
          {v.badge && !sold && (
            <HighlightBadge on="photo">{v.badge}</HighlightBadge>
          )}
        </div>
        <SaveButton id={v.id} label={`${v.make} ${v.model}`} className="absolute top-2 right-2 z-10" />
        {v.status !== "available" && <StatusBadge status={v.status} on="photo" className="absolute bottom-2.5 left-2.5" />}
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-3.5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[1.05rem] font-semibold">
              <Link href={`/cars/${v.slug}`} className="after:absolute after:inset-0 after:rounded-[1.25rem]">
                {v.make} {v.model}
              </Link>
            </h3>
            <p className="truncate text-[0.82rem] text-muted-strong">
              {v.yom} · {v.grade}
            </p>
          </div>
          {v.verified && <VerifiedTick label={false} className="mt-1 shrink-0" />}
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1 text-[0.8rem] text-muted-strong">
          <li className="inline-flex items-center gap-1">
            <Gauge className="size-3.5" strokeWidth={1.5} />
            <span data-num>{num(v.mileageKm)} km</span>
          </li>
          <li className="inline-flex items-center gap-1">
            <Fuel className="size-3.5" strokeWidth={1.5} />
            {fuelLabel[v.fuel]}
          </li>
          <li className="inline-flex items-center gap-1">
            <Settings2 className="size-3.5" strokeWidth={1.5} />
            {v.transmission === "auto" ? "Auto" : "Manual"}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {v.previousPriceLkr && (
              <p className="text-xs text-muted line-through" data-num>
                {rs(v.previousPriceLkr)}
              </p>
            )}
            <p className={cn("font-display text-[1.15rem] font-semibold", v.previousPriceLkr && "text-brand")} data-num>
              {rs(v.priceLkr)}
            </p>
            {!sold && (
              <p className="text-[0.75rem] text-muted-strong" data-num>
                from {rs(monthlyFrom(v))}/mo*
              </p>
            )}
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-on-ink">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.75} />
          </span>
        </div>
        <div className="relative z-10 mt-3 border-t border-line pt-2.5">
          <CompareToggle id={v.id} />
        </div>
      </div>
    </article>
  );
}
