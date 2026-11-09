import type { Lead, Post, Review } from "@/types";
import { IMG } from "@/lib/unsplash";

/* Demo reviews. Shown with the car the buyer chose, not stock portraits of strangers. */
export const reviews: Review[] = [
  {
    id: "r1",
    name: "Dilshan Perera",
    town: "Maharagama",
    rating: 5,
    text: "They sent me the auction sheet on WhatsApp before I even visited, and the car matched it exactly. The leasing paperwork took two days instead of two weeks.",
    car: "Honda Vezel e:HEV Z",
    image: "1630051191354-932e27e318fe",
    monthsAgo: 1,
  },
  {
    id: "r2",
    name: "Nadeesha Wickramasinghe",
    town: "Kandy",
    rating: 5,
    text: "I was nervous buying from Colombo while living in Kandy. Kasun did a video walk-around, answered every question and they delivered the car to my door.",
    car: "Toyota Yaris 1.3 G",
    image: "1749058983469-11eaef8d7bc5",
    monthsAgo: 2,
  },
  {
    id: "r3",
    name: "Arun Kumaran",
    town: "Jaffna",
    rating: 5,
    text: "Fair trade-in price for my old Axio, no haggling games. The price on the website was the price on the invoice.",
    car: "Toyota C-HR G LED",
    image: "1706117948467-91727d5ef03c",
    monthsAgo: 3,
  },
  {
    id: "r4",
    name: "Fathima Rizvi",
    town: "Dehiwala",
    rating: 4,
    text: "Good choice of hybrids and very patient staff. Only wish the showroom had more parking on Saturdays.",
    car: "Suzuki Swift Hybrid MZ",
    image: "1699862335489-36f7dec55c0e",
    monthsAgo: 4,
  },
  {
    id: "r5",
    name: "Kasun Jayasuriya",
    town: "Kurunegala",
    rating: 5,
    text: "Bought our first EV here. They explained charging, installed the wall box with an electrician they trust, and called a week later to check in.",
    car: "BYD Seal Premium",
    image: "1728469876498-60596cfe2c0b",
    monthsAgo: 2,
  },
  {
    id: "r6",
    name: "Tharushi Mendis",
    town: "Galle",
    rating: 5,
    text: "The 150-point inspection report was detailed, and they fixed two small things before handover without me asking.",
    car: "Mazda CX-5 25S L",
    image: "1743114713466-f12a85992a75",
    monthsAgo: 5,
  },
];

