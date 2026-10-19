"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFilter, FilterType } from "@/context/FilterContext";

export default function AudioPlayerDemo() {
  const { activeFilter, setActiveFilter, isPlaying, setIsPlaying } = useFilter();
  const [volume, setVolume] = useState(0.75);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
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

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.85;
        analyserRef.current = analyser;

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

        gainNode.connect(analyser);
        analyser.connect(ctx.destination);
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
        noteGain.gain.exponentialRampToValueAtTime(0.09, now + 0.08);
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
      activeFilter === "nightcore" ? 1450 : activeFilter === "vaporwave" ? 2800 : 2100;
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
        lfoAngleRef.current += 0.038;
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

  // High-performance canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const peaks = new Array(36).fill(0);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barCount = 36;
      const gap = 4;
      const barWidth = (width - gap * (barCount - 1)) / barCount;

      phase += isPlaying ? (activeFilter === "nightcore" ? 0.22 : 0.12) : 0.03;

      let freqData: Uint8Array<ArrayBuffer> | null = null;
      if (isPlaying && analyserRef.current) {
        const binCount = analyserRef.current.frequencyBinCount;
        freqData = new Uint8Array(new ArrayBuffer(binCount));
        analyserRef.current.getByteFrequencyData(freqData);
      }

      // Draw subtle background grid lines
      ctx.strokeStyle = "rgba(139, 92, 246, 0.08)";
      ctx.lineWidth = 1;
      for (let y = 16; y < height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;

        if (isPlaying) {
          if (freqData && freqData.length > 0) {
            const dataIdx = Math.floor((i / barCount) * (freqData.length * 0.7));
            const rawVal = freqData[dataIdx] || 0;
            const norm = rawVal / 255;
            const mult = activeFilter === "bassboost" && i < 12 ? 1.6 : 1.0;
            barHeight = Math.max(6, norm * (height - 14) * mult);
          } else {
            const wave = Math.sin(phase + i * 0.35);
            const mult = activeFilter === "bassboost" && i < 12 ? 2.1 : 1.0;
            barHeight = Math.max(6, Math.abs(wave) * (height - 16) * mult);
          }
        } else {
          // Gentle ambient wave when idle
          barHeight = 5 + Math.sin(phase + i * 0.25) * 3;
        }

        // Peak drop physics
        if (barHeight > peaks[i]) {
          peaks[i] = barHeight;
        } else {
          peaks[i] = Math.max(4, peaks[i] - 1.2);
        }

        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Gradient fill for bars
        const grad = ctx.createLinearGradient(0, height, 0, y);
        if (activeFilter === "bassboost") {
          grad.addColorStop(0, "#FF5CAA");
          grad.addColorStop(1, "#FF85C0");
        } else if (activeFilter === "nightcore") {
          grad.addColorStop(0, "#7C3AED");
          grad.addColorStop(1, "#38BDF8");
        } else if (activeFilter === "vaporwave") {
          grad.addColorStop(0, "#8B5CF6");
          grad.addColorStop(1, "#EC4899");
        } else {
          grad.addColorStop(0, "#7C3AED");
          grad.addColorStop(1, "#A78BFA");
        }

        // Bar shape with 3px border
        ctx.fillStyle = grad;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();
        ctx.stroke();

        // Peak cap marker
        const peakY = height - peaks[i] - 3;
        ctx.fillStyle = activeFilter === "bassboost" ? "#FF5CAA" : "#FFFFFF";
        ctx.fillRect(x, peakY, barWidth, 2);
      }

      // Idle overlay message on canvas
      if (!isPlaying) {
        ctx.fillStyle = "#A692C6";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("● READY • PRESS PLAY TO START AUDIO TEST", width / 2, 22);
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

  const getMascotReactionText = () => {
    if (!isPlaying) return "Press play to start the DSP synthesizer!";
    switch (activeFilter) {
      case "8d":
        return "Binaural 360° orbit — Listen with headphones!";
      case "bassboost":
        return "+14dB sub-bass active — Feel the subwoofer!";
      case "nightcore":
        return "+35% pitch & tempo — Hyper kawaii speed!";
      case "vaporwave":
        return "950Hz tape cutoff — Chill aesthetic lo-fi.";
      default:
        return "Clean 384kbps lossless bypass — Studio direct.";
    }
  };

  return (
    <section id="demo" className="py-20 border-b-[3px] border-[#000000] bg-[#120B1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block px-3.5 py-1 bg-[#FF5CAA] border-[3px] border-[#000000] rounded-xl shadow-[3px_3px_0px_#000000] text-xs font-black text-white mb-3 rotate-[1deg] uppercase tracking-wider">
              Interactive Audio Studio
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              Test the live audio filters.
            </h2>
            <p className="mt-3 text-base text-[#DDD4EC] font-medium max-w-xl">
              Click play to start the synthesizer, then press any oversized switch to hear the filter live and watch the mascot react!
            </p>
          </div>

          {/* Quick Header CTA Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => (isPlaying ? stopAudio() : startAudio())}
              className={`brutal-btn px-7 py-3.5 rounded-2xl text-base font-extrabold transition-all border-[3px] border-[#000000] shadow-[5px_5px_0px_#000000] ${
                isPlaying
                  ? "bg-[#221636] text-white hover:bg-[#2C1D47]"
                  : "bg-[#FF5CAA] text-white hover:bg-[#F43F85]"
              }`}
            >
              {isPlaying ? "Pause audio" : "Play live audio test"}
            </button>
          </div>
        </div>

        {/* Master Sound Rack Console with Hardware Details */}
        <div className="relative bg-[#181026] border-[3.5px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-6 sm:p-8">
          {/* Hardware Corner Rivets */}
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full border border-[#000000] bg-[#2A1B44] flex items-center justify-center text-[8px] font-bold text-[#A692C6] select-none">+</div>
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full border border-[#000000] bg-[#2A1B44] flex items-center justify-center text-[8px] font-bold text-[#A692C6] select-none">+</div>
          <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full border border-[#000000] bg-[#2A1B44] flex items-center justify-center text-[8px] font-bold text-[#A692C6] select-none">+</div>
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full border border-[#000000] bg-[#2A1B44] flex items-center justify-center text-[8px] font-bold text-[#A692C6] select-none">+</div>

          {/* Console Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b-[3px] border-[#000000]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#7C3AED] text-white text-[10px] font-mono font-bold uppercase border border-[#000000]">
                  384kbps FLAC
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#221636] text-[#DDD4EC] text-[10px] font-mono font-bold uppercase border border-[#000000]">
                  Studio DSP Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-bold border border-[#000000]">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-[#10B981] animate-ping" : "bg-[#10B981]"}`} />
                  {isPlaying ? "DSP ONLINE" : "STANDBY"}
                </span>
              </div>

              <div className="font-extrabold text-lg text-white font-[family-name:var(--font-fredoka)] tracking-tight">
                Lossless Chord Sequence (Dmaj9 – C#m7 – Bm7)
              </div>
              <div className="text-xs text-[#A692C6] font-mono mt-0.5">
                Live lossless audio studio • 48.0 kHz sound output
              </div>
            </div>

            {/* Play/Pause Master Switch & Volume Slider */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Rack Master Button */}
              <button
                type="button"
                onClick={() => (isPlaying ? stopAudio() : startAudio())}
                className={`brutal-btn px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border-[2.5px] border-[#000000] shadow-[3px_3px_0px_#000000] ${
                  isPlaying
                    ? "bg-[#221636] text-white hover:bg-[#2A1B44]"
                    : "bg-[#FF5CAA] text-white hover:bg-[#F43F85]"
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span>Pause synth</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Play synth</span>
                  </>
                )}
              </button>

              {/* Volume Slider with percentage readout */}
              <div className="flex items-center gap-2 bg-[#120B1E] border-[2px] border-[#000000] rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#000000]">
                <svg className="w-4 h-4 text-[#A692C6] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <input
                  id="rack-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 sm:w-24 accent-[#FF5CAA] cursor-pointer"
                  aria-label="Volume slider"
                />
                <span className="text-[11px] font-mono font-bold text-white min-w-[28px] text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Chunky Canvas Visualizer Screen */}
          <div className="relative my-6 bg-[#0E0919] border-[3px] border-[#000000] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] rounded-2xl p-3 overflow-hidden">
            <div className="h-24 sm:h-28 w-full flex items-center justify-center">
              <canvas ref={canvasRef} width={800} height={110} className="w-full h-full" />
            </div>

            {/* Live Filter Telemetry Strip */}
            <div className="mt-2 pt-2 border-t border-[#23153A] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#A692C6]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase">Filter Mode:</span>
                <span className="text-[#FF5CAA] font-bold uppercase">{activeFilter}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Output: 384kbps</span>
                <span>Latency: ~2ms</span>
              </div>
            </div>
          </div>

          {/* Filter Selection Switches Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="text-xs font-black uppercase tracking-wider text-[#A692C6]">
              Select filter to activate:
            </div>

            {/* Live Mascot Status Callout */}
            <div className="inline-flex items-center gap-2 bg-[#221636] border-[2px] border-[#000000] rounded-xl px-3 py-1 shadow-[2px_2px_0px_#000000] text-xs font-bold text-[#DDD4EC]">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white border border-[#000000] shrink-0">
                <Image
                  src="/flixo-avatar.png"
                  alt="Flixo Chan mini avatar"
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
              <span className="text-white truncate">{getMascotReactionText()}</span>
            </div>
          </div>

          {/* Oversized Push Switches that physically sink into shadow when active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Flat Bypass */}
            <button
              type="button"
              onClick={() => handleSelect("flat")}
              className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer select-none relative overflow-hidden ${
                activeFilter === "flat"
                  ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[4px] translate-y-[4px] ring-2 ring-[#C4B5FD]"
                  : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#000000]/30 border border-[#000000]/40">
                  Raw stream
                </span>
                <span className={`w-2.5 h-2.5 rounded-full border border-[#000000] ${activeFilter === "flat" ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#4B3B66]"}`} />
              </div>

              <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-2">
                Flat bypass
              </div>
              <div className="text-xs opacity-80 mt-0.5 font-mono">Clean 384k direct</div>

              <div className="mt-3 pt-2 border-t border-[#000000]/20 text-[10px] font-mono text-[#DDD4EC] opacity-75">
                Bypass 20Hz – 20kHz
              </div>
            </button>

            {/* 8D Audio */}
            <button
              type="button"
              onClick={() => handleSelect("8d")}
              className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer select-none relative overflow-hidden ${
                activeFilter === "8d"
                  ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[4px] translate-y-[4px] ring-2 ring-[#C4B5FD]"
                  : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#000000]/30 border border-[#000000]/40">
                  Headphones
                </span>
                <span className={`w-2.5 h-2.5 rounded-full border border-[#000000] ${activeFilter === "8d" ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#4B3B66]"}`} />
              </div>

              <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-2">
                8D spatial
              </div>
              <div className="text-xs opacity-80 mt-0.5 font-mono">360° binaural pan</div>

              <div className="mt-3 pt-2 border-t border-[#000000]/20 text-[10px] font-mono text-[#DDD4EC] opacity-75">
                LFO orbit 0.25Hz
              </div>
            </button>

            {/* BassBoost */}
            <button
              type="button"
              onClick={() => handleSelect("bassboost")}
              className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer select-none relative overflow-hidden ${
                activeFilter === "bassboost"
                  ? "bg-[#FF5CAA] text-white shadow-[2px_2px_0px_#000000] translate-x-[4px] translate-y-[4px] ring-2 ring-white"
                  : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#000000]/30 border border-[#000000]/40">
                  Low-shelf
                </span>
                <span className={`w-2.5 h-2.5 rounded-full border border-[#000000] ${activeFilter === "bassboost" ? "bg-white shadow-[0_0_8px_#FFFFFF]" : "bg-[#4B3B66]"}`} />
              </div>

              <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-2">
                BassBoost
              </div>
              <div className="text-xs opacity-80 mt-0.5 font-mono">+14dB sub-bass</div>

              <div className="mt-3 pt-2 border-t border-[#000000]/20 text-[10px] font-mono text-[#DDD4EC] opacity-75">
                Sub-EQ 110Hz peak
              </div>
            </button>

            {/* Nightcore */}
            <button
              type="button"
              onClick={() => handleSelect("nightcore")}
              className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer select-none relative overflow-hidden ${
                activeFilter === "nightcore"
                  ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[4px] translate-y-[4px] ring-2 ring-[#C4B5FD]"
                  : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#000000]/30 border border-[#000000]/40">
                  Accelerated
                </span>
                <span className={`w-2.5 h-2.5 rounded-full border border-[#000000] ${activeFilter === "nightcore" ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#4B3B66]"}`} />
              </div>

              <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-2">
                Nightcore
              </div>
              <div className="text-xs opacity-80 mt-0.5 font-mono">+35% pitch & speed</div>

              <div className="mt-3 pt-2 border-t border-[#000000]/20 text-[10px] font-mono text-[#DDD4EC] opacity-75">
                1.35x timescale
              </div>
            </button>

            {/* Vaporwave */}
            <button
              type="button"
              onClick={() => handleSelect("vaporwave")}
              className={`p-4 rounded-2xl border-[3px] border-[#000000] text-left transition-all cursor-pointer select-none relative overflow-hidden ${
                activeFilter === "vaporwave"
                  ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[4px] translate-y-[4px] ring-2 ring-[#C4B5FD]"
                  : "bg-[#221636] text-[#DDD4EC] shadow-[6px_6px_0px_#000000] hover:bg-[#2A1B44] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#000000]/30 border border-[#000000]/40">
                  Cassette
                </span>
                <span className={`w-2.5 h-2.5 rounded-full border border-[#000000] ${activeFilter === "vaporwave" ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#4B3B66]"}`} />
              </div>

              <div className="text-lg font-black font-[family-name:var(--font-fredoka)] mt-2">
                Vaporwave
              </div>
              <div className="text-xs opacity-80 mt-0.5 font-mono">950Hz tape filter</div>

              <div className="mt-3 pt-2 border-t border-[#000000]/20 text-[10px] font-mono text-[#DDD4EC] opacity-75">
                0.82x lo-fi cutoff
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
