"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TrackSnapshot } from "@/types/dashboard";
import { Trash2, ArrowUp, ArrowDown, Music2, ListMusic } from "lucide-react";

interface QueueListProps {
  tracks: TrackSnapshot[];
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onClear: () => void;
  onOpenSearch: () => void;
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return "--:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function QueueList({
  tracks,
  onRemove,
  onMove,
  onClear,
  onOpenSearch,
}: QueueListProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="bg-[#15121C] border-[3px] border-[#000000] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#000000] flex flex-col h-full">
      {/* Header with silkscreen faceplate style */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#261E33] mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#221B30] border border-black rounded-lg text-[#FFB020]">
            <ListMusic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#A89CB8] uppercase">
              QUEUE MONITOR
            </h3>
            <p className="text-[11px] font-mono text-[#DDD4EC]">
              <span className="text-[#FFB020] font-bold tabular-nums">{tracks.length}</span>{" "}
              {tracks.length === 1 ? "track queued" : "tracks queued"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tracks.length > 0 && (
            <button
              onClick={() => {
                if (confirmClear) {
                  onClear();
                  setConfirmClear(false);
                } else {
                  setConfirmClear(true);
                  setTimeout(() => setConfirmClear(false), 3000);
                }
              }}
              className={`brutal-btn px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                confirmClear
                  ? "bg-[#FF5CAA] text-white"
                  : "bg-[#231A33] text-[#DDD4EC] hover:text-white"
              }`}
            >
              {confirmClear ? "CONFIRM PURGE?" : "CLEAR ALL"}
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="brutal-btn px-3 py-1 bg-[#FFB020] text-black rounded-lg text-xs font-mono font-bold hover:bg-[#F59E0B]"
          >
            + ADD TRACK
          </button>
        </div>
      </div>

      {/* Queue items list */}
      <div className="flex-1 overflow-y-auto max-h-[380px] space-y-2 pr-1 custom-scrollbar">
        {tracks.length === 0 ? (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center gap-3 bg-[#0E0C12] border-2 border-dashed border-[#2F263F] rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1626] border-2 border-black flex items-center justify-center text-[#8E849E]">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm font-[family-name:var(--font-fredoka)]">
                Queue is empty
              </p>
              <p className="text-xs font-mono text-[#8E849E] mt-0.5">
                Search Spotify, YouTube, SoundCloud or Apple Music to load tracks.
              </p>
            </div>
            <button
              onClick={onOpenSearch}
              className="brutal-btn mt-2 px-4 py-1.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9]"
            >
              Search & Enqueue
            </button>
          </div>
        ) : (
          tracks.map((track, idx) => (
            <div
              key={`${track.uri || track.title}-${idx}`}
              className="group bg-[#191522] hover:bg-[#201B2B] border-2 border-black rounded-xl p-2.5 flex items-center gap-3 transition-colors shadow-[2px_2px_0px_#000000]"
            >
              {/* Position Index */}
              <span className="w-6 text-center font-mono text-xs font-bold text-[#8E849E] tabular-nums shrink-0">
                {(idx + 1).toString().padStart(2, "0")}
              </span>

              {/* Artwork thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-black bg-black shrink-0 relative">
                {track.thumbnail ? (
                  <Image
                    src={track.thumbnail}
                    alt={track.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#655A75]">
                    <Music2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Title & Author */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate group-hover:text-[#FFB020] transition-colors">
                  {track.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E849E] mt-0.5">
                  <span className="truncate">{track.author}</span>
                  <span>•</span>
                  <span className="uppercase text-[#FF5CAA] px-1 py-0.2 bg-[#2D1629] rounded border border-[#4A2041]">
                    {track.source || "audio"}
                  </span>
                  {track.requester && (
                    <>
                      <span>•</span>
                      <span className="truncate text-[#DDD4EC]">req: {track.requester.username}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Duration in tabular monospace */}
              <span className="text-xs font-mono font-medium text-[#DDD4EC] tabular-nums shrink-0 px-1">
                {formatDuration(track.duration)}
              </span>

              {/* Item reorder & remove actions */}
              <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => onMove(idx, idx - 1)}
                  aria-label="Move track up"
                  className="p-1 bg-[#282136] hover:bg-[#352B47] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded border border-black"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === tracks.length - 1}
                  onClick={() => onMove(idx, idx + 1)}
                  aria-label="Move track down"
                  className="p-1 bg-[#282136] hover:bg-[#352B47] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded border border-black"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemove(idx)}
                  aria-label="Remove track from queue"
                  className="p-1 bg-[#3A1422] hover:bg-[#52192F] text-[#FF5CAA] rounded border border-black"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
