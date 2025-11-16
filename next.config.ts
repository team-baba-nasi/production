import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
        domains: ["maps.googleapis.com", "lh3.googleusercontent.com", "maps.gstatic.com"],
    },
};

export default nextConfig;
