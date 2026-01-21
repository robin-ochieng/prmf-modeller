import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to use webpack (more stable with framer-motion)
  // This is controlled by the CLI in Next.js 16
  
  // Optimize for memory
  experimental: {
    // Reduce memory usage during development
  },

  // Transpile framer-motion to fix potential issues
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
