import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supported Audio Sources — Flixo Discord Music Bot",
  description:
    "Comprehensive list of the 12 audio streaming platforms and URL link types supported by Flixo.",
};

const sources = [
  {
    name: "Spotify",
    key: "spotify",
    type: "Tracks, Albums, Playlists, Artists, User OAuth2",
    details: "Supports direct spotify.com links, playlist batch ingestion, and private user library queueing via /spotify login.",
  },
  {
    name: "YouTube & YouTube Music",
    key: "youtube / youtubemusic",
    type: "Videos, Playlists, Streams, Music Tracks",
    details: "High-resolution audio streaming routed through multi-cluster proxy failover to prevent IP blocks and rate limits.",
  },
  {
    name: "SoundCloud",
    key: "soundcloud",
    type: "Tracks, Sets, Artists",
    details: "Lossless native streaming from independent creators, DJ live sets, and user playlists.",
  },
  {
    name: "Apple Music",
    key: "applemusic",
    type: "Songs, Albums, Curated Playlists",
    details: "Automated track metadata resolution mapped to high-fidelity audio streams.",
  },
  {
    name: "Deezer",
    key: "deezer",
    type: "Tracks, Albums, Playlists",
    details: "FLAC and 320kbps MP3 stream extraction with accurate metadata and ISRC resolution.",
  },
  {
    name: "Tidal",
    key: "tidal",
    type: "Lossless Tracks, Master Albums",
    details: "Audiophile-grade stream ingestion for Hi-Fi subscribers and studio audio.",
  },
  {
    name: "Qobuz",
    key: "qobuz",
    type: "Studio Quality Tracks & Albums",
    details: "24-bit studio sound resolution support through Lavalink audio pipelines.",
  },
  {
    name: "JioSaavn",
    key: "jiosaavn",
    type: "Bollywood, Regional Indian, Playlists",
    details: "Complete regional catalog support for Hindi, Punjabi, Tamil, Telugu, and English songs.",
  },
  {
    name: "Yandex Music",
    key: "yandex",
    type: "Tracks, Podcasts, Playlists",
    details: "Direct URL ingestion and playlist parsing for Eastern European releases.",
  },
  {
    name: "Amazon Music",
    key: "amazonmusic",
    type: "Prime & Unlimited Albums, Playlists",
    details: "Metadata extraction and track matching across high-bitrate streaming nodes.",
  },
  {
    name: "Direct HTTP / Radio Streams",
    key: "http",
    type: "Icecast, Shoutcast, MP3, OGG, FLAC URLs",
    details: "Live internet radio stations, continuous study streams, and custom podcast feeds.",
  },
];

export default function SourcesPage() {
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
              Supported audio sources.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              Flixo decodes audio from 12 major streaming platforms. Paste any link directly into /play or specify your platform using the search source parameter.
            </p>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sources.map((src) => (
              <div
                key={src.name}
                className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
                      {src.name}
                    </h2>
                    <code className="text-[11px] font-mono text-[#FF5CAA] bg-[#120B1E] px-2 py-0.5 rounded border border-[#000000]">
                      {src.key}
                    </code>
                  </div>

                  <div className="text-xs font-mono font-bold text-[#C4B5FD] mb-3">
                    {src.type}
                  </div>

                  <p className="text-xs sm:text-sm text-[#DDD4EC] font-medium leading-relaxed">
                    {src.details}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-[2px] border-[#000000] flex justify-between items-center text-xs text-[#A692C6] font-mono">
                  <span>384kbps decoding</span>
                  <span className="text-[#10B981] font-bold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
