import type { NextConfig } from "next";

const BOT_API_URL = process.env.INTERNAL_BOT_API_URL || "http://flixo.vexanode.gg:6776";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${BOT_API_URL}/auth/:path*`,
      },
      {
        source: "/api/guild/:path*",
        destination: `${BOT_API_URL}/api/guild/:path*`,
      },
      {
        source: "/api/admin/:path*",
        destination: `${BOT_API_URL}/api/admin/:path*`,
      },
      {
        source: "/dash",
        destination: "/dashboard",
      },
      {
        source: "/dash/:path*",
        destination: "/dashboard/:path*",
      },
    ];
  },
};

export default nextConfig;
