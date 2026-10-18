import React from "react";
import Link from "next/link";

const teaserCommands = [
  {
    name: "play",
    syntax: "/play query:<song | url>",
    desc: "Streams tracks or playlists from Spotify, SoundCloud, or direct audio link.",
    badge: "Playback",
  },
  {
    name: "filter 8d",
    syntax: "/filter 8d",
    desc: "Rotates stereo sound 360 degrees around your headphones in real time.",
    badge: "DSP Filter",
  },
  {
    name: "playlist create",
    syntax: "/playlist create name:<string>",
    desc: "Saves custom multi-source playlists directly to your Discord account.",
    badge: "Playlist",
  },
  {
    name: "247",
    syntax: "/247",
    desc: "Locks the bot permanently into your voice room for 24/7 continuous music.",
    badge: "Utility",
  },
];

export default function CommandTeaser() {
  return (
    <section className="py-20 border-b-[3px] border-[#000000] bg-[#140C24]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-[#221636] border-[2.5px] border-[#000000] rounded-lg shadow-[3px_3px_0px_#000000] text-xs font-bold text-[#FF5CAA] mb-3 rotate-[-1deg]">
              Command Preview
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              Simple slash commands.
            </h2>
            <p className="mt-2 text-base text-[#DDD4EC] font-medium">
              Native Discord auto-completion with per-server or per-user prefix support.
            </p>
          </div>

          <Link
            href="/commands"
            className="brutal-btn px-6 py-3 bg-[#7C3AED] text-white rounded-2xl text-sm font-extrabold hover:bg-[#6D28D9] shrink-0"
          >
            Explore all 45+ commands
          </Link>
        </div>

        {/* 4 Command Teaser Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teaserCommands.map((cmd) => (
            <div
              key={cmd.name}
              className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-base text-white">
                    /{cmd.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#221636] text-[#FF5CAA] border border-[#000000]">
                    {cmd.badge}
                  </span>
                </div>
                <p className="text-xs text-[#DDD4EC] font-medium leading-relaxed mb-4">
                  {cmd.desc}
                </p>
              </div>

              <div className="pt-3 border-t-[2px] border-[#000000]">
                <code className="block text-[11px] font-mono text-[#C4B5FD] bg-[#0E0919] px-2 py-1 rounded truncate border border-[#000000]">
                  {cmd.syntax}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
