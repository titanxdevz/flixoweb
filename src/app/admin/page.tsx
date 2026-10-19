import type { Metadata } from "next";
import AdminPortalClient from "@/components/admin/AdminPortalClient";

export const metadata: Metadata = {
  title: "Admin Portal — Flixo Audio Engine",
  description: "Bot cluster inspection, user permission control, and real-time audit logs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortalClient />;
}
