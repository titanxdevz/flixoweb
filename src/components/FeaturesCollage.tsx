import React from "react";

export default function FeaturesCollage() {
  return (
    <section id="features" className="py-24 border-b-[3px] border-[#000000] bg-[#0E0919] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <div className="inline-block px-3 py-1 bg-[#7C3AED] border-[2.5px] border-[#000000] rounded-lg shadow-[3px_3px_0px_#000000] text-xs font-bold text-white mb-3 rotate-[-1deg]">
            Real Features Only
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
            Built for Discord servers that care about audio.
          </h2>
          <p className="mt-3 text-base text-[#DDD4EC] font-medium">
            Every feature is verified in the bot codebase and available to all servers without monthly tiers.
          </p>
        </div>

        {/* Collage of different-sized sticker panels alternating 1-2 degrees tilt */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Panel 1: Large primary sticker */}
          <div className="md:col-span-7 bg-[#181026] border-[3px] border-[#000000] shadow-[7px_7px_0px_#000000] rounded-3xl p-7 rotate-[-1deg] hover:rotate-0 transition-transform">
            <div className="inline-block px-2.5 py-1 bg-[#281A40] border-[2px] border-[#000000] rounded-md text-xs font-black text-[#FF5CAA] mb-4">
              Lavalink v4 • 384kbps
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
              Lossless 384kbps audio streaming
            </h3>
            <p className="mt-3 text-sm text-[#DDD4EC] leading-relaxed font-medium">
              Audio is decoded through dedicated Lavalink v4 nodes at Discord&apos;s maximum supported voice bitrate. No lossy transcoding, no bit crushing, and no artificial quality downgrades.
            </p>
          </div>

          {/* Panel 2: Accent pink sticker */}
          <div className="md:col-span-5 bg-[#FF5CAA] text-white border-[3px] border-[#000000] shadow-[7px_7px_0px_#000000] rounded-3xl p-7 rotate-[1.5deg] hover:rotate-0 transition-transform">
            <div className="inline-block px-2.5 py-1 bg-white border-[2px] border-[#000000] rounded-md text-xs font-black text-[#1E0B3A] mb-4">
              Free For Everyone
            </div>
            <h3 className="text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
              14 live DSP filters
            </h3>
            <p className="mt-3 text-sm text-white/95 leading-relaxed font-medium">
              Run /filter 8d, bassboost, nightcore, vaporwave, karaoke, pitch, speed, or tremolo without a subscription. All audio processing runs server-side on low-latency audio threads.
            </p>
          </div>

          {/* Panel 3: Spotify & Last.fm panel */}
          <div className="md:col-span-4 bg-[#221636] border-[3px] border-[#000000] shadow-[7px_7px_0px_#000000] rounded-3xl p-7 rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <div className="inline-block px-2.5 py-1 bg-[#181026] border-[2px] border-[#000000] rounded-md text-xs font-black text-[#C4B5FD] mb-4">
              OAuth2 Integrations
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
              Spotify &amp; Last.fm sync
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[#DDD4EC] leading-relaxed font-medium">
              Use /spotify login to queue personal playlists directly, and /lastfm login to scrobble your listening history automatically.
            </p>
          </div>

          {/* Panel 4: 24/7 Channel Lock */}
          <div className="md:col-span-4 bg-[#181026] border-[3px] border-[#000000] shadow-[7px_7px_0px_#000000] rounded-3xl p-7 rotate-[1deg] hover:rotate-0 transition-transform">
            <div className="inline-block px-2.5 py-1 bg-[#7C3AED] border-[2px] border-[#000000] rounded-md text-xs font-black text-white mb-4">
              Permanent Voice Stay
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
              24/7 channel mode
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[#DDD4EC] leading-relaxed font-medium">
              Run /247 to lock Flixo into your voice room. Perfect for around-the-clock study lounges and lofi stations, even when empty.
            </p>
          </div>

          {/* Panel 5: Unlimited Queues & Cloud Playlists */}
          <div className="md:col-span-4 bg-[#221636] border-[3px] border-[#000000] shadow-[7px_7px_0px_#000000] rounded-3xl p-7 rotate-[-2deg] hover:rotate-0 transition-transform">
            <div className="inline-block px-2.5 py-1 bg-[#FF5CAA] border-[2px] border-[#000000] rounded-md text-xs font-black text-white mb-4">
              No Artificial Limits
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
              Unlimited queue &amp; playlists
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[#DDD4EC] leading-relaxed font-medium">
              No 15-track queue caps. Save custom server playlists with /playlist create, or copy community playlists with /playlist steal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
