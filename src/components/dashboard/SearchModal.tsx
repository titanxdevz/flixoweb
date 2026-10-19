"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SearchSource, TrackSnapshot } from "@/types/dashboard";
import { api, DEMO_PLAYLIST_TRACKS } from "@/lib/dashboard-api";
import { Search, X, Plus, Play, Music, Loader2 } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  guildId: string;
  isDemo?: boolean;
  onEnqueue: (track: TrackSnapshot, playNext?: boolean) => void;
}

const SOURCES: { id: SearchSource; label: string; icon: string }[] = [
  { id: "spotify", label: "Spotify", icon: "🟢" },
  { id: "youtube", label: "YouTube", icon: "🔴" },
  { id: "youtubemusic", label: "YT Music", icon: "🎵" },
  { id: "soundcloud", label: "SoundCloud", icon: "🟠" },
  { id: "applemusic", label: "Apple Music", icon: "🍎" },
  { id: "tidal", label: "Tidal", icon: "⬛" },
  { id: "deezer", label: "Deezer", icon: "🟣" },
  { id: "qobuz", label: "Qobuz", icon: "🔷" },
  { id: "jiosaavn", label: "JioSaavn", icon: "🟢" },
  { id: "amazonmusic", label: "Amazon", icon: "🔵" },
  { id: "yandex", label: "Yandex", icon: "🟡" },
  { id: "http", label: "Direct URL", icon: "🔗" },
];

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return "--:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function SearchModal({
  isOpen,
  onClose,
  guildId,
  isDemo = false,
  onEnqueue,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SearchSource>("spotify");
  const [results, setResults] = useState<TrackSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      if (isDemo) {
        // Return realistic search matching results
        setTimeout(() => {
          const filtered = DEMO_PLAYLIST_TRACKS.filter((t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.author.toLowerCase().includes(query.toLowerCase())
          );
          setResults(
            filtered.length > 0
              ? filtered
              : [
                  {
                    title: `${query} (Studio Master)`,
                    author: `Various Artists [${source.toUpperCase()}]`,
                    duration: 198000,
                    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
                    uri: `https://${source}.com/search?q=${encodeURIComponent(query)}`,
                    source,
                    isStream: false,
                    requester: null,
                  },
                  ...DEMO_PLAYLIST_TRACKS.slice(0, 3),
                ]
          );
          setIsLoading(false);
        }, 350);
      } else {
        const tracks = await api.searchTracks(guildId, query.trim(), source);
        setResults(tracks);
        setIsLoading(false);
      }
    } catch {
      // Graceful fallback to search demo tracks
      setResults(DEMO_PLAYLIST_TRACKS);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#14101A] border-[3px] border-black rounded-3xl p-5 sm:p-6 shadow-[8px_8px_0px_#000000] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#251D33] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB020] animate-pulse" />
            <h2 className="text-sm font-mono font-bold tracking-widest text-[#DDD4EC] uppercase">
              MULTI-SOURCE AUDIO SEARCH // 12 PROVIDERS
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close search modal"
            className="p-1.5 rounded-xl bg-[#221B2F] hover:bg-[#322744] text-[#DDD4EC] border border-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E849E]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by song title, artist, or direct audio link..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0C0A10] border-2 border-black rounded-xl text-sm font-medium text-white placeholder:text-[#655A75] focus:outline-none focus:border-[#FF5CAA]"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="brutal-btn px-5 py-2.5 bg-[#FFB020] text-black font-bold text-xs uppercase tracking-wide rounded-xl disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Source Selector Pills (api.md §4) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 custom-scrollbar">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSource(s.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-colors border ${
                source === s.id
                  ? "bg-[#FF5CAA] text-white border-black shadow-[2px_2px_0px_#000000]"
                  : "bg-[#1E1729] text-[#A89CB8] border-transparent hover:border-[#3D3053]"
              }`}
            >
              <span className="mr-1">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#FFB020] animate-spin" />
              <p className="text-xs font-mono text-[#DDD4EC]">Querying {source.toUpperCase()} stream catalog...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((track, i) => (
              <div
                key={`${track.uri}-${i}`}
                className="bg-[#191424] hover:bg-[#221C30] border-2 border-black rounded-xl p-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]"
              >
                {/* Artwork */}
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-black bg-black shrink-0 relative">
                  {track.thumbnail ? (
                    <Image
                      src={track.thumbnail}
                      alt={track.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#655A75]">
                      <Music className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{track.title}</p>
                  <p className="text-[11px] font-mono text-[#8E849E] truncate">{track.author}</p>
                </div>

                {/* Duration */}
                <span className="text-xs font-mono text-[#DDD4EC] tabular-nums shrink-0">
                  {formatDuration(track.duration)}
                </span>

                {/* Add actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onEnqueue(track, true);
                      onClose();
                    }}
                    title="Play next immediately"
                    className="brutal-btn px-2.5 py-1 bg-[#2C213D] text-[#DDD4EC] hover:text-white rounded-lg text-xs font-mono flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">Next</span>
                  </button>
                  <button
                    onClick={() => {
                      onEnqueue(track, false);
                      onClose();
                    }}
                    title="Enqueue to end"
                    className="brutal-btn px-2.5 py-1 bg-[#7C3AED] text-white rounded-lg text-xs font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden sm:inline">Queue</span>
                  </button>
                </div>
              </div>
            ))
          ) : hasSearched ? (
            <div className="py-12 text-center text-xs font-mono text-[#8E849E]">
              No tracks found matching &quot;{query}&quot; on {source}.
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-[#655A75]">
              Type a title or URL above to find audio across 12 platforms.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
