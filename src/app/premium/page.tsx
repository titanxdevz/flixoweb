import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium — Flixo Discord Music Bot",
  description:
    "Learn about Flixo Premium donor perks, custom bot branding, and priority cluster routing.",
};

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-[#0E0919] text-white">
      <Navbar />

      <main className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#FF5CAA] hover:underline mb-3"
            >
              ← Back to home
            </Link>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              Honest premium tiers.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              We never lock essential audio quality behind subscriptions. Lossless 384kbps playback, all 14 DSP filters, and unlimited queue lengths are 100% free for every server. Premium supports server hosting costs and unlocks custom personalization.
            </p>
          </div>

          {/* Free vs Premium Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Free Tier Card */}
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-[#221636] border-[2px] border-[#000000] rounded-lg text-xs font-bold text-white mb-4">
                  Standard Plan
                </div>
                <h2 className="text-3xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
                  Free forever
                </h2>
                <div className="text-3xl font-black text-[#C4B5FD] font-[family-name:var(--font-fredoka)] mt-2">
                  $0 <span className="text-sm font-sans font-medium text-[#A692C6]">/ month</span>
                </div>
                <p className="mt-4 text-sm text-[#DDD4EC] font-medium leading-relaxed">
                  Full studio sound capability for any Discord community.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-[#DDD4EC] font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>384kbps lossless Lavalink audio</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>All 14 DSP audio filters (8D, BassBoost, Nightcore)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>Unlimited queue length (no 15-track caps)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>Spotify &amp; Last.fm live scrobbler sync</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>24/7 channel stay (/247)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span>Live synced lyrics</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t-[2px] border-[#000000]">
                <a
                  href={siteConfig.discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn w-full py-3 bg-[#7C3AED] text-white rounded-xl text-sm font-bold text-center hover:bg-[#6D28D9]"
                >
                  Add Free Bot
                </a>
              </div>
            </div>

            {/* Premium Donor Card */}
            <div className="bg-[#221636] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-[#FF5CAA] border-[2px] border-[#000000] rounded-lg text-xs font-bold text-white mb-4">
                  Supporter Tier
                </div>
                <h2 className="text-3xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
                  Server Supporter
                </h2>
                <div className="text-3xl font-black text-[#FF5CAA] font-[family-name:var(--font-fredoka)] mt-2">
                  [PRICE_PLACEHOLDER] <span className="text-sm font-sans font-medium text-[#A692C6]">/ month</span>
                </div>
                <p className="mt-4 text-sm text-[#DDD4EC] font-medium leading-relaxed">
                  Support cluster infrastructure costs and unlock custom branding.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-[#DDD4EC] font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#FF5CAA] font-bold">★</span>
                    <span>Everything in the Free plan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#FF5CAA] font-bold">★</span>
                    <span>Custom bot nickname &amp; embed hex colors (/admin customprofile)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#FF5CAA] font-bold">★</span>
                    <span>Priority routing on dedicated high-tier Lavalink clusters</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#FF5CAA] font-bold">★</span>
                    <span>Donor role &amp; badge in support server</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#FF5CAA] font-bold">★</span>
                    <span>Extended sleep timer limits</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t-[2px] border-[#000000]">
                <a
                  href={siteConfig.discordSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn w-full py-3 bg-[#FF5CAA] text-white rounded-xl text-sm font-bold text-center hover:bg-[#F43F85]"
                >
                  Get Supporter on Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
