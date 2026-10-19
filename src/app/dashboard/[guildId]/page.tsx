import type { Metadata } from "next";
import LivePlayerClient from "@/components/dashboard/LivePlayerClient";

interface PageProps {
  params: Promise<{
    guildId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { guildId } = await params;
  return {
    title: `Studio Console — Guild #${guildId.slice(-4)} | Flixo`,
    description: "Lossless live Discord music player console with DSP filters, search, and queue control.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function GuildPlayerPage({ params }: PageProps) {
  const { guildId } = await params;
  return <LivePlayerClient guildId={guildId} />;
}
