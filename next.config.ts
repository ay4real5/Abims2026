import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores unrelated lockfiles elsewhere.
  turbopack: {
    root: path.join(__dirname),
  },
  // Allow the local browser-preview proxy (127.0.0.1) to load dev resources.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
