import type { Metadata } from "next";
import { AdminView } from "./AdminView";

export const metadata: Metadata = { title: "Dealer view (demo)", robots: { index: false } };

export default function AdminPage() {
  return <AdminView />;
}
