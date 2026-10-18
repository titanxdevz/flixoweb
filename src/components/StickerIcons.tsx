import React from "react";

export function CatPawSticker({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 bg-[#FF5CAA] border-[3px] border-[#1E0B3A] rounded-2xl shadow-[4px_4px_0px_#1E0B3A] text-white select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="#1E0B3A"
        strokeWidth="1.5"
      >
        <ellipse cx="8.5" cy="5" rx="2" ry="2.8" />
        <ellipse cx="15.5" cy="5" rx="2" ry="2.8" />
        <ellipse cx="4.5" cy="9.5" rx="1.8" ry="2.5" />
        <ellipse cx="19.5" cy="9.5" rx="1.8" ry="2.5" />
        <path d="M7 14c-1.5 2-1 5.5 1.5 6.5s7 0 8.5-2c1-1.5 0.5-4.5-1.5-5.5s-6-1-8.5 1z" />
      </svg>
    </div>
  );
}

export function HeadphonesSticker({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 bg-[#7C3AED] border-[3px] border-[#1E0B3A] rounded-2xl shadow-[4px_4px_0px_#1E0B3A] text-white select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
      </svg>
    </div>
  );
}

export function MusicNoteSticker({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 bg-[#FFFFFF] border-[3px] border-[#1E0B3A] rounded-2xl shadow-[4px_4px_0px_#1E0B3A] text-[#1E0B3A] select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="#1E0B3A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </div>
  );
}

export function StarSticker({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center p-2 bg-[#FF5CAA] border-[3px] border-[#1E0B3A] rounded-xl shadow-[3px_3px_0px_#1E0B3A] text-white select-none ${className}`}
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
      </svg>
    </div>
  );
}
