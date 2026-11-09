import Link from "next/link";
import type { Vehicle } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { ConditionBadge, StatusBadge, VerifiedTick } from "./Badges";
import { SaveButton } from "./SaveButton";
import { CompareToggle } from "./CompareToggle";
import { fuelLabel, num, rs } from "@/lib/format";
import { monthlyFrom } from "@/lib/estimate";

export function VehicleRow({ v, priority }: { v: Vehicle; priority?: boolean }) {
  return (
    <article className="group relative grid grid-cols-[180px_1fr] gap-5 rounded-[1.25rem] border border-line bg-paper p-2.5 pr-5 transition-colors hover:border-ink/30 lg:grid-cols-[240px_1fr_auto]">
      <div className="relative aspect-4/3 overflow-hidden rounded-[0.9rem] bg-surface">
        <Photo id={v.images[0]} alt={`${v.make} ${v.model}`} crop="4:3" fill sizes="240px" priority={priority} className="object-cover" />
        <ConditionBadge condition={v.condition} on="photo" className="absolute top-2 left-2" />
      </div>
      <div className="min-w-0 py-2">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display text-lg font-semibold">
            <Link href={`/cars/${v.slug}`} className="after:absolute after:inset-0">
              {v.make} {v.model}
            </Link>
          </h3>
          {v.verified && <VerifiedTick label={false} />}
        </div>
        <p className="text-sm text-muted-strong">
          {v.yom} · {v.grade} · {v.colour}
        </p>
        <p className="mt-2 text-sm text-muted" data-num>
          {num(v.mileageKm)} km · {fuelLabel[v.fuel]} · {v.transmission === "auto" ? "Automatic" : "Manual"}
          {v.engineCc ? ` · ${num(v.engineCc)} cc` : v.batteryKwh ? ` · ${v.batteryKwh} kWh` : ""}
        </p>
        <div className="relative z-10 mt-3 flex items-center gap-4">
          {v.status !== "available" && <StatusBadge status={v.status} />}
          <CompareToggle id={v.id} />
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line pt-3 lg:col-span-1 lg:flex-col lg:items-end lg:justify-center lg:border-0 lg:pt-0">
        <div className="lg:text-right">
          <p className="font-display text-xl font-semibold" data-num>
            {rs(v.priceLkr)}
          </p>
          {v.status !== "sold" && (
            <p className="text-xs text-muted-strong" data-num>
              from {rs(monthlyFrom(v))}/mo*
            </p>
          )}
        </div>
        <SaveButton id={v.id} label={`${v.make} ${v.model}`} className="relative z-10 border border-line" />
      </div>
    </article>
  );
}
