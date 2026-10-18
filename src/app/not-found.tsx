import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0919] text-white flex flex-col justify-between">
      <Navbar />

      <main className="py-24 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#181026] border-[3px] border-[#000000] shadow-[8px_8px_0px_#000000] rounded-3xl p-8 sm:p-10">
          <div className="inline-block px-3 py-1 bg-[#FF5CAA] border-[2px] border-[#000000] rounded-lg text-xs font-black text-white mb-4">
            Error 404
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-[family-name:var(--font-fredoka)]">
            Page not found.
          </h1>
          <p className="mt-4 text-sm text-[#DDD4EC] font-medium leading-relaxed">
            This route does not exist or may have been moved.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="brutal-btn px-6 py-3 bg-[#7C3AED] text-white rounded-xl text-sm font-extrabold hover:bg-[#6D28D9]"
            >
              Return to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
