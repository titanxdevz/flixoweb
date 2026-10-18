import React from "react";
import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — Flixo",
  description: "Terms and conditions regarding cancellations and refunds for Flixo Premium supporter subscriptions.",
};

const toc = [
  { id: "overview", title: "1. Policy overview" },
  { id: "eligibility", title: "2. Refund eligibility" },
  { id: "cancellations", title: "3. Subscription cancellation" },
  { id: "exceptions", title: "4. Non-refundable situations" },
  { id: "how-to-request", title: "5. How to submit a refund request" },
];

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      lastUpdated="October 18, 2026"
      toc={toc}
    >
      <section id="overview" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          1. Policy overview
        </h2>
        <p>
          Flixo provides core music playback features (including 384kbps lossless sound, all 14 DSP filters, and unlimited queue sizes) completely free of charge. Optional Premium Supporter subscriptions are offered to support cluster infrastructure costs and provide personalization perks.
        </p>
      </section>

      <section id="eligibility" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          2. Refund eligibility
        </h2>
        <p>
          We want you to be completely satisfied with your supporter perks. You are eligible for a full refund if:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>You request a refund within <strong>7 days</strong> of your initial subscription purchase.</li>
          <li>A technical error resulted in duplicate billing charges.</li>
          <li>Severe infrastructure outages prevented premium perks from functioning for more than 72 consecutive hours.</li>
        </ul>
      </section>

      <section id="cancellations" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          3. Subscription cancellation
        </h2>
        <p>
          You may cancel your recurring subscription at any time through your payment dashboard or billing link. When canceled, your supporter perks will remain active until the end of your current billing period (<code>premiumUntil</code>), after which no further charges will occur.
        </p>
      </section>

      <section id="exceptions" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          4. Non-refundable situations
        </h2>
        <p>
          Refunds are not granted in cases where:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>More than 7 days have elapsed since the billing date.</li>
          <li>A user or server has been banned from the bot or blacklisted for violating our Acceptable Use Policy or Discord Community Guidelines.</li>
          <li>The refund request is for renewals where the user forgot to cancel before the renewal billing cycle.</li>
        </ul>
      </section>

      <section id="how-to-request" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-fredoka)]">
          5. How to submit a refund request
        </h2>
        <p>
          To request a refund, please send an email to anshthedev59@gmail.com with the following details:
        </p>
        <div className="p-4 bg-[#181026] border border-[#000000] rounded-xl font-mono text-xs mt-2 text-[#DDD4EC] space-y-1">
          <div>Subject: Flixo Premium Refund Request</div>
          <div>Discord User ID (Snowflake): [YOUR_USER_ID]</div>
          <div>Discord Server ID (if applicable): [YOUR_SERVER_ID]</div>
          <div>Payment Receipt / Transaction ID: [TRANSACTION_ID]</div>
          <div>Reason for request: [REASON]</div>
        </div>
        <p className="mt-3">
          Our billing team in India processes eligible refund requests within 3 to 5 business days back to the original payment method.
        </p>
      </section>
    </LegalLayout>
  );
}
