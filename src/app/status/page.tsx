import React from "react";
import StatusClient from "@/components/StatusClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status & Cluster Health — Flixo Discord Music Bot",
  description:
    "Real-time monitoring of Flixo bot clusters, Lavalink audio nodes, active voice players, and uptime.",
  openGraph: {
    title: "Flixo System Status & Health",
    description: "Live cluster and Lavalink audio node status for Flixo.",
    url: "https://flixo.fun/status",
  },
};

export default function StatusPage() {
  return <StatusClient />;
}
