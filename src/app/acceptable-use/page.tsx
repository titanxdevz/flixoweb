import React from "react";
import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — Flixo",
  description: "Guidelines and rate limits governing acceptable use of Flixo audio commands and web endpoints.",
};

const toc = [
  { id: "purpose", title: "1. Purpose & scope" },
  { id: "rate-limits", title: "2. Technical rate limits" },
  { id: "prohibited-content", title: "3. Prohibited audio & behavior" },
  { id: "voice-etiquette", title: "4. Voice channel etiquette" },
  { id: "enforcement", title: "5. Violations & enforcement" },
  { id: "contact", title: "6. Reporting abuse" },
];

export default function AcceptableUsePage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      lastUpdated="October 18, 2026"
      toc={toc}
    >
      <section id="purpose" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          1. Purpose &amp; scope
        </h2>
        <p>
          This Acceptable Use Policy defines permitted and prohibited uses of the Flixo Discord bot, voice channels, and web dashboard. Our goal is to ensure stable, low-latency audio for all connected communities.
        </p>
      </section>

      <section id="rate-limits" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          2. Technical rate limits
        </h2>
        <p>
          To prevent resource exhaustion across our Lavalink and Discord clusters, traffic is strictly throttled:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Global IP Requests:</strong> Maximum 120 requests per minute per IP address.</li>
          <li><strong>Guild Player Mutations:</strong> Maximum 45 player control actions (pause, skip, filter set) per 10 seconds.</li>
          <li><strong>Track Search Queries:</strong> Maximum 30 search queries per 10 seconds.</li>
          <li><strong>WebSocket Events:</strong> Maximum 15 real-time socket actions per 10 seconds per client.</li>
        </ul>
        <p className="mt-2">
          Automated scripts or clients exceeding these thresholds receive HTTP 429 Too Many Requests responses and may face temporary or permanent IP bans.
        </p>
      </section>

      <section id="prohibited-content" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          3. Prohibited audio &amp; behavior
        </h2>
        <p>
          You agree not to use Flixo to stream or distribute:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Audio deliberately engineered to cause hearing damage or hardware clipping (e.g. ear-rape tracks, high-gain sine loops).</li>
          <li>Audio containing hate speech, violent extremism, or content that violates Discord Terms of Service.</li>
          <li>Malicious HTTP streams designed to exploit audio buffer decoders or cause denial of service.</li>
        </ul>
      </section>

      <section id="voice-etiquette" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          4. Voice channel etiquette
        </h2>
        <p>
          Guild managers have full authority to restrict bot usage within their server via <code>/admin ignore</code> or configure designated DJ roles. Users are expected to respect channel rules established by server moderators.
        </p>
      </section>

      <section id="enforcement" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          5. Violations &amp; enforcement
        </h2>
        <p>
          If a user or guild violates this policy, Ansh Singh reserves the right to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Temporarily rate-limit the offending client or IP.</li>
          <li>Add the user or guild ID to our global blacklist database (<code>/blacklist</code>).</li>
          <li>Terminate active playback sessions and disconnect the bot from the offending server.</li>
        </ul>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          6. Reporting abuse
        </h2>
        <p>
          To report abusive behavior or policy violations, please email anshthedev59@gmail.com with server IDs and timestamps, or submit a report in our support server at https://discord.gg/uhXSf4qCm.
        </p>
      </section>
    </LegalLayout>
  );
}
