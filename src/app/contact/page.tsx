import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { WhatsAppIcon } from "@/components/ui/icons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { site, whatsappLink } from "@/config/site";
import { MapEmbed } from "./MapEmbed";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit ${site.name} at ${site.address.line1}, ${site.address.city}, or message us on WhatsApp.`,
};

export default function ContactPage() {
  const items = [
    { icon: Phone, k: "Call", v: site.phone, href: site.phoneHref },
    { icon: WhatsAppIcon, k: "WhatsApp", v: "Usually replies in 10 minutes", href: whatsappLink("Hi Drivora!") },
    { icon: Mail, k: "Email", v: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, k: "Showroom", v: `${site.address.line1}, ${site.address.city}`, href: "https://maps.google.com/?q=High+Level+Road+Nugegoda" },
    { icon: Clock, k: "Hours", v: site.hours },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Come and see the cars, or ask from your sofa"
        text="The quickest way to reach us is WhatsApp. If you're visiting, there's parking behind the showroom."
        crumbs={[{ href: "/contact", label: "Contact" }]}
      />
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {items.map(({ icon: Icon, k, v, href }) => (
              <li key={k}>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group flex items-center gap-4 py-4">
                    <Row Icon={Icon} k={k} v={v} />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 py-4">
                    <Row Icon={Icon} k={k} v={v} />
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-3xl bg-surface p-5 md:p-7">
            <h2 className="font-display text-xl font-semibold">Send us a message</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Looking for a specific car? Tell us and we&apos;ll source it.</p>
            <EnquiryForm vehicle="a car not listed yet" />
          </div>
        </div>
        <MapEmbed />
      </section>
    </>
  );
}

function Row({ Icon, k, v }: { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; k: string; v: string }) {
  return (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line group-hover:border-ink">
        <Icon className="size-[1.1rem]" strokeWidth={1.5} />
      </span>
      <span>
        <span className="block text-xs tracking-wide text-muted uppercase">{k}</span>
        <span className="block font-medium">{v}</span>
      </span>
    </>
  );
}
