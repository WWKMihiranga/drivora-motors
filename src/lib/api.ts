/*
 * The only module that touches the mock data. Each function is async and returns
 * plain objects, mirroring the shape a real API would return in phase 2.
 */
import { vehicles } from "@/data/vehicles";
import { posts, reviews, faqs } from "@/data/content";
import type { Vehicle } from "@/types";

export async function getVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

export async function getVehicle(slug: string): Promise<Vehicle | undefined> {
  return vehicles.find((v) => v.slug === slug);
}

export async function getSimilar(v: Vehicle, n = 4): Promise<Vehicle[]> {
  const score = (o: Vehicle) =>
    (o.bodyType === v.bodyType ? 3 : 0) +
    (o.fuel === v.fuel ? 2 : 0) +
    (Math.abs(o.priceLkr - v.priceLkr) / v.priceLkr < 0.35 ? 2 : 0) +
    (o.make === v.make ? 1 : 0);
  return vehicles
    .filter((o) => o.id !== v.id && o.status !== "sold")
    .sort((a, b) => score(b) - score(a))
    .slice(0, n);
}

export async function getFeatured(): Promise<Vehicle[]> {
  return vehicles.filter((v) => v.status !== "sold").sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
}

export async function getPosts() {
  return posts;
}
export async function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
export async function getReviews() {
  return reviews;
}
export async function getFaqs() {
  return faqs;
}

export { vehicleTitle } from "@/lib/format";
