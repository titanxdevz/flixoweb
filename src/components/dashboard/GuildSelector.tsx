"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardUser, MutualGuild } from "@/types/dashboard";
import { api, DEMO_USER, DEMO_GUILDS } from "@/lib/dashboard-api";
import { siteConfig } from "@/config/site";
import {
  Sliders,
  Crown,
  Radio,
  ExternalLink,
  Users,
  Music,
  Plus,
  Headphones,
  Disc,
} from "lucide-react";

export default function GuildSelector() {
  const [user, setUser] = useState<DashboardUser>(DEMO_USER);
  const [guilds, setGuilds] = useState<MutualGuild[]>(DEMO_GUILDS);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAuthAndGuilds() {
      try {
        const currentUser = await api.getCurrentUser();
        const serverGuilds = await api.getMutualGuilds();
        setUser(currentUser);
        setGuilds(serverGuilds);
        setIsDemoMode(false);
      } catch {
        // Fallback to high-fidelity demo data so user can immediately test
        setUser(DEMO_USER);
        setGuilds(DEMO_GUILDS);
        setIsDemoMode(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthAndGuilds();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Disc className="w-12 h-12 text-[#FFB020] animate-spin" />
          <p className="text-sm font-mono text-[#DDD4EC]">Fetching mutual audio servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0919] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Identity & Studio Faceplate Banner */}
        <div className="bg-[#15111F] border-[3px] border-black rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-black shadow-[3px_3px_0px_#000000] bg-black shrink-0 relative">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2B1B47] text-white font-bold">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)]">
                  {user.username}
                </h1>
                {user.isAdmin && (
                  <span className="px-2 py-0.5 bg-[#FFB020] text-black text-[10px] font-mono font-bold rounded-md border border-black uppercase">
                    Admin
                  </span>
                )}
                {user.isPremium && (
                  <span className="px-2 py-0.5 bg-[#FF5CAA] text-white text-[10px] font-mono font-bold rounded-md border border-black flex items-center gap-1 uppercase">
                    <Crown className="w-2.5 h-2.5" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#8E849E] mt-0.5">
                Session Active • Discord ID: <span className="text-[#DDD4EC]">{user.id}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Demo / Live Status Pill */}
            <div className="px-3 py-1.5 rounded-xl border-2 border-black bg-[#100D15] flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemoMode ? "bg-[#FFB020]" : "bg-[#7CE38B] animate-pulse"
                }`}
              />
              <span className="text-xs font-mono font-bold text-[#DDD4EC]">
                {isDemoMode ? "STUDIO DEMO MODE" : "LIVE BOT LINKED"}
              </span>
            </div>

            {user.isAdmin && (
              <Link
                href="/admin"
                className="brutal-btn px-4 py-2 bg-[#2D1B44] text-white rounded-xl text-xs font-mono font-bold hover:bg-[#3D255C]"
              >
                ADMIN CONSOLE
              </Link>
            )}

            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Flixo to Server</span>
            </a>
          </div>
        </div>

        {/* Servers section header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#261E33]">
          <div>
            <h2 className="text-sm font-mono font-bold tracking-widest text-[#A89CB8] uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FFB020]" />
              SELECT AUDIO SERVER // ACTIVE DISCORD GUILDS
            </h2>
            <p className="text-xs text-[#8E849E] font-mono mt-0.5">
              Choose a server where you have DJ, Manager, or Listener permissions to control audio.
            </p>
          </div>
          <span className="text-xs font-mono text-[#DDD4EC] font-bold tabular-nums">
            {guilds.length} Servers Available
          </span>
        </div>

        {/* Server Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="bg-[#15111E] border-[3px] border-black rounded-3xl p-5 shadow-[6px_6px_0px_#000000] flex flex-col justify-between hover:translate-y-[-2px] transition-transform"
            >
              <div>
                {/* Guild Header */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-black bg-black shrink-0 relative shadow-[2px_2px_0px_#000000]">
                    {guild.icon ? (
                      <Image
                        src={guild.icon}
                        alt={guild.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2B1B47] text-white font-bold text-lg font-mono">
                        {guild.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white truncate font-[family-name:var(--font-fredoka)]">
                      {guild.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {guild.owner ? (
                        <span className="text-[10px] font-mono font-bold text-[#FFB020] uppercase bg-[#261B0E] px-1.5 py-0.2 rounded border border-[#4D3319]">
                          Owner
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8E849E] uppercase">
                          Manager
                        </span>
                      )}
                      <span className="text-[#4E4161]">•</span>
                      <span className="text-[10px] font-mono text-[#8E849E]">
                        ID: {guild.id.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Channel & Playback Status */}
                <div className="bg-[#0E0C12] p-3 rounded-2xl border-2 border-black mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8E849E] flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-[#7CE38B]" />
                      Voice Channel:
                    </span>
                    <span className="text-white font-bold truncate max-w-[140px]">
                      {guild.activeVoiceChannel ? `#${guild.activeVoiceChannel}` : "Disconnected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8E849E] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FFB020]" />
                      Listeners:
                    </span>
                    <span className="text-[#7CE38B] font-bold tabular-nums">
                      {guild.listeners || 0} active
                    </span>
                  </div>

                  {guild.currentTrack && (
                    <div className="pt-1.5 border-t border-[#231A33] flex items-center gap-1.5 text-xs font-mono text-[#DDD4EC] truncate">
                      <Music className="w-3 h-3 text-[#FF5CAA] shrink-0" />
                      <span className="truncate">{guild.currentTrack}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {guild.isBotIn ? (
                <Link
                  href={`/dashboard/${guild.id}`}
                  className="brutal-btn w-full py-2.5 bg-[#FFB020] hover:bg-[#F59E0B] text-black rounded-xl text-xs font-mono font-bold text-center flex items-center justify-center gap-2"
                >
                  <Headphones className="w-4 h-4" />
                  <span>OPEN WEB PLAYER</span>
                </Link>
              ) : (
                <a
                  href={`${siteConfig.discordInviteUrl}&guild_id=${guild.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn w-full py-2.5 bg-[#2A1D3D] text-[#DDD4EC] hover:text-white rounded-xl text-xs font-mono font-bold text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>INVITE BOT FIRST</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
