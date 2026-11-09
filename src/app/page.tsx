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
import { getFeatured, getPosts, getReviews, getVehicles } from "@/lib/api";

export default async function HomePage() {
  const [all, featured, reviews, posts] = await Promise.all([getVehicles(), getFeatured(), getReviews(), getPosts()]);
  const makes = [...new Set(all.map((v) => v.make))].sort();
  const spotlight = all.find((v) => v.id === "v01")!;
  const available = all.filter((v) => v.status !== "sold").length;

  return (
    <>
      <Hero />

      <div className="container-x">
        <QuickSearch makes={makes} total={available} />
      </div>

      <section className="container-x py-14 md:py-20" aria-label="Why buy here">
        <Benefits />
      </section>

      <section className="container-x pb-20 md:pb-28" aria-labelledby="stock-title">
        <SectionHeader eyebrow="In stock now" title="Fresh on the forecourt" link={{ href: "/cars", label: "All cars" }} className="mb-8" />
        <StockTabs vehicles={featured} />
      </section>

      <Spotlight v={spotlight} />

      <section className="container-x py-20 md:py-28" aria-labelledby="how-title">
        <SectionHeader eyebrow="How buying works" title="Five steps, no surprises" className="mb-12" />
        <HowItWorks />
      </section>

      <Studio3D />

      <section className="container-x py-20 md:py-28">
        <SectionHeader
          eyebrow="Leasing"
          title="See your monthly payment before you fall for the car"
          link={{ href: "/finance", label: "Full calculator" }}
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
        <SectionHeader eyebrow="Buyers, in their words" title="What people say after the handover" className="mb-8">
          <p className="mt-3 text-sm text-muted">Demo reviews, shown with the car each buyer chose.</p>
        </SectionHeader>
        <Reviews reviews={reviews} />
      </section>

      <section className="container-x pb-20 md:pb-28">
        <SectionHeader eyebrow="Guides & news" title="Read before you buy" link={{ href: "/blog", label: "All articles" }} className="mb-8" />
        <Guides posts={posts} />
      </section>

      <ClosingCta />
      <div className="h-5" />
    </>
  );
}
