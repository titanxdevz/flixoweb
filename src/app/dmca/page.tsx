import React from "react";
import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy — Flixo",
  description: "Digital Millennium Copyright Act compliance, notice procedures, and takedown guidelines for Flixo.",
};

const toc = [
  { id: "notice", title: "1. DMCA compliance notice" },
  { id: "transient-audio", title: "2. Transient streaming architecture" },
  { id: "filing-takedown", title: "3. How to file a takedown notice" },
  { id: "counter-notice", title: "4. Counter-notification process" },
  { id: "repeat-infringers", title: "5. Repeat infringer policy" },
  { id: "designated-agent", title: "6. Designated copyright agent" },
];

export default function DmcaPage() {
  return (
    <LegalLayout
      title="DMCA & Copyright Policy"
      lastUpdated="October 18, 2026"
      toc={toc}
    >
      <section id="notice" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          1. DMCA compliance notice
        </h2>
        <p>
          Ansh Singh respects the intellectual property rights of artists, publishers, and copyright owners. We comply with the provisions of the Digital Millennium Copyright Act (17 U.S.C. § 512) and applicable international copyright laws.
        </p>
      </section>

      <section id="transient-audio" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          2. Transient streaming architecture
        </h2>
        <p>
          Flixo does not host, upload, re-publish, or store media files on its servers. When a Discord user submits a link or search query, Flixo acts strictly as a real-time, transient relay conduit. Audio packets are decoded dynamically through Lavalink memory buffers directly into Discord voice RTP sockets and are discarded immediately upon transmission.
        </p>
      </section>

      <section id="filing-takedown" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          3. How to file a takedown notice
        </h2>
        <p>
          If you are a copyright owner or authorized representative and believe content streamed via Flixo infringes upon your copyright, please provide a written notice containing:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>A physical or electronic signature of the authorized copyright owner.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the specific URL, track title, or source link that you request to be blocked.</li>
          <li>Your contact information (name, address, and email).</li>
          <li>A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement under penalty of perjury that the information in your notice is accurate and that you are authorized to act on behalf of the owner.</li>
        </ul>
      </section>

      <section id="counter-notice" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          4. Counter-notification process
        </h2>
        <p>
          If content was blocked due to mistaken identification or fair use, the affected user may submit a formal counter-notification under 17 U.S.C. § 512(g)(3) to our designated agent.
        </p>
      </section>

      <section id="repeat-infringers" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          5. Repeat infringer policy
        </h2>
        <p>
          In accordance with the DMCA, Flixo maintains a strict repeat infringer policy. Users or Discord servers that repeatedly attempt to stream unauthorized or infringing material after notice will have their Discord IDs permanently blacklisted from all bot services.
        </p>
      </section>

      <section id="designated-agent" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          6. Designated copyright agent
        </h2>
        <p>
          Please send all notices to our Designated Copyright Agent:
        </p>
        <div className="p-4 bg-[#181026] border border-[#000000] rounded-xl font-mono text-xs mt-2 text-[#DDD4EC] space-y-1">
          <div>Designated Agent: Ansh Singh</div>
          <div>Mailing Address: Gorakhpur, Uttar Pradesh 273004, India</div>
          <div>Email: anshthedev59@gmail.com</div>
          <div>Country: India</div>
        </div>
      </section>
    </LegalLayout>
  );
}
