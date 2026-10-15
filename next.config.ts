import type { NextConfig } from "next";

// The marketing site is fully static: every page is pre-rendered to HTML at build
// time, so it is fast, indexable and holds no app data or sessions.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true }, // screens are pre-optimised by scripts/build-images.mjs
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
