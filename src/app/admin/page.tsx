import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { AdminView } from "./AdminView";

export const metadata: Metadata = { ...pageMeta("admin"), robots: { index: false } };

export default function AdminPage() {
  return <AdminView />;
}
