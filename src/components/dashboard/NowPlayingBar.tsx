"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TrackSnapshot, RepeatMode, ControlRequest } from "@/types/dashboard";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Square,
  Music,
} from "lucide-react";

interface NowPlayingBarProps {
  currentTrack: TrackSnapshot | null;
  isPlaying: boolean;
  isPaused: boolean;
  position: number; // in ms
  volume: number; // 0..200
  repeatMode: RepeatMode;
  previousAvailable: number;
  onControl: (req: ControlRequest) => void;
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function NowPlayingBar({
  currentTrack,
  isPlaying,
  isPaused,
  position,
  volume,
  repeatMode,
  previousAvailable,
  onControl,
}: NowPlayingBarProps) {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [prevVolume, setPrevVolume] = useState(100);

  const duration = currentTrack?.duration || 1;
  const activePosition = isScrubbing ? scrubPosition : position;
  const progressPercent = Math.min(100, Math.max(0, (activePosition / duration) * 100));

  const handleSeekCommit = (pct: number) => {
    const targetMs = Math.round((pct / 100) * duration);
    onControl({ action: "seek", value: targetMs });
    setIsScrubbing(false);
  };

  const handleVolumeToggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      onControl({ action: "volume", value: 0 });
    } else {
      onControl({ action: "volume", value: prevVolume || 100 });
    }
  };

  const cycleRepeat = () => {
    const nextMode: RepeatMode =
      repeatMode === "off" ? "track" : repeatMode === "track" ? "queue" : "off";
    onControl({ action: "loop", value: nextMode });
  };

  return (
    <div className="sticky bottom-0 z-40 bg-[#0E0B14]/95 backdrop-blur-md border-t-[3px] border-[#000000] p-3 sm:p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3 w-full md:w-1/4 shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-black bg-black shrink-0 relative shadow-[2px_2px_0px_#000000]">
            {currentTrack?.thumbnail ? (
              <Image
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#655A75]">
                <Music className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-white truncate font-[family-name:var(--font-fredoka)]">
              {currentTrack?.title || "No track active"}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#8E849E] truncate">
              <span className="truncate">{currentTrack?.author || "Station standby"}</span>
              {currentTrack?.source && (
                <>
                  <span>•</span>
                  <span className="text-[#FFB020] uppercase font-bold text-[9px] tracking-wider px-1 bg-[#261B0E] rounded border border-[#4D3319]">
                    {currentTrack.source}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Playback & Scrub Bar */}
        <div className="flex-1 w-full max-w-2xl flex flex-col items-center gap-1.5">
          {/* Main Transport Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Shuffle */}
            <button
              onClick={() => onControl({ action: "shuffle" })}
              title="Shuffle queue"
              className="p-1.5 text-[#8E849E] hover:text-white transition-colors"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              disabled={previousAvailable <= 0}
              onClick={() => onControl({ action: "previous" })}
              title="Previous track"
              className="p-2 bg-[#1A1424] hover:bg-[#261E33] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl border border-black shadow-[2px_2px_0px_#000000]"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => {
                if (isPlaying && !isPaused) {
                  onControl({ action: "pause" });
                } else {
                  onControl({ action: "resume" });
                }
              }}
              title={isPlaying && !isPaused ? "Pause" : "Play"}
              className="brutal-btn p-3 bg-[#FFB020] text-black rounded-2xl hover:bg-[#F59E0B]"
            >
              {isPlaying && !isPaused ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip */}
            <button
              onClick={() => onControl({ action: "skip" })}
              title="Skip to next track"
              className="p-2 bg-[#1A1424] hover:bg-[#261E33] text-white rounded-xl border border-black shadow-[2px_2px_0px_#000000]"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Stop */}
            <button
              onClick={() => onControl({ action: "stop" })}
              title="Stop playback"
              className="p-1.5 text-[#8E849E] hover:text-[#FF5CAA] transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>

            {/* Repeat Mode */}
            <button
              onClick={cycleRepeat}
              title={`Loop: ${repeatMode}`}
              className={`p-1.5 relative transition-colors ${
                repeatMode !== "off" ? "text-[#FFB020]" : "text-[#8E849E] hover:text-white"
              }`}
            >
              {repeatMode === "track" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              {repeatMode !== "off" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFB020]" />
              )}
            </button>
          </div>

          {/* Time scrubber */}
          <div className="w-full flex items-center gap-2.5 text-xs font-mono font-medium text-[#8E849E]">
            <span className="w-10 text-right tabular-nums text-[#DDD4EC]">
              {formatDuration(activePosition)}
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onMouseDown={() => setIsScrubbing(true)}
                onTouchStart={() => setIsScrubbing(true)}
                onChange={(e) => {
                  const pct = parseFloat(e.target.value);
                  setScrubPosition((pct / 100) * duration);
                }}
                onMouseUp={(e) => handleSeekCommit(parseFloat((e.target as HTMLInputElement).value))}
                onTouchEnd={(e) => handleSeekCommit(parseFloat((e.target as HTMLInputElement).value))}
                className="w-full accent-[#FFB020] cursor-pointer h-1.5 bg-[#251D33] rounded-lg border border-black"
              />
            </div>
            <span className="w-10 text-left tabular-nums text-[#8E849E]">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Quality Badge */}
        <div className="flex items-center justify-end gap-3 w-full md:w-1/4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-[#1B1526] border border-black rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CE38B]" />
            <span className="text-[10px] font-mono font-bold text-[#A89CB8]">
              384 KBPS LOSSLESS
            </span>
          </div>

          {/* Master Gain Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleVolumeToggleMute}
              className="text-[#8E849E] hover:text-white"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="200"
              value={volume}
              onChange={(e) => onControl({ action: "volume", value: parseInt(e.target.value, 10) })}
              className="w-20 sm:w-24 accent-[#FFB020] cursor-pointer h-1.5 bg-[#251D33] rounded-lg border border-black"
            />
            <span className="text-[11px] font-mono font-bold text-[#DDD4EC] tabular-nums w-8">
              {volume}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
