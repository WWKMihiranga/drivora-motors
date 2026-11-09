import type { Metadata } from "next";
import siteData from "@/data/site-data.json";
import { site } from "@/config/site";
import { conditionLabel, fuelLabel, transmissionLongLabel, vehicleTitle } from "@/lib/format";
import { u } from "@/lib/unsplash";
import type { Vehicle } from "@/types";

export function dealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    openingHours: siteData.content.common.business.openingHoursSchema.split(",").map((s) => s.trim()).filter(Boolean),
    priceRange: siteData.content.common.business.priceRange,
  };
}

export function vehicleJsonLd(v: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleTitle(v),
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.yom),
    bodyType: v.bodyType,
    color: v.colour,
    fuelType: fuelLabel[v.fuel],
    vehicleTransmission: transmissionLongLabel[v.transmission],
    seatingCapacity: v.seats,
    itemCondition:
      v.condition === "brand-new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileageKm, unitCode: "KMT" },
    vehicleEngine: v.engineCc
      ? { "@type": "EngineSpecification", engineDisplacement: { "@type": "QuantitativeValue", value: v.engineCc, unitCode: "CMQ" } }
      : undefined,
    image: v.images.map((id) => u(id)),
    description: `${conditionLabel[v.condition]} ${vehicleTitle(v)}. ${v.description}`,
    offers: {
      "@type": "Offer",
      price: v.priceLkr,
      priceCurrency: siteData.content.common.business.currencyCode,
      availability:
        v.status === "sold"
          ? "https://schema.org/SoldOut"
          : v.status === "arriving"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: site.name },
    },
  };
}

/** Search-engine title/description for a page, editable in Fivora at `<page>.seo`. */
export function pageMeta(page: string): Metadata {
  const seo = (siteData.content as unknown as Record<string, { seo?: { title?: string; description?: string } }>)[page]?.seo;
  return { title: seo?.title, description: seo?.description };
}
