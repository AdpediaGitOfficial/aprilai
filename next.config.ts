import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep server-only AI SDK packages out of the client bundle.
  serverExternalPackages: ["@ai-sdk/anthropic", "@ai-sdk/openai"],
};

export default nextConfig;
