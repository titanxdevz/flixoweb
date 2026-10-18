import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface TocItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  lastUpdated,
  toc,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0E0919] text-white">
      <Navbar />

      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10 pb-8 border-b-[3px] border-[#000000]">
            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#FF5CAA] hover:underline mb-4"
            >
              ← Back to home
            </Link>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-xs text-[#A692C6] font-mono">
              Last updated: {lastUpdated} • Reference document
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Table of contents sidebar */}
            <aside className="md:col-span-4 bg-[#181026] border-[3px] border-[#000000] shadow-[5px_5px_0px_#000000] rounded-2xl p-5 sticky top-24">
              <div className="text-xs font-black uppercase tracking-wider text-[#FF5CAA] mb-3">
                Table of contents
              </div>
              <nav aria-label="Table of contents">
                <ul className="space-y-2 text-xs font-medium text-[#DDD4EC]">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="hover:text-white transition-colors block py-0.5"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main content body */}
            <article className="md:col-span-8 prose prose-invert max-w-none text-xs sm:text-sm text-[#DDD4EC] leading-relaxed space-y-6">
              {children}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
