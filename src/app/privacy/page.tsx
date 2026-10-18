import React from "react";
import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Flixo",
  description: "How Flixo collects, stores, and protects user data and Discord guild information.",
};

const toc = [
  { id: "data-collected", title: "1. Information we collect" },
  { id: "data-not-collected", title: "2. Information we never collect" },
  { id: "how-we-use", title: "3. How data is used" },
  { id: "third-parties", title: "4. Third-party data sharing" },
  { id: "retention", title: "5. Data retention & deletion" },
  { id: "security", title: "6. Security safeguards" },
  { id: "contact", title: "7. Privacy requests & contact" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="October 18, 2026"
      toc={toc}
    >
      <section id="data-collected" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          1. Information we collect
        </h2>
        <p>
          To provide Discord music playback, Flixo stores only the minimal operational data necessary:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Discord Identifiers:</strong> Your Discord user snowflake ID, username, and guild (server) IDs where the bot is installed.</li>
          <li><strong>Playlist &amp; Favorites:</strong> Track titles, source URIs, and custom playlist names created with <code>/playlist create</code> or <code>/favorite</code>.</li>
          <li><strong>Linked Accounts:</strong> OAuth2 access tokens for Spotify (stored encrypted) when using <code>/spotify login</code>, and your Last.fm username when using <code>/lastfm login</code>.</li>
          <li><strong>Server Settings:</strong> Custom server prefix, DJ role ID, 24/7 channel ID, and ignored channels.</li>
          <li><strong>Web Sessions:</strong> Encrypted session identifiers (<code>flixo.sid</code>) stored in our database for dashboard authentication.</li>
        </ul>
      </section>

      <section id="data-not-collected" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          2. Information we never collect
        </h2>
        <p>
          Flixo does not record, intercept, or save private voice channel conversations or audio streams. We do not read or log Discord message content outside of explicit commands directed at the bot. We do not collect real names, physical addresses, or financial payment details.
        </p>
      </section>

      <section id="how-we-use" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          3. How data is used
        </h2>
        <p>
          Collected identifiers are used solely to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Deliver requested audio playback to your voice channel.</li>
          <li>Enforce permissions (DJ roles, server management, voice channel listener presence).</li>
          <li>Sync scrobble data to Last.fm or stream playlists from Spotify upon user instruction.</li>
          <li>Enforce rate limits to protect infrastructure from DDoS attacks.</li>
        </ul>
      </section>

      <section id="third-parties" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          4. Third-party data sharing
        </h2>
        <p>
          Flixo integrates with the following services:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><strong>Discord Inc.:</strong> For gateway event handling and slash command interactions.</li>
          <li><strong>Lavalink Nodes:</strong> For audio stream decoding and DSP processing.</li>
          <li><strong>Spotify AB:</strong> For user playlist resolution if OAuth2 is linked.</li>
          <li><strong>Last.fm:</strong> For scrobble submissions if username is linked.</li>
        </ul>
        <p className="mt-2">
          We never sell, rent, or trade your data to third-party advertisers or brokers.
        </p>
      </section>

      <section id="retention" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          5. Data retention &amp; deletion
        </h2>
        <p>
          Server settings and playlist entries are retained until deleted by the user (using <code>/playlist delete</code>) or until the bot is removed from the server. You may request permanent deletion of all associated data at any time by contacting us.
        </p>
      </section>

      <section id="security" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          6. Security safeguards
        </h2>
        <p>
          Session cookies are signed with cryptographic secrets (SHA-256), marked <code>httpOnly</code> and <code>secure</code> in production, and protected with per-session CSRF tokens (<code>x-csrf-token</code>). Database connections are secured via TLS.
        </p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          7. Privacy requests &amp; contact
        </h2>
        <p>
          For privacy concerns or to request data removal under GDPR/CCPA regulations in India, contact:
        </p>
        <div className="p-4 bg-[#181026] border border-[#000000] rounded-xl font-mono text-xs mt-2 text-[#DDD4EC] space-y-1">
          <div>Data Controller: Ansh Singh</div>
          <div>Privacy Contact: anshthedev59@gmail.com</div>
          <div>Location: Gorakhpur, Uttar Pradesh 273004, India</div>
          <div>Support Server: https://discord.gg/uhXSf4qCm</div>
        </div>
      </section>
    </LegalLayout>
  );
}
