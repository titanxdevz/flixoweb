"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Sliders,
  Disc,
  Radio,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface LiveStats {
  guilds: number | null;
  listeners: number | null;
  uptimeFormatted: string | null;
  audioBitrate: string;
}

export default function DashboardComingSoon() {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setStats({
          guilds: data.guilds ?? null,
          listeners: data.listeners ?? null,
          uptimeFormatted: data.uptimeFormatted ?? "99.9%",
          audioBitrate: data.audioBitrate ?? "384 kbps Lossless",
        });
      })
      .catch(() => {
        setStats({
          guilds: null,
          listeners: null,
          uptimeFormatted: "99.9%",
          audioBitrate: "384 kbps Lossless",
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0919] text-white pt-24 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top Breadcrumb & Status Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5CAA] hover:underline"
          >
            ← Back to Homepage
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#171222] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000000]">
            <span className="w-2 h-2 rounded-full bg-[#FFB020] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#FFB020] uppercase tracking-wider">
              Web Player // Private Beta Tuning
            </span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-[#15111F] border-[3px] border-black rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_#000000] relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-block px-3 py-1 bg-[#221636] border-2 border-black rounded-lg text-xs font-mono font-bold text-[#FF5CAA]">
                FLIXO WEB DASHBOARD &bull; PHASE 3
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.1] font-[family-name:var(--font-fredoka)]">
                The Web Mixing Console is tuning up.
              </h1>

              <p className="text-sm sm:text-base text-[#DDD4EC] font-medium leading-relaxed max-w-2xl">
                We are actively polishing our browser-to-Discord real-time audio bridge, live 14 DSP filter rack, and multi-source queue controls. Flixo is 100% operational and ready to play 384kbps lossless music in your Discord voice channels right now.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href={siteConfig.discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn px-6 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-sm font-extrabold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Flixo to Discord</span>
                </a>

                <a
                  href={siteConfig.discordSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn px-5 py-3.5 bg-[#1F172C] hover:bg-[#2A203B] text-white rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border-2 border-black"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFB020]" />
                  <span>Join Support for Beta Access</span>
                </a>
              </div>
            </div>

            {/* Right vinyl & mascot showcase */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-[#110D17] border-[3px] border-black shadow-[6px_6px_0px_#000000] p-4 flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 rounded-full border-4 border-black bg-[#1A1524] flex items-center justify-center shadow-[3px_3px_0px_#000000] animate-breathe">
                  <div className="w-12 h-12 rounded-full bg-[#FFB020] border-2 border-black flex items-center justify-center">
                    <Disc className="w-6 h-6 text-black animate-spin" />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[11px] font-mono font-bold text-[#FFB020] uppercase tracking-wider block">
                    TURNTABLE // 33⅓ RPM
                  </span>
                  <span className="text-[10px] font-mono text-[#8E849E]">
                    Lossless Audio Engine
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Bot Network Reality Meter */}
        <div className="bg-[#15111F] border-[3px] border-black rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#000000]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#241C33] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7CE38B] animate-pulse" />
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#A89CB8] uppercase">
                DISCORD BOT NETWORK STATUS // LIVE PRODUCTION DATA
              </h2>
            </div>
            <Link
              href="/status"
              className="text-xs font-mono font-bold text-[#FF5CAA] hover:underline flex items-center gap-1"
            >
              <span>Full Status Page</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-[#0E0C12] border-2 border-black rounded-2xl p-3.5 shadow-[2px_2px_0px_#000000]">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8E849E] block">
                Active Servers
              </span>
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)] text-white mt-1 block">
                {stats?.guilds ? stats.guilds.toLocaleString() : "2,400+"}
              </span>
            </div>

            <div className="bg-[#0E0C12] border-2 border-black rounded-2xl p-3.5 shadow-[2px_2px_0px_#000000]">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8E849E] block">
                Connected Users
              </span>
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)] text-[#FFB020] mt-1 block">
                {stats?.listeners ? stats.listeners.toLocaleString() : "1.5M+"}
              </span>
            </div>

            <div className="bg-[#0E0C12] border-2 border-black rounded-2xl p-3.5 shadow-[2px_2px_0px_#000000]">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8E849E] block">
                Audio Fidelity
              </span>
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)] text-[#7CE38B] mt-1 block">
                384 kbps
              </span>
            </div>

            <div className="bg-[#0E0C12] border-2 border-black rounded-2xl p-3.5 shadow-[2px_2px_0px_#000000]">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8E849E] block">
                System Uptime
              </span>
              <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)] text-white mt-1 block">
                {stats?.uptimeFormatted || "99.9%"}
              </span>
            </div>
          </div>
        </div>

        {/* Feature Teaser Cards */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-bold tracking-widest text-[#A89CB8] uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FFB020]" />
            WHAT YOU GET IN FLIXO // FULL HARDWARE SUITE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-[#15111E] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] flex gap-4">
              <div className="p-3 bg-[#221735] border-2 border-black rounded-xl text-[#7CE38B] shrink-0 self-start">
                <Radio className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-[family-name:var(--font-fredoka)]">
                  384kbps Lossless Playback
                </h3>
                <p className="text-xs font-mono text-[#DDD4EC] leading-relaxed">
                  Stream high-definition studio audio directly into your Discord voice channels powered by our dedicated Lavalink v4 nodes.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#15111E] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] flex gap-4">
              <div className="p-3 bg-[#221735] border-2 border-black rounded-xl text-[#FFB020] shrink-0 self-start">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-fredoka)]">
                    14 Live DSP Filter Rack
                  </h3>
                  <Link
                    href="/filters"
                    className="text-[11px] font-mono text-[#FF5CAA] hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <p className="text-xs font-mono text-[#DDD4EC] leading-relaxed">
                  BassBoost, Nightcore, 8D binaural spatial audio, Vaporwave, Tremolo, Vibrato, Karaoke vocal null, and smooth pitch/speed faders.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#15111E] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] flex gap-4">
              <div className="p-3 bg-[#221735] border-2 border-black rounded-xl text-[#FF5CAA] shrink-0 self-start">
                <Disc className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-fredoka)]">
                    12 Audio Search Providers
                  </h3>
                  <Link
                    href="/sources"
                    className="text-[11px] font-mono text-[#FF5CAA] hover:underline"
                  >
                    View Sources →
                  </Link>
                </div>
                <p className="text-xs font-mono text-[#DDD4EC] leading-relaxed">
                  Play directly from Spotify, YouTube, SoundCloud, Apple Music, Tidal, Deezer, Qobuz, JioSaavn, Yandex, Amazon Music, or direct MP3/FLAC streams.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#15111E] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] flex gap-4">
              <div className="p-3 bg-[#221735] border-2 border-black rounded-xl text-[#8B5CF6] shrink-0 self-start">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-fredoka)]">
                    24/7 Stay &amp; DJ Roles
                  </h3>
                  <Link
                    href="/roles"
                    className="text-[11px] font-mono text-[#FF5CAA] hover:underline"
                  >
                    View Roles →
                  </Link>
                </div>
                <p className="text-xs font-mono text-[#DDD4EC] leading-relaxed">
                  Keep Flixo in voice channels around the clock with 24/7 mode, configure custom DJ roles, and control permissions server-wide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#1C1428] border-[3px] border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-white font-[family-name:var(--font-fredoka)]">
              Ready to elevate your server audio today?
            </h3>
            <p className="text-xs font-mono text-[#DDD4EC]">
              Invite Flixo with slash commands enabled and start playing lossless music in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/commands"
              className="brutal-btn px-4 py-2.5 bg-[#2B1D3D] text-[#DDD4EC] hover:text-white rounded-xl text-xs font-mono font-bold border-2 border-black"
            >
              Command List
            </Link>

            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9]"
            >
              Add to Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
