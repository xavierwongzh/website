import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // The ASCII tank started life as /aquarium before it was renamed The Pond.
  async redirects() {
    return [{ source: "/aquarium", destination: "/pond", permanent: true }];
  },
};

export default nextConfig;


