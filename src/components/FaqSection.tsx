"use client";

import React, { useState } from "react";

interface Faq {
  q: string;
  a: string;
}

const faqs: Faq[] = [
  {
    q: "How do I add Flixo to my server?",
    a: "Click 'Add to Discord' on this page, choose your server from the Discord authorize menu, and grant bot permissions. After that, join any voice channel and run /play with your favorite song or Spotify link.",
  },
  {
    q: "Are the 14 DSP audio filters really free?",
    a: "Yes! All 14 audio filters (including 8D audio, BassBoost, Nightcore, and Vaporwave) are available to every server with zero paywalls.",
  },
  {
    q: "How does the 8D audio filter work?",
    a: "Our Lavalink cluster calculates real-time binaural spatial panning using an LFO phase curve. When listening with stereo headphones, the audio feels like it rotates 360 degrees around your ears.",
  },
  {
    q: "How does 24/7 playback work?",
    a: "Join a voice channel and type /247. Flixo will remain connected permanently, even if everyone leaves the voice room.",
  },
  {
    q: "Can I connect Spotify and Last.fm?",
    a: "Yes. Use /spotify login to import your personal playlists, or /lastfm login to scrobble every song directly to your Last.fm profile.",
  },
  {
    q: "Can I use prefix commands instead of slash commands?",
    a: "Yes. Flixo supports server prefixes via /prefix, as well as private personal prefixes via /userprefix.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 border-b-[3px] border-[#000000] bg-[#140C24]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="inline-block px-3 py-1 bg-[#221636] border-[2.5px] border-[#000000] rounded-lg shadow-[3px_3px_0px_#000000] text-xs font-bold text-[#FF5CAA] mb-3 rotate-[-1deg]">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
            Frequently asked questions.
          </h2>
          <p className="mt-3 text-base text-[#DDD4EC] font-medium">
            Straight answers to common questions about Flixo.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-base sm:text-lg text-white hover:text-[#FF5CAA] transition-colors focus-visible:outline-[3px] focus-visible:outline-[#FF5CAA]"
                  aria-expanded={isOpen}
                >
                  <span className="font-[family-name:var(--font-fredoka)]">{faq.q}</span>
                  <span className="w-8 h-8 rounded-xl bg-[#281A40] border-[2px] border-[#000000] flex items-center justify-center font-mono font-black text-sm text-white shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#DDD4EC] font-medium leading-relaxed border-t-[2px] border-[#000000]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
