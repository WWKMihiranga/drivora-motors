import {
  BadgeCheck, Banknote, Calculator, Car, Clock, FileCheck2, FileSearch, FileText, Fuel, Gauge, HandCoins, Heart, Home,
  KeyRound, MapPin, MessageCircle, Phone, ScrollText, Search, Settings2, ShieldCheck, Star, Truck, Users, Wrench,
  type LucideProps,
} from "lucide-react";

/*
 * Icons a dealer can choose for editable cards (benefits, steps, "why us"). The icon is stored by name
 * in site-data.json, e.g. "truck"; the Fivora editor offers these names as a select.
 */
export const CONTENT_ICONS = {
  "badge-check": BadgeCheck, banknote: Banknote, calculator: Calculator, car: Car, clock: Clock,
  "file-check": FileCheck2, "file-search": FileSearch, "file-text": FileText, fuel: Fuel, gauge: Gauge,
  "hand-coins": HandCoins, heart: Heart, home: Home, key: KeyRound, "map-pin": MapPin, message: MessageCircle,
  phone: Phone, scroll: ScrollText, search: Search, settings: Settings2, "shield-check": ShieldCheck, star: Star,
  truck: Truck, users: Users, wrench: Wrench,
} as const;

export type ContentIconName = keyof typeof CONTENT_ICONS;

export function ContentIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = CONTENT_ICONS[name as ContentIconName] ?? BadgeCheck;
  return <Icon {...props} />;
}