export const posts: Post[] = [
  {
    slug: "reconditioned-vs-used-auction-sheet",
    title: "Reconditioned or used? What the auction sheet really tells you",
    excerpt: "How to read a Japanese auction sheet, which grades to trust, and why a used car's service book matters just as much.",
    category: "Guide",
    image: IMG.showroom,
    readMins: 6,
    date: "2026-10-28",
    body: [
      { text: "Reconditioned cars are pre-owned imports, mostly from Japan, that have not yet been registered in Sri Lanka. Used cars are already registered here. Each has its own paper trail, and that trail is the best protection you have against a rolled-back odometer." },
      { heading: "Reading the grade", text: "The overall grade runs from 1 to 6, with S for nearly new. Most good imports sit at 4 or 4.5. The interior grade (A to E) tells you how the cabin has been treated. A 4.5/B car is usually a better buy than a 5/C one." },
      { heading: "The map of the body", text: "The small car diagram shows every mark the inspector found. A1 is a tiny scratch, U2 a dent the size of a coin, W1 a repair wave that is hard to see. A few A1s are normal. Several W marks on one side deserve a question." },
      { heading: "Mileage", text: "The auction sheet records the odometer reading on the day of sale. We print that number on every listing and next to our own reading at handover, so you can see they match." },
      { heading: "For used cars", text: "Ask for the service book and agent invoices. Mileage should rise steadily from one stamp to the next. If a car has done 15,000 km a year for five years and then 2,000 km for three, ask why." },
    ],
  },
  {
    slug: "leasing-2026-ltv-rules",
    title: "Leasing in 2026: the Central Bank's new limits, explained",
    excerpt: "Since 25 May 2026 lenders can finance only 40% of an unregistered car. Here is what that means for your down payment.",
    category: "Leasing",
    image: IMG.carKeys,
    readMins: 4,
    date: "2026-10-12",
    body: [
      { text: "On 25 May 2026 the Central Bank of Sri Lanka lowered the maximum loan-to-value (LTV) ratios for motor vehicle loans and leases. Every bank, finance company and leasing company has to follow them." },
      { heading: "The limits", text: "For cars, SUVs and vans that are unregistered or registered for less than a year, the lender can finance up to 40% of the value, so you put down at least 60%. Commercial vehicles in the same situation can be financed up to 60%. Any vehicle registered and used for more than a year can be financed up to 60%." },
      { heading: "Flat rate vs reducing balance", text: "Many leasing offers quote a flat rate, charged on the original amount for the whole term. The reducing-balance rate shows the true cost, because interest is charged only on what you still owe. Our calculator shows both, so you can compare offers fairly." },
      { heading: "What we do", text: "We work with several lenders and send your application to the ones most likely to approve it. Figures on this site are estimates; the lender confirms the final rate." },
    ],
  },
  {
    slug: "is-an-ev-right-for-sri-lanka",
    title: "Is an EV right for Sri Lankan roads?",
    excerpt: "Charging at home, range in the hill country, battery health checks and the questions we ask every EV buyer.",
    category: "EV",
    image: IMG.evCharging,
    readMins: 5,
    date: "2026-09-30",
    body: [
      { text: "Electric cars now lead brand-new car registrations in Sri Lanka. They make the most sense if you can charge at home and mostly drive within a predictable radius." },
      { heading: "Home charging", text: "A 7 kW wall box fills most batteries overnight. Before delivery we arrange an electrician to check your supply and earthing." },
      { heading: "Up-country trips", text: "Climbing to Nuwara Eliya uses more energy, but you get some back coming down. Plan a top-up on longer trips and you will be fine." },
      { heading: "Used EVs", text: "For a used EV the battery state of health matters more than the odometer. We test and print it on every listing." },
    ],
  },
  {
    slug: "our-150-point-inspection",
    title: "Our 150-point inspection, step by step",
    excerpt: "From paint-depth readings to a hybrid battery test: what happens to every car before it goes on this website.",
    category: "Guide",
    image: IMG.inspection,
    readMins: 3,
    date: "2026-09-12",
    body: [
      { text: "Every car we list goes through the same inspection, carried out by our own technicians and signed off by the workshop manager." },
      { heading: "Body and paint", text: "We measure paint depth on every panel to find repaints, and check the underbody for flood or accident repairs." },
      { heading: "Mechanical", text: "We road-test the car, scan the engine and gearbox for stored faults, check suspension and brakes, and test the hybrid or EV battery." },
      { heading: "Paperwork", text: "We match the chassis number to the documents, confirm there is no outstanding finance, and check that the mileage history is consistent." },
    ],
  },
];

