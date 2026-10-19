import {
  DashboardUser,
  GuildOverview,
  MutualGuild,
  PlayerSnapshot,
  TrackSnapshot,
  ControlRequest,
  FilterPreset,
  SearchSource,
  AdminUser,
  AdminGuild,
  AdminLog,
} from "@/types/dashboard";

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:6776"
    : "http://flixo.vexanode.gg:6776");

class DashboardApiClient {
  private csrfToken: string | null = null;
  public baseUrl: string = DEFAULT_API_URL;

  public setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  public getCsrfToken(): string | null {
    return this.csrfToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(options.headers || {});

    // Include CSRF token for mutating methods
    const method = (options.method || "GET").toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (this.csrfToken) {
        headers.set("x-csrf-token", this.csrfToken);
      }
      if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
        headers.set("Content-Type", "application/json");
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // transport rule from api.md §1
      });

      // Capture CSRF token from response header if present
      const csrfHeader = response.headers.get("X-CSRF-Token") || response.headers.get("x-csrf-token");
      if (csrfHeader) {
        this.csrfToken = csrfHeader;
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorBody.error || `HTTP ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(msg);
    }
  }

  // Auth & Session
  async getCurrentUser(): Promise<DashboardUser> {
    const user = await this.request<DashboardUser>("/auth/user");
    if (user.csrfToken) {
      this.csrfToken = user.csrfToken;
    }
    return user;
  }

  async getMutualGuilds(): Promise<MutualGuild[]> {
    return this.request<MutualGuild[]>("/auth/guilds");
  }

  async logout(): Promise<void> {
    await this.request<{ success: boolean }>("/auth/logout", { method: "POST" });
  }

  // Guild Overview & Player
  async getGuildOverview(guildId: string): Promise<GuildOverview> {
    return this.request<GuildOverview>(`/api/guild/${guildId}/overview`);
  }

  async getGuildPlayer(guildId: string): Promise<PlayerSnapshot> {
    return this.request<PlayerSnapshot>(`/api/guild/${guildId}/player`);
  }

  // Search across 12 sources (api.md §3 & §4)
  async searchTracks(guildId: string, query: string, source: SearchSource = "youtube"): Promise<TrackSnapshot[]> {
    const params = new URLSearchParams({ q: query, source });
    const res = await this.request<{ tracks: TrackSnapshot[] } | TrackSnapshot[]>(
      `/api/guild/${guildId}/search?${params.toString()}`
    );
    if (Array.isArray(res)) return res;
    return res.tracks || [];
  }

  // Queue mutations
  async enqueueTrack(
    guildId: string,
    query: string,
    next?: boolean,
    voiceChannelId?: string
  ): Promise<{ added: number }> {
    return this.request<{ added: number }>(`/api/guild/${guildId}/queue`, {
      method: "POST",
      body: JSON.stringify({ query, next, voiceChannelId }),
    });
  }

  async removeQueueTrack(guildId: string, index: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/guild/${guildId}/queue/${index}`, {
      method: "DELETE",
    });
  }

  async moveQueueTrack(guildId: string, from: number, to: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/guild/${guildId}/queue/move`, {
      method: "POST",
      body: JSON.stringify({ from, to }),
    });
  }

  // Player controls
  async controlPlayer(guildId: string, payload: ControlRequest): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/guild/${guildId}/control`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // DSP filter presets
  async setFilters(guildId: string, payload: FilterPreset): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/guild/${guildId}/filters`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Admin routes
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>("/api/admin/users");
  }

  async toggleAdminUser(userId: string): Promise<{ isAdmin: boolean }> {
    return this.request<{ isAdmin: boolean }>(`/api/admin/user/${userId}/admin`, {
      method: "POST",
    });
  }

  async getAdminGuilds(): Promise<AdminGuild[]> {
    return this.request<AdminGuild[]>("/api/admin/guilds");
  }

  async getAdminLogs(): Promise<AdminLog[]> {
    return this.request<AdminLog[]>("/api/admin/logs");
  }

  async snapshotBotStats(): Promise<{ success: boolean; timestamp: number }> {
    return this.request<{ success: boolean; timestamp: number }>("/api/admin/botstats", {
      method: "POST",
    });
  }
}

export const api = new DashboardApiClient();

// High-fidelity fallback / interactive studio demo data
export const DEMO_USER: DashboardUser = {
  id: "1380994881731952741",
  username: "Ansh Singh",
  discriminator: "0",
  tag: "ansh#0001",
  avatar: "/flixo-avatar.png",
  isAdmin: true,
  isPremium: true,
  premiumUntil: "2028-01-01T00:00:00.000Z",
  csrfToken: "demo-csrf-token-studio-safe-8899",
};

export const DEMO_GUILDS: MutualGuild[] = [
  {
    id: "99881122334455",
    name: "Flixo Studio HQ",
    icon: "/logo.png",
    owner: true,
    permissions: "8",
    isBotIn: true,
    activeVoiceChannel: "Studio Master 1",
    listeners: 5,
    isPlaying: true,
    currentTrack: "Resonance — HOME (Lossless)",
  },
  {
    id: "88776655443322",
    name: "Lofi Chill & Code",
    icon: "/flixo-sticker.png",
    owner: false,
    permissions: "32",
    isBotIn: true,
    activeVoiceChannel: "Midnight Lounge",
    listeners: 3,
    isPlaying: true,
    currentTrack: "Snowman — WYS / Lofi Records",
  },
  {
    id: "77665544332211",
    name: "Vaporwave Synth Club",
    icon: "/flixo-avatar.png",
    owner: true,
    permissions: "8",
    isBotIn: true,
    activeVoiceChannel: "Stage Channel",
    listeners: 1,
    isPlaying: false,
    currentTrack: null,
  },
];

export const DEMO_PLAYLIST_TRACKS: TrackSnapshot[] = [
  {
    title: "Resonance (384kbps FLAC)",
    author: "HOME",
    duration: 212000,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    uri: "https://spotify.com/track/resonance",
    source: "spotify",
    isStream: false,
    requester: {
      id: "1380994881731952741",
      username: "Ansh Singh",
      avatar: "/flixo-avatar.png",
    },
  },
  {
    title: "Sunset Lover (Slowed + Reverb)",
    author: "Petit Biscuit",
    duration: 238000,
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    uri: "https://soundcloud.com/petitbiscuit/sunsetlover",
    source: "soundcloud",
    isStream: false,
    requester: {
      id: "22334455667788",
      username: "NovaSound",
      avatar: null,
    },
  },
  {
    title: "Midnight City",
    author: "M83",
    duration: 243000,
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    uri: "https://youtube.com/watch?v=M83Midnight",
    source: "youtube",
    isStream: false,
    requester: {
      id: "33445566778899",
      username: "AudioPhile",
      avatar: null,
    },
  },
  {
    title: "Starboy (Lossless Master)",
    author: "The Weeknd ft. Daft Punk",
    duration: 230000,
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    uri: "https://applemusic.com/album/starboy",
    source: "applemusic",
    isStream: false,
    requester: {
      id: "44556677889900",
      username: "EchoPulse",
      avatar: null,
    },
  },
  {
    title: "After Dark",
    author: "Mr. Kitty",
    duration: 259000,
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    uri: "https://tidal.com/track/afterdark",
    source: "tidal",
    isStream: false,
    requester: {
      id: "55667788990011",
      username: "NeonDrifter",
      avatar: null,
    },
  },
];

export function getDemoGuildOverview(guildId: string): GuildOverview {
  const g = DEMO_GUILDS.find((x) => x.id === guildId) || DEMO_GUILDS[0];

  const currentTrack = DEMO_PLAYLIST_TRACKS[0];
  const upcoming = DEMO_PLAYLIST_TRACKS.slice(1);

  const player: PlayerSnapshot = {
    guildId: g.id,
    playing: true,
    paused: false,
    connected: true,
    position: 48000,
    volume: 100,
    repeatMode: "off",
    node: "vexanode-primary",
    voiceChannelId: "vc-1",
    voiceChannelName: g.activeVoiceChannel || "Studio Master 1",
    listeners: g.listeners || 4,
    current: currentTrack,
    upcoming,
    previousAvailable: 2,
    filters: {
      active: ["bassboost"],
      equalizer: true,
      speed: 1.0,
      pitch: null,
      rate: null,
    },
    serverTimestamp: Date.now(),
  };

  return {
    id: g.id,
    name: g.name,
    icon: g.icon,
    memberCount: 284,
    isBotIn: true,
    hasAccess: true,
    voiceChannels: [
      { id: "vc-1", name: "Studio Master 1", isCurrent: true, membersCount: 5 },
      { id: "vc-2", name: "Midnight Lounge", isCurrent: false, membersCount: 2 },
      { id: "vc-3", name: "AFK / Muted", isCurrent: false, membersCount: 0 },
    ],
    player,
    settings: {
      prefix: "!",
      defaultVolume: 100,
      djRole: "DJ Master",
      stay247: true,
    },
    accessRole: "admin",
    stay247: true,
  };
}
