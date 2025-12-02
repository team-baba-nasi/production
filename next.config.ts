import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = withPWA({
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
        domains: [
            "maps.googleapis.com",
            "lh3.googleusercontent.com",
            "maps.gstatic.com",
            "i.pravatar.cc",
        ],
    },
}) as NextConfig;

export default nextConfig;
