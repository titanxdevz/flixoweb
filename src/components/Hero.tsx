"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFilter } from "@/context/FilterContext";
import { siteConfig } from "@/config/site";
import { CatPawSticker, HeadphonesSticker, MusicNoteSticker, StarSticker } from "./StickerIcons";

interface BotStats {
  guilds: number | null;
  listeners: number | null;
  clusters: number | null;
  status: string;
}

export default function Hero() {
  const [stats, setStats] = useState<BotStats | null>(null);
  const { mascotHop, triggerMascotHop } = useFilter();

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setStats(data))
      .catch(() => {
        setStats({ guilds: null, listeners: null, clusters: null, status: "unavailable" });
      });
  }, []);

  const getMascotMotionClass = () => {
    if (mascotHop) {
      return "translate-y-[-24px] scale-105 rotate-3 transition-transform duration-200";
    }
    return "animate-breathe";
  };

  return (
    <section className="relative pt-12 md:pt-20 pb-20 md:pb-28 border-b-[3px] border-[#000000] overflow-visible bg-[#0E0919]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Huge Headline & Actions */}
          <div className="lg:col-span-7 z-20">
            {/* Small tag badge */}
            <div className="inline-block px-3.5 py-1 bg-[#221636] border-[2.5px] border-[#000000] rounded-lg shadow-[3px_3px_0px_#000000] text-xs font-bold text-[#FF5CAA] mb-5 rotate-[-1deg]">
              Studio Sound • Lossless 384kbps
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-white leading-[1.05] tracking-tight font-[family-name:var(--font-fredoka)]">
              The cutest Discord music bot with studio-grade sound.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#DDD4EC] font-medium max-w-xl leading-relaxed">
              Flixo streams 384kbps lossless audio to your voice channels with 14 live DSP filters, Spotify and Last.fm sync, and 24/7 playback with zero queue limits.
            </p>

            {/* Chunky Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={siteConfig.discordInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-7 py-4 bg-[#7C3AED] text-white rounded-2xl text-base font-extrabold hover:bg-[#6D28D9]"
              >
                Add to Discord
              </a>

              <Link
                href="/dashboard"
                className="brutal-btn px-6 py-4 bg-[#FFB020] text-black rounded-2xl text-base font-extrabold hover:bg-[#F59E0B] flex items-center gap-2"
              >
                <span>Web Player</span>
                <span className="px-1.5 py-0.5 bg-black text-[#FFB020] text-[10px] rounded uppercase font-mono font-bold">
                  Soon
                </span>
              </Link>

              <Link
                href="/filters"
                className="brutal-btn px-6 py-4 bg-[#1E1332] text-white rounded-2xl text-base font-extrabold hover:bg-[#2A1B44]"
              >
                Explore DSP filters
              </Link>
            </div>

            {/* Real Stats Row with "–" fallback */}
            <div className="mt-12 pt-8 border-t-[3px] border-[#000000] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#181026] border-[2.5px] border-[#000000] shadow-[4px_4px_0px_#000000] rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-[#A692C6] uppercase">Servers</div>
                <div className="text-2xl font-black text-white font-[family-name:var(--font-fredoka)] mt-0.5">
                  {stats?.guilds ? stats.guilds.toLocaleString() : "–"}
                </div>
              </div>

              <div className="bg-[#181026] border-[2.5px] border-[#000000] shadow-[4px_4px_0px_#000000] rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-[#A692C6] uppercase">Listeners</div>
                <div className="text-2xl font-black text-white font-[family-name:var(--font-fredoka)] mt-0.5">
                  {stats?.listeners ? stats.listeners.toLocaleString() : "–"}
                </div>
              </div>

              <div className="bg-[#181026] border-[2.5px] border-[#000000] shadow-[4px_4px_0px_#000000] rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-[#A692C6] uppercase">Bitrate</div>
                <div className="text-2xl font-black text-[#8B5CF6] font-[family-name:var(--font-fredoka)] mt-0.5">
                  384 kbps
                </div>
              </div>

              <div className="bg-[#181026] border-[2.5px] border-[#000000] shadow-[4px_4px_0px_#000000] rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-[#A692C6] uppercase">DSP filters</div>
                <div className="text-2xl font-black text-[#FF5CAA] font-[family-name:var(--font-fredoka)] mt-0.5">
                  14 filters
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Big Mascot Cutout overlapping hero edge */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-end z-30">
            {/* Mascot Wrapper with Spring Load-in Animation */}
            <div className="relative animate-mascot-spring">
              {/* Floating SVG Sticker Badges */}
              <div className="absolute -top-6 -left-6 z-40 rotate-[-12deg] hover:scale-110 transition-transform">
                <CatPawSticker />
              </div>

              <div className="absolute top-1/4 -right-4 z-40 rotate-[14deg] hover:scale-110 transition-transform">
                <MusicNoteSticker />
              </div>

              <div className="absolute -bottom-2 -left-4 z-40 rotate-[8deg] hover:scale-110 transition-transform">
                <HeadphonesSticker />
              </div>

              <div className="absolute top-2 right-12 z-40 rotate-[-6deg] hover:scale-110 transition-transform">
                <StarSticker />
              </div>

              {/* Speech bubble sticker */}
              <div className="absolute -top-12 right-0 z-40 bg-[#1E1332] border-[2.5px] border-[#000000] shadow-[3px_3px_0px_#000000] rounded-2xl px-3.5 py-1.5 text-xs font-bold text-white rotate-[3deg] select-none pointer-events-none">
                Click me to hop!
              </div>

              {/* Big Mascot with Sticker White Border and Ink Outline */}
              <div
                onClick={triggerMascotHop}
                className={`relative w-72 h-80 sm:w-96 sm:h-[420px] lg:w-[480px] lg:h-[500px] cursor-pointer select-none filter drop-shadow-[5px_5px_0px_#000000] -mb-16 md:-mb-24 ${getMascotMotionClass()}`}
                title="Click Flixo Chan!"
              >
                <Image
                  src="/flixo-sticker.png"
                  alt="Flixo Chan mascot with sticker border"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 320px, (max-width: 1200px) 480px, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
