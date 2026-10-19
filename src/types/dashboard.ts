export type AccessRole = "admin" | "manager" | "dj" | "listener";

export type SearchSource =
  | "youtube"
  | "youtubemusic"
  | "spotify"
  | "soundcloud"
  | "applemusic"
  | "deezer"
  | "qobuz"
  | "tidal"
  | "jiosaavn"
  | "yandex"
  | "amazonmusic"
  | "http";

export interface TrackRequester {
  id: string;
  username: string;
  avatar: string | null;
}

export interface TrackSnapshot {
  title: string;
  author: string;
  duration: number; // in milliseconds
  thumbnail: string | null;
  uri: string;
  source: string;
  isStream: boolean;
  requester: TrackRequester | null;
}

export type RepeatMode = "off" | "track" | "queue";

export interface ActiveFiltersState {
  active: string[];
  equalizer: boolean;
  speed: number | null;
  pitch: number | null;
  rate: number | null;
}

export interface PlayerSnapshot {
  guildId: string;
  playing: boolean;
  paused: boolean;
  connected: boolean;
  position: number; // in milliseconds
  volume: number; // 0..200
  repeatMode: RepeatMode;
  node: string | null;
  voiceChannelId: string | null;
  voiceChannelName: string | null;
  listeners: number;
  current: TrackSnapshot | null;
  upcoming: TrackSnapshot[];
  previousAvailable: number;
  filters: ActiveFiltersState;
  serverTimestamp: number;
}

export type ControlRequest =
  | { action: "pause" | "resume" | "skip" | "previous" | "stop" | "disconnect" | "shuffle" | "clear" }
  | { action: "loop"; value: RepeatMode }
  | { action: "volume"; value: number }
  | { action: "seek"; value: number };

export type FilterPreset =
  | { preset: "off" }
  | { preset: "bassboost"; level: "low" | "medium" | "high" }
  | {
      preset:
        | "nightcore"
        | "8d"
        | "tremolo"
        | "vibrato"
        | "rotation"
        | "karaoke"
        | "lowpass"
        | "highpass"
        | "vaporwave";
    }
  | { preset: "speed" | "pitch" | "rate"; value: number };

export interface DashboardUser {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  premiumUntil: string | null;
  csrfToken: string;
}

export interface VoiceChannel {
  id: string;
  name: string;
  userLimit?: number;
  isCurrent?: boolean;
  membersCount?: number;
}

export interface GuildSettings {
  prefix?: string;
  defaultVolume?: number;
  djRole?: string | null;
  stay247?: boolean;
}

export interface GuildOverview {
  id: string;
  name: string;
  icon: string | null;
  memberCount?: number;
  isBotIn: boolean;
  hasAccess: boolean;
  voiceChannels: VoiceChannel[];
  player: PlayerSnapshot | null;
  settings: GuildSettings;
  accessRole: AccessRole;
  stay247: boolean;
}

export interface MutualGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  isBotIn: boolean;
  activeVoiceChannel?: string | null;
  listeners?: number;
  isPlaying?: boolean;
  currentTrack?: string | null;
}

export interface AdminUser {
  id: string;
  username: string;
  tag: string;
  avatar: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  lastSeen?: string;
  guildsManaged?: number;
}

export interface AdminGuild {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  shardId: number;
  voiceChannelName: string | null;
  isPlaying: boolean;
  listeners: number;
  currentTrackTitle: string | null;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  guildId?: string;
  guildName?: string;
  details: string;
}
