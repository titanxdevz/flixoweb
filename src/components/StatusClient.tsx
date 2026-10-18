"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface LavalinkNodeInfo {
  id: string;
  connected: boolean;
  players?: number;
  playingPlayers?: number;
  ping?: number;
}

interface SystemStats {
  guilds: number | null;
  listeners: number | null;
  activePlayers: number | null;
  clusters: number | null;
  uptimeSeconds: number | null;
  uptimeFormatted?: string | null;
  ping?: number | null;
  totalSongsPlayed?: number | null;
  lavalinkNodes: LavalinkNodeInfo[];
  isOperational: boolean;
  lastUpdated: string;
}

export default function StatusPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = () => {
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
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (sec: number | null) => {
    if (!sec) return "–";
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

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
              System health &amp; status.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              Real-time monitoring of bot clusters, active audio sessions, Lavalink nodes, and latency.
            </p>
          </div>

          {/* Master Health Banner */}
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
                    ? "Connection degraded / starting up"
                    : "All audio clusters operational"}
                </h2>
                <div className="text-xs text-[#A692C6] font-mono mt-0.5">
                  {loading
                    ? "Refreshing status..."
                    : `Last checked: ${stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : "–"}`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="brutal-btn px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9] shrink-0 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Refresh now"}
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase">Connected servers</div>
              <div className="text-3xl font-black text-white font-[family-name:var(--font-fredoka)] mt-1">
                {stats?.guilds ? stats.guilds.toLocaleString() : "–"}
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">Fan-out broadcasted</div>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase">Active players</div>
              <div className="text-3xl font-black text-[#FF5CAA] font-[family-name:var(--font-fredoka)] mt-1">
                {stats?.activePlayers !== null && stats?.activePlayers !== undefined
                  ? stats.activePlayers.toLocaleString()
                  : "–"}
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">Streaming in voice</div>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase">Cluster layout</div>
              <div className="text-3xl font-black text-[#C4B5FD] font-[family-name:var(--font-fredoka)] mt-1">
                {stats?.clusters ?? 8} Clusters
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">Express on Cluster 0</div>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5">
              <div className="text-[11px] font-bold text-[#A692C6] uppercase">System uptime</div>
              <div className="text-2xl font-black text-white font-[family-name:var(--font-fredoka)] mt-1 truncate">
                {stats?.uptimeFormatted || formatUptime(stats?.uptimeSeconds ?? null)}
              </div>
              <div className="text-[11px] text-[#A692C6] mt-1 font-mono">Process running</div>
            </div>
          </div>

          {/* Lavalink Nodes & Shard Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Audio Node Section */}
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6">
              <h3 className="text-xl font-extrabold text-white font-[family-name:var(--font-fredoka)] mb-4">
                Lavalink audio nodes
              </h3>
              <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed mb-4">
                Lavalink v4 audio nodes decode 384kbps lossless streams and compute DSP filters without client latency.
              </p>
              <div className="space-y-3">
                {stats?.lavalinkNodes && stats.lavalinkNodes.length > 0 ? (
                  stats.lavalinkNodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 bg-[#120B1E] border border-[#000000] rounded-xl flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#000000] inline-block shrink-0" />
                        <span className="font-bold text-white">{node.id}</span>
                        {node.players !== undefined && (
                          <span className="text-[#A692C6] text-[11px]">({node.players} players)</span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                        Connected
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-[#120B1E] border border-[#000000] rounded-xl text-xs text-[#A692C6] font-mono">
                    Node cluster status cached server-side (30s)
                  </div>
                )}
              </div>
            </div>

            {/* Architecture Details from api.md */}
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6">
              <h3 className="text-xl font-extrabold text-white font-[family-name:var(--font-fredoka)] mb-4">
                Transport &amp; rate limits
              </h3>
              <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed mb-4">
                Traffic limits enforced per IP and per socket connection:
              </p>
              <ul className="space-y-2.5 text-xs text-[#DDD4EC] font-mono">
                <li className="flex justify-between p-2 bg-[#120B1E] rounded-lg border border-[#000000]">
                  <span>Global IP limit:</span>
                  <span className="text-[#C4B5FD] font-bold">120 req / minute</span>
                </li>
                <li className="flex justify-between p-2 bg-[#120B1E] rounded-lg border border-[#000000]">
                  <span>Player mutations:</span>
                  <span className="text-[#C4B5FD] font-bold">45 req / 10s</span>
                </li>
                <li className="flex justify-between p-2 bg-[#120B1E] rounded-lg border border-[#000000]">
                  <span>Search queries:</span>
                  <span className="text-[#C4B5FD] font-bold">30 req / 10s</span>
                </li>
                <li className="flex justify-between p-2 bg-[#120B1E] rounded-lg border border-[#000000]">
                  <span>WebSocket ticks:</span>
                  <span className="text-[#10B981] font-bold">Every 5.0 seconds</span>
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
