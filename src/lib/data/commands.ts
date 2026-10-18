export type CommandCategory =
  | "playback"
  | "filters"
  | "playlist"
  | "integrations"
  | "utility"
  | "info"
  | "admin";

export type PermissionRole = "listener" | "dj" | "manager" | "admin";

export interface CommandOption {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface BotCommand {
  name: string;
  category: CommandCategory;
  description: string;
  usage: string;
  permission: PermissionRole;
  options?: CommandOption[];
}

export const commandCategories: { id: CommandCategory; label: string }[] = [
  { id: "playback", label: "Music playback" },
  { id: "filters", label: "DSP audio filters" },
  { id: "playlist", label: "Playlists" },
  { id: "integrations", label: "Spotify & Last.fm" },
  { id: "utility", label: "Server utilities & 24/7" },
  { id: "info", label: "Information & status" },
  { id: "admin", label: "Server management" },
];

export const allCommands: BotCommand[] = [
  // --- Music Playback ---
  {
    name: "play",
    category: "playback",
    description: "Queues a track or playlist from Spotify, SoundCloud, or direct audio link.",
    usage: "/play query:<song | url> [next:<true|false>] [voiceChannelId:<channel>]",
    permission: "listener",
    options: [
      { name: "query", type: "string (1..300)", required: true, description: "Song title, URL, or playlist link" },
      { name: "next", type: "boolean", required: false, description: "Insert track at front of upcoming queue" },
      { name: "voiceChannelId", type: "channel", required: false, description: "Target voice channel (requires manager)" },
    ],
  },
  {
    name: "pause",
    category: "playback",
    description: "Pauses active voice playback without losing position.",
    usage: "/pause",
    permission: "listener",
  },
  {
    name: "resume",
    category: "playback",
    description: "Resumes audio playback from the paused position.",
    usage: "/resume",
    permission: "listener",
  },
  {
    name: "skip",
    category: "playback",
    description: "Skips the current song or advances to a target position.",
    usage: "/skip [to:<number>]",
    permission: "listener",
    options: [
      { name: "to", type: "number", required: false, description: "Queue index number to skip directly to" },
    ],
  },
  {
    name: "previous",
    category: "playback",
    description: "Replays the previous track from queue history.",
    usage: "/previous",
    permission: "listener",
  },
  {
    name: "queue",
    category: "playback",
    description: "Lists upcoming tracks with individual durations and total runtime.",
    usage: "/queue [page:<number>]",
    permission: "listener",
    options: [
      { name: "page", type: "number", required: false, description: "Page number to view (10 tracks per page)" },
    ],
  },
  {
    name: "clear",
    category: "playback",
    description: "Clears all upcoming tracks from the queue.",
    usage: "/clear",
    permission: "dj",
  },
  {
    name: "stop",
    category: "playback",
    description: "Stops playback and clears the active music queue.",
    usage: "/stop",
    permission: "dj",
  },
  {
    name: "disconnect",
    category: "playback",
    description: "Leaves the voice channel and destroys the active player.",
    usage: "/disconnect",
    permission: "dj",
  },
  {
    name: "move",
    category: "playback",
    description: "Changes the position of a track in the upcoming queue.",
    usage: "/move from:<number> to:<number>",
    permission: "dj",
    options: [
      { name: "from", type: "number", required: true, description: "Current queue index" },
      { name: "to", type: "number", required: true, description: "Target queue index" },
    ],
  },
  {
    name: "remove",
    category: "playback",
    description: "Removes a specific track from the queue by its index.",
    usage: "/remove index:<number>",
    permission: "dj",
    options: [
      { name: "index", type: "number (0..10000)", required: true, description: "Track index number to remove" },
    ],
  },
  {
    name: "loop",
    category: "playback",
    description: "Configures repeat mode for track or entire queue.",
    usage: "/loop mode:<off | track | queue>",
    permission: "listener",
    options: [
      { name: "mode", type: "choice", required: true, description: "off, track (repeat single), or queue (repeat all)" },
    ],
  },
  {
    name: "shuffle",
    category: "playback",
    description: "Randomizes the order of all upcoming tracks in queue.",
    usage: "/shuffle",
    permission: "listener",
  },
  {
    name: "volume",
    category: "playback",
    description: "Adjusts playback gain from 0% to 200%.",
    usage: "/volume level:<0..200>",
    permission: "dj",
    options: [
      { name: "level", type: "number (0..200)", required: true, description: "Volume level percentage (default 100)" },
    ],
  },
  {
    name: "seek",
    category: "playback",
    description: "Jumps directly to a specific timestamp in the current track.",
    usage: "/seek position:<mm:ss | milliseconds>",
    permission: "listener",
    options: [
      { name: "position", type: "string/number", required: true, description: "Timestamp to seek to (e.g. 1:45 or ms)" },
    ],
  },
  {
    name: "lyrics",
    category: "playback",
    description: "Retrieves live timestamped synchronized lyrics for current song.",
    usage: "/lyrics [song:<string>]",
    permission: "listener",
    options: [
      { name: "song", type: "string", required: false, description: "Optional song name to search lyrics for" },
    ],
  },
  {
    name: "autoplay",
    category: "playback",
    description: "Toggles auto-queuing related songs when queue ends.",
    usage: "/autoplay",
    permission: "dj",
  },
  {
    name: "addsimilar",
    category: "playback",
    description: "Finds and appends songs similar to the currently playing track.",
    usage: "/addsimilar",
    permission: "listener",
  },
  {
    name: "search",
    category: "playback",
    description: "Queries tracks from supported audio sources without queueing immediately.",
    usage: "/search query:<string> [source:<source>]",
    permission: "listener",
    options: [
      { name: "query", type: "string", required: true, description: "Keywords or title to search" },
      { name: "source", type: "choice", required: false, description: "youtube, youtubemusic, spotify, soundcloud, applemusic, deezer, qobuz, tidal, jiosaavn, yandex, amazonmusic, http" },
    ],
  },
  {
    name: "favorite",
    category: "playback",
    description: "Saves current song to your personal favorites list.",
    usage: "/favorite",
    permission: "listener",
  },
  {
    name: "favorites",
    category: "playback",
    description: "Lists your saved favorite tracks with quick queue actions.",
    usage: "/favorites",
    permission: "listener",
  },
  {
    name: "grab",
    category: "playback",
    description: "Sends track metadata, direct link, and thumbnail to your Discord direct messages.",
    usage: "/grab",
    permission: "listener",
  },
  {
    name: "np",
    category: "playback",
    description: "Displays rich embed of currently playing track with elapsed time and bitrates.",
    usage: "/np",
    permission: "listener",
  },
  {
    name: "replay",
    category: "playback",
    description: "Restarts the currently playing track from the beginning.",
    usage: "/replay",
    permission: "listener",
  },
  {
    name: "replayhistory",
    category: "playback",
    description: "Lists recently played tracks in this server.",
    usage: "/replayhistory",
    permission: "listener",
  },

  // --- DSP Audio Filters ---
  {
    name: "filter 8d",
    category: "filters",
    description: "Calculates real-time 360-degree rotating binaural panning for headphones.",
    usage: "/filter 8d",
    permission: "listener",
  },
  {
    name: "filter bassboost",
    category: "filters",
    description: "Applies multi-band low-shelf harmonic distortion with sub-bass boost.",
    usage: "/filter bassboost level:<low | medium | high | extreme>",
    permission: "listener",
    options: [
      { name: "level", type: "choice", required: true, description: "low (+6dB), medium (+10dB), high (+14dB), extreme (+18dB)" },
    ],
  },
  {
    name: "filter nightcore",
    category: "filters",
    description: "Accelerates tempo to 1.25x and shifts pitch up by 3.5 semitones.",
    usage: "/filter nightcore",
    permission: "listener",
  },
  {
    name: "filter vaporwave",
    category: "filters",
    description: "Slows tempo to 0.85x and applies 900Hz low-pass filter for vintage cassette feel.",
    usage: "/filter vaporwave",
    permission: "listener",
  },
  {
    name: "filter karaoke",
    category: "filters",
    description: "Attenuates mono center-channel vocals for sing-along sessions.",
    usage: "/filter karaoke",
    permission: "listener",
  },
  {
    name: "filter pitch",
    category: "filters",
    description: "Alters playback pitch without changing track duration or speed.",
    usage: "/filter pitch value:<0.5..2.0>",
    permission: "listener",
    options: [
      { name: "value", type: "number (0.5..2.0)", required: true, description: "Pitch multiplier (1.0 is default)" },
    ],
  },
  {
    name: "filter speed",
    category: "filters",
    description: "Alters playback tempo while locking pitch at standard frequency.",
    usage: "/filter speed value:<0.5..2.0>",
    permission: "listener",
    options: [
      { name: "value", type: "number (0.5..2.0)", required: true, description: "Speed multiplier (1.0 is default)" },
    ],
  },
  {
    name: "filter rate",
    category: "filters",
    description: "Simultaneously modulates speed and pitch like an analog tape deck.",
    usage: "/filter rate value:<0.5..2.0>",
    permission: "listener",
    options: [
      { name: "value", type: "number (0.5..2.0)", required: true, description: "Rate multiplier (1.0 is default)" },
    ],
  },
  {
    name: "filter tremolo",
    category: "filters",
    description: "Cyclically modulates volume amplitude for tremolo effect.",
    usage: "/filter tremolo",
    permission: "listener",
  },
  {
    name: "filter vibrato",
    category: "filters",
    description: "Cyclically modulates frequency pitch for acoustic flutter.",
    usage: "/filter vibrato",
    permission: "listener",
  },
  {
    name: "filter rotation",
    category: "filters",
    description: "Rotates stereo audio channels at custom hertz frequency.",
    usage: "/filter rotation",
    permission: "listener",
  },
  {
    name: "filter highpass",
    category: "filters",
    description: "Cuts sub-bass frequencies below the specified frequency cutoff.",
    usage: "/filter highpass",
    permission: "listener",
  },
  {
    name: "filter lowpass",
    category: "filters",
    description: "Muffles high frequencies above the specified frequency cutoff.",
    usage: "/filter lowpass",
    permission: "listener",
  },
  {
    name: "filter reset",
    category: "filters",
    description: "Clears all active DSP audio filters back to flat 384kbps playback.",
    usage: "/filter reset",
    permission: "listener",
  },

  // --- Playlists ---
  {
    name: "playlist create",
    category: "playlist",
    description: "Creates a new saved playlist in your account.",
    usage: "/playlist create name:<string>",
    permission: "listener",
    options: [
      { name: "name", type: "string (1..32)", required: true, description: "Playlist title" },
    ],
  },
  {
    name: "playlist add",
    category: "playlist",
    description: "Appends current song or specified query to your saved playlist.",
    usage: "/playlist add name:<string> [query:<string>]",
    permission: "listener",
    options: [
      { name: "name", type: "string", required: true, description: "Target playlist title" },
      { name: "query", type: "string", required: false, description: "Song URL or query (defaults to current track)" },
    ],
  },
  {
    name: "playlist load",
    category: "playlist",
    description: "Loads all tracks from a saved playlist directly into the active voice channel.",
    usage: "/playlist load name:<string>",
    permission: "listener",
    options: [
      { name: "name", type: "string", required: true, description: "Playlist name to load" },
    ],
  },
  {
    name: "playlist list",
    category: "playlist",
    description: "Lists all your saved cloud playlists with track counts.",
    usage: "/playlist list",
    permission: "listener",
  },
  {
    name: "playlist info",
    category: "playlist",
    description: "Displays track list and total duration of a saved playlist.",
    usage: "/playlist info name:<string>",
    permission: "listener",
    options: [
      { name: "name", type: "string", required: true, description: "Playlist title" },
    ],
  },
  {
    name: "playlist rename",
    category: "playlist",
    description: "Renames an existing playlist.",
    usage: "/playlist rename old_name:<string> new_name:<string>",
    permission: "listener",
    options: [
      { name: "old_name", type: "string", required: true, description: "Current playlist name" },
      { name: "new_name", type: "string", required: true, description: "New playlist name" },
    ],
  },
  {
    name: "playlist steal",
    category: "playlist",
    description: "Clones a public playlist from another Discord user into your personal account.",
    usage: "/playlist steal user:<@user> name:<string>",
    permission: "listener",
    options: [
      { name: "user", type: "user", required: true, description: "User whose playlist you want to copy" },
      { name: "name", type: "string", required: true, description: "Target playlist name" },
    ],
  },
  {
    name: "playlist remove",
    category: "playlist",
    description: "Removes an individual song from a saved playlist.",
    usage: "/playlist remove name:<string> index:<number>",
    permission: "listener",
    options: [
      { name: "name", type: "string", required: true, description: "Playlist title" },
      { name: "index", type: "number", required: true, description: "Track index in playlist" },
    ],
  },
  {
    name: "playlist delete",
    category: "playlist",
    description: "Permanently deletes a saved playlist.",
    usage: "/playlist delete name:<string>",
    permission: "listener",
    options: [
      { name: "name", type: "string", required: true, description: "Playlist title to delete" },
    ],
  },

  // --- Integrations ---
  {
    name: "spotify login",
    category: "integrations",
    description: "Initiates OAuth2 login to connect your private Spotify account.",
    usage: "/spotify login",
    permission: "listener",
  },
  {
    name: "spotify logout",
    category: "integrations",
    description: "Disconnects your linked Spotify account from Flixo.",
    usage: "/spotify logout",
    permission: "listener",
  },
  {
    name: "spotify playlists",
    category: "integrations",
    description: "Displays your private Spotify playlists to queue directly into voice.",
    usage: "/spotify playlists",
    permission: "listener",
  },
  {
    name: "spotify profile",
    category: "integrations",
    description: "Displays details about your linked Spotify account.",
    usage: "/spotify profile",
    permission: "listener",
  },
  {
    name: "lastfm login",
    category: "integrations",
    description: "Connects your Last.fm username to scrobble voice playback in real time.",
    usage: "/lastfm login username:<string>",
    permission: "listener",
    options: [
      { name: "username", type: "string", required: true, description: "Your Last.fm account username" },
    ],
  },
  {
    name: "lastfm logout",
    category: "integrations",
    description: "Disconnects your Last.fm account from Flixo.",
    usage: "/lastfm logout",
    permission: "listener",
  },
  {
    name: "lastfm nowp",
    category: "integrations",
    description: "Generates an embed card with your current Last.fm playback information.",
    usage: "/lastfm nowp",
    permission: "listener",
  },
  {
    name: "lastfm profile",
    category: "integrations",
    description: "Displays your Last.fm scrobble count and recent listening statistics.",
    usage: "/lastfm profile",
    permission: "listener",
  },

  // --- Utilities & 24/7 ---
  {
    name: "247",
    category: "utility",
    description: "Toggles 24/7 channel lock so Flixo never leaves empty voice rooms.",
    usage: "/247",
    permission: "manager",
  },
  {
    name: "sleep",
    category: "utility",
    description: "Sets a timer to stop music playback and leave voice after specified minutes.",
    usage: "/sleep minutes:<number>",
    permission: "listener",
    options: [
      { name: "minutes", type: "number (1..720)", required: true, description: "Minutes until automatic disconnect" },
    ],
  },
  {
    name: "prefix",
    category: "utility",
    description: "Configures custom server-wide text command prefix.",
    usage: "/prefix [new_prefix:<string>]",
    permission: "manager",
    options: [
      { name: "new_prefix", type: "string (1..5)", required: false, description: "New prefix (e.g. ! or f!)" },
    ],
  },
  {
    name: "userprefix",
    category: "utility",
    description: "Configures personal private prefix for yourself across all servers.",
    usage: "/userprefix prefix:<string>",
    permission: "listener",
    options: [
      { name: "prefix", type: "string (1..5)", required: true, description: "Your private user prefix" },
    ],
  },
  {
    name: "fixvoice",
    category: "utility",
    description: "Re-establishes voice connection to a fresh Lavalink socket if audio is lagging.",
    usage: "/fixvoice",
    permission: "listener",
  },
  {
    name: "afk",
    category: "utility",
    description: "Sets your AFK status reason when mentioned in music channels.",
    usage: "/afk [reason:<string>]",
    permission: "listener",
    options: [
      { name: "reason", type: "string", required: false, description: "AFK message reason" },
    ],
  },
  {
    name: "afkdm",
    category: "utility",
    description: "Toggles whether Flixo DMs you when you are mentioned while AFK.",
    usage: "/afkdm",
    permission: "listener",
  },
  {
    name: "setsfx",
    category: "utility",
    description: "Toggles sound effects when tracks connect or disconnect.",
    usage: "/setsfx enabled:<true|false>",
    permission: "manager",
    options: [
      { name: "enabled", type: "boolean", required: true, description: "Enable or disable sound FX" },
    ],
  },
  {
    name: "setsource",
    category: "utility",
    description: "Sets the server's default audio source engine.",
    usage: "/setsource source:<youtube | spotify | soundcloud | ...>",
    permission: "manager",
    options: [
      { name: "source", type: "choice", required: true, description: "Default search platform" },
    ],
  },
  {
    name: "setup",
    category: "utility",
    description: "Creates a dedicated music channel with persistent song request controller.",
    usage: "/setup",
    permission: "manager",
  },
  {
    name: "language",
    category: "utility",
    description: "Sets bot UI language for server responses.",
    usage: "/language lang:<en | es | fr | de | ja | pt>",
    permission: "manager",
    options: [
      { name: "lang", type: "choice", required: true, description: "Language code" },
    ],
  },

  // --- Info ---
  {
    name: "help",
    category: "info",
    description: "Displays list of commands or detailed parameters for a command.",
    usage: "/help [command:<name>]",
    permission: "listener",
    options: [
      { name: "command", type: "string", required: false, description: "Command name to view details for" },
    ],
  },
  {
    name: "ping",
    category: "info",
    description: "Displays bot WebSocket heartbeat and Lavalink audio socket round-trip latency.",
    usage: "/ping",
    permission: "listener",
  },
  {
    name: "stats",
    category: "info",
    description: "Displays cluster memory usage, active voice players, and system load.",
    usage: "/stats",
    permission: "listener",
  },
  {
    name: "node",
    category: "info",
    description: "Displays connection status, memory, and uptime of connected Lavalink nodes.",
    usage: "/node",
    permission: "listener",
  },
  {
    name: "uptime",
    category: "info",
    description: "Displays uptime duration of current bot cluster.",
    usage: "/uptime",
    permission: "listener",
  },
  {
    name: "about",
    category: "info",
    description: "Information about Flixo architecture, Lavalink v4 engine, and team.",
    usage: "/about",
    permission: "listener",
  },
  {
    name: "invite",
    category: "info",
    description: "Provides official Discord OAuth2 invite link with needed scopes.",
    usage: "/invite",
    permission: "listener",
  },
  {
    name: "mystats",
    category: "info",
    description: "Displays your personal listening history and queued track counts.",
    usage: "/mystats",
    permission: "listener",
  },
  {
    name: "premium",
    category: "info",
    description: "Checks active server or user premium subscription expiration.",
    usage: "/premium",
    permission: "listener",
  },
  {
    name: "vote",
    category: "info",
    description: "Provides Top.gg voting link.",
    usage: "/vote",
    permission: "listener",
  },
  {
    name: "suggest",
    category: "info",
    description: "Submits feature suggestions directly to Flixo developers.",
    usage: "/suggest idea:<string>",
    permission: "listener",
    options: [
      { name: "idea", type: "string (10..500)", required: true, description: "Feature suggestion details" },
    ],
  },
  {
    name: "bug",
    category: "info",
    description: "Submits bug reports with reproduction steps directly to developers.",
    usage: "/bug report:<string>",
    permission: "listener",
    options: [
      { name: "report", type: "string (10..1000)", required: true, description: "Bug description" },
    ],
  },
  {
    name: "tos",
    category: "info",
    description: "Displays terms of service and privacy links.",
    usage: "/tos",
    permission: "listener",
  },

  // --- Admin ---
  {
    name: "admin customprofile",
    category: "admin",
    description: "Customizes bot embed color, bot avatar nickname in current server.",
    usage: "/admin customprofile [color:<hex>] [nickname:<string>]",
    permission: "manager",
    options: [
      { name: "color", type: "hex color", required: false, description: "Custom embed border hex" },
      { name: "nickname", type: "string", required: false, description: "Custom bot server nickname" },
    ],
  },
  {
    name: "admin ignore",
    category: "admin",
    description: "Configures channels where Flixo will ignore text commands.",
    usage: "/admin ignore channel:<channel>",
    permission: "manager",
    options: [
      { name: "channel", type: "channel", required: true, description: "Channel to ignore" },
    ],
  },
  {
    name: "blacklist",
    category: "admin",
    description: "Restricts abusive users from interacting with Flixo.",
    usage: "/blacklist user:<@user> reason:<string>",
    permission: "manager",
    options: [
      { name: "user", type: "user", required: true, description: "User to blacklist" },
      { name: "reason", type: "string", required: true, description: "Reason for blacklist" },
    ],
  },
  {
    name: "delinvites",
    category: "admin",
    description: "Deletes unauthorized bot invite links from the server.",
    usage: "/delinvites",
    permission: "manager",
  },
  {
    name: "deploy",
    category: "admin",
    description: "Forces a fresh registration of all Discord slash commands in current server.",
    usage: "/deploy",
    permission: "manager",
  },
];
