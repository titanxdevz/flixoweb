"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MusicNoteSticker, HeadphonesSticker, StarSticker, CatPawSticker } from "./StickerIcons";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Connecting to Lavalink v4 nodes...");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setLoading(false);
      return;
    }

    const messages = [
      "Connecting to Lavalink v4 nodes...",
      "Calibrating 14 live DSP filters...",
      "Tuning 384kbps lossless stream...",
      "Waking up Flixo Chan...",
      "Ready to play!",
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 18) + 12;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatusText(messages[4]);
        clearInterval(interval);

        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setLoading(false);
          }, 450);
        }, 300);
      } else {
        setProgress(currentProgress);
        const msgIdx = Math.min(
          Math.floor((currentProgress / 100) * (messages.length - 1)),
          messages.length - 2
        );
        setStatusText(messages[msgIdx]);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Flixo Music"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0E0919] px-4 transition-all duration-500 ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Decorative Polka Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating Badges */}
      <div className="relative">
        <div className="absolute -top-10 -left-12 rotate-[-14deg] animate-bounce">
          <HeadphonesSticker className="w-12 h-12" />
        </div>
        <div className="absolute -top-12 -right-10 rotate-[12deg] animate-pulse">
          <StarSticker className="w-11 h-11" />
        </div>
        <div className="absolute -bottom-6 -left-14 rotate-[16deg]">
          <CatPawSticker className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-8 -right-12 rotate-[-10deg] animate-bounce">
          <MusicNoteSticker className="w-12 h-12" />
        </div>

        {/* Mascot Centerpiece */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 filter drop-shadow-[6px_6px_0px_#000000] animate-mascot-spring select-none">
          <Image
            src="/flixo-sticker.png"
            alt="Flixo Chan Mascot Loading"
            fill
            priority
            sizes="208px"
            className="object-contain object-bottom pointer-events-none"
          />
        </div>
      </div>

      {/* Chunky Neo-Brutalist Loading Box */}
      <div className="relative z-10 mt-6 w-full max-w-sm bg-[#181026] border-[3.5px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-6 text-center">
        {/* Brand Display Wordmark */}
        <div className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-fredoka)] tracking-tight text-white mb-2">
          FLIXO
        </div>

        {/* Dynamic status line */}
        <div className="text-xs sm:text-sm font-bold text-[#FF5CAA] min-h-[22px] font-mono tracking-tight">
          {statusText}
        </div>

        {/* Chunky Progress Track */}
        <div className="mt-4 w-full h-5 bg-[#0E0919] border-[3px] border-[#000000] rounded-xl overflow-hidden p-0.5">
          <div
            className="h-full bg-[#FF5CAA] rounded-lg transition-all duration-150 ease-out border border-[#000000]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono font-bold text-[#DDD4EC]">
          <span className="uppercase text-[#8B5CF6]">384kbps Engine</span>
          <span className="text-white">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
