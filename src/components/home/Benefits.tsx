import { Calculator, FileCheck2, Truck, Wrench } from "lucide-react";

const items = [
  { icon: FileCheck2, title: "Verified history", text: "Auction sheet or service book on every car" },
  { icon: Calculator, title: "Clear leasing", text: "Real monthly figures, CBSL limits built in" },
  { icon: Truck, title: "Island-wide delivery", text: "Free within 30 km of Nugegoda" },
  { icon: Wrench, title: "6-month cover", text: "Engine and gearbox, on every used car" },
];

export function Benefits() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4 lg:divide-x lg:divide-line">
      {items.map(({ icon: Icon, title, text }, i) => (
        <li
          key={title}
          data-reveal
          style={{ ["--reveal-i" as string]: i }}
          className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4 lg:px-6 lg:first:pl-0"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink">
            <Icon className="size-5" strokeWidth={1.4} />
          </span>
          <div>
            <h3 className="font-sans text-[0.92rem] font-semibold">{title}</h3>
            <p className="mt-1 text-[0.85rem] leading-snug text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
