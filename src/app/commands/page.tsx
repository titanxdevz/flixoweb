import React from "react";
import CommandsClient from "@/components/CommandsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commands Directory — Flixo Discord Music Bot",
  description:
    "Complete list of all Discord slash commands for Flixo, including playback, 14 DSP filters, playlists, Spotify sync, and 24/7 channel stay.",
  openGraph: {
    title: "Flixo Commands Directory",
    description: "Browse and copy all 45+ Discord slash commands for Flixo.",
    url: "https://flixo.fun/commands",
  },
};

export default function CommandsPage() {
  return <CommandsClient />;
}
