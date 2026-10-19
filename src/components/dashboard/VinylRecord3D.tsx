"use client";

/* 
 * The tempo/spin is faked — no audio is streamed to the browser, 
 * so the rotation is driven by playback state, not the actual waveform. 
 */

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";

interface VinylRecord3DProps {
  isPlaying: boolean;
  isPaused: boolean;
  artworkUrl?: string | null;
  trackTitle?: string;
  artistName?: string;
}

function DiscMesh({ isPlaying, isPaused }: { isPlaying: boolean; isPaused: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const targetSpeed = useRef(0);
  const currentSpeed = useRef(0);

  useFrame((_, delta) => {
    // The tempo/spin is faked — no audio is streamed to the browser,
    // so the rotation is driven by playback state, not the actual waveform.
    targetSpeed.current = isPlaying && !isPaused ? 2.5 : 0;
    // Smooth deceleration / acceleration
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed.current, delta * 3);

    if (meshRef.current && currentSpeed.current > 0.001) {
      meshRef.current.rotation.z -= currentSpeed.current * delta;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Vinyl body (dark obsidian with grooved sheen) */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.8, 2.8, 0.08, 64]} />
        <meshStandardMaterial
          color="#100E14"
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* Outer rim lip */}
      <mesh position={[0, 0.045, 0]}>
        <ringGeometry args={[2.7, 2.78, 64]} />
        <meshStandardMaterial color="#26232E" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Micro-grooves concentric rings */}
      {[2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.3].map((r, i) => (
        <mesh key={i} position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.04, r, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#1C1924" : "#0D0B10"}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Center label (Amber studio aesthetic from api.md §9) */}
      <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 48]} />
        <meshStandardMaterial
          color="#FFB020"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Inner spindle ring */}
      <mesh position={[0, 0.048, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.35, 32]} />
        <meshStandardMaterial color="#0A080F" roughness={0.6} />
      </mesh>

      {/* Center spindle hole */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

export default function VinylRecord3D({
  isPlaying,
  isPaused,
  artworkUrl,
  trackTitle = "No Track Selected",
  artistName = "Flixo Studio Player",
}: VinylRecord3DProps) {
  return (
    <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] mx-auto rounded-3xl bg-[#141219] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] overflow-hidden flex flex-col items-center justify-center p-3 select-none">
      {/* Milled metal panel header banner */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#A89CB8] uppercase z-10 pointer-events-none">
        <span className="flex items-center gap-1.5 font-bold">
          <span
            className={`w-2 h-2 rounded-full border border-black ${
              isPlaying && !isPaused ? "bg-[#7CE38B] shadow-[0_0_8px_#7CE38B]" : "bg-[#FF5CAA]"
            }`}
          />
          TURNTABLE SIM // 33⅓ RPM
        </span>
        <span className="text-[#FFB020] font-bold">DIRECT DRIVE</span>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-48 h-48 rounded-full border-4 border-black bg-[#1A1624] animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#FFB020] border-2 border-black" />
              </div>
              <span className="text-xs font-mono text-[#DDD4EC]">Spinning up 3D deck...</span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 4.8, 3.2], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[4, 8, 4]} intensity={2.0} castShadow />
            <pointLight position={[-4, 3, -2]} intensity={0.8} color="#FFB020" />
            <DiscMesh isPlaying={isPlaying} isPaused={isPaused} />
          </Canvas>
        </Suspense>
      </div>

      {/* Fallback artwork / label preview sticker */}
      {artworkUrl && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#0E0919]/90 backdrop-blur-md border-[2px] border-black p-2.5 rounded-xl flex items-center gap-3 z-10 shadow-[3px_3px_0px_#000000]">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-black shrink-0 relative bg-black">
            <Image
              src={artworkUrl}
              alt={trackTitle}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate font-[family-name:var(--font-fredoka)]">
              {trackTitle}
            </p>
            <p className="text-[11px] text-[#A89CB8] truncate font-mono">
              {artistName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
