export type Condition = "brand-new" | "reconditioned" | "used";
export type Status = "available" | "reserved" | "sold" | "arriving";
export type Fuel = "petrol" | "diesel" | "hybrid" | "plug-in-hybrid" | "electric";
export type BodyType = "hatchback" | "sedan" | "suv" | "pickup" | "coupe";
export type VehicleClass = "car" | "commercial";

export interface VehicleDocument {
  type: "auction-sheet" | "inspection" | "service" | "cr";
  label: string;
  note: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  grade?: string;
  yom: number;
  yor?: number;
  condition: Condition;
  status: Status;
  mileageKm: number;
  mileageSource: "auction-sheet" | "service-log" | "odometer" | "new";
  fuel: Fuel;
  transmission: "auto" | "manual";
  engineCc?: number;
  batteryKwh?: number;
  bodyType: BodyType;
  colour: string;
  seats: number;
  location: string;
  priceLkr: number;
  previousPriceLkr?: number;
  vehicleClass: VehicleClass;
  images: string[];
  verified: boolean;
  auctionGrade?: string;
  owners?: number;
  features: string[];
  description: string;
  highlights: string[];
  documents: VehicleDocument[];
  listedDaysAgo: number;
  badge?: "New arrival" | "Price drop" | "Popular" | "Just landed";
}

export interface Review {
  id: string;
  name: string;
  town: string;
  rating: number;
  text: string;
  car: string;
  image: string;
  monthsAgo: number;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: "Guide" | "News" | "Leasing" | "EV";
  image: string;
  readMins: number;
  date: string;
  body: { heading?: string; text: string }[];
}

export interface Lead {
  id: string;
  type: "enquiry" | "test-drive" | "trade-in" | "reservation";
  name: string;
  phone: string;
  vehicle?: string;
  message?: string;
  date?: string;
  createdAt: number;
  source: "Website" | "WhatsApp" | "Phone" | "ikman" | "Facebook" | "Walk-in";
  stage: "New" | "Contacted" | "Test drive" | "Negotiation" | "Won" | "Lost";
}
