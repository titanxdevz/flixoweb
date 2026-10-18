import React from "react";

interface ComparisonRow {
  feature: string;
  flixo: string;
  typicalBots: string;
}

const rows: ComparisonRow[] = [
  {
    feature: "Audio bitrate",
    flixo: "384 kbps lossless",
    typicalBots: "96 to 128 kbps lossy",
  },
  {
    feature: "Hardware DSP filters (8D, BassBoost)",
    flixo: "14 filters included free",
    typicalBots: "Locked behind subscriptions",
  },
  {
    feature: "Queue capacity",
    flixo: "Unlimited tracks",
    typicalBots: "Capped at 15–25 songs",
  },
  {
    feature: "Spotify & Last.fm sync",
    flixo: "Built-in OAuth2 scrobbler",
    typicalBots: "Not supported",
  },
  {
    feature: "24/7 channel stay (/247)",
    flixo: "Free for all servers",
    typicalBots: "$4.99/mo premium perk",
  },
  {
    feature: "Audio backend",
    flixo: "Lavalink v4 clustered nodes",
    typicalBots: "Single node or unmanaged ffmpeg",
  },
];

export default function ComparisonTable() {
  return (
    <section id="comparison" className="py-20 border-b-[3px] border-[#000000] bg-[#0E0919]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="inline-block px-3 py-1 bg-[#FF5CAA] border-[2.5px] border-[#000000] rounded-lg shadow-[3px_3px_0px_#000000] text-xs font-bold text-white mb-3 rotate-[1deg]">
            Honest Comparison
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
            Flixo compared to typical bots.
          </h2>
          <p className="mt-3 text-base text-[#DDD4EC] font-medium">
            No paywalled queues or hidden audio throttles.
          </p>
        </div>

        {/* Chunky Dark Table Box */}
        <div className="overflow-x-auto border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl bg-[#181026]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b-[3px] border-[#000000] bg-[#221636] text-white">
                <th scope="col" className="py-4 px-6 font-extrabold text-sm sm:text-base w-1/2">
                  Feature
                </th>
                <th scope="col" className="py-4 px-6 font-extrabold text-sm sm:text-base text-[#C4B5FD] bg-[#2A1B44] border-x-[3px] border-[#000000] w-1/4">
                  Flixo
                </th>
                <th scope="col" className="py-4 px-6 font-extrabold text-sm sm:text-base text-[#A692C6] w-1/4">
                  Typical bots
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-[2px] divide-[#000000]">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-[#201433] transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    {r.feature}
                  </td>
                  <td className="py-4 px-6 font-black text-[#C4B5FD] bg-[#25183D] border-x-[3px] border-[#000000]">
                    {r.flixo}
                  </td>
                  <td className="py-4 px-6 font-medium text-[#DDD4EC]/80">
                    {r.typicalBots}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
