"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { site, whatsappLink } from "@/config/site";
import { Field, useText } from "@/lib/site-data";
import { MapEmbed } from "./MapEmbed";

/* Contact details, form and map, read live so edits show instantly in the Fivora editor. */
export function ContactBody() {
  const text = useText();
  const items = [
    {
      key: "call",
      icon: Phone,
      k: <Field data-preview-field-path="contact.callLabel" />,
      v: <Field data-preview-field-path="common.business.phone" className="block font-medium" />,
      href: site.phoneHref,
      marker: "common.business.phone",
    },
    {
      key: "whatsapp",
      icon: WhatsAppIcon,
      k: <Field data-preview-field-path="contact.whatsappLabel" />,
      v: <Field data-preview-field-path="contact.whatsappText" className="block font-medium" />,
      href: whatsappLink(text("common.messages.whatsappHello")),
      marker: "common.business.whatsapp",
    },
    {
      key: "email",
      icon: Mail,
      k: <Field data-preview-field-path="contact.emailLabel" />,
      v: <Field data-preview-field-path="common.business.email" className="block font-medium" />,
      href: `mailto:${site.email}`,
      marker: "common.business.email",
    },
    {
      key: "showroom",
      icon: MapPin,
      k: <Field data-preview-field-path="contact.showroomLabel" />,
      v: (
        <span className="block font-medium">
          <Field data-preview-field-path="common.business.addressLine1" />, <Field data-preview-field-path="common.business.city" />
        </span>
      ),
      href: text("contact.showroomMapUrl"),
      marker: "contact.showroomMapUrl",
    },
    {
      key: "hours",
      icon: Clock,
      k: <Field data-preview-field-path="contact.hoursLabel" />,
      v: <Field data-preview-field-path="common.business.hours" className="block font-medium" />,
    },
  ];
  return (
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {items.map(({ key, icon: Icon, k, v, href, marker }) => (
              <li key={key}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener"
                    className="group flex items-center gap-4 py-4"
                    {...{ "data-preview-field-path": marker }}
                  >
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
            <Field as="h2" className="font-display text-xl font-semibold" data-preview-field-path="contact.formTitle" />
            <Field as="p" className="mt-1 mb-6 text-sm text-muted" data-preview-field-path="contact.formText" />
            <EnquiryForm vehicle={text("contact.formVehicle")} />
          </div>
        </div>
        <MapEmbed />
      </section>
  );
}

function Row({
  Icon,
  k,
  v,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  k: React.ReactNode;
  v: React.ReactNode;
}) {
  return (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line group-hover:border-ink">
        <Icon className="size-[1.1rem]" strokeWidth={1.5} />
      </span>
      <span>
        <span className="block text-xs tracking-wide text-muted uppercase">{k}</span>
        {v}
      </span>
    </>
  );
}
