"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { GuildOverview, GuildSettings } from "@/types/dashboard";
import { api, getDemoGuildOverview } from "@/lib/dashboard-api";
import { useRealtimePlayer } from "@/hooks/useRealtimePlayer";
import AudioMeterVU from "@/components/dashboard/AudioMeterVU";
import QueueList from "@/components/dashboard/QueueList";
import FilterMatrix from "@/components/dashboard/FilterMatrix";
import VoiceController from "@/components/dashboard/VoiceController";
import NowPlayingBar from "@/components/dashboard/NowPlayingBar";
import SearchModal from "@/components/dashboard/SearchModal";
import SettingsModal from "@/components/dashboard/SettingsModal";
import {
  ArrowLeft,
  Settings,
  Search,
  Radio,
  Wifi,
  WifiOff,
  Disc,
} from "lucide-react";

// Lazily load the 3D Vinyl hero so other pages don't pay for three.js bundle (api.md §9)
const VinylRecord3D = dynamic(
  () => import("@/components/dashboard/VinylRecord3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-w-[400px] mx-auto rounded-3xl bg-[#141219] border-[3px] border-black flex flex-col items-center justify-center p-6 gap-3">
        <Disc className="w-16 h-16 text-[#FFB020] animate-spin" />
        <span className="text-xs font-mono text-[#DDD4EC]">Spinning up 3D deck...</span>
      </div>
    ),
  }
);

interface LivePlayerClientProps {
  guildId: string;
}

export default function LivePlayerClient({ guildId }: LivePlayerClientProps) {
  const [overview, setOverview] = useState<GuildOverview | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial overview
  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getGuildOverview(guildId);
        setOverview(data);
        setIsDemo(false);
      } catch {
        // Fallback to high-fidelity demo overview
        const demoData = getDemoGuildOverview(guildId);
        setOverview(demoData);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [guildId]);

  // Hook into realtime player stream & 5s tick interpolation
  const {
    snapshot,
    currentPosition,
    isConnected,
    sendControl,
    applyFilter,
    enqueueTrack,
    removeQueueTrack,
    moveQueueTrack,
  } = useRealtimePlayer({
    guildId,
    initialSnapshot: overview?.player || null,
    isDemo,
  });

  const activePlayer = snapshot || overview?.player || null;
  const currentTrack = activePlayer?.current || null;
  const upcomingQueue = activePlayer?.upcoming || [];
  const isPlaying = activePlayer?.playing || false;
  const isPaused = activePlayer?.paused || false;
  const volume = activePlayer?.volume ?? 100;
  const repeatMode = activePlayer?.repeatMode || "off";
  const previousAvailable = activePlayer?.previousAvailable || 0;
  const filtersState = activePlayer?.filters || {
    active: [],
    equalizer: false,
    speed: 1.0,
    pitch: null,
    rate: null,
  };

  const handleSaveSettings = (newSettings: GuildSettings) => {
    if (overview) {
      setOverview({
        ...overview,
        settings: newSettings,
        stay247: !!newSettings.stay247,
      });
    }
  };

  const handleToggle247 = (enabled: boolean) => {
    if (overview) {
      setOverview({
        ...overview,
        stay247: enabled,
        settings: { ...overview.settings, stay247: enabled },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Disc className="w-12 h-12 text-[#FFB020] animate-spin" />
          <p className="text-sm font-mono text-[#DDD4EC]">Initializing Mixing Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0919] text-white flex flex-col justify-between">
      {/* Console Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#120F1A]/95 backdrop-blur-md border-b-[3px] border-black px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back & Guild Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="p-2 bg-[#20182C] hover:bg-[#2F2440] text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] shrink-0"
              title="Return to server list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-black bg-black shrink-0 relative shadow-[2px_2px_0px_#000000]">
              {overview?.icon ? (
                <Image
                  src={overview.icon}
                  alt={overview.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#281A42] text-xs font-mono font-bold">
                  {overview?.name?.slice(0, 2).toUpperCase() || "FX"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white truncate font-[family-name:var(--font-fredoka)]">
                  {overview?.name || "Audio Station"}
                </h1>
                <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 bg-[#281B3D] text-[#FF5CAA] rounded border border-[#482A6B]">
                  {overview?.accessRole || "DJ"}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#8E849E] flex items-center gap-1.5 truncate">
                <Radio className="w-3 h-3 text-[#7CE38B]" />
                <span>VC: #{activePlayer?.voiceChannelName || "Standby"}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live stream status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#100D15] rounded-xl border border-black text-[11px] font-mono">
              {isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#7CE38B]" />
                  <span className="text-[#7CE38B] font-bold">REALTIME SYNC</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#FFB020]" />
                  <span className="text-[#FFB020] font-bold">STUDIO OFFLINE</span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="brutal-btn px-3 py-1.5 bg-[#FFB020] text-black rounded-xl text-xs font-mono font-bold hover:bg-[#F59E0B] flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEARCH 12 SOURCES</span>
              <span className="sm:hidden">SEARCH</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-[#20182C] hover:bg-[#2E2340] text-[#DDD4EC] rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]"
              title="Station settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Console Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3D Turntable, VU Meters, Voice Controller */}
          <div className="lg:col-span-5 space-y-5">
            {/* 3D Vinyl Turntable (Honest comment from api.md §9) */}
            <VinylRecord3D
              isPlaying={isPlaying}
              isPaused={isPaused}
              artworkUrl={currentTrack?.thumbnail}
              trackTitle={currentTrack?.title}
              artistName={currentTrack?.author}
            />

            {/* Hardware Peak / Stereo VU Meter */}
            <AudioMeterVU
              isPlaying={isPlaying}
              isPaused={isPaused}
              volume={volume}
            />

            {/* Voice Channel and 24/7 Controller */}
            <VoiceController
              voiceChannels={overview?.voiceChannels || []}
              activeChannelName={activePlayer?.voiceChannelName}
              listeners={activePlayer?.listeners || 0}
              stay247={overview?.stay247 || false}
              onToggle247={handleToggle247}
              onDisconnect={() => sendControl({ action: "disconnect" })}
              accessRole={overview?.accessRole || "dj"}
            />
          </div>

          {/* Right Column: Queue Monitor & DSP Filter Matrix */}
          <div className="lg:col-span-7 space-y-5 flex flex-col">
            {/* Live Queue Monitor */}
            <QueueList
              tracks={upcomingQueue}
              onRemove={removeQueueTrack}
              onMove={moveQueueTrack}
              onClear={() => sendControl({ action: "clear" })}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* DSP Filter Matrix Rack */}
            <FilterMatrix
              filters={filtersState}
              onApplyFilter={applyFilter}
            />
          </div>
        </div>
      </main>

      {/* Sticky Bottom Now Playing Control Bar */}
      <NowPlayingBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isPaused={isPaused}
        position={currentPosition}
        volume={volume}
        repeatMode={repeatMode}
        previousAvailable={previousAvailable}
        onControl={sendControl}
      />

      {/* 12-Source Audio Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        guildId={guildId}
        isDemo={isDemo}
        onEnqueue={(track, playNext) => enqueueTrack(track, playNext)}
      />

      {/* Guild Settings Modal */}
      {overview && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={overview.settings}
          onSave={handleSaveSettings}
          accessRole={overview.accessRole}
        />
      )}
    </div>
  );
}
