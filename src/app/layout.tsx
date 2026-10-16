import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

// Two families, four files: Sans 400/600, Serif 500 and 500 italic (display headlines only).
// IBM Plex, Latin subset, self-hosted from Fontsource 5.3.0 (SIL Open Font License, fonts/OFL.txt),
// so the build never fetches from Google Fonts (its responses broke Netlify builds in October 2026).
const plexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexSerif = localFont({
  src: [
    { path: "./fonts/ibm-plex-serif-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-serif-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-plex-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// Netlify sets URL to the site's primary address at build time, so a custom domain
// is picked up automatically; NEXT_PUBLIC_SITE_URL overrides it elsewhere.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "https://kaimbrya.netlify.app";
const shareDescription =
  "One connected platform for community finances, guest access, properties, maintenance and communication. Built for modern Jamaican communities.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Kaimbrya",
    locale: "en_JM",
    title: "Kaimbrya · Community management, reimagined",
    description: shareDescription,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Kaimbrya: community management, reimagined, with an illustrated gated community" }],
  },
  twitter: { card: "summary_large_image", title: "Kaimbrya · Community management, reimagined", description: shareDescription, images: ["/og.jpg"] },
  title: {
    default: "Kaimbrya · Community management software for Jamaica",
    template: "%s · Kaimbrya",
  },
  description:
    "One connected platform for community finances, guest access, properties, maintenance and communication. Built for modern Jamaican communities.",
  // Prototype: keep it out of search results until launch (remove at launch).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#123d4c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // public/enhance.js adds the "enhanced" class before it hides anything, so the
    // page stays fully visible if the script never runs.
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <script src="/enhance.js" defer />
      </body>
    </html>
  );
}
