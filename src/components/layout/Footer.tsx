import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, whatsappLink } from "@/config/site";
import { Newsletter } from "./Newsletter";

const cols = [
  {
    title: "Buy",
    links: [
      { href: "/cars", label: "All cars" },
      { href: "/cars?condition=reconditioned", label: "Reconditioned" },
      { href: "/cars?condition=used", label: "Used" },
      { href: "/cars?condition=brand-new", label: "Brand new" },
      { href: "/cars?fuel=electric", label: "Electric" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/finance", label: "Leasing calculator" },
      { href: "/compare", label: "Compare cars" },
      { href: "/sell", label: "Sell or trade in" },
      { href: "/book", label: "Book a test drive" },
      { href: "/saved", label: "Saved cars" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/blog", label: "Guides & news" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Dealer view (demo)" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-3 pb-24 md:px-5 lg:pb-5">
      <div className="relative overflow-hidden rounded-4xl bg-night text-white">
        <LogoMark className="pointer-events-none absolute -right-16 -bottom-20 size-104 text-white/[0.035]" />
        <div className="container-x relative py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
            <div>
              <Logo dark />
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/65">
                Reconditioned, used and brand-new cars, each one inspected and documented before it reaches this
                website. Nugegoda, since {site.founded}.
              </p>
              <Newsletter />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1fr_1fr_1fr_1.35fr]">
              {cols.map((c) => (
                <div key={c.title}>
                  <h3 className="font-sans text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">{c.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-[0.93rem]">
                    {c.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-sans text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">Visit</h3>
                <ul className="mt-4 space-y-3 text-[0.93rem] text-white/80">
                  <li className="flex gap-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <span>
                      {site.address.line1}
                      <br />
                      {site.address.city} {site.address.postcode}
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <Phone className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <a href={site.phoneHref} className="hover:text-white" data-num>
                      {site.phone}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <Mail className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <a href={`mailto:${site.email}`} className="hover:text-white">
                      {site.email}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={1.5} />
                    <span>{site.hours}</span>
                  </li>
                </ul>
                <a
                  href={whatsappLink("Hi Drivora!")}
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/15"
                >
                  <WhatsAppIcon className="size-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
            <p>
              © {site.name}. Demo website with sample cars and prices. Reg. {site.registration}.
            </p>
            <p className="flex gap-5">
              <Link href="/credits" className="hover:text-white">
                Photo & 3D credits
              </Link>
              <Link href="/faq" className="hover:text-white">
                Privacy (PDPA)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
