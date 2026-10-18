import React from "react";
import FiltersClient from "@/components/FiltersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "14 DSP Audio Filters — Flixo Discord Music Bot",
  description:
    "Explore and test all 14 hardware-accelerated DSP audio filters available in Flixo: 8D audio, BassBoost, Nightcore, Vaporwave, and more.",
  openGraph: {
    title: "Flixo 14 DSP Audio Filters",
    description: "Real-time 8D, BassBoost, and Nightcore filters for Discord voice channels.",
    url: "https://flixo.fun/filters",
  },
};

export default function FiltersPage() {
  return <FiltersClient />;
}
