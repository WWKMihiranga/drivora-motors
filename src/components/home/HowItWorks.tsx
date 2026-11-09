import { FileSearch, HandCoins, KeyRound, ScrollText } from "lucide-react";
import { SteeringIcon } from "@/components/ui/icons";

const steps = [
  { icon: SteeringIcon, title: "Choose", text: "Shortlist online, or tell us your budget on WhatsApp." },
  { icon: FileSearch, title: "Check the papers", text: "Auction sheet, service book and our inspection report, before you visit." },
  { icon: HandCoins, title: "Leasing & offer", text: "We send your file to the lenders most likely to approve it." },
  { icon: ScrollText, title: "Paperwork", text: "Transfer, registration and insurance handled for you." },
  { icon: KeyRound, title: "Handover", text: "Collect from Nugegoda, or we deliver to your door." },
];

export function HowItWorks() {
  return (
    <ol className="relative grid gap-8 md:grid-cols-5 md:gap-5">
      {/* connecting line */}
      <span aria-hidden className="absolute top-5.5 right-[10%] left-[10%] hidden h-px bg-line md:block" />
      <span aria-hidden className="absolute top-0 bottom-0 left-5.25 w-px bg-line md:hidden" />
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li
          key={title}
          data-reveal
          style={{ ["--reveal-i" as string]: i }}
          className="relative grid grid-cols-[44px_1fr] gap-4 md:block"
        >
          <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink md:mx-0">
            <Icon className="size-5" strokeWidth={1.4} />
          </span>
          <div className="md:mt-5">
            <p className="font-display text-xs font-semibold text-brand" data-num>
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 font-sans text-[0.98rem] font-semibold">{title}</h3>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
