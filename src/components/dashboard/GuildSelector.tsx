"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  LogIn,
  LogOut,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function GuildSelector() {
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo");

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [guilds, setGuilds] = useState<MutualGuild[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(demoParam === "true");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthAndGuilds() {
      // If user specifically requested demo mode via query string, initialize demo immediately
      if (demoParam === "true") {
        setUser(DEMO_USER);
        setGuilds(DEMO_GUILDS);
        setIsDemoMode(true);
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser && currentUser.id) {
          setUser(currentUser);
          setIsLoggedIn(true);
          setIsDemoMode(false);

          try {
            const serverGuilds = await api.getMutualGuilds();
            setGuilds(serverGuilds);
          } catch {
            setGuilds([]);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (err: unknown) {
        setIsLoggedIn(false);
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.includes("401") && !msg.includes("Unauthorized")) {
          setAuthError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthAndGuilds();
  }, [demoParam]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    }
    setUser(null);
    setGuilds([]);
    setIsLoggedIn(false);
    setIsDemoMode(false);
    window.location.href = "/";
  };

  const activateDemoMode = () => {
    setUser(DEMO_USER);
    setGuilds(DEMO_GUILDS);
    setIsDemoMode(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Disc className="w-12 h-12 text-[#FFB020] animate-spin" />
          <p className="text-sm font-mono text-[#DDD4EC]">Verifying Discord session & servers...</p>
        </div>
      </div>
    );
  }

  // Case 1: Unauthenticated visitor (not logged in, not in demo mode)
  if (!isLoggedIn && !isDemoMode) {
    return (
      <div className="min-h-screen bg-[#0E0919] text-white pt-24 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-6">
          {authError && (
            <div className="p-4 bg-[#3A1422] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_#000000] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF5CAA] shrink-0 mt-0.5" />
              <div className="text-xs font-mono">
                <p className="font-bold text-white uppercase">Backend Connection</p>
                <p className="text-[#DDD4EC] mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          <div className="bg-[#15111E] border-[3px] border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000] flex flex-col items-center text-center">
            {/* Mascot Avatar */}
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_#000000] bg-white shrink-0 relative mb-4">
              <Image
                src="/flixo-avatar.png"
                alt="Flixo Mascot"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="inline-block px-3 py-1 bg-[#221636] border-2 border-black rounded-lg text-xs font-mono font-bold text-[#FF5CAA] mb-3">
              DISCORD AUDIO STUDIO
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
              Sign In to Your Audio Console
            </h1>

            <p className="text-xs sm:text-sm text-[#DDD4EC] font-mono mt-3 max-w-md leading-relaxed">
              Connect your Discord account to view your mutual servers, see who is listening in voice channels, and control lossless 384kbps music playback.
            </p>

            <div className="w-full grid grid-cols-2 gap-2.5 my-6 text-left">
              <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FFB020] shrink-0" />
                <span className="text-[11px] font-mono text-[#DDD4EC]">Realtime Mixing Console</span>
              </div>
              <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
                <Disc className="w-4 h-4 text-[#7CE38B] shrink-0" />
                <span className="text-[11px] font-mono text-[#DDD4EC]">12 Search Providers</span>
              </div>
              <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF5CAA] shrink-0" />
                <span className="text-[11px] font-mono text-[#DDD4EC]">DJ / Manager Access</span>
              </div>
              <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span className="text-[11px] font-mono text-[#DDD4EC]">24/7 Voice Stay</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <a
                href={api.getDiscordOAuthUrl()}
                className="brutal-btn w-full py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_#000000]"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In with Discord</span>
              </a>

              <button
                type="button"
                onClick={activateDemoMode}
                className="brutal-btn w-full py-3 bg-[#20182C] hover:bg-[#2B213C] text-[#DDD4EC] hover:text-white rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 border-2 border-black"
              >
                <span>Or explore in Studio Demo Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Logged In or Demo Mode Active
  const activeUser = user || DEMO_USER;

  return (
    <div className="min-h-screen bg-[#0E0919] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Identity & Studio Faceplate Banner */}
        <div className="bg-[#15111F] border-[3px] border-black rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-black shadow-[3px_3px_0px_#000000] bg-black shrink-0 relative">
              {activeUser.avatar ? (
                <Image
                  src={activeUser.avatar}
                  alt={activeUser.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2B1B47] text-white font-bold">
                  {activeUser.username.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-fredoka)]">
                  {activeUser.username}
                </h1>
                {activeUser.isAdmin && (
                  <span className="px-2 py-0.5 bg-[#FFB020] text-black text-[10px] font-mono font-bold rounded-md border border-black uppercase">
                    Admin
                  </span>
                )}
                {activeUser.isPremium && (
                  <span className="px-2 py-0.5 bg-[#FF5CAA] text-white text-[10px] font-mono font-bold rounded-md border border-black flex items-center gap-1 uppercase">
                    <Crown className="w-2.5 h-2.5" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#8E849E] mt-0.5">
                {isDemoMode ? "Simulated Session" : "Session Active"} • Discord ID:{" "}
                <span className="text-[#DDD4EC]">{activeUser.id}</span>
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
                {isDemoMode ? "STUDIO DEMO MODE" : "DISCORD AUTH VERIFIED"}
              </span>
            </div>

            {isDemoMode && (
              <a
                href={api.getDiscordOAuthUrl()}
                className="brutal-btn px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In with Discord</span>
              </a>
            )}

            {isLoggedIn && activeUser.isAdmin && (
              <Link
                href="/admin"
                className="brutal-btn px-4 py-2 bg-[#2D1B44] text-white rounded-xl text-xs font-mono font-bold hover:bg-[#3D255C]"
              >
                ADMIN CONSOLE
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="brutal-btn px-4 py-2 bg-[#2A1D3D] text-[#DDD4EC] hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
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
        {guilds.length === 0 ? (
          <div className="bg-[#14101A] border-[3px] border-black rounded-3xl p-10 text-center flex flex-col items-center gap-3">
            <Disc className="w-12 h-12 text-[#FFB020]" />
            <h3 className="text-base font-bold text-white font-[family-name:var(--font-fredoka)]">
              No Manageable Servers Found
            </h3>
            <p className="text-xs font-mono text-[#8E849E] max-w-md">
              We couldn&apos;t find any servers where you have Manage Server permission or Flixo is present. Invite Flixo to your server to start playing music!
            </p>
            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn mt-3 px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Flixo to Your Discord</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guilds.map((guild) => {
              const hasBot = guild.hasBot ?? guild.isBotIn ?? false;
              return (
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
                          Bot Presence:
                        </span>
                        <span
                          className={`font-bold ${
                            hasBot ? "text-[#7CE38B]" : "text-[#8E849E]"
                          }`}
                        >
                          {hasBot ? "In Server" : "Not Joined"}
                        </span>
                      </div>

                      {guild.memberCount !== undefined && guild.memberCount !== null && (
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#8E849E] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#FFB020]" />
                            Members:
                          </span>
                          <span className="text-[#DDD4EC] font-bold tabular-nums">
                            {guild.memberCount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {guild.currentTrack && (
                        <div className="pt-1.5 border-t border-[#231A33] flex items-center gap-1.5 text-xs font-mono text-[#DDD4EC] truncate">
                          <Music className="w-3 h-3 text-[#FF5CAA] shrink-0" />
                          <span className="truncate">{guild.currentTrack}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {hasBot ? (
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