export const faqs = [
  { q: "What is the difference between reconditioned and used?", a: "Reconditioned cars are pre-owned imports, mostly from Japan, that have not yet been registered in Sri Lanka. Used cars are already registered here and have local owners on record." },
  { q: "How much down payment do I need for leasing?", a: "Since 25 May 2026, lenders can finance up to 40% of an unregistered or newly registered car, so you need at least 60% down. For cars registered and used over a year, and for commercial vehicles, they can finance up to 60%. Our calculator applies these rules automatically." },
  { q: "Can I see the auction sheet before visiting?", a: "Yes. Every reconditioned car has its auction sheet and an English translation on the listing, and we can send the original on WhatsApp." },
  { q: "Do you accept trade-ins?", a: "Yes. Send us your car's details and a few photos through the Sell or trade-in page and we will reply with a price range, usually the same day." },
  { q: "Can you deliver outside Colombo?", a: "We deliver island-wide. Delivery within 30 km of Nugegoda is free; further away we charge the driver's cost only." },
  { q: "Is the price on the website the final price?", a: "The listed price includes all duties and our fees. Registration (for reconditioned and brand-new cars) and insurance are extra and we tell you the exact amount up front." },
  { q: "Do your cars come with a warranty?", a: "Brand-new cars carry the agent warranty. Reconditioned and used cars come with our 6-month engine and gearbox cover, and you can extend it." },
  { q: "How do I reserve a car?", a: "Pay a refundable deposit of Rs 100,000 and we hold the car for 5 days while your finance is approved." },
  { q: "Can I bring my own mechanic?", a: "Of course. Book a viewing and bring whoever you trust. We will put the car on a lift for them." },
  { q: "What documents do I need to buy?", a: "Your NIC or passport and proof of address. For leasing, the lender will also ask for proof of income." },
];

const day = 86_400_000;

export const seedLeads: (Omit<Lead, "createdAt"> & { hoursAgo: number })[] = [
  { id: "L-1042", type: "test-drive", name: "Ravindu S.", phone: "077 ••• 4412", vehicle: "Honda Vezel e:HEV Z", source: "Website", stage: "New", hoursAgo: 1 },
  { id: "L-1041", type: "enquiry", name: "Shalini F.", phone: "071 ••• 9033", vehicle: "BYD Seal Premium", source: "WhatsApp", stage: "Contacted", hoursAgo: 3 },
  { id: "L-1040", type: "trade-in", name: "Mohamed N.", phone: "076 ••• 1180", vehicle: "Toyota Axio 2014 (trade-in)", source: "Website", stage: "New", hoursAgo: 5 },
  { id: "L-1039", type: "enquiry", name: "Chathura W.", phone: "070 ••• 6625", vehicle: "Land Rover Defender 110", source: "Facebook", stage: "Negotiation", hoursAgo: 9 },
  { id: "L-1038", type: "test-drive", name: "Ishara P.", phone: "077 ••• 2219", vehicle: "Toyota Yaris 1.3 G", source: "ikman", stage: "Test drive", hoursAgo: 20 },
  { id: "L-1037", type: "reservation", name: "Gayan K.", phone: "072 ••• 7741", vehicle: "Nissan X-Trail Hybrid", source: "Walk-in", stage: "Won", hoursAgo: 26 },
  { id: "L-1036", type: "enquiry", name: "Priya T.", phone: "075 ••• 3304", vehicle: "Suzuki Swift Hybrid MZ", source: "WhatsApp", stage: "Contacted", hoursAgo: 31 },
  { id: "L-1035", type: "enquiry", name: "Anjana R.", phone: "071 ••• 8820", vehicle: "Toyota RAV4 Hybrid", source: "Phone", stage: "Lost", hoursAgo: 48 },
  { id: "L-1034", type: "test-drive", name: "Nuwan D.", phone: "077 ••• 5512", vehicle: "Mazda CX-5", source: "Website", stage: "Test drive", hoursAgo: 52 },
  { id: "L-1033", type: "enquiry", name: "Kavindi H.", phone: "070 ••• 1047", vehicle: "Toyota Corolla Altis", source: "ikman", stage: "Negotiation", hoursAgo: 70 },
  { id: "L-1032", type: "trade-in", name: "Sajith L.", phone: "076 ••• 9902", vehicle: "Honda Fit 2013 (trade-in)", source: "WhatsApp", stage: "Contacted", hoursAgo: 75 },
  { id: "L-1031", type: "enquiry", name: "Ramesh V.", phone: "072 ••• 6370", vehicle: "Toyota Hilux Revo", source: "Facebook", stage: "Won", hoursAgo: 96 },
];

export const dayMs = day;
