"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFilter, FilterType } from "@/context/FilterContext";

export default function AudioPlayerDemo() {
  const { activeFilter, setActiveFilter, isPlaying, setIsPlaying } = useFilter();
  const [volume, setVolume] = useState(0.7);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const pannerNodeRef = useRef<StereoPannerNode | null>(null);
  const pannerAnimRef = useRef<number | null>(null);
  const lfoAngleRef = useRef<number>(0);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAudio = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        masterGainRef.current = gainNode;

        const filterNode = ctx.createBiquadFilter();
        filterNode.type = "allpass";
        filterNodeRef.current = filterNode;

        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          pannerNodeRef.current = panner;
          filterNode.connect(panner);
          panner.connect(gainNode);
        } else {
          filterNode.connect(gainNode);
        }

        gainNode.connect(ctx.destination);
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      applyFilter(activeFilter);
      playSynthChords();
      setIsPlaying(true);
    } catch {
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    if (pannerAnimRef.current) {
      cancelAnimationFrame(pannerAnimRef.current);
      pannerAnimRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const playSynthChords = () => {
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);

    const chords = [
      [293.66, 369.99, 440.0, 554.37], // Dmaj9
      [277.18, 329.63, 392.0, 493.88], // C#m7
      [246.94, 293.66, 369.99, 440.0],  // Bm7
      [220.0, 277.18, 329.63, 440.0],   // Aadd9
    ];
    let step = 0;

    const playStep = () => {
      const ctx = audioCtxRef.current;
      const target = filterNodeRef.current;
      if (!ctx || !target) return;

      const chord = chords[step % chords.length];
      const pitchMultiplier =
        activeFilter === "nightcore" ? 1.35 : activeFilter === "vaporwave" ? 0.82 : 1.0;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq * pitchMultiplier, ctx.currentTime);

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

        osc.connect(noteGain);
        noteGain.connect(target);

        osc.start(now);
        osc.stop(now + 2.2);
      });

      step++;
    };

    playStep();
    const intervalTime =
      activeFilter === "nightcore" ? 1500 : activeFilter === "vaporwave" ? 2800 : 2100;
    loopIntervalRef.current = setInterval(playStep, intervalTime);
  };

  const applyFilter = (mode: FilterType) => {
    const ctx = audioCtxRef.current;
    const filter = filterNodeRef.current;
    if (!ctx || !filter) return;

    if (pannerAnimRef.current) {
      cancelAnimationFrame(pannerAnimRef.current);
      pannerAnimRef.current = null;
    }

    if (mode === "bassboost") {
      filter.type = "lowshelf";
      filter.frequency.setValueAtTime(110, ctx.currentTime);
      filter.gain.setValueAtTime(14, ctx.currentTime);
      if (pannerNodeRef.current) pannerNodeRef.current.pan.setValueAtTime(0, ctx.currentTime);
    } else if (mode === "vaporwave") {
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(950, ctx.currentTime);
      filter.gain.setValueAtTime(0, ctx.currentTime);
      if (pannerNodeRef.current) pannerNodeRef.current.pan.setValueAtTime(0, ctx.currentTime);
    } else if (mode === "8d") {
      filter.type = "allpass";
      const orbit = () => {
        lfoAngleRef.current += 0.035;
        if (pannerNodeRef.current && audioCtxRef.current) {
          pannerNodeRef.current.pan.setValueAtTime(
            Math.sin(lfoAngleRef.current),
            audioCtxRef.current.currentTime
          );
        }
        pannerAnimRef.current = requestAnimationFrame(orbit);
      };
      pannerAnimRef.current = requestAnimationFrame(orbit);
    } else {
      filter.type = "allpass";
      if (pannerNodeRef.current) pannerNodeRef.current.pan.setValueAtTime(0, ctx.currentTime);
    }

    if (isPlaying) {
      playSynthChords();
    }
  };

  const handleSelect = (mode: FilterType) => {
    setActiveFilter(mode);
    applyFilter(mode);
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const count = 30;
      const barWidth = canvas.width / count - 3;
      phase += isPlaying ? (activeFilter === "nightcore" ? 0.16 : 0.09) : 0.01;

      for (let i = 0; i < count; i++) {
        let height = 4;
        if (isPlaying) {
          const w = Math.sin(phase + i * 0.4);
          const mult = activeFilter === "bassboost" && i < 10 ? 2.0 : 1.0;
          height = Math.max(6, Math.abs(w) * (canvas.height - 10) * mult);
        }

        const x = i * (barWidth + 3);
        const y = canvas.height - height;

        ctx.fillStyle = activeFilter === "bassboost" ? "#FF5CAA" : "#8B5CF6";
        ctx.fillRect(x, y, barWidth, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeFilter]);

  useEffect(() => {
    return () => {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      if (pannerAnimRef.current) cancelAnimationFrame(pannerAnimRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <section id="demo" className="py-20 border-b-[3px] border-[#000000] bg-[#140C24]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-[#FF5CAA] border-[2.5px] border-[#000000] rounded-lg shadow-[3px_3px_0px_#000000] text-xs font-bold text-white mb-3 rotate-[1deg]">
              Interactive Audio Studio
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              Test the live audio filters.
            </h2>
            <p className="mt-3 text-base text-[#DDD4EC] font-medium max-w-xl">
              Click play to start the synthesizer, then press any oversized switch to hear the filter live and watch the mascot react!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => (isPlaying ? stopAudio() : startAudio())}
              className={`brutal-btn px-7 py-3.5 rounded-2xl text-base font-extrabold transition-all ${
                isPlaying
                  ? "bg-[#221636] text-white hover:bg-[#2C1D47]"
                  : "bg-[#FF5CAA] text-white hover:bg-[#F43F85]"
              }`}
            >
              {isPlaying ? "Pause audio" : "Play live audio test"}
            </button>
          </div>
        </div>

        {/* Master Sound Rack in Dark Plush Theme */}
        <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-6 sm:p-8">
          {/* Top metadata & visualizer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#000000]">
            <div>
              <div className="font-bold text-base text-white">
                Lossless Chord Sequence (Dmaj9 – C#m7 – Bm7)
              </div>
              <div className="text-xs text-[#A692C6] font-mono mt-0.5">
                Output: 384kbps lossless • Real-time DSP nodes
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="rack-volume" className="text-xs font-bold text-white">
                Volume
              </label>
              <input
                id="rack-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-28 accent-[#FF5CAA] cursor-pointer"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Chunky Canvas Visualizer */}
          <div className="my-6 h-20 bg-[#0E0919] border-[3px] border-[#000000] rounded-2xl p-2.5 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={640} height={64} className="w-full h-full" />
          </div>

          {/* Oversized Push Switches that push into their shadow */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#A692C6] mb-3">
              Select filter to activate:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {/* Flat */}
              <button
                type="button"
                onClick={() => handleSelect("flat")}
                className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer ${
                  activeFilter === "flat"
                    ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[3px] translate-y-[3px]"
                    : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44]"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Raw stream
                </div>
                <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-1">
                  Flat bypass
                </div>
                <div className="text-xs opacity-80 mt-1">Clean 384k</div>
              </button>

              {/* 8D Audio */}
              <button
                type="button"
                onClick={() => handleSelect("8d")}
                className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer ${
                  activeFilter === "8d"
                    ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[3px] translate-y-[3px]"
                    : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44]"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Headphones
                </div>
                <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-1">
                  8D spatial
                </div>
                <div className="text-xs opacity-80 mt-1">360° binaural pan</div>
              </button>

              {/* BassBoost */}
              <button
                type="button"
                onClick={() => handleSelect("bassboost")}
                className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer ${
                  activeFilter === "bassboost"
                    ? "bg-[#FF5CAA] text-white shadow-[2px_2px_0px_#000000] translate-x-[3px] translate-y-[3px]"
                    : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44]"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Low-shelf
                </div>
                <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-1">
                  BassBoost
                </div>
                <div className="text-xs opacity-80 mt-1">+14dB sub-bass</div>
              </button>

              {/* Nightcore */}
              <button
                type="button"
                onClick={() => handleSelect("nightcore")}
                className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer ${
                  activeFilter === "nightcore"
                    ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[3px] translate-y-[3px]"
                    : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44]"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Accelerated
                </div>
                <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-1">
                  Nightcore
                </div>
                <div className="text-xs opacity-80 mt-1">+35% pitch & tempo</div>
              </button>

              {/* Vaporwave */}
              <button
                type="button"
                onClick={() => handleSelect("vaporwave")}
                className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer ${
                  activeFilter === "vaporwave"
                    ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[3px] translate-y-[3px]"
                    : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44]"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Cassette
                </div>
                <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-1">
                  Vaporwave
                </div>
                <div className="text-xs opacity-80 mt-1">950Hz tape filter</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
