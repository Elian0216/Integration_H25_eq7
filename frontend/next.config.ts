import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_PATH: "http://localhost:8000/",
  },
  images: {
    domains: ['www.youtube.com'],
  },
};

export default nextConfig;
