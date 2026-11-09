"use client";

import { useApp, type Lang } from "@/store";

/*
 * Phase 1 translates navigation and the key calls to action only.
 * Sinhala and Tamil strings need a native-speaker review before client demos.
 */
const dict = {
  en: {
    cars: "Cars",
    finance: "Leasing",
    sell: "Sell / Trade-in",
    about: "About",
    contact: "Contact",
    book: "Book a test drive",
    bookShort: "Book",
    call: "Call",
    whatsapp: "WhatsApp",
    browse: "Browse all cars",
    calc: "Leasing calculator",
    saved: "Saved",
    menu: "Menu",
  },
  si: {
    cars: "වාහන",
    finance: "ලීසිං",
    sell: "විකුණන්න / හුවමාරු",
    about: "අප ගැන",
    contact: "සම්බන්ධ වන්න",
    book: "ටෙස්ට් ඩ්‍රයිව් එකක් වෙන් කරන්න",
    bookShort: "වෙන් කරන්න",
    call: "අමතන්න",
    whatsapp: "WhatsApp",
    browse: "සියලු වාහන බලන්න",
    calc: "ලීසිං ගණකය",
    saved: "සුරැකි",
    menu: "මෙනුව",
  },
  ta: {
    cars: "வாகனங்கள்",
    finance: "லீசிங்",
    sell: "விற்க / மாற்ற",
    about: "எங்களைப் பற்றி",
    contact: "தொடர்பு",
    book: "சோதனை ஓட்டம் முன்பதிவு",
    bookShort: "முன்பதிவு",
    call: "அழைக்க",
    whatsapp: "WhatsApp",
    browse: "அனைத்து வாகனங்களும்",
    calc: "லீசிங் கணிப்பான்",
    saved: "சேமித்தவை",
    menu: "மெனு",
  },
} satisfies Record<Lang, Record<string, string>>;

export type DictKey = keyof (typeof dict)["en"];

export function useT() {
  const lang = useApp((s) => s.lang);
  return (k: DictKey) => dict[lang][k] ?? dict.en[k];
}

export const langNames: Record<Lang, string> = { en: "EN", si: "සිං", ta: "தமி" };
