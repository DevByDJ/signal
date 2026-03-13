import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverSourceMaps: true,
  },
  turbopack: {
    // Explicitly pin the workspace root to this project directory.
    // Required because /Volumes/Danny-SSD/Github/ contains a yarn.lock and
    // node_modules from other projects, which confuses Turbopack's root detection.
    root: process.cwd(),
  },
};

export default nextConfig;
