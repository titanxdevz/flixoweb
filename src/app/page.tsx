import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesCollage from "@/components/FeaturesCollage";
import CommandTeaser from "@/components/CommandTeaser";
import ComparisonTable from "@/components/ComparisonTable";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { FilterProvider } from "@/context/FilterContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flixo — Lossless Discord music bot with live DSP audio filters",
  description:
    "Stream 384kbps lossless sound to Discord with 14 live DSP filters (8D, BassBoost, Nightcore), Spotify & Last.fm sync, and 24/7 playback with no queue caps.",
};

export default function Home() {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-[#0E0919] text-white">
        <Navbar />
        <main>
          <Hero />
          <FeaturesCollage />
          <CommandTeaser />
          <ComparisonTable />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </FilterProvider>
  );
}
