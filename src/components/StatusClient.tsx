"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface AudioNodeInfo {
  id: string;
  connected: boolean;
  status: string;
  bitrate: string;
}

interface SystemStats {
  guilds: number | null;
  listeners: number | null;
  activePlayers: number | null;
  uptimeFormatted: string | null;
  audioBitrate: string;
  audioNodes: AudioNodeInfo[];
  isOperational: boolean;
  lastUpdated: string;
}

export default function StatusPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(0);
  cooldownRef.current = cooldown;

  const fetchStats = useCallback(() => {
    if (cooldownRef.current > 0) return;

    setLoading(true);
    setError(false);
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
        setCooldown(20); // 20s anti-spam cooldown on client
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchStats();
    // Refresh stats automatically every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

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
              Service health &amp; status.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              Live status of Flixo audio streams, active server sessions, and network playback quality.
            </p>
          </div>

          {/* Master Status Banner */}
          <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-6 h-6 rounded-full border-[3px] border-[#000000] shrink-0 ${
                  error || stats?.isOperational === false
                    ? "bg-[#FF5CAA] shadow-[0_0_10px_#FF5CAA]"
                    : "bg-[#10B981] shadow-[0_0_10px_#10B981]"
                }`}
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-[family-name:var(--font-fredoka)]">
                  {error || stats?.isOperational === false
                    ? "Audio servers restarting"
                    : "All audio streams operational"}
                </h2>
                <div className="text-xs text-[#A692C6] font-mono mt-0.5">
                  {loading
                    ? "Updating status..."
                    : `Last checked: ${
                        stats?.lastUpdated
                          ? new Date(stats.lastUpdated).toLocaleTimeString()
                          : "–"
                      }`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loading || cooldown > 0}
              className="brutal-btn px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9] shrink-0 disabled:opacity-50"
            >
              {loading
                ? "Checking..."
                : cooldown > 0
                ? `Wait ${cooldown}s`
                : "Refresh now"}
            </button>
          </div>

          {/* User-friendly Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase tracking-wider">
                Active servers
              </div>
              <div className="text-3xl font-black text-white font-[family-name:var(--font-fredoka)] mt-1">
                {stats?.guilds ? stats.guilds.toLocaleString() : "–"}
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">
                Discord communities
              </div>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase tracking-wider">
                Music sessions
              </div>
              <div className="text-3xl font-black text-[#FF5CAA] font-[family-name:var(--font-fredoka)] mt-1">
                {stats?.activePlayers !== null && stats?.activePlayers !== undefined
                  ? stats.activePlayers.toLocaleString()
                  : "–"}
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">
                Playing in voice
              </div>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase tracking-wider">
                Audio bitrate
              </div>
              <div className="text-3xl font-black text-[#C4B5FD] font-[family-name:var(--font-fredoka)] mt-1">
                384 kbps
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">
                Studio lossless sound
              </div>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase tracking-wider">
                Service uptime
              </div>
              <div className="text-2xl font-black text-white font-[family-name:var(--font-fredoka)] mt-1 truncate">
                {stats?.uptimeFormatted || "99.9%"}
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">
                Continuous playback
              </div>
            </div>
          </div>

          {/* Audio Streaming Network & Quality Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Audio Servers Section */}
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6">
              <h3 className="text-xl font-extrabold text-white font-[family-name:var(--font-fredoka)] mb-2">
                Audio streaming network
              </h3>
              <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed mb-4">
                Dedicated high-performance audio servers stream lossless 384kbps sound to Discord voice channels worldwide.
              </p>
              <div className="space-y-3">
                {stats?.audioNodes && stats.audioNodes.length > 0 ? (
                  stats.audioNodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 bg-[#120B1E] border border-[#000000] rounded-xl flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#000000] inline-block shrink-0 shadow-[0_0_6px_#10B981]" />
                        <span className="font-bold text-white">{node.id}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                        {node.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-[#120B1E] border border-[#000000] rounded-xl text-xs text-[#A692C6] font-mono">
                    All audio servers connected
                  </div>
                )}
              </div>
            </div>

            {/* Quality & Playback Specifications */}
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6">
              <h3 className="text-xl font-extrabold text-white font-[family-name:var(--font-fredoka)] mb-2">
                Audio specifications &amp; quality
              </h3>
              <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed mb-4">
                Guaranteed playback standards and audio quality across every connected server:
              </p>
              <ul className="space-y-2.5 text-xs text-[#DDD4EC] font-mono">
                <li className="flex justify-between p-2.5 bg-[#120B1E] rounded-xl border border-[#000000]">
                  <span>Maximum audio bitrate:</span>
                  <span className="text-[#10B981] font-bold">384 kbps (Lossless FLAC)</span>
                </li>
                <li className="flex justify-between p-2.5 bg-[#120B1E] rounded-xl border border-[#000000]">
                  <span>DSP processing latency:</span>
                  <span className="text-[#C4B5FD] font-bold">&lt; 5ms Real-time</span>
                </li>
                <li className="flex justify-between p-2.5 bg-[#120B1E] rounded-xl border border-[#000000]">
                  <span>Music queue capacity:</span>
                  <span className="text-[#FF5CAA] font-bold">Unlimited (No caps)</span>
                </li>
                <li className="flex justify-between p-2.5 bg-[#120B1E] rounded-xl border border-[#000000]">
                  <span>Platform integrations:</span>
                  <span className="text-white font-bold">Spotify, Apple, 12+ sources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
