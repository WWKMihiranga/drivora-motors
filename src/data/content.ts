import siteData from "@/data/site-data.json";
import type { Lead, Post, Review } from "@/types";

/*
 * Demo content lives in src/data/site-data.json so a dealer can edit it in the Fivora editor.
 * Reviews are shown with the car the buyer chose, not stock portraits of strangers.
 */
const c = siteData.content;
export const reviews = (c.reviews ?? []) as unknown as Review[];
export const posts = (c.posts ?? []) as unknown as Post[];
export const faqs = (c.faqs ?? []) as { q: string; a: string }[];
/** Demo enquiries for the dealer view. Real leads come from the site's forms, so these are not dealer content. */
export const seedLeads: (Omit<Lead, "createdAt"> & { hoursAgo: number })[] = [
  {
    "id": "L-1042",
    "type": "test-drive",
    "name": "Ravindu S.",
    "phone": "077 ••• 4412",
    "vehicle": "Honda Vezel e:HEV Z",
    "source": "Website",
    "stage": "New",
    "hoursAgo": 1
  },
  {
    "id": "L-1041",
    "type": "enquiry",
    "name": "Shalini F.",
    "phone": "071 ••• 9033",
    "vehicle": "BYD Seal Premium",
    "source": "WhatsApp",
    "stage": "Contacted",
    "hoursAgo": 3
  },
  {
    "id": "L-1040",
    "type": "trade-in",
    "name": "Mohamed N.",
    "phone": "076 ••• 1180",
    "vehicle": "Toyota Axio 2014 (trade-in)",
    "source": "Website",
    "stage": "New",
    "hoursAgo": 5
  },
  {
    "id": "L-1039",
    "type": "enquiry",
    "name": "Chathura W.",
    "phone": "070 ••• 6625",
    "vehicle": "Land Rover Defender 110",
    "source": "Facebook",
    "stage": "Negotiation",
    "hoursAgo": 9
  },
  {
    "id": "L-1038",
    "type": "test-drive",
    "name": "Ishara P.",
    "phone": "077 ••• 2219",
    "vehicle": "Toyota Yaris 1.3 G",
    "source": "ikman",
    "stage": "Test drive",
    "hoursAgo": 20
  },
  {
    "id": "L-1037",
    "type": "reservation",
    "name": "Gayan K.",
    "phone": "072 ••• 7741",
    "vehicle": "Nissan X-Trail Hybrid",
    "source": "Walk-in",
    "stage": "Won",
    "hoursAgo": 26
  },
  {
    "id": "L-1036",
    "type": "enquiry",
    "name": "Priya T.",
    "phone": "075 ••• 3304",
    "vehicle": "Suzuki Swift Hybrid MZ",
    "source": "WhatsApp",
    "stage": "Contacted",
    "hoursAgo": 31
  },
  {
    "id": "L-1035",
    "type": "enquiry",
    "name": "Anjana R.",
    "phone": "071 ••• 8820",
    "vehicle": "Toyota RAV4 Hybrid",
    "source": "Phone",
    "stage": "Lost",
    "hoursAgo": 48
  },
  {
    "id": "L-1034",
    "type": "test-drive",
    "name": "Nuwan D.",
    "phone": "077 ••• 5512",
    "vehicle": "Mazda CX-5",
    "source": "Website",
    "stage": "Test drive",
    "hoursAgo": 52
  },
  {
    "id": "L-1033",
    "type": "enquiry",
    "name": "Kavindi H.",
    "phone": "070 ••• 1047",
    "vehicle": "Toyota Corolla Altis",
    "source": "ikman",
    "stage": "Negotiation",
    "hoursAgo": 70
  },
  {
    "id": "L-1032",
    "type": "trade-in",
    "name": "Sajith L.",
    "phone": "076 ••• 9902",
    "vehicle": "Honda Fit 2013 (trade-in)",
    "source": "WhatsApp",
    "stage": "Contacted",
    "hoursAgo": 75
  },
  {
    "id": "L-1031",
    "type": "enquiry",
    "name": "Ramesh V.",
    "phone": "072 ••• 6370",
    "vehicle": "Toyota Hilux Revo",
    "source": "Facebook",
    "stage": "Won",
    "hoursAgo": 96
  }
];

const day = 86_400_000;
export const dayMs = day;
