import type { Metadata } from "next";
import { Suspense } from "react";
import { CarsExplorer, CarsExplorerFromUrl } from "@/components/search/CarsExplorer";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { getVehicles } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Field, FillField } from "@/lib/site-data";

export const metadata: Metadata = pageMeta("cars");

export default async function CarsPage() {
  const vehicles = await getVehicles();
  const available = vehicles.filter((v) => v.status !== "sold");
  return (
    <>
      <PageHeader
        eyebrow={<FillField data-preview-field-path="cars.header.eyebrow" vars={{ count: available.length }} />}
        title={<Field data-preview-field-path="cars.header.title" />}
        text={<Field data-preview-field-path="cars.header.text" />}
        crumbs={[<Crumb key="c" data-preview-field-path="cars.header.crumbHref" label={<Field data-preview-field-path="cars.header.crumbLabel" />} />]}
      />
      <section className="container-x py-10 md:py-14">
        {/* The static HTML is the full explorer with no filters (crawlable); the URL's filters apply on the client. */}
        <Suspense fallback={<CarsExplorer vehicles={vehicles} />}>
          <CarsExplorerFromUrl vehicles={vehicles} />
        </Suspense>
      </section>
    </>
  );
}
