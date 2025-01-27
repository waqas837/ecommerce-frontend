import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        // hostname: "vidmate.drawsketch.co",
        hostname: "localhost",
        port:"1000"
      },
    ],
  },
};

const withPWA = nextPWA({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in
  skipWaiting: true, // Skip waiting for service worker activation
});

export default withPWA(nextConfig);
// export default nextConfig;
