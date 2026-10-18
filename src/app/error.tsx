"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error safely on client without leaking secrets
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0E0919] text-white flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-[#181026] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-8 sm:p-10">
        <div className="inline-block px-3 py-1 bg-[#FF5CAA] border-[2px] border-[#000000] rounded-lg text-xs font-black text-white mb-4">
          Application error
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-[family-name:var(--font-fredoka)]">
          Something went wrong.
        </h1>
        <p className="mt-4 text-sm text-[#DDD4EC] font-medium leading-relaxed">
          An unexpected error occurred while loading this view. You can retry or return to the main home page.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="brutal-btn w-full sm:w-auto px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="brutal-btn w-full sm:w-auto px-5 py-2.5 bg-[#221636] text-white rounded-xl text-xs font-bold hover:bg-[#2A1B44]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
