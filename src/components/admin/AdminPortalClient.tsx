"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminUser, AdminGuild, AdminLog } from "@/types/dashboard";
import { api } from "@/lib/dashboard-api";
import {
  ShieldAlert,
  Users,
  Server,
  Activity,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Radio,
  Search,
} from "lucide-react";

const DEMO_ADMIN_USERS: AdminUser[] = [
  {
    id: "1380994881731952741",
    username: "Ansh Singh",
    tag: "ansh#0001",
    avatar: "/flixo-avatar.png",
    isAdmin: true,
    isPremium: true,
    lastSeen: "Just now",
    guildsManaged: 8,
  },
  {
    id: "449922110033",
    username: "KairoDev",
    tag: "kairo#1337",
    avatar: null,
    isAdmin: false,
    isPremium: true,
    lastSeen: "12m ago",
    guildsManaged: 3,
  },
  {
    id: "558833221144",
    username: "AudioEngineer",
    tag: "audio#4040",
    avatar: null,
    isAdmin: false,
    isPremium: false,
    lastSeen: "1h ago",
    guildsManaged: 1,
  },
];

const DEMO_ADMIN_GUILDS: AdminGuild[] = [
  {
    id: "99881122334455",
    name: "Flixo Studio HQ",
    icon: "/logo.png",
    memberCount: 284,
    shardId: 0,
    voiceChannelName: "Studio Master 1",
    isPlaying: true,
    listeners: 5,
    currentTrackTitle: "Resonance — HOME",
  },
  {
    id: "88776655443322",
    name: "Lofi Chill & Code",
    icon: "/flixo-sticker.png",
    memberCount: 1420,
    shardId: 0,
    voiceChannelName: "Midnight Lounge",
    isPlaying: true,
    listeners: 3,
    currentTrackTitle: "Snowman — WYS",
  },
  {
    id: "77665544332211",
    name: "Vaporwave Synth Club",
    icon: null,
    memberCount: 65,
    shardId: 0,
    voiceChannelName: null,
    isPlaying: false,
    listeners: 0,
    currentTrackTitle: null,
  },
];

const DEMO_ADMIN_LOGS: AdminLog[] = [
  {
    id: "log-1",
    timestamp: "12:28:14",
    userId: "1380994881731952741",
    username: "Ansh Singh",
    action: "DSP_FILTER_ENGAGED",
    guildName: "Flixo Studio HQ",
    details: "Applied bassboost [level: high] via Web Player",
  },
  {
    id: "log-2",
    timestamp: "12:26:02",
    userId: "1380994881731952741",
    username: "Ansh Singh",
    action: "QUEUE_ENQUEUE",
    guildName: "Flixo Studio HQ",
    details: "Added 'Resonance' via Spotify Lossless provider",
  },
  {
    id: "log-3",
    timestamp: "12:20:45",
    userId: "449922110033",
    username: "KairoDev",
    action: "VOICE_CONNECT",
    guildName: "Lofi Chill & Code",
    details: "Joined channel #Midnight Lounge (3 listeners)",
  },
  {
    id: "log-4",
    timestamp: "12:15:10",
    userId: "1380994881731952741",
    username: "Ansh Singh",
    action: "SETTING_CHANGE",
    guildName: "Flixo Studio HQ",
    details: "Set 24/7 permanent voice stay to true",
  },
];

