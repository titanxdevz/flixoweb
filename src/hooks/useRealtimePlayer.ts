"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  PlayerSnapshot,
  ControlRequest,
  FilterPreset,
  TrackSnapshot,
  RepeatMode,
} from "@/types/dashboard";
import { DEMO_PLAYLIST_TRACKS } from "@/lib/dashboard-api";

interface TickPayload {
  guildId: string;
  position: number;
  playing: boolean;
  paused: boolean;
  timestamp: number;
}

interface UseRealtimePlayerOptions {
  guildId: string;
  initialSnapshot?: PlayerSnapshot | null;
  apiUrl?: string;
  isDemo?: boolean;
}

export function useRealtimePlayer({
  guildId,
  initialSnapshot = null,
  apiUrl,
  isDemo = false,
}: UseRealtimePlayerOptions) {
  const [snapshot, setSnapshot] = useState<PlayerSnapshot | null>(initialSnapshot);
  const [currentPosition, setCurrentPosition] = useState<number>(
    initialSnapshot?.position || 0
  );
  const [isConnected, setIsConnected] = useState<boolean>(isDemo);
  const [error, setError] = useState<string | null>(null);

  // References to keep high-frequency ticks and interpolation synchronized
  const socketRef = useRef<Socket | null>(null);
  const lastTickRef = useRef<TickPayload | null>(
    initialSnapshot
      ? {
          guildId,
          position: initialSnapshot.position,
          playing: initialSnapshot.playing,
          paused: initialSnapshot.paused,
          timestamp: initialSnapshot.serverTimestamp || Date.now(),
        }
      : null
  );

  // Demo auto-advance
  const handleDemoTrackEnd = useCallback(() => {
    setSnapshot((prev) => {
      if (!prev) return null;
      if (prev.repeatMode === "track" && prev.current) {
        lastTickRef.current = {
          guildId,
          position: 0,
          playing: true,
          paused: false,
          timestamp: Date.now(),
        };
        return { ...prev, position: 0 };
      }

      if (prev.upcoming.length > 0) {
        const nextTrack = prev.upcoming[0];
        const newUpcoming = prev.upcoming.slice(1);
        if (prev.repeatMode === "queue" && prev.current) {
          newUpcoming.push(prev.current);
        }
        lastTickRef.current = {
          guildId,
          position: 0,
          playing: true,
          paused: false,
          timestamp: Date.now(),
        };
        return {
          ...prev,
          current: nextTrack,
          upcoming: newUpcoming,
          position: 0,
          previousAvailable: prev.previousAvailable + 1,
        };
      }

      // Queue empty
      lastTickRef.current = {
        guildId,
        position: 0,
        playing: false,
        paused: false,
        timestamp: Date.now(),
      };
      return { ...prev, current: null, playing: false, paused: false, position: 0 };
    });
  }, [guildId]);

  // 1. Position interpolation engine (api.md §5)
  useEffect(() => {
    let animFrame: number;
    let lastRenderTime = 0;

    const updateInterpolation = (time: number) => {
      // Throttle render ticks to ~100ms for ultra-smooth UI without pegging CPU
      if (time - lastRenderTime > 100) {
        lastRenderTime = time;
        const tick = lastTickRef.current;
        if (tick && snapshot?.current) {
          const duration = snapshot.current.duration || 1;
          const elapsed =
            tick.paused || !tick.playing ? 0 : Math.max(0, Date.now() - tick.timestamp);
          const computed = Math.min(duration, Math.max(0, tick.position + elapsed));
          setCurrentPosition(computed);

          // If track naturally reaches end in demo mode, auto-advance
          if (isDemo && computed >= duration && tick.playing && !tick.paused) {
            handleDemoTrackEnd();
          }
        }
      }
      animFrame = requestAnimationFrame(updateInterpolation);
    };

    animFrame = requestAnimationFrame(updateInterpolation);
    return () => cancelAnimationFrame(animFrame);
  }, [snapshot, isDemo, handleDemoTrackEnd]);

  // 2. Realtime Socket.IO Connection (api.md §1 & §5)
  useEffect(() => {
    if (isDemo || !guildId) return;

    const targetUrl =
      apiUrl ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://flixo.vexanode.gg:6776";

    const socket = io(targetUrl, {
      path: "/realtime",
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 8000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);

      // Subscribe to guild room
      socket.emit("guild:subscribe", { guildId }, (res: { ok: boolean; error?: string; data?: { snapshot: PlayerSnapshot } }) => {
        if (res && res.ok && res.data?.snapshot) {
          setSnapshot(res.data.snapshot);
          lastTickRef.current = {
            guildId,
            position: res.data.snapshot.position,
            playing: res.data.snapshot.playing,
            paused: res.data.snapshot.paused,
            timestamp: res.data.snapshot.serverTimestamp || Date.now(),
          };
        }
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      setIsConnected(false);
      setError(err.message || "Failed to connect to realtime audio stream");
    });

    // Server-to-Client Event Handlers
    socket.on("player:snapshot", (snap: PlayerSnapshot) => {
      setSnapshot(snap);
      lastTickRef.current = {
        guildId,
        position: snap.position,
        playing: snap.playing,
        paused: snap.paused,
        timestamp: snap.serverTimestamp || Date.now(),
      };
    });

    socket.on("player:tick", (tick: TickPayload) => {
      if (tick.guildId === guildId) {
        lastTickRef.current = tick;
      }
    });

    socket.on("player:trackStart", ({ track, position, paused }) => {
      setSnapshot((prev) => (prev ? { ...prev, current: track, position, paused, playing: true } : prev));
      lastTickRef.current = {
        guildId,
        position,
        playing: true,
        paused: !!paused,
        timestamp: Date.now(),
      };
    });

    socket.on("player:paused", ({ position }: { position: number }) => {
      setSnapshot((prev) => (prev ? { ...prev, paused: true } : prev));
      if (lastTickRef.current) {
        lastTickRef.current.paused = true;
        lastTickRef.current.position = position;
        lastTickRef.current.timestamp = Date.now();
      }
    });

    socket.on("player:resumed", ({ position }: { position: number }) => {
      setSnapshot((prev) => (prev ? { ...prev, paused: false, playing: true } : prev));
      if (lastTickRef.current) {
        lastTickRef.current.paused = false;
        lastTickRef.current.playing = true;
        lastTickRef.current.position = position;
        lastTickRef.current.timestamp = Date.now();
      }
    });

    socket.on("player:queueEnd", () => {
      setSnapshot((prev) => (prev ? { ...prev, current: null, upcoming: [], playing: false } : prev));
    });

    socket.on("player:destroyed", () => {
      setSnapshot((prev) =>
        prev ? { ...prev, current: null, upcoming: [], playing: false, connected: false } : prev
      );
    });

    socket.on("voice:listeners", ({ listeners }: { listeners: number }) => {
      setSnapshot((prev) => (prev ? { ...prev, listeners } : prev));
    });

    return () => {
      socket.emit("guild:unsubscribe", { guildId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [guildId, apiUrl, isDemo]);

  // Dispatch control actions (either to Socket / REST, or simulated in demo)
  const sendControl = useCallback(
    (action: ControlRequest) => {
      if (!isDemo && socketRef.current?.connected) {
        socketRef.current.emit("player:control", { guildId, ...action });
      }

      // Local optimistic / demo state updates
      setSnapshot((prev) => {
        if (!prev) return null;
        const now = Date.now();

        if (action.action === "pause") {
          lastTickRef.current = {
            guildId,
            position: currentPosition,
            playing: true,
            paused: true,
            timestamp: now,
          };
          return { ...prev, paused: true };
        }

        if (action.action === "resume") {
          lastTickRef.current = {
            guildId,
            position: currentPosition,
            playing: true,
            paused: false,
            timestamp: now,
          };
          return { ...prev, paused: false, playing: true };
        }

        if (action.action === "seek") {
          lastTickRef.current = {
            guildId,
            position: action.value,
            playing: prev.playing,
            paused: prev.paused,
            timestamp: now,
          };
          setCurrentPosition(action.value);
          return { ...prev, position: action.value };
        }

        if (action.action === "volume") {
          return { ...prev, volume: action.value };
        }

        if (action.action === "loop") {
          return { ...prev, repeatMode: action.value as RepeatMode };
        }

        if (action.action === "shuffle") {
          const shuffled = [...prev.upcoming].sort(() => Math.random() - 0.5);
          return { ...prev, upcoming: shuffled };
        }

        if (action.action === "clear") {
          return { ...prev, upcoming: [] };
        }

        if (action.action === "skip") {
          if (prev.upcoming.length > 0) {
            const nextTrack = prev.upcoming[0];
            const remaining = prev.upcoming.slice(1);
            lastTickRef.current = {
              guildId,
              position: 0,
              playing: true,
              paused: false,
              timestamp: now,
            };
            setCurrentPosition(0);
            return {
              ...prev,
              current: nextTrack,
              upcoming: remaining,
              position: 0,
              previousAvailable: prev.previousAvailable + 1,
            };
          } else {
            return { ...prev, current: null, playing: false, position: 0 };
          }
        }

        if (action.action === "previous") {
          if (prev.previousAvailable > 0) {
            // Restore demo previous track
            const mockPrev = DEMO_PLAYLIST_TRACKS[3];
            const updatedUpcoming = prev.current ? [prev.current, ...prev.upcoming] : prev.upcoming;
            lastTickRef.current = {
              guildId,
              position: 0,
              playing: true,
              paused: false,
              timestamp: now,
            };
            setCurrentPosition(0);
            return {
              ...prev,
              current: mockPrev,
              upcoming: updatedUpcoming,
              position: 0,
              previousAvailable: Math.max(0, prev.previousAvailable - 1),
            };
          }
        }

        if (action.action === "stop" || action.action === "disconnect") {
          lastTickRef.current = {
            guildId,
            position: 0,
            playing: false,
            paused: false,
            timestamp: now,
          };
          return {
            ...prev,
            playing: false,
            paused: false,
            current: null,
            upcoming: [],
            connected: action.action !== "disconnect",
          };
        }

        return prev;
      });
    },
    [guildId, isDemo, currentPosition]
  );

  // Apply Filter Preset
  const applyFilter = useCallback(
    (preset: FilterPreset) => {
      if (!isDemo && socketRef.current?.connected) {
        socketRef.current.emit("filters:set", { guildId, ...preset });
      }

      setSnapshot((prev) => {
        if (!prev) return null;
        let activeFilters = [...prev.filters.active];

        if (preset.preset === "off") {
          activeFilters = [];
        } else if (preset.preset === "bassboost") {
          if (!activeFilters.includes("bassboost")) activeFilters.push("bassboost");
        } else if ("preset" in preset && typeof preset.preset === "string") {
          const name = preset.preset;
          if (activeFilters.includes(name)) {
            activeFilters = activeFilters.filter((f) => f !== name);
          } else {
            activeFilters.push(name);
          }
        }

        return {
          ...prev,
          filters: {
            ...prev.filters,
            active: activeFilters,
            speed: "value" in preset && preset.preset === "speed" ? preset.value : prev.filters.speed,
            pitch: "value" in preset && preset.preset === "pitch" ? preset.value : prev.filters.pitch,
          },
        };
      });
    },
    [guildId, isDemo]
  );

  // Queue actions
  const enqueueTrack = useCallback(
    (track: TrackSnapshot, playNext = false) => {
      if (!isDemo && socketRef.current?.connected) {
        socketRef.current.emit("queue:add", {
          guildId,
          query: track.uri || track.title,
          next: playNext,
        });
      }

      setSnapshot((prev) => {
        if (!prev) return null;
        if (!prev.current) {
          // If stopped, play immediately
          lastTickRef.current = {
            guildId,
            position: 0,
            playing: true,
            paused: false,
            timestamp: Date.now(),
          };
          return { ...prev, current: track, playing: true, paused: false, position: 0 };
        }
        if (playNext) {
          return { ...prev, upcoming: [track, ...prev.upcoming] };
        }
        return { ...prev, upcoming: [...prev.upcoming, track] };
      });
    },
    [guildId, isDemo]
  );

  const removeQueueTrack = useCallback(
    (index: number) => {
      if (!isDemo && socketRef.current?.connected) {
        socketRef.current.emit("queue:remove", { guildId, index });
      }
      setSnapshot((prev) => {
        if (!prev) return null;
        const upcoming = [...prev.upcoming];
        upcoming.splice(index, 1);
        return { ...prev, upcoming };
      });
    },
    [guildId, isDemo]
  );

  const moveQueueTrack = useCallback(
    (from: number, to: number) => {
      if (!isDemo && socketRef.current?.connected) {
        socketRef.current.emit("queue:move", { guildId, from, to });
      }
      setSnapshot((prev) => {
        if (!prev) return null;
        const upcoming = [...prev.upcoming];
        if (from < 0 || from >= upcoming.length || to < 0 || to >= upcoming.length) return prev;
        const [moved] = upcoming.splice(from, 1);
        upcoming.splice(to, 0, moved);
        return { ...prev, upcoming };
      });
    },
    [guildId, isDemo]
  );

  return {
    snapshot,
    currentPosition,
    isConnected,
    error,
    sendControl,
    applyFilter,
    enqueueTrack,
    removeQueueTrack,
    moveQueueTrack,
    setSnapshot,
  };
}
