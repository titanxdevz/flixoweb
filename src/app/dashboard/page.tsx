import { Suspense } from "react";
import GuildSelector from "@/components/dashboard/GuildSelector";

export const metadata: Metadata = {
  title: "Server Dashboard — Flixo Web Player",
  description: "Select a Discord server to control live playback, DSP filters, and queue.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E0919] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#FFB020] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GuildSelector />
    </Suspense>
  );
}
