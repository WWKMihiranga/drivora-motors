"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { useApp, useHydrated } from "@/store";
import type { Vehicle } from "@/types";

export function SavedView() {
  const mounted = useHydrated();
  const saved = useApp((s) => s.saved);
  const recent = useApp((s) => s.recent);
  const pick = (ids: string[]) => ids.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean) as Vehicle[];
  if (!mounted) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  const savedCars = pick(saved);
  const recentCars = pick(recent.filter((id) => !saved.includes(id)));

  return (
    <div className="space-y-16">
      {savedCars.length === 0 ? (
        <div className="rounded-3xl bg-surface px-6 py-16 text-center">
          <Heart className="mx-auto size-8 text-muted" strokeWidth={1.4} />
          <h2 className="mt-3 font-display text-xl font-semibold">No saved cars yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Tap the heart on any car to keep it here. Saved cars stay on this device.</p>
          <Link href="/cars" className="btn-ink mt-6">
            Browse cars
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedCars.map((v, i) => (
            <VehicleCard key={v.id} v={v} index={i} />
          ))}
        </div>
      )}
      {recentCars.length > 0 && (
        <div>
          <h2 className="section-title">Recently viewed</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentCars.slice(0, 4).map((v, i) => (
              <VehicleCard key={v.id} v={v} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
