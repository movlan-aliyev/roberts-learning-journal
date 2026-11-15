import type { NextConfig } from "next";

// Static export only when building for GitHub Pages (CI sets NEXT_PUBLIC_BASE_PATH).
// Local `next dev` stays dynamic so lesson UUIDs and editor routes work freely.
const isStaticExport = process.env.GITHUB_PAGES === "1" || !!process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
