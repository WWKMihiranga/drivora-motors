import type { Metadata } from "next";
import { Suspense } from "react";
import { CarsExplorer } from "@/components/search/CarsExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { getVehicles } from "@/lib/api";

export const metadata: Metadata = {
  title: "Cars for sale",
  description: "Reconditioned, used and brand-new cars in Nugegoda with auction sheets, service history and leasing estimates.",
};

export default async function CarsPage() {
  const vehicles = await getVehicles();
  const available = vehicles.filter((v) => v.status !== "sold");
  return (
    <>
      <PageHeader
        eyebrow={`${available.length} cars in stock`}
        title="Every car, checked and documented"
        text="Filter by budget, body type or fuel. Each listing shows its auction sheet or service history and an estimated monthly payment."
        crumbs={[{ href: "/cars", label: "Cars" }]}
      />
      <section className="container-x py-10 md:py-14">
        {/* The static fallback is a real, crawlable list; filters hydrate on the client. */}
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:ml-80 xl:grid-cols-3">
              {available.slice(0, 9).map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
          }
        >
          <CarsExplorer vehicles={vehicles} />
        </Suspense>
      </section>
    </>
  );
}
