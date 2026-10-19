"use client";

import React, { useEffect, useState } from "react";

interface AudioMeterVUProps {
  isPlaying: boolean;
  isPaused: boolean;
  volume: number; // 0..200
}

export default function AudioMeterVU({ isPlaying, isPaused, volume }: AudioMeterVUProps) {
  const [levelL, setLevelL] = useState(0);
  const [levelR, setLevelR] = useState(0);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      setLevelL(0);
      setLevelR(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate hardware VU meter needle bounce proportional to master volume
      const baseGain = Math.min(1.0, volume / 100);
      const randomJitter = Math.random() * 0.25;
      const left = Math.min(100, Math.max(0, Math.round((0.55 + randomJitter) * baseGain * 100)));
      const right = Math.min(100, Math.max(0, Math.round((0.52 + Math.random() * 0.28) * baseGain * 100)));
      setLevelL(left);
      setLevelR(right);
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, volume]);

  const segments = 16;

  return (
    <div className="bg-[#121017] border-[3px] border-black rounded-2xl p-3 shadow-[4px_4px_0px_#000000] flex flex-col gap-2">
      <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#8E849E] uppercase">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPlaying && !isPaused ? "bg-[#7CE38B] animate-pulse" : "bg-[#453B55]"
            }`}
          />
          PEAK LEVEL // STEREO VU
        </span>
        <span className="text-[#FFB020] tabular-nums">
          {isPlaying && !isPaused ? `${Math.round((volume - 100) / 10)} dB` : "-INF dB"}
        </span>
      </div>

      {/* Meter Bar Left */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-[#8E849E] w-3">L</span>
        <div className="flex-1 grid grid-cols-16 gap-0.5 bg-[#09070D] p-1 rounded-md border border-[#2B2338]">
          {Array.from({ length: segments }).map((_, i) => {
            const pct = ((i + 1) / segments) * 100;
            const active = levelL >= pct;
            const isRed = i >= 13;
            const isAmber = i >= 10 && i < 13;
            const colorClass = isRed
              ? active
                ? "bg-[#FF5CAA] shadow-[0_0_6px_#FF5CAA]"
                : "bg-[#3D1426]"
              : isAmber
              ? active
                ? "bg-[#FFB020] shadow-[0_0_6px_#FFB020]"
                : "bg-[#3D2C10]"
              : active
              ? "bg-[#7CE38B] shadow-[0_0_6px_#7CE38B]"
              : "bg-[#142B1B]";
            return (
              <div
                key={i}
                className={`h-3 rounded-[1px] transition-colors duration-75 ${colorClass}`}
              />
            );
          })}
        </div>
      </div>

      {/* Meter Bar Right */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-[#8E849E] w-3">R</span>
        <div className="flex-1 grid grid-cols-16 gap-0.5 bg-[#09070D] p-1 rounded-md border border-[#2B2338]">
          {Array.from({ length: segments }).map((_, i) => {
            const pct = ((i + 1) / segments) * 100;
            const active = levelR >= pct;
            const isRed = i >= 13;
            const isAmber = i >= 10 && i < 13;
            const colorClass = isRed
              ? active
                ? "bg-[#FF5CAA] shadow-[0_0_6px_#FF5CAA]"
                : "bg-[#3D1426]"
              : isAmber
              ? active
                ? "bg-[#FFB020] shadow-[0_0_6px_#FFB020]"
                : "bg-[#3D2C10]"
              : active
              ? "bg-[#7CE38B] shadow-[0_0_6px_#7CE38B]"
              : "bg-[#142B1B]";
            return (
              <div
                key={i}
                className={`h-3 rounded-[1px] transition-colors duration-75 ${colorClass}`}
              />
            );
          })}
        </div>
      </div>

      {/* dB Markings */}
      <div className="flex justify-between px-5 text-[8px] font-mono text-[#655A75] font-semibold">
        <span>-24</span>
        <span>-18</span>
        <span>-12</span>
        <span>-6</span>
        <span>0</span>
        <span className="text-[#FF5CAA]">+3dB</span>
      </div>
    </div>
  );
}