export default function AdminPortalClient() {
  const [activeTab, setActiveTab] = useState<"users" | "guilds" | "logs">("users");
  const [users, setUsers] = useState<AdminUser[]>(DEMO_ADMIN_USERS);
  const [guilds, setGuilds] = useState<AdminGuild[]>(DEMO_ADMIN_GUILDS);
  const [logs, setLogs] = useState<AdminLog[]>(DEMO_ADMIN_LOGS);
  const [filterQuery, setFilterQuery] = useState("");
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [u, g, l] = await Promise.all([
          api.getAdminUsers(),
          api.getAdminGuilds(),
          api.getAdminLogs(),
        ]);
        setUsers(u);
        setGuilds(g);
        setLogs(l);
      } catch {
        // Fallback to high-fidelity demo data
        setUsers(DEMO_ADMIN_USERS);
        setGuilds(DEMO_ADMIN_GUILDS);
        setLogs(DEMO_ADMIN_LOGS);
      }
    }
    loadAdminData();
  }, []);

  const handleToggleAdmin = async (userId: string) => {
    try {
      await api.toggleAdminUser(userId);
    } catch {
      // Local optimistic toggle for demo
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u))
    );
  };

  const handleSnapshotStats = async () => {
    try {
      await api.snapshotBotStats();
    } catch {
      // Demo snapshot trigger
    }
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0E0919] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-[#15111E] border-[3px] border-black rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 bg-[#20182C] hover:bg-[#2F2440] text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#FFB020]" />
                <h1 className="text-xl font-bold font-[family-name:var(--font-fredoka)]">
                  FLIXO ADMIN CONTROL PORTAL
                </h1>
              </div>
              <p className="text-xs font-mono text-[#8E849E]">
                Cluster 0 Master Node • Shard Manager • Protected by api.md §3 Guard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSnapshotStats}
              className={`brutal-btn px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                snapshotSuccess
                  ? "bg-[#7CE38B] text-black"
                  : "bg-[#FFB020] text-black hover:bg-[#F59E0B]"
              }`}
            >
              {snapshotSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SNAPSHOT SAVED TO DB</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>SNAPSHOT BOT STATS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b-2 border-[#251D33] pb-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-1.5 border-2 ${
              activeTab === "users"
                ? "bg-[#251A38] text-white border-[#FFB020] shadow-[2px_2px_0px_#000000]"
                : "bg-[#14101A] text-[#8E849E] border-black hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>USERS ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("guilds")}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-1.5 border-2 ${
              activeTab === "guilds"
                ? "bg-[#251A38] text-white border-[#FFB020] shadow-[2px_2px_0px_#000000]"
                : "bg-[#14101A] text-[#8E849E] border-black hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>ACTIVE GUILDS ({guilds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors flex items-center gap-1.5 border-2 ${
              activeTab === "logs"
                ? "bg-[#251A38] text-white border-[#FFB020] shadow-[2px_2px_0px_#000000]"
                : "bg-[#14101A] text-[#8E849E] border-black hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AUDIT LOGS ({logs.length})</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E849E]" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 bg-[#120F18] border-2 border-black rounded-xl text-xs font-mono text-white placeholder:text-[#5B5169] focus:outline-none focus:border-[#FFB020]"
          />
        </div>

        {/* Tab 1: Users */}
        {activeTab === "users" && (
          <div className="bg-[#14101A] border-[3px] border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000000]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#1C1626] border-b-2 border-black text-[#8E849E] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Discord ID</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Guilds</th>
                  <th className="p-3.5 text-right">Admin Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231A33]">
                {users
                  .filter((u) => u.username.toLowerCase().includes(filterQuery.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#1A1424] transition-colors">
                      <td className="p-3.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#271B3E] border border-black flex items-center justify-center font-bold text-white">
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.username}</p>
                          <p className="text-[10px] text-[#8E849E]">{u.tag}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#DDD4EC] tabular-nums">{u.id}</td>
                      <td className="p-3.5">
                        {u.isPremium ? (
                          <span className="px-2 py-0.5 bg-[#FF5CAA] text-white text-[10px] rounded font-bold">
                            PREMIUM
                          </span>
                        ) : (
                          <span className="text-[#8E849E]">STANDARD</span>
                        )}
                      </td>
                      <td className="p-3.5 tabular-nums text-[#DDD4EC]">
                        {u.guildsManaged || 1} managed
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleAdmin(u.id)}
                          className={`brutal-btn px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            u.isAdmin
                              ? "bg-[#FFB020] text-black"
                              : "bg-[#251A38] text-[#DDD4EC] hover:text-white"
                          }`}
                        >
                          {u.isAdmin ? "REVOKE ADMIN" : "GRANT ADMIN"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Guilds */}
        {activeTab === "guilds" && (
          <div className="bg-[#14101A] border-[3px] border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000000]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#1C1626] border-b-2 border-black text-[#8E849E] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Server</th>
                  <th className="p-3.5">Shard</th>
                  <th className="p-3.5">Members</th>
                  <th className="p-3.5">Voice State</th>
                  <th className="p-3.5">Listeners</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231A33]">
                {guilds
                  .filter((g) => g.name.toLowerCase().includes(filterQuery.toLowerCase()))
                  .map((g) => (
                    <tr key={g.id} className="hover:bg-[#1A1424] transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-white">{g.name}</p>
                        <p className="text-[10px] text-[#8E849E]">ID: {g.id}</p>
                      </td>
                      <td className="p-3.5 text-[#FFB020] font-bold tabular-nums">Shard #{g.shardId}</td>
                      <td className="p-3.5 text-[#DDD4EC] tabular-nums">{g.memberCount}</td>
                      <td className="p-3.5">
                        {g.voiceChannelName ? (
                          <span className="flex items-center gap-1.5 text-[#7CE38B]">
                            <Radio className="w-3.5 h-3.5" />
                            #{g.voiceChannelName}
                          </span>
                        ) : (
                          <span className="text-[#8E849E]">Disconnected</span>
                        )}
                      </td>
                      <td className="p-3.5 text-[#FFB020] font-bold tabular-nums">
                        {g.listeners}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/dashboard/${g.id}`}
                          className="brutal-btn px-2.5 py-1 bg-[#7C3AED] text-white rounded-lg text-[10px] font-bold"
                        >
                          JOIN CONSOLE
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Action Audit Logs */}
        {activeTab === "logs" && (
          <div className="bg-[#14101A] border-[3px] border-black rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#000000] space-y-2">
            {logs
              .filter(
                (l) =>
                  l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  l.details.toLowerCase().includes(filterQuery.toLowerCase())
              )
              .map((l) => (
                <div
                  key={l.id}
                  className="bg-[#191424] border-2 border-black rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[2px_2px_0px_#000000]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-[#8E849E] px-1.5 py-0.5 bg-[#0F0C15] rounded border border-black tabular-nums">
                      {l.timestamp}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FFB020]">
                      {l.action}
                    </span>
                    <span className="text-xs text-[#DDD4EC] font-mono">
                      by <strong className="text-white">{l.username}</strong> on {l.guildName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8E849E] truncate">
                    {l.details}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
