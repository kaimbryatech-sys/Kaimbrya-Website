import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { config } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How the Kaimbrya website collects and uses information, including demo requests.",
};

const mail = <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>;

export default function PrivacyPage() {
  return (
    <DocPage eyebrow="Legal" title="Privacy policy" updated="15 October 2026"
      lead="This policy explains what information the Kaimbrya marketing website collects, why, and what you can ask us to do with it.">
      <div className="prose">
        <p>
          This policy covers this website only. The Kaimbrya application that communities use has its own terms and privacy
          arrangements, agreed with each community.
        </p>

        <h2>Who we are</h2>
        <p>This website is operated by Kaimbrya (&ldquo;we&rdquo;, &ldquo;us&rdquo;). You can contact us about privacy at any time at {mail}.</p>

        <h2>Information you give us</h2>
        <p>When you request a demonstration, we collect the details you enter in the form:</p>
        <ul>
          <li>your name and email address</li>
          <li>the name of your community or organisation, and what best describes it</li>
          <li>the approximate number of homes</li>
          <li>your phone or WhatsApp number, if you choose to give it</li>
          <li>any message you write</li>
        </ul>
        <p>If you email us, we receive your email address and whatever your message contains.</p>

        <h2>How we use it</h2>
        <p>
          We use these details to reply to you, arrange and prepare your demonstration, and follow up about Kaimbrya. We don&apos;t
          sell your information, and we don&apos;t use it for advertising.
        </p>

        <h2>Services that process it for us</h2>
        <ul>
          <li><strong>Netlify</strong> hosts this website and receives and stores demo requests. Like most web hosts, it processes technical information such as your IP address to deliver pages and keep the service secure. Netlify also screens form submissions for spam.</li>
          <li><strong>Google (Gmail)</strong> provides the inbox where we receive demo-request notifications and emails.</li>
        </ul>
        <p>These providers may process information outside Jamaica, including in the United States.</p>

        <h2>Cookies and analytics</h2>
        <p>
          This website doesn&apos;t set cookies, and it doesn&apos;t use analytics, advertising or tracking tools. Our fonts are served
          from this website rather than from a third party. If that changes, we&apos;ll update this policy first.
        </p>

        <h2>How long we keep it</h2>
        <p>We keep demo requests and related emails only for as long as we need them to respond and follow up, and we delete them sooner if you ask.</p>

        <h2>Your choices</h2>
        <p>
          You can ask us to show you the information we hold about you, correct it, or delete it, and you can ask us to stop
          contacting you at any time. Email {mail} and we&apos;ll act on your request.
        </p>

        <h2>Children</h2>
        <p>This website is intended for adults managing or living in residential communities. We don&apos;t knowingly collect information from children.</p>

        <h2>Changes to this policy</h2>
        <p>If we change this policy, we&apos;ll publish the new version here and update the date at the top of the page.</p>
      </div>
    </DocPage>
  );
}
