import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#090512] text-white pt-20 pb-12 overflow-hidden border-t-[3px] border-[#000000]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Callout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-16 border-b-[2px] border-[#221636]">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-fredoka)]">
              Ready for better Discord audio?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#DDD4EC] font-medium">
              Join servers streaming 384kbps lossless sound with zero queue limits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn px-6 py-3.5 bg-[#FF5CAA] text-white rounded-2xl text-sm font-extrabold hover:bg-[#F43F85] border-[3px] border-[#000000] shadow-[4px_4px_0px_#000000]"
            >
              Add to Discord
            </a>
            <a
              href={siteConfig.discordSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn px-5 py-3 bg-[#7C3AED] text-white rounded-2xl text-sm font-extrabold hover:bg-[#6D28D9] border-[3px] border-[#000000] shadow-[4px_4px_0px_#000000]"
            >
              Support server
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b-[2px] border-[#221636] text-xs">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-white border-[2px] border-[#000000]">
                <Image
                  src="/flixo-avatar.png"
                  alt="Flixo logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-base text-white font-[family-name:var(--font-fredoka)]">
                Flixo
              </span>
            </div>
            <p className="text-[#A692C6] leading-relaxed">
              384kbps lossless Discord music bot powered by Lavalink v4. Clustered audio nodes with zero queue limits.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Product
            </div>
            <ul className="space-y-1.5 text-[#DDD4EC]">
              {siteConfig.footerLinks.product.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#FF5CAA] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Community
            </div>
            <ul className="space-y-1.5 text-[#DDD4EC]">
              {siteConfig.footerLinks.community.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FF5CAA] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Legal
            </div>
            <ul className="space-y-1.5 text-[#DDD4EC]">
              {siteConfig.footerLinks.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#FF5CAA] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big Wordmark with Mascot Peeking */}
        <div className="relative pt-12 pb-6 flex flex-col items-center justify-center select-none overflow-hidden">
          <div className="text-7xl sm:text-[140px] md:text-[180px] font-black tracking-tight text-[#23153A] font-[family-name:var(--font-fredoka)] leading-none text-center">
            FLIXO
          </div>

          {/* Mascot Peeking from bottom edge */}
          <div className="absolute -bottom-6 w-44 h-44 sm:w-56 sm:h-56 filter drop-shadow-[5px_5px_0px_#000000]">
            <Image
              src="/flixo-sticker.png"
              alt="Flixo mascot peeking"
              fill
              className="object-contain object-bottom pointer-events-none"
              sizes="224px"
            />
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t-[2px] border-[#221636] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A692C6] font-medium gap-3">
          <p>© {currentYear} Flixo Music. Not affiliated with Discord Inc. or Spotify AB.</p>
          <p>Studio-grade 384kbps lossless audio streaming for Discord.</p>
        </div>
      </div>
    </footer>
  );
}
