import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["maps.googleapis.com", "lh3.googleusercontent.com", "maps.gstatic.com"],
    },
};

export default nextConfig;
