"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/dashboard-api";
import { siteConfig } from "@/config/site";
import {
  LogIn,
  Sliders,
  ShieldCheck,
  Disc,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorParam = searchParams.get("error");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await api.getCurrentUser();
        if (user && user.id) {
          router.push("/dashboard");
          return;
        }
      } catch {
        // Not logged in
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0E0919] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Disc className="w-12 h-12 text-[#FFB020] animate-spin" />
          <p className="text-sm font-mono text-[#DDD4EC]">Checking active session...</p>
        </div>
      </div>
    );
  }

  const oauthUrl = api.getDiscordOAuthUrl();

  return (
    <div className="min-h-screen bg-[#0E0919] text-white pt-24 pb-20 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Error Alert if redirected from failed OAuth */}
        {errorParam && (
          <div className="p-4 bg-[#3A1422] border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_#000000] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF5CAA] shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <p className="font-bold text-white uppercase">Authentication Error</p>
              <p className="text-[#DDD4EC] mt-0.5">
                {errorParam === "oauth"
                  ? "Discord authorization was rejected or timed out. Please try logging in again."
                  : "Session expired or access denied. Please re-authenticate with Discord."}
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-[#15111E] border-[3px] border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000] flex flex-col items-center text-center">
          {/* Mascot Logo Icon */}
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_#000000] bg-white shrink-0 relative mb-5">
            <Image
              src="/flixo-avatar.png"
              alt="Flixo Mascot"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title */}
          <div className="inline-block px-3 py-1 bg-[#221636] border-2 border-black rounded-lg text-xs font-mono font-bold text-[#FF5CAA] mb-3">
            DISCORD MUSIC WEB PLAYER
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-fredoka)]">
            Sign In with Discord
          </h1>

          <p className="text-xs sm:text-sm text-[#DDD4EC] font-mono mt-3 max-w-md leading-relaxed">
            Connect your Discord account to see your mutual servers, control lossless 384kbps audio playback, manage the live queue, and toggle 14 DSP audio filters.
          </p>

          {/* Key Features Pill Matrix */}
          <div className="w-full grid grid-cols-2 gap-2.5 my-6 text-left">
            <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FFB020] shrink-0" />
              <span className="text-[11px] font-mono text-[#DDD4EC]">Realtime Mixing Console</span>
            </div>
            <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
              <Disc className="w-4 h-4 text-[#7CE38B] shrink-0" />
              <span className="text-[11px] font-mono text-[#DDD4EC]">12 Audio Search Providers</span>
            </div>
            <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5CAA] shrink-0" />
              <span className="text-[11px] font-mono text-[#DDD4EC]">DJ & Manager Permissions</span>
            </div>
            <div className="bg-[#0E0C12] p-2.5 rounded-xl border-2 border-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span className="text-[11px] font-mono text-[#DDD4EC]">24/7 Voice Channel Stay</span>
            </div>
          </div>

          {/* Discord Login CTA Button */}
          <div className="w-full space-y-3">
            <a
              href={oauthUrl}
              className="brutal-btn w-full py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_#000000]"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue with Discord</span>
            </a>

            {/* Studio Demo preview */}
            <Link
              href="/dashboard?demo=true"
              className="brutal-btn w-full py-3 bg-[#20182C] hover:bg-[#2B213C] text-[#DDD4EC] hover:text-white rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 border-2 border-black"
            >
              <span>Explore in Studio Demo Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-[10px] font-mono text-[#8E849E] mt-6">
            We only request your Discord user ID and mutual servers to verify DJ / manage permissions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E0919] flex items-center justify-center">
          <Disc className="w-12 h-12 text-[#FFB020] animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
