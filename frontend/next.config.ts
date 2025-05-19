import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_PATH: "http://localhost/api/",
  },
  images: {
    domains: ['www.youtube.com'],
  },
};

export default nextConfig;
