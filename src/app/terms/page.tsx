import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { config } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the Kaimbrya marketing website.",
};

const mail = <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>;

export default function TermsPage() {
  return (
    <DocPage eyebrow="Legal" title="Terms of use" updated="15 October 2026"
      lead="These terms apply when you use this website. Please read them before using it.">
      <div className="prose">
        <h2>About these terms</h2>
        <p>
          This website is operated by Kaimbrya (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using it, you agree to these terms. They cover the
          website only. Use of the Kaimbrya application is governed by a separate agreement with each community.
        </p>

        <h2>Information on this website</h2>
        <p>
          We describe Kaimbrya as accurately as we can, but features and details can change, and the website is provided for general
          information. Screenshots of the application show fictional people, homes and figures for demonstration purposes only.
          Nothing on this website is an offer or a contract. What a community receives is set out in its own agreement with us.
        </p>

        <h2>Demo requests</h2>
        <p>
          Requesting a demonstration doesn&apos;t commit you or us to anything. Please give accurate details, and only submit
          information about yourself or with permission. Our <a href="/privacy/">privacy policy</a> explains how we handle it.
        </p>

        <h2>Acceptable use</h2>
        <p>Please don&apos;t:</p>
        <ul>
          <li>use the website for anything unlawful, misleading or harmful</li>
          <li>send spam or automated submissions through our forms</li>
          <li>try to disrupt the website, probe it for weaknesses or access it in ways it isn&apos;t designed for</li>
          <li>copy the website or its content to present it as your own</li>
        </ul>

        <h2>Our content</h2>
        <p>
          The Kaimbrya name and logo, the website&apos;s text, illustrations and design, and the application screenshots belong to
          Kaimbrya. You&apos;re welcome to share links to the website and to quote it with credit for personal or evaluation purposes,
          but please ask us before reusing our content in any other way.
        </p>

        <h2>Links to other websites</h2>
        <p>Where we link to other websites, we aren&apos;t responsible for their content or how they handle your information.</p>

        <h2>Availability and liability</h2>
        <p>
          We work to keep the website available and accurate, but we can&apos;t promise it will always be uninterrupted or error-free.
          To the extent the law allows, we aren&apos;t liable for losses arising from your use of the website or from relying on its
          general information. Nothing in these terms limits rights you have that can&apos;t be limited by law.
        </p>

        <h2>Changes to these terms</h2>
        <p>We may update these terms. The current version is always published here, with the date at the top of the page.</p>

        <h2>Contact</h2>
        <p>Questions about these terms? Email {mail}.</p>
      </div>
    </DocPage>
  );
}
