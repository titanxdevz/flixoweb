"use client";

import React, { useState } from "react";
import { FilterPreset, ActiveFiltersState } from "@/types/dashboard";
import { Sliders, RotateCcw, Zap } from "lucide-react";

interface FilterMatrixProps {
  filters: ActiveFiltersState;
  onApplyFilter: (preset: FilterPreset) => void;
}

const PRESETS = [
  { id: "bassboost_low", label: "Bass Low", group: "bass", desc: "+6dB sub harmonic" },
  { id: "bassboost_medium", label: "Bass Med", group: "bass", desc: "+12dB punch" },
  { id: "bassboost_high", label: "Bass High", group: "bass", desc: "+18dB max kick" },
  { id: "nightcore", label: "Nightcore", desc: "1.25x speed + high pitch" },
  { id: "vaporwave", label: "Vaporwave", desc: "0.85x speed + deep reverb" },
  { id: "8d", label: "8D Audio", desc: "Binaural spatial rotation" },
  { id: "tremolo", label: "Tremolo", desc: "Rapid volume modulation" },
  { id: "vibrato", label: "Vibrato", desc: "Pitch frequency oscillation" },
  { id: "rotation", label: "Rotation", desc: "Stereo panning orbit" },
  { id: "karaoke", label: "Karaoke", desc: "Center vocal frequency null" },
  { id: "lowpass", label: "Lowpass", desc: "Attenuate highs above 1kHz" },
  { id: "highpass", label: "Highpass", desc: "Cut lows below 500Hz" },
];

export default function FilterMatrix({ filters, onApplyFilter }: FilterMatrixProps) {
  const [speedVal, setSpeedVal] = useState<number>(filters.speed || 1.0);
  const [pitchVal, setPitchVal] = useState<number>(filters.pitch || 1.0);

  const isFilterActive = (name: string): boolean => {
    if (name.startsWith("bassboost_")) {
      return filters.active.includes("bassboost");
    }
    return filters.active.includes(name);
  };

  const handleToggle = (id: string) => {
    if (id === "bassboost_low") {
      onApplyFilter({ preset: "bassboost", level: "low" });
    } else if (id === "bassboost_medium") {
      onApplyFilter({ preset: "bassboost", level: "medium" });
    } else if (id === "bassboost_high") {
      onApplyFilter({ preset: "bassboost", level: "high" });
    } else {
      onApplyFilter({
        preset: id as
          | "nightcore"
          | "8d"
          | "tremolo"
          | "vibrato"
          | "rotation"
          | "karaoke"
          | "lowpass"
          | "highpass"
          | "vaporwave",
      });
    }
  };

  return (
    <div className="bg-[#14111A] border-[3px] border-[#000000] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#000000] flex flex-col gap-4">
      {/* Rackmount Faceplate Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#261E33]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#20182C] border border-black rounded-lg text-[#FFB020]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#A89CB8] uppercase">
              DSP FILTER MATRIX // LAVALINK V4 DSP
            </h3>
            <p className="text-[11px] font-mono text-[#DDD4EC]">
              <span className="text-[#7CE38B] font-bold tabular-nums">
                {filters.active.length}
              </span>{" "}
              hardware modules engaged
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onApplyFilter({ preset: "off" });
            setSpeedVal(1.0);
            setPitchVal(1.0);
          }}
          disabled={filters.active.length === 0 && (!filters.speed || filters.speed === 1.0) && (!filters.pitch || filters.pitch === 1.0)}
          className="brutal-btn px-2.5 py-1 bg-[#231A33] hover:bg-[#322547] disabled:opacity-40 text-xs font-mono text-white rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          <span>BYPASS ALL</span>
        </button>
      </div>

      {/* Preset toggles grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {PRESETS.map((p) => {
          const active = isFilterActive(p.id);
          return (
            <button
              key={p.id}
              onClick={() => handleToggle(p.id)}
              className={`text-left p-2.5 rounded-xl border-2 transition-all select-none flex flex-col justify-between h-20 ${
                active
                  ? "bg-[#251A38] border-[#FFB020] shadow-[3px_3px_0px_#000000] translate-y-[-1px]"
                  : "bg-[#181321] border-black hover:border-[#3D3053] shadow-[2px_2px_0px_#000000]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-white tracking-wide font-mono">
                  {p.label}
                </span>
                <span
                  className={`w-2 h-2 rounded-full border border-black ${
                    active ? "bg-[#FFB020] shadow-[0_0_8px_#FFB020]" : "bg-[#2A2338]"
                  }`}
                />
              </div>
              <p className="text-[10px] text-[#8E849E] line-clamp-1 font-mono">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Continuous Speed & Pitch Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t-2 border-[#261E33]">
        {/* Speed Slider */}
        <div className="bg-[#100D15] p-3 rounded-xl border-2 border-black flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-[#A89CB8] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#FFB020]" />
              TEMPO / SPEED
            </span>
            <span className="text-[#FFB020] tabular-nums">{speedVal.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={speedVal}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSpeedVal(val);
              onApplyFilter({ preset: "speed", value: val });
            }}
            className="w-full accent-[#FFB020] cursor-pointer"
          />
        </div>

        {/* Pitch Slider */}
        <div className="bg-[#100D15] p-3 rounded-xl border-2 border-black flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-[#A89CB8] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#FF5CAA]" />
              PITCH SCALE
            </span>
            <span className="text-[#FF5CAA] tabular-nums">{pitchVal.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={pitchVal}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setPitchVal(val);
              onApplyFilter({ preset: "pitch", value: val });
            }}
            className="w-full accent-[#FF5CAA] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
