import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.APP_BASE_PATH ?? "",
  experimental: { agentUpgrade: "security" },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons" }],
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
