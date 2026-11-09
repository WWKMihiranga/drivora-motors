import { ArrowLeft } from "lucide-react";
import { LinkField } from "@/components/ui/LinkField";
import { Field } from "@/lib/site-data";

export default function NotFound() {
  return (
    <section className="hero-gradient flex min-h-[80dvh] items-center pt-24">
      <div className="container-x">
        <p className="ghost-text text-[9rem] leading-none md:text-[14rem]" aria-hidden>
          <span data-preview-static="Decorative 404 lettering">404</span>
        </p>
        <Field as="h1" className="-mt-10 font-display text-3xl font-semibold md:-mt-16 md:text-5xl" data-preview-field-path="notFound.title" />
        <Field as="p" className="mt-3 max-w-md text-muted-strong" data-preview-field-path="notFound.text" />
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkField data-preview-field-path="notFound.carsHref" className="btn-ink">
            <Field data-preview-field-path="notFound.carsLabel" />
          </LinkField>
          <LinkField data-preview-field-path="notFound.homeHref" className="btn-line">
            <ArrowLeft className="size-4" /> <Field data-preview-field-path="notFound.homeLabel" />
          </LinkField>
        </div>
      </div>
    </section>
  );
}
