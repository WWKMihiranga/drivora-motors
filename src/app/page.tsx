import { Hero } from "@/components/home/Hero";
import { QuickSearch } from "@/components/home/QuickSearch";
import { Benefits } from "@/components/home/Benefits";
import { StockTabs } from "@/components/home/StockTabs";
import { Spotlight } from "@/components/home/Spotlight";
import { Studio3D } from "@/components/home/Studio3D";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LeasingTeaser } from "@/components/home/LeasingTeaser";
import { SectionHeader } from "@/components/home/SectionHeader";
import { ClosingCta, Guides, OfferBanner, Reviews, WhyUs } from "@/components/home/Sections";
import { Field } from "@/lib/site-data";
import { getFeatured, getVehicles } from "@/lib/api";

export default async function HomePage() {
  const [all, featured] = await Promise.all([getVehicles(), getFeatured()]);
  const makes = [...new Set(all.map((v) => v.make))].sort();
  const available = all.filter((v) => v.status !== "sold").length;

  return (
    <>
      <Hero />

      <div className="container-x">
        <QuickSearch makes={makes} total={available} />
      </div>

      <section className="container-x py-14 md:py-20" aria-labelledby="benefits-label">
        <Field id="benefits-label" className="sr-only" data-preview-field-path="home.benefits.sectionLabel" />
        <Benefits />
      </section>

      <section className="container-x pb-20 md:pb-28" aria-labelledby="stock-title">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="home.stock.eyebrow" />}
          title={<Field id="stock-title" data-preview-field-path="home.stock.title" />}
          link={{ "data-preview-field-path": "home.stock.linkHref", label: <Field data-preview-field-path="home.stock.linkLabel" /> }}
          className="mb-8"
        />
        <StockTabs vehicles={featured} />
      </section>

      <Spotlight />

      <section className="container-x py-20 md:py-28" aria-labelledby="how-title">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="home.how.eyebrow" />}
          title={<Field id="how-title" data-preview-field-path="home.how.title" />}
          className="mb-12"
        />
        <HowItWorks />
      </section>

      <Studio3D />

      <section className="container-x py-20 md:py-28">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="home.leasing.eyebrow" />}
          title={<Field data-preview-field-path="home.leasing.title" />}
          link={{ "data-preview-field-path": "home.leasing.linkHref", label: <Field data-preview-field-path="home.leasing.linkLabel" /> }}
          className="mb-8"
        />
        <LeasingTeaser />
      </section>

      <section className="container-x pb-20 md:pb-28">
        <WhyUs />
      </section>

      <section className="container-x pb-20 md:pb-28">
        <OfferBanner />
      </section>

      <section className="container-x pb-20 md:pb-28" aria-labelledby="reviews-title">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="home.reviews.eyebrow" />}
          title={<Field id="reviews-title" data-preview-field-path="home.reviews.title" />}
          className="mb-8"
        >
          <Field as="p" className="mt-3 text-sm text-muted" data-preview-field-path="home.reviews.note" />
        </SectionHeader>
        <Reviews />
      </section>

      <section className="container-x pb-20 md:pb-28">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="home.guides.eyebrow" />}
          title={<Field data-preview-field-path="home.guides.title" />}
          link={{ "data-preview-field-path": "home.guides.linkHref", label: <Field data-preview-field-path="home.guides.linkLabel" /> }}
          className="mb-8"
        />
        <Guides />
      </section>

      <ClosingCta />
      <div className="h-5" />
    </>
  );
}
