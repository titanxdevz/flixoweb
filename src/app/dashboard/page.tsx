import type { Metadata } from "next";
import DashboardComingSoon from "@/components/dashboard/DashboardComingSoon";

export const metadata: Metadata = {
  title: "Web Player & Dashboard (Coming Soon) — Flixo",
  description:
    "Flixo web mixing console is coming soon. Stream 384kbps lossless audio to your Discord server today with 14 live DSP filters.",
  openGraph: {
    title: "Web Player & Dashboard (Coming Soon) — Flixo",
    description:
      "Flixo web mixing console is coming soon. Stream 384kbps lossless audio to your Discord server today.",
  },
};

export default function DashboardPage() {
  return <DashboardComingSoon />;
}
