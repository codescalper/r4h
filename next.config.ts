import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundles everything into .next/standalone — required for IIS/iisnode deployment.
  // After build: copy .next/standalone + .next/static + public to the server.
  output: "standalone",
   allowedDevOrigins: ['192.168.29.223']
};

export default nextConfig;
