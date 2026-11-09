import type { Metadata } from "next";
import { notFound } from "next/navigation";
import siteData from "@/data/site-data.json";
import { getSimilar, getVehicle, getVehicles } from "@/lib/api";
import { conditionLabel, fuelLabel, num, rs, vehicleTitle } from "@/lib/format";
import { vehicleJsonLd } from "@/lib/seo";
import { u } from "@/lib/unsplash";
import { fill } from "@/lib/fill";
import { CarDetail } from "./CarDetail";

export async function generateStaticParams() {
  const cars = await getVehicles();
  // A static export needs at least one path; with an empty inventory this renders the 404 page.
  return cars.length ? cars.map((v) => ({ slug: v.slug })) : [{ slug: "no-cars" }];
}

export async function generateMetadata({ params }: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicle(slug);
  const seo = siteData.content.carDetail.seo;
  if (!v) return { title: seo.notFound };
  const title = `${vehicleTitle(v)} ${v.grade ?? ""}`.trim();
  const description = fill(seo.description, {
    condition: conditionLabel[v.condition],
    title,
    km: num(v.mileageKm),
    fuel: fuelLabel[v.fuel],
    price: rs(v.priceLkr),
    highlights: v.highlights.join(". "),
  });
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: `${u(v.images[0])}?w=1200&q=70&auto=format` }] },
  };
}

/* Static export: each car page is fully rendered at build time from generateStaticParams. */
export default async function CarPage({ params }: PageProps<"/cars/[slug]">) {
  return <CarDetails params={params} />;
}

async function CarDetails({ params }: { params: PageProps<"/cars/[slug]">["params"] }) {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) notFound();
  const similar = await getSimilar(v);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd(v)) }} />
      <CarDetail v={v} similar={similar} />
    </>
  );
}
