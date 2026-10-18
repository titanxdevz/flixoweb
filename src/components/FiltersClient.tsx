"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allFilters, DspFilterInfo } from "@/lib/data/filters";
import Link from "next/link";

export default function FiltersPage() {
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const pannerNodeRef = useRef<StereoPannerNode | null>(null);
  const pannerAnimRef = useRef<number | null>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lfoAngleRef = useRef<number>(0);

  const startFilterAudio = (filter: DspFilterInfo) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.7, ctx.currentTime);

        const biquad = ctx.createBiquadFilter();
        biquad.type = "allpass";
        filterNodeRef.current = biquad;

        if (ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          pannerNodeRef.current = panner;
          biquad.connect(panner);
          panner.connect(masterGain);
        } else {
          biquad.connect(masterGain);
        }

        masterGain.connect(ctx.destination);
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (pannerAnimRef.current) {
        cancelAnimationFrame(pannerAnimRef.current);
        pannerAnimRef.current = null;
      }
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }

      const biquad = filterNodeRef.current;
      if (!biquad) return;

      let pitchMultiplier = 1.0;
      let intervalMs = 2000;

      if (filter.id === "bassboost") {
        biquad.type = "lowshelf";
        biquad.frequency.setValueAtTime(110, ctx.currentTime);
        biquad.gain.setValueAtTime(14, ctx.currentTime);
      } else if (filter.id === "vaporwave") {
        biquad.type = "lowpass";
        biquad.frequency.setValueAtTime(900, ctx.currentTime);
        pitchMultiplier = 0.85;
        intervalMs = 2600;
      } else if (filter.id === "nightcore") {
        biquad.type = "allpass";
        pitchMultiplier = 1.35;
        intervalMs = 1500;
      } else if (filter.id === "pitch") {
        biquad.type = "allpass";
        pitchMultiplier = 1.25;
      } else if (filter.id === "speed") {
        biquad.type = "allpass";
        intervalMs = 1400;
      } else if (filter.id === "lowpass") {
        biquad.type = "lowpass";
        biquad.frequency.setValueAtTime(1200, ctx.currentTime);
      } else if (filter.id === "8d") {
        biquad.type = "allpass";
        const orbit = () => {
          lfoAngleRef.current += 0.04;
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
        biquad.type = "allpass";
        if (pannerNodeRef.current) pannerNodeRef.current.pan.setValueAtTime(0, ctx.currentTime);
      }

      const chords = [
        [293.66, 369.99, 440.0, 554.37],
        [277.18, 329.63, 392.0, 493.88],
        [246.94, 293.66, 369.99, 440.0],
      ];
      let step = 0;

      const triggerChord = () => {
        const chord = chords[step % chords.length];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = idx === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq * pitchMultiplier, ctx.currentTime);

          const now = ctx.currentTime;
          noteGain.gain.setValueAtTime(0.0001, now);
          noteGain.gain.exponentialRampToValueAtTime(0.07, now + 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

          osc.connect(noteGain);
          noteGain.connect(biquad);

          osc.start(now);
          osc.stop(now + 1.9);
        });
        step++;
      };

      triggerChord();
      loopIntervalRef.current = setInterval(triggerChord, intervalMs);
      setActiveTestId(filter.id);
    } catch {
      setActiveTestId(filter.id);
    }
  };

  const stopFilterAudio = () => {
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    if (pannerAnimRef.current) cancelAnimationFrame(pannerAnimRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
    setActiveTestId(null);
  };

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  useEffect(() => {
    return () => {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      if (pannerAnimRef.current) cancelAnimationFrame(pannerAnimRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0919] text-white">
      <Navbar />

      <main className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#FF5CAA] hover:underline mb-3"
            >
              ← Back to home
            </Link>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              Hardware DSP audio filters.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              Flixo includes 14 hardware-accelerated audio filters processed on the Lavalink engine. Filter mutations run with low latency and without client-side lag. Test interactive filters directly in your browser below.
            </p>
          </div>

          {/* Filters List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFilters.map((filter) => {
              const isTesting = activeTestId === filter.id;

              return (
                <div
                  key={filter.id}
                  className={`border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6 flex flex-col justify-between transition-all ${
                    isTesting ? "bg-[#25173D]" : "bg-[#181026]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#221636] text-[#FF5CAA] border border-[#000000]">
                        {filter.category}
                      </span>
                      <code className="text-xs font-mono font-bold text-[#C4B5FD] bg-[#0E0919] px-2 py-0.5 rounded border border-[#000000]">
                        preset: {filter.preset}
                      </code>
                    </div>

                    <h2 className="text-2xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
                      {filter.name}
                    </h2>

                    <p className="mt-3 text-sm text-[#DDD4EC] font-medium leading-relaxed">
                      {filter.description}
                    </p>

                    <div className="mt-4 p-3 bg-[#120B1E] border border-[#000000] rounded-xl text-xs text-[#A692C6] font-mono leading-relaxed">
                      <strong>Processing:</strong> {filter.technicalDetails}
                    </div>

                    {filter.parameters && (
                      <div className="mt-3 text-xs text-[#DDD4EC] font-mono">
                        <span className="text-[#FF5CAA] font-bold">Values:</span> {filter.parameters}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t-[2px] border-[#000000] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => copyCommand(filter.command, filter.id)}
                      className="brutal-btn px-3 py-1.5 bg-[#221636] text-white rounded-lg text-xs font-black shadow-[3px_3px_0px_#000000] hover:bg-[#2A1B44]"
                      aria-label={`Copy command ${filter.command}`}
                    >
                      {copiedId === filter.id ? "Copied" : filter.command}
                    </button>

                    {filter.supportedInBrowserDemo ? (
                      <button
                        type="button"
                        onClick={() =>
                          isTesting ? stopFilterAudio() : startFilterAudio(filter)
                        }
                        className={`brutal-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isTesting
                            ? "bg-[#FF5CAA] text-white shadow-[2px_2px_0px_#000000] translate-x-[2px] translate-y-[2px]"
                            : "bg-[#7C3AED] text-white shadow-[3px_3px_0px_#000000] hover:bg-[#6D28D9]"
                        }`}
                      >
                        {isTesting ? "Stop audio" : "Play sound preview"}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#A692C6] font-mono">
                        Discord voice only
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
