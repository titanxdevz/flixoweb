import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permission Roles Guide — Flixo Discord Music Bot",
  description:
    "Learn how Flixo enforces access roles: admin, manager, dj, and listener permissions for Discord servers.",
};

const roles = [
  {
    role: "admin",
    who: "Bot owner / Global Administrator",
    rights: "Full control over every server and system process.",
    permissions: "Bypass any guild lock, access system diagnostics, toggle maintenance modes.",
    badge: "bg-[#FF5CAA] text-white",
  },
  {
    role: "manager",
    who: "Discord Guild Owner or Manage Server permission",
    rights: "Full configuration control within their specific Discord server.",
    permissions: "Set custom prefixes, configure DJ roles, toggle /247 channel mode, ignore text channels, adjust default search platforms.",
    badge: "bg-[#7C3AED] text-white",
  },
  {
    role: "dj",
    who: "Users with the server's configured DJ role",
    rights: "Queue control and audio adjustments.",
    permissions: "Adjust volume (/volume), clear upcoming queue (/clear), reorder or remove tracks (/move, /remove), stop playback (/stop), toggle autoplay.",
    badge: "bg-[#2A1B44] text-[#C4B5FD]",
  },
  {
    role: "listener",
    who: "Anyone in the same voice channel as Flixo",
    rights: "Standard listening and music submission.",
    permissions: "Queue tracks (/play), pause and resume, skip or vote-skip, toggle repeat loops, view lyrics, apply 14 DSP audio filters.",
    badge: "bg-[#181026] text-[#DDD4EC]",
  },
];

export default function RolesPage() {
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
              Permission roles &amp; security.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              Flixo resolves user permissions server-side on every command and control request. Access cannot be spoofed or bypassed by clients.
            </p>
          </div>

          {/* Roles Table */}
          <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-6 sm:p-8 mb-12">
            <h2 className="text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)] mb-6">
              Resolved access roles
            </h2>

            <div className="space-y-6">
              {roles.map((r) => (
                <div
                  key={r.role}
                  className="p-5 bg-[#120B1E] border-[2px] border-[#000000] rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="md:w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border border-[#000000] ${r.badge}`}>
                        {r.role}
                      </span>
                    </div>
                    <div className="text-xs text-[#A692C6] font-mono mt-1">
                      {r.who}
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <div className="text-sm font-bold text-white mb-1">
                      {r.rights}
                    </div>
                    <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed">
                      {r.permissions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ / Policy details on DJ & Voice Isolation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6">
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-2">
                Voice channel isolation
              </h3>
              <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed">
                To prevent trolling, listeners can only control playback if they are physically connected to the exact voice channel Flixo is actively streaming in. If a user is not in the voice channel, mutations return a permission rejection.
              </p>
            </div>

            <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6">
              <h3 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-white mb-2">
                30-second role caching
              </h3>
              <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed">
                Access roles are cached for 30 seconds per user and guild to minimize Discord gateway traffic. Changes made to roles or channel permissions take effect immediately upon subsequent cache expiry or guild settings update.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
