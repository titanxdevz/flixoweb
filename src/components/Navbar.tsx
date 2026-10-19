"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { api } from "@/lib/dashboard-api";
import { Headphones, LogIn } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; avatar: string | null } | null>(null);

  useEffect(() => {
    api.getCurrentUser()
      .then((user) => {
        if (user && user.id) {
          setCurrentUser({ username: user.username, avatar: user.avatar });
        }
      })
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0E0919]/95 border-b-[3px] border-[#000000] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-[3px] focus-visible:outline-[#FF5CAA] focus-visible:outline-offset-2"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border-[3px] border-[#000000] shadow-[3px_3px_0px_#000000] shrink-0">
            <Image
              src="/flixo-avatar.png"
              alt="Flixo bot logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white font-[family-name:var(--font-fredoka)]">
            Flixo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-bold text-[#DDD4EC]"
        >
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#FF5CAA] transition-colors focus-visible:outline-[3px] focus-visible:outline-[#FF5CAA]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Chunky Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <Link
              href="/dashboard"
              className="brutal-btn px-3 py-1.5 bg-[#1B1526] hover:bg-[#251D33] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2"
              title="Open your audio dashboard"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-black relative shrink-0 bg-black">
                {currentUser.avatar ? (
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] bg-[#3B1E54] text-white">
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="truncate max-w-[110px]">{currentUser.username}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="brutal-btn px-3.5 py-2 bg-[#20182C] hover:bg-[#2C213D] text-[#DDD4EC] hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          <Link
            href="/dashboard"
            className="brutal-btn px-4 py-2 bg-[#FFB020] text-black rounded-xl text-xs font-mono font-bold hover:bg-[#F59E0B] flex items-center gap-1.5"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Web Player</span>
          </Link>
          <a
            href={siteConfig.discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9]"
          >
            Add to Discord
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 bg-[#1E1332] border-[3px] border-[#000000] shadow-[3px_3px_0px_#000000] rounded-xl text-white"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden px-4 pt-3 pb-5 border-t-[3px] border-[#000000] bg-[#0E0919] flex flex-col gap-3 font-bold text-sm text-[#DDD4EC]"
        >
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t-[2px] border-[#000000] flex flex-col gap-2">
            {currentUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="brutal-btn py-2.5 bg-[#1F172C] text-white rounded-xl text-xs font-mono font-bold text-center flex items-center justify-center gap-2"
              >
                <span>Logged in as {currentUser.username}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="brutal-btn py-2.5 bg-[#20182C] text-[#DDD4EC] rounded-xl text-xs font-mono font-bold text-center flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Discord</span>
              </Link>
            )}
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="brutal-btn py-2.5 bg-[#FFB020] text-black rounded-xl text-xs font-mono font-bold text-center flex items-center justify-center gap-2"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Launch Web Player</span>
            </Link>
            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold text-center"
            >
              Add to Discord
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
