import type { Metadata } from "next";
import GuildSelector from "@/components/dashboard/GuildSelector";

export const metadata: Metadata = {
  title: "Server Dashboard — Flixo Web Player",
  description: "Select a Discord server to control live playback, DSP filters, and queue.",
  robots: {
    index: false, // Dashboard is behind authenticated session
    follow: false,
  },
};

export default function DashboardPage() {
  return <GuildSelector />;
}
