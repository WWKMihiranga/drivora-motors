"use client";

import Link from "next/link";
import type { Vehicle } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { ConditionBadge, StatusBadge, VerifiedTick } from "./Badges";
import { SaveButton } from "./SaveButton";
import { CompareToggle } from "./CompareToggle";
import { num, rs } from "@/lib/format";
import { monthlyFrom } from "@/lib/estimate";
import { Field, fill, useText } from "@/lib/site-data";
import { vehicleIndex } from "@/data/vehicles";

export function VehicleRow({ v, priority }: { v: Vehicle; priority?: boolean }) {
  const text = useText();
  const i = vehicleIndex(v);
  return (
    <article data-preview-item-path={`vehicles[${i}]`} className="group relative grid grid-cols-[180px_1fr] gap-5 rounded-[1.25rem] border border-line bg-paper p-2.5 pr-5 transition-colors hover:border-ink/30 lg:grid-cols-[240px_1fr_auto]">
      <div className="relative aspect-4/3 overflow-hidden rounded-[0.9rem] bg-surface">
        <Photo
          id={v.images[0]}
          alt={`${v.make} ${v.model}`}
          crop="4:3"
          fill
          sizes="240px"
          priority={priority}
          className="object-cover"
          data-preview-field-path={`vehicles[${i}].images[0]`}
        />
        <ConditionBadge
          condition={v.condition}
          on="photo"
          className="absolute top-2 left-2"
          data-preview-field-path={`vehicles[${i}].condition`}
        />
      </div>
      <div className="min-w-0 py-2">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display text-lg font-semibold">
            <Link href={`/cars/${v.slug}`} className="after:absolute after:inset-0" data-preview-field-path={`vehicles[${i}].slug`}>
              <Field data-preview-field-path={`vehicles[${i}].make`} /> <Field data-preview-field-path={`vehicles[${i}].model`} />
            </Link>
          </h3>
          {v.verified && <VerifiedTick label={false} />}
        </div>
        <p className="text-sm text-muted-strong">
          <Field data-preview-field-path={`vehicles[${i}].yom`} /> · <Field data-preview-field-path={`vehicles[${i}].grade`} /> ·{" "}
          <Field data-preview-field-path={`vehicles[${i}].colour`} />
        </p>
        <p className="mt-2 text-sm text-muted" data-num>
          <Field data-preview-field-path={`vehicles[${i}].mileageKm`} format={(m) => `${num(Number(m))} ${text("common.units.km")}`} /> ·{" "}
          <Field data-preview-field-path={`vehicles[${i}].fuel`} format={(f) => text(`labels.fuel.${f}`) || f} /> ·{" "}
          <Field data-preview-field-path={`vehicles[${i}].transmission`} format={(t) => text(`labels.transmissionLong.${t}`) || t} />
          {v.engineCc ? (
            <>
              {" · "}
              <Field data-preview-field-path={`vehicles[${i}].engineCc`} format={(c) => `${num(Number(c))} ${text("common.units.cc")}`} />
            </>
          ) : v.batteryKwh ? (
            <>
              {" · "}
              <Field data-preview-field-path={`vehicles[${i}].batteryKwh`} format={(k) => `${k} ${text("common.units.kwh")}`} />
            </>
          ) : null}
        </p>
        <div className="relative z-10 mt-3 flex items-center gap-4">
          {v.status !== "available" && <StatusBadge status={v.status} data-preview-field-path={`vehicles[${i}].status`} />}
          <CompareToggle id={v.id} />
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line pt-3 lg:col-span-1 lg:flex-col lg:items-end lg:justify-center lg:border-0 lg:pt-0">
        <div className="lg:text-right">
          <Field
            as="p"
            className="font-display text-xl font-semibold"
            data-num
            data-preview-field-path={`vehicles[${i}].priceLkr`}
            format={(p) => rs(Number(p))}
          />
          {v.status !== "sold" && (
            <Field
              as="p"
              className="text-xs text-muted-strong"
              data-num
              data-preview-field-path="common.vehicleCard.monthlyFrom"
              format={(t) => fill(t, { amount: rs(monthlyFrom(v)) })}
            />
          )}
        </div>
        <SaveButton id={v.id} label={`${v.make} ${v.model}`} className="relative z-10 border border-line" />
      </div>
    </article>
  );
}
