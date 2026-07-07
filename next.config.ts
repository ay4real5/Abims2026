import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // honour the high-quality photos (next/image caps to this list; default is [75])
    qualities: [75, 90, 95, 100],
  },
};

export default nextConfig;
