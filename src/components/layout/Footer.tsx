"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, whatsappLink } from "@/config/site";
import { Field, useList, useText } from "@/lib/site-data";
import { AdditionalPages } from "./AdditionalPages";
import { Newsletter } from "./Newsletter";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

/* Every word, column and link here is editable in Fivora (site-data.json `common.footer`). */
export function Footer() {
  const text = useText();
  const cols = useList<FooterColumn>("common.footer.columns");
  const bottomLinks = useList<FooterLink>("common.footer.bottomLinks");
  return (
    <footer className="px-3 pb-24 md:px-5 lg:pb-5">
      <div className="relative overflow-hidden rounded-4xl bg-night text-white">
        <LogoMark className="pointer-events-none absolute -right-16 -bottom-20 size-104 text-white/[0.035]" />
        <div className="container-x relative py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
            <div>
              <BrandLogo dark />
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/65">
                <Field data-preview-field-path="common.footer.blurb" />{" "}
                <Field data-preview-field-path="common.business.founded" />.
              </p>
              <Newsletter />
            </div>

            <div
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1fr_1fr_1fr_1.35fr]"
              data-preview-list-path="common.footer.columns"
            >
              {cols.map((c, i) => (
                <div key={`${c.title}-${i}`}>
                  <div data-preview-item-path={`common.footer.columns[${i}]`}>
                  <Field
                    as="h3"
                    className="font-sans text-xs font-semibold tracking-[0.14em] text-white/45 uppercase"
                    data-preview-field-path={`common.footer.columns[${i}].title`}
                  />
                  <ul className="mt-4 space-y-2.5 text-[0.93rem]" data-preview-list-path={`common.footer.columns[${i}].links`}>
                    {(c.links ?? []).map((l, j) => (
                      <li key={`${l.href}-${j}`} data-preview-item-path={`common.footer.columns[${i}].links[${j}]`}>
                        <Link
                          href={l.href || "/"}
                          className="text-white/80 transition-colors hover:text-white"
                          data-preview-field-path={`common.footer.columns[${i}].links[${j}].href`}
                        >
                          <Field data-preview-field-path={`common.footer.columns[${i}].links[${j}].label`} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  </div>
                  {i === cols.length - 1 && (
                    <AdditionalPages
                      className="mt-2.5 space-y-2.5 text-[0.93rem]"
                      linkClassName="text-white/80 transition-colors hover:text-white"
                    />
                  )}
                </div>
              ))}
              <div className="col-span-2 sm:col-span-1">
                {cols.length === 0 && (
                  <AdditionalPages className="mb-6 space-y-2.5 text-[0.93rem]" linkClassName="text-white/80 transition-colors hover:text-white" />
                )}
                <Field
                  as="h3"
                  className="font-sans text-xs font-semibold tracking-[0.14em] text-white/45 uppercase"
                  data-preview-field-path="common.footer.visitTitle"
                />
                <ul className="mt-4 space-y-3 text-[0.93rem] text-white/80">
                  <li className="flex gap-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <span>
                      <Field data-preview-field-path="common.business.addressLine1" />
                      <br />
                      <Field data-preview-field-path="common.business.city" />{" "}
                      <Field data-preview-field-path="common.business.postcode" />
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <Phone className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <Field as="a" data-preview-field-path="common.business.phone" href={site.phoneHref} className="hover:text-white" data-num />
                  </li>
                  <li className="flex gap-2.5">
                    <Mail className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <Field as="a" data-preview-field-path="common.business.email" href={`mailto:${site.email}`} className="hover:text-white" />
                  </li>
                  <li className="flex gap-2.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <Field data-preview-field-path="common.business.hours" />
                  </li>
                </ul>
                <a
                  href={whatsappLink(text("common.messages.whatsappHello"))}
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/15"
                  data-preview-field-path="common.business.whatsapp"
                >
                  <WhatsAppIcon className="size-4" /> <Field data-preview-field-path="common.footer.whatsappCta" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
            <p>
              <Field data-preview-field-path="common.footer.copyrightPrefix" />{" "}
              <Field data-preview-field-path="common.business.name" />.{" "}
              <Field data-preview-field-path="common.footer.copyrightNote" />{" "}
              <Field data-preview-field-path="common.business.registration" />.
            </p>
            <p className="flex gap-5" data-preview-list-path="common.footer.bottomLinks">
              {bottomLinks.map((l, i) => (
                <Link
                  key={`${l.href}-${i}`}
                  href={l.href || "/"}
                  className="hover:text-white"
                  data-preview-item-path={`common.footer.bottomLinks[${i}]`}
                  data-preview-field-path={`common.footer.bottomLinks[${i}].href`}
                >
                  <Field data-preview-field-path={`common.footer.bottomLinks[${i}].label`} />
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
