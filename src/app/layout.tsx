import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

// Two families, four files: Sans 400/600, Serif 500 and 500 italic (display headlines only).
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex-sans", display: "swap" });
const serif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["500"], style: ["normal", "italic"], variable: "--font-plex-serif", display: "swap" });

export const metadata: Metadata = {
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
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
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
