import type { NextConfig } from "next";

const nextConfig = {
    reactStrictMode: true,
    env: {
      
      DVLA_API_KEY: process.env.DVLA_API_KEY,
      DVLA_API_URL:process.env.DVLA_API_URL,
      MOT_CLIENT_ID: process.env.MOT_CLIENT_ID,
      MOT_CLIENT_SECRET: process.env.MOT_CLIENT_SECRET,
      MOT_API_KEY: process.env.MOT_API_KEY,
      MOT_TOKEN_URL: process.env.MOT_TOKEN_URL,
      MOT_SCOPE_URL:process.env.MOT_SCOPE_URL,
      
    },
  }
export default nextConfig;
