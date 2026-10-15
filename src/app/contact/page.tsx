import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/DocPage";
import { ArrowRight } from "@/components/icons";
import { config } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kaimbrya by email, or book a demonstration for your community.",
};

export default function ContactPage() {
  return (
    <DocPage eyebrow="Contact" title="Talk to the Kaimbrya team." lead="Whether you're on a board, manage properties or are planning a new development, we'd be glad to hear from you.">
      <div className="contact-grid">
        <div className="contact-card">
          <h2>Email us</h2>
          <p>For questions about Kaimbrya, partnerships or anything else, write to us and we&apos;ll reply by email.</p>
          <a className="contact-email" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
        </div>
        <div className="contact-card">
          <h2>Book a demo</h2>
          <p>Tell us about your community and we&apos;ll arrange a walkthrough of the parts that matter most to you.</p>
          <Link prefetch={false} href="/demo/" className="btn btn-primary">Book a demo <ArrowRight /></Link>
        </div>
      </div>
    </DocPage>
  );
}
