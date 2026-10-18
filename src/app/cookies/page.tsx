import React from "react";
import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Flixo",
  description: "Information regarding session cookies and local storage used by the Flixo web dashboard.",
};

const toc = [
  { id: "what-are-cookies", title: "1. What are cookies" },
  { id: "cookies-used", title: "2. Cookies used by Flixo" },
  { id: "third-party-cookies", title: "3. Third-party cookies" },
  { id: "managing-cookies", title: "4. Managing your cookies" },
  { id: "contact", title: "5. Contact us" },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="October 18, 2026"
      toc={toc}
    >
      <section id="what-are-cookies" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          1. What are cookies
        </h2>
        <p>
          Cookies are small text strings stored on your device by your web browser when you visit a site. They allow websites to remember your authenticated session and security tokens.
        </p>
      </section>

      <section id="cookies-used" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          2. Cookies used by Flixo
        </h2>
        <p>
          Flixo uses only strictly necessary operational cookies. We do not use advertising, marketing, or behavioral tracking cookies:
        </p>

        <div className="overflow-x-auto rounded-xl border border-[#000000] bg-[#120B1E] mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1E1332] text-white border-b border-[#000000]">
                <th className="py-2.5 px-3.5 font-bold">Cookie Name</th>
                <th className="py-2.5 px-3.5 font-bold">Purpose</th>
                <th className="py-2.5 px-3.5 font-bold">Duration</th>
                <th className="py-2.5 px-3.5 font-bold">Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1028] font-mono">
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#FF5CAA]">flixo.sid</td>
                <td className="py-2.5 px-3.5 font-sans">Stores authenticated user session for Discord dashboard operations</td>
                <td className="py-2.5 px-3.5 font-sans">Session / 7 days</td>
                <td className="py-2.5 px-3.5 text-[#10B981]">HttpOnly, Secure, SameSite</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-bold text-[#C4B5FD]">x-csrf-token</td>
                <td className="py-2.5 px-3.5 font-sans">Protects against Cross-Site Request Forgery on player control requests</td>
                <td className="py-2.5 px-3.5 font-sans">Session</td>
                <td className="py-2.5 px-3.5 text-[#10B981]">Strict Header / Token</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="third-party-cookies" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          3. Third-party cookies
        </h2>
        <p>
          When you click &quot;Login with Discord&quot; or connect your Spotify account, Discord Inc. or Spotify AB may set their own essential authentication cookies on their respective domains. Flixo has no access to or control over third-party cookies.
        </p>
      </section>

      <section id="managing-cookies" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          4. Managing your cookies
        </h2>
        <p>
          You can block or delete cookies through your browser settings. However, disabling the strictly necessary <code>flixo.sid</code> cookie will prevent you from logging into the web dashboard.
        </p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          5. Contact us
        </h2>
        <p>
          If you have questions about our cookie usage, email anshthedev59@gmail.com or visit our support server at https://discord.gg/uhXSf4qCm.
        </p>
      </section>
    </LegalLayout>
  );
}
