import { site } from "@/config/site";
import { conditionLabel, fuelLabel, vehicleTitle } from "@/lib/format";
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
    openingHours: ["Mo-Sa 09:00-18:00", "Su 10:00-14:00"],
    priceRange: "Rs 6,000,000 – Rs 100,000,000",
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
    vehicleTransmission: v.transmission === "auto" ? "Automatic" : "Manual",
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
      priceCurrency: "LKR",
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
