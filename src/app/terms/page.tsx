import React from "react";
import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Flixo",
  description: "Terms and conditions governing the use of the Flixo Discord music bot and web dashboard.",
};

const toc = [
  { id: "acceptance", title: "1. Acceptance of terms" },
  { id: "services", title: "2. Description of service" },
  { id: "conduct", title: "3. User conduct & Discord compliance" },
  { id: "third-parties", title: "4. Third-party integrations" },
  { id: "intellectual-property", title: "5. Intellectual property" },
  { id: "disclaimers", title: "6. Disclaimers & liability" },
  { id: "contact", title: "7. Contact information" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="October 18, 2026"
      toc={toc}
    >
      <section id="acceptance" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          1. Acceptance of terms
        </h2>
        <p>
          By inviting Flixo to your Discord server, connecting to its voice channels, using slash commands, or accessing the web interface, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Ansh Singh (&quot;we&quot;, &quot;our&quot;, or &quot;Flixo&quot;).
        </p>
      </section>

      <section id="services" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          2. Description of service
        </h2>
        <p>
          Flixo provides high-fidelity audio playback, queue management, and digital signal processing (DSP) filters for Discord voice channels via Lavalink nodes. Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We reserve the right to modify, restart, or update audio clusters at any time for maintenance.
        </p>
      </section>

      <section id="conduct" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          3. User conduct &amp; Discord compliance
        </h2>
        <p>
          You agree to comply with Discord&apos;s Terms of Service and Community Guidelines. You agree not to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Automate spam requests or bypass rate limits (120 requests/minute per IP, 45 queue mutations per 10 seconds).</li>
          <li>Queue malicious, illegal, or harassing audio streams in public voice channels.</li>
          <li>Attempt to reverse-engineer, exploit, or disrupt bot clustering infrastructure or Discord voice sockets.</li>
        </ul>
      </section>

      <section id="third-parties" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          4. Third-party integrations
        </h2>
        <p>
          Flixo connects with third-party audio and data platforms, including Discord, Spotify, and Last.fm. We do not host, store, or own the copyrighted music streams decoded through our Lavalink nodes. All music playback adheres to the public playback terms of respective upstream providers.
        </p>
      </section>

      <section id="intellectual-property" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          5. Intellectual property
        </h2>
        <p>
          The Flixo name, mascot artwork, branding, bot software, and custom DSP filter implementations are the exclusive property of Ansh Singh. Discord, Spotify, and other trademarks belong to their respective owners.
        </p>
      </section>

      <section id="disclaimers" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          6. Disclaimers &amp; liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law in India, Ansh Singh shall not be liable for any direct, indirect, incidental, or consequential damages resulting from bot downtime, Discord API outages, or loss of access.
        </p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          7. Contact information
        </h2>
        <p>
          For inquiries regarding these terms, please contact us at:
        </p>
        <div className="p-4 bg-[#181026] border border-[#000000] rounded-xl font-mono text-xs mt-2 text-[#DDD4EC] space-y-1">
          <div>Developer: Ansh Singh</div>
          <div>Email: anshthedev59@gmail.com</div>
          <div>Location: Gorakhpur, Uttar Pradesh 273004, India</div>
          <div>Support Server: https://discord.gg/uhXSf4qCm</div>
        </div>
      </section>
    </LegalLayout>
  );
}
